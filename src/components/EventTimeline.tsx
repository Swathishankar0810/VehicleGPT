import React from 'react';
import { VehicleEvent } from '../types/vehicle';
import { 
  AlertTriangle, 
  Info, 
  Flame, 
  ShieldCheck, 
  Zap, 
  ChevronRight,
  Clock
} from 'lucide-react';

interface EventTimelineProps {
  events: VehicleEvent[];
  onSelectEvent: (event: VehicleEvent) => void;
  selectedEventId?: string;
  isPresentationMode?: boolean;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  events,
  onSelectEvent,
  selectedEventId,
  isPresentationMode,
}) => {
  // Sort events chronologically or reverse chronologically for easy inspection
  const displayEvents = events.slice(0, 7);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-50 text-red-700 border-red-200',
          dot: 'bg-red-500',
          icon: AlertTriangle
        };
      case 'ANOMALY':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          dot: 'bg-[#795290]',
          icon: AlertTriangle
        };
      case 'WARNING':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          icon: Zap
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-blue-500',
          icon: Info
        };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 lg:p-5 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-[#795290]" />
          <h2 className="text-sm font-bold tracking-tight text-[#0B192C] uppercase font-mono">
            Vehicle Event Timeline
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Click event for context
        </span>
      </div>

      {/* Events List */}
      <div className={`space-y-2 overflow-y-auto pr-1 ${isPresentationMode ? 'max-h-[340px]' : 'max-h-[260px]'}`}>
        {displayEvents.map((evt) => {
          const badge = getSeverityBadge(evt.severity);
          const Icon = badge.icon;
          const isSelected = selectedEventId === evt.id;

          return (
            <div
              key={evt.id}
              onClick={() => onSelectEvent(evt)}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer text-left flex items-start justify-between group ${
                isSelected 
                  ? 'bg-purple-50/70 border-[#795290] shadow-sm' 
                  : 'bg-slate-50/50 border-slate-200/70 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start space-x-2.5">
                <div className={`mt-0.5 p-1 rounded border ${badge.bg}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {evt.timestamp}
                    </span>
                    <span className="text-xs font-semibold text-[#0B192C] group-hover:text-[#582C6D] transition-colors">
                      {evt.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {evt.description}
                  </p>
                  {evt.dtcCode && (
                    <span className="inline-block mt-1 font-mono text-[10px] px-1.5 py-0.2 rounded bg-red-100/70 text-red-700 font-semibold border border-red-200">
                      {evt.dtcCode}
                    </span>
                  )}
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#795290] transition-colors flex-shrink-0 mt-1" />
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-mono flex items-center justify-between">
        <span>Logged Events: {events.length}</span>
        <span className="text-purple-700 font-medium">CAN-FD / SOME/IP Stream Buffer</span>
      </div>
    </div>
  );
};
