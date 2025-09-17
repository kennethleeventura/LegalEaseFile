/**
 * Tier 1 AI Engine - Core Foundation Features
 * Provides AI-powered legal analysis, document assembly, and case assessment
 */

import { documentAnalysisService } from "./openai";

export interface JurisdictionRules {
  jurisdiction: string;
  courtType: string;
  rules: {
    id: string;
    title: string;
    description: string;
    category: 'filing' | 'format' | 'service' | 'deadlines';
    lastUpdated: string;
  }[];
  filingRequirements: {
    format: string[];
    pageLimit?: number;
    fontRequirements?: string;
    marginRequirements?: string;
    serviceRequirements: string[];
  };
  fees: {
    filingFee: number;
    serviceFee?: number;
    otherFees?: { name: string; amount: number }[];
  };
}

export interface CaseAssessmentResult {
  caseStrength: 'strong' | 'moderate' | 'weak';
  keyIssues: string[];
  recommendedStrategy: string;
  estimatedTimeframe: string;
  riskFactors: string[];
  statuteOfLimitations: {
    applicable: boolean;
    timeRemaining?: string;
    criticalDeadlines: string[];
  };
  estimatedComplexity: 'simple' | 'moderate' | 'complex';
  estimatedCost: number;
}

export interface SmartDocumentAssembly {
  templateId: string;
  jurisdiction: string;
  assembledContent: {
    sections: {
      name: string;
      content: string;
      populated: boolean;
      requiredFields: string[];
    }[];
    metadata: {
      caseNumber?: string;
      courtName: string;
      partyNames: string[];
      filingDate: string;
    };
    citations: string[];
    complianceChecks: {
      formatting: boolean;
      jurisdiction: boolean;
      completeness: boolean;
      violations: string[];
    };
  };
}

class Tier1AIEngine {
  /**
   * Get jurisdiction-specific court rules and requirements
   */
  async getJurisdictionRules(jurisdiction: string, courtType: string): Promise<JurisdictionRules> {
    // In production, this would connect to real court rule databases
    const mockRules: JurisdictionRules = {
      jurisdiction,
      courtType,
      rules: [
        {
          id: "rule-5-1",
          title: "Document Format Requirements",
          description: "All documents must be in 12-point Times New Roman font",
          category: "format",
          lastUpdated: new Date().toISOString()
        },
        {
          id: "rule-3-1",
          title: "Filing Deadlines",
          description: "Civil complaints must be filed within statute of limitations",
          category: "deadlines",
          lastUpdated: new Date().toISOString()
        }
      ],
      filingRequirements: {
        format: ["PDF", "DOC"],
        pageLimit: jurisdiction === "CA" ? 25 : 30,
        fontRequirements: "12-point Times New Roman",
        marginRequirements: "1-inch margins on all sides",
        serviceRequirements: ["Opposing counsel", "Court clerk"]
      },
      fees: {
        filingFee: jurisdiction === "CA" ? 435 : 402,
        serviceFee: 75,
        otherFees: [
          { name: "Electronic filing fee", amount: 25 }
        ]
      }
    };

    return mockRules;
  }

  /**
   * Perform intelligent case assessment and triage
   */
  async assessCase(
    caseType: string,
    jurisdiction: string,
    factPattern: string,
    partyType?: string,
    urgency?: string
  ): Promise<CaseAssessmentResult> {
    try {
      // Use OpenAI for real analysis if available
      let aiAnalysis = null;
      if (process.env.OPENAI_API_KEY) {
        try {
          aiAnalysis = await documentAnalysisService.analyzeCaseStrength(factPattern, caseType);
        } catch (error) {
          console.warn("OpenAI analysis failed, using mock analysis");
        }
      }

      // Mock case assessment (enhance with real AI in production)
      const assessment: CaseAssessmentResult = {
        caseStrength: this.determineCaseStrength(factPattern, caseType),
        keyIssues: this.identifyKeyIssues(factPattern, caseType),
        recommendedStrategy: this.getRecommendedStrategy(caseType, urgency),
        estimatedTimeframe: this.estimateTimeframe(caseType, urgency),
        riskFactors: this.identifyRiskFactors(jurisdiction, caseType),
        statuteOfLimitations: this.checkStatuteOfLimitations(caseType, jurisdiction),
        estimatedComplexity: urgency === "emergency" ? "complex" : this.assessComplexity(factPattern),
        estimatedCost: this.estimateCost(caseType, jurisdiction)
      };

      return assessment;
    } catch (error) {
      throw new Error(`Case assessment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Smart document assembly with AI-powered content generation
   */
  async assembleDocument(
    templateId: string,
    jurisdiction: string,
    clientData: any,
    caseData: any,
    options: {
      autoPopulate?: boolean;
      includeCitations?: boolean;
      checkCompliance?: boolean;
    } = {}
  ): Promise<SmartDocumentAssembly> {
    try {
      // Get jurisdiction rules for compliance checking
      const rules = await this.getJurisdictionRules(jurisdiction, caseData.courtType || "state_trial");

      // Mock template data (would come from database)
      const templateSections = [
        "caption",
        "introduction",
        "statement_of_facts",
        "legal_argument",
        "prayer_for_relief",
        "signature_block"
      ];

      const assembledSections = templateSections.map(sectionName => {
        const content = options.autoPopulate ?
          this.generateSectionContent(sectionName, clientData, caseData) : "";

        return {
          name: sectionName,
          content,
          populated: options.autoPopulate || false,
          requiredFields: this.getRequiredFields(sectionName)
        };
      });

      // Generate citations if requested
      const citations = options.includeCitations ?
        this.generateRelevantCitations(caseData.caseType, jurisdiction) : [];

      // Perform compliance checks
      const complianceChecks = options.checkCompliance ?
        await this.checkDocumentCompliance(assembledSections, rules) : {
          formatting: true,
          jurisdiction: true,
          completeness: options.autoPopulate || false,
          violations: []
        };

      const result: SmartDocumentAssembly = {
        templateId,
        jurisdiction,
        assembledContent: {
          sections: assembledSections,
          metadata: {
            caseNumber: caseData.caseNumber,
            courtName: this.getCourtName(jurisdiction, caseData.courtType),
            partyNames: [clientData.name, caseData.opposingParty].filter(Boolean),
            filingDate: new Date().toISOString().split('T')[0]
          },
          citations,
          complianceChecks
        }
      };

      return result;
    } catch (error) {
      throw new Error(`Document assembly failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Private helper methods

  private determineCaseStrength(factPattern: string, caseType: string): 'strong' | 'moderate' | 'weak' {
    // Simple heuristic - in production would use ML model
    const strongIndicators = ['clear evidence', 'documented', 'witnesses', 'contract', 'written agreement'];
    const weakIndicators = ['unclear', 'no evidence', 'verbal only', 'disputed'];

    const factLower = factPattern.toLowerCase();
    const strongCount = strongIndicators.filter(indicator => factLower.includes(indicator)).length;
    const weakCount = weakIndicators.filter(indicator => factLower.includes(indicator)).length;

    if (strongCount > weakCount && strongCount >= 2) return 'strong';
    if (weakCount > strongCount) return 'weak';
    return 'moderate';
  }

  private identifyKeyIssues(factPattern: string, caseType: string): string[] {
    const commonIssues = ['Statute of limitations', 'Jurisdiction concerns', 'Evidence requirements'];

    // Add case-type specific issues
    switch (caseType.toLowerCase()) {
      case 'contract':
        return [...commonIssues, 'Contract interpretation', 'Breach elements', 'Damages calculation'];
      case 'tort':
        return [...commonIssues, 'Duty of care', 'Causation', 'Damages'];
      case 'employment':
        return [...commonIssues, 'At-will employment', 'Discrimination claims', 'Wage and hour'];
      default:
        return commonIssues;
    }
  }

  private getRecommendedStrategy(caseType: string, urgency?: string): string {
    if (urgency === "emergency") {
      return "File emergency motion for immediate relief";
    }

    switch (caseType.toLowerCase()) {
      case 'contract':
        return "File complaint with demand for specific performance and damages";
      case 'employment':
        return "Consider EEOC filing before lawsuit";
      default:
        return "File civil complaint after demand letter";
    }
  }

  private estimateTimeframe(caseType: string, urgency?: string): string {
    if (urgency === "emergency") return "1-7 days";

    switch (caseType.toLowerCase()) {
      case 'small_claims':
        return "2-4 months";
      case 'contract':
        return "6-18 months";
      case 'employment':
        return "12-24 months";
      default:
        return "6-12 months";
    }
  }

  private identifyRiskFactors(jurisdiction: string, caseType: string): string[] {
    return [
      "Opposing counsel experience level",
      "Judge assignment",
      "Local court practices",
      "Case complexity",
      "Discovery costs"
    ];
  }

  private checkStatuteOfLimitations(caseType: string, jurisdiction: string) {
    // Mock SOL calculation - would use real legal database
    const solPeriods: { [key: string]: number } = {
      'contract': 4 * 365,
      'tort': 2 * 365,
      'employment': 2 * 365,
      'default': 3 * 365
    };

    const period = solPeriods[caseType.toLowerCase()] || solPeriods.default;

    return {
      applicable: true,
      timeRemaining: `${Math.floor(period / 365)} years`,
      criticalDeadlines: [
        "File complaint before SOL expires",
        "Serve defendant within 90 days of filing"
      ]
    };
  }

  private assessComplexity(factPattern: string): 'simple' | 'moderate' | 'complex' {
    const complexIndicators = ['multiple parties', 'federal law', 'class action', 'expert testimony'];
    const complexCount = complexIndicators.filter(indicator =>
      factPattern.toLowerCase().includes(indicator)
    ).length;

    if (complexCount >= 2) return 'complex';
    if (complexCount === 1) return 'moderate';
    return 'simple';
  }

  private estimateCost(caseType: string, jurisdiction: string): number {
    const baseCosts: { [key: string]: number } = {
      'small_claims': 500,
      'contract': 3000,
      'employment': 5000,
      'tort': 4000,
      'default': 2500
    };

    const multiplier = jurisdiction === 'CA' || jurisdiction === 'NY' ? 1.3 : 1.0;
    return Math.floor((baseCosts[caseType.toLowerCase()] || baseCosts.default) * multiplier);
  }

  private generateSectionContent(section: string, clientData: any, caseData: any): string {
    // AI-powered content generation (mock implementation)
    switch (section) {
      case 'caption':
        return `${clientData.name} v. ${caseData.opposingParty || 'DEFENDANT'}`;
      case 'introduction':
        return `This is an action for ${caseData.caseType || 'relief'} brought by ${clientData.name}.`;
      case 'statement_of_facts':
        return `Plaintiff alleges the following facts: [Auto-generated based on case intake]`;
      case 'legal_argument':
        return `Under applicable law, Plaintiff is entitled to relief because: [AI-generated legal argument]`;
      case 'prayer_for_relief':
        return `WHEREFORE, Plaintiff prays for judgment against Defendant for: [Requested relief]`;
      case 'signature_block':
        return `Respectfully submitted,\n\n${clientData.attorney || clientData.name}\n${clientData.barNumber ? `State Bar No. ${clientData.barNumber}` : 'Pro Se'}`;
      default:
        return `[${section.replace('_', ' ').toUpperCase()}]`;
    }
  }

  private getRequiredFields(section: string): string[] {
    const requiredFields: { [key: string]: string[] } = {
      'caption': ['plaintiff_name', 'defendant_name', 'case_number'],
      'introduction': ['case_type', 'jurisdiction'],
      'statement_of_facts': ['key_facts', 'timeline'],
      'legal_argument': ['legal_theory', 'supporting_cases'],
      'prayer_for_relief': ['requested_relief', 'damages'],
      'signature_block': ['attorney_name', 'bar_number']
    };

    return requiredFields[section] || [];
  }

  private generateRelevantCitations(caseType: string, jurisdiction: string): string[] {
    const citations: { [key: string]: string[] } = {
      'contract': [
        'Restatement (Second) of Contracts § 1',
        'U.C.C. § 2-105',
        'Fed. R. Civ. P. 8(a)'
      ],
      'tort': [
        'Restatement (Second) of Torts § 7',
        'Fed. R. Civ. P. 8(a)',
        '28 U.S.C. § 1331'
      ],
      'employment': [
        '42 U.S.C. § 2000e-2',
        '29 U.S.C. § 201',
        'Fed. R. Civ. P. 8(a)'
      ]
    };

    return citations[caseType.toLowerCase()] || ['Fed. R. Civ. P. 8(a)', '28 U.S.C. § 1331'];
  }

  private getCourtName(jurisdiction: string, courtType: string): string {
    if (courtType === 'federal') {
      return `United States District Court for the ${jurisdiction === 'CA' ? 'Northern District of California' : 'District of ' + jurisdiction}`;
    }

    const stateNames: { [key: string]: string } = {
      'CA': 'California',
      'NY': 'New York',
      'TX': 'Texas',
      'FL': 'Florida'
    };

    return `Superior Court of ${stateNames[jurisdiction] || jurisdiction}`;
  }

  private async checkDocumentCompliance(sections: any[], rules: JurisdictionRules) {
    // Mock compliance checking - would use real rule engine
    const violations: string[] = [];

    // Check if all required sections are present
    const requiredSections = ['caption', 'introduction', 'statement_of_facts'];
    const missingSections = requiredSections.filter(required =>
      !sections.find(section => section.name === required && section.populated)
    );

    if (missingSections.length > 0) {
      violations.push(`Missing required sections: ${missingSections.join(', ')}`);
    }

    return {
      formatting: violations.length === 0,
      jurisdiction: true,
      completeness: missingSections.length === 0,
      violations
    };
  }
}

export const tier1AIEngine = new Tier1AIEngine();