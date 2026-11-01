import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts';
import { VehicleTelemetry } from '../types/vehicle';
import { Thermometer, Zap, Compass, Activity, AlertTriangle } from 'lucide-react';

interface LiveTelemetryChartProps {
  data: VehicleTelemetry[];
  isPresentationMode?: boolean;
}

type MetricType = 'temperature' | 'consumption' | 'range' | 'current';

export const LiveTelemetryChart: React.FC<LiveTelemetryChartProps> = ({ data, isPresentationMode }) => {
  const [activeMetric, setActiveMetric] = useState<MetricType>('temperature');

  // Format data for chart
  const chartData = data.map((d, index) => ({
    time: d.timeStr,
    temperature: d.batteryTemperature,
    consumption: d.energyConsumption,
    range: d.drivingRange,
    current: Math.abs(d.batteryCurrent),
    speed: d.speed,
    index,
  }));

  const metricConfigs = {
    temperature: {
      label: 'Battery Temperature',
      unit: '°C',
      dataKey: 'temperature',
      color: '#DC2626',
      stroke: '#EF4444',
      fill: 'rgba(239, 68, 68, 0.1)',
      domain: [28, 48],
      refLine: 42.0,
      refLabel: 'Warning Threshold (42.0°C)',
      icon: Thermometer,
      description: 'Thermal pack monitoring with critical 42°C threshold alert'
    },
    consumption: {
      label: 'Energy Consumption',
      unit: 'kWh/100km',
      dataKey: 'consumption',
      color: '#7C3AED',
      stroke: '#8B5CF6',
      fill: 'rgba(139, 92, 246, 0.1)',
      domain: [10, 28],
      refLine: 16.8,
      refLabel: 'Current Urban Avg (16.8)',
      icon: Zap,
      description: 'Dynamic instantaneous energy draw across propulsion + HVAC'
    },
    range: {
      label: 'Estimated Driving Range',
      unit: 'km',
      dataKey: 'range',
      color: '#2563EB',
      stroke: '#3B82F6',
      fill: 'rgba(59, 130, 246, 0.1)',
      domain: [220, 360],
      refLine: 286,
      refLabel: 'Current SoC Range (286 km)',
      icon: Compass,
      description: 'Real-time remaining range based on rolling 15-minute consumption'
    },
    current: {
      label: 'Battery Discharge Current',
      unit: 'A',
      dataKey: 'current',
      color: '#EA580C',
      stroke: '#F97316',
      fill: 'rgba(249, 115, 22, 0.1)',
      domain: [0, 220],
      refLine: 180,
      refLabel: 'High Load Limit (180A)',
      icon: Activity,
      description: 'Pack bus discharge rate during acceleration and overtaking'
    }
  };

  const currentConfig = metricConfigs[activeMetric];

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 lg:p-5 shadow-sm flex flex-col h-full">
      {/* Header & Metric Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 gap-2 mb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            <h2 className="text-sm font-bold tracking-tight text-[#0B192C] uppercase font-mono">
              Live Telemetry Stream
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {currentConfig.description}
          </p>
        </div>

        {/* Metric Selector Tabs (Req 6) */}
        <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          {(Object.keys(metricConfigs) as MetricType[]).map((key) => {
            const cfg = metricConfigs[key];
            const Icon = cfg.icon;
            const isSelected = activeMetric === key;
            return (
              <button
                key={key}
                onClick={() => setActiveMetric(key)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  isSelected 
                    ? 'bg-white text-[#0B192C] shadow-sm font-semibold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3 h-3 ${isSelected ? 'text-[#795290]' : 'text-slate-400'}`} />
                <span>{cfg.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Moving Window Chart */}
      <div className={`w-full ${isPresentationMode ? 'h-64' : 'h-52'} transition-all`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentConfig.stroke} stopOpacity={0.25}/>
                <stop offset="95%" stopColor={currentConfig.stroke} stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={currentConfig.domain}
              tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
              unit={` ${currentConfig.unit}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0B192C', 
                border: '1px solid #1E3E62', 
                borderRadius: '8px', 
                color: '#FFFFFF',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono'
              }}
              labelStyle={{ color: '#94A3B8', marginBottom: '4px' }}
              formatter={(val: any) => [`${val} ${currentConfig.unit}`, currentConfig.label]}
            />
            {currentConfig.refLine && (
              <ReferenceLine 
                y={currentConfig.refLine} 
                stroke="#DC2626" 
                strokeDasharray="4 4" 
                label={{ 
                  value: currentConfig.refLabel, 
                  position: 'top', 
                  fill: '#DC2626', 
                  fontSize: 10,
                  fontFamily: 'JetBrains Mono',
                  fontWeight: 600
                }} 
              />
            )}
            <Area 
              type="monotone" 
              dataKey={currentConfig.dataKey} 
              stroke={currentConfig.stroke} 
              strokeWidth={2}
              fillOpacity={1} 
              fill={`url(#grad-${activeMetric})`} 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer with Live Status */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2 text-[11px] font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span>Window: Rolling 30 Samples</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Current: <strong className="text-slate-800">{chartData[chartData.length - 1]?.[activeMetric as keyof typeof chartData[0]] ?? '--'} {currentConfig.unit}</strong></span>
          {activeMetric === 'temperature' && (chartData[chartData.length - 1]?.temperature ?? 0) >= 42 && (
            <span className="inline-flex items-center gap-1 text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
              <AlertTriangle className="w-3 h-3" /> THRESHOLD EXCEEDED
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
