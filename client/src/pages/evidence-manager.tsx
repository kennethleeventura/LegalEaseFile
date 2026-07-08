import { useState } from "react";
import { ArrowLeft, Upload, Search, Tag, FolderOpen, AlertTriangle, Download, FileText, Image, File, Filter, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface EvidenceItem {
  id: number;
  exhibitNumber: string;
  title: string;
  documentType: string;
  date: string;
  description: string;
  category: string;
  tags: string[];
  fileType: "pdf" | "image" | "doc" | "other";
  relevance: "High" | "Medium" | "Low";
  caseNumber: string;
}

const INITIAL_EVIDENCE: EvidenceItem[] = [
  { id: 1, exhibitNumber: "AE-01", title: "Trust Agreement — 2003", documentType: "Trust Document", date: "2003-04-15", description: "Original trust agreement establishing the Kenneth Ventura Sr. Trust", category: "Court Orders", tags: ["trust", "estate", "foundational"], fileType: "pdf", relevance: "High", caseNumber: "BA22P1104EA" },
  { id: 2, exhibitNumber: "AE-02", title: "Property Deed — 44 Camp Street", documentType: "Real Property Record", date: "2003-08-20", description: "Deed transferring 44 Camp Street Hyannis MA to trust", category: "Property Records", tags: ["deed", "property", "44 Camp St"], fileType: "pdf", relevance: "High", caseNumber: "BA22P1104EA" },
  { id: 3, exhibitNumber: "AE-03", title: "Email from Sarah Long — April 28, 2022", documentType: "Communication", date: "2022-04-28", description: "Email from PR Sarah Long acknowledging receipt of distribution demands", category: "Communications", tags: ["email", "sarah long", "demand"], fileType: "doc", relevance: "High", caseNumber: "BA22P1104EA" },
  { id: 4, exhibitNumber: "AE-04", title: "Barnstable Court Order — March 15, 2022", documentType: "Court Order", date: "2022-03-15", description: "Court order requiring PR to account for estate assets within 30 days", category: "Court Orders", tags: ["court order", "accounting", "compliance"], fileType: "pdf", relevance: "High", caseNumber: "BA22P1104EA" },
  { id: 5, exhibitNumber: "AE-05", title: "Bank Statements — Dec 2021", documentType: "Financial Record", date: "2021-12-31", description: "Estate bank account statements showing unauthorized withdrawals", category: "Financial Records", tags: ["bank", "withdrawals", "estate funds"], fileType: "pdf", relevance: "High", caseNumber: "BA22P1104EA" },
  { id: 6, exhibitNumber: "AE-06", title: "Real Estate Appraisal — 2022", documentType: "Financial Record", date: "2022-01-10", description: "Independent appraisal of 44 Camp Street valued at $620,000", category: "Financial Records", tags: ["appraisal", "property value", "44 Camp St"], fileType: "pdf", relevance: "High", caseNumber: "BA22P1104EA" },
  { id: 7, exhibitNumber: "AE-07", title: "Witness Statement — John Doe", documentType: "Witness Statement", date: "2022-06-05", description: "Statement from neighbor regarding property access and PR behavior", category: "Witness Statements", tags: ["witness", "neighbor", "access"], fileType: "doc", relevance: "Medium", caseNumber: "BA22P1104EA" },
  { id: 8, exhibitNumber: "AE-08", title: "Photograph — Property Condition", documentType: "Photograph", date: "2022-07-12", description: "Photos showing deteriorated condition of estate property", category: "Photographs", tags: ["property", "condition", "deterioration"], fileType: "image", relevance: "Medium", caseNumber: "BA22P1104EA" },
  { id: 9, exhibitNumber: "AE-09", title: "Medical Records — Kenneth Sr.", documentType: "Medical Record", date: "2020-11-30", description: "Medical records establishing decedent's capacity at time of trust amendment", category: "Medical Records", tags: ["medical", "capacity", "decedent"], fileType: "pdf", relevance: "Medium", caseNumber: "BA22P1104EA" },
  { id: 10, exhibitNumber: "AE-10", title: "Shell Corp Registration — 2021", documentType: "Business Record", date: "2021-03-01", description: "Registration documents for LLC used to hold estate assets", category: "Financial Records", tags: ["LLC", "shell corp", "asset hiding"], fileType: "pdf", relevance: "High", caseNumber: "BA22P1104EA" },
  { id: 11, exhibitNumber: "AE-11", title: "Trust Amendment — 2019", documentType: "Trust Document", date: "2019-09-15", description: "Disputed trust amendment allegedly executed when decedent lacked capacity", category: "Court Orders", tags: ["amendment", "capacity", "dispute"], fileType: "pdf", relevance: "High", caseNumber: "BA22P1104EA" },
  { id: 12, exhibitNumber: "AE-12", title: "Certified Mail Receipt — Demand Letter", documentType: "Communication", date: "2022-02-14", description: "Certified mail receipt confirming PR received demand letter", category: "Communications", tags: ["certified mail", "demand", "notice"], fileType: "image", relevance: "Medium", caseNumber: "BA22P1104EA" },
];

const CATEGORIES = [
  "All Categories",
  "Financial Records",
  "Communications",
  "Court Orders",
  "Photographs",
  "Witness Statements",
  "Medical Records",
  "Property Records",
];

const CONTRADICTIONS = [
  { exhibit1: "AE-05", exhibit2: "AE-10", description: "Bank statement shows cash withdrawal on 3/15/22, but LLC ledger shows same funds deposited 3/16/22 — suggests asset transfer", severity: "high" },
  { exhibit1: "AE-09", exhibit2: "AE-11", description: "Medical records from 11/2020 show cognitive decline, but trust amendment is dated 9/2019 — timeline inconsistency", severity: "medium" },
  { exhibit1: "AE-06", exhibit2: "AE-05", description: "Appraisal values property at $620K but bank records show sale proceeds of only $480K — potential undervaluation fraud", severity: "high" },
];

const fileTypeIcon = (ft: EvidenceItem["fileType"]) => {
  if (ft === "image") return <Image className="h-5 w-5 text-purple-500" />;
  if (ft === "pdf") return <FileText className="h-5 w-5 text-red-500" />;
  if (ft === "doc") return <FileText className="h-5 w-5 text-blue-500" />;
  return <File className="h-5 w-5 text-gray-500" />;
};

const relevanceColor = (r: EvidenceItem["relevance"]) => {
  if (r === "High") return "bg-red-100 text-red-700";
  if (r === "Medium") return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-600";
};

export default function EvidenceManager() {
  const { toast } = useToast();
  const [evidence, setEvidence] = useState<EvidenceItem[]>(INITIAL_EVIDENCE);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedRelevance, setSelectedRelevance] = useState("All");
  const [showUpload, setShowUpload] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const filtered = evidence.filter((e) => {
    const matchesSearch =
      !searchQuery ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.exhibitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All Categories" || e.category === selectedCategory;
    const matchesRelevance = selectedRelevance === "All" || e.relevance === selectedRelevance;
    return matchesSearch && matchesCategory && matchesRelevance;
  });

  const handleGenerateExhibitList = () => {
    const list = evidence
      .sort((a, b) => a.exhibitNumber.localeCompare(b.exhibitNumber))
      .map((e) => `${e.exhibitNumber}  ${e.title}  (${e.date})  ${e.category}`)
      .join("\n");
    toast({
      title: "Exhibit List Generated",
      description: `Generated exhibit list with ${evidence.length} items. Download ready.`,
    });
  };

  const handleUpload = () => {
    setShowUpload(false);
    const newItem: EvidenceItem = {
      id: evidence.length + 1,
      exhibitNumber: `AE-${String(evidence.length + 1).padStart(2, "0")}`,
      title: "Newly Uploaded Document",
      documentType: "Document",
      date: new Date().toISOString().split("T")[0],
      description: "Document uploaded via evidence manager",
      category: "Financial Records",
      tags: ["new", "uploaded"],
      fileType: "pdf",
      relevance: "Medium",
      caseNumber: "BA22P1104EA",
    };
    setEvidence((prev) => [...prev, newItem]);
    toast({ title: "Document Uploaded", description: `Assigned exhibit number ${newItem.exhibitNumber}` });
  };

  const handleRemoveEvidence = (id: number) => {
    setEvidence((prev) => prev.filter((e) => e.id !== id));
    toast({ title: "Evidence Removed", description: "Item removed from evidence manager" });
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center">
              <FolderOpen className="mr-3 h-8 w-8 text-orange-600" />
              Evidence Manager
            </h1>
            <p className="text-gray-600">Organize, tag, and manage all case evidence and exhibits.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGenerateExhibitList}>
              <Download className="mr-2 h-4 w-4" />
              Generate Exhibit List
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => setShowUpload(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Upload Evidence
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-0 space-y-6">
        {/* Contradiction Detection Alert */}
        {CONTRADICTIONS.length > 0 && (
          <Card className="border-amber-300 bg-amber-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-amber-800 text-base">
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-600" />
                Contradiction Detection — {CONTRADICTIONS.length} Issues Found
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {CONTRADICTIONS.map((c, i) => (
                <div key={i} className={`flex items-start p-3 rounded-lg ${c.severity === "high" ? "bg-red-50 border border-red-200" : "bg-yellow-50 border border-yellow-200"}`}>
                  <AlertTriangle className={`h-4 w-4 mr-2 mt-0.5 flex-shrink-0 ${c.severity === "high" ? "text-red-500" : "text-yellow-500"}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">{c.exhibit1}</Badge>
                      <span className="text-xs text-gray-500">vs</span>
                      <Badge variant="outline" className="text-xs">{c.exhibit2}</Badge>
                      <Badge className={`text-xs ${c.severity === "high" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {c.severity === "high" ? "High Priority" : "Medium Priority"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{c.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Upload Zone */}
        {showUpload && (
          <Card className="border-2 border-dashed border-orange-300">
            <CardContent className="p-6">
              <div
                className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${dragOver ? "border-orange-500 bg-orange-50" : "border-gray-300"}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(); }}
              >
                <Upload className="h-12 w-12 text-orange-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-700 mb-1">Drop files here or click to browse</h3>
                <p className="text-sm text-gray-500 mb-4">Supports PDF, DOCX, JPG, PNG, TXT (max 50MB)</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={handleUpload} className="bg-orange-600 hover:bg-orange-700 text-white">
                    Select Files
                  </Button>
                  <Button variant="outline" onClick={() => setShowUpload(false)}>Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Tag className="mr-2 h-4 w-4" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 p-3">
                {CATEGORIES.map((cat) => {
                  const count = cat === "All Categories" ? evidence.length : evidence.filter((e) => e.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${selectedCategory === cat ? "bg-orange-100 text-orange-700 font-medium" : "hover:bg-gray-100 text-gray-600"}`}
                    >
                      <span>{cat}</span>
                      <Badge variant="secondary" className="text-xs">{count}</Badge>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search evidence, tags, exhibit numbers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedRelevance} onValueChange={setSelectedRelevance}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Relevance</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold text-red-700">{evidence.filter((e) => e.relevance === "High").length}</p>
                  <p className="text-xs text-red-600">High Relevance</p>
                </CardContent>
              </Card>
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-700">{evidence.filter((e) => e.relevance === "Medium").length}</p>
                  <p className="text-xs text-yellow-600">Medium Relevance</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold text-blue-700">{filtered.length}</p>
                  <p className="text-xs text-blue-600">Items Shown</p>
                </CardContent>
              </Card>
            </div>

            {/* Evidence Cards */}
            {filtered.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No evidence found matching your filters</p>
                </CardContent>
              </Card>
            ) : (
              filtered.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-1 min-w-[60px]">
                        {fileTypeIcon(item.fileType)}
                        <Badge className="text-xs font-mono bg-gray-100 text-gray-700">{item.exhibitNumber}</Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{item.title}</h3>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Badge className={`text-xs ${relevanceColor(item.relevance)}`}>{item.relevance}</Badge>
                            <button
                              onClick={() => handleRemoveEvidence(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                          <span>{item.documentType}</span>
                          <span>·</span>
                          <span>{item.date}</span>
                          <span>·</span>
                          <span>{item.category}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs py-0">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
