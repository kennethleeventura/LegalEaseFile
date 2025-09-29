# LegalEaseFile Airtable Integration Setup

## Overview
This system connects to your Airtable database to automatically create forms, manage case data, and export court-ready documents with full HIPAA and compliance checking.

## Prerequisites

### 1. Airtable Setup
1. Create an Airtable account at https://airtable.com
2. Create a new base called "LegalEase Cases"
3. Create the following tables:

#### Cases Table
- Case Number (Single line text)
- Client Name (Encrypted) (Single line text)
- Document Type (Single select: Motion, Complaint, Answer, Discovery, TRO, Preliminary Injunction)
- Filing Status (Single select: Draft, Pending Review, Ready to File, Filed Successfully)
- Emergency Type (Single line text)
- Attorney Assigned (Single line text)
- Date Created (Date)
- Last Updated (Date)

#### Documents Table
- Case ID (Link to Cases table)
- File Name (Single line text)
- File Type (Single line text)
- File Size (Number)
- Analysis Result (Encrypted) (Long text)
- CM/ECF Status (Single select: Not Filed, Filed, Rejected)
- Upload Date (Date)

#### Attorney Assignments Table
- Case ID (Link to Cases table)
- Attorney Name (Single line text)
- Organization (Single line text)
- Contact Phone (Phone)
- Practice Areas (Multiple select)
- Emergency Available (Checkbox)
- Assignment Date (Date)
- Status (Single select: Assigned, Active, Completed)

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in:

```bash
# Generate encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
ENCRYPTION_KEY=your_64_character_hex_key
OPENAI_API_KEY=your_openai_api_key
```

### 3. Install Dependencies
```bash
npm install
```

## Features

### 1. Secure Data Storage
- All sensitive client data is encrypted using AES-256-CBC
- Encryption keys are managed securely via environment variables
- HIPAA-compliant data handling

### 2. AI-Powered Form Generation
- Auto-populates forms based on existing case database
- Learns from historical case patterns
- Suggests optimal document templates

### 3. Compliance Checking
- HIPAA compliance verification
- Federal Rules of Civil Procedure compliance
- CM/ECF readiness validation
- Automatic redaction detection

### 4. Court-Ready PDF Export
- Generates properly formatted exhibit lists
- Includes compliance certifications
- Ready for federal court filing
- Automatic case number validation

## API Endpoints

### Case Management
- `POST /api/airtable/cases` - Create new case
- `GET /api/airtable/cases/:recordId` - Get case details
- `GET /api/airtable/cases` - Search cases with filters
- `PATCH /api/airtable/cases/:recordId/status` - Update case status

### AI-Powered Features
- `POST /api/mpc/auto-populate` - Auto-populate forms
- `POST /api/mpc/exhibit-list/:caseId` - Generate exhibit list
- `GET /api/mpc/insights/:caseId` - Get case insights
- `POST /api/mpc/select-template` - Smart template selection

### Document Export
- `POST /api/mpc/export-pdf/:caseId` - Export court-ready PDF

## Security Features

### 1. Input Sanitization
- XSS prevention on all user inputs
- Path traversal protection for file operations
- SQL injection prevention for database queries

### 2. CSRF Protection
- CSRF tokens for all state-changing requests
- Session-based token validation
- Automatic token refresh

### 3. Rate Limiting
- API rate limiting to prevent abuse
- File upload size restrictions
- Request validation and sanitization

## Usage

### 1. Creating Cases
```javascript
// Frontend usage
const createCase = async (caseData) => {
  const response = await fetch('/api/airtable/cases', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(caseData)
  });
  return response.json();
};
```

### 2. Auto-Populating Forms
```javascript
// Auto-populate based on client name
const autoPopulate = async (clientName, formType) => {
  const response = await fetch('/api/mpc/auto-populate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientName, formType })
  });
  return response.json();
};
```

### 3. Exporting Court-Ready PDFs
```javascript
// Export exhibit list as PDF
const exportPDF = async (caseId) => {
  const response = await fetch(`/api/mpc/export-pdf/${caseId}`, {
    method: 'POST'
  });
  const blob = await response.blob();
  // Handle file download
};
```

## Compliance Features

### HIPAA Compliance
- Automatic detection of health information
- Redaction requirement alerts
- Encrypted storage of sensitive data
- Audit trail for all data access

### Federal Rules Compliance
- Exhibit numbering validation
- Document format verification
- Filing deadline tracking
- Court-specific formatting

### CM/ECF Integration
- Case number format validation
- Electronic signature verification
- Document structure compliance
- Filing status tracking

## Troubleshooting

### Common Issues
1. **Encryption Key Errors**: Ensure ENCRYPTION_KEY is exactly 64 hex characters
2. **Airtable Connection**: Verify API key and base ID are correct
3. **PDF Export Fails**: Check case data completeness and compliance
4. **Form Auto-Population**: Ensure sufficient historical data exists

### Error Codes
- `400`: Invalid input data or missing required fields
- `401`: Authentication required
- `403`: CSRF token invalid or missing
- `404`: Case or document not found
- `500`: Server error or external service failure

## Support
For technical support or questions about the Airtable integration, please refer to the system documentation or contact your system administrator.