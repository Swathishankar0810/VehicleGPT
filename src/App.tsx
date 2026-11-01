import React, { useState, useEffect } from 'react';
import { 
  VehicleTelemetry, 
  VehicleEvent, 
  SimulationScenario, 
  HistoricalRecord 
} from './types/vehicle';
import { simulationEngineInstance } from './engine/simulationEngine';
import { staticHistoricalDataset } from './data/mockHistoricalData';

import { Header } from './components/Header';
import { LiveVehicleStatus } from './components/LiveVehicleStatus';
import { LiveTelemetryChart } from './components/LiveTelemetryChart';
import { EventTimeline } from './components/EventTimeline';
import { AskVehicleGPT } from './components/AskVehicleGPT';
import { HistoricalDataPanel } from './components/HistoricalDataPanel';
import { AnalyticsEnginePanel } from './components/AnalyticsEnginePanel';
import { ConstraintMonitor } from './components/ConstraintMonitor';
import { SafetyIsolationPanel } from './components/SafetyIsolationPanel';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { HybridRetrievalVisualizer } from './components/HybridRetrievalVisualizer';
import { ArchitectureModal } from './components/ArchitectureModal';
import { EventDetailModal } from './components/EventDetailModal';
import { DemoTourModal } from './components/DemoTourModal';

export const App: React.FC = () => {
  // Live state
  const [telemetry, setTelemetry] = useState<VehicleTelemetry>(simulationEngineInstance.getTelemetry());
  const [telemetryHistory, setTelemetryHistory] = useState<VehicleTelemetry[]>(simulationEngineInstance.getTelemetryHistory());
  const [events, setEvents] = useState<VehicleEvent[]>(staticHistoricalDataset.events);
  const [isRunning, setIsRunning] = useState<boolean>(simulationEngineInstance.getIsRunning());
  const [currentScenario, setCurrentScenario] = useState<SimulationScenario>(simulationEngineInstance.getScenario());

  // UI modal and presentation states
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<VehicleEvent | null>(null);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [activeQueryTrigger, setActiveQueryTrigger] = useState<string | undefined>(undefined);

  // Subscribe to simulation ticks
  useEffect(() => {
    const unsubscribe = simulationEngineInstance.subscribe((newTelemetry, newEvent) => {
      setTelemetry(newTelemetry);
      setTelemetryHistory(simulationEngineInstance.getTelemetryHistory());
      if (newEvent) {
        setEvents(prev => [newEvent, ...prev]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleTogglePause = () => {
    const running = simulationEngineInstance.togglePause();
    setIsRunning(running);
  };

  const handleSelectScenario = (scenario: SimulationScenario) => {
    setCurrentScenario(scenario);
    const newEvent = simulationEngineInstance.setScenario(scenario);
    if (newEvent) {
      setEvents(prev => [newEvent, ...prev]);
    }
  };

  const handleTriggerQuery = (question: string) => {
    setActiveQueryTrigger(question);
    // Reset trigger after a tick so subsequent triggers can fire
    setTimeout(() => setActiveQueryTrigger(undefined), 100);
  };

  return (
    <div className={`min-h-screen bg-[#F8FAFC] text-[#0B192C] flex flex-col font-sans transition-all ${isPresentationMode ? 'presentation-active' : ''}`}>
      
      {/* 1. Header with Status Indicators & Quick Actions */}
      <Header
        isRunning={isRunning}
        onTogglePause={handleTogglePause}
        activeScenario={currentScenario}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onStartDemo={() => setIsDemoTourOpen(true)}
        isPresentationMode={isPresentationMode}
        onTogglePresentationMode={() => setIsPresentationMode(!isPresentationMode)}
      />

      {/* Main Dashboard Body */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto px-4 lg:px-8 py-5 space-y-5">
        
        {/* Scenario Simulator Controls (Req 18) */}
        {!isPresentationMode && (
          <ScenarioSimulator
            currentScenario={currentScenario}
            onSelectScenario={handleSelectScenario}
            isPresentationMode={isPresentationMode}
          />
        )}

        {/* 2. Top Tier: Live Telemetry Cards */}
        <section>
          <LiveVehicleStatus 
            telemetry={telemetry} 
            isPresentationMode={isPresentationMode} 
          />
        </section>

        {/* 3. Mid Tier: Dual Column Engineering Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left Column (5 Cols): Live Charts & Event Stream */}
          <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
            {/* Live Chart (Req 6) */}
            <div className="flex-1">
              <LiveTelemetryChart 
                data={telemetryHistory} 
                isPresentationMode={isPresentationMode} 
              />
            </div>

            {/* Event Timeline (Req 7) */}
            <div className="flex-1">
              <EventTimeline 
                events={events} 
                onSelectEvent={(evt) => setSelectedEvent(evt)} 
                selectedEventId={selectedEvent?.id}
                isPresentationMode={isPresentationMode}
              />
            </div>
          </div>

          {/* Right Column (7 Cols): Ask VehicleGPT Conversational Intelligence (Centerpiece) */}
          <div className="lg:col-span-7">
            <AskVehicleGPT
              historicalRecords={staticHistoricalDataset.records}
              events={events}
              externalTriggerQuery={activeQueryTrigger}
              onSelectQuery={handleTriggerQuery}
              isPresentationMode={isPresentationMode}
            />
          </div>

        </div>

        {/* 4. Lower Tier: Historical Datastore + Edge Analytics Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Historical Data (Req 8) */}
          <div className="lg:col-span-6">
            <HistoricalDataPanel 
              records={staticHistoricalDataset.records} 
              isPresentationMode={isPresentationMode} 
            />
          </div>

          {/* Analytics Engine (Req 13) */}
          <div className="lg:col-span-6">
            <AnalyticsEnginePanel 
              records={staticHistoricalDataset.records} 
              events={events} 
              isPresentationMode={isPresentationMode} 
            />
          </div>

        </div>

        {/* 5. Edge Architecture Foundations: Hybrid Retrieval + Safety Isolation + Constraints */}
        {!isPresentationMode && (
          <div className="space-y-5">
            {/* Hybrid Retrieval (Req 14) */}
            <HybridRetrievalVisualizer />

            {/* Safety Isolation (Req 17) */}
            <SafetyIsolationPanel />

            {/* Constraint Compliance (Req 16) */}
            <ConstraintMonitor />
          </div>
        )}

        {/* Presentation Mode Footer Quick Bar */}
        {isPresentationMode && (
          <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs font-mono text-slate-500 shadow-sm">
            <div className="flex items-center space-x-3">
              <span className="text-emerald-700 font-bold">● PRESENTATION MODE ACTIVE</span>
              <span>1920×1080 Calibrated</span>
              <span>Cloud Egress: 0 KB</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsDemoTourOpen(true)}
                className="px-3 py-1 bg-gradient-to-r from-[#795290] to-[#582C6D] text-white rounded font-bold hover:brightness-110"
              >
                ▶ Trigger Scripted Demo
              </button>
              <button
                onClick={() => setIsPresentationMode(false)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold"
              >
                Exit Presentation Mode
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer info bar */}
      <footer className="bg-white border-t border-[#E2E8F0] py-3 mt-8">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-700">VehicleGPT Prototype</span>
            <span>•</span>
            <span>On-Device Vehicle Intelligence for Software-Defined Vehicles</span>
          </div>
          <div className="flex items-center space-x-3">
            <span>Deterministic Seed: #4092</span>
            <span>•</span>
            <span className="text-emerald-600 font-medium">100% Offline Capable</span>
            <span>•</span>
            <span>ISO 26262 ASIL-D Isolated</span>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <ArchitectureModal 
        isOpen={isArchitectureOpen} 
        onClose={() => setIsArchitectureOpen(false)} 
      />

      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onAskVehicleGPT={handleTriggerQuery}
      />

      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onTriggerScenario={handleSelectScenario}
        onTriggerQuery={handleTriggerQuery}
      />

    </div>
  );
};

export default App;
