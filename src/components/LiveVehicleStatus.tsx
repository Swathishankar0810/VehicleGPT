import React from 'react';
import { 
  Gauge, 
  BatteryCharging, 
  Thermometer, 
  Activity, 
  Compass, 
  Zap, 
  Flame, 
  Wind, 
  Disc, 
  ShieldCheck,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { VehicleTelemetry } from '../types/vehicle';

interface LiveVehicleStatusProps {
  telemetry: VehicleTelemetry;
  isPresentationMode?: boolean;
}

export const LiveVehicleStatus: React.FC<LiveVehicleStatusProps> = ({ telemetry, isPresentationMode }) => {
  // Determine temperature alert status
  const isTempCritical = telemetry.batteryTemperature >= 42.0;
  const isTempWarning = telemetry.batteryTemperature >= 39.0 && !isTempCritical;

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 lg:p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <h2 className="text-sm font-bold tracking-tight text-[#0B192C] uppercase font-mono">
            Live Vehicle Telemetry (CAN / SOME-IP Stream)
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
            RATE: 10 Hz | TIME: {telemetry.timeStr}
          </span>
          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            {telemetry.drivingMode} MODE
          </span>
        </div>
      </div>

      {/* Grid of Key Telemetry Parameters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        
        {/* Speed */}
        <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Speed</span>
            <Gauge className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className={`font-mono font-bold text-[#0B192C] ${isPresentationMode ? 'text-2xl' : 'text-xl'}`}>
              {Math.round(telemetry.speed)}
            </span>
            <span className="text-xs font-medium text-slate-500">km/h</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-500 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Profile: {telemetry.locationCategory}
          </div>
        </div>

        {/* Battery State of Charge (SoC) */}
        <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Battery SoC</span>
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className={`font-mono font-bold text-[#0B192C] ${isPresentationMode ? 'text-2xl' : 'text-xl'}`}>
              {telemetry.batteryPercentage.toFixed(1)}
            </span>
            <span className="text-xs font-medium text-slate-500">%</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${telemetry.batteryPercentage}%` }}
            />
          </div>
        </div>

        {/* Battery Temperature (Critical for Scenario 2) */}
        <div className={`p-3 rounded-lg border transition-all ${
          isTempCritical 
            ? 'bg-red-50/90 border-red-300 shadow-sm shadow-red-200/40' 
            : isTempWarning 
              ? 'bg-amber-50/80 border-amber-300' 
              : 'bg-slate-50/80 border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className={`text-[11px] font-medium uppercase tracking-wider ${isTempCritical ? 'text-red-700 font-bold' : isTempWarning ? 'text-amber-800' : ''}`}>
              Battery Temp
            </span>
            <Thermometer className={`w-3.5 h-3.5 ${isTempCritical ? 'text-red-600 animate-bounce' : isTempWarning ? 'text-amber-600' : 'text-slate-400'}`} />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className={`font-mono font-bold ${isTempCritical ? 'text-red-700' : isTempWarning ? 'text-amber-800' : 'text-[#0B192C]'} ${isPresentationMode ? 'text-2xl' : 'text-xl'}`}>
              {telemetry.batteryTemperature.toFixed(1)}
            </span>
            <span className="text-xs font-medium text-slate-500">°C</span>
          </div>
          <div className="mt-1 text-[10px] font-mono flex items-center justify-between">
            <span className={isTempCritical ? 'text-red-600 font-bold' : isTempWarning ? 'text-amber-700 font-semibold' : 'text-slate-500'}>
              {isTempCritical ? 'ANOMALY >42°C' : isTempWarning ? 'ELEVATED' : 'NOMINAL (<38°C)'}
            </span>
            {telemetry.batteryTemperature > 36 && <TrendingUp className="w-3 h-3 text-red-500" />}
          </div>
        </div>

        {/* Driving Range */}
        <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Est. Range</span>
            <Compass className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className={`font-mono font-bold text-[#0B192C] ${isPresentationMode ? 'text-2xl' : 'text-xl'}`}>
              {telemetry.drivingRange}
            </span>
            <span className="text-xs font-medium text-slate-500">km</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-500 flex items-center gap-1">
            <TrendingDown className="w-3 h-3 text-amber-500" />
            <span>-12% vs 30d Baseline</span>
          </div>
        </div>

        {/* Energy Consumption */}
        <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Consumption</span>
            <Zap className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className={`font-mono font-bold text-[#0B192C] ${isPresentationMode ? 'text-2xl' : 'text-xl'}`}>
              {telemetry.energyConsumption.toFixed(1)}
            </span>
            <span className="text-xs font-medium text-slate-500">kWh/100km</span>
          </div>
          <div className="mt-1 text-[10px] text-purple-700 font-mono font-semibold">
            {telemetry.energyConsumption > 18 ? 'High Draw' : 'Urban Avg (16.8)'}
          </div>
        </div>

        {/* Battery Current & Voltage */}
        <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Pack I / V</span>
            <Activity className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className={`font-mono font-bold ${Math.abs(telemetry.batteryCurrent) > 150 ? 'text-amber-600' : 'text-[#0B192C]'} ${isPresentationMode ? 'text-xl' : 'text-lg'}`}>
              {telemetry.batteryCurrent > 0 ? `+${telemetry.batteryCurrent.toFixed(1)}` : telemetry.batteryCurrent.toFixed(1)}
            </span>
            <span className="text-xs font-medium text-slate-500">A</span>
          </div>
          <div className="mt-1 text-[10px] font-mono text-slate-500">
            {telemetry.batteryVoltage.toFixed(1)} V DC
          </div>
        </div>

      </div>

      {/* Auxiliary Systems Row: Motor, Cabin, Brake, ADAS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-100">
        
        {/* Motor Temp */}
        <div className="flex items-center space-x-2.5 px-3 py-2 rounded-lg bg-slate-50/50 border border-slate-200/60">
          <Flame className="w-4 h-4 text-orange-500" />
          <div>
            <div className="text-[10px] uppercase font-medium text-slate-400">Motor Stator</div>
            <div className="text-xs font-mono font-bold text-slate-800">{telemetry.motorTemperature.toFixed(1)} °C</div>
          </div>
        </div>

        {/* Cabin Temp & HVAC */}
        <div className="flex items-center space-x-2.5 px-3 py-2 rounded-lg bg-slate-50/50 border border-slate-200/60">
          <Wind className="w-4 h-4 text-cyan-600" />
          <div>
            <div className="text-[10px] uppercase font-medium text-slate-400">Cabin / HVAC</div>
            <div className="text-xs font-mono font-bold text-slate-800">{telemetry.cabinTemperature.toFixed(1)} °C ({telemetry.hvacPower} kW)</div>
          </div>
        </div>

        {/* Brake Status */}
        <div className="flex items-center space-x-2.5 px-3 py-2 rounded-lg bg-slate-50/50 border border-slate-200/60">
          <Disc className={`w-4 h-4 ${telemetry.brakeStatus === 'REGEN' ? 'text-emerald-500' : telemetry.brakeStatus === 'HYDRAULIC' ? 'text-red-500' : 'text-slate-400'}`} />
          <div>
            <div className="text-[10px] uppercase font-medium text-slate-400">Braking Actuation</div>
            <div className={`text-xs font-mono font-bold ${telemetry.brakeStatus === 'REGEN' ? 'text-emerald-600' : telemetry.brakeStatus === 'HYDRAULIC' ? 'text-red-600' : 'text-slate-700'}`}>
              {telemetry.brakeStatus}
            </div>
          </div>
        </div>

        {/* ADAS Status */}
        <div className="flex items-center space-x-2.5 px-3 py-2 rounded-lg bg-slate-50/50 border border-slate-200/60">
          <ShieldCheck className={`w-4 h-4 ${telemetry.adasStatus !== 'DISENGAGED' ? 'text-purple-600' : 'text-slate-400'}`} />
          <div>
            <div className="text-[10px] uppercase font-medium text-slate-400">ADAS Supervisor</div>
            <div className="text-xs font-mono font-bold text-purple-700">
              {telemetry.adasStatus}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
