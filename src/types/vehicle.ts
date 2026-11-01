export type DrivingMode = 'ECO' | 'COMFORT' | 'SPORT' | 'CUSTOM';
export type LocationCategory = 'City' | 'Highway' | 'Mixed' | 'Parking';
export type ADASStatus = 'ACTIVE' | 'STANDBY' | 'LANE_CENTERING' | 'DISENGAGED';
export type BrakeStatus = 'OFF' | 'REGEN' | 'HYDRAULIC' | 'EMERGENCY_HOLD';
export type EventSeverity = 'INFO' | 'WARNING' | 'ANOMALY' | 'CRITICAL';

export interface VehicleTelemetry {
  timestamp: number;
  timeStr: string;
  speed: number;              // km/h
  batteryPercentage: number;  // %
  batteryTemperature: number; // °C
  batteryVoltage: number;     // V
  batteryCurrent: number;     // A (positive = discharge, negative = regen)
  drivingRange: number;       // km
  energyConsumption: number;  // kWh/100km
  motorTemperature: number;   // °C
  cabinTemperature: number;   // °C
  hvacPower: number;          // kW
  brakeStatus: BrakeStatus;
  adasStatus: ADASStatus;
  drivingMode: DrivingMode;
  locationCategory: LocationCategory;
}

export interface VehicleEvent {
  id: string;
  timestamp: string;
  fullDate?: string;
  title: string;
  description: string;
  category: 'TELEMETRY' | 'ADAS' | 'THERMAL' | 'ENERGY' | 'DIAGNOSTIC' | 'SAFETY';
  severity: EventSeverity;
  dtcCode?: string;
  telemetrySnapshot?: Partial<VehicleTelemetry>;
  context?: string;
}

export interface HistoricalRecord {
  id: string;
  date: string;
  timestamp: number;
  distanceKm: number;
  avgSpeed: number;
  avgBatteryTemp: number;
  maxBatteryTemp: number;
  avgVoltage: number;
  avgCurrent: number;
  startRange: number;
  endRange: number;
  energyConsumption: number; // kWh/100km
  drivingMode: DrivingMode;
  locationCategory: LocationCategory;
  hvacUsagePercent: number;
  eventsCount: number;
  hasAnomaly: boolean;
  anomalyType?: string;
}

export type SimulationScenario = 
  | 'NORMAL_DRIVE' 
  | 'HIGHWAY_DRIVE' 
  | 'CITY_DRIVE' 
  | 'HIGH_LOAD' 
  | 'BATTERY_THERMAL_EVENT' 
  | 'RANGE_DEGRADATION';

export interface PipelineStage {
  id: number;
  name: string;
  title: string;
  status: 'pending' | 'active' | 'completed';
  details?: Record<string, any>;
}

export interface EvidenceItem {
  metric: string;
  previousValue: string;
  currentValue: string;
  changePercent: string;
  isNegative: boolean;
  unit?: string;
}

export interface VehicleGPTResponse {
  query: string;
  intent: string;
  entities: string[];
  stages: PipelineStage[];
  summary: string;
  contributingFactors: string[];
  evidence: EvidenceItem[];
  conclusion: string;
  confidenceScore: number;
  latencyMs: number;
  tokenCount: number;
  model: string;
  relevantTelemetryPoints?: { time: string; value: number; baseline: number }[];
  relevantEvents?: VehicleEvent[];
}
