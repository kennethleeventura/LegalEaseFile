import { useState } from "react";
import { ArrowLeft, Search, BookOpen, Scale, FileText, Star, ExternalLink, MessageSquare, ChevronRight, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

const STATUTES = [
  { id: 1, citation: "Mass. Gen. Laws ch. 190B, § 3-101", title: "Duty of Personal Representative — General Duties", jurisdiction: "Massachusetts", summary: "The personal representative is a fiduciary who must observe the standard of care applicable to trustees and may be personally liable for breach.", relevance: 98, area: "Probate" },
  { id: 2, citation: "Mass. Gen. Laws ch. 190B, § 3-709", title: "Duty of PR — Inventory and Accounting", jurisdiction: "Massachusetts", summary: "Within 90 days of appointment, the PR must prepare an inventory of the estate property listing each item at fair market value.", relevance: 97, area: "Probate" },
  { id: 3, citation: "Mass. Gen. Laws ch. 190B, § 3-608", title: "Removal of Personal Representative", jurisdiction: "Massachusetts", summary: "A personal representative may be removed by the court for cause, including failure to comply with court orders, dishonesty, or breach of fiduciary duty.", relevance: 95, area: "Probate" },
  { id: 4, citation: "Mass. Gen. Laws ch. 190B, § 3-1001", title: "Petition for Surcharge", jurisdiction: "Massachusetts", summary: "Beneficiaries may petition the court to surcharge a PR for losses to the estate resulting from breach of fiduciary duty.", relevance: 94, area: "Probate" },
  { id: 5, citation: "28 U.S.C. § 1331", title: "Federal Question Jurisdiction", jurisdiction: "Federal", summary: "District courts shall have original jurisdiction of all civil actions arising under the Constitution, laws, or treaties of the United States.", relevance: 85, area: "Civil Procedure" },
  { id: 6, citation: "42 U.S.C. § 1983", title: "Civil Action for Deprivation of Rights", jurisdiction: "Federal", summary: "Every person who, under color of state law, deprives another of constitutional rights shall be liable in an action at law.", relevance: 78, area: "Civil Rights" },
  { id: 7, citation: "Mass. Gen. Laws ch. 231A, § 1", title: "Declaratory Judgment Act", jurisdiction: "Massachusetts", summary: "Courts of record within their respective jurisdictions shall have power to declare rights, status, and other legal relations.", relevance: 82, area: "Civil Procedure" },
  { id: 8, citation: "Mass. Gen. Laws ch. 214, § 1", title: "Jurisdiction in Equity — Superior Court", jurisdiction: "Massachusetts", summary: "The Supreme Judicial Court and Superior Court shall have original jurisdiction in equity as to all cases and matters", relevance: 80, area: "Civil Procedure" },
];

const CASE_LAW = [
  { id: 1, citation: "Farnum v. Silvano, 27 Mass. App. Ct. 536 (1989)", title: "Fiduciary Duty of PR — Breach Standard", jurisdiction: "Massachusetts", summary: "A PR who fails to account to beneficiaries and misuses estate funds breaches fiduciary duty and may be surcharged for all losses plus interest.", relevance: 99, area: "Probate" },
  { id: 2, citation: "In re Estate of Wood, 374 Mass. 541 (1978)", title: "PR Removal for Non-Compliance with Court Orders", jurisdiction: "Massachusetts", summary: "A PR who willfully fails to comply with court orders may be removed and held in contempt; removal does not require proof of criminal intent.", relevance: 97, area: "Probate" },
  { id: 3, citation: "Briggs v. Crowley, 352 Mass. 194 (1967)", title: "Trust Amendment — Capacity Requirement", jurisdiction: "Massachusetts", summary: "To amend a trust, the settlor must have testamentary capacity — knowing nature and extent of property, natural objects of bounty, and nature of the act.", relevance: 96, area: "Probate" },
  { id: 4, citation: "Jackson v. Phillips, 96 Mass. 539 (1867)", title: "Undue Influence — Presumption", jurisdiction: "Massachusetts", summary: "Undue influence may be found where the influencer had opportunity and disposition to exert influence and the testamentary document benefits them.", relevance: 90, area: "Probate" },
  { id: 5, citation: "Celotex Corp. v. Catrett, 477 U.S. 317 (1986)", title: "Summary Judgment Standard", jurisdiction: "Federal", summary: "Summary judgment shall be rendered if there is no genuine issue of material fact and the moving party is entitled to judgment as a matter of law.", relevance: 88, area: "Civil Procedure" },
  { id: 6, citation: "Anderson v. Liberty Lobby, 477 U.S. 242 (1986)", title: "Summary Judgment — Genuine Issue Standard", jurisdiction: "Federal", summary: "At the summary judgment stage, courts must view evidence in the light most favorable to the non-moving party.", relevance: 85, area: "Civil Procedure" },
  { id: 7, citation: "Mathews v. Eldridge, 424 U.S. 319 (1976)", title: "Due Process — Balancing Test", jurisdiction: "Federal", summary: "Due process requires balancing: private interest at stake, risk of erroneous deprivation, government's interest, and burden of additional safeguards.", relevance: 75, area: "Constitutional" },
  { id: 8, citation: "Palmore v. Sidoti, 466 U.S. 429 (1984)", title: "Racial Classifications — Strict Scrutiny", jurisdiction: "Federal", summary: "Private biases may be outside the reach of law, but the law cannot, directly or indirectly, give them effect.", relevance: 60, area: "Constitutional" },
];

const FORMS = [
  { id: 1, name: "MPC 750 — Petition for Removal of Personal Representative", jurisdiction: "Massachusetts", court: "Probate Court", description: "Used to petition for removal of a PR for cause including breach of fiduciary duty or non-compliance" },
  { id: 2, name: "MPC 801 — Annual Account", jurisdiction: "Massachusetts", court: "Probate Court", description: "Annual accounting form required of personal representatives" },
  { id: 3, name: "MPC 265 — Petition for Contempt", jurisdiction: "Massachusetts", court: "Probate Court", description: "Used to hold a party in contempt of probate court order" },
  { id: 4, name: "AO 440 — Summons in Civil Action", jurisdiction: "Federal", court: "U.S. District Court", description: "Standard federal court summons form" },
  { id: 5, name: "Pro Se 1 — Complaint for Civil Case", jurisdiction: "Federal", court: "U.S. District Court", description: "Standard complaint form for pro se civil case filers" },
  { id: 6, name: "IFP — Motion to Proceed In Forma Pauperis", jurisdiction: "Federal", court: "U.S. District Court", description: "Fee waiver application for low-income litigants" },
];

const GLOSSARY = [
  { term: "Beneficiary", definition: "A person or entity entitled to receive assets from an estate or trust." },
  { term: "Contempt of Court", definition: "Willful disobedience of a court order, punishable by fines or imprisonment." },
  { term: "Decedent", definition: "A deceased person whose estate is being administered." },
  { term: "De Facto", definition: "In fact; existing or holding a position in fact though not of legal right." },
  { term: "Disposition", definition: "The transfer of property or rights to another; the final settlement of an estate." },
  { term: "Estate", definition: "All property, real and personal, owned by a decedent at the time of death." },
  { term: "Fiduciary", definition: "A person who holds a position of trust and must act in the best interests of the beneficiary." },
  { term: "Injunction", definition: "A court order requiring a party to do or refrain from doing specific acts." },
  { term: "Intestate", definition: "Dying without a valid will; the estate is distributed according to state law." },
  { term: "In Rem", definition: "A court's jurisdiction over property rather than a person." },
  { term: "Laches", definition: "Unreasonable delay in asserting a right that prejudices the other party." },
  { term: "Mandamus", definition: "A court order compelling a government official or lower court to perform a duty." },
  { term: "Motion in Limine", definition: "A pretrial motion asking the court to exclude or admit evidence at trial." },
  { term: "Personal Representative (PR)", definition: "A person appointed by the court to administer a decedent's estate." },
  { term: "Petition", definition: "A formal written request to a court or government body." },
  { term: "Pro Se", definition: "A Latin term for representing oneself in court without an attorney." },
  { term: "Probate", definition: "The legal process of administering a deceased person's estate." },
  { term: "Res Judicata", definition: "A doctrine that prevents re-litigation of claims already decided by a court." },
  { term: "Sua Sponte", definition: "Latin for 'on its own accord'; a court's action taken without a party's request." },
  { term: "Surcharge", definition: "A financial penalty imposed on a trustee or PR for breach of fiduciary duty, requiring personal repayment of losses." },
  { term: "Summary Judgment", definition: "A court ruling that a case can be decided without trial because there are no genuine issues of material fact." },
  { term: "Testator", definition: "A person who makes and signs a will." },
  { term: "TRO", definition: "Temporary Restraining Order — an emergency court order requiring immediate action or restraint." },
  { term: "Venue", definition: "The geographic jurisdiction in which a case is filed and tried." },
  { term: "Voir Dire", definition: "The process of examining potential jurors to select an impartial jury." },
];

const JURISDICTIONS = ["All Jurisdictions", "Federal", "Massachusetts", "California", "New York", "Texas", "Florida"];

export default function ResearchLibrary() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("All Jurisdictions");
  const [activeTab, setActiveTab] = useState("statutes");
  const [glossaryLetter, setGlossaryLetter] = useState("All");

  const filterResults = <T extends { jurisdiction: string; summary?: string; citation?: string; title?: string; name?: string }>(items: T[]) =>
    items.filter((item) => {
      const matchesJurisdiction = selectedJurisdiction === "All Jurisdictions" || item.jurisdiction === selectedJurisdiction;
      const searchText = [item.citation || item.name || "", item.title || "", item.summary || ""].join(" ").toLowerCase();
      const matchesSearch = !searchQuery || searchText.includes(searchQuery.toLowerCase());
      return matchesJurisdiction && matchesSearch;
    });

  const filteredStatutes = filterResults(STATUTES);
  const filteredCaseLaw = filterResults(CASE_LAW);
  const filteredForms = filterResults(FORMS);

  const alphabet = ["All", ...Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ")];
  const filteredGlossary = GLOSSARY.filter((g) =>
    (glossaryLetter === "All" || g.term.startsWith(glossaryLetter)) &&
    (!searchQuery || g.term.toLowerCase().includes(searchQuery.toLowerCase()) || g.definition.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => a.term.localeCompare(b.term));

  const handleAskMPC = (citation: string) => {
    toast({ title: "Opening MPC Assistant", description: `Asking MPC about ${citation}...` });
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
          <BookOpen className="mr-3 h-8 w-8 text-emerald-700" />
          Legal Research Library
        </h1>
        <p className="text-gray-600">Search statutes, case law, court forms, and legal definitions.</p>
      </div>

      <div className="px-4 sm:px-0 space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search statutes, cases, forms, glossary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-base"
            />
          </div>
          <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
            <SelectTrigger className="w-48">
              <Scale className="mr-2 h-4 w-4 text-gray-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {JURISDICTIONS.map((j) => <SelectItem key={j} value={j}>{j}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 sm:grid-cols-5">
            <TabsTrigger value="statutes">Statutes</TabsTrigger>
            <TabsTrigger value="caselaw">Case Law</TabsTrigger>
            <TabsTrigger value="courtrules">Court Rules</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="glossary">Glossary</TabsTrigger>
          </TabsList>

          {/* Statutes */}
          <TabsContent value="statutes">
            <div className="space-y-3">
              <p className="text-sm text-gray-500">{filteredStatutes.length} statutes found</p>
              {filteredStatutes.map((statute) => (
                <Card key={statute.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-semibold text-blue-700">{statute.citation}</span>
                          <Badge className="bg-emerald-100 text-emerald-700 text-xs">{statute.jurisdiction}</Badge>
                          <Badge variant="secondary" className="text-xs">{statute.area}</Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{statute.title}</h3>
                        <p className="text-sm text-gray-600">{statute.summary}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-gray-500">Relevance: {statute.relevance}%</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => handleAskMPC(statute.citation)}>
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Ask MPC
                        </Button>
                        <Button size="sm" variant="ghost" className="text-xs text-blue-600">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Case Law */}
          <TabsContent value="caselaw">
            <div className="space-y-3">
              <p className="text-sm text-gray-500">{filteredCaseLaw.length} cases found</p>
              {filteredCaseLaw.map((kase) => (
                <Card key={kase.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-semibold text-purple-700">{kase.citation}</span>
                          <Badge className="bg-purple-100 text-purple-700 text-xs">{kase.jurisdiction}</Badge>
                          <Badge variant="secondary" className="text-xs">{kase.area}</Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{kase.title}</h3>
                        <p className="text-sm text-gray-600">{kase.summary}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-gray-500">Relevance: {kase.relevance}%</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => handleAskMPC(kase.citation)}>
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Ask MPC
                        </Button>
                        <Button size="sm" variant="ghost" className="text-xs text-purple-600">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Court Rules (links to court-rules page) */}
          <TabsContent value="courtrules">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-8 text-center">
                <Scale className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Full Court Rules Database</h3>
                <p className="text-gray-600 mb-6">
                  Access our comprehensive court rules database with filing requirements, page limits, fees, and formatting rules for courts nationwide.
                </p>
                <Link href="/court-rules">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Go to Court Rules Database
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forms */}
          <TabsContent value="forms">
            <div className="space-y-3">
              <p className="text-sm text-gray-500">{filteredForms.length} forms found</p>
              {filteredForms.map((form) => (
                <Card key={form.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-semibold text-teal-700">{form.name.split("—")[0].trim()}</span>
                          <Badge className="bg-teal-100 text-teal-700 text-xs">{form.jurisdiction}</Badge>
                          <Badge variant="secondary" className="text-xs">{form.court}</Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{form.name.includes("—") ? form.name.split("—")[1].trim() : form.name}</h3>
                        <p className="text-sm text-gray-600">{form.description}</p>
                      </div>
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => toast({ title: "Form Downloaded", description: `Downloading ${form.name}...` })}>
                          <FileText className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Glossary */}
          <TabsContent value="glossary">
            <div className="space-y-4">
              {/* Alphabet filter */}
              <div className="flex flex-wrap gap-1">
                {alphabet.map((l) => (
                  <button
                    key={l}
                    onClick={() => setGlossaryLetter(l)}
                    className={`w-8 h-8 text-xs font-medium rounded transition-colors ${glossaryLetter === l ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <p className="text-sm text-gray-500">{filteredGlossary.length} terms</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredGlossary.map((entry) => (
                  <Card key={entry.term} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Book className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{entry.term}</h3>
                          <p className="text-sm text-gray-600 mt-0.5">{entry.definition}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
