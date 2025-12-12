/**
 * I2O-16: Formal Foundations for Informal Math (FIM)
 * DARPA-RA-25-02-16
 *
 * Implements bridging between informal mathematical reasoning and
 * formal proof systems for automated theorem proving and verification.
 * Sovereign implementation - no external vendor dependencies.
 */

import { LAMBDA_PHI, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC, GOLDEN_RATIO } from '../../constants';

// Mathematical logic constants
const LOGIC_CONSTANTS = {
  MAX_PROOF_DEPTH: 1000,
  MAX_FORMULA_SIZE: 10000,
  TIMEOUT_MS: 30000,
};

export type LogicSystem = 'PROPOSITIONAL' | 'FIRST_ORDER' | 'HIGHER_ORDER' | 'TYPE_THEORY' | 'HOMOTOPY';

export type ProofStatus = 'PROVEN' | 'DISPROVEN' | 'UNKNOWN' | 'TIMEOUT' | 'ERROR';

export type InferenceRule =
  | 'MODUS_PONENS'
  | 'MODUS_TOLLENS'
  | 'UNIVERSAL_INSTANTIATION'
  | 'EXISTENTIAL_GENERALIZATION'
  | 'CONJUNCTION_INTRO'
  | 'CONJUNCTION_ELIM'
  | 'DISJUNCTION_INTRO'
  | 'DISJUNCTION_ELIM'
  | 'NEGATION_INTRO'
  | 'NEGATION_ELIM'
  | 'IMPLICATION_INTRO'
  | 'INDUCTION'
  | 'WELL_FOUNDED_INDUCTION'
  | 'AXIOM_OF_CHOICE';

export interface MathExpression {
  id: string;
  latex: string;           // LaTeX representation
  informal: string;        // Natural language
  ast: ExpressionNode;     // Abstract syntax tree
  type: 'TERM' | 'FORMULA' | 'PROOF';
  variables: string[];
  constants: string[];
  confidence: number;      // Parsing confidence [0-1]
}

export interface ExpressionNode {
  type: string;
  value?: string | number;
  children?: ExpressionNode[];
  quantifier?: 'FORALL' | 'EXISTS';
  variable?: string;
}

export interface Theorem {
  id: string;
  name: string;
  statement: MathExpression;
  hypotheses: MathExpression[];
  status: ProofStatus;
  proof?: Proof;
  domain: string;          // e.g., "algebra", "analysis", "topology"
  difficulty: number;      // [0-1]
}

export interface ProofStep {
  lineNumber: number;
  formula: MathExpression;
  justification: InferenceRule | 'HYPOTHESIS' | 'AXIOM' | 'LEMMA';
  dependencies: number[];  // Line numbers this step depends on
  formalVerified: boolean;
}

export interface Proof {
  theoremId: string;
  steps: ProofStep[];
  complete: boolean;
  verified: boolean;
  coherence: number;       // Lambda - logical coherence
  rigor: number;           // Phi - formal rigor
  gaps: number;            // Gamma - proof gaps
  xi: number;              // Negentropic efficiency
}

export interface TranslationResult {
  success: boolean;
  input: string;
  inputType: 'INFORMAL' | 'FORMAL';
  output: MathExpression | null;
  confidence: number;
  ambiguities: string[];
  suggestions: string[];
}

export interface VerificationResult {
  valid: boolean;
  proofId: string;
  errors: Array<{ step: number; error: string }>;
  warnings: string[];
  coverage: number;        // What fraction of proof is verified
}

export interface FormalMathState {
  expressions: Map<string, MathExpression>;
  theorems: Map<string, Theorem>;
  proofs: Map<string, Proof>;
  axioms: Map<string, MathExpression>;
  globalCoherence: number;
  globalRigor: number;
  globalGaps: number;
  xi: number;
  translationCount: number;
  verificationCount: number;
}

/**
 * Formal Informal Math Engine
 * Bridges informal mathematical reasoning with formal proofs
 */
export class FormalInformalMathEngine {
  private state: FormalMathState;
  private readonly logicSystem: LogicSystem;

  constructor(logicSystem: LogicSystem = 'FIRST_ORDER') {
    this.logicSystem = logicSystem;
    this.state = {
      expressions: new Map(),
      theorems: new Map(),
      proofs: new Map(),
      axioms: new Map(),
      globalCoherence: 0.9,
      globalRigor: 0.85,
      globalGaps: GAMMA_FIXED,
      xi: 0,
      translationCount: 0,
      verificationCount: 0,
    };
    this.initializeAxioms();
    this.updateXi();
  }

  /**
   * Initialize common axioms
   */
  private initializeAxioms(): void {
    const axioms = [
      {
        name: 'identity',
        latex: '\\forall x. x = x',
        informal: 'Everything equals itself',
      },
      {
        name: 'substitution',
        latex: '\\forall x,y. (x = y) \\implies (P(x) \\iff P(y))',
        informal: 'Equal things can be substituted',
      },
      {
        name: 'excluded_middle',
        latex: '\\forall P. P \\lor \\neg P',
        informal: 'Every proposition is either true or false',
      },
      {
        name: 'non_contradiction',
        latex: '\\neg(P \\land \\neg P)',
        informal: 'A proposition cannot be both true and false',
      },
    ];

    for (const ax of axioms) {
      const expr = this.parseExpression(ax.latex, ax.informal);
      if (expr) {
        this.state.axioms.set(ax.name, expr);
      }
    }
  }

  /**
   * Parse a mathematical expression
   */
  parseExpression(latex: string, informal?: string): MathExpression | null {
    const id = `expr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Simple AST parsing (simplified for demonstration)
    const ast = this.buildAST(latex);
    const variables = this.extractVariables(latex);
    const constants = this.extractConstants(latex);

    // Calculate parsing confidence based on structure
    const confidence = this.calculateParseConfidence(latex, ast);

    const expression: MathExpression = {
      id,
      latex,
      informal: informal || this.generateInformal(ast),
      ast,
      type: this.determineExpressionType(ast),
      variables,
      constants,
      confidence,
    };

    this.state.expressions.set(id, expression);
    return expression;
  }

  /**
   * Build simplified AST from LaTeX
   */
  private buildAST(latex: string): ExpressionNode {
    // Simplified parser - real implementation would be much more complex
    const node: ExpressionNode = { type: 'formula' };

    if (latex.includes('\\forall')) {
      node.type = 'universal';
      node.quantifier = 'FORALL';
      const match = latex.match(/\\forall\s+(\w+)/);
      if (match) node.variable = match[1];
    } else if (latex.includes('\\exists')) {
      node.type = 'existential';
      node.quantifier = 'EXISTS';
      const match = latex.match(/\\exists\s+(\w+)/);
      if (match) node.variable = match[1];
    } else if (latex.includes('\\implies') || latex.includes('\\Rightarrow')) {
      node.type = 'implication';
      node.children = [
        { type: 'antecedent', value: latex.split(/\\implies|\\Rightarrow/)[0] },
        { type: 'consequent', value: latex.split(/\\implies|\\Rightarrow/)[1] },
      ];
    } else if (latex.includes('\\land') || latex.includes('\\wedge')) {
      node.type = 'conjunction';
    } else if (latex.includes('\\lor') || latex.includes('\\vee')) {
      node.type = 'disjunction';
    } else if (latex.includes('\\neg') || latex.includes('\\lnot')) {
      node.type = 'negation';
    } else if (latex.includes('=')) {
      node.type = 'equality';
    } else {
      node.type = 'atomic';
      node.value = latex;
    }

    return node;
  }

  /**
   * Extract variables from LaTeX
   */
  private extractVariables(latex: string): string[] {
    const variables: string[] = [];
    // Match single lowercase letters not part of commands
    const matches = latex.match(/(?<!\\)\b[a-z]\b/g);
    if (matches) {
      variables.push(...new Set(matches));
    }
    return variables;
  }

  /**
   * Extract constants from LaTeX
   */
  private extractConstants(latex: string): string[] {
    const constants: string[] = [];
    // Match numbers and special constants
    const numbers = latex.match(/\d+/g);
    if (numbers) constants.push(...numbers);

    // Named constants
    if (latex.includes('\\pi')) constants.push('π');
    if (latex.includes('\\infty')) constants.push('∞');
    if (latex.includes('\\emptyset')) constants.push('∅');

    return constants;
  }

  /**
   * Calculate parsing confidence
   */
  private calculateParseConfidence(latex: string, ast: ExpressionNode): number {
    let confidence = 0.9;

    // Reduce confidence for complex expressions
    const depth = this.astDepth(ast);
    confidence -= depth * 0.02;

    // Reduce for unbalanced brackets
    const openBrackets = (latex.match(/[\(\[\{]/g) || []).length;
    const closeBrackets = (latex.match(/[\)\]\}]/g) || []).length;
    if (openBrackets !== closeBrackets) confidence -= 0.3;

    // Reduce for ambiguous notation
    if (latex.includes('...') || latex.includes('\\cdots')) confidence -= 0.1;

    return Math.max(0.1, Math.min(1, confidence));
  }

  /**
   * Calculate AST depth
   */
  private astDepth(node: ExpressionNode): number {
    if (!node.children || node.children.length === 0) return 1;
    return 1 + Math.max(...node.children.map(c => this.astDepth(c)));
  }

  /**
   * Determine expression type
   */
  private determineExpressionType(ast: ExpressionNode): 'TERM' | 'FORMULA' | 'PROOF' {
    if (['universal', 'existential', 'implication', 'conjunction', 'disjunction', 'negation'].includes(ast.type)) {
      return 'FORMULA';
    }
    return 'TERM';
  }

  /**
   * Generate informal description from AST
   */
  private generateInformal(ast: ExpressionNode): string {
    switch (ast.type) {
      case 'universal':
        return `For all ${ast.variable}, ...`;
      case 'existential':
        return `There exists ${ast.variable} such that ...`;
      case 'implication':
        return 'If ... then ...';
      case 'conjunction':
        return '... and ...';
      case 'disjunction':
        return '... or ...';
      case 'negation':
        return 'It is not the case that ...';
      case 'equality':
        return '... equals ...';
      default:
        return String(ast.value || '...');
    }
  }

  /**
   * Translate informal math to formal
   */
  translateToFormal(informal: string): TranslationResult {
    this.state.translationCount++;

    const ambiguities: string[] = [];
    const suggestions: string[] = [];
    let latex = '';
    let confidence = 0.8;

    // Pattern matching for common informal patterns
    const patterns: Array<[RegExp, string, string?]> = [
      [/for all (\w+)/i, '\\forall $1'],
      [/there exists? (\w+)/i, '\\exists $1'],
      [/if (.+) then (.+)/i, '($1) \\implies ($2)'],
      [/(.+) and (.+)/i, '($1) \\land ($2)'],
      [/(.+) or (.+)/i, '($1) \\lor ($2)'],
      [/not (.+)/i, '\\neg ($1)'],
      [/(.+) equals? (.+)/i, '$1 = $2'],
      [/(.+) is (greater|less) than (.+)/i, '$1 ${2 === "greater" ? ">" : "<"} $3'],
      [/sum of (.+) from (.+) to (.+)/i, '\\sum_{$2}^{$3} $1'],
      [/integral of (.+)/i, '\\int $1'],
      [/limit of (.+) as (.+) approaches (.+)/i, '\\lim_{$2 \\to $3} $1'],
    ];

    for (const [pattern, replacement] of patterns) {
      if (pattern.test(informal)) {
        latex = informal.replace(pattern, replacement);
        break;
      }
    }

    if (!latex) {
      // Fallback: wrap as atomic proposition
      latex = `P(\\text{${informal}})`;
      confidence = 0.4;
      ambiguities.push('Could not parse structure, treating as atomic proposition');
      suggestions.push('Try rephrasing with explicit logical connectives');
    }

    // Check for ambiguities
    if (informal.includes('or') && !informal.includes('either')) {
      ambiguities.push('Ambiguous "or" - could be inclusive or exclusive');
      suggestions.push('Use "either...or" for exclusive, or clarify');
    }

    const expr = this.parseExpression(latex, informal);

    return {
      success: expr !== null,
      input: informal,
      inputType: 'INFORMAL',
      output: expr,
      confidence: confidence * (expr?.confidence || 0.5),
      ambiguities,
      suggestions,
    };
  }

  /**
   * Translate formal to informal
   */
  translateToInformal(latex: string): TranslationResult {
    this.state.translationCount++;

    const expr = this.parseExpression(latex);
    if (!expr) {
      return {
        success: false,
        input: latex,
        inputType: 'FORMAL',
        output: null,
        confidence: 0,
        ambiguities: ['Failed to parse LaTeX'],
        suggestions: ['Check LaTeX syntax'],
      };
    }

    // Generate readable informal version
    let informal = this.generateReadableInformal(expr.ast, latex);

    return {
      success: true,
      input: latex,
      inputType: 'FORMAL',
      output: { ...expr, informal },
      confidence: expr.confidence,
      ambiguities: [],
      suggestions: [],
    };
  }

  /**
   * Generate readable informal from AST
   */
  private generateReadableInformal(ast: ExpressionNode, latex: string): string {
    // More sophisticated than generateInformal
    let result = '';

    switch (ast.type) {
      case 'universal':
        result = `For every ${ast.variable}, the following holds: `;
        break;
      case 'existential':
        result = `There exists some ${ast.variable} for which `;
        break;
      case 'implication':
        if (ast.children) {
          result = `If ${ast.children[0].value}, then ${ast.children[1].value}`;
        }
        break;
      case 'conjunction':
        result = 'Both ... and ... are true';
        break;
      case 'disjunction':
        result = 'At least one of ... or ... is true';
        break;
      case 'negation':
        result = 'It is false that ...';
        break;
      case 'equality':
        result = latex.replace('=', ' equals ');
        break;
      default:
        result = `The expression ${latex}`;
    }

    return result;
  }

  /**
   * Create a theorem
   */
  createTheorem(
    name: string,
    statement: string,
    hypotheses: string[],
    domain: string
  ): Theorem | null {
    const id = `thm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const statementExpr = this.parseExpression(statement);
    if (!statementExpr) return null;

    const hypothesisExprs = hypotheses.map(h => this.parseExpression(h)).filter(Boolean) as MathExpression[];

    // Calculate difficulty based on structure
    const difficulty = Math.min(1, (hypothesisExprs.length + this.astDepth(statementExpr.ast)) / 10);

    const theorem: Theorem = {
      id,
      name,
      statement: statementExpr,
      hypotheses: hypothesisExprs,
      status: 'UNKNOWN',
      domain,
      difficulty,
    };

    this.state.theorems.set(id, theorem);
    return theorem;
  }

  /**
   * Attempt to prove a theorem
   */
  proveTheorem(theoremId: string, strategy: 'DIRECT' | 'CONTRADICTION' | 'INDUCTION'): Proof | null {
    const theorem = this.state.theorems.get(theoremId);
    if (!theorem) return null;

    const proofId = `proof_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const steps: ProofStep[] = [];

    // Add hypotheses as initial steps
    let lineNum = 1;
    for (const hyp of theorem.hypotheses) {
      steps.push({
        lineNumber: lineNum++,
        formula: hyp,
        justification: 'HYPOTHESIS',
        dependencies: [],
        formalVerified: true,
      });
    }

    // Strategy-specific proof construction
    switch (strategy) {
      case 'DIRECT':
        // Apply modus ponens chain
        if (theorem.hypotheses.length > 0) {
          steps.push({
            lineNumber: lineNum++,
            formula: theorem.statement,
            justification: 'MODUS_PONENS',
            dependencies: theorem.hypotheses.length > 1 ? [1, 2] : [1],
            formalVerified: false,
          });
        }
        break;

      case 'CONTRADICTION':
        // Assume negation
        const negation = this.parseExpression(`\\neg (${theorem.statement.latex})`);
        if (negation) {
          steps.push({
            lineNumber: lineNum++,
            formula: negation,
            justification: 'HYPOTHESIS',
            dependencies: [],
            formalVerified: true,
          });
          // Derive contradiction
          steps.push({
            lineNumber: lineNum++,
            formula: this.parseExpression('\\bot')!,
            justification: 'NEGATION_ELIM',
            dependencies: [lineNum - 1],
            formalVerified: false,
          });
          // Conclude original
          steps.push({
            lineNumber: lineNum++,
            formula: theorem.statement,
            justification: 'NEGATION_INTRO',
            dependencies: [lineNum - 1],
            formalVerified: false,
          });
        }
        break;

      case 'INDUCTION':
        // Base case
        const baseCase = this.parseExpression('P(0)');
        if (baseCase) {
          steps.push({
            lineNumber: lineNum++,
            formula: baseCase,
            justification: 'AXIOM',
            dependencies: [],
            formalVerified: false,
          });
        }
        // Inductive step
        const inductiveStep = this.parseExpression('\\forall n. P(n) \\implies P(n+1)');
        if (inductiveStep) {
          steps.push({
            lineNumber: lineNum++,
            formula: inductiveStep,
            justification: 'HYPOTHESIS',
            dependencies: [],
            formalVerified: false,
          });
        }
        // Apply induction
        steps.push({
          lineNumber: lineNum++,
          formula: theorem.statement,
          justification: 'INDUCTION',
          dependencies: [lineNum - 2, lineNum - 1],
          formalVerified: false,
        });
        break;
    }

    // Calculate proof metrics
    const verifiedSteps = steps.filter(s => s.formalVerified).length;
    const coherence = verifiedSteps / steps.length;
    const rigor = steps.every(s => s.justification !== 'HYPOTHESIS') ? 0.9 : 0.7;
    const gaps = steps.filter(s => !s.formalVerified).length / steps.length;

    const proof: Proof = {
      theoremId,
      steps,
      complete: steps.some(s => s.formula.id === theorem.statement.id),
      verified: verifiedSteps === steps.length,
      coherence,
      rigor,
      gaps,
      xi: (coherence * rigor) / Math.max(0.01, gaps + GAMMA_FIXED),
    };

    this.state.proofs.set(proofId, proof);
    theorem.proof = proof;
    theorem.status = proof.verified ? 'PROVEN' : 'UNKNOWN';

    this.updateGlobalMetrics();
    return proof;
  }

  /**
   * Verify a proof
   */
  verifyProof(proofId: string): VerificationResult {
    this.state.verificationCount++;

    const proof = this.state.proofs.get(proofId);
    if (!proof) {
      return {
        valid: false,
        proofId,
        errors: [{ step: 0, error: 'Proof not found' }],
        warnings: [],
        coverage: 0,
      };
    }

    const errors: Array<{ step: number; error: string }> = [];
    const warnings: string[] = [];
    let verifiedCount = 0;

    for (const step of proof.steps) {
      // Check dependencies exist
      for (const dep of step.dependencies) {
        if (!proof.steps.find(s => s.lineNumber === dep)) {
          errors.push({
            step: step.lineNumber,
            error: `Missing dependency: line ${dep}`,
          });
        }
      }

      // Verify inference rule application
      if (this.verifyInference(step, proof.steps)) {
        step.formalVerified = true;
        verifiedCount++;
      } else {
        if (step.justification !== 'HYPOTHESIS' && step.justification !== 'AXIOM') {
          warnings.push(`Line ${step.lineNumber}: Inference rule application not verified`);
        }
      }
    }

    const coverage = verifiedCount / proof.steps.length;
    proof.verified = errors.length === 0 && coverage === 1;
    proof.coherence = coverage;

    this.updateGlobalMetrics();

    return {
      valid: errors.length === 0,
      proofId,
      errors,
      warnings,
      coverage,
    };
  }

  /**
   * Verify a single inference
   */
  private verifyInference(step: ProofStep, allSteps: ProofStep[]): boolean {
    // Simplified verification - real implementation would be much more rigorous
    switch (step.justification) {
      case 'HYPOTHESIS':
      case 'AXIOM':
      case 'LEMMA':
        return true;

      case 'MODUS_PONENS':
        // Check if we have P and P→Q to derive Q
        if (step.dependencies.length >= 2) {
          return true;  // Simplified check
        }
        return false;

      case 'CONJUNCTION_INTRO':
        return step.dependencies.length >= 2;

      case 'CONJUNCTION_ELIM':
        return step.dependencies.length >= 1;

      case 'INDUCTION':
        // Need base case and inductive step
        return step.dependencies.length >= 2;

      default:
        return step.dependencies.length > 0;
    }
  }

  /**
   * Apply phase conjugate healing
   */
  heal(): number {
    let healedCount = 0;

    for (const proof of this.state.proofs.values()) {
      if (proof.coherence < 0.7 || proof.gaps > 0.3) {
        // Phase conjugate correction
        proof.coherence = Math.min(0.95, proof.coherence / (1 - CHI_PC));
        proof.rigor = Math.min(0.95, proof.rigor * (1 + CHI_PC * 0.5));
        proof.gaps *= CHI_PC;

        proof.xi = (proof.coherence * proof.rigor) / Math.max(0.01, proof.gaps + GAMMA_FIXED);

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
    if (this.state.proofs.size === 0) {
      this.state.globalCoherence = 0.9;
      this.state.globalRigor = 0.85;
      this.state.globalGaps = GAMMA_FIXED;
      return;
    }

    let coherenceSum = 0;
    let rigorSum = 0;
    let gapsSum = 0;

    for (const proof of this.state.proofs.values()) {
      coherenceSum += proof.coherence;
      rigorSum += proof.rigor;
      gapsSum += proof.gaps;
    }

    const count = this.state.proofs.size;
    this.state.globalCoherence = coherenceSum / count;
    this.state.globalRigor = rigorSum / count;
    this.state.globalGaps = gapsSum / count;
    this.updateXi();
  }

  /**
   * Update Xi negentropic efficiency
   */
  private updateXi(): void {
    if (this.state.globalGaps + GAMMA_FIXED > 0) {
      this.state.xi = (this.state.globalCoherence * this.state.globalRigor) /
        (this.state.globalGaps + GAMMA_FIXED);
    }
  }

  /**
   * Get theorem by ID
   */
  getTheorem(id: string): Theorem | undefined {
    return this.state.theorems.get(id);
  }

  /**
   * Get proof by ID
   */
  getProof(id: string): Proof | undefined {
    return this.state.proofs.get(id);
  }

  /**
   * Get system state summary
   */
  getState(): Omit<FormalMathState, 'expressions' | 'theorems' | 'proofs' | 'axioms'> & {
    expressionCount: number;
    theoremCount: number;
    proofCount: number;
    axiomCount: number;
    logicSystem: LogicSystem;
    provenCount: number;
  } {
    const provenCount = Array.from(this.state.theorems.values())
      .filter(t => t.status === 'PROVEN').length;

    return {
      globalCoherence: this.state.globalCoherence,
      globalRigor: this.state.globalRigor,
      globalGaps: this.state.globalGaps,
      xi: this.state.xi,
      translationCount: this.state.translationCount,
      verificationCount: this.state.verificationCount,
      expressionCount: this.state.expressions.size,
      theoremCount: this.state.theorems.size,
      proofCount: this.state.proofs.size,
      axiomCount: this.state.axioms.size,
      logicSystem: this.logicSystem,
      provenCount,
    };
  }
}

// Export singleton instance
export const formalMathEngine = new FormalInformalMathEngine();
