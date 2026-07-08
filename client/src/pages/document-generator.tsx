import { useState } from "react";
import { ArrowLeft, FileText, Download, Wand2, Eye, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

const DOCUMENT_TYPES = [
  { id: "motion", label: "Motion Builder", description: "Standard motions and requests to the court" },
  { id: "declaration", label: "Declaration Generator", description: "Sworn declarations and attestations" },
  { id: "affidavit", label: "Affidavit Builder", description: "Notarized sworn statements of fact" },
  { id: "complaint", label: "Complaint Generator", description: "Initial complaints and petitions" },
  { id: "response", label: "Response Builder", description: "Answers and responses to opposing filings" },
  { id: "emergency", label: "Emergency Motion Builder", description: "TRO and emergency injunctive relief" },
  { id: "contempt", label: "Contempt Motion Generator", description: "Motions for contempt of court orders" },
];

const MOTION_TYPES = [
  "Motion for Summary Judgment",
  "Motion to Dismiss",
  "Motion for Continuance",
  "Motion in Limine",
  "Motion for Reconsideration",
  "Motion to Compel Discovery",
  "Motion for Default Judgment",
  "Motion to Strike",
  "Motion for Protective Order",
  "Motion for Sanctions",
];

const COURTS = [
  "U.S. District Court — District of Massachusetts",
  "Barnstable Probate and Family Court",
  "Suffolk Superior Court",
  "Massachusetts Appeals Court",
  "Massachusetts Supreme Judicial Court",
  "U.S. Court of Appeals — First Circuit",
];

function generateDocumentText(tab: string, form: Record<string, string>): string {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  if (tab === "motion") {
    return `${form.court || "[COURT NAME]"}
Case No.: ${form.caseNumber || "[CASE NUMBER]"}

IN THE MATTER OF:
${form.petitioner || "[PETITIONER NAME]"}, Petitioner,
v.
${form.respondent || "[RESPONDENT NAME]"}, Respondent.

${(form.motionType || "MOTION").toUpperCase()}

NOW COMES ${form.petitioner || "Petitioner"}, pro se, and respectfully moves this Court for an Order ${form.relief || "[SPECIFY RELIEF SOUGHT]"}, and states the following in support thereof:

INTRODUCTION

1. Petitioner ${form.petitioner || "[Name]"} brings this Motion pursuant to applicable rules of civil procedure and the inherent authority of this Court.

STATEMENT OF FACTS

2. ${form.facts || "[Set forth the relevant facts in numbered paragraphs]"}

LEGAL ARGUMENT

3. ${form.argument || "[Set forth your legal argument, citing applicable statutes, regulations, and case law]"}

CONCLUSION

WHEREFORE, Petitioner respectfully requests that this Court:
(a) ${form.relief || "[Primary relief requested]"};
(b) Grant such other and further relief as this Court deems just and proper.

Respectfully submitted,

Dated: ${today}

_______________________________
${form.petitioner || "[Your Name]"}
Pro Se Petitioner
${form.address || "[Address]"}
${form.phone || "[Phone]"}
${form.email || "[Email]"}`;
  }

  if (tab === "declaration") {
    return `DECLARATION OF ${(form.declarantName || "[YOUR NAME]").toUpperCase()}

I, ${form.declarantName || "[Your Full Name]"}, declare as follows:

1. I am over the age of 18 years and have personal knowledge of the facts stated herein.

2. I am the ${form.role || "Petitioner"} in the above-captioned matter, Case No. ${form.caseNumber || "[Case Number]"}.

3. ${form.factStatement || "[Set forth the facts you are declaring, in numbered paragraphs, using first-person statements of personal knowledge]"}

4. I make this declaration in support of ${form.purpose || "[the pending motion / opposition]"} in the above-captioned matter.

I declare under penalty of perjury under the laws of the United States of America that the foregoing is true and correct to the best of my knowledge.

Executed on ${today}, at ${form.location || "[City, State]"}.

_______________________________
${form.declarantName || "[Your Name]"}`;
  }

  if (tab === "complaint") {
    return `${form.court || "[COURT NAME]"}

${(form.petitioner || "[PETITIONER]").toUpperCase()}, Plaintiff/Petitioner,
  v.
${(form.respondent || "[RESPONDENT]").toUpperCase()}, Defendant/Respondent.

Case No.: ______________

COMPLAINT / PETITION FOR ${(form.relief || "[RELIEF TYPE]").toUpperCase()}

PARTIES

1. Plaintiff/Petitioner ${form.petitioner || "[Name]"} is an individual residing at ${form.address || "[Address]"}.

2. Defendant/Respondent ${form.respondent || "[Name]"} is an individual/entity residing/located at ${form.respondentAddress || "[Address]"}.

JURISDICTION AND VENUE

3. This Court has jurisdiction over this matter pursuant to ${form.jurisdiction || "[cite jurisdictional basis]"}.

4. Venue is proper in this district because ${form.venue || "[state venue basis]"}.

FACTUAL ALLEGATIONS

5. ${form.facts || "[Set forth all relevant facts in numbered paragraphs]"}

CAUSES OF ACTION

Count I: ${form.cause1 || "[First Cause of Action]"}

6. ${form.cause1facts || "[Facts supporting Count I]"}

PRAYER FOR RELIEF

WHEREFORE, Plaintiff/Petitioner respectfully requests that this Court:
(a) ${form.relief || "[Primary relief]"};
(b) Award costs and fees as permitted by law;
(c) Grant such other relief as this Court deems equitable and just.

Respectfully submitted,
Dated: ${today}

_______________________________
${form.petitioner || "[Your Name]"}
Pro Se`;
  }

  if (tab === "emergency") {
    return `EMERGENCY MOTION FOR TEMPORARY RESTRAINING ORDER AND PRELIMINARY INJUNCTION

${form.court || "[COURT NAME]"}
Case No.: ${form.caseNumber || "[CASE NUMBER]"}

EMERGENCY MOTION FOR TEMPORARY RESTRAINING ORDER

Plaintiff/Petitioner ${form.petitioner || "[Name]"} hereby moves on an EMERGENCY basis for a Temporary Restraining Order pursuant to Fed. R. Civ. P. 65 (or applicable state rule), enjoining Defendant ${form.respondent || "[Name]"} from:

${form.injunction || "1. [Specify prohibited actions]\n2. [Additional prohibited actions]"}

GROUNDS FOR EMERGENCY RELIEF

Plaintiff will suffer immediate and irreparable harm if relief is not granted because:
${form.irreparableHarm || "[Describe the immediate, irreparable harm that will occur without emergency relief]"}

LIKELIHOOD OF SUCCESS ON THE MERITS

${form.merits || "[Describe why Plaintiff is likely to succeed on the merits of the underlying claim]"}

BALANCE OF HARMS

The balance of equities tips in Plaintiff's favor because:
${form.balance || "[Explain why harm to Plaintiff outweighs harm to Defendant from granting relief]"}

PUBLIC INTEREST

Granting relief is in the public interest because:
${form.publicInterest || "[Explain any public interest considerations]"}

NOTICE TO OPPOSING PARTY

[ ] Notice has been provided to Respondent/Defendant.
[ ] Notice has not been provided because: ${form.noNoticeReason || "[Explain why ex parte relief is appropriate]"}

WHEREFORE, Petitioner respectfully requests that this Court issue an IMMEDIATE Temporary Restraining Order.

Respectfully submitted on an emergency basis,
Dated: ${today}

_______________________________
${form.petitioner || "[Your Name]"}
Pro Se`;
  }

  if (tab === "contempt") {
    return `MOTION FOR ORDER TO SHOW CAUSE RE: CONTEMPT OF COURT

${form.court || "[COURT NAME]"}
Case No.: ${form.caseNumber || "[CASE NUMBER]"}

MOTION FOR CONTEMPT

Petitioner ${form.petitioner || "[Name]"} respectfully moves this Court to hold Respondent ${form.respondent || "[Name]"} in contempt of court for willful violation of this Court's Order dated ${form.orderDate || "[Date of Order]"}.

THE COURT ORDER AT ISSUE

On ${form.orderDate || "[Date]"}, this Court entered an Order requiring Respondent to:
${form.orderRequirements || "[Describe specifically what the court order required]"}

RESPONDENT'S VIOLATIONS

Despite knowledge of this Court's Order, Respondent has willfully violated it by:
${form.violations || "1. [Describe specific violation #1]\n2. [Describe specific violation #2]"}

EVIDENCE OF WILLFULNESS

Respondent's violations are willful because:
${form.willfulness || "[Explain why the violations are willful, not accidental]"}

HARM TO PETITIONER

As a direct result of Respondent's contemptuous conduct, Petitioner has suffered:
${form.harm || "[Describe specific harm caused by the contempt]"}

RELIEF REQUESTED

Petitioner respectfully requests that this Court:
1. Issue an Order to Show Cause requiring Respondent to appear and explain why they should not be held in contempt;
2. Upon finding of contempt, impose appropriate sanctions including: ${form.sanctions || "fines, incarceration, coercive compliance orders"};
3. Award attorney's fees and costs to Petitioner;
4. Grant such other relief as the Court deems appropriate.

Dated: ${today}

_______________________________
${form.petitioner || "[Your Name]"}
Pro Se Petitioner`;
  }

  // Default/affidavit/response
  return `DOCUMENT GENERATED BY LEGALEASE FILE AI

Court: ${form.court || "[Court]"}
Case No.: ${form.caseNumber || "[Case Number]"}
Date: ${today}
Prepared by: ${form.petitioner || "[Your Name]"}, Pro Se

[Document content will be generated based on the information you provided]

${form.facts || ""}

${form.argument || ""}

Respectfully,
${form.petitioner || "[Your Name]"}`;
}

export default function DocumentGenerator() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("motion");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [form, setForm] = useState<Record<string, string>>({
    court: "",
    caseNumber: "",
    petitioner: "",
    respondent: "",
    motionType: "",
    facts: "",
    argument: "",
    relief: "",
    address: "",
    phone: "",
    email: "",
    declarantName: "",
    role: "",
    factStatement: "",
    purpose: "",
    location: "",
    respondentAddress: "",
    jurisdiction: "",
    venue: "",
    cause1: "",
    cause1facts: "",
    injunction: "",
    irreparableHarm: "",
    merits: "",
    balance: "",
    publicInterest: "",
    noNoticeReason: "",
    orderDate: "",
    orderRequirements: "",
    violations: "",
    willfulness: "",
    harm: "",
    sanctions: "",
  });

  const setField = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      const doc = generateDocumentText(activeTab, form);
      setGeneratedDoc(doc);
      setShowPreview(true);
      toast({ title: "Document Generated", description: "Your document has been generated. Review it in the preview panel." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    toast({ title: "Export to PDF", description: "Your document is being prepared for download. This feature requires a PDF export service." });
  };

  const commonFields = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>Court</Label>
        <Select value={form.court} onValueChange={(v) => setField("court", v)}>
          <SelectTrigger><SelectValue placeholder="Select court..." /></SelectTrigger>
          <SelectContent>
            {COURTS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Case Number</Label>
        <Input placeholder="e.g. BA22P1104EA" value={form.caseNumber} onChange={(e) => setField("caseNumber", e.target.value)} />
      </div>
      <div>
        <Label>Petitioner / Plaintiff Name</Label>
        <Input placeholder="Your full legal name" value={form.petitioner} onChange={(e) => setField("petitioner", e.target.value)} />
      </div>
      <div>
        <Label>Respondent / Defendant Name</Label>
        <Input placeholder="Opposing party name" value={form.respondent} onChange={(e) => setField("respondent", e.target.value)} />
      </div>
    </div>
  );

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
          <Wand2 className="mr-3 h-8 w-8 text-purple-600" />
          AI Document Generator
        </h1>
        <p className="text-lg text-gray-600">
          Generate court-ready legal documents using guided forms and AI assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 px-4 sm:px-0">
        {/* Left: Document Builder */}
        <div>
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setGeneratedDoc(null); setShowPreview(false); }}>
            <TabsList className="grid grid-cols-3 lg:grid-cols-4 mb-4 h-auto">
              {DOCUMENT_TYPES.map((dt) => (
                <TabsTrigger key={dt.id} value={dt.id} className="text-xs py-2">
                  {dt.label.replace(" Builder","").replace(" Generator","")}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Motion Builder */}
            <TabsContent value="motion">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-blue-600" />Motion Builder</CardTitle>
                  <CardDescription>Build standard court motions with guided input fields.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {commonFields}
                  <div>
                    <Label>Motion Type</Label>
                    <Select value={form.motionType} onValueChange={(v) => setField("motionType", v)}>
                      <SelectTrigger><SelectValue placeholder="Select motion type..." /></SelectTrigger>
                      <SelectContent>
                        {MOTION_TYPES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Statement of Facts</Label>
                    <Textarea rows={4} placeholder="Describe the relevant facts in chronological order..." value={form.facts} onChange={(e) => setField("facts", e.target.value)} />
                  </div>
                  <div>
                    <Label>Legal Argument</Label>
                    <Textarea rows={4} placeholder="Set forth your legal argument with citations..." value={form.argument} onChange={(e) => setField("argument", e.target.value)} />
                  </div>
                  <div>
                    <Label>Relief Requested</Label>
                    <Textarea rows={2} placeholder="Describe exactly what you want the court to order..." value={form.relief} onChange={(e) => setField("relief", e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label>Your Address</Label>
                      <Input placeholder="123 Main St, City, State" value={form.address} onChange={(e) => setField("address", e.target.value)} />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input placeholder="(555) 555-5555" value={form.phone} onChange={(e) => setField("phone", e.target.value)} />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input placeholder="you@email.com" value={form.email} onChange={(e) => setField("email", e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Declaration Generator */}
            <TabsContent value="declaration">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-green-600" />Declaration Generator</CardTitle>
                  <CardDescription>Create sworn declarations for use in court proceedings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {commonFields}
                  <div>
                    <Label>Declarant Full Name</Label>
                    <Input placeholder="Your full legal name as it appears on ID" value={form.declarantName} onChange={(e) => setField("declarantName", e.target.value)} />
                  </div>
                  <div>
                    <Label>Your Role in Case</Label>
                    <Input placeholder="e.g. Petitioner, Plaintiff, Witness" value={form.role} onChange={(e) => setField("role", e.target.value)} />
                  </div>
                  <div>
                    <Label>Facts to Declare</Label>
                    <Textarea rows={6} placeholder="State the facts you are declaring, in numbered paragraphs, using first-person language. Only include facts within your personal knowledge." value={form.factStatement} onChange={(e) => setField("factStatement", e.target.value)} />
                  </div>
                  <div>
                    <Label>Purpose of This Declaration</Label>
                    <Input placeholder="e.g. in support of Motion for Summary Judgment" value={form.purpose} onChange={(e) => setField("purpose", e.target.value)} />
                  </div>
                  <div>
                    <Label>Location of Signing</Label>
                    <Input placeholder="City, State" value={form.location} onChange={(e) => setField("location", e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Affidavit Builder */}
            <TabsContent value="affidavit">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-yellow-600" />Affidavit Builder</CardTitle>
                  <CardDescription>Generate notarized sworn statements of fact.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {commonFields}
                  <div>
                    <Label>Affiant Full Name</Label>
                    <Input placeholder="Your full legal name" value={form.declarantName} onChange={(e) => setField("declarantName", e.target.value)} />
                  </div>
                  <div>
                    <Label>Sworn Facts</Label>
                    <Textarea rows={8} placeholder="Set forth the facts in numbered paragraphs. These facts will be sworn under oath before a notary public." value={form.factStatement} onChange={(e) => setField("factStatement", e.target.value)} />
                  </div>
                  <div>
                    <Label>Purpose</Label>
                    <Textarea rows={2} placeholder="Explain the purpose of this affidavit..." value={form.purpose} onChange={(e) => setField("purpose", e.target.value)} />
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-yellow-800">An affidavit must be signed in front of a notary public. A declaration under penalty of perjury may be used in place of a notarized affidavit in federal court.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Complaint Generator */}
            <TabsContent value="complaint">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-red-600" />Complaint Generator</CardTitle>
                  <CardDescription>Draft initial complaints and petitions to open a case.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {commonFields}
                  <div>
                    <Label>Respondent Address</Label>
                    <Input placeholder="Respondent's address" value={form.respondentAddress} onChange={(e) => setField("respondentAddress", e.target.value)} />
                  </div>
                  <div>
                    <Label>Jurisdictional Basis</Label>
                    <Input placeholder="e.g. 28 U.S.C. § 1331 (federal question)" value={form.jurisdiction} onChange={(e) => setField("jurisdiction", e.target.value)} />
                  </div>
                  <div>
                    <Label>Venue Basis</Label>
                    <Input placeholder="e.g. Events occurred in this district" value={form.venue} onChange={(e) => setField("venue", e.target.value)} />
                  </div>
                  <div>
                    <Label>Factual Allegations</Label>
                    <Textarea rows={5} placeholder="Set forth all relevant facts in numbered paragraphs..." value={form.facts} onChange={(e) => setField("facts", e.target.value)} />
                  </div>
                  <div>
                    <Label>Count I — Cause of Action</Label>
                    <Input placeholder="e.g. Breach of Fiduciary Duty" value={form.cause1} onChange={(e) => setField("cause1", e.target.value)} />
                  </div>
                  <div>
                    <Label>Relief Requested</Label>
                    <Textarea rows={2} placeholder="Describe all relief you are requesting from the court..." value={form.relief} onChange={(e) => setField("relief", e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Response Builder */}
            <TabsContent value="response">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-indigo-600" />Response Builder</CardTitle>
                  <CardDescription>Draft answers and responses to opposing party filings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {commonFields}
                  <div>
                    <Label>Document Being Responded To</Label>
                    <Input placeholder="e.g. Motion to Dismiss filed by Respondent on [date]" value={form.purpose} onChange={(e) => setField("purpose", e.target.value)} />
                  </div>
                  <div>
                    <Label>Opposition Facts</Label>
                    <Textarea rows={5} placeholder="Set forth the facts that support your opposition..." value={form.facts} onChange={(e) => setField("facts", e.target.value)} />
                  </div>
                  <div>
                    <Label>Legal Argument in Opposition</Label>
                    <Textarea rows={5} placeholder="Provide your legal arguments and cite applicable authorities..." value={form.argument} onChange={(e) => setField("argument", e.target.value)} />
                  </div>
                  <div>
                    <Label>Relief Requested</Label>
                    <Textarea rows={2} placeholder="e.g. That the Court deny Respondent's motion in its entirety..." value={form.relief} onChange={(e) => setField("relief", e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Emergency Motion Builder */}
            <TabsContent value="emergency">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-red-700">
                    <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
                    Emergency Motion Builder
                  </CardTitle>
                  <CardDescription>Generate TRO and emergency injunctive relief motions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                    <p className="text-xs text-red-800 font-medium">Emergency motions require immediate court action. Ensure you have exhausted other remedies before filing.</p>
                  </div>
                  {commonFields}
                  <div>
                    <Label>Actions to Enjoin (What must Respondent stop doing?)</Label>
                    <Textarea rows={3} placeholder="1. [Prohibited action]\n2. [Prohibited action]" value={form.injunction} onChange={(e) => setField("injunction", e.target.value)} />
                  </div>
                  <div>
                    <Label>Irreparable Harm</Label>
                    <Textarea rows={3} placeholder="Describe the immediate, irreparable harm that will occur without emergency relief..." value={form.irreparableHarm} onChange={(e) => setField("irreparableHarm", e.target.value)} />
                  </div>
                  <div>
                    <Label>Likelihood of Success on Merits</Label>
                    <Textarea rows={3} placeholder="Explain why you are likely to win the underlying case..." value={form.merits} onChange={(e) => setField("merits", e.target.value)} />
                  </div>
                  <div>
                    <Label>Balance of Equities</Label>
                    <Textarea rows={2} placeholder="Explain why harm to you outweighs harm to the other party..." value={form.balance} onChange={(e) => setField("balance", e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contempt Motion Generator */}
            <TabsContent value="contempt">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-orange-600" />Contempt Motion Generator</CardTitle>
                  <CardDescription>Generate motions to hold the opposing party in contempt of court orders.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {commonFields}
                  <div>
                    <Label>Date of Court Order Being Violated</Label>
                    <Input type="date" value={form.orderDate} onChange={(e) => setField("orderDate", e.target.value)} />
                  </div>
                  <div>
                    <Label>What Did the Court Order Require?</Label>
                    <Textarea rows={3} placeholder="Describe specifically what the court order required the respondent to do or not do..." value={form.orderRequirements} onChange={(e) => setField("orderRequirements", e.target.value)} />
                  </div>
                  <div>
                    <Label>How Has the Order Been Violated?</Label>
                    <Textarea rows={4} placeholder="1. [Specific violation #1]\n2. [Specific violation #2]" value={form.violations} onChange={(e) => setField("violations", e.target.value)} />
                  </div>
                  <div>
                    <Label>Why Are the Violations Willful?</Label>
                    <Textarea rows={3} placeholder="Explain why the respondent knew about the order and chose to violate it..." value={form.willfulness} onChange={(e) => setField("willfulness", e.target.value)} />
                  </div>
                  <div>
                    <Label>Harm Caused by Contempt</Label>
                    <Textarea rows={3} placeholder="Describe the specific harm you have suffered as a result of the contempt..." value={form.harm} onChange={(e) => setField("harm", e.target.value)} />
                  </div>
                  <div>
                    <Label>Sanctions Requested</Label>
                    <Input placeholder="e.g. daily fines, incarceration, attorney fees" value={form.sanctions} onChange={(e) => setField("sanctions", e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Generate Button */}
            <div className="mt-4 flex gap-3">
              <Button
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />Generating...</>
                ) : (
                  <><Wand2 className="mr-2 h-4 w-4" />Generate Document</>
                )}
              </Button>
              {showPreview && (
                <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                  <Eye className="mr-2 h-4 w-4" />
                  {showPreview ? "Hide" : "Show"} Preview
                </Button>
              )}
            </div>
          </Tabs>
        </div>

        {/* Right: Preview Panel */}
        <div>
          {showPreview && generatedDoc ? (
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-base">
                    <Eye className="mr-2 h-4 w-4" />
                    Document Preview
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge className="bg-green-100 text-green-800">Ready to Export</Badge>
                    <Button size="sm" variant="outline" onClick={handleExport}>
                      <Download className="mr-1 h-4 w-4" />
                      Export PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white border border-gray-200 rounded-lg p-6 font-mono text-xs leading-relaxed whitespace-pre-wrap overflow-auto max-h-[600px] shadow-inner">
                  {generatedDoc}
                </div>
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-800">
                      This document is AI-generated as a starting template. Review all content carefully, consult with an attorney if possible, and ensure accuracy before filing with the court.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full bg-gray-50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-full py-24">
                <FileText className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-500">Document Preview</h3>
                <p className="text-sm text-gray-400 text-center mt-2 max-w-xs">
                  Fill out the form on the left and click "Generate Document" to see a preview of your legal document.
                </p>
                <div className="mt-6 space-y-2 w-full max-w-xs">
                  {DOCUMENT_TYPES.map((dt) => (
                    <button
                      key={dt.id}
                      onClick={() => setActiveTab(dt.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${activeTab === dt.id ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100 text-gray-600"}`}
                    >
                      <span>{dt.label}</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
