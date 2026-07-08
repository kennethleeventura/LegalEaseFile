import { useState } from "react";
import { ArrowLeft, Clock, Plus, Download, Wand2, Filter, Calendar, FileText, AlertTriangle, MessageSquare, Stethoscope, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

type EventType = "court-order" | "filing" | "violation" | "communication" | "medical" | "financial" | "other";

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  exhibitRef: string;
  eventType: EventType;
  party: string;
}

const EVENT_TYPE_CONFIG: Record<EventType, { label: string; color: string; badgeClass: string; icon: React.ReactNode }> = {
  "court-order": { label: "Court Order", color: "border-l-blue-500", badgeClass: "bg-blue-100 text-blue-800", icon: <Gavel className="h-4 w-4" /> },
  "filing": { label: "Filing", color: "border-l-green-500", badgeClass: "bg-green-100 text-green-800", icon: <FileText className="h-4 w-4" /> },
  "violation": { label: "Violation", color: "border-l-red-500", badgeClass: "bg-red-100 text-red-800", icon: <AlertTriangle className="h-4 w-4" /> },
  "communication": { label: "Communication", color: "border-l-purple-500", badgeClass: "bg-purple-100 text-purple-800", icon: <MessageSquare className="h-4 w-4" /> },
  "medical": { label: "Medical", color: "border-l-pink-500", badgeClass: "bg-pink-100 text-pink-800", icon: <Stethoscope className="h-4 w-4" /> },
  "financial": { label: "Financial", color: "border-l-yellow-500", badgeClass: "bg-yellow-100 text-yellow-800", icon: <FileText className="h-4 w-4" /> },
  "other": { label: "Other", color: "border-l-gray-400", badgeClass: "bg-gray-100 text-gray-700", icon: <Clock className="h-4 w-4" /> },
};

const SAMPLE_EVENTS: TimelineEvent[] = [
  { id: 1, date: "2003-04-15", title: "Trust Agreement Executed", description: "Kenneth Ventura Sr. executed the original trust agreement establishing the family trust. Trustee named as Sarah Long.", eventType: "court-order", exhibitRef: "AE-01", party: "Kenneth Ventura Sr." },
  { id: 2, date: "2019-09-15", title: "Disputed Trust Amendment", description: "Trust amendment allegedly executed changing distribution terms. Petitioner disputes this amendment as forged or signed under undue influence when decedent lacked capacity.", eventType: "violation", exhibitRef: "AE-11", party: "Sarah Long (PR)" },
  { id: 3, date: "2020-11-30", title: "Medical Records — Cognitive Decline", description: "Medical records document significant cognitive decline in decedent. Records undermine validity of 2019 trust amendment.", eventType: "medical", exhibitRef: "AE-09", party: "Kenneth Ventura Sr." },
  { id: 4, date: "2021-03-01", title: "Shell LLC Formation", description: "Sarah Long formed an LLC allegedly to hold and conceal estate assets from beneficiaries and the court.", eventType: "financial", exhibitRef: "AE-10", party: "Sarah Long (PR)" },
  { id: 5, date: "2021-12-31", title: "Unauthorized Bank Withdrawals", description: "Estate bank statements show unauthorized withdrawals totaling $47,500 not accounted for in any estate inventory.", eventType: "violation", exhibitRef: "AE-05", party: "Sarah Long (PR)" },
  { id: 6, date: "2022-01-10", title: "Property Appraisal — $620,000", description: "Independent appraisal of 44 Camp Street valued the property at $620,000. PR later sold at significant discount.", eventType: "financial", exhibitRef: "AE-06", party: "Independent Appraiser" },
  { id: 7, date: "2022-02-14", title: "Demand Letter Sent to PR", description: "Petitioner sent certified demand letter to Sarah Long demanding accounting and proper distribution. Receipt confirmed.", eventType: "communication", exhibitRef: "AE-12", party: "Petitioner" },
  { id: 8, date: "2022-03-15", title: "Court Order — Accounting Required", description: "Barnstable Probate Court entered order requiring PR to file complete estate accounting within 30 days.", eventType: "court-order", exhibitRef: "AE-04", party: "Court" },
  { id: 9, date: "2022-04-28", title: "PR Email — Acknowledges Demand", description: "Sarah Long sends email acknowledging receipt of distribution demands but takes no action and provides no accounting.", eventType: "communication", exhibitRef: "AE-03", party: "Sarah Long (PR)" },
  { id: 10, date: "2022-04-30", title: "PR Fails to Comply with Court Order", description: "Thirty-day deadline passes with no accounting filed. PR in clear violation of March 15 court order.", eventType: "violation", exhibitRef: "AE-04", party: "Sarah Long (PR)" },
];

const ALL_TYPES: Array<{ value: string; label: string }> = [
  { value: "all", label: "All Events" },
  { value: "court-order", label: "Court Orders" },
  { value: "filing", label: "Filings" },
  { value: "violation", label: "Violations" },
  { value: "communication", label: "Communications" },
  { value: "medical", label: "Medical" },
  { value: "financial", label: "Financial" },
  { value: "other", label: "Other" },
];

export default function TimelineBuilder() {
  const { toast } = useToast();
  const [events, setEvents] = useState<TimelineEvent[]>(SAMPLE_EVENTS);
  const [filterType, setFilterType] = useState("all");
  const [filterParty, setFilterParty] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({
    date: "",
    title: "",
    description: "",
    exhibitRef: "",
    eventType: "other",
    party: "",
  });

  const filtered = events
    .filter((e) => {
      const matchesType = filterType === "all" || e.eventType === filterType;
      const matchesParty = !filterParty || e.party.toLowerCase().includes(filterParty.toLowerCase());
      const matchesFrom = !dateFrom || e.date >= dateFrom;
      const matchesTo = !dateTo || e.date <= dateTo;
      return matchesType && matchesParty && matchesFrom && matchesTo;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const handleAddEvent = () => {
    if (!newEvent.date || !newEvent.title) {
      toast({ title: "Missing Fields", description: "Date and title are required.", variant: "destructive" });
      return;
    }
    const ev: TimelineEvent = {
      id: Date.now(),
      date: newEvent.date!,
      title: newEvent.title!,
      description: newEvent.description || "",
      exhibitRef: newEvent.exhibitRef || "",
      eventType: (newEvent.eventType as EventType) || "other",
      party: newEvent.party || "",
    };
    setEvents((prev) => [...prev, ev]);
    setNewEvent({ date: "", title: "", description: "", exhibitRef: "", eventType: "other", party: "" });
    setShowAddForm(false);
    toast({ title: "Event Added", description: `"${ev.title}" added to timeline.` });
  };

  const handleRemoveEvent = (id: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleExport = () => {
    toast({ title: "Export Timeline", description: "Exporting timeline as PDF chronological report..." });
  };

  const handleAIAnalyze = () => {
    toast({ title: "AI Timeline Analysis", description: "MPC Assistant is analyzing your timeline for patterns and inconsistencies. Check the MPC Assistant for results." });
  };

  const violationCount = events.filter((e) => e.eventType === "violation").length;
  const courtOrderCount = events.filter((e) => e.eventType === "court-order").length;

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
              <Clock className="mr-3 h-8 w-8 text-teal-600" />
              Case Timeline Builder
            </h1>
            <p className="text-gray-600">Build a chronological record of all case events for court presentation.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleAIAnalyze}>
              <Wand2 className="mr-2 h-4 w-4" />
              AI Analyze
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-0 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-blue-700">{events.length}</p>
              <p className="text-xs text-blue-600">Total Events</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-red-700">{violationCount}</p>
              <p className="text-xs text-red-600">Violations</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-blue-700">{courtOrderCount}</p>
              <p className="text-xs text-blue-600">Court Orders</p>
            </CardContent>
          </Card>
          <Card className="bg-teal-50 border-teal-200">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-teal-700">{filtered.length}</p>
              <p className="text-xs text-teal-600">Showing</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Event Form */}
        {showAddForm && (
          <Card className="border-teal-300">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Plus className="mr-2 h-4 w-4 text-teal-600" />
                Add Timeline Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Date *</Label>
                  <Input type="date" value={newEvent.date} onChange={(e) => setNewEvent((p) => ({ ...p, date: e.target.value }))} />
                </div>
                <div>
                  <Label>Event Title *</Label>
                  <Input placeholder="Brief event description" value={newEvent.title} onChange={(e) => setNewEvent((p) => ({ ...p, title: e.target.value }))} />
                </div>
                <div>
                  <Label>Event Type</Label>
                  <Select value={newEvent.eventType} onValueChange={(v) => setNewEvent((p) => ({ ...p, eventType: v as EventType }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(EVENT_TYPE_CONFIG).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Party Involved</Label>
                  <Input placeholder="e.g. Petitioner, Sarah Long (PR), Court" value={newEvent.party} onChange={(e) => setNewEvent((p) => ({ ...p, party: e.target.value }))} />
                </div>
                <div>
                  <Label>Exhibit Reference</Label>
                  <Input placeholder="e.g. AE-01" value={newEvent.exhibitRef} onChange={(e) => setNewEvent((p) => ({ ...p, exhibitRef: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Textarea rows={3} placeholder="Detailed description of what happened..." value={newEvent.description} onChange={(e) => setNewEvent((p) => ({ ...p, description: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddEvent} className="bg-teal-600 hover:bg-teal-700 text-white">Add to Timeline</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Filter:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ALL_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setFilterType(t.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterType === t.value ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 ml-auto">
                <Input type="date" placeholder="From" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-36 text-xs" />
                <Input type="date" placeholder="To" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-36 text-xs" />
                <Input placeholder="Filter by party..." value={filterParty} onChange={(e) => setFilterParty(e.target.value)} className="w-40 text-xs" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-4">
            {filtered.map((event, index) => {
              const config = EVENT_TYPE_CONFIG[event.eventType];
              return (
                <div key={event.id} className="relative flex gap-6 pl-14">
                  {/* Timeline dot */}
                  <div className={`absolute left-4 w-4 h-4 rounded-full flex items-center justify-center ring-4 ring-white ${event.eventType === "violation" ? "bg-red-500" : event.eventType === "court-order" ? "bg-blue-500" : event.eventType === "communication" ? "bg-purple-500" : event.eventType === "financial" ? "bg-yellow-500" : event.eventType === "medical" ? "bg-pink-500" : "bg-gray-400"}`} style={{ top: "16px" }} />

                  <Card className={`flex-1 border-l-4 ${config.color} hover:shadow-md transition-shadow`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={`text-xs ${config.badgeClass} flex items-center gap-1`}>
                            {config.icon}
                            {config.label}
                          </Badge>
                          {event.exhibitRef && (
                            <Badge variant="outline" className="text-xs font-mono">{event.exhibitRef}</Badge>
                          )}
                          {event.party && (
                            <span className="text-xs text-gray-500 italic">{event.party}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-500 whitespace-nowrap flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            {new Date(event.date + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                          </span>
                          <button
                            onClick={() => handleRemoveEvent(event.id)}
                            className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No events match your current filters</p>
              <Button variant="outline" className="mt-3" onClick={() => { setFilterType("all"); setDateFrom(""); setDateTo(""); setFilterParty(""); }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
