// Massachusetts Court System Configuration
export interface CourtInfo {
  id: string;
  name: string;
  type: 'federal' | 'state' | 'probate' | 'district' | 'superior' | 'housing' | 'juvenile' | 'land';
  jurisdiction: string;
  address: string;
  phone: string;
  website: string;
  filingRequirements: string[];
  documentTypes: string[];
  emergencyProcedures: boolean;
}

export const MA_COURTS: CourtInfo[] = [
  // Federal Courts
  {
    id: 'ma-fed-district',
    name: 'U.S. District Court for the District of Massachusetts',
    type: 'federal',
    jurisdiction: 'Federal',
    address: '1 Courthouse Way, Boston, MA 02210',
    phone: '(617) 748-9152',
    website: 'https://www.mad.uscourts.gov',
    filingRequirements: [
      'CM/ECF electronic filing required',
      'PACER account needed',
      'Attorney admission to federal bar',
      'Electronic signature required'
    ],
    documentTypes: [
      'Civil Complaint', 'Motion', 'Answer', 'Discovery', 'Summary Judgment',
      'TRO', 'Preliminary Injunction', 'Appeal', 'Bankruptcy'
    ],
    emergencyProcedures: true
  },

  // State Superior Courts
  {
    id: 'barnstable-superior',
    name: 'Barnstable Superior Court',
    type: 'superior',
    jurisdiction: 'Barnstable County',
    address: '3195 Main St, Barnstable, MA 02630',
    phone: '(508) 375-6684',
    website: 'https://www.mass.gov/locations/barnstable-superior-court',
    filingRequirements: [
      'MassCourts e-filing system',
      'Attorney BBO number required',
      'Service requirements per Mass. R. Civ. P.',
      'Filing fees required'
    ],
    documentTypes: [
      'Civil Action', 'Motion', 'Answer', 'Discovery', 'Summary Judgment',
      'Injunctive Relief', 'Appeal from District Court'
    ],
    emergencyProcedures: true
  },

  // Probate and Family Courts
  {
    id: 'barnstable-probate',
    name: 'Barnstable Probate and Family Court',
    type: 'probate',
    jurisdiction: 'Barnstable County',
    address: '3195 Main St, Barnstable, MA 02630',
    phone: '(508) 375-6710',
    website: 'https://www.mass.gov/locations/barnstable-probate-and-family-court',
    filingRequirements: [
      'MassCourts e-filing for most cases',
      'Certified copies for vital records',
      'Guardian ad litem appointments when required',
      'Mandatory disclosure requirements',
      'Financial statements in divorce cases'
    ],
    documentTypes: [
      'Petition for Divorce', 'Custody Motion', 'Probate Petition',
      'Guardianship Petition', 'Adoption Petition', 'Name Change',
      'Will Contest', 'Estate Administration', 'Trust Matters',
      'Domestic Relations', 'Child Support', 'Restraining Order'
    ],
    emergencyProcedures: true
  },

  // District Courts
  {
    id: 'barnstable-district',
    name: 'Barnstable District Court',
    type: 'district',
    jurisdiction: 'Barnstable County',
    address: '3195 Main St, Barnstable, MA 02630',
    phone: '(508) 375-6650',
    website: 'https://www.mass.gov/locations/barnstable-district-court',
    filingRequirements: [
      'Small claims under $7,000',
      'Civil cases under $25,000',
      'Criminal complaints',
      'Motor vehicle violations'
    ],
    documentTypes: [
      'Small Claims', 'Civil Complaint', 'Criminal Complaint',
      'Restraining Order', 'Motor Vehicle Citation',
      'Housing Matters', 'Summary Process'
    ],
    emergencyProcedures: true
  },

  // Additional Massachusetts Courts
  {
    id: 'suffolk-superior',
    name: 'Suffolk Superior Court',
    type: 'superior',
    jurisdiction: 'Suffolk County',
    address: '3 Pemberton Square, Boston, MA 02108',
    phone: '(617) 788-8130',
    website: 'https://www.mass.gov/locations/suffolk-superior-court',
    filingRequirements: [
      'MassCourts e-filing system',
      'Attorney BBO number required',
      'Service requirements per Mass. R. Civ. P.'
    ],
    documentTypes: [
      'Civil Action', 'Motion', 'Answer', 'Discovery', 'Summary Judgment'
    ],
    emergencyProcedures: true
  },

  {
    id: 'middlesex-probate',
    name: 'Middlesex Probate and Family Court',
    type: 'probate',
    jurisdiction: 'Middlesex County',
    address: '208 Cambridge St, Cambridge, MA 02141',
    phone: '(617) 768-5800',
    website: 'https://www.mass.gov/locations/middlesex-probate-and-family-court',
    filingRequirements: [
      'MassCourts e-filing for most cases',
      'Certified copies for vital records',
      'Financial statements in divorce cases'
    ],
    documentTypes: [
      'Petition for Divorce', 'Custody Motion', 'Probate Petition',
      'Guardianship Petition', 'Adoption Petition'
    ],
    emergencyProcedures: true
  },

  {
    id: 'worcester-superior',
    name: 'Worcester Superior Court',
    type: 'superior',
    jurisdiction: 'Worcester County',
    address: '225 Main St, Worcester, MA 01608',
    phone: '(508) 831-2200',
    website: 'https://www.mass.gov/locations/worcester-superior-court',
    filingRequirements: [
      'MassCourts e-filing system',
      'Attorney BBO number required'
    ],
    documentTypes: [
      'Civil Action', 'Motion', 'Answer', 'Discovery'
    ],
    emergencyProcedures: true
  },

  {
    id: 'hampden-probate',
    name: 'Hampden Probate and Family Court',
    type: 'probate',
    jurisdiction: 'Hampden County',
    address: '50 State St, Springfield, MA 01103',
    phone: '(413) 748-7758',
    website: 'https://www.mass.gov/locations/hampden-probate-and-family-court',
    filingRequirements: [
      'MassCourts e-filing for most cases',
      'Certified copies for vital records'
    ],
    documentTypes: [
      'Petition for Divorce', 'Custody Motion', 'Probate Petition'
    ],
    emergencyProcedures: true
  }
];

export class MACourtService {
  static getCourtById(courtId: string): CourtInfo | undefined {
    return MA_COURTS.find(court => court.id === courtId);
  }

  static getCourtsByType(type: CourtInfo['type']): CourtInfo[] {
    return MA_COURTS.filter(court => court.type === type);
  }

  static getCourtsByJurisdiction(jurisdiction: string): CourtInfo[] {
    return MA_COURTS.filter(court => 
      court.jurisdiction.toLowerCase().includes(jurisdiction.toLowerCase())
    );
  }

  static validateDocumentForCourt(documentType: string, courtId: string): {
    isValid: boolean;
    issues: string[];
    requirements: string[];
  } {
    const court = this.getCourtById(courtId);
    if (!court) {
      return {
        isValid: false,
        issues: ['Invalid court specified'],
        requirements: []
      };
    }

    const issues: string[] = [];
    
    if (!court.documentTypes.includes(documentType)) {
      issues.push(`Document type "${documentType}" not accepted by ${court.name}`);
    }

    return {
      isValid: issues.length === 0,
      issues,
      requirements: court.filingRequirements
    };
  }

  static getFilingRequirements(courtId: string, documentType: string): {
    general: string[];
    specific: string[];
    deadlines: string[];
  } {
    const court = this.getCourtById(courtId);
    if (!court) {
      return { general: [], specific: [], deadlines: [] };
    }

    const general = court.filingRequirements;
    const specific: string[] = [];
    const deadlines: string[] = [];

    // Add document-specific requirements
    switch (documentType) {
      case 'Petition for Divorce':
        specific.push('Financial Statement (Long Form) required');
        specific.push('Certified copy of marriage certificate');
        specific.push('Parenting plan if children involved');
        deadlines.push('120-day waiting period after service');
        break;
      case 'Probate Petition':
        specific.push('Death certificate required');
        specific.push('Original will if available');
        specific.push('Bond may be required');
        deadlines.push('File within 30 days of death');
        break;
      case 'TRO':
        specific.push('Affidavit showing immediate and irreparable injury');
        specific.push('Efforts to notify opposing party');
        specific.push('Security bond may be required');
        deadlines.push('Hearing within 10 days');
        break;
      case 'Motion for Summary Judgment':
        specific.push('Statement of material facts');
        specific.push('Supporting affidavits');
        specific.push('Memorandum of law');
        deadlines.push('File at least 30 days before trial');
        break;
    }

    return { general, specific, deadlines };
  }
}