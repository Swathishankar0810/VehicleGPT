import { HistoricalRecord, VehicleEvent } from '../types/vehicle';

// Seeded Pseudo-Random Number Generator (LCG) for deterministic reproducibility
function createSeededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateDeterministicHistoricalData(): {
  records: HistoricalRecord[];
  events: VehicleEvent[];
} {
  const rand = createSeededRandom(4092);
  const records: HistoricalRecord[] = [];
  const events: VehicleEvent[] = [];

  const now = new Date('2026-11-01T12:00:00Z').getTime();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const TOTAL_DAYS = 35; // 5 weeks of history

  let baseRange = 340;

  for (let dayOffset = TOTAL_DAYS; dayOffset >= 0; dayOffset--) {
    const dayTimestamp = now - dayOffset * ONE_DAY_MS;
    const dateObj = new Date(dayTimestamp);
    const dateStr = dateObj.toISOString().split('T')[0];

    // Days in recent 1-14 days have higher city driving and higher HVAC usage
    const isRecentPeriod = dayOffset <= 14;

    // 2 to 3 sessions per day
    const sessionsToday = Math.floor(rand() * 2) + 2;

    for (let sessionIdx = 0; sessionIdx < sessionsToday; sessionIdx++) {
      const sessionHour = 8 + sessionIdx * 5 + Math.floor(rand() * 2);
      const sessionTime = new Date(dayTimestamp);
      sessionTime.setUTCHours(sessionHour, Math.floor(rand() * 59));
      
      const sessionRand = rand();
      let locationCategory: 'City' | 'Highway' | 'Mixed' = 'Mixed';
      let drivingMode: 'ECO' | 'COMFORT' | 'SPORT' = 'COMFORT';

      if (isRecentPeriod) {
        // Recent 2 weeks: 61% city trips, cooler weather, more HVAC
        locationCategory = sessionRand < 0.61 ? 'City' : sessionRand < 0.85 ? 'Mixed' : 'Highway';
      } else {
        // Earlier 3 weeks: 42% city trips, more highway trips
        locationCategory = sessionRand < 0.42 ? 'City' : sessionRand < 0.75 ? 'Mixed' : 'Highway';
      }

      if (locationCategory === 'Highway') {
        drivingMode = sessionRand > 0.6 ? 'SPORT' : 'COMFORT';
      } else if (locationCategory === 'City') {
        drivingMode = sessionRand > 0.7 ? 'ECO' : 'COMFORT';
      }

      let distance = 0;
      let avgSpeed = 0;
      let energyConsumption = 0;
      let avgTemp = 0;
      let maxTemp = 0;
      let hvacUsage = 0;

      if (locationCategory === 'City') {
        distance = parseFloat((12 + rand() * 18).toFixed(1)); // 12-30 km
        avgSpeed = parseFloat((22 + rand() * 15).toFixed(1)); // 22-37 km/h
        hvacUsage = isRecentPeriod ? Math.floor(65 + rand() * 25) : Math.floor(40 + rand() * 20);
        // Base city energy + HVAC impact
        const hvacImpact = (hvacUsage / 100) * 2.8;
        energyConsumption = parseFloat((14.8 + rand() * 2.5 + hvacImpact).toFixed(1));
        avgTemp = parseFloat((31 + rand() * 5).toFixed(1));
        maxTemp = parseFloat((avgTemp + 3 + rand() * 4).toFixed(1));
      } else if (locationCategory === 'Highway') {
        distance = parseFloat((45 + rand() * 65).toFixed(1)); // 45-110 km
        avgSpeed = parseFloat((95 + rand() * 25).toFixed(1)); // 95-120 km/h
        hvacUsage = isRecentPeriod ? Math.floor(50 + rand() * 20) : Math.floor(35 + rand() * 15);
        energyConsumption = parseFloat((16.2 + rand() * 2.2).toFixed(1));
        avgTemp = parseFloat((34 + rand() * 6).toFixed(1));
        maxTemp = parseFloat((avgTemp + 4 + rand() * 5).toFixed(1));
      } else {
        distance = parseFloat((25 + rand() * 35).toFixed(1));
        avgSpeed = parseFloat((48 + rand() * 20).toFixed(1));
        hvacUsage = isRecentPeriod ? Math.floor(55 + rand() * 20) : Math.floor(38 + rand() * 18);
        energyConsumption = parseFloat((15.2 + rand() * 2.0).toFixed(1));
        avgTemp = parseFloat((32 + rand() * 5).toFixed(1));
        maxTemp = parseFloat((avgTemp + 3 + rand() * 4).toFixed(1));
      }

      // Range evolution
      const sessionRangeDrop = (distance * (energyConsumption / 100)) * (340 / 75); // relative to battery capacity
      const startRange = Math.round(baseRange);
      baseRange = Math.max(120, baseRange - sessionRangeDrop + (sessionIdx === sessionsToday - 1 ? 160 : 0));
      const endRange = Math.round(baseRange);

      const hasThermalAnomaly = (dayOffset === 2 && sessionIdx === 1) || (dayOffset === 18 && sessionIdx === 0);
      let anomalyType: string | undefined = undefined;

      if (hasThermalAnomaly) {
        anomalyType = 'BATTERY_THERMAL_SURGE';
        maxTemp = 43.8;
        energyConsumption += 3.2;

        events.push({
          id: `evt-hist-${dayOffset}-${sessionIdx}`,
          timestamp: `${sessionHour < 10 ? '0' : ''}${sessionHour}:38:05`,
          fullDate: `${dateStr} ${sessionHour < 10 ? '0' : ''}${sessionHour}:38:05`,
          title: 'High Battery Thermal Alarm Triggered',
          description: 'Pack temperature exceeded 42.0°C threshold following sustained 190A load.',
          category: 'THERMAL',
          severity: 'CRITICAL',
          dtcCode: 'DTC_BATT_TEMP_42C_HIGH',
          context: 'Highway grade climb in ambient 33°C with heavy acceleration profile.',
          telemetrySnapshot: {
            speed: 104,
            batteryPercentage: 62,
            batteryTemperature: 43.8,
            batteryVoltage: 382.4,
            batteryCurrent: 192.5,
            energyConsumption: 22.4,
            motorTemperature: 78.4,
          }
        });
      }

      records.push({
        id: `rec-${dayOffset}-${sessionIdx}`,
        date: dateStr,
        timestamp: sessionTime.getTime(),
        distanceKm: distance,
        avgSpeed,
        avgBatteryTemp: avgTemp,
        maxBatteryTemp: maxTemp,
        avgVoltage: parseFloat((392 - (rand() * 18)).toFixed(1)),
        avgCurrent: parseFloat((45 + rand() * 40).toFixed(1)),
        startRange,
        endRange,
        energyConsumption,
        drivingMode,
        locationCategory,
        hvacUsagePercent: hvacUsage,
        eventsCount: hasThermalAnomaly ? 3 : Math.floor(rand() * 2),
        hasAnomaly: hasThermalAnomaly,
        anomalyType,
      });
    }
  }

  // Add realistic timeline events for recent days
  const recentEvents: VehicleEvent[] = [
    {
      id: 'evt-rec-1',
      timestamp: '10:31:04',
      fullDate: '2026-11-01 10:31:04',
      title: 'ADAS Lane Centering Engaged',
      description: 'L2+ Highway Co-Pilot active on Express Arterial Route 4.',
      category: 'ADAS',
      severity: 'INFO',
      telemetrySnapshot: { speed: 82, batteryTemperature: 33.5, batteryCurrent: 38.2 }
    },
    {
      id: 'evt-rec-2',
      timestamp: '10:34:21',
      fullDate: '2026-11-01 10:34:21',
      title: 'High Current Draw Detected',
      description: 'Pack discharge surged to 194.2A during rapid uphill overtaking maneuver.',
      category: 'ENERGY',
      severity: 'WARNING',
      telemetrySnapshot: { speed: 108, batteryTemperature: 36.8, batteryCurrent: 194.2 }
    },
    {
      id: 'evt-rec-3',
      timestamp: '10:36:17',
      fullDate: '2026-11-01 10:36:17',
      title: 'Battery Temperature Rising',
      description: 'Module 3 temperature climb rate reached +3.4°C/min.',
      category: 'THERMAL',
      severity: 'WARNING',
      telemetrySnapshot: { speed: 102, batteryTemperature: 39.8, batteryCurrent: 145.0 }
    },
    {
      id: 'evt-rec-4',
      timestamp: '10:37:42',
      fullDate: '2026-11-01 10:37:42',
      title: 'Rapid Temperature Increase Detected',
      description: 'Thermal gradient across Module 2 & 3 exceeded delta threshold.',
      category: 'THERMAL',
      severity: 'ANOMALY',
      telemetrySnapshot: { speed: 96, batteryTemperature: 42.1, batteryCurrent: 110.0 }
    },
    {
      id: 'evt-rec-5',
      timestamp: '10:38:05',
      fullDate: '2026-11-01 10:38:05',
      title: 'Thermal Warning Raised: Pack Temp Exceeded',
      description: 'Active Battery Chiller Pump commanded to 100% duty cycle. Peak: 43.5°C.',
      category: 'THERMAL',
      severity: 'CRITICAL',
      dtcCode: 'DTC_BATT_OVERHEAT_WARN_B402',
      telemetrySnapshot: { speed: 88, batteryTemperature: 43.5, batteryCurrent: 82.0 }
    },
    {
      id: 'evt-rec-6',
      timestamp: '10:39:10',
      fullDate: '2026-11-01 10:39:10',
      title: 'Thermal Warning Cleared',
      description: 'Pack temperature returned to safe operating margin (37.9°C). Chiller modulated.',
      category: 'THERMAL',
      severity: 'INFO',
      telemetrySnapshot: { speed: 64, batteryTemperature: 37.9, batteryCurrent: 28.5 }
    }
  ];

  return {
    records,
    events: [...recentEvents, ...events],
  };
}

export const staticHistoricalDataset = generateDeterministicHistoricalData();
