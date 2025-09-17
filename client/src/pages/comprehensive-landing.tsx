import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Helmet } from "react-helmet-async";
import { 
  Scale, 
  FileText, 
  Shield, 
  Zap, 
  Users, 
  BookOpen,
  Search,
  ExternalLink,
  Menu,
  X,
  ChevronDown,
  Star,
  Globe,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  CheckCircle,
  Award,
  TrendingUp,
  Clock,
  Target,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const ComprehensiveLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, 100]);

  // Color Story - Professional Legal Blue/Gold Palette
  const colorTheme = {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      900: '#1e3a8a'
    },
    gold: {
      50: '#fefce8',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706'
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      800: '#1f2937',
      900: '#111827'
    }
  };

  // SEO Data
  const seoData = {
    title: "LegalEaseFile - AI-Powered Legal Document Management for Massachusetts Federal District Court",
    description: "Streamline your legal document filing with intelligent AI analysis, emergency filing capabilities, and comprehensive pro bono legal assistance. Massachusetts Federal District Court certified.",
    keywords: "legal document management, AI legal analysis, Massachusetts Federal District Court, CM/ECF filing, emergency legal filing, pro bono legal aid, legal document templates, court filing software",
    canonicalUrl: "https://legaleasefile.onrender.com",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "LegalEaseFile",
      "applicationCategory": "LegalApplication",
      "description": "AI-powered legal document management and filing system for Massachusetts Federal District Court",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "29.99",
        "priceCurrency": "USD"
      }
    }
  };

  // Legal Glossary Terms (automated)
  const glossaryTerms = [
    { term: "CM/ECF", definition: "Case Management/Electronic Case Files - Federal court's electronic filing system", category: "Court Systems" },
    { term: "TRO", definition: "Temporary Restraining Order - Court order that temporarily prohibits certain actions", category: "Court Orders" },
    { term: "PACER", definition: "Public Access to Court Electronic Records - Online access to federal court documents", category: "Court Systems" },
    { term: "Pro Bono", definition: "Legal services provided free of charge for the public good", category: "Legal Services" },
    { term: "Preliminary Injunction", definition: "Court order maintaining status quo pending trial resolution", category: "Court Orders" },
    { term: "Jurisdiction", definition: "Legal authority of a court to hear and decide cases", category: "Legal Concepts" },
    { term: "Motion", definition: "Formal request asking court to issue an order or ruling", category: "Legal Documents" },
    { term: "Pleading", definition: "Formal written statement filed with court outlining party's position", category: "Legal Documents" }
  ];

  // Blog Posts (automated)
  const blogPosts = [
    {
      title: "Understanding CM/ECF Filing Requirements in Massachusetts Federal Court",
      excerpt: "Complete guide to electronic filing requirements, deadlines, and best practices for the U.S. District Court for the District of Massachusetts.",
      readTime: "8 min read",
      category: "Court Procedures",
      date: "2025-01-15",
      slug: "cmecf-filing-requirements-massachusetts",
      keywords: ["CM/ECF", "Massachusetts Federal Court", "Electronic Filing"]
    },
    {
      title: "Emergency Legal Filings: When and How to File TROs and Preliminary Injunctions",
      excerpt: "Time-sensitive legal matters require immediate action. Learn the proper procedures for emergency court filings.",
      readTime: "6 min read", 
      category: "Emergency Procedures",
      date: "2025-01-12",
      slug: "emergency-legal-filings-tro-preliminary-injunction",
      keywords: ["TRO", "Preliminary Injunction", "Emergency Filing"]
    },
    {
      title: "Finding Pro Bono Legal Assistance in Massachusetts: Complete Directory",
      excerpt: "Comprehensive guide to free legal aid organizations, eligibility requirements, and application processes.",
      readTime: "10 min read",
      category: "Legal Aid",
      date: "2025-01-10",
      slug: "pro-bono-legal-assistance-massachusetts",
      keywords: ["Pro Bono", "Legal Aid", "Massachusetts Legal Services"]
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Solo Practitioner",
      content: "LegalEaseFile transformed my practice. The AI analysis caught compliance issues I would have missed, saving me from potential sanctions.",
      rating: 5,
      location: "Boston, MA"
    },
    {
      name: "Michael Chen", 
      role: "Legal Aid Attorney",
      content: "The pro bono directory integration helps me connect clients with additional resources quickly. The emergency filing features are invaluable.",
      rating: 5,
      location: "Springfield, MA"
    },
    {
      name: "Jennifer Rodriguez",
      role: "Small Law Firm Partner", 
      content: "Our firm's efficiency increased 300% after implementing LegalEaseFile. The automated document generation saves hours per case.",
      rating: 5,
      location: "Worcester, MA"
    }
  ];

  // Navigation Links
  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Glossary", href: "#glossary" },
    { name: "Blog", href: "#blog" },
    { name: "Support", href: "#support" }
  ];

  // External Links for SEO
  const externalLinks = [
    { name: "U.S. District Court Massachusetts", url: "https://www.mad.uscourts.gov", description: "Official court website" },
    { name: "PACER Case Locator", url: "https://pcl.uscourts.gov", description: "Federal court case search" },
    { name: "Massachusetts Bar Association", url: "https://www.massbar.org", description: "State bar resources" },
    { name: "Legal Aid Organizations", url: "https://www.lsc.gov/what-legal-aid/find-legal-aid", description: "Find legal assistance" }
  ];

  // Animation Variants (Wix Studio Style)
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 1, ease: "easeOut" }
    }
  };

  // Intersection Observer Hooks
  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1 });
  const [pricingRef, pricingInView] = useInView({ threshold: 0.1 });
  const [glossaryRef, glossaryInView] = useInView({ threshold: 0.1 });
  const [blogRef, blogInView] = useInView({ threshold: 0.1 });

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* SEO Head */}
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <link rel="canonical" href={seoData.canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:url" content={seoData.canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="LegalEaseFile" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(seoData.structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Navigation Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Scale className="h-8 w-8" style={{ color: colorTheme.primary[600] }} />
                <span className="text-2xl font-bold" style={{ color: colorTheme.gray[800] }}>
                  LegalEaseFile
                </span>
              </motion.div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                {navLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    {link.name}
                  </motion.a>
                ))}
                <Button 
                  className="ml-4"
                  style={{ 
                    backgroundColor: colorTheme.primary[600],
                    border: `1px solid ${colorTheme.primary[600]}`
                  }}
                  onClick={() => window.location.href = "/api/login"}
                >
                  Get Started
                </Button>
              </nav>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div 
              className="md:hidden bg-white border-t"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="px-4 py-4 space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <Button 
                  className="w-full mt-4"
                  style={{ backgroundColor: colorTheme.primary[600] }}
                  onClick={() => window.location.href = "/api/login"}
                >
                  Get Started
                </Button>
              </div>
            </motion.div>
          )}
        </header>

        {/* Split-Screen Hero Section */}
        <section className="relative h-screen flex items-center overflow-hidden">
          <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2">

            {/* Left Side - Image Section with Compass Animation */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideInLeft}
              className="relative bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center h-full"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-20 h-20 bg-white rounded-full" />
                <div className="absolute top-40 right-20 w-32 h-32 bg-white rounded-full" />
                <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-white rounded-full" />
              </div>

              {/* Compass Animation Container */}
              <div className="relative z-10 w-full max-w-lg px-8">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="w-full"
                >
                  <img
                    src="/assets/images/compass-animation.gif"
                    alt="Legal Navigation Compass"
                    className="w-full h-auto drop-shadow-2xl"
                  />
                </motion.div>

                {/* Tagline Overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="mt-8 text-center"
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border">
                    <h3 className="text-2xl font-bold text-blue-600 mb-1">
                      Navigate the Courts with Confidence
                    </h3>
                    <p className="text-gray-600 text-sm">
                      AI-powered legal guidance for every filing
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side - Copy + CTA Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="relative bg-white flex items-center justify-center h-full p-8 lg:p-16"
            >
              <div className="w-full max-w-lg space-y-6">

                {/* Certification Badge */}
                <motion.div variants={fadeInUp}>
                  <Badge
                    className="mb-4 text-sm px-4 py-2"
                    style={{
                      backgroundColor: colorTheme.gold[100],
                      color: colorTheme.gold[600],
                      border: `1px solid ${colorTheme.gold[200]}`
                    }}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Massachusetts Federal District Court Certified
                  </Badge>
                </motion.div>

                {/* SEO-Optimized Headline */}
                <motion.h1
                  variants={fadeInUp}
                  className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight text-gray-900"
                >
                  AI-Powered Legal Filing for{" "}
                  <span className="text-blue-600">Pro Se Litigants</span>{" "}
                  & Small Law Firms
                </motion.h1>

                {/* Subhead */}
                <motion.p
                  variants={fadeInUp}
                  className="text-xl lg:text-2xl font-semibold text-gray-700"
                >
                  Compliant. Simple. Court-Ready.
                </motion.p>

                <motion.p
                  variants={fadeInUp}
                  className="text-base lg:text-lg text-gray-600 leading-relaxed"
                >
                  Massachusetts court forms, federal court filings, and self-representation help powered by AI legal research and case automation tools.
                </motion.p>

                {/* Dual CTA Buttons */}
                <motion.div
                  variants={fadeInUp}
                  className="space-y-3"
                >
                  {/* For Individuals (Pro Se Litigants) */}
                  <Button
                    size="lg"
                    className="w-full px-6 py-5 text-base lg:text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => window.location.href = "/file-document"}
                  >
                    <Users className="mr-3 h-5 w-5" />
                    File My Case - For Individuals
                    <ArrowRight className="ml-3 h-4 w-4" />
                  </Button>

                  {/* For Legal Professionals */}
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full px-6 py-5 text-base lg:text-lg font-semibold border-2 border-amber-500 text-amber-600 hover:bg-amber-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => window.location.href = "/pricing"}
                  >
                    <Scale className="mr-3 h-5 w-5" />
                    Grow My Practice - For Attorneys
                    <ArrowRight className="ml-3 h-4 w-4" />
                  </Button>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  variants={fadeInUp}
                  className="flex items-center justify-center space-x-6 text-sm text-gray-500 pt-4"
                >
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Secure & HIPAA Compliant
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    14-Day Free Trial
                  </div>
                </motion.div>

                {/* Keywords for SEO */}
                <motion.div
                  variants={fadeInUp}
                  className="text-xs text-gray-400 text-center space-x-2"
                >
                  <span>AI legal research</span> •
                  <span>law firm tools</span> •
                  <span>federal court filings</span> •
                  <span>self-representation help</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Original Hero Section with Parallax */}
        <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-br opacity-10"
            style={{
              background: `linear-gradient(135deg, ${colorTheme.primary[50]} 0%, ${colorTheme.gold[50]} 100%)`
            }}
          />

          {/* Parallax Background Elements */}
          <motion.div
            className="absolute inset-0"
            style={{ y: y1 }}
          >
            <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20" />
            <div className="absolute top-40 right-20 w-32 h-32 bg-gold-200 rounded-full opacity-20" />
            <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-blue-300 rounded-full opacity-20" />
          </motion.div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Hero Content */}
              <motion.div
                initial="hidden"
                animate={heroInView ? "visible" : "hidden"}
                variants={staggerContainer}
                className="space-y-8"
              >
                <motion.div variants={fadeInUp}>
                  <Badge
                    className="mb-4"
                    style={{
                      backgroundColor: colorTheme.gold[100],
                      color: colorTheme.gold[600],
                      border: `1px solid ${colorTheme.gold[200]}`
                    }}
                  >
                    <Award className="w-4 h-4 mr-1" />
                    Massachusetts Federal District Court Certified
                  </Badge>
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  className="text-5xl lg:text-7xl font-bold leading-tight"
                  style={{ color: colorTheme.gray[900] }}
                >
                  AI-Powered
                  <span
                    className="block"
                    style={{ color: colorTheme.primary[600] }}
                  >
                    Legal Filing
                  </span>
                  Revolution
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-xl text-gray-600 max-w-lg"
                >
                  Streamline document preparation, ensure CM/ECF compliance, and access emergency filing assistance with our comprehensive AI-powered legal platform.
                </motion.p>

                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Button
                    size="lg"
                    className="px-8 py-4 text-lg"
                    style={{ backgroundColor: colorTheme.primary[600] }}
                    onClick={() => window.location.href = "/api/login"}
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg border-2"
                    style={{
                      borderColor: colorTheme.primary[600],
                      color: colorTheme.primary[600]
                    }}
                  >
                    Watch Demo
                  </Button>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="flex items-center space-x-6 text-sm text-gray-500"
                >
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    No Setup Fees
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    14-Day Free Trial
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Cancel Anytime
                  </div>
                </motion.div>
              </motion.div>

              {/* Hero Image/Demo */}
              <motion.div
                initial="hidden"
                animate={heroInView ? "visible" : "hidden"}
                variants={slideInLeft}
                className="relative"
              >
                <div className="bg-white rounded-2xl shadow-2xl p-8 border">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">Document Analysis</h3>
                      <Badge className="bg-green-100 text-green-800">Complete</Badge>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Brain className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium">AI Analysis Results</span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Document Type:</span>
                          <span className="font-medium">Motion for Summary Judgment</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CM/ECF Compliance:</span>
                          <span className="text-green-600 font-medium">✓ Validated</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Filing Deadline:</span>
                          <span className="font-medium">January 25, 2025</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg"
                >
                  <Zap className="h-6 w-6" />
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="h-8 w-8 text-gray-400" />
          </motion.div>
        </section>

        {/* Features Section with Scroll Animations */}
        <section ref={featuresRef} id="features" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-4xl font-bold text-gray-900 mb-4"
              >
                Comprehensive Legal Filing Solution
              </motion.h2>
              <motion.p 
                variants={fadeInUp}
                className="text-xl text-gray-600 max-w-3xl mx-auto"
              >
                Everything you need for efficient, compliant, and professional legal document filing in one integrated platform.
              </motion.p>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: Brain,
                  title: "AI Document Analysis",
                  description: "Intelligent document classification, compliance checking, and automated error detection.",
                  features: ["Auto document type detection", "CM/ECF compliance validation", "Risk assessment alerts"]
                },
                {
                  icon: Zap,
                  title: "Emergency Filing",
                  description: "Expedited processing for time-sensitive TROs and preliminary injunctions.",
                  features: ["24/7 emergency support", "Automated deadline tracking", "Priority queue processing"]
                },
                {
                  icon: Users,
                  title: "Pro Bono Directory",
                  description: "Comprehensive network of legal aid organizations and qualified attorneys.",
                  features: ["Real-time availability", "Practice area matching", "Geographic filtering"]
                },
                {
                  icon: Shield,
                  title: "MPC Security",
                  description: "Multi-party computation ensures complete client confidentiality.",
                  features: ["AES-256 encryption", "Zero-knowledge architecture", "HIPAA compliance"]
                },
                {
                  icon: FileText,
                  title: "Smart Templates",
                  description: "AI-powered document generation with jurisdiction-specific formatting.",
                  features: ["50+ court forms", "Auto-population", "Version control"]
                },
                {
                  icon: Globe,
                  title: "CM/ECF Integration",
                  description: "Direct filing to Massachusetts Federal District Court system.",
                  features: ["NextGen CM/ECF support", "PACER integration", "Filing confirmation"]
                }
              ].map((feature, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
                    <CardHeader>
                      <feature.icon className="w-12 h-12 mb-4 gradient-icon" />
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.features.map((item, i) => (
                          <li key={i} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section ref={pricingRef} id="pricing" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate={pricingInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-900 mb-4">
                Transparent Pricing for Every Practice
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-gray-600">
                Choose the plan that fits your legal practice needs
              </motion.p>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  name: "Solo Practitioner",
                  price: "$29.99",
                  period: "per month",
                  description: "Perfect for individual attorneys",
                  features: ["5 documents/month", "AI analysis", "Email support", "Basic templates"],
                  cta: "Start Free Trial",
                  popular: false
                },
                {
                  name: "Small Firm", 
                  price: "$79.99",
                  period: "per month",
                  description: "Ideal for small law practices",
                  features: ["25 documents/month", "Emergency filing", "Priority support", "All templates", "Pro bono directory"],
                  cta: "Start Free Trial",
                  popular: true
                },
                {
                  name: "Enterprise",
                  price: "$199.99", 
                  period: "per month",
                  description: "For large legal organizations",
                  features: ["Unlimited documents", "24/7 support", "API access", "Custom integrations", "Dedicated manager"],
                  cta: "Contact Sales",
                  popular: false
                }
              ].map((plan, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className={`h-full relative ${plan.popular ? 'border-2 border-blue-600 shadow-2xl' : 'shadow-lg'}`}>
                    {plan.popular && (
                      <div 
                        className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: colorTheme.primary[600] }}
                      >
                        Most Popular
                      </div>
                    )}
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-gray-600">/{plan.period}</span>
                      </div>
                      <CardDescription className="text-base mt-2">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className="w-full mt-6"
                        variant={plan.popular ? "default" : "outline"}
                        style={plan.popular ? { backgroundColor: colorTheme.primary[600] } : {}}
                      >
                        {plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Legal Glossary Section */}
        <section ref={glossaryRef} id="glossary" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate={glossaryInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-900 mb-4">
                Legal Glossary & Resources
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-gray-600">
                Comprehensive definitions of legal terms and court procedures
              </motion.p>
            </motion.div>

            <motion.div variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {glossaryTerms.map((item, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <Badge className="mb-2 text-xs" variant="outline">
                        {item.category}
                      </Badge>
                      <h3 className="font-semibold text-lg mb-2">{item.term}</h3>
                      <p className="text-sm text-gray-600">{item.definition}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* External Links */}
            <motion.div variants={fadeInUp} className="mt-16">
              <h3 className="text-2xl font-bold text-center mb-8">Helpful Legal Resources</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {externalLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ExternalLink className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">{link.name}</div>
                      <div className="text-sm text-gray-600">{link.description}</div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Blog Section */}
        <section ref={blogRef} id="blog" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate={blogInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-900 mb-4">
                Latest Legal Insights & Guides
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-gray-600">
                Stay updated with legal filing procedures and court requirements
              </motion.p>
            </motion.div>

            <motion.div variants={staggerContainer} className="grid md:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <motion.article key={index} variants={fadeInUp}>
                  <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      <Badge className="mb-3" variant="outline">
                        {post.category}
                      </Badge>
                      <h3 className="font-bold text-xl mb-3 line-clamp-2">
                        <a href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                          {post.title}
                        </a>
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                      </div>
                      <div className="mt-3">
                        <a 
                          href={`/blog/${post.slug}`}
                          className="text-blue-600 font-medium hover:text-blue-700 flex items-center"
                        >
                          Read More <ArrowRight className="ml-1 h-4 w-4" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Trusted by Legal Professionals
              </h2>
              <p className="text-xl text-gray-600">
                See what attorneys across Massachusetts are saying
              </p>
            </div>

            <div className="relative">
              <Card className="max-w-4xl mx-auto">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-xl text-gray-700 mb-6">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-gray-600">
                      {testimonials[currentTestimonial].role}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonials[currentTestimonial].location}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial Navigation */}
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    onClick={() => setCurrentTestimonial(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4">
                Ready to Transform Your Legal Practice?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Join hundreds of attorneys already using LegalEaseFile for efficient, compliant legal document filing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-4 text-lg border-white text-white hover:bg-white/10"
                >
                  Schedule Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer id="support" className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Scale className="h-6 w-6" />
                  <span className="text-xl font-bold">LegalEaseFile</span>
                </div>
                <p className="text-gray-400 mb-4">
                  AI-powered legal document management for Massachusetts Federal District Court.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="text-sm">(617) 555-0123</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="text-sm">support@legaleasefile.com</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">Boston, MA</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold mb-4">Features</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">AI Document Analysis</a></li>
                  <li><a href="#" className="hover:text-white">Emergency Filing</a></li>
                  <li><a href="#" className="hover:text-white">Pro Bono Directory</a></li>
                  <li><a href="#" className="hover:text-white">CM/ECF Integration</a></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#glossary" className="hover:text-white">Legal Glossary</a></li>
                  <li><a href="#blog" className="hover:text-white">Blog</a></li>
                  <li><a href="#" className="hover:text-white">Documentation</a></li>
                  <li><a href="#" className="hover:text-white">API Reference</a></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white">Security</a></li>
                  <li><a href="#" className="hover:text-white">Compliance</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2025 LegalEaseFile. All rights reserved. Massachusetts Federal District Court document filing assistance.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ComprehensiveLanding;