import { 
  VehicleTelemetry, 
  VehicleEvent, 
  SimulationScenario, 
  DrivingMode, 
  LocationCategory,
  BrakeStatus,
  ADASStatus
} from '../types/vehicle';

export type SimulationListener = (telemetry: VehicleTelemetry, latestEvent?: VehicleEvent) => void;

export class SimulationEngine {
  private currentScenario: SimulationScenario = 'NORMAL_DRIVE';
  private isRunning: boolean = true;
  private timer: number | null = null;
  private stepCount: number = 0;
  private listeners: SimulationListener[] = [];

  // Live state
  private telemetry: VehicleTelemetry = {
    timestamp: Date.now(),
    timeStr: new Date().toLocaleTimeString('en-US', { hour12: false }),
    speed: 64,
    batteryPercentage: 71.4,
    batteryTemperature: 38.4,
    batteryVoltage: 388.2,
    batteryCurrent: 42.1,
    drivingRange: 286,
    energyConsumption: 16.8,
    motorTemperature: 64.2,
    cabinTemperature: 21.5,
    hvacPower: 2.1,
    brakeStatus: 'OFF',
    adasStatus: 'ACTIVE',
    drivingMode: 'COMFORT',
    locationCategory: 'City'
  };

  private recentHistoryBuffer: VehicleTelemetry[] = [];

  constructor() {
    this.seedInitialHistory();
    this.start();
  }

  private seedInitialHistory() {
    const now = Date.now();
    for (let i = 25; i >= 0; i--) {
      const pastTime = now - i * 1500;
      const d = new Date(pastTime);
      this.recentHistoryBuffer.push({
        ...this.telemetry,
        timestamp: pastTime,
        timeStr: d.toLocaleTimeString('en-US', { hour12: false }),
        speed: 60 + Math.sin(i * 0.4) * 6,
        batteryTemperature: 37.8 + (i * 0.02),
        energyConsumption: 16.5 + (Math.cos(i * 0.3) * 0.8),
        batteryCurrent: 40 + Math.sin(i) * 12
      });
    }
  }

  public getTelemetry(): VehicleTelemetry {
    return { ...this.telemetry };
  }

  public getTelemetryHistory(): VehicleTelemetry[] {
    return [...this.recentHistoryBuffer];
  }

  public getScenario(): SimulationScenario {
    return this.currentScenario;
  }

  public setScenario(scenario: SimulationScenario): VehicleEvent | null {
    this.currentScenario = scenario;
    this.stepCount = 0;
    let event: VehicleEvent | null = null;

    if (scenario === 'BATTERY_THERMAL_EVENT') {
      this.telemetry.batteryCurrent = 192.4;
      this.telemetry.speed = 104;
      this.telemetry.drivingMode = 'SPORT';
      event = {
        id: `evt-live-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        title: 'Thermal Stress Scenario Injected',
        description: 'Simulating high-current draw on steep 7% gradient under ambient 34°C.',
        category: 'THERMAL',
        severity: 'WARNING',
        dtcCode: 'SIM_STRESS_PROFILE_01',
        telemetrySnapshot: { ...this.telemetry }
      };
    } else if (scenario === 'HIGHWAY_DRIVE') {
      this.telemetry.speed = 118;
      this.telemetry.energyConsumption = 18.4;
      this.telemetry.adasStatus = 'LANE_CENTERING';
      this.telemetry.locationCategory = 'Highway';
      event = {
        id: `evt-live-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        title: 'Highway Cruise Engaged',
        description: '120 km/h cruising on Highway corridor with Level-2 ADAS lane centering.',
        category: 'ADAS',
        severity: 'INFO',
        telemetrySnapshot: { ...this.telemetry }
      };
    } else if (scenario === 'CITY_DRIVE') {
      this.telemetry.speed = 36;
      this.telemetry.energyConsumption = 16.9;
      this.telemetry.locationCategory = 'City';
      event = {
        id: `evt-live-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        title: 'Urban Drive Profile Active',
        description: 'Stop-and-go city cycle with active regenerative deceleration.',
        category: 'ENERGY',
        severity: 'INFO',
        telemetrySnapshot: { ...this.telemetry }
      };
    } else if (scenario === 'HIGH_LOAD') {
      this.telemetry.batteryCurrent = 175;
      this.telemetry.speed = 95;
      this.telemetry.motorTemperature = 76;
      event = {
        id: `evt-live-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        title: 'High Powertrain Load Detected',
        description: 'Sustained 175A current load on dual permanent magnet motors.',
        category: 'ENERGY',
        severity: 'WARNING',
        telemetrySnapshot: { ...this.telemetry }
      };
    } else if (scenario === 'RANGE_DEGRADATION') {
      this.telemetry.drivingRange = 264;
      this.telemetry.energyConsumption = 18.2;
      this.telemetry.hvacPower = 3.8;
      event = {
        id: `evt-live-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        title: 'Range Degradation Baseline Active',
        description: 'Evaluating cumulative effect of high auxiliary HVAC + urban stop/start.',
        category: 'ENERGY',
        severity: 'ANOMALY',
        telemetrySnapshot: { ...this.telemetry }
      };
    } else {
      // Normal driving
      this.telemetry.speed = 64;
      this.telemetry.energyConsumption = 15.2;
      this.telemetry.batteryTemperature = 32.5;
      this.telemetry.batteryCurrent = 42.1;
      this.telemetry.adasStatus = 'ACTIVE';
      this.telemetry.locationCategory = 'Mixed';
    }

    this.notify(event || undefined);
    return event;
  }

  public subscribe(listener: SimulationListener): () => void {
    this.listeners.push(listener);
    listener(this.telemetry);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public togglePause(): boolean {
    this.isRunning = !this.isRunning;
    return this.isRunning;
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  private start() {
    if (this.timer) clearInterval(this.timer);
    this.timer = window.setInterval(() => {
      if (!this.isRunning) return;
      this.tick();
    }, 1500);
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private tick() {
    this.stepCount++;
    const now = Date.now();
    const timeStr = new Date(now).toLocaleTimeString('en-US', { hour12: false });
    let newEvent: VehicleEvent | undefined = undefined;

    const jitter = (val: number, range: number) => val + (Math.random() - 0.5) * range;

    switch (this.currentScenario) {
      case 'BATTERY_THERMAL_EVENT': {
        // Temperature rises across steps 1..8, peaks at 43.5°C, triggers DTC, then active cooling clears it
        if (this.stepCount <= 3) {
          this.telemetry.batteryCurrent = jitter(185, 12);
          this.telemetry.speed = jitter(102, 5);
          this.telemetry.batteryTemperature = parseFloat((38.4 + this.stepCount * 1.2).toFixed(1));
          this.telemetry.motorTemperature = parseFloat((68 + this.stepCount * 2.5).toFixed(1));
          this.telemetry.energyConsumption = 21.4;
        } else if (this.stepCount === 4) {
          this.telemetry.batteryTemperature = 42.4;
          newEvent = {
            id: `evt-thermal-anomaly-${now}`,
            timestamp: timeStr,
            title: 'Rapid Temperature Increase Detected',
            description: 'Pack temperature crossing 42.0°C upper boundary with +3.4°C/min gradient.',
            category: 'THERMAL',
            severity: 'ANOMALY',
            dtcCode: 'DTC_BATT_TEMP_HIGH_WARN',
            telemetrySnapshot: { ...this.telemetry }
          };
        } else if (this.stepCount === 5) {
          this.telemetry.batteryTemperature = 43.6;
          this.telemetry.batteryCurrent = 194.2;
          newEvent = {
            id: `evt-thermal-critical-${now}`,
            timestamp: timeStr,
            title: 'Critical Battery Thermal Alarm Triggered',
            description: 'Pack temperature reached 43.6°C. High voltage chiller loop commanded to max cooling.',
            category: 'THERMAL',
            severity: 'CRITICAL',
            dtcCode: 'DTC_BATT_OVERHEAT_WARN_B402',
            telemetrySnapshot: { ...this.telemetry }
          };
        } else if (this.stepCount > 5 && this.stepCount <= 9) {
          // Cooling down
          this.telemetry.batteryCurrent = jitter(45, 10);
          this.telemetry.speed = jitter(70, 8);
          this.telemetry.batteryTemperature = parseFloat((43.6 - (this.stepCount - 5) * 1.4).toFixed(1));
        } else if (this.stepCount === 10) {
          this.telemetry.batteryTemperature = 37.8;
          newEvent = {
            id: `evt-thermal-cleared-${now}`,
            timestamp: timeStr,
            title: 'Thermal Warning Cleared',
            description: 'Battery chiller successfully brought pack below safe threshold (<38°C).',
            category: 'THERMAL',
            severity: 'INFO',
            telemetrySnapshot: { ...this.telemetry }
          };
          this.currentScenario = 'NORMAL_DRIVE';
        }
        break;
      }

      case 'HIGHWAY_DRIVE': {
        this.telemetry.speed = parseFloat(jitter(118, 6).toFixed(1));
        this.telemetry.batteryCurrent = parseFloat(jitter(88, 14).toFixed(1));
        this.telemetry.batteryTemperature = parseFloat(jitter(36.2, 0.4).toFixed(1));
        this.telemetry.energyConsumption = parseFloat(jitter(18.5, 0.6).toFixed(1));
        this.telemetry.motorTemperature = parseFloat(jitter(66, 1.5).toFixed(1));
        this.telemetry.brakeStatus = 'OFF';
        this.telemetry.adasStatus = 'LANE_CENTERING';
        this.telemetry.drivingMode = 'COMFORT';
        break;
      }

      case 'CITY_DRIVE': {
        const isBraking = Math.random() < 0.35;
        this.telemetry.speed = isBraking ? parseFloat(jitter(18, 8).toFixed(1)) : parseFloat(jitter(46, 10).toFixed(1));
        this.telemetry.brakeStatus = isBraking ? (Math.random() < 0.7 ? 'REGEN' : 'HYDRAULIC') : 'OFF';
        this.telemetry.batteryCurrent = isBraking ? -38.5 : parseFloat(jitter(55, 20).toFixed(1));
        this.telemetry.batteryTemperature = parseFloat(jitter(33.4, 0.3).toFixed(1));
        this.telemetry.energyConsumption = parseFloat(jitter(16.9, 0.5).toFixed(1));
        this.telemetry.adasStatus = 'STANDBY';
        this.telemetry.drivingMode = 'ECO';
        break;
      }

      case 'HIGH_LOAD': {
        this.telemetry.speed = parseFloat(jitter(96, 6).toFixed(1));
        this.telemetry.batteryCurrent = parseFloat(jitter(172, 16).toFixed(1));
        this.telemetry.batteryTemperature = parseFloat(Math.min(41.5, 38.0 + this.stepCount * 0.3).toFixed(1));
        this.telemetry.motorTemperature = parseFloat(Math.min(84, 72 + this.stepCount * 0.8).toFixed(1));
        this.telemetry.energyConsumption = parseFloat(jitter(23.8, 1.2).toFixed(1));
        this.telemetry.drivingMode = 'SPORT';
        break;
      }

      default: { // NORMAL_DRIVE
        this.telemetry.speed = parseFloat(jitter(64, 5).toFixed(1));
        this.telemetry.batteryCurrent = parseFloat(jitter(42, 8).toFixed(1));
        this.telemetry.batteryTemperature = parseFloat(jitter(32.8, 0.3).toFixed(1));
        this.telemetry.energyConsumption = parseFloat(jitter(15.4, 0.4).toFixed(1));
        this.telemetry.motorTemperature = parseFloat(jitter(58.5, 1.0).toFixed(1));
        this.telemetry.brakeStatus = Math.random() < 0.15 ? 'REGEN' : 'OFF';
        this.telemetry.adasStatus = 'ACTIVE';
        this.telemetry.drivingMode = 'COMFORT';
        break;
      }
    }

    // Battery depletion slow decay
    this.telemetry.batteryPercentage = parseFloat(Math.max(10, this.telemetry.batteryPercentage - 0.004).toFixed(2));
    this.telemetry.drivingRange = Math.round((this.telemetry.batteryPercentage / 100) * 400 * (15.0 / this.telemetry.energyConsumption));
    this.telemetry.timestamp = now;
    this.telemetry.timeStr = timeStr;

    // Maintain live rolling buffer (last 30 points)
    this.recentHistoryBuffer.push({ ...this.telemetry });
    if (this.recentHistoryBuffer.length > 30) {
      this.recentHistoryBuffer.shift();
    }

    this.notify(newEvent);
  }

  private notify(newEvent?: VehicleEvent) {
    for (const listener of this.listeners) {
      listener(this.telemetry, newEvent);
    }
  }
}

export const simulationEngineInstance = new SimulationEngine();
