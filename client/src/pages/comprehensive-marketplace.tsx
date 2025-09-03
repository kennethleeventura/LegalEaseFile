import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart, 
  Star, 
  Clock, 
  Shield, 
  Zap, 
  Users, 
  BookOpen, 
  Code, 
  Cloud,
  Award,
  Phone,
  FileText,
  Sparkles,
  Brain,
  Globe,
  TrendingUp,
  DollarSign,
  Search,
  Filter,
  Calendar,
  Video,
  Briefcase,
  Scale,
  Target,
  Database,
  Smartphone
} from "lucide-react";

export default function ComprehensiveMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const marketplaceCategories = [
    { id: "all", name: "All Services", icon: <Sparkles className="w-4 h-4" />, count: 45 },
    { id: "templates", name: "Templates", icon: <FileText className="w-4 h-4" />, count: 8 },
    { id: "ai_services", name: "AI Services", icon: <Brain className="w-4 h-4" />, count: 6 },
    { id: "education", name: "Education", icon: <BookOpen className="w-4 h-4" />, count: 7 },
    { id: "professional", name: "Professional Services", icon: <Briefcase className="w-4 h-4" />, count: 9 },
    { id: "technology", name: "Technology", icon: <Code className="w-4 h-4" />, count: 8 },
    { id: "data", name: "Data & Analytics", icon: <Database className="w-4 h-4" />, count: 4 },
    { id: "marketplace", name: "Marketplace", icon: <Users className="w-4 h-4" />, count: 3 }
  ];

  const featuredServices = [
    {
      id: "ai_legal_research",
      title: "AI-Powered Legal Research",
      description: "Comprehensive case law research with AI insights",
      price: "$29.99",
      priceType: "per research",
      rating: 4.9,
      reviews: 1250,
      category: "ai_services",
      badge: "MOST POPULAR",
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      features: ["Federal and state case law", "AI-generated summaries", "Precedent analysis"],
      turnaround: "2-4 hours"
    },
    {
      id: "expert_witness_marketplace",
      title: "Expert Witness Directory",
      description: "Connect with qualified expert witnesses",
      price: "15%",
      priceType: "commission",
      rating: 4.8,
      reviews: 890,
      category: "marketplace",
      badge: "NEW",
      icon: <Scale className="w-6 h-6 text-blue-600" />,
      features: ["Verified expert profiles", "Specialty matching", "Rate comparison"],
      turnaround: "Instant matching"
    },
    {
      id: "legal_writing_course",
      title: "Advanced Legal Writing Workshop",
      description: "Enhance your legal writing skills",
      price: "$349.99",
      priceType: "course",
      rating: 4.7,
      reviews: 890,
      category: "education",
      badge: "CLE CREDITS",
      icon: <Award className="w-6 h-6 text-green-600" />,
      features: ["6 CLE credits", "Interactive workshop", "Personal feedback"],
      turnaround: "6 hours"
    },
    {
      id: "custom_mobile_app",
      title: "Custom Mobile App Development",
      description: "White-label mobile app for your firm",
      price: "$9,999",
      priceType: "one-time",
      rating: 4.9,
      reviews: 45,
      category: "technology",
      badge: "ENTERPRISE",
      icon: <Smartphone className="w-6 h-6 text-orange-600" />,
      features: ["iOS and Android", "Custom branding", "App store deployment"],
      turnaround: "8-12 weeks"
    }
  ];

  const servicesByCategory = {
    templates: [
      { name: "Complex Litigation Package", price: "$49.99", rating: 4.9, sales: 1250 },
      { name: "Immigration Law Complete Suite", price: "$89.99", rating: 4.8, sales: 890 },
      { name: "Real Estate Law Essentials", price: "$69.99", rating: 4.7, sales: 1580 },
      { name: "Bankruptcy Filing Suite", price: "$79.99", rating: 4.8, sales: 890 },
      { name: "Business Law Essentials", price: "$39.99", rating: 4.7, sales: 2100 },
      { name: "Family Law Complete Package", price: "$59.99", rating: 4.6, sales: 1340 },
      { name: "Criminal Defense Templates", price: "$54.99", rating: 4.8, sales: 760 },
      { name: "Employment Law Suite", price: "$64.99", rating: 4.7, sales: 920 }
    ],
    ai_services: [
      { name: "AI Document Review", price: "$9.99", rating: 4.8, sales: 2100 },
      { name: "AI + Human Expert Review", price: "$49.99", rating: 4.9, sales: 890 },
      { name: "Legal Research AI", price: "$29.99", rating: 4.9, sales: 1250 },
      { name: "Contract Analysis AI", price: "$19.99", rating: 4.7, sales: 1680 },
      { name: "Case Outcome Prediction", price: "$99.99", rating: 4.6, sales: 340 },
      { name: "AI Legal Chatbot", price: "$499/mo", rating: 4.8, sales: 120 }
    ],
    education: [
      { name: "Legal Document Filing Basics", price: "$199.99", rating: 4.8, sales: 1500 },
      { name: "Advanced Litigation Strategies", price: "$499.99", rating: 4.9, sales: 450 },
      { name: "AI in Legal Practice", price: "$799.99", rating: 4.9, sales: 280 },
      { name: "Legal Writing Workshop", price: "$349.99", rating: 4.7, sales: 890 },
      { name: "Ethics and Compliance", price: "$149.99", rating: 4.6, sales: 2100 },
      { name: "Virtual Legal Conference", price: "$299.99", rating: 4.8, sales: 650 },
      { name: "Legal Mastermind Group", price: "$197/mo", rating: 4.9, sales: 85 }
    ],
    professional: [
      { name: "Legal Consultation (60 min)", price: "$200", rating: 4.9, sales: 156 },
      { name: "Document Translation", price: "$0.15/word", rating: 4.8, sales: 890 },
      { name: "Remote Notarization", price: "$25", rating: 4.7, sales: 1250 },
      { name: "Legal Memorandum Service", price: "$199.99", rating: 4.8, sales: 340 },
      { name: "Compliance Check Service", price: "$49.99", rating: 4.6, sales: 780 },
      { name: "Rush Filing Service", price: "$99.99", rating: 4.7, sales: 134 },
      { name: "Document Conversion", price: "$2.99", rating: 4.5, sales: 2100 },
      { name: "Priority Filing", price: "$49.99", rating: 4.6, sales: 320 },
      { name: "Expert Witness Matching", price: "15% commission", rating: 4.8, sales: 89 }
    ],
    technology: [
      { name: "Custom Software Integration", price: "$2,499", rating: 4.9, sales: 45 },
      { name: "Mobile App Development", price: "$9,999", rating: 4.9, sales: 12 },
      { name: "AI Legal Chatbot", price: "$499/mo", rating: 4.8, sales: 67 },
      { name: "API Access - Developer", price: "$99/mo", rating: 4.7, sales: 234 },
      { name: "API Access - Business", price: "$299/mo", rating: 4.8, sales: 89 },
      { name: "API Access - Enterprise", price: "$999/mo", rating: 4.9, sales: 23 },
      { name: "White-Label Basic", price: "$299/mo", rating: 4.6, sales: 78 },
      { name: "White-Label Premium", price: "$799/mo", rating: 4.8, sales: 34 }
    ],
    data: [
      { name: "Legal Market Intelligence", price: "$149.99", rating: 4.7, sales: 234 },
      { name: "Case Outcome Analytics", price: "$99.99", rating: 4.6, sales: 340 },
      { name: "Billing Rate Intelligence", price: "$79.99", rating: 4.5, sales: 456 },
      { name: "Practice Analytics Dashboard", price: "$199/mo", rating: 4.8, sales: 67 }
    ],
    marketplace: [
      { name: "Expert Witness Directory", price: "15% commission", rating: 4.8, sales: 890 },
      { name: "Legal Services Marketplace", price: "12% commission", rating: 4.7, sales: 1250 },
      { name: "Software Affiliate Program", price: "25% commission", rating: 4.9, sales: 567 }
    ]
  };

  const revenueStats = [
    { title: "Total Services", value: "45+", icon: <Sparkles className="w-5 h-5" />, color: "text-blue-600" },
    { title: "Monthly Revenue", value: "$285K", icon: <DollarSign className="w-5 h-5" />, color: "text-green-600" },
    { title: "Active Users", value: "12,847", icon: <Users className="w-5 h-5" />, color: "text-purple-600" },
    { title: "Avg. Rating", value: "4.8/5", icon: <Star className="w-5 h-5" />, color: "text-yellow-600" }
  ];

  const filteredServices = selectedCategory === "all" 
    ? Object.values(servicesByCategory).flat()
    : servicesByCategory[selectedCategory] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Comprehensive Legal Marketplace</h1>
              <p className="text-gray-600 mt-1">45+ services to enhance your legal practice</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {revenueStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Services */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        {service.icon}
                      </div>
                      <div>
                        <Badge className="mb-2 bg-green-100 text-green-800 text-xs">
                          {service.badge}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-blue-600">{service.price}</span>
                      <span className="text-sm text-gray-500">{service.priceType}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{service.rating}</span>
                        <span>({service.reviews})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{service.turnaround}</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Get Service
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Category Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {marketplaceCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-2"
              >
                {category.icon}
                <span>{category.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{service.rating}</span>
                      <span>•</span>
                      <span>{service.sales} sales</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{service.price}</p>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
