import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Scale, Shield, Clock, Users, FileText, Zap, ArrowRight, Brain, Search, Lightbulb, Target, Heart, Award } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  useEffect(() => {
    // SEO Meta tags
    document.title = "About LegalEaseFile | Built for Modern Law Firms";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about LegalEaseFile — our mission to simplify legal document management. Built for attorneys, designed for clients, powered by security and innovation.');
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
          
          .team-card {
            transition: all 0.3s ease;
            border: 1px solid transparent;
          }
          
          .team-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
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
              <Link href="/features" className="text-gray-700 hover:text-[#FF5A5F] transition-colors">Features</Link>
              <Link href="/pricing" className="text-gray-700 hover:text-[#FF5A5F] transition-colors">Pricing</Link>
              <Link href="/blog" className="text-gray-700 hover:text-[#FF5A5F] transition-colors">Resources</Link>
              <Link href="/about" className="text-[#FF5A5F] font-medium">About</Link>
            </nav>
            
            <Button onClick={handleGetStarted} className="coral-button">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 scroll-section">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-[#FF5A5F]/10 text-[#FF5A5F] hover:bg-[#FF5A5F]/20 border-[#FF5A5F]/20">
            About LegalEaseFile
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Reinventing Legal Filing with AI
          </h1>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            We empower attorneys and self-represented litigants to file confidently, save time, and stay compliant. 
            Our mission is to democratize access to professional-grade <span className="font-semibold text-[#FF5A5F]">legal technology</span> 
            and make the law accessible to everyone.
          </p>
          
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="coral-button px-8 py-4 text-lg"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                LegalEaseFile was founded on the belief that everyone deserves access to professional-grade legal filing tools. 
                Whether you're a solo practitioner, a large law firm, or representing yourself in court, our AI-powered platform 
                levels the playing field.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We're building the future of legal technology — one that prioritizes accessibility, security, and compliance 
                without sacrificing power or sophistication. Our <span className="font-semibold text-[#FF5A5F]">AI legal platform</span> 
                combines cutting-edge automation with human-centered design.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#FF5A5F]">50+</div>
                  <div className="text-sm text-gray-600">States Supported</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#FF5A5F]">10,000+</div>
                  <div className="text-sm text-gray-600">Documents Filed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#FF5A5F]">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="geometric-icon w-32 h-32 mx-auto mb-8" style={{borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%"}}>
                <Target className="h-16 w-16" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="team-card bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="geometric-icon w-12 h-12 mx-auto mb-3" style={{borderRadius: "50% 10% 50% 10%"}}>
                      <Heart className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">Accessibility</h3>
                    <p className="text-sm text-gray-600">Legal tools for everyone</p>
                  </CardContent>
                </Card>
                
                <Card className="team-card bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="geometric-icon w-12 h-12 mx-auto mb-3" style={{borderRadius: "10% 50% 10% 50%"}}>
                      <Shield className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">Security</h3>
                    <p className="text-sm text-gray-600">Bank-grade protection</p>
                  </CardContent>
                </Card>
                
                <Card className="team-card bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="geometric-icon w-12 h-12 mx-auto mb-3" style={{borderRadius: "70% 30% 30% 70%"}}>
                      <Brain className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">Innovation</h3>
                    <p className="text-sm text-gray-600">AI-powered automation</p>
                  </CardContent>
                </Card>
                
                <Card className="team-card bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="geometric-icon w-12 h-12 mx-auto mb-3" style={{borderRadius: "30% 70% 30% 70%"}}>
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">Compliance</h3>
                    <p className="text-sm text-gray-600">Court-ready filings</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 scroll-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Who We Serve
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From pro se litigants to enterprise law firms, our <span className="font-semibold text-[#FF5A5F]">mission-driven legal tech company</span> 
              serves everyone who needs professional-grade legal filing tools.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="team-card bg-white">
              <CardHeader className="text-center">
                <div className="geometric-icon w-16 h-16 mx-auto mb-4" style={{borderRadius: "50% 10% 50% 10%"}}>
                  <Users className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">Pro Se Litigants</CardTitle>
                <CardDescription>
                  Self-represented individuals who need professional-grade filing tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Step-by-step guidance in plain English</li>
                  <li>• Automated compliance checking</li>
                  <li>• Affordable professional-grade tools</li>
                  <li>• Court appearance preparation</li>
                  <li>• Emergency filing support</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="team-card bg-white">
              <CardHeader className="text-center">
                <div className="geometric-icon w-16 h-16 mx-auto mb-4" style={{borderRadius: "10% 50% 10% 50%"}}>
                  <FileText className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">Solo Attorneys & Small Firms</CardTitle>
                <CardDescription>
                  Legal professionals who need enterprise power without enterprise cost
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Advanced AI legal research</li>
                  <li>• Client portal and case management</li>
                  <li>• Evidence management suite</li>
                  <li>• Multi-party collaboration</li>
                  <li>• Predictive case analytics</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="team-card bg-white">
              <CardHeader className="text-center">
                <div className="geometric-icon w-16 h-16 mx-auto mb-4" style={{borderRadius: "70% 30% 30% 70%"}}>
                  <Award className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">Enterprise Law Firms</CardTitle>
                <CardDescription>
                  Large practices that need custom solutions and dedicated support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Custom integrations and white-labeling</li>
                  <li>• Advanced analytics and reporting</li>
                  <li>• Dedicated infrastructure</li>
                  <li>• 24/7 enterprise support</li>
                  <li>• Compliance and security auditing</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why We Built LegalEaseFile */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why We Built LegalEaseFile
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The legal industry deserves better tools. We're here to provide them.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <Card className="team-card bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader>
                  <CardTitle className="text-xl text-red-800">The Problem</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-3 mt-1">•</span>
                      Legal filing is complex, time-consuming, and error-prone
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-3 mt-1">•</span>
                      Existing tools are either too expensive or too limited
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-3 mt-1">•</span>
                      Court rules change frequently, causing compliance issues
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-3 mt-1">•</span>
                      Pro se litigants struggle without professional guidance
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-3 mt-1">•</span>
                      Small firms can't afford enterprise legal software
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="team-card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader>
                  <CardTitle className="text-xl text-green-800">Our Solution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      AI-powered document generation and compliance checking
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Affordable pricing that scales with your practice
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Real-time rule updates and automatic compliance
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Step-by-step guidance for self-represented litigants
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Enterprise features at small firm prices
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 scroll-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Team
            </h2>
            <p className="text-xl text-gray-600">
              A diverse group of technologists, legal experts, and innovators
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="team-card bg-white text-center">
              <CardContent className="p-8">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[#FF5A5F] to-[#E0F7FF] rounded-full flex items-center justify-content border-4 border-white shadow-lg">
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                    <Users className="h-8 w-8 text-gray-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Engineering Team</h3>
                <p className="text-gray-600 mb-4">
                  Former Google, Microsoft, and legal tech veterans building the future of legal automation
                </p>
                <Badge className="bg-[#FF5A5F]/10 text-[#FF5A5F]">AI & Legal Tech</Badge>
              </CardContent>
            </Card>
            
            <Card className="team-card bg-white text-center">
              <CardContent className="p-8">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[#FF5A5F] to-[#80CBC4] rounded-full flex items-center justify-content border-4 border-white shadow-lg">
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                    <Scale className="h-8 w-8 text-gray-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Legal Advisory</h3>
                <p className="text-gray-600 mb-4">
                  Practicing attorneys and legal scholars ensuring our platform meets real-world needs
                </p>
                <Badge className="bg-[#80CBC4]/20 text-[#80CBC4]">Legal Expertise</Badge>
              </CardContent>
            </Card>
            
            <Card className="team-card bg-white text-center">
              <CardContent className="p-8">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[#FF5A5F] to-[#7E57C2] rounded-full flex items-center justify-content border-4 border-white shadow-lg">
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-gray-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Security & Compliance</h3>
                <p className="text-gray-600 mb-4">
                  Cybersecurity and compliance experts ensuring your data is protected and court-ready
                </p>
                <Badge className="bg-[#7E57C2]/20 text-[#7E57C2]">Security First</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trusted by Legal Professionals */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Legal Professionals Nationwide
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of attorneys and self-represented litigants who trust LegalEaseFile
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <Card className="team-card bg-gray-50 border-gray-200">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="geometric-icon w-12 h-12" style={{borderRadius: "50% 10% 50% 10%"}}>
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-gray-700 italic mb-4">
                        "LegalEaseFile helped me file a TRO overnight — without a lawyer. The step-by-step guidance 
                        made what seemed impossible, manageable."
                      </p>
                      <div className="font-semibold">Pro Se Litigant</div>
                      <div className="text-sm text-gray-500">Texas Federal Court</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="team-card bg-gray-50 border-gray-200">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="geometric-icon w-12 h-12" style={{borderRadius: "10% 50% 10% 50%"}}>
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-gray-700 italic mb-4">
                        "Our small firm saved 15+ hours per week on filings. The AI research engine has completely 
                        transformed how we prepare cases."
                      </p>
                      <div className="font-semibold">Sarah Chen, Attorney</div>
                      <div className="text-sm text-gray-500">Chen & Associates, California</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="geometric-icon w-16 h-16 mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">AES-256 Encrypted</h3>
              <p className="text-sm text-gray-600">Bank-grade security standards</p>
            </div>
            
            <div className="text-center">
              <div className="geometric-icon w-16 h-16 mx-auto mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">GDPR & HIPAA</h3>
              <p className="text-sm text-gray-600">Full compliance protection</p>
            </div>
            
            <div className="text-center">
              <div className="geometric-icon w-16 h-16 mx-auto mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Court Compatible</h3>
              <p className="text-sm text-gray-600">Built for e-filing standards</p>
            </div>
            
            <div className="text-center">
              <div className="geometric-icon w-16 h-16 mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-600">Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#FF5A5F] to-[#FF4449] text-white scroll-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Legal Practice?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of legal professionals who trust LegalEaseFile for their filing needs. 
            Experience the power of AI-driven legal automation with our risk-free trial.
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="bg-white text-[#FF5A5F] hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
          >
            Start Your Free Trial Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm mt-4 opacity-75">No credit card required • 7-day free trial • Cancel anytime</p>
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
                About legal document software, legal technology company, law firm software provider, modern software for attorneys and clients.
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
              © 2025 LegalEaseFile. All rights reserved. Story behind LegalEaseFile, mission-driven legal tech company, modern software for attorneys and clients.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}