import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Sparkles
} from "lucide-react";

interface PremiumService {
  id: string;
  name: string;
  description: string;
  price: number;
  priceType?: string;
  features: string[];
  rating?: number;
  badge?: string;
  icon: React.ReactNode;
}

export default function PremiumServices() {
  const [selectedCategory, setSelectedCategory] = useState("templates");

  const premiumTemplates: PremiumService[] = [
    {
      id: "template_complex_litigation",
      name: "Complex Litigation Package",
      description: "Advanced templates for complex civil litigation cases",
      price: 49.99,
      features: [
        "Motion for Summary Judgment (Advanced)",
        "Complex Discovery Requests", 
        "Expert Witness Disclosures",
        "Settlement Agreement Templates"
      ],
      rating: 4.9,
      badge: "BESTSELLER",
      icon: <FileText className="w-6 h-6" />
    },
    {
      id: "template_bankruptcy_suite", 
      name: "Bankruptcy Filing Suite",
      description: "Complete bankruptcy filing templates and guides",
      price: 79.99,
      features: [
        "Chapter 7 Petition Package",
        "Chapter 13 Plan Templates",
        "Creditor Matrix Forms", 
        "Asset Schedules"
      ],
      rating: 4.8,
      icon: <FileText className="w-6 h-6" />
    }
  ];

  const aiServices: PremiumService[] = [
    {
      id: "ai_review_premium",
      name: "AI + Human Expert Review",
      description: "AI analysis plus human attorney review",
      price: 49.99,
      priceType: "per document",
      features: [
        "AI pre-analysis",
        "Licensed attorney review", 
        "Detailed feedback report",
        "Strategy recommendations"
      ],
      badge: "MOST ACCURATE",
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      id: "ai_review_basic",
      name: "AI Document Review",
      description: "Advanced AI analysis and recommendations", 
      price: 9.99,
      priceType: "per document",
      features: [
        "Deep legal analysis",
        "Compliance checking",
        "Risk assessment",
        "Improvement suggestions"
      ],
      icon: <Sparkles className="w-6 h-6" />
    }
  ];

  const consultationServices: PremiumService[] = [
    {
      id: "consultation_60min",
      name: "Extended Legal Consultation",
      description: "60-minute consultation with licensed attorney",
      price: 200.00,
      features: [
        "In-depth case analysis",
        "Comprehensive legal strategy",
        "Document preparation guidance", 
        "Follow-up email support"
      ],
      badge: "COMPREHENSIVE",
      icon: <Phone className="w-6 h-6" />
    },
    {
      id: "consultation_30min",
      name: "Standard Legal Consultation", 
      description: "30-minute consultation with licensed attorney",
      price: 125.00,
      features: [
        "Comprehensive document review",
        "Detailed legal advice",
        "Strategy discussion",
        "Written summary"
      ],
      badge: "POPULAR",
      icon: <Phone className="w-6 h-6" />
    }
  ];

  const priorityServices: PremiumService[] = [
    {
      id: "priority_filing_rush",
      name: "Rush Filing Service",
      description: "Expedited document filing within 2 hours",
      price: 99.99,
      features: [
        "2-hour filing guarantee",
        "Priority queue processing",
        "Real-time status updates",
        "Dedicated support"
      ],
      badge: "FASTEST",
      icon: <Zap className="w-6 h-6" />
    },
    {
      id: "priority_filing_same_day",
      name: "Same Day Filing",
      description: "Document filing within same business day", 
      price: 49.99,
      features: [
        "Same day filing guarantee",
        "Status notifications",
        "Email confirmation",
        "Support chat access"
      ],
      icon: <Clock className="w-6 h-6" />
    }
  ];

  const trainingPrograms: PremiumService[] = [
    {
      id: "training_advanced_litigation",
      name: "Advanced Litigation Strategies",
      description: "Advanced course for litigation professionals",
      price: 499.99,
      features: [
        "Live instructor sessions",
        "Interactive workshops", 
        "Case study analysis",
        "Professional certification"
      ],
      rating: 4.9,
      badge: "CERTIFIED",
      icon: <Award className="w-6 h-6" />
    },
    {
      id: "training_basic_filing",
      name: "Legal Document Filing Basics",
      description: "Comprehensive course on legal document filing",
      price: 199.99,
      features: [
        "12 video modules",
        "Downloadable resources",
        "Practice exercises", 
        "Certificate of completion"
      ],
      rating: 4.8,
      icon: <BookOpen className="w-6 h-6" />
    }
  ];

  const renderServiceCard = (service: PremiumService) => (
    <Card key={service.id} className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              {service.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{service.name}</CardTitle>
              {service.badge && (
                <Badge className="mt-1 bg-green-100 text-green-800 text-xs">
                  {service.badge}
                </Badge>
              )}
            </div>
          </div>
          {service.rating && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{service.rating}</span>
            </div>
          )}
        </div>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-blue-600">
              ${service.price}
            </span>
            {service.priceType && (
              <span className="text-sm text-gray-500">
                {service.priceType}
              </span>
            )}
          </div>
          
          <ul className="space-y-2">
            {service.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Purchase Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const categoryData = {
    templates: { services: premiumTemplates, icon: <FileText className="w-4 h-4" /> },
    ai: { services: aiServices, icon: <Sparkles className="w-4 h-4" /> },
    consultations: { services: consultationServices, icon: <Phone className="w-4 h-4" /> },
    priority: { services: priorityServices, icon: <Zap className="w-4 h-4" /> },
    training: { services: trainingPrograms, icon: <BookOpen className="w-4 h-4" /> }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Premium Legal Services
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Enhance your legal practice with our premium services. Core document management remains completely free.
        </p>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          {Object.entries(categoryData).map(([key, data]) => (
            <TabsTrigger key={key} value={key} className="flex items-center space-x-2">
              {data.icon}
              <span className="capitalize">{key}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(categoryData).map(([key, data]) => (
          <TabsContent key={key} value={key}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.services.map(renderServiceCard)}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
