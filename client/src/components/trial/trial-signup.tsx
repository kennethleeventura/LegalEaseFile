import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Gift, 
  Star, 
  Shield, 
  Clock, 
  CheckCircle,
  Sparkles,
  Users,
  FileText,
  Brain,
  Phone
} from "lucide-react";

interface TrialSignupProps {
  onSignup?: (data: any) => void;
  className?: string;
}

export default function TrialSignup({ onSignup, className }: TrialSignupProps) {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    practiceType: "",
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const trialFeatures = [
    {
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      title: "Unlimited Documents",
      description: "Upload and manage unlimited legal documents"
    },
    {
      icon: <Brain className="w-5 h-5 text-purple-600" />,
      title: "AI Document Analysis",
      description: "Advanced AI-powered document review and insights"
    },
    {
      icon: <Users className="w-5 h-5 text-green-600" />,
      title: "Team Collaboration",
      description: "Work with up to 5 team members"
    },
    {
      icon: <Phone className="w-5 h-5 text-orange-600" />,
      title: "Priority Support",
      description: "Email and chat support during trial"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onSignup) {
        onSignup(formData);
      }
      
      // Redirect to dashboard or show success message
      console.log("Trial signup successful:", formData);
    } catch (error) {
      console.error("Trial signup failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left side - Trial benefits */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-4 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 px-4 py-2">
              <Gift className="w-4 h-4 mr-2" />
              14-Day Free Trial
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Try LegalEaseFile Risk-Free
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Get full access to all premium features for 14 days. No credit card required, cancel anytime.
            </p>
          </div>

          {/* Trial features */}
          <div className="space-y-4">
            {trialFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-3">Why Choose LegalEaseFile?</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                <span>Used by 10,000+ legal professionals</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                <span>Bank-level security and encryption</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                <span>Massachusetts Federal Court approved</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                <span>24/7 customer support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Signup form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-2">
              <Sparkles className="w-8 h-8 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl">Start Your Free Trial</CardTitle>
            <CardDescription>
              No credit card required • Cancel anytime
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="mt-1"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <Label htmlFor="practiceType">Practice Type</Label>
                <select
                  id="practiceType"
                  value={formData.practiceType}
                  onChange={(e) => setFormData({...formData, practiceType: e.target.value})}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select your practice type</option>
                  <option value="solo">Solo Practitioner</option>
                  <option value="small_firm">Small Law Firm (2-10 lawyers)</option>
                  <option value="medium_firm">Medium Law Firm (11-50 lawyers)</option>
                  <option value="large_firm">Large Law Firm (50+ lawyers)</option>
                  <option value="corporate">Corporate Legal Department</option>
                  <option value="government">Government Agency</option>
                  <option value="nonprofit">Non-Profit Organization</option>
                  <option value="student">Law Student</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData({...formData, agreeToTerms: checked as boolean})}
                  className="mt-1"
                />
                <Label htmlFor="agreeToTerms" className="text-sm text-gray-600 leading-relaxed">
                  I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and{" "}
                  <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={!formData.agreeToTerms || isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 text-lg font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Starting Your Trial...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Gift className="w-5 h-5 mr-2" />
                    Start 14-Day Free Trial
                  </div>
                )}
              </Button>

              <div className="text-center text-xs text-gray-500 mt-4">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center">
                    <Shield className="w-3 h-3 mr-1 text-green-500" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-blue-500" />
                    <span>Instant Access</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 mr-1 text-yellow-500" />
                    <span>No Commitment</span>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
