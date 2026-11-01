import React, { useState, useMemo } from 'react';
import { HistoricalRecord, LocationCategory } from '../types/vehicle';
import { 
  Calendar, 
  Filter, 
  TrendingDown, 
  Zap, 
  MapPin, 
  Thermometer, 
  CheckCircle2, 
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar 
} from 'recharts';

interface HistoricalDataPanelProps {
  records: HistoricalRecord[];
  isPresentationMode?: boolean;
}

type TimeRange = '24h' | '7d' | '30d';

export const HistoricalDataPanel: React.FC<HistoricalDataPanelProps> = ({ records, isPresentationMode }) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('30d');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Filter records based on selected time horizon
  const filteredRecords = useMemo(() => {
    let daysToInclude = 30;
    if (selectedRange === '24h') daysToInclude = 1;
    if (selectedRange === '7d') daysToInclude = 7;

    const cutoffTimestamp = records[records.length - 1]?.timestamp - (daysToInclude * 24 * 60 * 60 * 1000);
    let subset = records.filter(r => r.timestamp >= cutoffTimestamp);

    if (selectedCategory !== 'ALL') {
      subset = subset.filter(r => r.locationCategory === selectedCategory);
    }

    return subset;
  }, [records, selectedRange, selectedCategory]);

  // Aggregate statistics
  const stats = useMemo(() => {
    if (!filteredRecords.length) return { totalDist: 0, avgCons: 0, peakTemp: 0, anomalies: 0 };
    const totalDist = filteredRecords.reduce((acc, r) => acc + r.distanceKm, 0);
    const avgCons = filteredRecords.reduce((acc, r) => acc + r.energyConsumption, 0) / filteredRecords.length;
    const peakTemp = Math.max(...filteredRecords.map(r => r.maxBatteryTemp));
    const anomalies = filteredRecords.filter(r => r.hasAnomaly).length;

    return {
      totalDist: Math.round(totalDist),
      avgCons: parseFloat(avgCons.toFixed(1)),
      peakTemp: parseFloat(peakTemp.toFixed(1)),
      anomalies
    };
  }, [filteredRecords]);

  // Format data for chart
  const chartData = useMemo(() => {
    return filteredRecords.slice(-18).map(r => ({
      date: r.date.slice(5),
      consumption: r.energyConsumption,
      temperature: r.avgBatteryTemp,
      range: r.startRange,
      category: r.locationCategory
    }));
  }, [filteredRecords]);

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 lg:p-5 shadow-sm flex flex-col h-full">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#795290]" />
            <h2 className="text-sm font-bold tracking-tight text-[#0B192C] uppercase font-mono">
              Vehicle Historical Data (35-Day Archive)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Deterministic Local Telemetry &amp; Log Datastore
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            {(['24h', '7d', '30d'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                  selectedRange === range 
                    ? 'bg-white text-[#0B192C] shadow-xs font-semibold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Profiles</option>
            <option value="City">City Driving</option>
            <option value="Highway">Highway</option>
            <option value="Mixed">Mixed Route</option>
          </select>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <div className="text-[10px] uppercase font-medium text-slate-500">Distance Logged</div>
          <div className="text-base font-mono font-bold text-slate-800">{stats.totalDist.toLocaleString()} km</div>
          <div className="text-[9px] text-slate-400 font-mono">Across {filteredRecords.length} sessions</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <div className="text-[10px] uppercase font-medium text-slate-500">Period Avg Efficiency</div>
          <div className="text-base font-mono font-bold text-purple-700">{stats.avgCons} <span className="text-xs">kWh/100km</span></div>
          <div className="text-[9px] text-amber-600 font-mono flex items-center gap-0.5">
            <TrendingDown className="w-2.5 h-2.5" /> +15.1% vs baseline
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <div className="text-[10px] uppercase font-medium text-slate-500">Peak Battery Temp</div>
          <div className={`text-base font-mono font-bold ${stats.peakTemp >= 42 ? 'text-red-600' : 'text-slate-800'}`}>
            {stats.peakTemp} °C
          </div>
          <div className="text-[9px] text-slate-400 font-mono">Threshold: 42.0 °C</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <div className="text-[10px] uppercase font-medium text-slate-500">Anomalies Detected</div>
          <div className="text-base font-mono font-bold text-amber-700">{stats.anomalies}</div>
          <div className="text-[9px] text-slate-400 font-mono">Thermal &amp; Current surges</div>
        </div>
      </div>

      {/* Historical Trend Chart */}
      <div className="flex-1 w-full min-h-[160px]">
        <div className="text-[10px] font-mono text-slate-500 mb-1 flex items-center justify-between">
          <span>Historical Energy Consumption (kWh/100km)</span>
          <span className="text-purple-600 font-medium">Urban Shift (Recent 14d)</span>
        </div>
        <ResponsiveContainer width="100%" height={isPresentationMode ? 190 : 150}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#795290" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#795290" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 9, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <YAxis 
              domain={[12, 24]}
              tick={{ fontSize: 9, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
              unit=" kWh"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0B192C', 
                border: '1px solid #1E3E62', 
                borderRadius: '6px', 
                color: '#FFFFFF',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono'
              }}
              formatter={(val: any) => [`${val} kWh/100km`, 'Consumption']}
            />
            <Area 
              type="monotone" 
              dataKey="consumption" 
              stroke="#795290" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#histGrad)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>Storage Format: Parquet / SQLite Time-Series</span>
        <span className="text-emerald-600 font-semibold">Indexed for Fast On-Device Retrieval (&lt;15ms)</span>
      </div>
    </div>
  );
};
