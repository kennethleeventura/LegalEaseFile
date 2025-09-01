import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PremiumServices from "@/components/marketplace/premium-services";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Star,
  ShoppingBag,
  Zap,
  Award,
  Sparkles
} from "lucide-react";

export default function PremiumMarketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const revenueStats = [
    {
      title: "Monthly Revenue",
      value: "$45,230",
      change: "+12.5%",
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-green-600"
    },
    {
      title: "Premium Users",
      value: "2,847",
      change: "+8.2%", 
      icon: <Users className="w-5 h-5" />,
      color: "text-blue-600"
    },
    {
      title: "Avg. Rating",
      value: "4.8/5",
      change: "+0.1",
      icon: <Star className="w-5 h-5" />,
      color: "text-yellow-600"
    },
    {
      title: "Conversion Rate",
      value: "18.4%",
      change: "+2.1%",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-purple-600"
    }
  ];

  const featuredServices = [
    {
      id: "featured_ai_review",
      title: "AI-Powered Document Review",
      description: "Get instant AI analysis of your legal documents with 95% accuracy",
      price: "$9.99",
      originalPrice: "$19.99",
      discount: "50% OFF",
      rating: 4.9,
      purchases: 1250,
      badge: "LIMITED TIME",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      id: "featured_consultation",
      title: "Expert Legal Consultation",
      description: "30-minute consultation with licensed attorneys",
      price: "$125.00",
      originalPrice: "$175.00",
      discount: "29% OFF",
      rating: 4.8,
      purchases: 890,
      badge: "MOST POPULAR",
      gradient: "from-green-500 to-teal-600"
    },
    {
      id: "featured_templates",
      title: "Premium Template Bundle",
      description: "500+ professional legal document templates",
      price: "$79.99",
      originalPrice: "$149.99",
      discount: "47% OFF",
      rating: 4.7,
      purchases: 2100,
      badge: "BEST VALUE",
      gradient: "from-orange-500 to-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Premium Marketplace</h1>
              <p className="text-gray-600 mt-1">Enhance your legal practice with premium services</p>
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
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="templates">Templates</SelectItem>
                  <SelectItem value="ai">AI Services</SelectItem>
                  <SelectItem value="consultation">Consultations</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                </SelectContent>
              </Select>
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
                    <p className={`text-sm ${stat.color} flex items-center mt-1`}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </p>
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Services</h2>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              Special Offers
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <Card key={service.id} className="relative overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className={`absolute top-0 right-0 bg-gradient-to-r ${service.gradient} text-white px-3 py-1 text-xs font-bold`}>
                  {service.badge}
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-2">{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-green-600">{service.price}</span>
                        <span className="text-sm text-gray-500 line-through">{service.originalPrice}</span>
                        <Badge className="bg-red-100 text-red-800 text-xs">
                          {service.discount}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{service.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ShoppingBag className="w-4 h-4" />
                        <span>{service.purchases} purchases</span>
                      </div>
                    </div>
                    
                    <Button className={`w-full bg-gradient-to-r ${service.gradient} hover:opacity-90 text-white`}>
                      <Zap className="w-4 h-4 mr-2" />
                      Get This Deal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Services */}
        <PremiumServices />

        {/* Monetization Notice */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Core Service Always Free
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our basic document management and filing service remains completely free. 
              Premium services are optional enhancements to support advanced legal workflows and provide additional revenue streams.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
