import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Scale, Shield, Clock, Users, FileText, Zap, ArrowRight, Brain, Search, Lightbulb, ChevronDown } from "lucide-react";
import { CompassLogo } from "@/components/CompassLogo";

export default function Landing() {
  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Smooth scroll animations on mount
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

    // Observe all sections for scroll animations
    document.querySelectorAll('.scroll-section').forEach((el) => {
      observer.observe(el);
    });

    // Parallax effect on scroll
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax');
      
      parallaxElements.forEach((element) => {
        const speed = (element as HTMLElement).dataset.speed || "0.5";
        const yPos = -(scrolled * parseFloat(speed));
        (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogin = () => {
    window.location.href = "/auth";
  };

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
      {/* Custom CSS for animations */}
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
          
          .gradient-text {
            color: #FF5A5F;
            font-weight: 700;
          }
          
          @supports (-webkit-background-clip: text) {
            .gradient-text {
              background: linear-gradient(135deg, #FF5A5F 0%, #E0F7FF 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
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
          
          .split-screen {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
            min-height: 100vh;
          }
          
          @media (max-width: 768px) {
            .split-screen {
              grid-template-columns: 1fr;
              gap: 2rem;
              min-height: auto;
            }
          }
          
          .scroll-indicator {
            position: absolute;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            animation: bounce 2s infinite;
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateX(-50%) translateY(0);
            }
            40% {
              transform: translateX(-50%) translateY(-10px);
            }
            60% {
              transform: translateX(-50%) translateY(-5px);
            }
          }

          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes scale {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `
      }} />

      {/* Navigation */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <CompassLogo size="w-10 h-10" />
              <h1 className="text-xl font-bold gradient-text">LegalEaseFile</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection(featuresRef)} className="text-gray-700 hover:text-[#FF5A5F] transition-colors">Features</button>
              <button onClick={() => scrollToSection(pricingRef)} className="text-gray-700 hover:text-[#FF5A5F] transition-colors">Pricing</button>
              <a href="/blog" className="text-gray-700 hover:text-[#FF5A5F] transition-colors">Resources</a>
              <a href="/about" className="text-gray-700 hover:text-[#FF5A5F] transition-colors">About</a>
            </nav>
            
            <Button onClick={handleLogin} className="coral-button">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Split Screen */}
      <section ref={heroRef} className="relative pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="split-screen">
            {/* Left Side - Content */}
            <div className="space-y-8 scroll-section">
              <div>
                <Badge className="mb-4 bg-[#FF5A5F]/10 text-[#FF5A5F] hover:bg-[#FF5A5F]/20 border-[#FF5A5F]/20">
                  AI-Powered Legal Filing Platform
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  AI-Powered Legal Filing for <span className="text-[#FF5A5F]">Pro Se Litigants</span> & Small Law Firms
                </h1>
                <p className="text-xl text-gray-600 mb-4 leading-relaxed">
                  <span className="font-semibold">Compliant. Simple. Court-Ready.</span>
                </p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Massachusetts court forms, federal court filings, and self-representation help powered by AI legal research and case automation tools.
                </p>
              </div>
              
              <div className="space-y-4">
                {/* For Individuals (Pro Se Litigants) */}
                <Button
                  size="lg"
                  onClick={() => window.location.href = "/file-document"}
                  className="coral-button w-full px-8 py-4 text-lg font-semibold"
                >
                  <Users className="mr-3 h-5 w-5" />
                  File My Case - For Individuals
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>

                {/* For Legal Professionals */}
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.href = "/pricing"}
                  className="w-full border-2 border-[#FF5A5F] text-[#FF5A5F] hover:bg-[#FF5A5F] hover:text-white px-8 py-4 text-lg font-semibold"
                >
                  <Scale className="mr-3 h-5 w-5" />
                  Grow My Practice - For Attorneys
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 pt-8">
                <div className="text-sm text-gray-500">
                  <div className="font-semibold text-gray-900">50+ States Supported</div>
                  <div>Federal Court Compatible</div>
                </div>
                <div className="text-sm text-gray-500">
                  <div className="font-semibold text-gray-900">AES-256 Encrypted</div>
                  <div>GDPR & HIPAA Compliant</div>
                </div>
                <div className="text-sm text-gray-500">
                  <div className="font-semibold text-gray-900">200+ Templates</div>
                  <div>AI-Powered Forms</div>
                </div>
              </div>
            </div>

            {/* Right Side - Visual with Compass Animation */}
            <div className="relative scroll-section parallax" data-speed="0.3">
              <div className="relative z-10">
                {/* Compass Animation */}
                <div className="mb-8 text-center">
                  <div className="relative inline-block">
                    <div
                      className="w-64 h-64 mx-auto drop-shadow-2xl relative"
                      style={{
                        animation: 'rotate 20s linear infinite, scale 4s ease-in-out infinite',
                      }}
                    >
                      {/* CSS Compass */}
                      <div className="w-full h-full rounded-full border-8 border-gradient-to-r from-[#FF5A5F] via-[#3b82f6] to-[#8b5cf6] bg-gradient-to-br from-red-50 to-purple-50 relative overflow-hidden">
                        {/* Outer ring */}
                        <div className="absolute inset-4 rounded-full border-4 border-gray-300"></div>

                        {/* Compass needle */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-1 h-20 bg-gradient-to-t from-[#FF5A5F] to-[#3b82f6] rounded-full transform -translate-y-8"></div>
                          <div className="w-4 h-4 bg-gradient-to-br from-[#FF5A5F] to-[#8b5cf6] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                        </div>

                        {/* Cardinal directions */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-lg font-bold gradient-icon">N</div>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-lg font-bold gradient-icon">S</div>
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-lg font-bold gradient-icon">E</div>
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-lg font-bold gradient-icon">W</div>

                        {/* Scale icon in center */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-6">
                          <div className="w-8 h-6 bg-white rounded border border-gray-300 flex items-center justify-center">
                            <div className="text-xs text-gray-600">⚖️</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Tagline Overlay */}
                    <div className="mt-6">
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border inline-block">
                        <h3 className="text-xl font-bold text-[#FF5A5F] mb-1">
                          Navigate the Courts with Confidence
                        </h3>
                        <p className="text-gray-600 text-sm">
                          AI-powered legal guidance for every filing
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Feature Highlights */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="tier-card bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-4 text-center">
                      <CompassLogo size="w-12 h-12" className="mx-auto mb-3" />
                      <h3 className="font-semibold">Smart Documents</h3>
                      <p className="text-sm text-gray-600">AI-generated forms</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="tier-card bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-4 text-center">
                      <CompassLogo size="w-12 h-12" className="mx-auto mb-3" />
                      <h3 className="font-semibold">Emergency Filing</h3>
                      <p className="text-sm text-gray-600">TRO & injunctions</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="tier-card bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-4 text-center">
                      <CompassLogo size="w-12 h-12" className="mx-auto mb-3" />
                      <h3 className="font-semibold">AI Research</h3>
                      <p className="text-sm text-gray-600">Case law analysis</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="tier-card bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-4 text-center">
                      <CompassLogo size="w-12 h-12" className="mx-auto mb-3" />
                      <h3 className="font-semibold">Secure Filing</h3>
                      <p className="text-sm text-gray-600">Bank-grade security</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Background geometric shapes */}
              <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-[#FF5A5F]/20 to-transparent rounded-full blur-xl"></div>
                <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-br from-[#E0F7FF]/40 to-transparent rounded-full blur-lg"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-[#80CBC4]/30 to-transparent rounded-full blur-md"></div>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="scroll-indicator">
            <ChevronDown className="h-6 w-6 text-[#FF5A5F]" />
          </div>
        </div>
      </section>

      {/* Core Features Section - 3-Tier Layout */}
      <section ref={featuresRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to File Smarter
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose your tier and get AI-powered legal filing automation that grows with your practice
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Tier */}
            <Card className="tier-card tier-starter border-2 border-transparent hover:border-[#B3E5FC]">
              <CardHeader className="text-center pb-4">
                <CompassLogo size="w-16 h-16" className="mx-auto mb-4" />
                <CardTitle className="text-2xl">Get Filing Fast</CardTitle>
                <CardDescription className="text-lg">
                  No Hassle, No Guesswork
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">
                  Automate your filings with AI-powered templates for every court. Track deadlines, stay compliant, and file electronically in minutes.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    AI document engine for all 50 states + federal courts
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Smart document assembly & auto-populated client info
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    One-click e-filing with compliance checks
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Real-time rule updates & deadline tracking
                  </li>
                </ul>
                <Button className="coral-button w-full" onClick={handleLogin}>
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Professional Tier */}
            <Card className="tier-card tier-professional border-2 border-[#FF5A5F] relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-[#FF5A5F] text-white">Most Popular</Badge>
              </div>
              <CardHeader className="text-center pb-4">
                <CompassLogo size="w-16 h-16" className="mx-auto mb-4" />
                <CardTitle className="text-2xl">Level Up Your Practice</CardTitle>
                <CardDescription className="text-lg">
                  Work Smarter, Not Harder
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">
                  Take control of every case with predictive AI strategy, automated compliance monitoring, and organized evidence management.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    AI Legal Strategy Advisor & compliance monitor
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Evidence management & digital authentication
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Pro Se guidance for clients you support
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Predictive outcome modeling
                  </li>
                </ul>
                <Button className="coral-button w-full" onClick={handleLogin}>
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Tier */}
            <Card className="tier-card tier-enterprise border-2 border-transparent hover:border-[#7E57C2]">
              <CardHeader className="text-center pb-4">
                <div className="geometric-icon w-16 h-16 mx-auto mb-4" style={{borderRadius: "70% 30% 30% 70%"}}>
                  <Search className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Powerful Automation</CardTitle>
                <CardDescription className="text-lg">
                  For the Whole Firm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">
                  From multi-party coordination to advanced analytics, get full visibility and control over your cases with AI-driven insights.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Advanced legal research & auto-briefs
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Multi-party collaboration & secure client portals
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Financial impact calculator & analytics dashboard
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Settlement optimization & ROI tracking
                  </li>
                </ul>
                <Button className="coral-button w-full" onClick={handleLogin}>
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Special Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 scroll-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Stand Out With LegalEaseFile Extras
            </h2>
            <p className="text-xl text-gray-600">
              Handle emergencies, pro bono work, and secure filings with features designed to give your practice an edge
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="tier-card bg-white hover:shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="geometric-icon w-16 h-16 mx-auto mb-4" style={{borderRadius: "60% 40% 40% 60%"}}>
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Emergency Filing Engine</h3>
                <p className="text-gray-600">
                  TROs, injunctions, and expedited motions filed in minutes, not hours
                </p>
              </CardContent>
            </Card>
            
            <Card className="tier-card bg-white hover:shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="geometric-icon w-16 h-16 mx-auto mb-4" style={{borderRadius: "40% 60% 60% 40%"}}>
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Pro Bono Directory</h3>
                <p className="text-gray-600">
                  Direct aid for indigent cases and comprehensive legal assistance network
                </p>
              </CardContent>
            </Card>
            
            <Card className="tier-card bg-white hover:shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="geometric-icon w-16 h-16 mx-auto mb-4" style={{borderRadius: "20% 80% 20% 80%"}}>
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Templates</h3>
                <p className="text-gray-600">
                  Guided completion with automatic compliance checks and formatting
                </p>
              </CardContent>
            </Card>
            
            <Card className="tier-card bg-white hover:shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="geometric-icon w-16 h-16 mx-auto mb-4" style={{borderRadius: "80% 20% 80% 20%"}}>
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">MPC AI Assistant</h3>
                <p className="text-gray-600">
                  Secure multi-party computation with AES-256 encryption
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Competitive Positioning */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Advantage in the Legal Tech Market
            </h2>
            <p className="text-xl text-gray-600">
              See how LegalEaseFile compares to other legal technology solutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="tier-card border-2 border-[#FF5A5F]/20">
              <CardHeader>
                <CardTitle className="text-xl">Vs. Harvey AI / Spellbook</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  <span className="font-semibold text-[#FF5A5F]">Enterprise power, without the enterprise cost</span>
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Affordable pricing for solo attorneys</li>
                  <li>• Complete e-filing integration</li>
                  <li>• No complex implementation required</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="tier-card border-2 border-[#FF5A5F]/20">
              <CardHeader>
                <CardTitle className="text-xl">Vs. Clio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  <span className="font-semibold text-[#FF5A5F]">Built for litigation first</span> — not general practice management
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• AI-powered document generation</li>
                  <li>• Automated compliance checking</li>
                  <li>• Emergency filing capabilities</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="tier-card border-2 border-[#FF5A5F]/20">
              <CardHeader>
                <CardTitle className="text-xl">Vs. AI.Law / Courtroom5</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  <span className="font-semibold text-[#FF5A5F]">True end-to-end solution</span>, not just form prep
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Full e-filing integration</li>
                  <li>• Advanced legal research engine</li>
                  <li>• Multi-party case coordination</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 scroll-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Affordable Plans for Every Legal Professional
            </h2>
            <p className="text-xl text-gray-600">
              Plans start at just <span className="font-semibold text-[#FF5A5F]">$29/month</span> — with a 7-day free trial included
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="tier-card bg-white">
              <CardHeader>
                <CardTitle className="text-center">Starter</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold">$29</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <CardDescription className="text-center">Best for Pro Se & Solo Attorneys</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="coral-button w-full mb-4" onClick={handleLogin}>Start Free Trial</Button>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-2" />Core document assembly</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-2" />Basic e-filing integration</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-2" />Deadline tracking</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="tier-card bg-white border-2 border-[#FF5A5F] relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-[#FF5A5F] text-white">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-center">Professional</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold">$89</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <CardDescription className="text-center">Perfect for Solo Practitioners</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="coral-button w-full mb-4" onClick={handleLogin}>Start Free Trial</Button>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-2" />Unlimited document assembly</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-2" />AI strategy recommendations</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-2" />Client portal & case management</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="tier-card bg-white">
              <CardHeader>
                <CardTitle className="text-center">Small Firm Pro</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold">$159</span>
                  <span className="text-gray-600">/user/month</span>
                </div>
                <CardDescription className="text-center">For Small Firms</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="coral-button w-full mb-4" onClick={handleLogin}>Start Free Trial</Button>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-2" />Advanced AI research</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-2" />Evidence management</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-2" />Multi-user collaboration</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="tier-card bg-white">
              <CardHeader>
                <CardTitle className="text-center">Enterprise</CardTitle>
                <div className="text-center">
                  <span className="text-2xl font-bold">Custom</span>
                  <span className="text-gray-600"> Pricing</span>
                </div>
                <CardDescription className="text-center">For Large Firms</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full mb-4 border-[#FF5A5F] text-[#FF5A5F] hover:bg-[#FF5A5F] hover:text-white">Contact Sales</Button>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-2" />White-label options</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-2" />Custom integrations</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-[#FF5A5F] mr-2" />24/7 enterprise support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Compliance You Can Trust
            </h2>
            <p className="text-xl text-gray-600">
              Built to meet the highest security and compliance standards
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="geometric-icon w-16 h-16 mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">AES-256 Encrypted</h3>
              <p className="text-sm text-gray-600">Bank-grade encryption for all data</p>
            </div>
            <div className="text-center">
              <div className="geometric-icon w-16 h-16 mx-auto mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">GDPR Compliant</h3>
              <p className="text-sm text-gray-600">Full privacy protection</p>
            </div>
            <div className="text-center">
              <div className="geometric-icon w-16 h-16 mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">HIPAA Compliant</h3>
              <p className="text-sm text-gray-600">Healthcare data protection</p>
            </div>
            <div className="text-center">
              <div className="geometric-icon w-16 h-16 mx-auto mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Court Standards</h3>
              <p className="text-sm text-gray-600">Built for e-filing compliance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#FF5A5F] to-[#FF4449] text-white scroll-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Take Control of Your Legal Documents
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Stop struggling with outdated tools. Start filing smarter with LegalEaseFile — the only AI platform that combines 
            document generation, compliance checking, and e-filing in one solution.
          </p>
          <Button 
            size="lg" 
            onClick={handleLogin}
            className="bg-white text-[#FF5A5F] hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
          >
            Start Your Free 7-Day Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm mt-4 opacity-75">No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="geometric-icon w-8 h-8">
                  <Scale className="h-4 w-4" />
                </div>
                <span className="text-lg font-semibold">LegalEaseFile</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered legal filing platform for modern attorneys and self-represented litigants.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/templates" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="/integrations" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/glossary" className="hover:text-white transition-colors">Legal Glossary</a></li>
                <li><a href="/guides" className="hover:text-white transition-colors">Filing Guides</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2025 LegalEaseFile. All rights reserved. Massachusetts Federal District Court document filing assistance.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}