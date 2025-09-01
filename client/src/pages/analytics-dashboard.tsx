import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Star,
  Download,
  Phone,
  FileText,
  Sparkles,
  BarChart3,
  PieChart,
  Calendar,
  Target
} from "lucide-react";

interface RevenueMetric {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

interface ServicePerformance {
  name: string;
  revenue: number;
  users: number;
  conversionRate: number;
  growth: number;
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  const revenueMetrics: RevenueMetric[] = [
    {
      title: "Total Revenue",
      value: "$127,450",
      change: "+23.5%",
      changeType: "positive",
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      title: "Premium Users",
      value: "3,247",
      change: "+18.2%",
      changeType: "positive", 
      icon: <Users className="w-5 h-5" />
    },
    {
      title: "Conversion Rate",
      value: "24.8%",
      change: "+4.1%",
      changeType: "positive",
      icon: <Target className="w-5 h-5" />
    },
    {
      title: "Avg. Order Value",
      value: "$89.32",
      change: "+12.7%",
      changeType: "positive",
      icon: <ShoppingBag className="w-5 h-5" />
    }
  ];

  const servicePerformance: ServicePerformance[] = [
    {
      name: "Premium Templates",
      revenue: 45230,
      users: 1250,
      conversionRate: 28.5,
      growth: 15.2
    },
    {
      name: "AI Document Review",
      revenue: 32100,
      users: 890,
      conversionRate: 22.1,
      growth: 32.8
    },
    {
      name: "Legal Consultations",
      revenue: 28900,
      users: 145,
      conversionRate: 45.2,
      growth: 8.7
    },
    {
      name: "Priority Filing",
      revenue: 21220,
      users: 320,
      conversionRate: 35.6,
      growth: 25.4
    }
  ];

  const topSellingServices = [
    {
      name: "Complex Litigation Package",
      sales: 245,
      revenue: "$12,225",
      rating: 4.9
    },
    {
      name: "AI + Human Expert Review",
      sales: 189,
      revenue: "$9,441",
      rating: 4.8
    },
    {
      name: "Extended Legal Consultation",
      sales: 156,
      revenue: "$31,200",
      rating: 4.9
    },
    {
      name: "Rush Filing Service",
      sales: 134,
      revenue: "$13,387",
      rating: 4.7
    }
  ];

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor your monetization performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Revenue Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {revenueMetrics.map((metric, index) => (
            <Card key={index} className="card-hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <p className={`text-sm flex items-center mt-1 ${getChangeColor(metric.changeType)}`}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {metric.change}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    {metric.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Service Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Service Performance
              </CardTitle>
              <CardDescription>Revenue and conversion metrics by service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {servicePerformance.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span>${service.revenue.toLocaleString()} revenue</span>
                        <span>{service.users} users</span>
                        <span>{service.conversionRate}% conversion</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={service.growth > 20 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                        +{service.growth}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Selling Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Top Selling Services
              </CardTitle>
              <CardDescription>Best performing premium services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSellingServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{service.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-600">{service.sales} sales</span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-gray-600 ml-1">{service.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{service.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Revenue Breakdown
            </CardTitle>
            <CardDescription>Revenue distribution across different monetization channels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Premium Templates</h4>
                <p className="text-2xl font-bold text-blue-600">$45.2K</p>
                <p className="text-sm text-gray-600">35.5% of total</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">AI Services</h4>
                <p className="text-2xl font-bold text-purple-600">$32.1K</p>
                <p className="text-sm text-gray-600">25.2% of total</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Phone className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Consultations</h4>
                <p className="text-2xl font-bold text-green-600">$28.9K</p>
                <p className="text-sm text-gray-600">22.7% of total</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Other Services</h4>
                <p className="text-2xl font-bold text-orange-600">$21.2K</p>
                <p className="text-sm text-gray-600">16.6% of total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
