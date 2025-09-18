import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Scale, Shield, Clock, Users, FileText, Zap, ArrowRight, Brain, Search, Lightbulb, AlertTriangle, Upload, Gavel, Target, TrendingUp, Database, Lock, Globe, Smartphone } from "lucide-react";
import { Link } from "wouter";

export default function Features() {
  useEffect(() => {
    // SEO Meta tags
    document.title = "LegalEaseFile Features | Secure, Automated Legal Document Software";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover LegalEaseFile\'s features: e-filing, automation, case management, client portals, AI-powered search, and secure cloud storage for law firms.');
    }

    // Scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-section').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleGetStarted = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
      {/* Custom CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .coral-button {
            background: #FF5A5F;
            color: white;
            border: none;
            transition: all 0.3s ease;
          }
          
          .coral-button:hover {
            background: #FF4449;
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(255, 90, 95, 0.3);
            color: white;
          }
          
          .tier-card {
            transition: all 0.3s ease;
            border: 1px solid transparent;
          }
          
          .tier-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }
          
          .tier-starter {
            background: linear-gradient(135deg, #E0F7FF 0%, #B3E5FC 100%);
          }
          
          .tier-professional {
            background: linear-gradient(135deg, #E0FFF9 0%, #80CBC4 100%);
          }
          
          .tier-enterprise {
            background: linear-gradient(135deg, #EDE7F6 0%, #7E57C2 100%);
          }
          
          .geometric-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #FF5A5F 0%, #E0F7FF 50%, #B3E5FC 100%);
            border-radius: 50% 10% 50% 10%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            transition: all 0.3s ease;
          }
          
          .geometric-icon:hover {
            transform: scale(1.1) rotate(5deg);
          }
        `
      }} />

      {/* Navigation */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="geometric-icon w-10 h-10">
                <Scale className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#FF5A5F] to-[#E0F7FF] bg-clip-text text-transparent">LegalEaseFile</h1>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/features" className="text-[#FF5A5F] font-medium">Features</Link>
              <Link href="/pricing" className="text-gray-700 hover:text-[#FF5A5F] transition-colors">Pricing</Link>
              <Link href="/blog" className="text-gray-700 hover:text-[#FF5A5F] transition-colors">Resources</Link>
              <Link href="/about" className="text-gray-700 hover:text-[#FF5A5F] transition-colors">About</Link>
            </nav>
            
            <Button onClick={handleGetStarted} className="coral-button">
              Start Free Trial
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 scroll-section">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-[#FF5A5F]/10 text-[#FF5A5F] hover:bg-[#FF5A5F]/20 border-[#FF5A5F]/20">
            All-in-One Legal Document Management Features
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            All the Features You Need to File Confidently
          </h1>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            From solo attorneys to enterprise firms, LegalEaseFile gives you full control over documents, compliance, and cases. 
            Discover our comprehensive <span className="font-semibold text-[#FF5A5F]">AI legal document software</span> and 
            <span className="font-semibold text-[#FF5A5F]"> automated court filing</span> capabilities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="coral-button px-8 py-4 text-lg"
            >
              Start Free 7-Day Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-[#FF5A5F] text-[#FF5A5F] hover:bg-[#FF5A5F] hover:text-white px-8 py-4 text-lg"
            >
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Tier 1: Core Foundation Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Core Foundation Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              <span className="font-semibold text-[#FF5A5F]">SEO Focus:</span> AI legal document automation, court filing automation, e-filing software, jurisdiction-specific legal forms
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Jurisdiction-Specific Document Engine */}
            <Card className="tier-card tier-starter border-2 border-transparent hover:border-[#B3E5FC]">
              <CardHeader>
                <div className="geometric-icon w-16 h-16 mb-4" style={{borderRadius: "50% 10% 50% 10%"}}>
                  <Globe className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Jurisdiction-Specific Document Engine</CardTitle>
                <CardDescription>
                  AI-powered forms for CA, NY, TX, FL + federal courts with real-time compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    AI-powered forms for CA, NY, TX, FL + federal courts
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Real-time rule updates (court by court)
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    200+ pre-filled common filing types
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Automated jurisdiction compliance checking
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Intelligent Case Assessment */}
            <Card className="tier-card tier-starter border-2 border-transparent hover:border-[#B3E5FC]">
              <CardHeader>
                <div className="geometric-icon w-16 h-16 mb-4" style={{borderRadius: "10% 50% 10% 50%"}}>
                  <Target className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Intelligent Case Assessment & Triage</CardTitle>
                <CardDescription>
                  AI intake forms leading to optimal legal strategy recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    AI intake forms → optimal legal strategy
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Deadlines + statute of limitations tracking
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Automated alerts for compliance
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Risk assessment and case prioritization
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Smart Document Assembly */}
            <Card className="tier-card tier-starter border-2 border-transparent hover:border-[#B3E5FC]">
              <CardHeader>
                <div className="geometric-icon w-16 h-16 mb-4" style={{borderRadius: "70% 30% 30% 70%"}}>
                  <FileText className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Smart Document Assembly</CardTitle>
                <CardDescription>
                  Natural language drafting with auto-populated client data for consistency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Natural language drafting (pleadings, contracts, motions)
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Auto-populated client data → consistent filings
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Precedent and citation verification
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Template customization and version control
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* E-Filing Integration Hub */}
            <Card className="tier-card tier-starter border-2 border-transparent hover:border-[#B3E5FC]">
              <CardHeader>
                <div className="geometric-icon w-16 h-16 mb-4" style={{borderRadius: "30% 70% 30% 70%"}}>
                  <Upload className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">E-Filing Integration Hub</CardTitle>
                <CardDescription>
                  Direct connection to all major court systems with automated fee calculation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Direct connection to CM/ECF, NextGen CM/ECF, Tyler, File&ServeXpress
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    PACER integration for case tracking
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Auto fee calculation & rejection analysis
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Multi-court filing queue management
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Button onClick={handleGetStarted} className="coral-button px-8 py-3">
              Get Started with Core Features
            </Button>
          </div>
        </div>
      </section>

      {/* Tier 2: Differentiation Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 scroll-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Differentiation Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              <span className="font-semibold text-[#FF5A5F]">SEO Focus:</span> AI legal compliance software, automated legal research, AI litigation tools, legal evidence management
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* AI Legal Strategy Advisor */}
            <Card className="tier-card tier-professional border-2 border-transparent hover:border-[#80CBC4]">
              <CardHeader>
                <div className="geometric-icon w-16 h-16 mb-4" style={{borderRadius: "60% 40% 40% 60%"}}>
                  <Brain className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">AI Legal Strategy Advisor</CardTitle>
                <CardDescription>
                  Predictive outcome modeling with jurisdiction-specific recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Predictive outcome modeling (jurisdiction-specific)
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Discovery, motions, settlement recommendations
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Case strategy optimization based on historical data
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Risk assessment and probability analysis
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Automated Compliance Monitor */}
            <Card className="tier-card tier-professional border-2 border-transparent hover:border-[#80CBC4]">
              <CardHeader>
                <div className="geometric-icon w-16 h-16 mb-4" style={{borderRadius: "40% 60% 60% 40%"}}>
                  <Shield className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Automated Compliance Monitor</CardTitle>
                <CardDescription>
                  Real-time court rule updates with automated format compliance checking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Court rule change alerts
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Filing format compliance checker
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Deadline escalation + service tracking
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Automated regulatory compliance reporting
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Evidence Management Suite */}
            <Card className="tier-card tier-professional border-2 border-transparent hover:border-[#80CBC4]">
              <CardHeader>
                <div className="geometric-icon w-16 h-16 mb-4" style={{borderRadius: "20% 80% 20% 80%"}}>
                  <Database className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Evidence Management Suite</CardTitle>
                <CardDescription>
                  AI-powered review and categorization with digital authentication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    AI review & categorization of exhibits
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Auto-numbering/indexing
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Digital authentication for court admissibility
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Chain of custody tracking and verification
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Pro Se Guidance System */}
            <Card className="tier-card tier-professional border-2 border-transparent hover:border-[#80CBC4]">
              <CardHeader>
                <div className="geometric-icon w-16 h-16 mb-4" style={{borderRadius: "80% 20% 80% 20%"}}>
                  <Users className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Pro Se Guidance System</CardTitle>
                <CardDescription>
                  Step-by-step instructions with plain-English glossary and court prep
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Step-by-step filing instructions
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Plain-English glossary & definitions
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Court appearance prep modules
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Interactive tutorials and video guides
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Button onClick={handleGetStarted} className="coral-button px-8 py-3">
              Unlock Advanced Features
            </Button>
          </div>
        </div>
      </section>

      {/* Tier 3: Premium Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Premium / Market Leadership Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              <span className="font-semibold text-[#FF5A5F]">SEO Focus:</span> AI legal research platform, predictive litigation analytics, AI-powered law firm software
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Advanced Legal Research Engine */}
            <Card className="tier-card tier-enterprise border-2 border-transparent hover:border-[#7E57C2]">
              <CardHeader>
                <div className="geometric-icon w-16 h-16 mb-4" style={{borderRadius: "50% 10% 50% 10%"}}>
                  <Search className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Advanced Legal Research Engine</CardTitle>
                <CardDescription>
                  AI-driven case law search with auto-brief generation and strategy analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    AI-driven case law search + jurisdiction filter
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Auto-brief generation w/ citations
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Opposing counsel strategy analysis
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Precedent strength scoring and recommendation
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Multi-Party Case Coordination */}
            <Card className="tier-card tier-enterprise border-2 border-transparent hover:border-[#7E57C2]">
              <CardHeader>
                <div className="geometric-icon w-16 h-16 mb-4" style={{borderRadius: "10% 50% 10% 50%"}}>
                  <Users className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Multi-Party Case Coordination</CardTitle>
                <CardDescription>
                  Secure client portals with co-counsel collaboration workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Secure client portals
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Co-counsel collaboration workflows
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Opposing counsel tracking
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Real-time document sharing and version control
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Financial Impact Calculator */}
            <Card className="tier-card tier-enterprise border-2 border-transparent hover:border-[#7E57C2]">
              <CardHeader>
                <div className="geometric-icon w-16 h-16 mb-4" style={{borderRadius: "70% 30% 30% 70%"}}>
                  <TrendingUp className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Financial Impact Calculator</CardTitle>
                <CardDescription>
                  AI-powered damage calculation with settlement optimization models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    AI-powered damage calculation
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Settlement optimization models
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Fee shifting analysis
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    ROI tracking and cost-benefit analysis
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Advanced Analytics Dashboard */}
            <Card className="tier-card tier-enterprise border-2 border-transparent hover:border-[#7E57C2]">
              <CardHeader>
                <div className="geometric-icon w-16 h-16 mb-4" style={{borderRadius: "30% 70% 30% 70%"}}>
                  <TrendingUp className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Advanced Analytics Dashboard</CardTitle>
                <CardDescription>
                  Real-time performance tracking with predictive resolution timelines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Case performance tracking
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Predictive resolution timelines
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Cost efficiency + ROI insights
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Custom reporting and data visualization
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Button onClick={handleGetStarted} className="coral-button px-8 py-3">
              Access Premium Features
            </Button>
          </div>
        </div>
      </section>

      {/* Specialty Differentiators */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 scroll-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Specialty Differentiators
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              <span className="font-semibold text-[#FF5A5F]">SEO Focus:</span> emergency legal filings, pro bono legal software, AI court filing assistance
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="tier-card bg-white hover:shadow-xl text-center">
              <CardContent className="p-6">
                <div className="geometric-icon w-16 h-16 mx-auto mb-4" style={{borderRadius: "60% 40% 40% 60%"}}>
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Emergency Filing Engine</h3>
                <p className="text-gray-600 text-sm mb-4">
                  TROs, injunctions, expedited motions with 24/7 emergency support
                </p>
                <Badge className="bg-[#FF5A5F]/10 text-[#FF5A5F]">Critical Filing</Badge>
              </CardContent>
            </Card>
            
            <Card className="tier-card bg-white hover:shadow-xl text-center">
              <CardContent className="p-6">
                <div className="geometric-icon w-16 h-16 mx-auto mb-4" style={{borderRadius: "40% 60% 60% 40%"}}>
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Pro Bono Directory</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Direct aid + indigent case support with comprehensive legal assistance network
                </p>
                <Badge className="bg-[#FF5A5F]/10 text-[#FF5A5F]">Legal Aid</Badge>
              </CardContent>
            </Card>
            
            <Card className="tier-card bg-white hover:shadow-xl text-center">
              <CardContent className="p-6">
                <div className="geometric-icon w-16 h-16 mx-auto mb-4" style={{borderRadius: "20% 80% 20% 80%"}}>
                  <Lock className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">MPC AI Assistant</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Secure multi-party computation + AES-256 encryption for sensitive data
                </p>
                <Badge className="bg-[#FF5A5F]/10 text-[#FF5A5F]">Secure AI</Badge>
              </CardContent>
            </Card>
            
            <Card className="tier-card bg-white hover:shadow-xl text-center">
              <CardContent className="p-6">
                <div className="geometric-icon w-16 h-16 mx-auto mb-4" style={{borderRadius: "80% 20% 80% 20%"}}>
                  <Gavel className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Templates</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Guided completion, compliance checks with auto-formatting
                </p>
                <Badge className="bg-[#FF5A5F]/10 text-[#FF5A5F]">AI Templates</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why LegalEaseFile */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-section">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Why Choose LegalEaseFile?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <div className="geometric-icon w-16 h-16 mx-auto mb-4">
                <Lightbulb className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Streamline the Legal Document Lifecycle</h3>
              <p className="text-gray-600">
                From initial drafting to final filing, every step is optimized for efficiency and accuracy.
              </p>
            </div>
            
            <div>
              <div className="geometric-icon w-16 h-16 mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Reduce Errors, Save Time, Stay Compliant</h3>
              <p className="text-gray-600">
                AI-powered compliance checking eliminates costly mistakes and ensures court requirements are met.
              </p>
            </div>
            
            <div>
              <div className="geometric-icon w-16 h-16 mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Built for Attorneys, Designed for Clients</h3>
              <p className="text-gray-600">
                Professional-grade tools that are accessible to both legal professionals and self-represented litigants.
              </p>
            </div>
          </div>
          
          <Button onClick={handleGetStarted} className="coral-button px-8 py-4 text-lg">
            Start Free 7-Day Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-3 mb-4">
                <div className="geometric-icon w-8 h-8">
                  <Scale className="h-4 w-4" />
                </div>
                <span className="text-lg font-semibold">LegalEaseFile</span>
              </Link>
              <p className="text-gray-400 text-sm">
                AI-powered legal filing platform for modern attorneys and self-represented litigants.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/templates" className="hover:text-white transition-colors">Templates</Link></li>
                <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/glossary" className="hover:text-white transition-colors">Legal Glossary</Link></li>
                <li><Link href="/guides" className="hover:text-white transition-colors">Filing Guides</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2025 LegalEaseFile. All rights reserved. AI legal document automation, court filing automation, e-filing software.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}