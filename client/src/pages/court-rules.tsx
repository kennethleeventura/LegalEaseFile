import { useState } from "react";
import { ArrowLeft, Search, BookOpen, CheckCircle, XCircle, AlertCircle, Scale, Filter, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface CourtRule {
  id: number;
  court: string;
  jurisdiction: string;
  filingType: string;
  pageLimit?: number;
  marginRequirements?: string;
  fontRequirements?: string;
  deadlineRules?: string;
  filingFees?: string;
  eFilingAvailable: boolean;
  emergencyFiling: boolean;
  additionalNotes?: string;
}

const COURT_RULES: CourtRule[] = [
  {
    id: 1,
    court: "U.S. District Court — District of Massachusetts",
    jurisdiction: "Federal",
    filingType: "Motions",
    pageLimit: 20,
    marginRequirements: "1 inch all sides",
    fontRequirements: "Times New Roman 12pt or Arial 12pt",
    deadlineRules: "14 days to respond to non-dispositive motions; 21 days for dispositive motions",
    filingFees: "No fee for pro se filers on civil case motions",
    eFilingAvailable: true,
    emergencyFiling: true,
    additionalNotes: "Exhibits must be filed separately with exhibit list. ECF filing required for represented parties; pro se may file in person.",
  },
  {
    id: 2,
    court: "U.S. District Court — District of Massachusetts",
    jurisdiction: "Federal",
    filingType: "Briefs",
    pageLimit: 30,
    marginRequirements: "1 inch all sides",
    fontRequirements: "Times New Roman 12pt, double-spaced",
    deadlineRules: "As ordered by the Court; typically 30 days",
    filingFees: "No filing fee for briefs",
    eFilingAvailable: true,
    emergencyFiling: false,
    additionalNotes: "Cover page required. Table of contents for briefs over 10 pages. Table of authorities required.",
  },
  {
    id: 3,
    court: "Barnstable Probate and Family Court",
    jurisdiction: "Massachusetts",
    filingType: "Motions",
    pageLimit: 15,
    marginRequirements: "1 inch all sides",
    fontRequirements: "12pt minimum",
    deadlineRules: "14 days notice required for most hearings; emergency TROs can be same-day",
    filingFees: "$150 filing fee for new petitions; $40 for motions in existing cases",
    eFilingAvailable: true,
    emergencyFiling: true,
    additionalNotes: "Case number must appear on all filings. Probate code forms required for many filings. eFileMA available.",
  },
  {
    id: 4,
    court: "Barnstable Probate and Family Court",
    jurisdiction: "Massachusetts",
    filingType: "Exhibits",
    pageLimit: undefined,
    marginRequirements: "No requirement",
    fontRequirements: "Legible, no specific requirement",
    deadlineRules: "Must be filed or listed at least 7 days before hearing",
    filingFees: "No additional fee",
    eFilingAvailable: true,
    emergencyFiling: false,
    additionalNotes: "Each exhibit must be individually tabbed. Exhibit list required. Bates numbering recommended.",
  },
  {
    id: 5,
    court: "Massachusetts Appeals Court",
    jurisdiction: "Massachusetts",
    filingType: "Appeals",
    pageLimit: 50,
    marginRequirements: "1 inch all sides",
    fontRequirements: "Times New Roman 13pt, double-spaced (or Arial 12pt)",
    deadlineRules: "30 days from judgment to file notice of appeal; 10 days extension available by motion",
    filingFees: "$300 filing fee; fee waiver available for indigent appellants",
    eFilingAvailable: true,
    emergencyFiling: false,
    additionalNotes: "Appendix must be filed with brief. Page limits strictly enforced. Word count limit: 11,000 words for opening brief.",
  },
  {
    id: 6,
    court: "California Superior Court",
    jurisdiction: "California",
    filingType: "Motions",
    pageLimit: 15,
    marginRequirements: "1 inch all sides, 1.5 inch left margin recommended",
    fontRequirements: "Times New Roman or Courier 12pt",
    deadlineRules: "16 court days before hearing; 5 days for opposition; 5 days for reply",
    filingFees: "$60-$450 depending on motion type",
    eFilingAvailable: true,
    emergencyFiling: true,
    additionalNotes: "CRC Rule 3.1113 governs motions. Points and authorities required. Reservation of hearing date required in many counties.",
  },
  {
    id: 7,
    court: "New York Supreme Court",
    jurisdiction: "New York",
    filingType: "Motions",
    pageLimit: 25,
    marginRequirements: "1 inch all sides",
    fontRequirements: "12pt minimum, double-spaced",
    deadlineRules: "8 days before return date (16 days if served by mail)",
    filingFees: "$45 for each motion in civil cases",
    eFilingAvailable: true,
    emergencyFiling: true,
    additionalNotes: "NYSCEF mandatory e-filing in most counties. Affirmation/affidavit required with motion.",
  },
  {
    id: 8,
    court: "U.S. Court of Appeals — First Circuit",
    jurisdiction: "Federal",
    filingType: "Appeals",
    pageLimit: 30,
    marginRequirements: "1 inch all sides",
    fontRequirements: "14pt proportionally spaced font or 12pt monospaced",
    deadlineRules: "30 days from district court judgment; jurisdictional, not waivable",
    filingFees: "$505 docketing fee",
    eFilingAvailable: true,
    emergencyFiling: true,
    additionalNotes: "Circuit Rule 28.0 governs briefs. Certificate of service required. Appendix must include all relevant district court filings.",
  },
  {
    id: 9,
    court: "U.S. District Court — District of Massachusetts",
    jurisdiction: "Federal",
    filingType: "Emergency Filings",
    pageLimit: 10,
    marginRequirements: "1 inch all sides",
    fontRequirements: "12pt minimum",
    deadlineRules: "Can be filed same-day; judge assigned immediately for emergencies",
    filingFees: "No additional fee",
    eFilingAvailable: true,
    emergencyFiling: true,
    additionalNotes: "Must demonstrate irreparable harm and likelihood of success. Notice to opposing party required unless ex parte relief sought. Contact clerk immediately after filing.",
  },
  {
    id: 10,
    court: "U.S. Supreme Court",
    jurisdiction: "Federal",
    filingType: "Appeals",
    pageLimit: 50,
    marginRequirements: "Booklet format, 4.125 x 7.25 inch pages",
    fontRequirements: "Century family or Times New Roman 12pt",
    deadlineRules: "90 days from court of appeals judgment for certiorari petition",
    filingFees: "$300 docketing fee; fee waiver for in forma pauperis",
    eFilingAvailable: false,
    emergencyFiling: true,
    additionalNotes: "Booklet format required for printed copies. 40 copies for cert petition. Pro se filings may use standard letter format.",
  },
  {
    id: 11,
    court: "Texas District Court",
    jurisdiction: "Texas",
    filingType: "Motions",
    pageLimit: 20,
    marginRequirements: "1 inch all sides",
    fontRequirements: "14pt for body text, 12pt for footnotes",
    deadlineRules: "Varies by county; typically 21 days for response",
    filingFees: "$30-$50 depending on county",
    eFilingAvailable: true,
    emergencyFiling: true,
    additionalNotes: "eFileTexas mandatory in most courts. Certificate of conference required for discovery motions.",
  },
  {
    id: 12,
    court: "Florida Circuit Court",
    jurisdiction: "Florida",
    filingType: "Motions",
    pageLimit: undefined,
    marginRequirements: "1 inch all sides",
    fontRequirements: "12pt minimum",
    deadlineRules: "20 days to respond per FRCP; varies by court",
    filingFees: "$30-$50 per motion",
    eFilingAvailable: true,
    emergencyFiling: true,
    additionalNotes: "Florida Courts E-Filing Portal mandatory. Certificate of service required. Hearing must be separately requested.",
  },
];

const JURISDICTIONS = ["All Jurisdictions", "Federal", "Massachusetts", "California", "New York", "Texas", "Florida"];
const FILING_TYPES = ["All Filing Types", "Motions", "Briefs", "Exhibits", "Appeals", "Emergency Filings"];

export default function CourtRules() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("All Jurisdictions");
  const [selectedFilingType, setSelectedFilingType] = useState("All Filing Types");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [complianceDoc, setComplianceDoc] = useState("");
  const [complianceResult, setComplianceResult] = useState<string[] | null>(null);

  const filtered = COURT_RULES.filter((r) => {
    const matchesSearch = !searchQuery || r.court.toLowerCase().includes(searchQuery.toLowerCase()) || r.filingType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJurisdiction = selectedJurisdiction === "All Jurisdictions" || r.jurisdiction === selectedJurisdiction;
    const matchesFiling = selectedFilingType === "All Filing Types" || r.filingType === selectedFilingType;
    return matchesSearch && matchesJurisdiction && matchesFiling;
  });

  const handleComplianceCheck = () => {
    if (!complianceDoc.trim()) {
      toast({ title: "No Document Details", description: "Please enter your document details to check compliance.", variant: "destructive" });
      return;
    }
    const issues: string[] = [];
    const text = complianceDoc.toLowerCase();
    if (!text.includes("12") && !text.includes("14")) issues.push("Font size not specified — most courts require 12-14pt");
    if (!text.includes("double") && !text.includes("1.5")) issues.push("Line spacing not specified — briefs typically require double-spacing");
    if (!text.includes("margin") && !text.includes("inch")) issues.push("Margin requirements not addressed — verify 1-inch minimum margins");
    if (!text.includes("page") && !text.includes("word")) issues.push("Page/word limit not specified — verify you are within court limits");
    if (!text.includes("exhibit") && !text.includes("attachment")) issues.push("No mention of exhibits — verify all cited documents are attached");
    if (issues.length === 0) {
      issues.push("No obvious compliance issues detected. Please review each court's specific local rules.");
    }
    setComplianceResult(issues);
  };

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="mb-6 px-4 sm:px-0">
        <div className="flex items-center mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Scale className="mr-3 h-8 w-8 text-blue-700" />
          Court Rules Database
        </h1>
        <p className="text-gray-600">
          Searchable database of filing requirements, page limits, fees, and formatting rules for courts nationwide.
        </p>
      </div>

      <div className="px-4 sm:px-0 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="sticky top-24">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base">
                <Filter className="mr-2 h-4 w-4" />
                Filter Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-1 block">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Court name or type..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium mb-1 block">Jurisdiction</Label>
                {JURISDICTIONS.map((j) => (
                  <button
                    key={j}
                    onClick={() => setSelectedJurisdiction(j)}
                    className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors mb-1 ${selectedJurisdiction === j ? "bg-blue-100 text-blue-700 font-medium" : "hover:bg-gray-100 text-gray-600"}`}
                  >
                    {j}
                  </button>
                ))}
              </div>
              <div className="border-t pt-3">
                <Label className="text-sm font-medium mb-1 block">Filing Type</Label>
                {FILING_TYPES.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFilingType(f)}
                    className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors mb-1 ${selectedFilingType === f ? "bg-blue-100 text-blue-700 font-medium" : "hover:bg-gray-100 text-gray-600"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Featured Courts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Featured Courts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-3">
              {["U.S. District Court — District of Massachusetts", "Barnstable Probate and Family Court", "California Superior Court", "U.S. Supreme Court"].map((c) => (
                <button
                  key={c}
                  onClick={() => setSearchQuery(c.split("—")[0].trim())}
                  className="w-full text-left px-2 py-1 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors flex items-center"
                >
                  <ChevronRight className="h-3 w-3 mr-1 flex-shrink-0" />
                  {c}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Results count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{filtered.length} rules found</p>
            <Badge variant="outline" className="text-xs">{selectedJurisdiction} · {selectedFilingType}</Badge>
          </div>

          {/* Court Rule Cards */}
          {filtered.map((rule) => (
            <Card key={rule.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <button
                  className="w-full text-left p-4"
                  onClick={() => setExpandedId(expandedId === rule.id ? null : rule.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{rule.court}</h3>
                        <Badge className="bg-blue-100 text-blue-700 text-xs">{rule.jurisdiction}</Badge>
                        <Badge className="bg-purple-100 text-purple-700 text-xs">{rule.filingType}</Badge>
                        {rule.eFilingAvailable && <Badge className="bg-green-100 text-green-700 text-xs">E-Filing</Badge>}
                        {rule.emergencyFiling && <Badge className="bg-red-100 text-red-700 text-xs">Emergency</Badge>}
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-1">
                        {rule.pageLimit && <span><strong>Pages:</strong> {rule.pageLimit} max</span>}
                        {rule.fontRequirements && <span><strong>Font:</strong> {rule.fontRequirements}</span>}
                        {rule.filingFees && <span><strong>Fees:</strong> {rule.filingFees}</span>}
                      </div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform flex-shrink-0 mt-1 ${expandedId === rule.id ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {expandedId === rule.id && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {rule.pageLimit !== undefined && (
                        <div className="bg-gray-50 rounded p-3">
                          <div className="text-xs font-medium text-gray-500 mb-1">Page Limit</div>
                          <div className="text-sm font-semibold text-gray-900">{rule.pageLimit} pages maximum</div>
                        </div>
                      )}
                      {rule.marginRequirements && (
                        <div className="bg-gray-50 rounded p-3">
                          <div className="text-xs font-medium text-gray-500 mb-1">Margin Requirements</div>
                          <div className="text-sm font-semibold text-gray-900">{rule.marginRequirements}</div>
                        </div>
                      )}
                      {rule.fontRequirements && (
                        <div className="bg-gray-50 rounded p-3">
                          <div className="text-xs font-medium text-gray-500 mb-1">Font Requirements</div>
                          <div className="text-sm font-semibold text-gray-900">{rule.fontRequirements}</div>
                        </div>
                      )}
                      {rule.deadlineRules && (
                        <div className="bg-gray-50 rounded p-3">
                          <div className="text-xs font-medium text-gray-500 mb-1">Deadline Rules</div>
                          <div className="text-sm text-gray-900">{rule.deadlineRules}</div>
                        </div>
                      )}
                      {rule.filingFees && (
                        <div className="bg-gray-50 rounded p-3">
                          <div className="text-xs font-medium text-gray-500 mb-1">Filing Fees</div>
                          <div className="text-sm text-gray-900">{rule.filingFees}</div>
                        </div>
                      )}
                      <div className="bg-gray-50 rounded p-3 flex gap-4">
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">E-Filing</div>
                          <div className="flex items-center gap-1">
                            {rule.eFilingAvailable ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-400" />}
                            <span className="text-sm">{rule.eFilingAvailable ? "Available" : "Not Available"}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">Emergency Filing</div>
                          <div className="flex items-center gap-1">
                            {rule.emergencyFiling ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-400" />}
                            <span className="text-sm">{rule.emergencyFiling ? "Available" : "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {rule.additionalNotes && (
                      <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-800">{rule.additionalNotes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <Card>
              <CardContent className="py-16 text-center">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No court rules found matching your search</p>
              </CardContent>
            </Card>
          )}

          {/* Formatting Compliance Checker */}
          <Card className="border-2 border-dashed border-blue-200 mt-6">
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <CheckCircle className="mr-2 h-5 w-5 text-blue-600" />
                Formatting Compliance Checker
              </CardTitle>
              <CardDescription>
                Paste your document details below to get a quick compliance check against general court formatting standards.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Document Details</Label>
                <Textarea
                  rows={5}
                  placeholder="Describe your document format — e.g. '20-page motion, Times New Roman 12pt, double-spaced, 1-inch margins, includes exhibit list with 8 exhibits, filed in U.S. District Court MA...'"
                  value={complianceDoc}
                  onChange={(e) => setComplianceDoc(e.target.value)}
                />
              </div>
              <Button onClick={handleComplianceCheck} className="bg-blue-600 hover:bg-blue-700 text-white">
                <CheckCircle className="mr-2 h-4 w-4" />
                Check Compliance
              </Button>

              {complianceResult && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">Compliance Report:</h4>
                  {complianceResult.map((issue, i) => (
                    <div key={i} className={`flex items-start p-2 rounded text-sm ${issue.includes("No obvious") ? "bg-green-50 border border-green-200 text-green-800" : "bg-yellow-50 border border-yellow-200 text-yellow-800"}`}>
                      {issue.includes("No obvious") ? (
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-yellow-600" />
                      )}
                      {issue}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
