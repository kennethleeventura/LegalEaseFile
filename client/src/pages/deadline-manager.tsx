import { useState } from "react";
import { ArrowLeft, Calendar, Clock, Plus, CheckCircle, AlertTriangle, Bell, List, LayoutGrid, Gavel, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

type DeadlineType = "filing" | "hearing" | "response" | "discovery" | "compliance" | "appeal";
type UrgencyLevel = "critical" | "urgent" | "upcoming" | "future";

interface Deadline {
  id: number;
  title: string;
  date: string;
  court: string;
  caseNumber: string;
  type: DeadlineType;
  description: string;
  reminderSet: boolean;
}

interface ComplianceItem {
  id: number;
  order: string;
  court: string;
  caseNumber: string;
  orderDate: string;
  dueDate: string;
  status: "complied" | "pending" | "overdue";
  description: string;
}

const today = new Date();
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r.toISOString().split("T")[0];
};

const INITIAL_DEADLINES: Deadline[] = [
  { id: 1, title: "File Opposition to Motion to Dismiss", date: addDays(today, 2), court: "U.S. District Court — D. Mass.", caseNumber: "1:24-cv-12345", type: "filing", description: "Must file 20-page opposition with exhibits by end of business day", reminderSet: true },
  { id: 2, title: "Hearing — Emergency Motion TRO", date: addDays(today, 1), court: "Barnstable Probate Court", caseNumber: "BA22P1104EA", type: "hearing", description: "Emergency TRO hearing. Appear in person. Courtroom 3.", reminderSet: true },
  { id: 3, title: "Response to Interrogatories Due", date: addDays(today, 5), court: "Barnstable Probate Court", caseNumber: "BA22P1104EA", type: "response", description: "Must respond to PR's interrogatories with sworn answers", reminderSet: false },
  { id: 4, title: "Discovery Cutoff", date: addDays(today, 18), court: "U.S. District Court — D. Mass.", caseNumber: "1:24-cv-12345", type: "discovery", description: "All discovery must be completed by this date", reminderSet: false },
  { id: 5, title: "Motion for Summary Judgment Deadline", date: addDays(today, 25), court: "Barnstable Probate Court", caseNumber: "BA22P1104EA", type: "filing", description: "Last day to file motion for summary judgment on liability issues", reminderSet: false },
  { id: 6, title: "Pre-Trial Conference", date: addDays(today, 45), court: "U.S. District Court — D. Mass.", caseNumber: "1:24-cv-12345", type: "hearing", description: "Joint pre-trial conference with all parties and court", reminderSet: false },
  { id: 7, title: "Notice of Appeal Deadline", date: addDays(today, 60), court: "Massachusetts Appeals Court", caseNumber: "BA22P1104EA", type: "appeal", description: "Last day to file notice of appeal from April 30 order", reminderSet: false },
  { id: 8, title: "Annual Accounting Due to Court", date: addDays(today, 90), court: "Barnstable Probate Court", caseNumber: "BA22P1104EA", type: "compliance", description: "PR annual accounting must be filed with supporting documentation", reminderSet: false },
];

const COMPLIANCE_ITEMS: ComplianceItem[] = [
  { id: 1, order: "Order for Estate Accounting", court: "Barnstable Probate", caseNumber: "BA22P1104EA", orderDate: "2022-03-15", dueDate: "2022-04-14", status: "overdue", description: "PR required to file complete accounting within 30 days — never complied" },
  { id: 2, order: "Order for Distribution", court: "Barnstable Probate", caseNumber: "BA22P1104EA", orderDate: "2023-01-10", dueDate: "2023-02-10", status: "overdue", description: "PR ordered to distribute $125,000 to beneficiaries — never distributed" },
  { id: 3, order: "Discovery Order — Documents", court: "U.S. District Court", caseNumber: "1:24-cv-12345", orderDate: "2024-09-01", dueDate: "2024-10-01", status: "complied", description: "Petitioner complied — produced all requested documents" },
  { id: 4, order: "Order for Property Appraisal", court: "Barnstable Probate", caseNumber: "BA22P1104EA", orderDate: "2023-06-20", dueDate: "2023-08-20", status: "pending", description: "Independent appraisal of all estate assets ordered — partially completed" },
  { id: 5, order: "Emergency TRO — Asset Freeze", court: "Barnstable Probate", caseNumber: "BA22P1104EA", orderDate: "2024-11-15", dueDate: "2024-11-15", status: "pending", description: "Order freezing estate assets pending hearing — compliance unknown" },
];

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getUrgency(dateStr: string): UrgencyLevel {
  const days = getDaysUntil(dateStr);
  if (days <= 3) return "critical";
  if (days <= 7) return "urgent";
  if (days <= 28) return "upcoming";
  return "future";
}

const URGENCY_STYLES: Record<UrgencyLevel, { card: string; badge: string; label: string }> = {
  critical: { card: "border-red-300 bg-red-50", badge: "bg-red-600 text-white", label: "CRITICAL" },
  urgent: { card: "border-orange-300 bg-orange-50", badge: "bg-orange-500 text-white", label: "URGENT" },
  upcoming: { card: "border-yellow-300 bg-yellow-50", badge: "bg-yellow-500 text-white", label: "UPCOMING" },
  future: { card: "border-green-300 bg-green-50", badge: "bg-green-600 text-white", label: "FUTURE" },
};

const TYPE_CONFIG: Record<DeadlineType, { label: string; badgeClass: string }> = {
  filing: { label: "Filing", badgeClass: "bg-blue-100 text-blue-700" },
  hearing: { label: "Hearing", badgeClass: "bg-purple-100 text-purple-700" },
  response: { label: "Response", badgeClass: "bg-yellow-100 text-yellow-700" },
  discovery: { label: "Discovery", badgeClass: "bg-teal-100 text-teal-700" },
  compliance: { label: "Compliance", badgeClass: "bg-orange-100 text-orange-700" },
  appeal: { label: "Appeal", badgeClass: "bg-red-100 text-red-700" },
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DeadlineManager() {
  const { toast } = useToast();
  const [deadlines, setDeadlines] = useState<Deadline[]>(INITIAL_DEADLINES);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDeadline, setNewDeadline] = useState<Partial<Deadline>>({
    title: "", date: "", court: "", caseNumber: "", type: "filing", description: "", reminderSet: false,
  });
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

  const sorted = [...deadlines].sort((a, b) => a.date.localeCompare(b.date));

  const critical = sorted.filter((d) => getUrgency(d.date) === "critical").length;
  const urgent = sorted.filter((d) => getUrgency(d.date) === "urgent").length;

  const setReminderField = (k: keyof Deadline, v: string | boolean) =>
    setNewDeadline((p) => ({ ...p, [k]: v }));

  const handleAdd = () => {
    if (!newDeadline.title || !newDeadline.date) {
      toast({ title: "Missing Fields", description: "Title and date are required.", variant: "destructive" });
      return;
    }
    const d: Deadline = {
      id: Date.now(),
      title: newDeadline.title!,
      date: newDeadline.date!,
      court: newDeadline.court || "",
      caseNumber: newDeadline.caseNumber || "",
      type: (newDeadline.type as DeadlineType) || "filing",
      description: newDeadline.description || "",
      reminderSet: false,
    };
    setDeadlines((prev) => [...prev, d]);
    setNewDeadline({ title: "", date: "", court: "", caseNumber: "", type: "filing", description: "" });
    setShowAddForm(false);
    toast({ title: "Deadline Added", description: `"${d.title}" added to your calendar.` });
  };

  const handleReminder = (id: number) => {
    setDeadlines((prev) => prev.map((d) => d.id === id ? { ...d, reminderSet: true } : d));
    toast({ title: "Reminder Set", description: "You will receive notifications before this deadline." });
  };

  const handleRemove = (id: number) => {
    setDeadlines((prev) => prev.filter((d) => d.id !== id));
  };

  // Calendar data
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const deadlinesByDate: Record<string, Deadline[]> = {};
  deadlines.forEach((d) => {
    if (!deadlinesByDate[d.date]) deadlinesByDate[d.date] = [];
    deadlinesByDate[d.date].push(d);
  });

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
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
              <Calendar className="mr-3 h-8 w-8 text-blue-600" />
              Deadline Manager
            </h1>
            <p className="text-gray-600">Track all court deadlines, hearings, and compliance requirements.</p>
          </div>
          <div className="flex gap-2">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 text-sm flex items-center gap-1 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                <List className="h-4 w-4" /> List
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-3 py-2 text-sm flex items-center gap-1 ${viewMode === "calendar" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                <LayoutGrid className="h-4 w-4" /> Calendar
              </button>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Deadline
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-0 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-red-700">{critical}</p>
              <p className="text-xs text-red-600">Critical (&lt;3 days)</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-orange-700">{urgent}</p>
              <p className="text-xs text-orange-600">Urgent (3-7 days)</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-blue-700">{deadlines.length}</p>
              <p className="text-xs text-blue-600">Total Deadlines</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-red-700">{COMPLIANCE_ITEMS.filter((c) => c.status === "overdue").length}</p>
              <p className="text-xs text-red-600">Overdue Orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Deadline Form */}
        {showAddForm && (
          <Card className="border-blue-300">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Plus className="mr-2 h-4 w-4 text-blue-600" />
                Add New Deadline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title *</Label>
                  <Input placeholder="Deadline description" value={newDeadline.title} onChange={(e) => setReminderField("title", e.target.value)} />
                </div>
                <div>
                  <Label>Due Date *</Label>
                  <Input type="date" value={newDeadline.date} onChange={(e) => setReminderField("date", e.target.value)} />
                </div>
                <div>
                  <Label>Court</Label>
                  <Input placeholder="Court name" value={newDeadline.court} onChange={(e) => setReminderField("court", e.target.value)} />
                </div>
                <div>
                  <Label>Case Number</Label>
                  <Input placeholder="Case number" value={newDeadline.caseNumber} onChange={(e) => setReminderField("caseNumber", e.target.value)} />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={newDeadline.type as string} onValueChange={(v) => setReminderField("type", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(TYPE_CONFIG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Description</Label>
                  <Input placeholder="Additional notes" value={newDeadline.description} onChange={(e) => setReminderField("description", e.target.value)} />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">Add Deadline</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {viewMode === "list" ? (
          <div className="space-y-3">
            {sorted.map((deadline) => {
              const urgency = getUrgency(deadline.date);
              const styles = URGENCY_STYLES[urgency];
              const daysUntil = getDaysUntil(deadline.date);
              const typeConfig = TYPE_CONFIG[deadline.type];
              return (
                <Card key={deadline.id} className={`border ${styles.card} transition-shadow hover:shadow-md`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1 min-w-[60px] text-center">
                          <Badge className={`text-xs ${styles.badge}`}>{styles.label}</Badge>
                          <span className="text-lg font-bold text-gray-800">{Math.abs(daysUntil)}</span>
                          <span className="text-xs text-gray-500">{daysUntil < 0 ? "days ago" : daysUntil === 0 ? "TODAY" : "days"}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{deadline.title}</h3>
                            <Badge className={`text-xs ${typeConfig.badgeClass}`}>{typeConfig.label}</Badge>
                            {deadline.reminderSet && <Badge className="text-xs bg-blue-100 text-blue-700"><Bell className="h-3 w-3 mr-1" />Reminder Set</Badge>}
                          </div>
                          <p className="text-sm text-gray-500 mb-1">
                            {deadline.court} · {deadline.caseNumber}
                          </p>
                          <p className="text-sm text-gray-600">{deadline.description}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {new Date(deadline.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        {!deadline.reminderSet && (
                          <Button size="sm" variant="outline" onClick={() => handleReminder(deadline.id)} className="text-xs">
                            <Bell className="h-3 w-3 mr-1" />
                            Remind
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => handleRemove(deadline.id)} className="text-xs text-gray-400 hover:text-red-500">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Calendar View */
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={prevMonth}>&lt;</Button>
                <h3 className="font-semibold text-gray-900">{MONTHS[calMonth]} {calYear}</h3>
                <Button variant="ghost" onClick={nextMonth}>&gt;</Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                {DAYS.map((d) => (
                  <div key={d} className="bg-gray-50 text-center py-2 text-xs font-semibold text-gray-500">{d}</div>
                ))}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-white h-24" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const dayDeadlines = deadlinesByDate[dateStr] || [];
                  const isToday = dateStr === today.toISOString().split("T")[0];
                  return (
                    <div key={day} className={`bg-white h-24 p-1 ${isToday ? "bg-blue-50 ring-2 ring-blue-400 ring-inset" : ""}`}>
                      <span className={`text-xs font-medium ${isToday ? "text-blue-600" : "text-gray-700"}`}>{day}</span>
                      <div className="space-y-0.5 mt-0.5 overflow-hidden">
                        {dayDeadlines.slice(0, 2).map((d) => {
                          const urg = getUrgency(d.date);
                          return (
                            <div key={d.id} className={`text-xs px-1 py-0.5 rounded truncate ${urg === "critical" ? "bg-red-100 text-red-700" : urg === "urgent" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`} title={d.title}>
                              {d.title}
                            </div>
                          );
                        })}
                        {dayDeadlines.length > 2 && <div className="text-xs text-gray-400">+{dayDeadlines.length - 2} more</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Compliance Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gavel className="mr-2 h-5 w-5 text-gray-600" />
              Court Order Compliance Tracker
            </CardTitle>
            <CardDescription>Track compliance with outstanding court orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {COMPLIANCE_ITEMS.map((item) => (
                <div key={item.id} className={`flex items-start p-3 rounded-lg border ${item.status === "overdue" ? "bg-red-50 border-red-200" : item.status === "pending" ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"}`}>
                  <div className="flex-shrink-0 mt-0.5">
                    {item.status === "complied" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : item.status === "overdue" ? (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">{item.order}</span>
                      <Badge className={`text-xs ${item.status === "overdue" ? "bg-red-100 text-red-700" : item.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{item.caseNumber}</Badge>
                    </div>
                    <p className="text-xs text-gray-600">{item.description}</p>
                    <div className="flex gap-3 text-xs text-gray-400 mt-1">
                      <span>Ordered: {item.orderDate}</span>
                      <span>Due: {item.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
