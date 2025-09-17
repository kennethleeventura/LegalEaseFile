import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from './setup';

describe('API Integration Tests', () => {
  beforeAll(async () => {
    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  describe('Document Management API', () => {
    it('should upload and analyze documents', async () => {
      const testFile = Buffer.from('Test document content');

      const response = await request(app)
        .post('/api/documents/upload')
        .attach('file', testFile, 'test-document.txt')
        .expect(200);

      expect(response.body).toHaveProperty('document');
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.document).toHaveProperty('filename', 'test-document.txt');
    });

    it('should retrieve user documents', async () => {
      const response = await request(app)
        .get('/api/documents/user/demo-user')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should handle invalid file uploads', async () => {
      await request(app)
        .post('/api/documents/upload')
        .expect(400);
    });
  });

  describe('Template Management API', () => {
    it('should retrieve document templates', async () => {
      const response = await request(app)
        .get('/api/templates')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should retrieve emergency templates', async () => {
      const response = await request(app)
        .get('/api/templates/emergency')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should generate documents from templates', async () => {
      const templateData = {
        templateId: 'test-template',
        userInputs: { plaintiff: 'John Doe' },
        userId: 'demo-user'
      };

      const response = await request(app)
        .post('/api/documents/generate')
        .send(templateData)
        .expect(200);

      expect(response.body).toHaveProperty('document');
      expect(response.body).toHaveProperty('content');
    });
  });

  describe('Legal Aid API', () => {
    it('should search legal aid organizations', async () => {
      const response = await request(app)
        .get('/api/legal-aid')
        .query({
          practiceArea: 'family',
          location: 'california',
          isEmergency: 'false'
        })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should retrieve all legal aid organizations', async () => {
      const response = await request(app)
        .get('/api/legal-aid/all')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Subscription API', () => {
    it('should retrieve subscription plans', async () => {
      const response = await request(app)
        .get('/api/subscription-plans')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Filing History API', () => {
    it('should create filing history entry', async () => {
      const filingData = {
        userId: 'demo-user',
        filingType: 'motion',
        status: 'submitted'
      };

      const response = await request(app)
        .post('/api/filing-history')
        .send(filingData)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('filingType', 'motion');
    });

    it('should retrieve user filing history', async () => {
      const response = await request(app)
        .get('/api/filing-history/user')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Tier 1 Features API', () => {
    it('should perform case assessment', async () => {
      const assessmentData = {
        caseType: 'contract-dispute',
        jurisdiction: 'california',
        factPattern: 'Test case facts',
        partyType: 'plaintiff',
        urgency: 'medium'
      };

      const response = await request(app)
        .post('/api/case-assessment')
        .send(assessmentData)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('aiAnalysis');
      expect(response.body).toHaveProperty('recommendedForms');
    });

    it('should retrieve jurisdiction-specific templates', async () => {
      const response = await request(app)
        .get('/api/templates/jurisdiction/california')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should assemble smart documents', async () => {
      const assemblyData = {
        templateId: 'test-template',
        jurisdiction: 'california',
        clientData: { name: 'John Doe' },
        caseData: { type: 'contract' },
        autoPopulate: true
      };

      const response = await request(app)
        .post('/api/documents/assemble')
        .send(assemblyData)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('sections');
    });

    it('should retrieve e-filing integrations', async () => {
      const response = await request(app)
        .get('/api/e-filing/integrations')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should submit e-filing', async () => {
      const filingData = {
        documentId: 'test-doc-id',
        targetCourt: 'superior-court',
        jurisdiction: 'california',
        filingType: 'motion',
        urgency: 'standard'
      };

      const response = await request(app)
        .post('/api/e-filing/submit')
        .send(filingData)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('status');
    });

    it('should check document compliance', async () => {
      const complianceData = {
        documentId: 'test-doc-id',
        jurisdiction: 'california',
        courtType: 'superior',
        filingType: 'motion'
      };

      const response = await request(app)
        .post('/api/documents/compliance-check')
        .send(complianceData)
        .expect(200);

      expect(response.body).toHaveProperty('isCompliant');
      expect(response.body).toHaveProperty('violations');
    });
  });

  describe('Tier 2 Features API', () => {
    it('should perform AI strategy analysis', async () => {
      const strategyData = {
        caseType: 'contract-dispute',
        jurisdiction: 'california',
        factPattern: 'Breach of contract case',
        clientGoals: 'monetary damages',
        budget: 50000,
        riskTolerance: 'moderate'
      };

      const response = await request(app)
        .post('/api/tier2/strategy-analysis')
        .send(strategyData)
        .expect(200);

      expect(response.body).toHaveProperty('primaryRecommendation');
      expect(response.body).toHaveProperty('alternativeStrategies');
      expect(response.body).toHaveProperty('competitiveAnalysis');
    });

    it('should monitor compliance automatically', async () => {
      const monitorData = {
        documentId: 'test-doc-id',
        jurisdiction: 'california',
        courtType: 'superior',
        filingType: 'motion'
      };

      const response = await request(app)
        .post('/api/tier2/compliance-monitor')
        .send(monitorData)
        .expect(200);

      expect(response.body).toHaveProperty('complianceScore');
      expect(response.body).toHaveProperty('violations');
      expect(response.body).toHaveProperty('checkedRules');
    });

    it('should manage evidence', async () => {
      const evidenceData = {
        caseId: 'test-case-id',
        evidenceType: 'document',
        description: 'Contract evidence',
        tags: ['contract', 'breach']
      };

      const response = await request(app)
        .post('/api/tier2/evidence-management')
        .send(evidenceData)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('analysis');
      expect(response.body).toHaveProperty('chainOfCustody');
    });

    it('should provide pro se guidance', async () => {
      const guidanceData = {
        userLevel: 'beginner',
        caseType: 'family',
        jurisdiction: 'california',
        currentStep: 'filing'
      };

      const response = await request(app)
        .post('/api/tier2/pro-se-guidance')
        .send(guidanceData)
        .expect(200);

      expect(response.body).toHaveProperty('recommendations');
      expect(response.body).toHaveProperty('nextSteps');
      expect(response.body).toHaveProperty('resources');
    });
  });

  describe('Tier 3 Features API', () => {
    it('should generate predictive analytics', async () => {
      const analyticsData = {
        caseType: 'contract-dispute',
        jurisdiction: 'california',
        factPattern: 'Complex commercial dispute',
        caseValue: 250000,
        timeframe: '12-months',
        clientBudget: 75000
      };

      const response = await request(app)
        .post('/api/tier3/predictive-analytics')
        .send(analyticsData)
        .expect(200);

      expect(response.body).toHaveProperty('predictions');
      expect(response.body).toHaveProperty('marketIntelligence');
      expect(response.body).toHaveProperty('costBenefitAnalysis');
    });

    it('should manage litigation', async () => {
      const managementData = {
        caseId: 'test-case-id',
        managementType: 'full-service',
        participants: ['attorney', 'paralegal'],
        timeline: { phases: [] }
      };

      const response = await request(app)
        .post('/api/tier3/litigation-management')
        .send(managementData)
        .expect(200);

      expect(response.body).toHaveProperty('timeline');
      expect(response.body).toHaveProperty('resourceAllocation');
      expect(response.body).toHaveProperty('performanceMetrics');
    });

    it('should handle multi-jurisdiction practice', async () => {
      const jurisdictionData = {
        primaryJurisdiction: 'california',
        secondaryJurisdictions: ['nevada', 'arizona'],
        practiceAreas: ['corporate', 'litigation'],
        complianceLevel: 'full'
      };

      const response = await request(app)
        .post('/api/tier3/multi-jurisdiction')
        .send(jurisdictionData)
        .expect(200);

      expect(response.body).toHaveProperty('complianceMatrix');
      expect(response.body).toHaveProperty('crossBorderConsiderations');
      expect(response.body).toHaveProperty('regulatoryCompliance');
    });
  });

  describe('MPC Integration API', () => {
    it('should create Airtable cases', async () => {
      const caseData = {
        caseNumber: 'TEST-001',
        clientName: 'Test Client',
        documentType: 'motion'
      };

      const response = await request(app)
        .post('/api/airtable/cases')
        .send(caseData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('recordId');
    });

    it('should search MPC cases', async () => {
      const response = await request(app)
        .get('/api/airtable/cases')
        .query({ caseNumber: 'TEST-001' })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('cases');
    });

    it('should generate exhibit lists', async () => {
      const response = await request(app)
        .post('/api/mpc/exhibit-list/test-case-id')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('exhibitList');
    });

    it('should auto-populate forms', async () => {
      const populateData = {
        clientName: 'John Doe',
        caseType: 'contract',
        documentType: 'motion',
        formType: 'summary-judgment'
      };

      const response = await request(app)
        .post('/api/mpc/auto-populate')
        .send(populateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
    });
  });
});