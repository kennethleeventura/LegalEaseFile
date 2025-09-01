import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, addDays, isAfter, isBefore, isToday, startOfDay } from "date-fns";
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Filter,
  Bell,
  FileText,
  Gavel,
  User,
  Flag,
  Search
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";

interface Deadline {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  deadlineType: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "pending" | "completed" | "overdue" | "cancelled";
  caseId?: string;
  caseName?: string;
  caseNumber?: string;
  courtRule?: string;
  statuteReference?: string;
  reminderSettings?: {
    days: number[];
    enabled: boolean;
  };
  createdAt: string;
}

interface Case {
  id: string;
  caseNumber: string;
  caseName: string;
  court: string;
  status: string;
}

const DEADLINE_TYPES = [
  { value: "court", label: "Court Deadline", icon: Gavel },
  { value: "statute", label: "Statute of Limitations", icon: Clock },
  { value: "discovery", label: "Discovery Deadline", icon: FileText },
  { value: "internal", label: "Internal Deadline", icon: User },
  { value: "client", label: "Client Deadline", icon: User },
  { value: "appeal", label: "Appeal Deadline", icon: Flag },
];

const PRIORITY_COLORS = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200", 
  high: "bg-orange-100 text-orange-800 border-orange-200",
  critical: "bg-red-100 text-red-800 border-red-200"
};

const STATUS_COLORS = {
  pending: "bg-gray-100 text-gray-800 border-gray-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  overdue: "bg-red-100 text-red-800 border-red-200",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200"
};

export default function DeadlineManager() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const [newDeadline, setNewDeadline] = useState({
    title: "",
    description: "",
    dueDate: "",
    deadlineType: "internal",
    priority: "medium" as const,
    caseId: "",
    courtRule: "",
    statuteReference: "",
    reminderDays: [7, 3, 1] // Default reminders
  });

  // Fetch deadlines
  const { data: deadlines = [], isLoading } = useQuery({
    queryKey: ["/api/deadlines"],
    enabled: isAuthenticated,
  });

  // Fetch cases for dropdown
  const { data: cases = [] } = useQuery({
    queryKey: ["/api/cases"],
    enabled: isAuthenticated,
  });

  // Create deadline mutation
  const createDeadlineMutation = useMutation({
    mutationFn: async (deadlineData: typeof newDeadline) => {
      const response = await apiRequest("POST", "/api/deadlines", deadlineData);
      if (!response.ok) throw new Error("Failed to create deadline");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deadlines"] });
      setShowCreateDialog(false);
      setNewDeadline({
        title: "",
        description: "",
        dueDate: "",
        deadlineType: "internal",
        priority: "medium",
        caseId: "",
        courtRule: "",
        statuteReference: "",
        reminderDays: [7, 3, 1]
      });
      toast({
        title: "Success",
        description: "Deadline created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create deadline",
        variant: "destructive",
      });
    },
  });

  // Update deadline status mutation
  const updateDeadlineStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/deadlines/${id}`, { status });
      if (!response.ok) throw new Error("Failed to update deadline");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deadlines"] });
      toast({
        title: "Success",
        description: "Deadline updated successfully",
      });
    },
  });

  // Filter deadlines based on current filters
  const filteredDeadlines = deadlines.filter((deadline: Deadline) => {
    const matchesType = filterType === "all" || deadline.deadlineType === filterType;
    const matchesPriority = filterPriority === "all" || deadline.priority === filterPriority;
    const matchesSearch = searchTerm === "" || 
      deadline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deadline.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deadline.caseName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesPriority && matchesSearch;
  });

  // Categorize deadlines
  const categorizedDeadlines = {
    overdue: filteredDeadlines.filter((d: Deadline) => 
      d.status === "pending" && isBefore(new Date(d.dueDate), startOfDay(new Date()))
    ),
    dueToday: filteredDeadlines.filter((d: Deadline) => 
      d.status === "pending" && isToday(new Date(d.dueDate))
    ),
    dueSoon: filteredDeadlines.filter((d: Deadline) => 
      d.status === "pending" && 
      isAfter(new Date(d.dueDate), new Date()) && 
      isBefore(new Date(d.dueDate), addDays(new Date(), 7))
    ),
    upcoming: filteredDeadlines.filter((d: Deadline) => 
      d.status === "pending" && 
      isAfter(new Date(d.dueDate), addDays(new Date(), 7))
    ),
    completed: filteredDeadlines.filter((d: Deadline) => d.status === "completed")
  };

  const DeadlineCard = ({ deadline }: { deadline: Deadline }) => {
    const dueDate = new Date(deadline.dueDate);
    const isOverdue = deadline.status === "pending" && isBefore(dueDate, startOfDay(new Date()));
    const isDueToday = deadline.status === "pending" && isToday(dueDate);
    
    const TypeIcon = DEADLINE_TYPES.find(t => t.value === deadline.deadlineType)?.icon || Clock;
    
    return (
      <Card className={`transition-all duration-200 hover:shadow-lg ${
        isOverdue ? "border-red-300 bg-red-50" : 
        isDueToday ? "border-yellow-300 bg-yellow-50" : ""
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <TypeIcon className="h-4 w-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">{deadline.title}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={PRIORITY_COLORS[deadline.priority]}>
                {deadline.priority}
              </Badge>
              <Badge className={STATUS_COLORS[deadline.status]}>
                {deadline.status}
              </Badge>
            </div>
          </div>
          
          {deadline.description && (
            <p className="text-sm text-gray-600 mb-2">{deadline.description}</p>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className={`flex items-center ${
                isOverdue ? "text-red-600 font-semibold" : 
                isDueToday ? "text-yellow-600 font-semibold" : "text-gray-600"
              }`}>
                <Calendar className="h-4 w-4 mr-1" />
                {format(dueDate, "MMM d, yyyy")}
              </span>
              
              {deadline.caseName && (
                <span className="text-gray-500">
                  Case: {deadline.caseNumber} - {deadline.caseName}
                </span>
              )}
            </div>
            
            {deadline.status === "pending" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateDeadlineStatusMutation.mutate({ 
                  id: deadline.id, 
                  status: "completed" 
                })}
                className="ml-2"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Complete
              </Button>
            )}
          </div>
          
          {(deadline.courtRule || deadline.statuteReference) && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-500 space-y-1">
                {deadline.courtRule && (
                  <div>Court Rule: {deadline.courtRule}</div>
                )}
                {deadline.statuteReference && (
                  <div>Statute: {deadline.statuteReference}</div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const DeadlineOverview = () => (
    <div className="space-y-6">
      {/* Critical Alerts */}
      {(categorizedDeadlines.overdue.length > 0 || categorizedDeadlines.dueToday.length > 0) && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Attention Required:</strong> You have {categorizedDeadlines.overdue.length} overdue 
            and {categorizedDeadlines.dueToday.length} deadlines due today.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-700">{categorizedDeadlines.overdue.length}</div>
            <div className="text-sm text-red-600">Overdue</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-700">{categorizedDeadlines.dueToday.length}</div>
            <div className="text-sm text-yellow-600">Due Today</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-700">{categorizedDeadlines.dueSoon.length}</div>
            <div className="text-sm text-orange-600">Due This Week</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{categorizedDeadlines.upcoming.length}</div>
            <div className="text-sm text-green-600">Upcoming</div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Deadlines */}
      {categorizedDeadlines.overdue.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Overdue Deadlines ({categorizedDeadlines.overdue.length})
          </h3>
          <div className="space-y-3">
            {categorizedDeadlines.overdue.map((deadline: Deadline) => (
              <DeadlineCard key={deadline.id} deadline={deadline} />
            ))}
          </div>
        </div>
      )}

      {/* Due Today */}
      {categorizedDeadlines.dueToday.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-yellow-700 mb-3 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Due Today ({categorizedDeadlines.dueToday.length})
          </h3>
          <div className="space-y-3">
            {categorizedDeadlines.dueToday.map((deadline: Deadline) => (
              <DeadlineCard key={deadline.id} deadline={deadline} />
            ))}
          </div>
        </div>
      )}

      {/* Due This Week */}
      {categorizedDeadlines.dueSoon.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-orange-700 mb-3 flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Due This Week ({categorizedDeadlines.dueSoon.length})
          </h3>
          <div className="space-y-3">
            {categorizedDeadlines.dueSoon.map((deadline: Deadline) => (
              <DeadlineCard key={deadline.id} deadline={deadline} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Deadline Management</h2>
          <p className="text-gray-600">Track court deadlines, statutes of limitations, and important dates</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Deadline
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Deadline</DialogTitle>
              <DialogDescription>
                Add a new deadline to track important dates and court requirements
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newDeadline.title}
                    onChange={(e) => setNewDeadline({ ...newDeadline, title: e.target.value })}
                    placeholder="e.g., File motion to dismiss"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newDeadline.dueDate}
                    onChange={(e) => setNewDeadline({ ...newDeadline, dueDate: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newDeadline.description}
                  onChange={(e) => setNewDeadline({ ...newDeadline, description: e.target.value })}
                  placeholder="Additional details about this deadline..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="deadlineType">Type</Label>
                  <Select 
                    value={newDeadline.deadlineType} 
                    onValueChange={(value) => setNewDeadline({ ...newDeadline, deadlineType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEADLINE_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={newDeadline.priority} 
                    onValueChange={(value: any) => setNewDeadline({ ...newDeadline, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="caseId">Associated Case</Label>
                  <Select 
                    value={newDeadline.caseId} 
                    onValueChange={(value) => setNewDeadline({ ...newDeadline, caseId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select case..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cases.map((case_: Case) => (
                        <SelectItem key={case_.id} value={case_.id}>
                          {case_.caseNumber} - {case_.caseName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="courtRule">Court Rule (optional)</Label>
                  <Input
                    id="courtRule"
                    value={newDeadline.courtRule}
                    onChange={(e) => setNewDeadline({ ...newDeadline, courtRule: e.target.value })}
                    placeholder="e.g., Fed. R. Civ. P. 12(b)(6)"
                  />
                </div>
                <div>
                  <Label htmlFor="statuteReference">Statute Reference (optional)</Label>
                  <Input
                    id="statuteReference"
                    value={newDeadline.statuteReference}
                    onChange={(e) => setNewDeadline({ ...newDeadline, statuteReference: e.target.value })}
                    placeholder="e.g., 28 U.S.C. § 1331"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => createDeadlineMutation.mutate(newDeadline)}
                  disabled={!newDeadline.title || !newDeadline.dueDate || createDeadlineMutation.isPending}
                >
                  Create Deadline
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search deadlines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {DEADLINE_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="all">All Deadlines</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <DeadlineOverview />
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-2" />
                <p>Calendar view coming soon</p>
                <p className="text-sm">This will show deadlines in a monthly calendar format</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <div className="space-y-3">
            {filteredDeadlines.map((deadline: Deadline) => (
              <DeadlineCard key={deadline.id} deadline={deadline} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="space-y-3">
            {categorizedDeadlines.completed.map((deadline: Deadline) => (
              <DeadlineCard key={deadline.id} deadline={deadline} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}