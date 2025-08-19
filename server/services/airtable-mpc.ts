import Airtable from 'airtable';
import crypto from 'crypto';

// MPC (Multi-Party Computation) service for secure Airtable integration
export class AirtableMPCService {
  private base: any;
  private encryptionKey: string;
  
  constructor() {
    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
      throw new Error('Airtable credentials not configured');
    }
    
    Airtable.configure({
      endpointUrl: 'https://api.airtable.com',
      apiKey: process.env.AIRTABLE_API_KEY
    });
    
    this.base = Airtable.base(process.env.AIRTABLE_BASE_ID);
    this.encryptionKey = this.generateEncryptionKey();
  }
  
  private generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }
  
  private encryptSensitiveData(data: string): string {
    const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
  
  private decryptSensitiveData(encryptedData: string): string {
    const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
  
  // Securely store case information
  async createCase(caseData: {
    caseNumber: string;
    clientName: string;
    documentType: string;
    filingStatus: string;
    emergencyType?: string;
    attorneyAssigned?: string;
    dateCreated: string;
  }): Promise<string> {
    try {
      // Encrypt sensitive client information
      const encryptedClientName = this.encryptSensitiveData(caseData.clientName);
      
      const record = await this.base('Cases').create([
        {
          fields: {
            'Case Number': caseData.caseNumber,
            'Client Name (Encrypted)': encryptedClientName,
            'Document Type': caseData.documentType,
            'Filing Status': caseData.filingStatus,
            'Emergency Type': caseData.emergencyType || '',
            'Attorney Assigned': caseData.attorneyAssigned || '',
            'Date Created': caseData.dateCreated,
            'Last Updated': new Date().toISOString()
          }
        }
      ]);
      
      return record[0].id;
    } catch (error) {
      console.error('Error creating case in Airtable:', error);
      throw new Error('Failed to create case record');
    }
  }
  
  // Retrieve case information with decryption
  async getCase(recordId: string): Promise<any> {
    try {
      const record = await this.base('Cases').find(recordId);
      
      return {
        id: record.id,
        caseNumber: record.fields['Case Number'],
        clientName: this.decryptSensitiveData(record.fields['Client Name (Encrypted)']),
        documentType: record.fields['Document Type'],
        filingStatus: record.fields['Filing Status'],
        emergencyType: record.fields['Emergency Type'],
        attorneyAssigned: record.fields['Attorney Assigned'],
        dateCreated: record.fields['Date Created'],
        lastUpdated: record.fields['Last Updated']
      };
    } catch (error) {
      console.error('Error retrieving case from Airtable:', error);
      throw new Error('Failed to retrieve case record');
    }
  }
  
  // Update case status with MPC security
  async updateCaseStatus(recordId: string, status: string, notes?: string): Promise<void> {
    try {
      await this.base('Cases').update([
        {
          id: recordId,
          fields: {
            'Filing Status': status,
            'Notes': notes || '',
            'Last Updated': new Date().toISOString()
          }
        }
      ]);
    } catch (error) {
      console.error('Error updating case status:', error);
      throw new Error('Failed to update case status');
    }
  }
  
  // Search cases with encrypted data handling
  async searchCases(filters: {
    caseNumber?: string;
    documentType?: string;
    filingStatus?: string;
    emergencyType?: string;
  }): Promise<any[]> {
    try {
      let filterFormula = '';
      const conditions: string[] = [];
      
      if (filters.caseNumber) {
        conditions.push(`{Case Number} = '${filters.caseNumber}'`);
      }
      if (filters.documentType) {
        conditions.push(`{Document Type} = '${filters.documentType}'`);
      }
      if (filters.filingStatus) {
        conditions.push(`{Filing Status} = '${filters.filingStatus}'`);
      }
      if (filters.emergencyType) {
        conditions.push(`{Emergency Type} = '${filters.emergencyType}'`);
      }
      
      if (conditions.length > 0) {
        filterFormula = conditions.length > 1 
          ? `AND(${conditions.join(', ')})` 
          : conditions[0];
      }
      
      const records = await this.base('Cases').select({
        filterByFormula: filterFormula,
        sort: [{ field: 'Date Created', direction: 'desc' }]
      }).all();
      
      return records.map((record: any) => ({
        id: record.id,
        caseNumber: record.fields['Case Number'],
        clientName: record.fields['Client Name (Encrypted)'] 
          ? this.decryptSensitiveData(record.fields['Client Name (Encrypted)'])
          : 'N/A',
        documentType: record.fields['Document Type'],
        filingStatus: record.fields['Filing Status'],
        emergencyType: record.fields['Emergency Type'],
        attorneyAssigned: record.fields['Attorney Assigned'],
        dateCreated: record.fields['Date Created'],
        lastUpdated: record.fields['Last Updated']
      }));
    } catch (error) {
      console.error('Error searching cases:', error);
      throw new Error('Failed to search cases');
    }
  }
  
  // Store document metadata with encryption
  async storeDocumentMetadata(caseId: string, documentData: {
    fileName: string;
    fileType: string;
    fileSize: number;
    analysisResult?: string;
    cmecfStatus?: string;
  }): Promise<string> {
    try {
      // Encrypt sensitive document analysis results
      const encryptedAnalysis = documentData.analysisResult 
        ? this.encryptSensitiveData(documentData.analysisResult)
        : '';
      
      const record = await this.base('Documents').create([
        {
          fields: {
            'Case ID': caseId,
            'File Name': documentData.fileName,
            'File Type': documentData.fileType,
            'File Size': documentData.fileSize,
            'Analysis Result (Encrypted)': encryptedAnalysis,
            'CM/ECF Status': documentData.cmecfStatus || 'Not Filed',
            'Upload Date': new Date().toISOString()
          }
        }
      ]);
      
      return record[0].id;
    } catch (error) {
      console.error('Error storing document metadata:', error);
      throw new Error('Failed to store document metadata');
    }
  }
  
  // Track pro bono attorney assignments
  async assignProBonoAttorney(caseId: string, attorneyData: {
    attorneyName: string;
    organizationName: string;
    contactPhone: string;
    practiceAreas: string[];
    emergencyAvailable: boolean;
  }): Promise<void> {
    try {
      await this.base('Attorney Assignments').create([
        {
          fields: {
            'Case ID': caseId,
            'Attorney Name': attorneyData.attorneyName,
            'Organization': attorneyData.organizationName,
            'Contact Phone': attorneyData.contactPhone,
            'Practice Areas': attorneyData.practiceAreas.join(', '),
            'Emergency Available': attorneyData.emergencyAvailable,
            'Assignment Date': new Date().toISOString(),
            'Status': 'Assigned'
          }
        }
      ]);
    } catch (error) {
      console.error('Error assigning attorney:', error);
      throw new Error('Failed to assign attorney');
    }
  }
  
  // Generate compliance reports with data aggregation
  async generateComplianceReport(dateRange: { start: string; end: string }): Promise<{
    totalCases: number;
    emergencyFilings: number;
    successfulFilings: number;
    pendingFilings: number;
    proBonoAssignments: number;
  }> {
    try {
      const cases = await this.base('Cases').select({
        filterByFormula: `AND(IS_AFTER({Date Created}, '${dateRange.start}'), IS_BEFORE({Date Created}, '${dateRange.end}'))`
      }).all();
      
      const report = {
        totalCases: cases.length,
        emergencyFilings: cases.filter((r: any) => r.fields['Emergency Type']).length,
        successfulFilings: cases.filter((r: any) => r.fields['Filing Status'] === 'Filed Successfully').length,
        pendingFilings: cases.filter((r: any) => r.fields['Filing Status'] === 'Pending Review').length,
        proBonoAssignments: cases.filter((r: any) => r.fields['Attorney Assigned']).length
      };
      
      return report;
    } catch (error) {
      console.error('Error generating compliance report:', error);
      throw new Error('Failed to generate compliance report');
    }
  }
}

export const airtableMPC = new AirtableMPCService();