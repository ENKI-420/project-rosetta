/**
 * DARPA DSO Topic 4: Biomarkers of Mild Psychological and Neural Damage
 * Solicitation: DARPA-RA-25-02-04
 *
 * DNA-Lang Sovereign Implementation
 *
 * Focus Areas:
 * - Neurological biomarker detection
 * - Psychological stress indicators
 * - Traumatic brain injury (TBI) markers
 * - PTSD and anxiety biomarkers
 * - CCCE-guided diagnostic coherence
 */

import { LAMBDA_PHI, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC, GOLDEN_RATIO } from '../../constants';

// ============================================================================
// Neurological Constants
// ============================================================================

export const NEURO_CONSTANTS = {
  // Blood-brain barrier markers
  S100B_NORMAL: 0.1,                  // μg/L (normal)
  S100B_ELEVATED: 0.5,                // μg/L (TBI indicator)
  NSE_NORMAL: 12.5,                   // μg/L
  GFAP_NORMAL: 0.05,                  // ng/mL

  // Inflammatory markers
  IL6_NORMAL: 1.0,                    // pg/mL
  TNF_ALPHA_NORMAL: 1.0,              // pg/mL
  CRP_NORMAL: 3.0,                    // mg/L

  // Stress hormones
  CORTISOL_MORNING: 10,               // μg/dL (6-8 AM)
  CORTISOL_EVENING: 3,                // μg/dL (4 PM)
  DHEA_NORMAL: 300,                   // μg/dL

  // Neurotransmitters
  SEROTONIN_NORMAL: 150,              // ng/mL (serum)
  DOPAMINE_NORMAL: 30,                // pg/mL (plasma)
  NOREPINEPHRINE_NORMAL: 300,         // pg/mL

  // Genetic markers
  BDNF_NORMAL: 25,                    // ng/mL
  APOE4_RISK: 3.2,                    // Odds ratio for AD

  // EEG parameters
  ALPHA_POWER_NORMAL: 10,             // μV²
  THETA_BETA_RATIO_NORMAL: 2.5,

  // CCCE integration
  COHERENCE_COUPLING: LAMBDA_PHI,
  PHI_DIAGNOSTIC: PHI_THRESHOLD,
  GAMMA_TOLERANCE: GAMMA_FIXED,
} as const;

// ============================================================================
// Type Definitions
// ============================================================================

export interface Patient {
  id: string;
  demographics: Demographics;
  medicalHistory: MedicalHistory;
  samples: BioSample[];
  assessments: NeurologicalAssessment[];
  biomarkerProfiles: BiomarkerProfile[];
  riskScores: RiskScore[];
  ccceMetrics: CCCEMetrics;
}

export interface Demographics {
  age: number;
  sex: 'male' | 'female' | 'other';
  weight: number;                     // kg
  height: number;                     // cm
  ethnicity?: string;
}

export interface MedicalHistory {
  tbiHistory: TBIEvent[];
  ptsdDiagnosis: boolean;
  anxietyDisorder: boolean;
  depressionDiagnosis: boolean;
  medications: Medication[];
  substanceUse: SubstanceUse;
  sleepDisorder: boolean;
}

export interface TBIEvent {
  date: number;
  severity: 'mild' | 'moderate' | 'severe';
  mechanism: 'blast' | 'impact' | 'acceleration' | 'penetrating';
  locLossDuration: number;            // seconds
  ptaDuration: number;                // hours (post-traumatic amnesia)
  gcsScore: number;                   // Glasgow Coma Scale 3-15
}

export interface Medication {
  name: string;
  class: string;
  dosage: string;
  startDate: number;
}

export interface SubstanceUse {
  alcohol: 'none' | 'moderate' | 'heavy';
  tobacco: boolean;
  cannabis: boolean;
  other: string[];
}

export interface BioSample {
  id: string;
  type: 'blood' | 'csf' | 'saliva' | 'urine' | 'sweat';
  collectionTime: number;
  volume: number;                     // mL
  storageTemp: number;                // °C
  biomarkers: Record<string, BiomarkerReading>;
}

export interface BiomarkerReading {
  value: number;
  unit: string;
  referenceRange: [number, number];
  method: string;
  uncertainty: number;
  timestamp: number;
}

export interface NeurologicalAssessment {
  id: string;
  type: 'cognitive' | 'behavioral' | 'electrophysiological' | 'imaging';
  timestamp: number;
  results: AssessmentResult[];
  overallScore: number;
}

export interface AssessmentResult {
  test: string;
  score: number;
  percentile: number;
  interpretation: string;
}

export interface BiomarkerProfile {
  patientId: string;
  timestamp: number;
  category: 'neuroinflammation' | 'neurotrauma' | 'stress' | 'neurodegeneration';
  markers: BiomarkerSummary[];
  compositeScore: number;
  interpretation: string;
}

export interface BiomarkerSummary {
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'low' | 'elevated' | 'critical';
  percentileRank: number;
  trend?: 'increasing' | 'stable' | 'decreasing';
}

export interface RiskScore {
  patientId: string;
  timestamp: number;
  condition: 'TBI' | 'PTSD' | 'CTE' | 'depression' | 'anxiety' | 'neurodegeneration';
  probability: number;                // 0-1
  confidence: number;                 // 0-1
  contributingFactors: ContributingFactor[];
  recommendations: string[];
}

export interface ContributingFactor {
  factor: string;
  weight: number;
  direction: 'risk' | 'protective';
  evidence: string;
}

export interface CCCEMetrics {
  lambda: number;
  phi: number;
  gamma: number;
  xi: number;
  timestamp: number;
}

export interface DiagnosticPanel {
  id: string;
  name: string;
  biomarkers: string[];
  sensitivity: number;
  specificity: number;
  ppv: number;                        // Positive predictive value
  npv: number;                        // Negative predictive value
  targetCondition: string;
}

export interface LongitudinalAnalysis {
  patientId: string;
  biomarker: string;
  measurements: TimeSeriesPoint[];
  trend: TrendAnalysis;
  forecast: ForecastResult;
}

export interface TimeSeriesPoint {
  timestamp: number;
  value: number;
  uncertainty: number;
}

export interface TrendAnalysis {
  direction: 'increasing' | 'stable' | 'decreasing';
  slope: number;
  rSquared: number;
  significance: number;               // p-value
}

export interface ForecastResult {
  predictedValue: number;
  confidenceInterval: [number, number];
  horizon: number;                    // days
}

export interface PopulationStudy {
  id: string;
  name: string;
  patients: string[];                 // Patient IDs
  exposureGroup: boolean;
  biomarkerStats: BiomarkerStatistics[];
  outcomeCorrelations: Correlation[];
}

export interface BiomarkerStatistics {
  biomarker: string;
  mean: number;
  stdDev: number;
  median: number;
  iqr: [number, number];
  percentiles: Record<number, number>;
}

export interface Correlation {
  biomarker: string;
  outcome: string;
  coefficient: number;
  pValue: number;
  sampleSize: number;
}

// ============================================================================
// Biomarker Reference Database
// ============================================================================

export const BIOMARKER_PANELS: Record<string, DiagnosticPanel> = {
  tbiAcute: {
    id: 'TBI-ACUTE',
    name: 'Acute TBI Panel',
    biomarkers: ['S100B', 'GFAP', 'UCH-L1', 'NSE', 'SBDP145'],
    sensitivity: 0.92,
    specificity: 0.85,
    ppv: 0.78,
    npv: 0.95,
    targetCondition: 'Acute Traumatic Brain Injury',
  },
  ptsd: {
    id: 'PTSD-SCREEN',
    name: 'PTSD Biomarker Screen',
    biomarkers: ['cortisol', 'DHEA', 'NPY', 'PACAP', 'FKBP5'],
    sensitivity: 0.78,
    specificity: 0.72,
    ppv: 0.65,
    npv: 0.83,
    targetCondition: 'Post-Traumatic Stress Disorder',
  },
  neuroinflammation: {
    id: 'NEURO-INFLAM',
    name: 'Neuroinflammation Panel',
    biomarkers: ['IL-6', 'TNF-α', 'IL-1β', 'CRP', 'NFL'],
    sensitivity: 0.85,
    specificity: 0.80,
    ppv: 0.70,
    npv: 0.90,
    targetCondition: 'Neuroinflammation',
  },
  neurodegeneration: {
    id: 'NEURO-DEGEN',
    name: 'Neurodegeneration Risk',
    biomarkers: ['NFL', 'pTau181', 'Aβ42/40', 'GFAP', 'sTREM2'],
    sensitivity: 0.88,
    specificity: 0.82,
    ppv: 0.75,
    npv: 0.92,
    targetCondition: 'Neurodegenerative Disease Risk',
  },
};

export const BIOMARKER_REFERENCE: Record<string, { normal: [number, number]; unit: string; halfLife?: number }> = {
  'S100B': { normal: [0.02, 0.15], unit: 'μg/L', halfLife: 2 },
  'GFAP': { normal: [0.01, 0.10], unit: 'ng/mL', halfLife: 24 },
  'UCH-L1': { normal: [0, 0.32], unit: 'ng/mL', halfLife: 8 },
  'NSE': { normal: [0, 12.5], unit: 'μg/L', halfLife: 24 },
  'NFL': { normal: [0, 20], unit: 'pg/mL' },
  'pTau181': { normal: [0, 2.0], unit: 'pg/mL' },
  'Aβ42': { normal: [500, 1200], unit: 'pg/mL' },
  'cortisol': { normal: [5, 25], unit: 'μg/dL' },
  'DHEA': { normal: [200, 500], unit: 'μg/dL' },
  'IL-6': { normal: [0, 5], unit: 'pg/mL' },
  'TNF-α': { normal: [0, 8], unit: 'pg/mL' },
  'CRP': { normal: [0, 3], unit: 'mg/L' },
  'BDNF': { normal: [15, 35], unit: 'ng/mL' },
  'NPY': { normal: [50, 150], unit: 'pmol/L' },
};

// ============================================================================
// Neural Biomarker Engine
// ============================================================================

export class NeuralBiomarkerEngine {
  private patients: Map<string, Patient> = new Map();
  private studies: Map<string, PopulationStudy> = new Map();
  private ccceState: CCCEMetrics;

  constructor() {
    this.ccceState = {
      lambda: 0.95,
      phi: PHI_THRESHOLD,
      gamma: GAMMA_FIXED,
      xi: 0,
      timestamp: Date.now(),
    };
    this.updateXi();
  }

  private updateXi(): void {
    this.ccceState.xi = (this.ccceState.lambda * this.ccceState.phi) /
                        Math.max(this.ccceState.gamma, 0.001);
    this.ccceState.timestamp = Date.now();
  }

  // ==========================================================================
  // Patient Management
  // ==========================================================================

  /**
   * Create patient record
   */
  createPatient(
    demographics: Demographics,
    medicalHistory: Partial<MedicalHistory> = {}
  ): Patient {
    const id = `PAT-${Date.now().toString(36)}`;

    const fullHistory: MedicalHistory = {
      tbiHistory: medicalHistory.tbiHistory || [],
      ptsdDiagnosis: medicalHistory.ptsdDiagnosis || false,
      anxietyDisorder: medicalHistory.anxietyDisorder || false,
      depressionDiagnosis: medicalHistory.depressionDiagnosis || false,
      medications: medicalHistory.medications || [],
      substanceUse: medicalHistory.substanceUse || { alcohol: 'none', tobacco: false, cannabis: false, other: [] },
      sleepDisorder: medicalHistory.sleepDisorder || false,
    };

    const patient: Patient = {
      id,
      demographics,
      medicalHistory: fullHistory,
      samples: [],
      assessments: [],
      biomarkerProfiles: [],
      riskScores: [],
      ccceMetrics: { ...this.ccceState },
    };

    this.patients.set(id, patient);
    return patient;
  }

  /**
   * Add TBI event to patient history
   */
  addTBIEvent(patientId: string, event: TBIEvent): void {
    const patient = this.patients.get(patientId);
    if (patient) {
      patient.medicalHistory.tbiHistory.push(event);
    }
  }

  // ==========================================================================
  // Sample Collection & Analysis
  // ==========================================================================

  /**
   * Collect biosample with biomarker readings
   */
  collectSample(
    patientId: string,
    type: BioSample['type'],
    biomarkers: Record<string, number>
  ): BioSample {
    const patient = this.patients.get(patientId);
    if (!patient) {
      throw new Error(`Patient ${patientId} not found`);
    }

    const id = `SAMP-${Date.now().toString(36)}`;
    const readings: Record<string, BiomarkerReading> = {};

    for (const [name, value] of Object.entries(biomarkers)) {
      const ref = BIOMARKER_REFERENCE[name];
      readings[name] = {
        value,
        unit: ref?.unit || 'units',
        referenceRange: ref?.normal || [0, 100],
        method: 'immunoassay',
        uncertainty: value * 0.1,  // 10% CV
        timestamp: Date.now(),
      };
    }

    const sample: BioSample = {
      id,
      type,
      collectionTime: Date.now(),
      volume: type === 'blood' ? 5 : type === 'csf' ? 2 : 1,
      storageTemp: -80,
      biomarkers: readings,
    };

    patient.samples.push(sample);
    return sample;
  }

  /**
   * Generate synthetic biomarker values for simulation
   */
  generateSyntheticSample(
    patientId: string,
    condition: 'healthy' | 'mild-tbi' | 'ptsd' | 'neuroinflammation'
  ): BioSample {
    const biomarkers: Record<string, number> = {};

    // Base values from reference ranges
    for (const [name, ref] of Object.entries(BIOMARKER_REFERENCE)) {
      const midpoint = (ref.normal[0] + ref.normal[1]) / 2;
      const range = ref.normal[1] - ref.normal[0];

      let value = midpoint + (Math.random() - 0.5) * range * 0.5;

      // Modify based on condition
      switch (condition) {
        case 'mild-tbi':
          if (['S100B', 'GFAP', 'UCH-L1', 'NSE'].includes(name)) {
            value *= 2 + Math.random();  // 2-3x elevation
          }
          break;
        case 'ptsd':
          if (name === 'cortisol') value *= 1.5;
          if (name === 'DHEA') value *= 0.7;
          if (name === 'NPY') value *= 0.6;
          break;
        case 'neuroinflammation':
          if (['IL-6', 'TNF-α', 'CRP'].includes(name)) {
            value *= 3 + Math.random() * 2;
          }
          break;
      }

      biomarkers[name] = Math.max(0, value);
    }

    return this.collectSample(patientId, 'blood', biomarkers);
  }

  // ==========================================================================
  // Biomarker Analysis
  // ==========================================================================

  /**
   * Analyze biomarker profile
   */
  analyzeBiomarkers(patientId: string, sampleId: string): BiomarkerProfile {
    const patient = this.patients.get(patientId);
    if (!patient) {
      throw new Error(`Patient ${patientId} not found`);
    }

    const sample = patient.samples.find(s => s.id === sampleId);
    if (!sample) {
      throw new Error(`Sample ${sampleId} not found`);
    }

    const markers: BiomarkerSummary[] = [];
    let category: BiomarkerProfile['category'] = 'stress';

    for (const [name, reading] of Object.entries(sample.biomarkers)) {
      const [low, high] = reading.referenceRange;
      const value = reading.value;

      let status: BiomarkerSummary['status'] = 'normal';
      if (value < low * 0.8) status = 'low';
      else if (value > high * 1.5) status = 'critical';
      else if (value > high) status = 'elevated';

      // Calculate percentile rank (simplified normal distribution)
      const mean = (low + high) / 2;
      const stdDev = (high - low) / 4;
      const zScore = (value - mean) / stdDev;
      const percentile = this.normalCDF(zScore) * 100;

      markers.push({
        name,
        value,
        unit: reading.unit,
        status,
        percentileRank: percentile,
      });

      // Determine category from elevated markers
      if (status === 'elevated' || status === 'critical') {
        if (['S100B', 'GFAP', 'UCH-L1', 'NSE'].includes(name)) {
          category = 'neurotrauma';
        } else if (['IL-6', 'TNF-α', 'CRP'].includes(name)) {
          category = 'neuroinflammation';
        } else if (['NFL', 'pTau181'].includes(name)) {
          category = 'neurodegeneration';
        }
      }
    }

    // Calculate composite score
    const elevatedCount = markers.filter(m => m.status === 'elevated' || m.status === 'critical').length;
    const compositeScore = elevatedCount / markers.length * 100;

    // Generate interpretation
    let interpretation = 'Biomarker profile within normal limits.';
    if (compositeScore > 50) {
      interpretation = `Significant ${category} markers detected. Further evaluation recommended.`;
    } else if (compositeScore > 20) {
      interpretation = `Mild elevation in ${category} markers. Monitor and retest in 2-4 weeks.`;
    }

    const profile: BiomarkerProfile = {
      patientId,
      timestamp: Date.now(),
      category,
      markers,
      compositeScore,
      interpretation,
    };

    patient.biomarkerProfiles.push(profile);
    return profile;
  }

  private normalCDF(z: number): number {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = z < 0 ? -1 : 1;
    z = Math.abs(z) / Math.sqrt(2);

    const t = 1.0 / (1.0 + p * z);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);

    return 0.5 * (1.0 + sign * y);
  }

  // ==========================================================================
  // Risk Assessment
  // ==========================================================================

  /**
   * Calculate TBI risk score
   */
  assessTBIRisk(patientId: string): RiskScore {
    const patient = this.patients.get(patientId);
    if (!patient) {
      throw new Error(`Patient ${patientId} not found`);
    }

    const factors: ContributingFactor[] = [];
    let probability = 0.1;  // Base rate

    // Check biomarker elevations
    const latestProfile = patient.biomarkerProfiles[patient.biomarkerProfiles.length - 1];
    if (latestProfile) {
      for (const marker of latestProfile.markers) {
        if (['S100B', 'GFAP', 'UCH-L1', 'NSE'].includes(marker.name)) {
          if (marker.status === 'critical') {
            probability += 0.25;
            factors.push({
              factor: `${marker.name} critically elevated (${marker.value} ${marker.unit})`,
              weight: 0.25,
              direction: 'risk',
              evidence: 'Strong association with acute TBI',
            });
          } else if (marker.status === 'elevated') {
            probability += 0.15;
            factors.push({
              factor: `${marker.name} elevated (${marker.value} ${marker.unit})`,
              weight: 0.15,
              direction: 'risk',
              evidence: 'Moderate association with TBI',
            });
          }
        }
      }
    }

    // Check medical history
    if (patient.medicalHistory.tbiHistory.length > 0) {
      const recentTBI = patient.medicalHistory.tbiHistory
        .filter(t => Date.now() - t.date < 365 * 24 * 3600 * 1000);
      if (recentTBI.length > 0) {
        probability += 0.2;
        factors.push({
          factor: 'Recent TBI history',
          weight: 0.2,
          direction: 'risk',
          evidence: 'Prior TBI increases vulnerability',
        });
      }
    }

    // Demographic factors
    if (patient.demographics.age > 65) {
      probability += 0.1;
      factors.push({
        factor: 'Age > 65',
        weight: 0.1,
        direction: 'risk',
        evidence: 'Increased risk in elderly',
      });
    }

    // Generate recommendations
    const recommendations: string[] = [];
    if (probability > 0.5) {
      recommendations.push('Urgent neuroimaging (CT/MRI) recommended');
      recommendations.push('Neurological consultation within 24 hours');
      recommendations.push('Cognitive rest and symptom monitoring');
    } else if (probability > 0.3) {
      recommendations.push('Consider neuroimaging if symptoms persist');
      recommendations.push('Follow-up biomarker testing in 24-48 hours');
      recommendations.push('Symptom tracking and activity modification');
    } else {
      recommendations.push('Routine follow-up as needed');
      recommendations.push('Return precautions education');
    }

    const riskScore: RiskScore = {
      patientId,
      timestamp: Date.now(),
      condition: 'TBI',
      probability: Math.min(0.99, probability),
      confidence: 0.7 + factors.length * 0.05,
      contributingFactors: factors,
      recommendations,
    };

    patient.riskScores.push(riskScore);
    return riskScore;
  }

  /**
   * Assess PTSD risk
   */
  assessPTSDRisk(patientId: string): RiskScore {
    const patient = this.patients.get(patientId);
    if (!patient) {
      throw new Error(`Patient ${patientId} not found`);
    }

    const factors: ContributingFactor[] = [];
    let probability = 0.05;  // Base rate

    // Check stress biomarkers
    const latestProfile = patient.biomarkerProfiles[patient.biomarkerProfiles.length - 1];
    if (latestProfile) {
      for (const marker of latestProfile.markers) {
        if (marker.name === 'cortisol' && marker.status === 'elevated') {
          probability += 0.15;
          factors.push({
            factor: 'Elevated cortisol',
            weight: 0.15,
            direction: 'risk',
            evidence: 'HPA axis dysregulation',
          });
        }
        if (marker.name === 'DHEA' && marker.status === 'low') {
          probability += 0.1;
          factors.push({
            factor: 'Low DHEA',
            weight: 0.1,
            direction: 'risk',
            evidence: 'Reduced stress resilience',
          });
        }
        if (marker.name === 'NPY' && marker.status === 'low') {
          probability += 0.15;
          factors.push({
            factor: 'Low neuropeptide Y',
            weight: 0.15,
            direction: 'risk',
            evidence: 'Associated with PTSD vulnerability',
          });
        }
      }
    }

    // Medical history factors
    if (patient.medicalHistory.tbiHistory.length > 0) {
      probability += 0.15;
      factors.push({
        factor: 'History of TBI',
        weight: 0.15,
        direction: 'risk',
        evidence: 'TBI increases PTSD risk',
      });
    }

    if (patient.medicalHistory.depressionDiagnosis) {
      probability += 0.1;
      factors.push({
        factor: 'Depression diagnosis',
        weight: 0.1,
        direction: 'risk',
        evidence: 'Comorbidity common',
      });
    }

    // Substance use
    if (patient.medicalHistory.substanceUse.alcohol === 'heavy') {
      probability += 0.1;
      factors.push({
        factor: 'Heavy alcohol use',
        weight: 0.1,
        direction: 'risk',
        evidence: 'Self-medication pattern',
      });
    }

    // Recommendations
    const recommendations: string[] = [];
    if (probability > 0.4) {
      recommendations.push('Psychiatric evaluation recommended');
      recommendations.push('Consider trauma-focused therapy (CPT, PE, EMDR)');
      recommendations.push('Assess for suicidal ideation');
    } else if (probability > 0.2) {
      recommendations.push('Psychological screening recommended');
      recommendations.push('Stress management resources');
      recommendations.push('Follow-up in 2-4 weeks');
    } else {
      recommendations.push('Maintain regular check-ups');
      recommendations.push('Resilience-building activities encouraged');
    }

    const riskScore: RiskScore = {
      patientId,
      timestamp: Date.now(),
      condition: 'PTSD',
      probability: Math.min(0.99, probability),
      confidence: 0.65 + factors.length * 0.05,
      contributingFactors: factors,
      recommendations,
    };

    patient.riskScores.push(riskScore);
    return riskScore;
  }

  // ==========================================================================
  // Longitudinal Analysis
  // ==========================================================================

  /**
   * Analyze biomarker trends over time
   */
  analyzeTrend(patientId: string, biomarkerName: string): LongitudinalAnalysis {
    const patient = this.patients.get(patientId);
    if (!patient) {
      throw new Error(`Patient ${patientId} not found`);
    }

    // Collect all measurements of this biomarker
    const measurements: TimeSeriesPoint[] = [];
    for (const sample of patient.samples) {
      const reading = sample.biomarkers[biomarkerName];
      if (reading) {
        measurements.push({
          timestamp: reading.timestamp,
          value: reading.value,
          uncertainty: reading.uncertainty,
        });
      }
    }

    // Sort by timestamp
    measurements.sort((a, b) => a.timestamp - b.timestamp);

    // Linear regression for trend
    const n = measurements.length;
    if (n < 2) {
      return {
        patientId,
        biomarker: biomarkerName,
        measurements,
        trend: {
          direction: 'stable',
          slope: 0,
          rSquared: 0,
          significance: 1,
        },
        forecast: {
          predictedValue: measurements[0]?.value || 0,
          confidenceInterval: [0, 0],
          horizon: 30,
        },
      };
    }

    // Normalize timestamps to days
    const t0 = measurements[0].timestamp;
    const xData = measurements.map(m => (m.timestamp - t0) / (24 * 3600 * 1000));
    const yData = measurements.map(m => m.value);

    // Linear regression
    const sumX = xData.reduce((a, b) => a + b, 0);
    const sumY = yData.reduce((a, b) => a + b, 0);
    const sumXY = xData.reduce((sum, x, i) => sum + x * yData[i], 0);
    const sumX2 = xData.reduce((sum, x) => sum + x * x, 0);
    const sumY2 = yData.reduce((sum, y) => sum + y * y, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // R-squared
    const yMean = sumY / n;
    const ssTotal = yData.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
    const ssResidual = yData.reduce((sum, y, i) => sum + Math.pow(y - (slope * xData[i] + intercept), 2), 0);
    const rSquared = 1 - ssResidual / ssTotal;

    // Significance (simplified)
    const se = Math.sqrt(ssResidual / (n - 2));
    const slopeStdErr = se / Math.sqrt(sumX2 - sumX * sumX / n);
    const tStat = slope / slopeStdErr;
    const significance = Math.exp(-Math.abs(tStat) / 2);  // Approximate p-value

    // Determine direction
    let direction: TrendAnalysis['direction'] = 'stable';
    if (significance < 0.05) {
      direction = slope > 0 ? 'increasing' : 'decreasing';
    }

    // Forecast
    const horizonDays = 30;
    const lastX = xData[xData.length - 1];
    const predictedValue = slope * (lastX + horizonDays) + intercept;
    const predictionSE = se * Math.sqrt(1 + 1/n + Math.pow(lastX + horizonDays - sumX/n, 2) / (sumX2 - sumX*sumX/n));

    return {
      patientId,
      biomarker: biomarkerName,
      measurements,
      trend: {
        direction,
        slope,
        rSquared,
        significance,
      },
      forecast: {
        predictedValue: Math.max(0, predictedValue),
        confidenceInterval: [
          Math.max(0, predictedValue - 1.96 * predictionSE),
          predictedValue + 1.96 * predictionSE,
        ],
        horizon: horizonDays,
      },
    };
  }

  // ==========================================================================
  // Population Studies
  // ==========================================================================

  /**
   * Create population study
   */
  createStudy(name: string, patientIds: string[], isExposureGroup: boolean): PopulationStudy {
    const id = `STUDY-${Date.now().toString(36)}`;

    // Compute biomarker statistics
    const biomarkerStats: BiomarkerStatistics[] = [];
    const biomarkerValues: Record<string, number[]> = {};

    for (const patientId of patientIds) {
      const patient = this.patients.get(patientId);
      if (patient && patient.samples.length > 0) {
        const latestSample = patient.samples[patient.samples.length - 1];
        for (const [name, reading] of Object.entries(latestSample.biomarkers)) {
          if (!biomarkerValues[name]) biomarkerValues[name] = [];
          biomarkerValues[name].push(reading.value);
        }
      }
    }

    for (const [name, values] of Object.entries(biomarkerValues)) {
      if (values.length < 2) continue;

      values.sort((a, b) => a - b);
      const n = values.length;
      const mean = values.reduce((a, b) => a + b, 0) / n;
      const stdDev = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (n - 1));
      const median = values[Math.floor(n / 2)];
      const q1 = values[Math.floor(n * 0.25)];
      const q3 = values[Math.floor(n * 0.75)];

      biomarkerStats.push({
        biomarker: name,
        mean,
        stdDev,
        median,
        iqr: [q1, q3],
        percentiles: {
          5: values[Math.floor(n * 0.05)],
          25: q1,
          50: median,
          75: q3,
          95: values[Math.floor(n * 0.95)],
        },
      });
    }

    const study: PopulationStudy = {
      id,
      name,
      patients: patientIds,
      exposureGroup: isExposureGroup,
      biomarkerStats,
      outcomeCorrelations: [],
    };

    this.studies.set(id, study);
    return study;
  }

  /**
   * Compare two population studies
   */
  compareStudies(study1Id: string, study2Id: string): Record<string, { tStat: number; pValue: number; effectSize: number }> {
    const study1 = this.studies.get(study1Id);
    const study2 = this.studies.get(study2Id);

    if (!study1 || !study2) {
      throw new Error('One or both studies not found');
    }

    const results: Record<string, { tStat: number; pValue: number; effectSize: number }> = {};

    for (const stat1 of study1.biomarkerStats) {
      const stat2 = study2.biomarkerStats.find(s => s.biomarker === stat1.biomarker);
      if (!stat2) continue;

      // Two-sample t-test
      const n1 = study1.patients.length;
      const n2 = study2.patients.length;
      const pooledVar = ((n1 - 1) * stat1.stdDev * stat1.stdDev + (n2 - 1) * stat2.stdDev * stat2.stdDev) / (n1 + n2 - 2);
      const se = Math.sqrt(pooledVar * (1/n1 + 1/n2));
      const tStat = (stat1.mean - stat2.mean) / se;

      // Approximate p-value
      const df = n1 + n2 - 2;
      const pValue = 2 * (1 - this.normalCDF(Math.abs(tStat) * Math.sqrt(df / (df + tStat * tStat))));

      // Cohen's d effect size
      const effectSize = (stat1.mean - stat2.mean) / Math.sqrt(pooledVar);

      results[stat1.biomarker] = { tStat, pValue, effectSize };
    }

    return results;
  }

  // ==========================================================================
  // CCCE Integration
  // ==========================================================================

  /**
   * Get current CCCE metrics
   */
  getMetrics(): CCCEMetrics {
    return { ...this.ccceState };
  }

  /**
   * Apply phase-conjugate healing
   */
  heal(): CCCEMetrics {
    if (this.ccceState.gamma > 0.3) {
      this.ccceState.gamma *= (1 - CHI_PC);
      this.ccceState.lambda = Math.min(1, this.ccceState.lambda * (1 + CHI_PC * 0.5));
      this.updateXi();
    }
    return this.getMetrics();
  }

  /**
   * Get all patients
   */
  getPatients(): Patient[] {
    return Array.from(this.patients.values());
  }

  /**
   * Get patient by ID
   */
  getPatient(id: string): Patient | undefined {
    return this.patients.get(id);
  }

  /**
   * Get all studies
   */
  getStudies(): PopulationStudy[] {
    return Array.from(this.studies.values());
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const neuralBiomarkerEngine = new NeuralBiomarkerEngine();
