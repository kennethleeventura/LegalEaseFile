import { useState } from "react";
import { ArrowLeft, Scale, DollarSign, Users, FileText, AlertTriangle, CheckCircle, Clock, Building, Download, Plus, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

const ESTATE_INFO = {
  decedent: "Kenneth L. Ventura Sr.",
  dob: "1942-06-18",
  dod: "2021-09-14",
  estateValue: 1_285_000,
  openDate: "2021-11-01",
  caseNumber: "BA22P1104EA",
  court: "Barnstable Probate and Family Court",
  pr: "Sarah Long",
  prAppointed: "2021-11-15",
  status: "Open — Active Dispute",
  trustees: ["Sarah Long (PR/Trustee)", "Kenneth L. Ventura Jr. (Beneficiary/Petitioner)"],
};

const BENEFICIARIES = [
  { id: 1, name: "Kenneth L. Ventura Jr.", relationship: "Son", entitlement: "50%", entitlementValue: 642_500, distributed: 0, balance: 642_500, status: "Not Distributed" },
  { id: 2, name: "Linda M. Ventura", relationship: "Sister", entitlement: "25%", entitlementValue: 321_250, distributed: 0, balance: 321_250, status: "Not Distributed" },
  { id: 3, name: "Robert J. Ventura", relationship: "Son", entitlement: "25%", entitlementValue: 321_250, distributed: 5_000, balance: 316_250, status: "Partial" },
];

const ASSETS = [
  { id: 1, description: "44 Camp Street, Hyannis MA 02601", type: "Real Property", value: 620_000, status: "Disputed — Alleged sale below market value", exhibitRef: "AE-02" },
  { id: 2, description: "First Citizens Bank — Estate Checking", type: "Bank Account", value: 127_500, status: "Withdrawn — Unaccounted", exhibitRef: "AE-05" },
  { id: 3, description: "Ventura Family LLC (100% interest)", type: "Business Interest", value: 285_000, status: "Not Inventoried — Shell Corp", exhibitRef: "AE-10" },
  { id: 4, description: "Personal Property — Furnishings, Jewelry, Vehicles", type: "Personal Property", value: 45_000, status: "Not Inventoried", exhibitRef: "" },
  { id: 5, description: "Life Insurance Policy — MetLife #ML-2892", type: "Insurance", value: 150_000, status: "Pending Claim", exhibitRef: "" },
  { id: 6, description: "Savings Account — Citizens Bank", type: "Bank Account", value: 57_500, status: "Unaccounted — Not Disclosed", exhibitRef: "AE-05" },
];

const FIDUCIARY_LOG = [
  { id: 1, date: "2021-11-15", action: "PR Appointed by Court", party: "Court", status: "Completed", description: "Sarah Long appointed as Personal Representative by Barnstable Probate Court" },
  { id: 2, date: "2021-12-01", action: "Estate Bank Account Opened", party: "Sarah Long (PR)", status: "Completed", description: "PR opened estate bank account with First Citizens Bank" },
  { id: 3, date: "2021-12-31", action: "Unauthorized Withdrawals", party: "Sarah Long (PR)", status: "Violation", description: "Bank records show $47,500 withdrawn with no estate purpose — not reported to court" },
  { id: 4, date: "2022-01-10", action: "Property Appraised at $620,000", party: "Independent Appraiser", status: "Completed", description: "44 Camp Street valued at $620,000 by licensed appraiser" },
  { id: 5, date: "2022-02-14", action: "Demand Letter from Beneficiary", party: "Kenneth L. Ventura Jr.", status: "Completed", description: "Certified demand letter sent requesting accounting and distribution" },
  { id: 6, date: "2022-03-15", action: "Court Order — Accounting Required", party: "Court", status: "Violated", description: "Barnstable Probate ordered PR to file accounting within 30 days — never complied" },
  { id: 7, date: "2022-04-28", action: "PR Email — Acknowledges but Ignores", party: "Sarah Long (PR)", status: "Violation", description: "PR sends email acknowledging demands but takes no action" },
  { id: 8, date: "2022-04-30", action: "Accounting Deadline Passed — Non-Compliance", party: "Sarah Long (PR)", status: "Violated", description: "PR willfully failed to file accounting in violation of court order" },
  { id: 9, date: "2023-01-10", action: "Distribution Order Entered", party: "Court", status: "Violated", description: "Court ordered distribution of $125,000 to beneficiaries — PR never complied" },
  { id: 10, date: "2023-03-01", action: "Property Allegedly Sold Below Market", party: "Sarah Long (PR)", status: "Violation", description: "44 Camp Street reportedly sold for $480,000 — $140,000 below appraisal value" },
];

const NON_COMPLIANCE = [
  { item: "Estate Accounting (March 2022 Order)", dueDate: "2022-04-14", daysPast: 815, severity: "critical" },
  { item: "Beneficiary Distribution ($125,000)", dueDate: "2023-02-10", daysPast: 512, severity: "critical" },
  { item: "Annual Inventory Filing", dueDate: "2022-11-01", daysPast: 614, severity: "high" },
  { item: "Disclosure of Shell LLC Formation", dueDate: "Immediate", daysPast: 800, severity: "critical" },
  { item: "Property Sale Accounting", dueDate: "Ongoing", daysPast: 0, severity: "high" },
];

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });
}

export default function ProbateModule() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const totalDistributed = BENEFICIARIES.reduce((s, b) => s + b.distributed, 0);
  const totalBalance = BENEFICIARIES.reduce((s, b) => s + b.balance, 0);
  const totalAssets = ASSETS.reduce((s, a) => s + a.value, 0);

  const handleGenerate = (type: string) => {
    toast({ title: `Generating ${type}`, description: `Your ${type.toLowerCase()} is being prepared for download.` });
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
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center">
              <Scale className="mr-3 h-8 w-8 text-indigo-700" />
              Probate Case Module
            </h1>
            <p className="text-gray-600">Estate management, beneficiary tracking, and fiduciary compliance monitoring.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => handleGenerate("Inventory")}>
              <Download className="mr-2 h-4 w-4" />
              Generate Inventory
            </Button>
            <Button variant="outline" onClick={() => handleGenerate("Distribution Summary")}>
              <Download className="mr-2 h-4 w-4" />
              Distribution Summary
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-0 space-y-6">
        {/* Non-Compliance Alert Banner */}
        {NON_COMPLIANCE.filter((n) => n.severity === "critical").length > 0 && (
          <Card className="border-red-300 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-800 mb-1">
                    {NON_COMPLIANCE.filter((n) => n.severity === "critical").length} Critical Non-Compliance Issues
                  </h3>
                  <p className="text-sm text-red-700">
                    The Personal Representative has failed to comply with multiple court orders. Contempt motion may be appropriate.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 sm:grid-cols-5 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          {/* Estate Overview */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <Scale className="mr-2 h-4 w-4 text-indigo-600" />
                    Estate Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "Decedent", value: ESTATE_INFO.decedent },
                    { label: "Date of Death", value: "September 14, 2021" },
                    { label: "Case Number", value: ESTATE_INFO.caseNumber },
                    { label: "Court", value: ESTATE_INFO.court },
                    { label: "Personal Representative", value: ESTATE_INFO.pr },
                    { label: "Case Opened", value: "November 1, 2021" },
                    { label: "Status", value: ESTATE_INFO.status },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-500">{row.label}</span>
                      <span className={`text-sm font-medium text-right max-w-xs ${row.label === "Status" ? "text-red-700" : "text-gray-900"}`}>{row.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-indigo-50 border-indigo-200">
                    <CardContent className="p-4 text-center">
                      <p className="text-xs text-indigo-600 font-medium mb-1">Total Estate Value</p>
                      <p className="text-xl font-bold text-indigo-800">{fmt(totalAssets)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-4 text-center">
                      <p className="text-xs text-red-600 font-medium mb-1">Undistributed</p>
                      <p className="text-xl font-bold text-red-800">{fmt(totalBalance)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4 text-center">
                      <p className="text-xs text-green-600 font-medium mb-1">Distributed to Date</p>
                      <p className="text-xl font-bold text-green-800">{fmt(totalDistributed)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="p-4 text-center">
                      <p className="text-xs text-orange-600 font-medium mb-1">Compliance Violations</p>
                      <p className="text-xl font-bold text-orange-800">{NON_COMPLIANCE.length}</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Beneficiaries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {BENEFICIARIES.map((b) => (
                      <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{b.name}</p>
                          <p className="text-xs text-gray-500">{b.relationship} · {b.entitlement}</p>
                        </div>
                        <Badge className={b.status === "Not Distributed" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}>
                          {b.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Asset Inventory */}
          <TabsContent value="assets">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5 text-indigo-600" />
                  Estate Asset Inventory
                </CardTitle>
                <CardDescription>All known estate assets and their current status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 pr-4 text-sm font-medium text-gray-500">Asset</th>
                        <th className="text-left py-2 pr-4 text-sm font-medium text-gray-500">Type</th>
                        <th className="text-right py-2 pr-4 text-sm font-medium text-gray-500">Value</th>
                        <th className="text-left py-2 pr-4 text-sm font-medium text-gray-500">Status</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-500">Exhibit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ASSETS.map((asset) => (
                        <tr key={asset.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 pr-4">
                            <p className="text-sm font-medium text-gray-900">{asset.description}</p>
                          </td>
                          <td className="py-3 pr-4">
                            <Badge variant="secondary" className="text-xs">{asset.type}</Badge>
                          </td>
                          <td className="py-3 pr-4 text-right">
                            <span className="text-sm font-semibold text-gray-900">{fmt(asset.value)}</span>
                          </td>
                          <td className="py-3 pr-4">
                            <span className={`text-xs font-medium ${asset.status.includes("Disputed") || asset.status.includes("Unaccounted") || asset.status.includes("Not") ? "text-red-600" : "text-green-600"}`}>
                              {asset.status}
                            </span>
                          </td>
                          <td className="py-3">
                            {asset.exhibitRef ? (
                              <Badge variant="outline" className="text-xs font-mono">{asset.exhibitRef}</Badge>
                            ) : (
                              <span className="text-xs text-gray-300">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-200">
                        <td colSpan={2} className="py-3 font-semibold text-gray-700">Total Estate Value</td>
                        <td className="py-3 text-right font-bold text-gray-900">{fmt(totalAssets)}</td>
                        <td colSpan={2} />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Distribution Tracker */}
          <TabsContent value="distribution">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                  Beneficiary Distribution Tracker
                </CardTitle>
                <CardDescription>Entitlements, amounts distributed, and outstanding balances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {BENEFICIARIES.map((b) => {
                    const pct = (b.distributed / b.entitlementValue) * 100;
                    return (
                      <div key={b.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{b.name}</h3>
                            <p className="text-sm text-gray-500">{b.relationship} · {b.entitlement} share</p>
                          </div>
                          <Badge className={b.status === "Not Distributed" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}>
                            {b.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Entitled</p>
                            <p className="text-base font-bold text-gray-900">{fmt(b.entitlementValue)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Distributed</p>
                            <p className="text-base font-bold text-green-700">{fmt(b.distributed)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Balance Due</p>
                            <p className="text-base font-bold text-red-700">{fmt(b.balance)}</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.max(pct, pct > 0 ? 2 : 0)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{pct.toFixed(1)}% distributed</p>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-800">Total Outstanding Distributions: {fmt(totalBalance)}</p>
                      <p className="text-sm text-red-700 mt-1">The PR has failed to distribute {fmt(totalBalance)} owed to beneficiaries despite multiple court orders requiring distribution.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fiduciary Activity Log */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-blue-600" />
                  Fiduciary Activity Log
                </CardTitle>
                <CardDescription>Chronological record of all PR actions and court proceedings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {FIDUCIARY_LOG.map((entry) => (
                    <div key={entry.id} className={`flex items-start p-3 rounded-lg border ${entry.status === "Violation" || entry.status === "Violated" ? "bg-red-50 border-red-200" : entry.status === "Completed" ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}`}>
                      {entry.status === "Violation" || entry.status === "Violated" ? (
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                      ) : entry.status === "Completed" ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Clock className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs text-gray-500 font-mono">{entry.date}</span>
                          <span className="font-medium text-sm text-gray-900">{entry.action}</span>
                          <Badge className={`text-xs ${entry.status === "Violation" || entry.status === "Violated" ? "bg-red-100 text-red-700" : entry.status === "Completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                            {entry.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{entry.description}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Party: {entry.party}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tracker */}
          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gavel className="mr-2 h-5 w-5 text-orange-600" />
                  Non-Compliance Tracker
                </CardTitle>
                <CardDescription>Track all outstanding compliance obligations and violations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {NON_COMPLIANCE.map((item, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${item.severity === "critical" ? "bg-red-50 border-red-300" : "bg-orange-50 border-orange-200"}`}>
                      <div className="flex items-start gap-3">
                        <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${item.severity === "critical" ? "text-red-600" : "text-orange-500"}`} />
                        <div>
                          <p className="font-medium text-sm text-gray-900">{item.item}</p>
                          <p className="text-xs text-gray-500">Due: {item.dueDate} {item.daysPast > 0 ? `· ${item.daysPast} days overdue` : ""}</p>
                        </div>
                      </div>
                      <Badge className={item.severity === "critical" ? "bg-red-600 text-white" : "bg-orange-500 text-white"}>
                        {item.severity === "critical" ? "CRITICAL" : "HIGH"}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h3 className="font-semibold text-indigo-800 mb-2">Recommended Actions</h3>
                  <ul className="space-y-1 text-sm text-indigo-700">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />File Motion for Contempt for failure to provide accounting</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />Request emergency hearing to freeze estate assets</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />File Petition to Remove PR for breach of fiduciary duty</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />Subpoena bank records and LLC documents</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />File Petition for Surcharge against PR personally</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
