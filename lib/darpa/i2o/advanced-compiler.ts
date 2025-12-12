/**
 * I2O-18: Compiler Infrastructure Beyond Traditional Compilation
 * DARPA-RA-25-02-18
 *
 * Implements advanced compiler infrastructure for DNA-Lang and beyond,
 * including quantum-classical hybrid compilation, autopoietic optimization,
 * and self-modifying code generation with CCCE coherence tracking.
 * Sovereign implementation - no external vendor dependencies.
 */

import { LAMBDA_PHI, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC, GOLDEN_RATIO } from '../../constants';

// Compiler constants
const COMPILER_CONSTANTS = {
  MAX_IR_SIZE: 1000000,          // Maximum IR nodes
  OPTIMIZATION_PASSES: 10,       // Default optimization iterations
  MAX_RECURSION: 100,            // Stack depth limit
  COHERENCE_THRESHOLD: 0.8,      // Minimum coherence for code generation
};

export type TargetArchitecture =
  | 'X86_64'
  | 'ARM64'
  | 'WASM'
  | 'QUANTUM_GATE'
  | 'QUANTUM_ANNEALING'
  | 'DNA_LANG'
  | 'NEUROMORPHIC';

export type IRNodeType =
  | 'FUNCTION'
  | 'BLOCK'
  | 'INSTRUCTION'
  | 'VALUE'
  | 'TYPE'
  | 'QUANTUM_GATE'
  | 'QUANTUM_MEASURE'
  | 'DNA_GENE'
  | 'DNA_ACT';

export type OptimizationLevel = 'O0' | 'O1' | 'O2' | 'O3' | 'OΞ';  // OΞ = negentropic

export interface SourceLocation {
  file: string;
  line: number;
  column: number;
}

export interface IRNode {
  id: string;
  type: IRNodeType;
  name?: string;
  operands: string[];          // References to other nodes
  attributes: Map<string, unknown>;
  location?: SourceLocation;
  coherence: number;           // Lambda - node coherence
  complexity: number;          // Computational complexity
}

export interface IRModule {
  id: string;
  name: string;
  nodes: Map<string, IRNode>;
  entryPoints: string[];
  targetArch: TargetArchitecture;
  optimizationLevel: OptimizationLevel;
  metadata: Map<string, unknown>;
  coherence: number;
  organization: number;
  entropy: number;
  xi: number;
}

export interface CompilationUnit {
  id: string;
  source: string;
  language: 'DNA_LANG' | 'QASM' | 'PYTHON' | 'RUST' | 'CUSTOM';
  irModule?: IRModule;
  outputCode?: string;
  errors: CompilerError[];
  warnings: CompilerWarning[];
  metrics: CompilationMetrics;
}

export interface CompilerError {
  code: string;
  message: string;
  location?: SourceLocation;
  severity: 'ERROR' | 'FATAL';
}

export interface CompilerWarning {
  code: string;
  message: string;
  location?: SourceLocation;
  suggestion?: string;
}

export interface CompilationMetrics {
  parseTime: number;
  optimizationTime: number;
  codegenTime: number;
  totalTime: number;
  nodeCount: number;
  outputSize: number;
  coherence: number;
  entropy: number;
  xi: number;
}

export interface OptimizationPass {
  name: string;
  description: string;
  level: OptimizationLevel;
  transform: (module: IRModule) => IRModule;
  applicableTo: TargetArchitecture[];
}

export interface AutopoieticMutation {
  nodeId: string;
  type: 'INSERT' | 'DELETE' | 'MODIFY' | 'REORDER';
  before: IRNode | null;
  after: IRNode | null;
  fitnessChange: number;
}

export interface CompilerState {
  units: Map<string, CompilationUnit>;
  optimizationPasses: OptimizationPass[];
  targetArch: TargetArchitecture;
  optimizationLevel: OptimizationLevel;
  globalCoherence: number;
  globalOrganization: number;
  globalEntropy: number;
  xi: number;
  compilationCount: number;
  mutationCount: number;
}

/**
 * Advanced Compiler Infrastructure Engine
 * Beyond traditional compilation with quantum and DNA-Lang support
 */
export class AdvancedCompilerEngine {
  private state: CompilerState;
  private readonly optimizationPasses: OptimizationPass[];

  constructor(
    targetArch: TargetArchitecture = 'DNA_LANG',
    optimizationLevel: OptimizationLevel = 'O2'
  ) {
    this.optimizationPasses = this.initializeOptimizationPasses();
    this.state = {
      units: new Map(),
      optimizationPasses: this.optimizationPasses,
      targetArch,
      optimizationLevel,
      globalCoherence: 0.9,
      globalOrganization: 0.85,
      globalEntropy: GAMMA_FIXED,
      xi: 0,
      compilationCount: 0,
      mutationCount: 0,
    };
    this.updateXi();
  }

  /**
   * Initialize optimization passes
   */
  private initializeOptimizationPasses(): OptimizationPass[] {
    return [
      {
        name: 'dead_code_elimination',
        description: 'Remove unreachable code',
        level: 'O1',
        transform: this.deadCodeElimination.bind(this),
        applicableTo: ['X86_64', 'ARM64', 'WASM', 'DNA_LANG'],
      },
      {
        name: 'constant_folding',
        description: 'Evaluate constant expressions at compile time',
        level: 'O1',
        transform: this.constantFolding.bind(this),
        applicableTo: ['X86_64', 'ARM64', 'WASM', 'DNA_LANG'],
      },
      {
        name: 'common_subexpression',
        description: 'Eliminate redundant computations',
        level: 'O2',
        transform: this.commonSubexpressionElimination.bind(this),
        applicableTo: ['X86_64', 'ARM64', 'WASM'],
      },
      {
        name: 'loop_unrolling',
        description: 'Unroll small loops',
        level: 'O2',
        transform: this.loopUnrolling.bind(this),
        applicableTo: ['X86_64', 'ARM64'],
      },
      {
        name: 'quantum_gate_fusion',
        description: 'Fuse adjacent quantum gates',
        level: 'O2',
        transform: this.quantumGateFusion.bind(this),
        applicableTo: ['QUANTUM_GATE'],
      },
      {
        name: 'dna_gene_optimization',
        description: 'Optimize DNA-Lang gene expressions',
        level: 'O2',
        transform: this.dnaGeneOptimization.bind(this),
        applicableTo: ['DNA_LANG'],
      },
      {
        name: 'coherence_maximization',
        description: 'Maximize code coherence (negentropic optimization)',
        level: 'OΞ',
        transform: this.coherenceMaximization.bind(this),
        applicableTo: ['DNA_LANG', 'QUANTUM_GATE'],
      },
      {
        name: 'autopoietic_mutation',
        description: 'Self-improving code transformation',
        level: 'OΞ',
        transform: this.autopoieticMutation.bind(this),
        applicableTo: ['DNA_LANG'],
      },
    ];
  }

  /**
   * Parse source code to IR
   */
  parse(source: string, language: CompilationUnit['language']): IRModule | null {
    const moduleId = `mod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const nodes = new Map<string, IRNode>();
    const entryPoints: string[] = [];

    // Language-specific parsing
    switch (language) {
      case 'DNA_LANG':
        this.parseDNALang(source, nodes, entryPoints);
        break;
      case 'QASM':
        this.parseQASM(source, nodes, entryPoints);
        break;
      default:
        this.parseGeneric(source, nodes, entryPoints);
    }

    // Calculate module metrics
    const coherence = this.calculateModuleCoherence(nodes);
    const organization = this.calculateModuleOrganization(nodes);
    const entropy = this.calculateModuleEntropy(nodes);

    const module: IRModule = {
      id: moduleId,
      name: `module_${language.toLowerCase()}`,
      nodes,
      entryPoints,
      targetArch: this.state.targetArch,
      optimizationLevel: this.state.optimizationLevel,
      metadata: new Map(),
      coherence,
      organization,
      entropy,
      xi: (coherence * organization) / Math.max(0.01, entropy + GAMMA_FIXED),
    };

    return module;
  }

  /**
   * Parse DNA-Lang source
   */
  private parseDNALang(source: string, nodes: Map<string, IRNode>, entryPoints: string[]): void {
    // Match ORGANISM declaration
    const organismMatch = source.match(/ORGANISM\s+(\w+)/);
    if (organismMatch) {
      const funcId = `func_${organismMatch[1]}`;
      nodes.set(funcId, {
        id: funcId,
        type: 'FUNCTION',
        name: organismMatch[1],
        operands: [],
        attributes: new Map([['type', 'organism']]),
        coherence: 0.9,
        complexity: 1,
      });
      entryPoints.push(funcId);
    }

    // Match GENE blocks
    const geneMatches = source.matchAll(/GENE\s+(\w+)\s*\{([^}]*)\}/g);
    for (const match of geneMatches) {
      const geneId = `gene_${match[1]}`;
      nodes.set(geneId, {
        id: geneId,
        type: 'DNA_GENE',
        name: match[1],
        operands: [],
        attributes: new Map([['body', match[2]]]),
        coherence: 0.85,
        complexity: match[2].length / 100,
      });
    }

    // Match ACT blocks
    const actMatches = source.matchAll(/ACT\s+(\w+)\s*\(\s*\)\s*\{([^}]*)\}/g);
    for (const match of actMatches) {
      const actId = `act_${match[1]}`;
      nodes.set(actId, {
        id: actId,
        type: 'DNA_ACT',
        name: match[1],
        operands: [],
        attributes: new Map([['body', match[2]]]),
        coherence: 0.88,
        complexity: match[2].length / 50,
      });
    }

    // Match METRICS
    const metricsMatch = source.match(/METRICS\s*\{([^}]*)\}/);
    if (metricsMatch) {
      const metricsId = 'metrics_ccce';
      nodes.set(metricsId, {
        id: metricsId,
        type: 'VALUE',
        name: 'ccce_metrics',
        operands: [],
        attributes: new Map([['body', metricsMatch[1]]]),
        coherence: 0.95,
        complexity: 0.5,
      });
    }
  }

  /**
   * Parse QASM source
   */
  private parseQASM(source: string, nodes: Map<string, IRNode>, entryPoints: string[]): void {
    const lines = source.split('\n');
    let lineNum = 0;

    for (const line of lines) {
      lineNum++;
      const trimmed = line.trim();

      if (trimmed.startsWith('//') || trimmed === '') continue;

      // Match gate operations
      const gateMatch = trimmed.match(/^(\w+)\s+(.*);/);
      if (gateMatch) {
        const gateId = `gate_${lineNum}`;
        nodes.set(gateId, {
          id: gateId,
          type: 'QUANTUM_GATE',
          name: gateMatch[1],
          operands: gateMatch[2].split(',').map(s => s.trim()),
          attributes: new Map(),
          location: { file: 'input.qasm', line: lineNum, column: 0 },
          coherence: 0.92,
          complexity: 1,
        });
      }

      // Match measurements
      const measureMatch = trimmed.match(/measure\s+(\w+)\s*->\s*(\w+)/);
      if (measureMatch) {
        const measureId = `measure_${lineNum}`;
        nodes.set(measureId, {
          id: measureId,
          type: 'QUANTUM_MEASURE',
          name: 'measure',
          operands: [measureMatch[1], measureMatch[2]],
          attributes: new Map(),
          location: { file: 'input.qasm', line: lineNum, column: 0 },
          coherence: 0.85,  // Measurement introduces decoherence
          complexity: 2,
        });
      }
    }

    if (nodes.size > 0) {
      entryPoints.push(Array.from(nodes.keys())[0]);
    }
  }

  /**
   * Parse generic source
   */
  private parseGeneric(source: string, nodes: Map<string, IRNode>, entryPoints: string[]): void {
    // Simple tokenization
    const tokens = source.split(/\s+/).filter(t => t.length > 0);
    let tokenNum = 0;

    for (const token of tokens) {
      const nodeId = `token_${tokenNum++}`;
      nodes.set(nodeId, {
        id: nodeId,
        type: 'VALUE',
        name: token,
        operands: [],
        attributes: new Map(),
        coherence: 0.8,
        complexity: 0.1,
      });
    }

    if (nodes.size > 0) {
      entryPoints.push(Array.from(nodes.keys())[0]);
    }
  }

  /**
   * Calculate module coherence
   */
  private calculateModuleCoherence(nodes: Map<string, IRNode>): number {
    if (nodes.size === 0) return 0.5;

    let sum = 0;
    for (const node of nodes.values()) {
      sum += node.coherence;
    }
    return sum / nodes.size;
  }

  /**
   * Calculate module organization
   */
  private calculateModuleOrganization(nodes: Map<string, IRNode>): number {
    if (nodes.size === 0) return 0.5;

    // Based on structure and connectivity
    const types = new Set<IRNodeType>();
    let connections = 0;

    for (const node of nodes.values()) {
      types.add(node.type);
      connections += node.operands.length;
    }

    const typeVariety = types.size / 10;  // Max 10 types
    const avgConnections = connections / nodes.size / 5;  // Normalize

    return Math.min(1, (typeVariety + avgConnections) / 2 + 0.5);
  }

  /**
   * Calculate module entropy
   */
  private calculateModuleEntropy(nodes: Map<string, IRNode>): number {
    if (nodes.size === 0) return 0.5;

    let totalComplexity = 0;
    for (const node of nodes.values()) {
      totalComplexity += node.complexity;
    }

    // Entropy increases with complexity
    return Math.min(0.5, totalComplexity / nodes.size / 10);
  }

  // Optimization passes
  private deadCodeElimination(module: IRModule): IRModule {
    // Remove nodes not reachable from entry points
    const reachable = new Set<string>();
    const queue = [...module.entryPoints];

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      if (reachable.has(nodeId)) continue;
      reachable.add(nodeId);

      const node = module.nodes.get(nodeId);
      if (node) {
        for (const operand of node.operands) {
          if (!reachable.has(operand)) {
            queue.push(operand);
          }
        }
      }
    }

    // Remove unreachable nodes
    for (const nodeId of module.nodes.keys()) {
      if (!reachable.has(nodeId)) {
        module.nodes.delete(nodeId);
      }
    }

    module.coherence = this.calculateModuleCoherence(module.nodes);
    return module;
  }

  private constantFolding(module: IRModule): IRModule {
    // Simplified: mark constant nodes as folded
    for (const node of module.nodes.values()) {
      if (node.type === 'VALUE' && node.operands.length === 0) {
        node.attributes.set('constant', true);
        node.coherence = Math.min(1, node.coherence * 1.05);
      }
    }
    return module;
  }

  private commonSubexpressionElimination(module: IRModule): IRModule {
    // Find duplicate computation patterns
    const signatures = new Map<string, string>();

    for (const [id, node] of module.nodes) {
      const sig = `${node.type}:${node.operands.join(',')}`;
      if (signatures.has(sig)) {
        // Replace with reference to existing
        node.attributes.set('eliminated', signatures.get(sig));
      } else {
        signatures.set(sig, id);
      }
    }

    return module;
  }

  private loopUnrolling(module: IRModule): IRModule {
    // Mark loops for unrolling (simplified)
    for (const node of module.nodes.values()) {
      if (node.attributes.get('loop') && node.attributes.get('iterations')) {
        const iterations = node.attributes.get('iterations') as number;
        if (iterations <= 4) {
          node.attributes.set('unrolled', true);
          node.complexity *= iterations;
          node.coherence *= 0.98;  // Slight coherence cost
        }
      }
    }
    return module;
  }

  private quantumGateFusion(module: IRModule): IRModule {
    // Fuse adjacent single-qubit gates
    const gateNodes = Array.from(module.nodes.values())
      .filter(n => n.type === 'QUANTUM_GATE');

    for (let i = 0; i < gateNodes.length - 1; i++) {
      const gate1 = gateNodes[i];
      const gate2 = gateNodes[i + 1];

      // Check if gates operate on same qubit
      if (gate1.operands[0] === gate2.operands[0]) {
        gate1.attributes.set('fused_with', gate2.id);
        gate1.name = `fused_${gate1.name}_${gate2.name}`;
        gate1.coherence = Math.min(1, (gate1.coherence + gate2.coherence) / 2 + 0.05);
        module.nodes.delete(gate2.id);
        gateNodes.splice(i + 1, 1);
      }
    }

    return module;
  }

  private dnaGeneOptimization(module: IRModule): IRModule {
    // Optimize gene expression levels
    for (const node of module.nodes.values()) {
      if (node.type === 'DNA_GENE') {
        // Boost coherence for well-structured genes
        const body = node.attributes.get('body') as string || '';
        if (body.includes('expression:') && body.includes('trigger:')) {
          node.coherence = Math.min(1, node.coherence * 1.1);
        }
      }
    }
    return module;
  }

  private coherenceMaximization(module: IRModule): IRModule {
    // Apply negentropic optimization
    for (const node of module.nodes.values()) {
      if (node.coherence < COMPILER_CONSTANTS.COHERENCE_THRESHOLD) {
        // Phase conjugate correction
        node.coherence = Math.min(0.98, node.coherence / (1 - CHI_PC));
      }

      // Reduce complexity where possible
      if (node.complexity > 1) {
        node.complexity *= 0.95;
      }
    }

    module.coherence = this.calculateModuleCoherence(module.nodes);
    module.entropy = this.calculateModuleEntropy(module.nodes);
    module.xi = (module.coherence * module.organization) /
      Math.max(0.01, module.entropy + GAMMA_FIXED);

    return module;
  }

  private autopoieticMutation(module: IRModule): IRModule {
    // Self-modifying optimization
    const mutations: AutopoieticMutation[] = [];

    // Identify weak nodes
    const weakNodes = Array.from(module.nodes.values())
      .filter(n => n.coherence < 0.7)
      .slice(0, 5);  // Limit mutations

    for (const node of weakNodes) {
      // Strengthen or restructure
      const newNode = { ...node };
      newNode.coherence = Math.min(0.95, node.coherence * 1.3);
      newNode.complexity *= 0.9;

      mutations.push({
        nodeId: node.id,
        type: 'MODIFY',
        before: node,
        after: newNode,
        fitnessChange: newNode.coherence - node.coherence,
      });

      module.nodes.set(node.id, newNode);
    }

    this.state.mutationCount += mutations.length;

    module.coherence = this.calculateModuleCoherence(module.nodes);
    module.organization = this.calculateModuleOrganization(module.nodes);
    module.entropy = this.calculateModuleEntropy(module.nodes);
    module.xi = (module.coherence * module.organization) /
      Math.max(0.01, module.entropy + GAMMA_FIXED);

    return module;
  }

  /**
   * Compile source code
   */
  compile(source: string, language: CompilationUnit['language']): CompilationUnit {
    const unitId = `unit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    const errors: CompilerError[] = [];
    const warnings: CompilerWarning[] = [];

    // Parse
    const parseStart = Date.now();
    const irModule = this.parse(source, language);
    const parseTime = Date.now() - parseStart;

    if (!irModule) {
      errors.push({
        code: 'E001',
        message: 'Failed to parse source code',
        severity: 'FATAL',
      });

      return {
        id: unitId,
        source,
        language,
        errors,
        warnings,
        metrics: {
          parseTime,
          optimizationTime: 0,
          codegenTime: 0,
          totalTime: Date.now() - startTime,
          nodeCount: 0,
          outputSize: 0,
          coherence: 0,
          entropy: 1,
          xi: 0,
        },
      };
    }

    // Optimize
    const optStart = Date.now();
    let optimizedModule = irModule;

    const levelPriority: Record<OptimizationLevel, number> = {
      'O0': 0, 'O1': 1, 'O2': 2, 'O3': 3, 'OΞ': 4,
    };

    for (const pass of this.optimizationPasses) {
      if (levelPriority[pass.level] <= levelPriority[this.state.optimizationLevel]) {
        if (pass.applicableTo.includes(this.state.targetArch)) {
          try {
            optimizedModule = pass.transform(optimizedModule);
          } catch (e) {
            warnings.push({
              code: 'W001',
              message: `Optimization pass '${pass.name}' failed: ${e}`,
            });
          }
        }
      }
    }
    const optimizationTime = Date.now() - optStart;

    // Code generation
    const codegenStart = Date.now();
    let outputCode = '';

    switch (this.state.targetArch) {
      case 'DNA_LANG':
        outputCode = this.generateDNALang(optimizedModule);
        break;
      case 'QUANTUM_GATE':
        outputCode = this.generateQASM(optimizedModule);
        break;
      default:
        outputCode = this.generateGeneric(optimizedModule);
    }
    const codegenTime = Date.now() - codegenStart;

    const unit: CompilationUnit = {
      id: unitId,
      source,
      language,
      irModule: optimizedModule,
      outputCode,
      errors,
      warnings,
      metrics: {
        parseTime,
        optimizationTime,
        codegenTime,
        totalTime: Date.now() - startTime,
        nodeCount: optimizedModule.nodes.size,
        outputSize: outputCode.length,
        coherence: optimizedModule.coherence,
        entropy: optimizedModule.entropy,
        xi: optimizedModule.xi,
      },
    };

    this.state.units.set(unitId, unit);
    this.state.compilationCount++;
    this.updateGlobalMetrics();

    return unit;
  }

  /**
   * Generate DNA-Lang output
   */
  private generateDNALang(module: IRModule): string {
    let output = '// Generated DNA-Lang code\n';
    output += `// Coherence: ${module.coherence.toFixed(4)}\n`;
    output += `// Xi: ${module.xi.toFixed(4)}\n\n`;

    for (const node of module.nodes.values()) {
      switch (node.type) {
        case 'FUNCTION':
          output += `ORGANISM ${node.name} {\n`;
          break;
        case 'DNA_GENE':
          output += `    GENE ${node.name} {\n`;
          output += `        ${node.attributes.get('body') || ''}\n`;
          output += `    }\n`;
          break;
        case 'DNA_ACT':
          output += `    ACT ${node.name}() {\n`;
          output += `        ${node.attributes.get('body') || ''}\n`;
          output += `    }\n`;
          break;
      }
    }

    output += '}\n';
    return output;
  }

  /**
   * Generate QASM output
   */
  private generateQASM(module: IRModule): string {
    let output = 'OPENQASM 2.0;\n';
    output += `// Coherence: ${module.coherence.toFixed(4)}\n\n`;

    for (const node of module.nodes.values()) {
      if (node.type === 'QUANTUM_GATE') {
        output += `${node.name} ${node.operands.join(', ')};\n`;
      } else if (node.type === 'QUANTUM_MEASURE') {
        output += `measure ${node.operands[0]} -> ${node.operands[1]};\n`;
      }
    }

    return output;
  }

  /**
   * Generate generic output
   */
  private generateGeneric(module: IRModule): string {
    let output = '// Generated output\n';
    for (const node of module.nodes.values()) {
      output += `${node.type}: ${node.name || node.id}\n`;
    }
    return output;
  }

  /**
   * Apply phase conjugate healing
   */
  heal(): number {
    let healedCount = 0;

    for (const unit of this.state.units.values()) {
      if (unit.irModule && unit.irModule.coherence < 0.7) {
        // Re-run coherence maximization
        unit.irModule = this.coherenceMaximization(unit.irModule);
        healedCount++;
      }
    }

    this.updateGlobalMetrics();
    return healedCount;
  }

  /**
   * Update global metrics
   */
  private updateGlobalMetrics(): void {
    if (this.state.units.size === 0) {
      this.state.globalCoherence = 0.9;
      this.state.globalOrganization = 0.85;
      this.state.globalEntropy = GAMMA_FIXED;
      return;
    }

    let coherenceSum = 0;
    let organizationSum = 0;
    let entropySum = 0;
    let count = 0;

    for (const unit of this.state.units.values()) {
      if (unit.irModule) {
        coherenceSum += unit.irModule.coherence;
        organizationSum += unit.irModule.organization;
        entropySum += unit.irModule.entropy;
        count++;
      }
    }

    if (count > 0) {
      this.state.globalCoherence = coherenceSum / count;
      this.state.globalOrganization = organizationSum / count;
      this.state.globalEntropy = entropySum / count;
    }
    this.updateXi();
  }

  /**
   * Update Xi negentropic efficiency
   */
  private updateXi(): void {
    if (this.state.globalEntropy + GAMMA_FIXED > 0) {
      this.state.xi = (this.state.globalCoherence * this.state.globalOrganization) /
        (this.state.globalEntropy + GAMMA_FIXED);
    }
  }

  /**
   * Get compilation unit by ID
   */
  getUnit(id: string): CompilationUnit | undefined {
    return this.state.units.get(id);
  }

  /**
   * Set target architecture
   */
  setTarget(arch: TargetArchitecture): void {
    this.state.targetArch = arch;
  }

  /**
   * Set optimization level
   */
  setOptimizationLevel(level: OptimizationLevel): void {
    this.state.optimizationLevel = level;
  }

  /**
   * Get system state summary
   */
  getState(): Omit<CompilerState, 'units' | 'optimizationPasses'> & {
    unitCount: number;
    passCount: number;
    avgCoherence: number;
  } {
    return {
      targetArch: this.state.targetArch,
      optimizationLevel: this.state.optimizationLevel,
      globalCoherence: this.state.globalCoherence,
      globalOrganization: this.state.globalOrganization,
      globalEntropy: this.state.globalEntropy,
      xi: this.state.xi,
      compilationCount: this.state.compilationCount,
      mutationCount: this.state.mutationCount,
      unitCount: this.state.units.size,
      passCount: this.optimizationPasses.length,
      avgCoherence: this.state.globalCoherence,
    };
  }
}

// Export singleton instance
export const advancedCompilerEngine = new AdvancedCompilerEngine();
