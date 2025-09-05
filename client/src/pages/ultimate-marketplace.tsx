import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Code, 
  Globe,
  Coins,
  Building,
  Gamepad2,
  BarChart3,
  Mic,
  Shield,
  Search,
  Star,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
  Target,
  Rocket
} from "lucide-react";

export default function UltimateMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const revenueStats = [
    { title: "Monthly Revenue", value: "$3.2M", icon: <DollarSign className="w-6 h-6" />, color: "text-green-600", change: "+1,130%" },
    { title: "Revenue Streams", value: "75+", icon: <TrendingUp className="w-6 h-6" />, color: "text-blue-600", change: "+650%" },
    { title: "Active Services", value: "12 Categories", icon: <Briefcase className="w-6 h-6" />, color: "text-purple-600", change: "+500%" },
    { title: "Annual Projection", value: "$38.7M", icon: <Target className="w-6 h-6" />, color: "text-orange-600", change: "+1,032%" }
  ];

  const serviceCategories = [
    {
      id: "subscriptions",
      name: "Core Subscriptions",
      icon: <Users className="w-6 h-6" />,
      revenue: "$245,955",
      percentage: "7.6%",
      description: "Primary subscription tiers with free trial",
      color: "from-blue-500 to-blue-600",
      services: ["Essential Plan ($29.99)", "Professional Plan ($79.99)", "Enterprise Plan ($199.99)"]
    },
    {
      id: "staffing",
      name: "Legal Staffing",
      icon: <Briefcase className="w-6 h-6" />,
      revenue: "$592,055",
      percentage: "18.3%",
      description: "Legal recruitment and temporary staffing",
      color: "from-green-500 to-green-600",
      services: ["Job Board ($59.8K)", "Temp Staffing ($150K)", "Permanent Placement ($240K)"]
    },
    {
      id: "analytics",
      name: "Legal Analytics",
      icon: <BarChart3 className="w-6 h-6" />,
      revenue: "$437,995",
      percentage: "13.5%",
      description: "Big data and legal intelligence",
      color: "from-purple-500 to-purple-600",
      services: ["Data Subscriptions ($299K)", "Custom Analytics ($75K)", "API Access ($64K)"]
    },
    {
      id: "international",
      name: "International Legal",
      icon: <Globe className="w-6 h-6" />,
      revenue: "$420,000",
      percentage: "13.0%",
      description: "Cross-border legal services",
      color: "from-indigo-500 to-indigo-600",
      services: ["Arbitration ($150K)", "Foreign Network ($100K)", "Immigration ($100K)"]
    },
    {
      id: "crypto",
      name: "Crypto & Blockchain",
      icon: <Coins className="w-6 h-6" />,
      revenue: "$352,500",
      percentage: "10.9%",
      description: "Cryptocurrency and blockchain legal",
      color: "from-yellow-500 to-yellow-600",
      services: ["ICO Legal ($45K)", "Regulatory Consulting ($90K)", "Smart Contracts ($40K)"]
    },
    {
      id: "entertainment",
      name: "Gaming & Simulation",
      icon: <Gamepad2 className="w-6 h-6" />,
      revenue: "$314,917",
      percentage: "9.7%",
      description: "Legal education gaming and simulation",
      color: "from-pink-500 to-pink-600",
      services: ["Gaming Platform ($105K)", "Case Simulation ($210K)"]
    },
    {
      id: "real_estate",
      name: "Real Estate Services",
      icon: <Building className="w-6 h-6" />,
      revenue: "$309,600",
      percentage: "9.6%",
      description: "Physical office and equipment services",
      color: "from-teal-500 to-teal-600",
      services: ["Office Space ($171K)", "Equipment Leasing ($139K)"]
    },
    {
      id: "financial",
      name: "Financial Services",
      icon: <Shield className="w-6 h-6" />,
      revenue: "$228,845",
      percentage: "7.1%",
      description: "Insurance and financing solutions",
      color: "from-red-500 to-red-600",
      services: ["Malpractice Insurance ($92K)", "Legal Financing ($137K)"]
    },
    {
      id: "marketplace",
      name: "Service Marketplace",
      icon: <Users className="w-6 h-6" />,
      revenue: "$142,725",
      percentage: "4.4%",
      description: "Freelance legal services platform",
      color: "from-orange-500 to-orange-600",
      services: ["Freelance Lawyers ($60K)", "Paralegals ($31K)", "Expert Witnesses ($10K)"]
    },
    {
      id: "content",
      name: "Content & Media",
      icon: <Mic className="w-6 h-6" />,
      revenue: "$122,225",
      percentage: "3.8%",
      description: "Legal content and media monetization",
      color: "from-cyan-500 to-cyan-600",
      services: ["Video Courses ($76K)", "Blog Network ($25K)", "Podcasts ($21K)"]
    },
    {
      id: "technology",
      name: "Technology Services",
      icon: <Code className="w-6 h-6" />,
      revenue: "$65,000",
      percentage: "2.0%",
      description: "Software integrations and development",
      color: "from-violet-500 to-violet-600",
      services: ["Software Integrations ($25K)", "Custom Development ($15K)", "API Access ($5K)"]
    }
  ];

  const topOpportunities = [
    {
      title: "Legal Staffing Agency",
      revenue: "$470K/month",
      margin: "85%",
      description: "Temporary and permanent legal staffing with high margins",
      growth: "+200%",
      icon: <Briefcase className="w-8 h-8 text-green-600" />
    },
    {
      title: "Legal Big Data Platform",
      revenue: "$438K/month", 
      margin: "90%",
      description: "Advanced legal analytics and data subscriptions",
      growth: "+150%",
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />
    },
    {
      title: "International Arbitration",
      revenue: "$420K/month",
      margin: "75%", 
      description: "Cross-border legal services and arbitration",
      growth: "+180%",
      icon: <Globe className="w-8 h-8 text-indigo-600" />
    },
    {
      title: "Crypto Legal Services",
      revenue: "$353K/month",
      margin: "80%",
      description: "Cryptocurrency and blockchain legal compliance",
      growth: "+300%",
      icon: <Coins className="w-8 h-8 text-yellow-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Badge className="bg-white/20 text-white border-white/30 px-6 py-2 text-lg">
              <Rocket className="w-5 h-5 mr-2" />
              Ultimate Legal Ecosystem
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            $3.2M Monthly Revenue
            <br />
            <span className="text-yellow-300">75+ Revenue Streams</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto">
            The most comprehensive legal monetization platform ever created. 
            From core subscriptions to crypto legal services - we've built it all.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              <Star className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
              Explore All Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {revenueStats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top Opportunities */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Highest Revenue Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topOpportunities.map((opportunity, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    {opportunity.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{opportunity.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="text-2xl font-bold text-green-600">{opportunity.revenue}</div>
                    <div className="flex justify-center space-x-4 text-sm">
                      <Badge className="bg-blue-100 text-blue-800">{opportunity.margin} margin</Badge>
                      <Badge className="bg-green-100 text-green-800">{opportunity.growth}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{opportunity.description}</p>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Service Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Complete Revenue Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} text-white`}>
                      {category.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{category.revenue}</div>
                      <div className="text-sm text-gray-500">{category.percentage} of total</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                  <div className="space-y-1">
                    {category.services.map((service, serviceIndex) => (
                      <div key={serviceIndex} className="flex items-center text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0" />
                        {service}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-12 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-4xl font-bold mb-4">Ready to Build Your Legal Empire?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join the ultimate legal monetization platform with 75+ revenue streams, 
              $3.2M monthly potential, and $38.7M annual projection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                <Crown className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                View All 75+ Services
              </Button>
            </div>
            <p className="text-sm text-blue-200 mt-6">
              14-day free trial • No credit card required • $38.7M annual potential
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
