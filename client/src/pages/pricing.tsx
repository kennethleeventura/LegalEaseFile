import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  CheckCircle, 
  Gift, 
  Star, 
  Clock, 
  Users, 
  Zap,
  Shield,
  Phone,
  Crown,
  Sparkles
} from "lucide-react";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    // Fetch subscription plans
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/subscription-plans");
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    fetchPlans();
  }, []);

  const handleStartTrial = () => {
    window.location.href = "/api/login";
  };

  const handleSelectPlan = (planId: string) => {
    window.location.href = `/subscribe?plan=${planId}`;
  };

  const getAnnualPrice = (monthlyPrice: number) => {
    return monthlyPrice * 12 * 0.8; // 20% discount for annual
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "free_trial":
        return <Gift className="w-6 h-6 text-green-600" />;
      case "starter_plan":
        return <Star className="w-6 h-6 text-blue-600" />;
      case "professional_plan":
        return <Crown className="w-6 h-6 text-purple-600" />;
      case "enterprise_plan":
        return <Sparkles className="w-6 h-6 text-orange-600" />;
      default:
        return <Star className="w-6 h-6 text-gray-600" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case "free_trial":
        return "border-green-200 bg-green-50";
      case "starter_plan":
        return "border-blue-200 bg-blue-50";
      case "professional_plan":
        return "border-purple-200 bg-purple-50";
      case "enterprise_plan":
        return "border-orange-200 bg-orange-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 px-4 py-2">
            <Gift className="w-4 h-4 mr-2" />
            Start with 14-Day Free Trial
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Start with a free trial, then choose the plan that fits your practice. 
            All plans include unlimited documents and AI-powered features.
          </p>

          {/* Annual/Monthly Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-green-600"
            />
            <span className={`text-sm ${isAnnual ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Annual
            </span>
            <Badge className="bg-green-100 text-green-800 text-xs">
              Save 20%
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.highlight ? 'ring-2 ring-purple-500 scale-105' : ''
              } ${getPlanColor(plan.id)}`}
            >
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-bold">
                  {plan.badge}
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                  {getPlanIcon(plan.id)}
                </div>
                <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
                
                {/* Pricing */}
                <div className="mt-4">
                  {plan.price === 0 ? (
                    <div className="text-3xl font-bold text-green-600">FREE</div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-gray-900">
                        ${isAnnual ? Math.round(getAnnualPrice(plan.price) / 12) : plan.price}
                        <span className="text-lg font-normal text-gray-500">
                          /{isAnnual ? 'mo' : 'month'}
                        </span>
                      </div>
                      {plan.originalPrice && (
                        <div className="text-sm text-gray-500">
                          <span className="line-through">${plan.originalPrice}</span>
                          <span className="ml-2 text-green-600 font-semibold">{plan.discount}</span>
                        </div>
                      )}
                      {isAnnual && (
                        <div className="text-xs text-green-600">
                          Billed annually (${Math.round(getAnnualPrice(plan.price))}/year)
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.slice(0, 6).map((feature: string, index: number) => (
                    <li key={index} className="flex items-start text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 6 && (
                    <li className="text-sm text-gray-500 italic">
                      +{plan.features.length - 6} more features
                    </li>
                  )}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => plan.id === 'free_trial' ? handleStartTrial() : handleSelectPlan(plan.id)}
                  className={`w-full py-3 ${
                    plan.id === 'free_trial'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                      : plan.highlight
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  {plan.ctaText || 'Get Started'}
                </Button>

                {plan.id === 'free_trial' && (
                  <p className="text-xs text-center text-gray-500 mt-2">
                    No credit card required
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  What happens after my free trial ends?
                </h3>
                <p className="text-gray-600 text-sm">
                  After your 14-day trial, you can choose to upgrade to a paid plan or continue with limited access. 
                  Your documents and data are always safe.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Can I cancel anytime?
                </h3>
                <p className="text-gray-600 text-sm">
                  Yes! You can cancel your subscription at any time. No long-term contracts or cancellation fees.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Do you offer refunds?
                </h3>
                <p className="text-gray-600 text-sm">
                  We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, we'll refund your payment.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Is my data secure?
                </h3>
                <p className="text-gray-600 text-sm">
                  Absolutely. We use bank-level encryption and security measures to protect your legal documents and data.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Can I upgrade or downgrade my plan?
                </h3>
                <p className="text-gray-600 text-sm">
                  Yes, you can change your plan at any time. Changes take effect immediately and we'll prorate any billing differences.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Do you offer team discounts?
                </h3>
                <p className="text-gray-600 text-sm">
                  Yes! Contact our sales team for custom pricing on teams of 10 or more users.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Transform Your Legal Practice?
              </h3>
              <p className="text-blue-100 mb-6">
                Join thousands of legal professionals who trust LegalEaseFile for their document management needs.
              </p>
              <Button
                onClick={handleStartTrial}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              >
                <Gift className="w-5 h-5 mr-2" />
                Start Your Free Trial
              </Button>
              <p className="text-xs text-blue-200 mt-3">
                14 days free • No credit card required • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
