import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Scale, Shield, Clock, Users, FileText, Zap, ArrowRight, X, Star } from "lucide-react";
import { Link } from "wouter";

export default function Pricing() {
  useEffect(() => {
    // SEO Meta tags
    document.title = "LegalEaseFile Pricing | Affordable Legal Software for Lawyers & Firms";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Choose the right LegalEaseFile plan. Affordable pricing for solo attorneys, small law firms, and enterprise practices. Start free today.');
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

  const handleContactSales = () => {
    window.location.href = "/contact";
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
          
          .pricing-card {
            transition: all 0.3s ease;
            border: 2px solid transparent;
          }
          
          .pricing-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }
          
          .pricing-card.featured {
            border-color: #FF5A5F;
            transform: scale(1.05);
            box-shadow: 0 20px 40px rgba(255, 90, 95, 0.2);
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
              <Link href="/pricing" className="text-[#FF5A5F] font-medium">Pricing</Link>
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
            Simple, Transparent Pricing for Every Legal Professional
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing for Every Practice Size
          </h1>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Choose the plan that fits your practice. No hidden fees. Start free and upgrade anytime. 
            <span className="font-semibold text-[#FF5A5F]">Legal software pricing</span> that scales with your success.
          </p>
          
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="coral-button px-8 py-4 text-lg"
          >
            👉 Start Free Today
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 scroll-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            
            {/* Starter Plan */}
            <Card className="pricing-card bg-white">
              <CardHeader className="text-center pb-8">
                <div className="geometric-icon w-16 h-16 mx-auto mb-4" style={{borderRadius: "50% 10% 50% 10%"}}>
                  <FileText className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-bold">Starter – $29/month</CardTitle>
                <CardDescription className="text-lg mt-2">
                  Best for Pro Se Litigants & Solo Attorneys starting out
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Core document assembly (50+ essential forms)
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Basic e-filing integration (up to 3 filings/month)
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Deadline tracking & filing reminders
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Step-by-step guidance in plain English
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Secure cloud storage
                  </li>
                </ul>
                
                <Button onClick={handleGetStarted} className="coral-button w-full">
                  Start Free →
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan - Featured */}
            <Card className="pricing-card featured bg-white relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-[#FF5A5F] text-white px-4 py-2">
                  <Star className="w-4 h-4 mr-1" />
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-8 pt-6">
                <div className="geometric-icon w-16 h-16 mx-auto mb-4" style={{borderRadius: "10% 50% 10% 50%"}}>
                  <Users className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-bold">Professional – $89/month</CardTitle>
                <CardDescription className="text-lg mt-2">
                  Perfect for Solo Practitioners & Small Teams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Unlimited document assembly (200+ forms)
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Unlimited e-filing integration across states
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Secure client portal & case management tools
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    AI-powered legal strategy recommendations
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Basic legal research engine
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Priority email + phone support
                  </li>
                </ul>
                
                <Button onClick={handleGetStarted} className="coral-button w-full">
                  Start Free →
                </Button>
              </CardContent>
            </Card>

            {/* Small Firm Pro Plan */}
            <Card className="pricing-card bg-white">
              <CardHeader className="text-center pb-8">
                <div className="geometric-icon w-16 h-16 mx-auto mb-4" style={{borderRadius: "70% 30% 30% 70%"}}>
                  <Zap className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-bold">Small Firm Pro – $159/user/month</CardTitle>
                <CardDescription className="text-lg mt-2">
                  For Small Firms that Need Power & Collaboration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 font-medium">Everything in Professional, plus:</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Advanced AI legal research + auto-generated briefs
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Evidence management suite with auto-indexing
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Multi-user collaboration tools
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Advanced analytics dashboard
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Dedicated account manager
                  </li>
                </ul>
                
                <Button onClick={handleGetStarted} className="coral-button w-full">
                  Start Free →
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="pricing-card bg-white">
              <CardHeader className="text-center pb-8">
                <div className="geometric-icon w-16 h-16 mx-auto mb-4" style={{borderRadius: "30% 70% 30% 70%"}}>
                  <Shield className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-bold">Enterprise – Custom Pricing</CardTitle>
                <CardDescription className="text-lg mt-2">
                  For Large Firms & Nationwide Practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    White-label options
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Dedicated infrastructure & security compliance
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Custom integrations with existing systems
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    Advanced analytics & reporting suite
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                    24/7 enterprise support
                  </li>
                </ul>
                
                <Button 
                  onClick={handleContactSales} 
                  variant="outline"
                  className="w-full border-[#FF5A5F] text-[#FF5A5F] hover:bg-[#FF5A5F] hover:text-white"
                >
                  Contact Sales →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Legal Aid Plan */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50 scroll-section">
        <div className="max-w-4xl mx-auto">
          <Card className="pricing-card bg-white border-2 border-blue-200">
            <CardHeader className="text-center">
              <div className="geometric-icon w-16 h-16 mx-auto mb-4" style={{borderRadius: "40% 60% 60% 40%"}}>
                <Users className="h-8 w-8" />
              </div>
              <CardTitle className="text-3xl font-bold">Legal Aid – $39/month (flat rate)</CardTitle>
              <CardDescription className="text-lg mt-2">
                Support for Non-Profits & Legal Aid Providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                      Unlimited client accounts
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                      Bulk case processing
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                      Pro bono support directory
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                      Grant reporting tools
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                      Staff training modules
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-[#FF5A5F] mr-3 flex-shrink-0" />
                      Dedicated non-profit support
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <Button onClick={handleContactSales} className="coral-button px-8 py-3">
                  Apply for Legal Aid Plan →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* All Plans Include */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              All Plans Include
            </h2>
            <p className="text-xl text-gray-600">
              Every plan comes with these essential features for secure, compliant legal filing
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="geometric-icon w-16 h-16 mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Secure AES-256 encryption</h3>
              <p className="text-sm text-gray-600">Bank-grade security for all your legal documents</p>
            </div>
            
            <div className="text-center">
              <div className="geometric-icon w-16 h-16 mx-auto mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Court rule & jurisdiction compliance checks</h3>
              <p className="text-sm text-gray-600">Automated validation for CA, NY, TX, FL + federal courts</p>
            </div>
            
            <div className="text-center">
              <div className="geometric-icon w-16 h-16 mx-auto mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Smart templates & guided completion</h3>
              <p className="text-sm text-gray-600">AI-powered forms with step-by-step guidance</p>
            </div>
            
            <div className="text-center">
              <div className="geometric-icon w-16 h-16 mx-auto mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Filing requirement validation</h3>
              <p className="text-sm text-gray-600">Automatic checks for completeness and accuracy</p>
            </div>
            
            <div className="text-center">
              <div className="geometric-icon w-16 h-16 mx-auto mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Automatic updates with real-time rule changes</h3>
              <p className="text-sm text-gray-600">Stay current with evolving court requirements</p>
            </div>
            
            <div className="text-center">
              <div className="geometric-icon w-16 h-16 mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">24/7 customer support</h3>
              <p className="text-sm text-gray-600">Get help when you need it most</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 scroll-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Detailed Feature Comparison
            </h2>
            <p className="text-xl text-gray-600">
              Compare all features across our <span className="font-semibold text-[#FF5A5F]">affordable law firm software</span> plans
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold">Starter</th>
                  <th className="text-center p-4 font-semibold bg-[#FF5A5F]/10">Professional</th>
                  <th className="text-center p-4 font-semibold">Small Firm Pro</th>
                  <th className="text-center p-4 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-4 font-medium">Document Assembly</td>
                  <td className="text-center p-4">50+ forms</td>
                  <td className="text-center p-4 bg-[#FF5A5F]/5">200+ forms</td>
                  <td className="text-center p-4">Unlimited</td>
                  <td className="text-center p-4">Unlimited + Custom</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">E-Filing Integration</td>
                  <td className="text-center p-4">3/month</td>
                  <td className="text-center p-4 bg-[#FF5A5F]/5">Unlimited</td>
                  <td className="text-center p-4">Unlimited</td>
                  <td className="text-center p-4">Unlimited + Priority</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">AI Legal Research</td>
                  <td className="text-center p-4"><X className="h-4 w-4 text-gray-400 mx-auto" /></td>
                  <td className="text-center p-4 bg-[#FF5A5F]/5">Basic</td>
                  <td className="text-center p-4">Advanced</td>
                  <td className="text-center p-4">Premium</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Multi-User Access</td>
                  <td className="text-center p-4">1 user</td>
                  <td className="text-center p-4 bg-[#FF5A5F]/5">1 user</td>
                  <td className="text-center p-4">Unlimited</td>
                  <td className="text-center p-4">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Analytics Dashboard</td>
                  <td className="text-center p-4"><X className="h-4 w-4 text-gray-400 mx-auto" /></td>
                  <td className="text-center p-4 bg-[#FF5A5F]/5"><X className="h-4 w-4 text-gray-400 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="h-4 w-4 text-[#FF5A5F] mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="h-4 w-4 text-[#FF5A5F] mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Custom Integrations</td>
                  <td className="text-center p-4"><X className="h-4 w-4 text-gray-400 mx-auto" /></td>
                  <td className="text-center p-4 bg-[#FF5A5F]/5"><X className="h-4 w-4 text-gray-400 mx-auto" /></td>
                  <td className="text-center p-4"><X className="h-4 w-4 text-gray-400 mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle className="h-4 w-4 text-[#FF5A5F] mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-section">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Common questions about our <span className="font-semibold text-[#FF5A5F]">legal document management software cost</span>
            </p>
          </div>
          
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Is there really a free trial?</h3>
                <p className="text-gray-600">
                  Yes! All plans include a 7-day free trial with full access to features. No credit card required to start.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Can I change plans anytime?</h3>
                <p className="text-gray-600">
                  Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">What courts are supported?</h3>
                <p className="text-gray-600">
                  We support all 50 state courts, federal courts, and integrate with CM/ECF, Tyler, and other major e-filing systems.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Is my data secure?</h3>
                <p className="text-gray-600">
                  Yes. All data is encrypted with AES-256 encryption, and we're GDPR and HIPAA compliant. Your documents are stored securely in the cloud.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Do you offer training?</h3>
                <p className="text-gray-600">
                  Yes! All plans include onboarding support, and Small Firm Pro and Enterprise plans include dedicated training sessions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#FF5A5F] to-[#FF4449] text-white scroll-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start Filing Smarter Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            LegalEaseFile puts the power of secure automation and compliance in your hands. Whether you're representing yourself, 
            running a solo practice, or managing a growing firm — we have a plan for you.
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="bg-white text-[#FF5A5F] hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
          >
            👉 Start Free & Upgrade Anytime
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm mt-4 opacity-75">Join thousands of legal professionals who trust LegalEaseFile</p>
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
                Affordable pricing for legal document software, document management software cost, best e-filing software for attorneys.
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
              © 2025 LegalEaseFile. All rights reserved. Pricing for legal document software, affordable law firm automation, best e-filing software cost.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}