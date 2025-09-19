import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Scale, Shield, Clock, Users, FileText, Zap, ArrowRight, Brain, Search, Lightbulb, ChevronDown } from "lucide-react";

// DEPLOYMENT UPDATE: Force cache refresh v2.0
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

          .gradient-icon {
            background: linear-gradient(135deg, #FF5A5F 0%, #E0F7FF 50%, #B3E5FC 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .split-hero {
            display: grid;
            grid-template-columns: 50% 50%;
            height: 100vh;
            transition: all 0.5s ease;
          }

          /* Desktop - Large screens (1200px+) */
          @media (min-width: 1200px) {
            .split-hero {
              grid-template-columns: 50% 50%;
              height: 100vh;
            }
            .hero-left {
              position: relative;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
              background: transparent;
            }
            .hero-right {
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 3rem;
            }
          }

          /* Desktop - Standard (1024px - 1199px) */
          @media (min-width: 1024px) and (max-width: 1199px) {
            .split-hero {
              grid-template-columns: 50% 50%;
              height: 100vh;
            }
            .hero-left {
              position: relative;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
              background: transparent;
            }
            .hero-right {
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 2.5rem;
            }
          }

          /* Tablet - Portrait (768px - 1023px) */
          @media (min-width: 768px) and (max-width: 1023px) {
            .split-hero {
              grid-template-columns: 1fr;
              height: auto;
            }
            .hero-left {
              position: relative;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
              background: transparent;
              min-height: 50vh;
              order: 1;
            }
            .hero-right {
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 2rem;
              min-height: 50vh;
              order: 2;
            }
          }

          /* Mobile - Large (640px - 767px) */
          @media (min-width: 640px) and (max-width: 767px) {
            .split-hero {
              grid-template-columns: 1fr;
              height: auto;
            }
            .hero-left {
              position: relative;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
              background: transparent;
              min-height: 40vh;
              order: 1;
            }
            .hero-right {
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 1.5rem;
              min-height: 60vh;
              order: 2;
            }
          }

          /* Mobile - Small (below 640px) */
          @media (max-width: 639px) {
            .split-hero {
              grid-template-columns: 1fr;
              height: auto;
            }
            .hero-left {
              position: relative;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
              background: transparent;
              min-height: 35vh;
              order: 1;
            }
            .hero-right {
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 1rem;
              min-height: 65vh;
              order: 2;
            }
          }

          /* Default styles for all screen sizes */
          .hero-left {
            position: relative;
            overflow: hidden;
            background: transparent;
          }

          .hero-left img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
          }

          .hero-right {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }


          .nav-mini {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
          }

          .split-hero:hover .nav-mini {
            opacity: 1;
            transform: translateY(0);
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
            display: flex;
            flex-direction: column;
            height: 100%;
          }

          .tier-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }

          .card-content-flex {
            flex: 1;
            display: flex;
            flex-direction: column;
          }

          .card-content-flex > *:last-child {
            margin-top: auto;
            padding-top: 1rem;
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
          
          .icon-wrapper {
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            margin: 0 auto;
          }

          .icon-wrapper:hover {
            transform: scale(1.1);
          }

          .icon-large {
            width: 48px;
            height: 48px;
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

          @keyframes slideInFromLeft {
            from {
              opacity: 0;
              transform: translateX(-100px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideInFromRight {
            from {
              opacity: 0;
              transform: translateX(100px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideInFromBottom {
            from {
              opacity: 0;
              transform: translateY(50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-slide-in-left {
            animation: slideInFromLeft 0.8s ease-out forwards;
          }

          .animate-slide-in-right {
            animation: slideInFromRight 0.8s ease-out forwards;
          }

          .animate-slide-in-bottom {
            animation: slideInFromBottom 0.6s ease-out forwards;
          }

          .section-enter {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
          }

          .section-enter.visible {
            opacity: 1;
            transform: translateY(0);
          }
        `
      }} />

      {/* Navigation */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              {/* LegalEaseFile Black Logo */}
              <img
                src="/assets/images/logo-black.png"
                alt="LegalEaseFile"
                className="h-8 w-auto"
              />
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

      {/* Hero Section - Split Screen with Clear Division */}
      <section ref={heroRef} className="relative pt-16">
        <div className="split-hero">
          {/* Left Side - Motion Graphic (50% width, full height) */}
          <div className="hero-left animate-slide-in-left">
            <img
              src="/assets/images/compass-courthouse.gif"
              alt="LegalEaseFile AI-Powered Legal Filing Animation"
              className="hero-image"
            />

            {/* Overlay navigation buttons */}
            <div className="nav-mini absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
              <Button
                size="sm"
                onClick={() => window.location.href = "/dashboard"}
                className="bg-white/90 text-[#FF5A5F] hover:bg-white backdrop-blur-sm"
              >
                Dashboard
              </Button>
              <Button
                size="sm"
                onClick={() => window.location.href = "/file-document"}
                className="bg-white/90 text-[#FF5A5F] hover:bg-white backdrop-blur-sm"
              >
                File Now
              </Button>
            </div>
          </div>

          {/* Right Side - Text Content (50% width, full height) */}
          <div className="hero-right bg-white animate-slide-in-right">
            <div className="w-full max-w-xl mx-auto space-y-6">
              <div>
                <Badge className="mb-4 bg-[#FF5A5F]/10 text-[#FF5A5F] hover:bg-[#FF5A5F]/20 border-[#FF5A5F]/20">
                  AI-Powered Legal Filing Platform
                </Badge>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                  AI-Powered Legal Filing for <span className="text-[#FF5A5F]">Pro Se Litigants</span> & Small Law Firms
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-3 leading-relaxed">
                  <span className="font-semibold">Compliant. Simple. Court-Ready.</span>
                </p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-6 leading-relaxed">
                  Massachusetts court forms, federal court filings, and self-representation help powered by AI legal research and case automation tools.
                </p>
              </div>

              <div className="space-y-3">
                {/* For Individuals (Pro Se Litigants) */}
                <Button
                  size="lg"
                  onClick={() => window.location.href = "/file-document"}
                  className="coral-button w-full px-6 py-3 text-base font-semibold"
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
                  className="w-full border-2 border-[#FF5A5F] text-[#FF5A5F] hover:bg-[#FF5A5F] hover:text-white px-6 py-3 text-base font-semibold"
                >
                  <Scale className="mr-3 h-5 w-5" />
                  Grow My Practice - For Attorneys
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-[#FF5A5F]" />
                  <span className="font-semibold text-gray-900">4 States Supported</span>
                  <span>• Federal Court Compatible</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-[#FF5A5F]" />
                  <span className="font-semibold text-gray-900">AES-256 Encrypted</span>
                  <span>• GDPR & HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4 text-[#FF5A5F]" />
                  <span className="font-semibold text-gray-900">Essential Templates</span>
                  <span>• AI-Powered Forms</span>
                </div>
              </div>

              {/* Secondary navigation buttons */}
              <div className="pt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.location.href = "/emergency-filing"}
                  className="border-[#FF5A5F] text-[#FF5A5F] hover:bg-[#FF5A5F] hover:text-white"
                >
                  Emergency Filing
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.location.href = "/pro-bono-search"}
                  className="border-[#FF5A5F] text-[#FF5A5F] hover:bg-[#FF5A5F] hover:text-white"
                >
                  Find Legal Help
                </Button>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-6 w-6 gradient-icon" />
          </div>
        </div>
      </section>

      {/* Core Features Section - 3-Tier Layout */}
      <section ref={featuresRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white section-enter scroll-section">
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
                <img
                  src="/assets/images/compass-courthouse.gif"
                  alt="LegalEaseFile AI-Powered Legal Filing"
                  className="w-16 h-16 mx-auto mb-4 object-contain"
                />
                <CardTitle className="text-2xl">Get Filing Fast</CardTitle>
                <CardDescription className="text-lg">
                  No Hassle, No Guesswork
                </CardDescription>
              </CardHeader>
              <CardContent className="card-content-flex">
                <div>
                  <p className="text-gray-700 mb-6">
                    Automate your filings with AI-powered templates for every court. Track deadlines, stay compliant, and file electronically in minutes.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 gradient-icon mr-3 flex-shrink-0" />
                      AI document engine for CA, NY, TX, FL + federal courts
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 gradient-icon mr-3 flex-shrink-0" />
                      Smart document assembly & auto-populated client info
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 gradient-icon mr-3 flex-shrink-0" />
                      One-click e-filing with compliance checks
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 gradient-icon mr-3 flex-shrink-0" />
                      Real-time rule updates & deadline tracking
                    </li>
                  </ul>
                </div>
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
                <img
                  src="/assets/images/compass-courthouse.gif"
                  alt="LegalEaseFile AI-Powered Legal Filing"
                  className="w-16 h-16 mx-auto mb-4 object-contain"
                />
                <CardTitle className="text-2xl">Level Up Your Practice</CardTitle>
                <CardDescription className="text-lg">
                  Work Smarter, Not Harder
                </CardDescription>
              </CardHeader>
              <CardContent className="card-content-flex">
                <div>
                  <p className="text-gray-700 mb-6">
                    Take control of every case with predictive AI strategy, automated compliance monitoring, and organized evidence management.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 gradient-icon mr-3 flex-shrink-0" />
                      AI Legal Strategy Advisor & compliance monitor
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 gradient-icon mr-3 flex-shrink-0" />
                      Evidence management & digital authentication
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 gradient-icon mr-3 flex-shrink-0" />
                      Pro Se guidance for clients you support
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 gradient-icon mr-3 flex-shrink-0" />
                      Predictive outcome modeling
                    </li>
                  </ul>
                </div>
                <Button className="coral-button w-full" onClick={handleLogin}>
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Tier */}
            <Card className="tier-card tier-enterprise border-2 border-transparent hover:border-[#7E57C2]">
              <CardHeader className="text-center pb-4">
                <div className="icon-wrapper w-16 h-16 mb-4">
                  <Search className="icon-large gradient-icon" />
                </div>
                <CardTitle className="text-2xl">Powerful Automation</CardTitle>
                <CardDescription className="text-lg">
                  For the Whole Firm
                </CardDescription>
              </CardHeader>
              <CardContent className="card-content-flex">
                <div>
                  <p className="text-gray-700 mb-6">
                    From multi-party coordination to advanced analytics, get full visibility and control over your cases with AI-driven insights.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 gradient-icon mr-3 flex-shrink-0" />
                      Advanced legal research & auto-briefs
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 gradient-icon mr-3 flex-shrink-0" />
                      Multi-party collaboration & secure client portals
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 gradient-icon mr-3 flex-shrink-0" />
                      Financial impact calculator & analytics dashboard
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 gradient-icon mr-3 flex-shrink-0" />
                      Settlement optimization & ROI tracking
                    </li>
                  </ul>
                </div>
                <Button className="coral-button w-full" onClick={handleLogin}>
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Special Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 section-enter scroll-section">
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
                <div className="icon-wrapper w-16 h-16 mb-4">
                  <Zap className="icon-large gradient-icon" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Emergency Filing Engine</h3>
                <p className="text-gray-600">
                  TROs, injunctions, and expedited motions filed in minutes, not hours
                </p>
              </CardContent>
            </Card>
            
            <Card className="tier-card bg-white hover:shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="icon-wrapper w-16 h-16 mb-4">
                  <Users className="icon-large gradient-icon" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Pro Bono Directory</h3>
                <p className="text-gray-600">
                  Direct aid for indigent cases and comprehensive legal assistance network
                </p>
              </CardContent>
            </Card>
            
            <Card className="tier-card bg-white hover:shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="icon-wrapper w-16 h-16 mb-4">
                  <FileText className="icon-large gradient-icon" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Templates</h3>
                <p className="text-gray-600">
                  Guided completion with automatic compliance checks and formatting
                </p>
              </CardContent>
            </Card>
            
            <Card className="tier-card bg-white hover:shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="icon-wrapper w-16 h-16 mb-4">
                  <Shield className="icon-large gradient-icon" />
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white section-enter scroll-section">
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
      <section ref={pricingRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 section-enter scroll-section">
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
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 gradient-icon mr-2" />Core document assembly</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 gradient-icon mr-2" />Basic e-filing integration</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 gradient-icon mr-2" />Deadline tracking</li>
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
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 gradient-icon mr-2" />Unlimited document assembly</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 gradient-icon mr-2" />AI strategy recommendations</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 gradient-icon mr-2" />Client portal & case management</li>
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
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 gradient-icon mr-2" />Advanced AI research</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 gradient-icon mr-2" />Evidence management</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 gradient-icon mr-2" />Multi-user collaboration</li>
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
                <Button variant="outline" onClick={() => window.location.href = "/auth"} className="w-full mb-4 border-[#FF5A5F] text-[#FF5A5F] hover:bg-[#FF5A5F] hover:text-white">Contact Sales</Button>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 gradient-icon mr-2" />White-label options</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 gradient-icon mr-2" />Custom integrations</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 gradient-icon mr-2" />24/7 enterprise support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white section-enter scroll-section">
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
              <div className="icon-wrapper w-16 h-16 mb-4">
                <Shield className="icon-large gradient-icon" />
              </div>
              <h3 className="font-semibold mb-2">AES-256 Encrypted</h3>
              <p className="text-sm text-gray-600">Bank-grade encryption for all data</p>
            </div>
            <div className="text-center">
              <div className="icon-wrapper w-16 h-16 mb-4">
                <CheckCircle className="icon-large gradient-icon" />
              </div>
              <h3 className="font-semibold mb-2">GDPR Compliant</h3>
              <p className="text-sm text-gray-600">Full privacy protection</p>
            </div>
            <div className="text-center">
              <div className="icon-wrapper w-16 h-16 mb-4">
                <Users className="icon-large gradient-icon" />
              </div>
              <h3 className="font-semibold mb-2">HIPAA Compliant</h3>
              <p className="text-sm text-gray-600">Healthcare data protection</p>
            </div>
            <div className="text-center">
              <div className="icon-wrapper w-16 h-16 mb-4">
                <FileText className="icon-large gradient-icon" />
              </div>
              <h3 className="font-semibold mb-2">Court Standards</h3>
              <p className="text-sm text-gray-600">Built for e-filing compliance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#FF5A5F] to-[#FF4449] text-white section-enter scroll-section">
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
                <img
                  src="/assets/images/logo-black.png"
                  alt="LegalEaseFile"
                  className="h-6 w-auto brightness-0 invert"
                />
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
                <li><a href="/template-form" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/emergency-filing" className="hover:text-white transition-colors">Emergency Filing</a></li>
                <li><a href="/pro-bono-search" className="hover:text-white transition-colors">Pro Bono Search</a></li>
                <li><a href="/case-management" className="hover:text-white transition-colors">Case Management</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/auth" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/mpc-assistant" className="hover:text-white transition-colors">MPC Assistant</a></li>
                <li><a href="/subscribe" className="hover:text-white transition-colors">Subscribe</a></li>
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