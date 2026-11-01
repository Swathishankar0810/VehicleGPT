import { 
  VehicleGPTResponse, 
  PipelineStage, 
  HistoricalRecord, 
  VehicleEvent,
  VehicleTelemetry 
} from '../types/vehicle';
import { VehicleAnalyticsEngine } from './analyticsEngine';

export class QueryEngine {
  public static executeQuery(
    queryText: string, 
    records: HistoricalRecord[], 
    events: VehicleEvent[],
    onStageUpdate?: (stages: PipelineStage[]) => void
  ): Promise<VehicleGPTResponse> {
    return new Promise((resolve) => {
      const q = queryText.toLowerCase().trim();

      let intent = 'General Vehicle Analysis';
      let entities: string[] = ['Telemetry', 'Vehicle State'];

      if (q.includes('range') || q.includes('decrease') || q.includes('reduction')) {
        intent = 'Root Cause Analysis: Range Reduction';
        entities = ['Estimated Range', 'Energy Consumption', 'HVAC Duty Cycle', 'Urban Traffic Ratio'];
      } else if (q.includes('overheat') || q.includes('battery') || q.includes('warning') || q.includes('temperature')) {
        intent = 'Event Sequence & Root Cause: Battery Overheating';
        entities = ['Battery Temperature', 'Pack Discharge Current', 'DTC Fault Logs', 'Chiller Pump Loop'];
      } else if (q.includes('efficiency') || q.includes('city') || q.includes('highway') || q.includes('compare')) {
        intent = 'Comparative Efficiency: Urban vs Highway';
        entities = ['City Cycle Consumption', 'Highway Aerodynamics', 'Regen Recovery', 'Average Velocity'];
      } else if (q.includes('increase') || q.includes('consumption')) {
        intent = 'Temporal Energy Surge Analysis';
        entities = ['kWh/100km Trend', 'Ambient Temperature', 'Auxiliary Loads'];
      }

      const initialStages: PipelineStage[] = [
        { id: 1, name: 'Query Understanding', title: 'Intent Classification & Entity Parsing', status: 'pending' },
        { id: 2, name: 'Hybrid Retrieval', title: 'Structured Time-Series + Semantic Log Search', status: 'pending' },
        { id: 3, name: 'Deterministic Analytics', title: 'Trend, Anomaly & Correlation Calculus', status: 'pending' },
        { id: 4, name: 'Context Assembly', title: 'Grounding Payload Preparation (0 Cloud Egress)', status: 'pending' },
        { id: 5, name: 'On-Device SLM/LLM', title: 'Local Quantized SLM Inference (<2s Target)', status: 'pending' }
      ];

      let currentStages = [...initialStages];

      // Simulate sequential pipeline execution with responsive delays
      const stepTimes = [300, 700, 1100, 1450, 1850];

      stepTimes.forEach((time, index) => {
        setTimeout(() => {
          currentStages = currentStages.map((stage, sIdx) => {
            if (sIdx < index) return { ...stage, status: 'completed' };
            if (sIdx === index) return { ...stage, status: 'active' };
            return { ...stage, status: 'pending' };
          });
          onStageUpdate?.([...currentStages]);
        }, time);
      });

      // Complete all stages and construct response
      setTimeout(() => {
        currentStages = currentStages.map(s => ({ ...s, status: 'completed' }));
        onStageUpdate?.([...currentStages]);

        const response = this.buildDeterministicResponse(queryText, intent, entities, records, events, currentStages);
        resolve(response);
      }, 2100);
    });
  }

  private static buildDeterministicResponse(
    query: string,
    intent: string,
    entities: string[],
    records: HistoricalRecord[],
    events: VehicleEvent[],
    stages: PipelineStage[]
  ): VehicleGPTResponse {
    const q = query.toLowerCase();

    // SCENARIO 1: RANGE REDUCTION
    if (q.includes('range') || q.includes('decrease') || q.includes('reduction')) {
      const analysis = VehicleAnalyticsEngine.analyzeRangeAndEnergy(records);

      return {
        query,
        intent: 'Root Cause Analysis — Driving Range Reduction',
        entities,
        stages,
        summary: `Your estimated driving range decreased by approximately ${Math.abs(analysis.rangeChangePercent)}% (from ~${analysis.previousAvgRange} km to ${analysis.currentAvgRange} km) compared with the preceding evaluation period.`,
        contributingFactors: [
          `Energy consumption increased by ${analysis.consumptionChangePercent}% (from ${analysis.previousAvgConsumption} to ${analysis.currentAvgConsumption} kWh/100km).`,
          `Trip distribution shifted heavily toward urban stop-and-go driving (${analysis.previousCityPercent}% → ${analysis.currentCityPercent}% City driving).`,
          `Auxiliary HVAC cabin heating/cooling duty cycle increased by +${analysis.hvacChangePercent}%.`,
          'Higher frequency of rapid acceleration events following intersection stops.'
        ],
        evidence: analysis.evidenceItems,
        conclusion: 'Higher energy consumption, primarily during city driving and HVAC-heavy trips, is the main contributor to the observed range reduction.',
        confidenceScore: 0.98,
        latencyMs: 1420,
        tokenCount: 1140,
        model: 'On-Device Vehicle-SLM (3B-INT4)',
        relevantEvents: events.filter(e => e.category === 'ENERGY' || e.category === 'THERMAL').slice(0, 3)
      };
    }

    // SCENARIO 2: BATTERY OVERHEATING WARNING
    if (q.includes('overheat') || q.includes('battery') || q.includes('warning') || q.includes('temperature') || q.includes('abnormal')) {
      const analysis = VehicleAnalyticsEngine.analyzeThermalAnomaly(events);

      return {
        query,
        intent: 'Event Correlation & Pre-Incident Sequence Analysis',
        entities,
        stages,
        summary: 'The thermal warning (DTC_BATT_OVERHEAT_WARN_B402) was preceded by sustained high-current operation followed by a rapid escalation in battery temperature.',
        contributingFactors: [
          `Sustained peak discharge current reached ${analysis.peakCurrent} A during high-speed hill climb / overtaking.`,
          `Battery Module temperature climb rate reached +${analysis.riseRateDegreesPerMin} °C/min, surpassing normal dissipation gradients.`,
          `Pack temperature peaked at ${analysis.peakTemperature} °C, breaching the 42.0 °C OEM threshold at 10:38:05.`,
          'Active Battery Chiller Pump commanded to 100% duty cycle, successfully restoring nominal temperature within 4.2 minutes.'
        ],
        evidence: analysis.evidenceItems,
        conclusion: 'Event sequence correlation confirms that ohmic (I²R) heating under peak acceleration load outpaced passive heat rejection, triggering an automatic safety mitigation warning.',
        confidenceScore: 0.99,
        latencyMs: 1380,
        tokenCount: 1220,
        model: 'On-Device Vehicle-SLM (3B-INT4)',
        relevantEvents: analysis.precedingEvents
      };
    }

    // SCENARIO 3: EFFICIENCY COMPARISON (CITY VS HIGHWAY)
    if (q.includes('city') || q.includes('highway') || q.includes('compare') || q.includes('efficiency')) {
      const comp = VehicleAnalyticsEngine.compareCityVsHighway(records);

      return {
        query,
        intent: 'Comparative Powertrain Efficiency Assessment',
        entities,
        stages,
        summary: `Your vehicle is currently ${Math.abs(comp.differencePercent)}% more energy-intensive in City driving (${comp.cityAvgConsumption} kWh/100km) compared to Highway cruising (${comp.highwayAvgConsumption} kWh/100km).`,
        contributingFactors: [
          `City driving experiences elevated HVAC overhead (${comp.cityHvacImpact} kWh/100km penalty) due to lower average vehicle velocity (${comp.cityAvgSpeed} km/h).`,
          `Stop-and-go acceleration cycles incur inertia penalties that exceed regenerative braking recapture efficiency in heavy traffic.`,
          `Highway cruising benefits from stable electric motor operating speed and continuous cruise control engagement.`
        ],
        evidence: comp.evidenceItems,
        conclusion: 'Unlike internal combustion vehicles, electric vehicles operating in cold/hot weather can see lower efficiency in city traffic when auxiliary HVAC draws steady power while vehicle velocity is low.',
        confidenceScore: 0.96,
        latencyMs: 1510,
        tokenCount: 1080,
        model: 'On-Device Vehicle-SLM (3B-INT4)',
        relevantEvents: []
      };
    }

    // DEFAULT FALLBACK QUERY
    const fallbackAnalysis = VehicleAnalyticsEngine.analyzeRangeAndEnergy(records);
    return {
      query,
      intent: 'Vehicle Telemetry & Diagnostics Synthesis',
      entities,
      stages,
      summary: 'Vehicle intelligence audit indicates nominal powertrain function across 30 days of telemetry with isolated thermal and HVAC demand events.',
      contributingFactors: [
        `Overall average consumption is ${fallbackAnalysis.currentAvgConsumption} kWh/100km.`,
        'Powertrain battery health is optimal with no unrecoverable cell imbalance DTCs.',
        'Regenerative braking efficiency meets OEM specification (88% recovery rate).'
      ],
      evidence: fallbackAnalysis.evidenceItems.slice(0, 3),
      conclusion: 'All major vehicle subsystems conform to calibrated performance envelopes.',
      confidenceScore: 0.95,
      latencyMs: 1290,
      tokenCount: 940,
      model: 'On-Device Vehicle-SLM (3B-INT4)',
      relevantEvents: events.slice(0, 2)
    };
  }
}
