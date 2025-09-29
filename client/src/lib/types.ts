export interface DocumentAnalysisResult {
  docType: string;
  jurisdiction: string;
  compliance: string;
  recommendations: string[];
  extractedData: Record<string, any>;
}

export interface UploadResponse {
  document: any;
  analysis: DocumentAnalysisResult | null;
  success: boolean;
  warning?: string;
}

export interface EmergencyFilingValidation {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
}

export interface CMECFStatus {
  systemStatus: string;
  version: string;
  lastUpdated: string;
  maintenanceScheduled: boolean;
  emergencyFilingAvailable: boolean;
}

export interface LegalAidSearchFilters {
  practiceArea?: string;
  location?: string;
  availability?: string;
  isEmergency?: boolean;
}
