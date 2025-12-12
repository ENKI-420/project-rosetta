/**
 * DARPA I2O Topic 15: AI and the Future of Work
 * DNA-Lang Sovereign Computing Platform
 *
 * Solicitation: DARPA-RA-25-02-15
 *
 * Surfacing Task-Level Opportunities for AI Adoption
 * Analysis framework for identifying which tasks within occupations
 * are amenable to AI automation, augmentation, or human-AI collaboration.
 *
 * CCCE Integration:
 * - Lambda (Λ): Task decomposition coherence
 * - Phi (Φ): Human-AI collaboration integration
 * - Gamma (Γ): Workforce transition decoherence
 * - Xi (Ξ): Productivity gain negentropic efficiency
 */

import {
  LAMBDA_PHI,
  PHI_THRESHOLD,
  GAMMA_FIXED,
  CHI_PC,
} from '../../constants';

// ============================================================================
// AI-Work Constants
// ============================================================================

/** Minimum task granularity for analysis [minutes] */
const MIN_TASK_DURATION = 5;

/** Maximum reasonable automation potential */
const MAX_AUTOMATION_POTENTIAL = 0.95;

/** Human oversight requirement threshold */
const OVERSIGHT_THRESHOLD = 0.7;

/** Skill transfer learning rate */
const SKILL_TRANSFER_RATE = 0.15;

/** Productivity multiplier ceiling */
const MAX_PRODUCTIVITY_MULTIPLIER = 10;

/** Collaboration efficiency baseline */
const COLLABORATION_BASELINE = 0.6;

// ============================================================================
// Type Definitions
// ============================================================================

export type TaskCategory =
  | 'cognitive_routine'
  | 'cognitive_nonroutine'
  | 'manual_routine'
  | 'manual_nonroutine'
  | 'interpersonal'
  | 'creative'
  | 'analytical'
  | 'supervisory';

export type AICapability =
  | 'pattern_recognition'
  | 'natural_language'
  | 'decision_support'
  | 'process_automation'
  | 'predictive_analytics'
  | 'content_generation'
  | 'physical_manipulation'
  | 'perception';

export type AdoptionMode =
  | 'full_automation'
  | 'augmentation'
  | 'collaboration'
  | 'human_led'
  | 'not_applicable';

export type ImpactType =
  | 'displacement'
  | 'augmentation'
  | 'transformation'
  | 'creation'
  | 'neutral';

export type SkillLevel =
  | 'entry'
  | 'intermediate'
  | 'advanced'
  | 'expert'
  | 'specialist';

export interface Task {
  id: string;
  name: string;
  description: string;
  category: TaskCategory;
  duration_minutes: number;
  frequency_per_week: number;
  skill_requirements: Map<string, SkillLevel>;
  cognitive_load: number;
  physical_demand: number;
  social_interaction: number;
  creativity_required: number;
  judgment_required: number;
  ccce_lambda: number;
}

export interface Occupation {
  id: string;
  title: string;
  onet_code?: string;
  tasks: Task[];
  total_hours_per_week: number;
  median_wage_hourly: number;
  employment_count: number;
  growth_rate_annual: number;
  education_required: string;
  ccce_phi: number;
}

export interface AISystem {
  id: string;
  name: string;
  capabilities: AICapability[];
  maturity_level: number;
  deployment_cost: number;
  operating_cost_hourly: number;
  accuracy: number;
  speed_multiplier: number;
  error_rate: number;
  requires_oversight: boolean;
  ccce_gamma: number;
}

export interface TaskAIFit {
  task_id: string;
  ai_system_id: string;
  automation_potential: number;
  augmentation_potential: number;
  recommended_mode: AdoptionMode;
  productivity_gain: number;
  quality_impact: number;
  implementation_complexity: number;
  time_to_value_months: number;
  risk_score: number;
  ccce_xi: number;
}

export interface WorkforceImpact {
  occupation_id: string;
  total_tasks: number;
  automatable_tasks: number;
  augmentable_tasks: number;
  human_only_tasks: number;
  hours_displaced: number;
  hours_augmented: number;
  productivity_multiplier: number;
  wage_impact_percent: number;
  employment_impact: ImpactType;
  reskilling_needs: Map<string, number>;
  transition_timeline_months: number;
}

export interface CollaborationModel {
  id: string;
  name: string;
  human_role: string;
  ai_role: string;
  interaction_frequency: number;
  handoff_points: string[];
  oversight_requirements: number;
  efficiency_gain: number;
  error_reduction: number;
  job_satisfaction_impact: number;
  ccce_metrics: {
    lambda: number;
    phi: number;
    gamma: number;
    xi: number;
  };
}

export interface TransitionPathway {
  from_occupation_id: string;
  to_occupation_id: string;
  skill_gap: Map<string, number>;
  training_hours_required: number;
  wage_change_percent: number;
  feasibility_score: number;
  time_to_transition_months: number;
  support_programs: string[];
}

export interface SectorAnalysis {
  sector_name: string;
  occupations: Occupation[];
  total_employment: number;
  ai_exposure_index: number;
  automation_risk: number;
  augmentation_opportunity: number;
  net_job_impact: number;
  productivity_potential: number;
  investment_required: number;
  timeline_to_impact_years: number;
}

export interface PolicyRecommendation {
  id: string;
  title: string;
  description: string;
  target_stakeholder: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimated_impact: number;
  implementation_cost: number;
  timeline_months: number;
  dependencies: string[];
}

export interface AIWorkMetrics {
  lambda: number;
  phi: number;
  gamma: number;
  xi: number;
  total_occupations: number;
  total_tasks_analyzed: number;
  average_automation_potential: number;
  average_augmentation_potential: number;
  workforce_at_risk_percent: number;
  productivity_gain_potential: number;
  reskilling_hours_needed: number;
}

// ============================================================================
// AI Future of Work Engine
// ============================================================================

export class AIFutureWorkEngine {
  private tasks: Map<string, Task> = new Map();
  private occupations: Map<string, Occupation> = new Map();
  private aiSystems: Map<string, AISystem> = new Map();
  private taskFits: Map<string, TaskAIFit[]> = new Map();
  private impacts: Map<string, WorkforceImpact> = new Map();
  private collaborationModels: Map<string, CollaborationModel> = new Map();
  private transitionPathways: Map<string, TransitionPathway[]> = new Map();

  // CCCE metrics
  private lambda: number = PHI_THRESHOLD;
  private phi: number = PHI_THRESHOLD;
  private gamma: number = GAMMA_FIXED;

  constructor() {
    this.initializeDefaultSystems();
  }

  // --------------------------------------------------------------------------
  // Initialization
  // --------------------------------------------------------------------------

  private initializeDefaultSystems(): void {
    // Initialize default AI systems
    const defaultSystems: AISystem[] = [
      {
        id: 'llm_general',
        name: 'Large Language Model (General)',
        capabilities: ['natural_language', 'content_generation', 'decision_support'],
        maturity_level: 0.85,
        deployment_cost: 50000,
        operating_cost_hourly: 0.10,
        accuracy: 0.92,
        speed_multiplier: 50,
        error_rate: 0.08,
        requires_oversight: true,
        ccce_gamma: 0.08,
      },
      {
        id: 'rpa_platform',
        name: 'Robotic Process Automation',
        capabilities: ['process_automation', 'pattern_recognition'],
        maturity_level: 0.90,
        deployment_cost: 25000,
        operating_cost_hourly: 0.02,
        accuracy: 0.99,
        speed_multiplier: 100,
        error_rate: 0.01,
        requires_oversight: false,
        ccce_gamma: 0.05,
      },
      {
        id: 'ml_analytics',
        name: 'ML Analytics Platform',
        capabilities: ['predictive_analytics', 'pattern_recognition', 'decision_support'],
        maturity_level: 0.80,
        deployment_cost: 75000,
        operating_cost_hourly: 0.15,
        accuracy: 0.88,
        speed_multiplier: 20,
        error_rate: 0.12,
        requires_oversight: true,
        ccce_gamma: 0.10,
      },
      {
        id: 'computer_vision',
        name: 'Computer Vision System',
        capabilities: ['perception', 'pattern_recognition'],
        maturity_level: 0.82,
        deployment_cost: 40000,
        operating_cost_hourly: 0.05,
        accuracy: 0.95,
        speed_multiplier: 200,
        error_rate: 0.05,
        requires_oversight: false,
        ccce_gamma: 0.06,
      },
      {
        id: 'conversational_ai',
        name: 'Conversational AI Agent',
        capabilities: ['natural_language', 'decision_support'],
        maturity_level: 0.78,
        deployment_cost: 30000,
        operating_cost_hourly: 0.08,
        accuracy: 0.85,
        speed_multiplier: 10,
        error_rate: 0.15,
        requires_oversight: true,
        ccce_gamma: 0.12,
      },
    ];

    defaultSystems.forEach((sys) => this.aiSystems.set(sys.id, sys));
  }

  // --------------------------------------------------------------------------
  // Task Analysis
  // --------------------------------------------------------------------------

  /**
   * Define a task for analysis
   */
  defineTask(config: {
    name: string;
    description: string;
    category: TaskCategory;
    duration_minutes: number;
    frequency_per_week: number;
    skills: { name: string; level: SkillLevel }[];
    cognitive_load?: number;
    physical_demand?: number;
    social_interaction?: number;
    creativity_required?: number;
    judgment_required?: number;
  }): Task {
    const id = `task_${config.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;

    const skillMap = new Map<string, SkillLevel>();
    config.skills.forEach((s) => skillMap.set(s.name, s.level));

    const task: Task = {
      id,
      name: config.name,
      description: config.description,
      category: config.category,
      duration_minutes: Math.max(MIN_TASK_DURATION, config.duration_minutes),
      frequency_per_week: config.frequency_per_week,
      skill_requirements: skillMap,
      cognitive_load: config.cognitive_load ?? 0.5,
      physical_demand: config.physical_demand ?? 0.1,
      social_interaction: config.social_interaction ?? 0.3,
      creativity_required: config.creativity_required ?? 0.3,
      judgment_required: config.judgment_required ?? 0.4,
      ccce_lambda: this.calculateTaskLambda(config),
    };

    this.tasks.set(id, task);
    this.updateMetrics();

    return task;
  }

  private calculateTaskLambda(config: {
    category: TaskCategory;
    cognitive_load?: number;
    creativity_required?: number;
  }): number {
    // Lambda based on task structure/analyzability
    const categoryFactors: Record<TaskCategory, number> = {
      cognitive_routine: 0.95,
      manual_routine: 0.90,
      cognitive_nonroutine: 0.75,
      manual_nonroutine: 0.70,
      analytical: 0.85,
      interpersonal: 0.65,
      creative: 0.55,
      supervisory: 0.60,
    };

    const baseLambda = categoryFactors[config.category];
    const cognitiveAdjust = (config.cognitive_load ?? 0.5) * 0.1;
    const creativityPenalty = (config.creativity_required ?? 0.3) * 0.15;

    return Math.max(0.5, baseLambda - cognitiveAdjust - creativityPenalty);
  }

  // --------------------------------------------------------------------------
  // Occupation Management
  // --------------------------------------------------------------------------

  /**
   * Define an occupation with its constituent tasks
   */
  defineOccupation(config: {
    title: string;
    onet_code?: string;
    task_ids: string[];
    median_wage_hourly: number;
    employment_count: number;
    growth_rate_annual?: number;
    education_required: string;
  }): Occupation {
    const id = `occ_${config.title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;

    const tasks = config.task_ids
      .map((tid) => this.tasks.get(tid))
      .filter((t): t is Task => t !== undefined);

    // Calculate total hours from tasks
    const totalMinutes = tasks.reduce((sum, t) => {
      return sum + t.duration_minutes * t.frequency_per_week;
    }, 0);

    const occupation: Occupation = {
      id,
      title: config.title,
      onet_code: config.onet_code,
      tasks,
      total_hours_per_week: totalMinutes / 60,
      median_wage_hourly: config.median_wage_hourly,
      employment_count: config.employment_count,
      growth_rate_annual: config.growth_rate_annual ?? 0,
      education_required: config.education_required,
      ccce_phi: this.calculateOccupationPhi(tasks),
    };

    this.occupations.set(id, occupation);
    this.updateMetrics();

    return occupation;
  }

  private calculateOccupationPhi(tasks: Task[]): number {
    if (tasks.length === 0) return PHI_THRESHOLD;

    // Phi based on task diversity and integration potential
    const avgLambda = tasks.reduce((sum, t) => sum + t.ccce_lambda, 0) / tasks.length;
    const taskDiversity = Math.min(1, tasks.length / 20);
    const integrationFactor = 1 - this.calculateTaskOverlap(tasks);

    return PHI_THRESHOLD + (1 - PHI_THRESHOLD) * (0.5 * avgLambda + 0.3 * taskDiversity + 0.2 * integrationFactor);
  }

  private calculateTaskOverlap(tasks: Task[]): number {
    // Calculate skill overlap between tasks
    if (tasks.length < 2) return 0;

    let overlapCount = 0;
    let totalPairs = 0;

    for (let i = 0; i < tasks.length; i++) {
      for (let j = i + 1; j < tasks.length; j++) {
        const skills1 = new Set(tasks[i].skill_requirements.keys());
        const skills2 = new Set(tasks[j].skill_requirements.keys());
        const intersection = new Set([...skills1].filter((s) => skills2.has(s)));
        overlapCount += intersection.size / Math.max(skills1.size, skills2.size, 1);
        totalPairs++;
      }
    }

    return totalPairs > 0 ? overlapCount / totalPairs : 0;
  }

  // --------------------------------------------------------------------------
  // AI Fit Analysis
  // --------------------------------------------------------------------------

  /**
   * Analyze fit between a task and AI system
   */
  analyzeTaskAIFit(taskId: string, aiSystemId: string): TaskAIFit {
    const task = this.tasks.get(taskId);
    const aiSystem = this.aiSystems.get(aiSystemId);

    if (!task) throw new Error(`Task ${taskId} not found`);
    if (!aiSystem) throw new Error(`AI System ${aiSystemId} not found`);

    // Calculate automation potential
    const automationPotential = this.calculateAutomationPotential(task, aiSystem);

    // Calculate augmentation potential
    const augmentationPotential = this.calculateAugmentationPotential(task, aiSystem);

    // Determine recommended mode
    const recommendedMode = this.determineAdoptionMode(
      automationPotential,
      augmentationPotential,
      task,
      aiSystem
    );

    // Calculate productivity gain
    const productivityGain = this.calculateProductivityGain(
      task,
      aiSystem,
      recommendedMode
    );

    // Calculate quality impact
    const qualityImpact = this.calculateQualityImpact(task, aiSystem, recommendedMode);

    // Implementation complexity
    const implementationComplexity = this.calculateImplementationComplexity(
      task,
      aiSystem
    );

    // Time to value
    const timeToValue = this.calculateTimeToValue(implementationComplexity);

    // Risk score
    const riskScore = this.calculateRiskScore(task, aiSystem, recommendedMode);

    const fit: TaskAIFit = {
      task_id: taskId,
      ai_system_id: aiSystemId,
      automation_potential: automationPotential,
      augmentation_potential: augmentationPotential,
      recommended_mode: recommendedMode,
      productivity_gain: productivityGain,
      quality_impact: qualityImpact,
      implementation_complexity: implementationComplexity,
      time_to_value_months: timeToValue,
      risk_score: riskScore,
      ccce_xi: this.calculateFitXi(automationPotential, augmentationPotential, riskScore),
    };

    // Store fit
    if (!this.taskFits.has(taskId)) {
      this.taskFits.set(taskId, []);
    }
    this.taskFits.get(taskId)!.push(fit);

    this.updateMetrics();
    return fit;
  }

  private calculateAutomationPotential(task: Task, aiSystem: AISystem): number {
    // Base potential from task category
    const categoryPotential: Record<TaskCategory, number> = {
      cognitive_routine: 0.90,
      manual_routine: 0.85,
      cognitive_nonroutine: 0.50,
      manual_nonroutine: 0.40,
      analytical: 0.70,
      interpersonal: 0.30,
      creative: 0.25,
      supervisory: 0.35,
    };

    let potential = categoryPotential[task.category];

    // Adjust based on AI capabilities match
    const capabilityMatch = this.calculateCapabilityMatch(task, aiSystem);
    potential *= capabilityMatch;

    // Penalty for high judgment/creativity requirements
    potential *= (1 - task.judgment_required * 0.3);
    potential *= (1 - task.creativity_required * 0.4);

    // Adjust for AI system maturity
    potential *= aiSystem.maturity_level;

    // Cap at maximum
    return Math.min(MAX_AUTOMATION_POTENTIAL, Math.max(0, potential));
  }

  private calculateAugmentationPotential(task: Task, aiSystem: AISystem): number {
    // Augmentation works best for cognitive tasks
    const categoryAugment: Record<TaskCategory, number> = {
      cognitive_routine: 0.85,
      manual_routine: 0.60,
      cognitive_nonroutine: 0.80,
      manual_nonroutine: 0.55,
      analytical: 0.90,
      interpersonal: 0.65,
      creative: 0.75,
      supervisory: 0.70,
    };

    let potential = categoryAugment[task.category];

    // Boost for high cognitive load (AI can help)
    potential += task.cognitive_load * 0.15;

    // Capability match
    const capabilityMatch = this.calculateCapabilityMatch(task, aiSystem);
    potential *= (0.5 + 0.5 * capabilityMatch);

    // AI accuracy matters more for augmentation
    potential *= (0.5 + 0.5 * aiSystem.accuracy);

    return Math.min(1, Math.max(0, potential));
  }

  private calculateCapabilityMatch(task: Task, aiSystem: AISystem): number {
    // Map task categories to required AI capabilities
    const taskCapabilities: Record<TaskCategory, AICapability[]> = {
      cognitive_routine: ['process_automation', 'pattern_recognition'],
      manual_routine: ['physical_manipulation', 'perception'],
      cognitive_nonroutine: ['decision_support', 'natural_language', 'predictive_analytics'],
      manual_nonroutine: ['perception', 'physical_manipulation', 'decision_support'],
      analytical: ['predictive_analytics', 'pattern_recognition', 'decision_support'],
      interpersonal: ['natural_language', 'decision_support'],
      creative: ['content_generation', 'natural_language'],
      supervisory: ['decision_support', 'predictive_analytics'],
    };

    const required = taskCapabilities[task.category];
    const available = new Set(aiSystem.capabilities);

    const matched = required.filter((cap) => available.has(cap)).length;
    return matched / required.length;
  }

  private determineAdoptionMode(
    automationPotential: number,
    augmentationPotential: number,
    task: Task,
    aiSystem: AISystem
  ): AdoptionMode {
    // High automation potential and acceptable risk = full automation
    if (automationPotential > 0.8 && task.judgment_required < 0.3 && !aiSystem.requires_oversight) {
      return 'full_automation';
    }

    // High automation but needs oversight = collaboration
    if (automationPotential > 0.7 && aiSystem.requires_oversight) {
      return 'collaboration';
    }

    // Good augmentation potential = augmentation
    if (augmentationPotential > 0.6) {
      return 'augmentation';
    }

    // Moderate automation = collaboration
    if (automationPotential > 0.5) {
      return 'collaboration';
    }

    // Low AI fit = human led
    if (automationPotential < 0.3 && augmentationPotential < 0.4) {
      return 'human_led';
    }

    // Default to collaboration
    return 'collaboration';
  }

  private calculateProductivityGain(
    task: Task,
    aiSystem: AISystem,
    mode: AdoptionMode
  ): number {
    const modeMultipliers: Record<AdoptionMode, number> = {
      full_automation: aiSystem.speed_multiplier,
      augmentation: 1 + (aiSystem.speed_multiplier - 1) * 0.3,
      collaboration: 1 + (aiSystem.speed_multiplier - 1) * 0.5,
      human_led: 1.1,
      not_applicable: 1.0,
    };

    let gain = modeMultipliers[mode];

    // Adjust for task complexity
    gain *= (1 - task.cognitive_load * 0.2);

    // Cap at maximum
    return Math.min(MAX_PRODUCTIVITY_MULTIPLIER, Math.max(1, gain));
  }

  private calculateQualityImpact(
    task: Task,
    aiSystem: AISystem,
    mode: AdoptionMode
  ): number {
    // Positive = quality improvement, negative = quality risk
    let impact = 0;

    // AI accuracy
    impact += (aiSystem.accuracy - 0.9) * 2; // Baseline 90%

    // Error rate impact
    impact -= aiSystem.error_rate * 0.5;

    // Mode-specific adjustments
    const modeAdjust: Record<AdoptionMode, number> = {
      full_automation: -0.1, // Risk of errors
      augmentation: 0.15, // Human catches errors
      collaboration: 0.10, // Balanced
      human_led: 0.05, // AI assists
      not_applicable: 0,
    };

    impact += modeAdjust[mode];

    // High judgment tasks risk quality loss with automation
    if (mode === 'full_automation') {
      impact -= task.judgment_required * 0.2;
    }

    return Math.max(-0.5, Math.min(0.5, impact));
  }

  private calculateImplementationComplexity(task: Task, aiSystem: AISystem): number {
    let complexity = 0.3; // Base complexity

    // Skill requirements add complexity
    complexity += task.skill_requirements.size * 0.05;

    // Integration complexity
    complexity += (1 - aiSystem.maturity_level) * 0.3;

    // Social tasks are harder to implement AI for
    complexity += task.social_interaction * 0.2;

    // Creative tasks need custom solutions
    complexity += task.creativity_required * 0.25;

    return Math.min(1, complexity);
  }

  private calculateTimeToValue(complexity: number): number {
    // Base 3 months, scales with complexity
    return Math.ceil(3 + complexity * 18);
  }

  private calculateRiskScore(
    task: Task,
    aiSystem: AISystem,
    mode: AdoptionMode
  ): number {
    let risk = 0.1; // Base risk

    // Error rate risk
    risk += aiSystem.error_rate * 0.5;

    // High judgment = high stakes
    risk += task.judgment_required * 0.3;

    // Full automation has higher risk
    if (mode === 'full_automation') {
      risk += 0.15;
    }

    // Oversight reduces risk
    if (aiSystem.requires_oversight && mode !== 'full_automation') {
      risk *= 0.7;
    }

    return Math.min(1, risk);
  }

  private calculateFitXi(
    automationPotential: number,
    augmentationPotential: number,
    riskScore: number
  ): number {
    const avgPotential = (automationPotential + augmentationPotential) / 2;
    return avgPotential / Math.max(0.1, riskScore);
  }

  // --------------------------------------------------------------------------
  // Workforce Impact Analysis
  // --------------------------------------------------------------------------

  /**
   * Analyze workforce impact for an occupation
   */
  analyzeWorkforceImpact(occupationId: string): WorkforceImpact {
    const occupation = this.occupations.get(occupationId);
    if (!occupation) throw new Error(`Occupation ${occupationId} not found`);

    let automatableTasks = 0;
    let augmentableTasks = 0;
    let humanOnlyTasks = 0;
    let hoursDisplaced = 0;
    let hoursAugmented = 0;
    let totalProductivity = 0;
    const reskillingNeeds = new Map<string, number>();

    // Analyze each task
    occupation.tasks.forEach((task) => {
      const fits = this.taskFits.get(task.id) || [];
      const bestFit = fits.reduce((best, fit) => {
        return fit.ccce_xi > (best?.ccce_xi ?? 0) ? fit : best;
      }, fits[0]);

      if (!bestFit) {
        humanOnlyTasks++;
        return;
      }

      const taskHours = (task.duration_minutes * task.frequency_per_week) / 60;

      if (bestFit.recommended_mode === 'full_automation') {
        automatableTasks++;
        hoursDisplaced += taskHours * bestFit.automation_potential;
      } else if (bestFit.recommended_mode === 'augmentation' ||
                 bestFit.recommended_mode === 'collaboration') {
        augmentableTasks++;
        hoursAugmented += taskHours;
        totalProductivity += bestFit.productivity_gain;
      } else {
        humanOnlyTasks++;
      }

      // Track reskilling needs
      task.skill_requirements.forEach((level, skill) => {
        if (bestFit.recommended_mode !== 'human_led') {
          const currentHours = reskillingNeeds.get(skill) ?? 0;
          const levelMultiplier = this.getSkillLevelMultiplier(level);
          reskillingNeeds.set(skill, currentHours + 20 * levelMultiplier);
        }
      });
    });

    // Calculate productivity multiplier
    const avgProductivity = augmentableTasks > 0 ? totalProductivity / augmentableTasks : 1;

    // Determine employment impact
    const displacementRatio = hoursDisplaced / occupation.total_hours_per_week;
    let employmentImpact: ImpactType;
    if (displacementRatio > 0.6) {
      employmentImpact = 'displacement';
    } else if (displacementRatio > 0.3) {
      employmentImpact = 'transformation';
    } else if (augmentableTasks > automatableTasks) {
      employmentImpact = 'augmentation';
    } else {
      employmentImpact = 'neutral';
    }

    // Wage impact
    const wageImpact = this.calculateWageImpact(displacementRatio, avgProductivity);

    // Transition timeline
    const transitionTimeline = Math.ceil(12 + displacementRatio * 36);

    const impact: WorkforceImpact = {
      occupation_id: occupationId,
      total_tasks: occupation.tasks.length,
      automatable_tasks: automatableTasks,
      augmentable_tasks: augmentableTasks,
      human_only_tasks: humanOnlyTasks,
      hours_displaced: hoursDisplaced,
      hours_augmented: hoursAugmented,
      productivity_multiplier: avgProductivity,
      wage_impact_percent: wageImpact,
      employment_impact: employmentImpact,
      reskilling_needs: reskillingNeeds,
      transition_timeline_months: transitionTimeline,
    };

    this.impacts.set(occupationId, impact);
    this.updateMetrics();

    return impact;
  }

  private getSkillLevelMultiplier(level: SkillLevel): number {
    const multipliers: Record<SkillLevel, number> = {
      entry: 0.5,
      intermediate: 1.0,
      advanced: 1.5,
      expert: 2.0,
      specialist: 2.5,
    };
    return multipliers[level];
  }

  private calculateWageImpact(displacementRatio: number, productivityMultiplier: number): number {
    // Displacement reduces wages, productivity can offset
    const displacementEffect = -displacementRatio * 30; // Up to -30%
    const productivityEffect = (productivityMultiplier - 1) * 10; // Productivity bonus

    return Math.max(-50, Math.min(30, displacementEffect + productivityEffect));
  }

  // --------------------------------------------------------------------------
  // Collaboration Models
  // --------------------------------------------------------------------------

  /**
   * Design a human-AI collaboration model
   */
  designCollaborationModel(config: {
    name: string;
    human_role: string;
    ai_role: string;
    task_ids: string[];
    ai_system_id: string;
  }): CollaborationModel {
    const id = `collab_${config.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;

    const aiSystem = this.aiSystems.get(config.ai_system_id);
    if (!aiSystem) throw new Error(`AI System ${config.ai_system_id} not found`);

    // Calculate interaction metrics
    const tasks = config.task_ids
      .map((tid) => this.tasks.get(tid))
      .filter((t): t is Task => t !== undefined);

    const avgCognitiveLoad = tasks.reduce((sum, t) => sum + t.cognitive_load, 0) / Math.max(1, tasks.length);
    const avgJudgment = tasks.reduce((sum, t) => sum + t.judgment_required, 0) / Math.max(1, tasks.length);

    // Interaction frequency based on task characteristics
    const interactionFrequency = Math.ceil(avgCognitiveLoad * 10 + avgJudgment * 5);

    // Handoff points
    const handoffPoints = this.identifyHandoffPoints(tasks, aiSystem);

    // Oversight requirements
    const oversightReq = aiSystem.requires_oversight ?
      OVERSIGHT_THRESHOLD + avgJudgment * 0.2 :
      avgJudgment * 0.5;

    // Efficiency gain
    const efficiencyGain = COLLABORATION_BASELINE +
      (1 - COLLABORATION_BASELINE) * aiSystem.maturity_level * (1 - avgCognitiveLoad * 0.3);

    // Error reduction
    const errorReduction = Math.min(0.8, aiSystem.accuracy * 0.5 + oversightReq * 0.3);

    // Job satisfaction impact (more interesting work)
    const satisfactionImpact = avgCognitiveLoad > 0.5 ? 0.2 : -0.1;

    const model: CollaborationModel = {
      id,
      name: config.name,
      human_role: config.human_role,
      ai_role: config.ai_role,
      interaction_frequency: interactionFrequency,
      handoff_points: handoffPoints,
      oversight_requirements: oversightReq,
      efficiency_gain: efficiencyGain,
      error_reduction: errorReduction,
      job_satisfaction_impact: satisfactionImpact,
      ccce_metrics: {
        lambda: tasks.reduce((sum, t) => sum + t.ccce_lambda, 0) / Math.max(1, tasks.length),
        phi: efficiencyGain,
        gamma: aiSystem.ccce_gamma,
        xi: efficiencyGain / Math.max(0.1, aiSystem.ccce_gamma),
      },
    };

    this.collaborationModels.set(id, model);
    this.updateMetrics();

    return model;
  }

  private identifyHandoffPoints(tasks: Task[], aiSystem: AISystem): string[] {
    const handoffs: string[] = [];

    tasks.forEach((task) => {
      // High judgment = human decision point
      if (task.judgment_required > 0.6) {
        handoffs.push(`${task.name}: Human decision required`);
      }

      // High social interaction = human engagement point
      if (task.social_interaction > 0.7) {
        handoffs.push(`${task.name}: Human interaction required`);
      }

      // Low AI accuracy for creative tasks
      if (task.creativity_required > 0.5 && aiSystem.accuracy < 0.9) {
        handoffs.push(`${task.name}: Human review of AI output`);
      }
    });

    // Add standard handoffs
    handoffs.push('Task initiation: Human sets context');
    handoffs.push('Final review: Human validates output');
    handoffs.push('Exception handling: Human resolves errors');

    return handoffs;
  }

  // --------------------------------------------------------------------------
  // Transition Pathways
  // --------------------------------------------------------------------------

  /**
   * Identify transition pathways between occupations
   */
  identifyTransitionPathway(fromOccupationId: string, toOccupationId: string): TransitionPathway {
    const fromOcc = this.occupations.get(fromOccupationId);
    const toOcc = this.occupations.get(toOccupationId);

    if (!fromOcc) throw new Error(`Occupation ${fromOccupationId} not found`);
    if (!toOcc) throw new Error(`Occupation ${toOccupationId} not found`);

    // Calculate skill gap
    const skillGap = new Map<string, number>();
    const fromSkills = new Map<string, SkillLevel>();
    const toSkills = new Map<string, SkillLevel>();

    // Aggregate skills from tasks
    fromOcc.tasks.forEach((task) => {
      task.skill_requirements.forEach((level, skill) => {
        const existing = fromSkills.get(skill);
        if (!existing || this.getSkillLevelMultiplier(level) > this.getSkillLevelMultiplier(existing)) {
          fromSkills.set(skill, level);
        }
      });
    });

    toOcc.tasks.forEach((task) => {
      task.skill_requirements.forEach((level, skill) => {
        const existing = toSkills.get(skill);
        if (!existing || this.getSkillLevelMultiplier(level) > this.getSkillLevelMultiplier(existing)) {
          toSkills.set(skill, level);
        }
      });
    });

    // Calculate gaps
    let totalGap = 0;
    toSkills.forEach((reqLevel, skill) => {
      const hasLevel = fromSkills.get(skill) ?? 'entry';
      const reqMultiplier = this.getSkillLevelMultiplier(reqLevel);
      const hasMultiplier = this.getSkillLevelMultiplier(hasLevel);
      const gap = Math.max(0, reqMultiplier - hasMultiplier);
      if (gap > 0) {
        skillGap.set(skill, gap / reqMultiplier);
        totalGap += gap;
      }
    });

    // Training hours (40 hours per skill level gap)
    const trainingHours = totalGap * 40;

    // Wage change
    const wageChange = ((toOcc.median_wage_hourly - fromOcc.median_wage_hourly) / fromOcc.median_wage_hourly) * 100;

    // Feasibility (based on skill gap and transferability)
    const gapRatio = skillGap.size / Math.max(1, toSkills.size);
    const feasibility = Math.max(0, 1 - gapRatio * 0.5 - totalGap * 0.1);

    // Time to transition
    const transitionMonths = Math.ceil(trainingHours / 40); // 40 hours/month for training

    // Support programs
    const supportPrograms: string[] = [];
    if (trainingHours > 200) supportPrograms.push('Technical certification program');
    if (skillGap.size > 3) supportPrograms.push('Career transition coaching');
    if (wageChange < -10) supportPrograms.push('Income support during transition');
    if (toOcc.education_required !== fromOcc.education_required) {
      supportPrograms.push('Educational credential program');
    }

    const pathway: TransitionPathway = {
      from_occupation_id: fromOccupationId,
      to_occupation_id: toOccupationId,
      skill_gap: skillGap,
      training_hours_required: trainingHours,
      wage_change_percent: wageChange,
      feasibility_score: feasibility,
      time_to_transition_months: transitionMonths,
      support_programs: supportPrograms,
    };

    // Store pathway
    if (!this.transitionPathways.has(fromOccupationId)) {
      this.transitionPathways.set(fromOccupationId, []);
    }
    this.transitionPathways.get(fromOccupationId)!.push(pathway);

    return pathway;
  }

  // --------------------------------------------------------------------------
  // Sector Analysis
  // --------------------------------------------------------------------------

  /**
   * Analyze an entire sector
   */
  analyzeSector(sectorName: string, occupationIds: string[]): SectorAnalysis {
    const occupations = occupationIds
      .map((id) => this.occupations.get(id))
      .filter((o): o is Occupation => o !== undefined);

    const totalEmployment = occupations.reduce((sum, o) => sum + o.employment_count, 0);

    // Calculate sector-level metrics
    let totalAutomationRisk = 0;
    let totalAugmentationOpp = 0;
    let netJobImpact = 0;
    let productivityPotential = 0;
    let investmentRequired = 0;

    occupations.forEach((occ) => {
      const impact = this.impacts.get(occ.id);
      if (impact) {
        const weight = occ.employment_count / totalEmployment;

        const automationRisk = impact.hours_displaced / occ.total_hours_per_week;
        totalAutomationRisk += automationRisk * weight;

        const augOpp = impact.augmentable_tasks / impact.total_tasks;
        totalAugmentationOpp += augOpp * weight;

        // Net job impact
        if (impact.employment_impact === 'displacement') {
          netJobImpact -= occ.employment_count * automationRisk * 0.5;
        } else if (impact.employment_impact === 'creation') {
          netJobImpact += occ.employment_count * 0.1;
        }

        productivityPotential += impact.productivity_multiplier * weight;

        // Investment estimate
        const avgTaskFits = Array.from(this.taskFits.values())
          .flat()
          .filter((f) => occ.tasks.some((t) => t.id === f.task_id));
        if (avgTaskFits.length > 0) {
          const avgComplexity = avgTaskFits.reduce((sum, f) => sum + f.implementation_complexity, 0) / avgTaskFits.length;
          investmentRequired += occ.employment_count * avgComplexity * 1000;
        }
      }
    });

    // AI exposure index
    const aiExposure = (totalAutomationRisk + totalAugmentationOpp) / 2;

    // Timeline to impact
    const timelineYears = totalAutomationRisk > 0.5 ? 3 :
                          totalAutomationRisk > 0.3 ? 5 : 8;

    return {
      sector_name: sectorName,
      occupations,
      total_employment: totalEmployment,
      ai_exposure_index: aiExposure,
      automation_risk: totalAutomationRisk,
      augmentation_opportunity: totalAugmentationOpp,
      net_job_impact: netJobImpact,
      productivity_potential: productivityPotential,
      investment_required: investmentRequired,
      timeline_to_impact_years: timelineYears,
    };
  }

  // --------------------------------------------------------------------------
  // Policy Recommendations
  // --------------------------------------------------------------------------

  /**
   * Generate policy recommendations
   */
  generatePolicyRecommendations(): PolicyRecommendation[] {
    const recommendations: PolicyRecommendation[] = [];

    // Analyze overall impact
    let totalWorkforce = 0;
    let atRiskWorkforce = 0;
    let totalReskillingHours = 0;

    this.impacts.forEach((impact, occId) => {
      const occ = this.occupations.get(occId);
      if (occ) {
        totalWorkforce += occ.employment_count;
        if (impact.employment_impact === 'displacement') {
          atRiskWorkforce += occ.employment_count;
        }
        impact.reskilling_needs.forEach((hours) => {
          totalReskillingHours += hours * occ.employment_count;
        });
      }
    });

    const atRiskPercent = (atRiskWorkforce / Math.max(1, totalWorkforce)) * 100;

    // Generate recommendations based on findings
    if (atRiskPercent > 20) {
      recommendations.push({
        id: 'policy_workforce_transition',
        title: 'Workforce Transition Fund',
        description: 'Establish dedicated funding for worker transition programs targeting high-displacement occupations',
        target_stakeholder: 'Government/Policymakers',
        priority: 'critical',
        estimated_impact: atRiskWorkforce * 0.3,
        implementation_cost: atRiskWorkforce * 5000,
        timeline_months: 12,
        dependencies: ['Budget allocation', 'Program design'],
      });
    }

    if (totalReskillingHours > 1000000) {
      recommendations.push({
        id: 'policy_reskilling_initiative',
        title: 'National AI Skills Initiative',
        description: 'Launch comprehensive reskilling programs focused on AI collaboration skills',
        target_stakeholder: 'Education/Training providers',
        priority: 'high',
        estimated_impact: totalWorkforce * 0.4,
        implementation_cost: totalReskillingHours * 50,
        timeline_months: 24,
        dependencies: ['Curriculum development', 'Instructor training'],
      });
    }

    // Recommend augmentation-first approach
    recommendations.push({
      id: 'policy_augmentation_incentives',
      title: 'Augmentation Tax Incentives',
      description: 'Provide tax incentives for businesses implementing human-AI collaboration rather than full automation',
      target_stakeholder: 'Businesses/Employers',
      priority: 'high',
      estimated_impact: totalWorkforce * 0.5,
      implementation_cost: totalWorkforce * 500,
      timeline_months: 18,
      dependencies: ['Tax code amendments', 'Compliance mechanisms'],
    });

    // Worker protection
    recommendations.push({
      id: 'policy_worker_rights',
      title: 'AI Displacement Protection Act',
      description: 'Establish worker rights including notice periods, severance, and retraining access when AI displaces jobs',
      target_stakeholder: 'Legislators',
      priority: 'high',
      estimated_impact: atRiskWorkforce,
      implementation_cost: 0,
      timeline_months: 24,
      dependencies: ['Legislative process', 'Stakeholder consultation'],
    });

    // Productivity sharing
    recommendations.push({
      id: 'policy_productivity_sharing',
      title: 'Productivity Gain Sharing',
      description: 'Encourage profit-sharing mechanisms that distribute AI productivity gains to workers',
      target_stakeholder: 'Businesses/Unions',
      priority: 'medium',
      estimated_impact: totalWorkforce * 0.3,
      implementation_cost: 0,
      timeline_months: 12,
      dependencies: ['Collective bargaining frameworks'],
    });

    return recommendations;
  }

  // --------------------------------------------------------------------------
  // CCCE Metrics
  // --------------------------------------------------------------------------

  private updateMetrics(): void {
    // Aggregate Lambda from tasks
    if (this.tasks.size > 0) {
      this.lambda = Array.from(this.tasks.values())
        .reduce((sum, t) => sum + t.ccce_lambda, 0) / this.tasks.size;
    }

    // Aggregate Phi from occupations
    if (this.occupations.size > 0) {
      this.phi = Array.from(this.occupations.values())
        .reduce((sum, o) => sum + o.ccce_phi, 0) / this.occupations.size;
    }

    // Aggregate Gamma from AI systems
    if (this.aiSystems.size > 0) {
      this.gamma = Array.from(this.aiSystems.values())
        .reduce((sum, sys) => sum + sys.ccce_gamma, 0) / this.aiSystems.size;
    }
  }

  /**
   * Get current CCCE metrics
   */
  getMetrics(): AIWorkMetrics {
    const xi = (this.lambda * this.phi) / Math.max(0.01, this.gamma);

    // Calculate aggregate statistics
    let totalTasks = 0;
    let sumAutomation = 0;
    let sumAugmentation = 0;
    let fitCount = 0;

    this.taskFits.forEach((fits) => {
      fits.forEach((fit) => {
        sumAutomation += fit.automation_potential;
        sumAugmentation += fit.augmentation_potential;
        fitCount++;
      });
    });

    let workforceAtRisk = 0;
    let totalWorkforce = 0;
    let totalProductivityGain = 0;
    let totalReskillingHours = 0;

    this.impacts.forEach((impact, occId) => {
      const occ = this.occupations.get(occId);
      if (occ) {
        totalWorkforce += occ.employment_count;
        if (impact.employment_impact === 'displacement') {
          workforceAtRisk += occ.employment_count;
        }
        totalProductivityGain += impact.productivity_multiplier * occ.employment_count;
        impact.reskilling_needs.forEach((hours) => {
          totalReskillingHours += hours;
        });
      }
    });

    return {
      lambda: this.lambda,
      phi: this.phi,
      gamma: this.gamma,
      xi,
      total_occupations: this.occupations.size,
      total_tasks_analyzed: this.tasks.size,
      average_automation_potential: fitCount > 0 ? sumAutomation / fitCount : 0,
      average_augmentation_potential: fitCount > 0 ? sumAugmentation / fitCount : 0,
      workforce_at_risk_percent: totalWorkforce > 0 ? (workforceAtRisk / totalWorkforce) * 100 : 0,
      productivity_gain_potential: totalWorkforce > 0 ? totalProductivityGain / totalWorkforce : 1,
      reskilling_hours_needed: totalReskillingHours,
    };
  }

  /**
   * Phase-conjugate healing
   */
  heal(): void {
    // Apply CHI_PC correction to decoherence
    this.gamma = this.gamma * (1 - CHI_PC);

    // Refresh Lambda using LAMBDA_PHI
    this.lambda = Math.min(1, this.lambda + LAMBDA_PHI * 1e6);

    // Boost Phi organization
    this.phi = Math.min(1, this.phi * (1 + CHI_PC * 0.1));

    // Apply skill transfer learning boost
    this.occupations.forEach((occ) => {
      const newPhi = Math.min(1, occ.ccce_phi * (1 + SKILL_TRANSFER_RATE));
      this.occupations.set(occ.id, { ...occ, ccce_phi: newPhi });
    });
  }

  // --------------------------------------------------------------------------
  // Utility Methods
  // --------------------------------------------------------------------------

  /**
   * Register a custom AI system
   */
  registerAISystem(system: AISystem): void {
    this.aiSystems.set(system.id, system);
  }

  /**
   * Get all AI systems
   */
  getAISystems(): AISystem[] {
    return Array.from(this.aiSystems.values());
  }

  /**
   * Get occupation by ID
   */
  getOccupation(id: string): Occupation | undefined {
    return this.occupations.get(id);
  }

  /**
   * Get all occupations
   */
  getAllOccupations(): Occupation[] {
    return Array.from(this.occupations.values());
  }

  /**
   * Get task by ID
   */
  getTask(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  /**
   * Get impact by occupation ID
   */
  getImpact(occupationId: string): WorkforceImpact | undefined {
    return this.impacts.get(occupationId);
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

export const aiFutureWorkEngine = new AIFutureWorkEngine();
