import React from 'react';
import { X, AlertTriangle, Info, Zap, Flame, ShieldAlert, Sparkles, Binary } from 'lucide-react';
import { VehicleEvent } from '../types/vehicle';

interface EventDetailModalProps {
  event: VehicleEvent | null;
  onClose: () => void;
  onAskVehicleGPT: (question: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onAskVehicleGPT,
}) => {
  if (!event) return null;

  const handleAsk = () => {
    let question = `What happened around event ${event.title}?`;
    if (event.category === 'THERMAL') {
      question = "What happened before the battery overheating warning?";
    } else if (event.category === 'ENERGY') {
      question = "When did energy consumption increase the most?";
    }
    onAskVehicleGPT(question);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B192C]/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
              TIME: {event.timestamp}
            </span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
              event.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
              event.severity === 'ANOMALY' ? 'bg-purple-100 text-purple-700' :
              event.severity === 'WARNING' ? 'bg-amber-100 text-amber-800' :
              'bg-blue-100 text-blue-700'
            }`}>
              {event.severity}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#0B192C]">{event.title}</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{event.description}</p>
          </div>

          {event.dtcCode && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs">
              <span className="font-mono font-bold text-red-800 block text-[10px] uppercase">
                Diagnostic Trouble Code (DTC)
              </span>
              <span className="font-mono text-red-900 font-bold text-sm">{event.dtcCode}</span>
            </div>
          )}

          {/* Surrounding Telemetry Snapshot */}
          {event.telemetrySnapshot && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-mono font-bold text-slate-500 uppercase mb-2 flex items-center gap-1.5">
                <Binary className="w-3.5 h-3.5 text-blue-600" />
                <span>Synchronized CAN Bus Telemetry Frame Snapshot</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {event.telemetrySnapshot.speed !== undefined && (
                  <div className="p-1.5 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 text-[10px] block">VEHICLE SPEED</span>
                    <strong className="text-slate-800">{event.telemetrySnapshot.speed} km/h</strong>
                  </div>
                )}
                {event.telemetrySnapshot.batteryTemperature !== undefined && (
                  <div className="p-1.5 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 text-[10px] block">BATTERY TEMP</span>
                    <strong className="text-slate-800">{event.telemetrySnapshot.batteryTemperature} °C</strong>
                  </div>
                )}
                {event.telemetrySnapshot.batteryCurrent !== undefined && (
                  <div className="p-1.5 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 text-[10px] block">PACK CURRENT</span>
                    <strong className="text-slate-800">{event.telemetrySnapshot.batteryCurrent} A</strong>
                  </div>
                )}
                {event.telemetrySnapshot.energyConsumption !== undefined && (
                  <div className="p-1.5 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 text-[10px] block">CONSUMPTION</span>
                    <strong className="text-slate-800">{event.telemetrySnapshot.energyConsumption} kWh/100km</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Trigger */}
          <button
            onClick={handleAsk}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#795290] to-[#582C6D] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow hover:brightness-110 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-200" />
            <span>Ask VehicleGPT to Analyze This Incident</span>
          </button>
        </div>

      </div>
    </div>
  );
};
