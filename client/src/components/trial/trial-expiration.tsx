import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Star, 
  Zap, 
  Crown, 
  Gift,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Users,
  Shield,
  Phone
} from "lucide-react";

interface TrialExpirationProps {
  daysRemaining: number;
  trialEndDate: string;
  onUpgrade: (planId: string) => void;
  className?: string;
}

export default function TrialExpiration({ 
  daysRemaining, 
  trialEndDate, 
  onUpgrade, 
  className 
}: TrialExpirationProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: daysRemaining,
    hours: 0,
    minutes: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endTime = new Date(trialEndDate).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        setTimeLeft({ days, hours, minutes });
      }
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [trialEndDate]);

  const progressPercentage = ((14 - daysRemaining) / 14) * 100;
  const isExpiringSoon = daysRemaining <= 3;
  const isExpired = daysRemaining <= 0;

  const conversionOffers = [
    {
      id: "essential_plan",
      name: "Essential Plan",
      originalPrice: 29.99,
      discountedPrice: 14.99,
      discount: "50% OFF",
      discountDuration: "first month",
      badge: "MOST POPULAR",
      icon: <Star className="w-6 h-6 text-blue-600" />,
      features: [
        "Continue all trial features",
        "10 team members",
        "100GB storage",
        "Priority support"
      ],
      color: "from-blue-600 to-blue-700",
      savings: "$15.00"
    },
    {
      id: "professional_plan", 
      name: "Professional Plan",
      originalPrice: 79.99,
      discountedPrice: 47.99,
      discount: "40% OFF",
      discountDuration: "first month",
      badge: "BEST VALUE",
      icon: <Crown className="w-6 h-6 text-purple-600" />,
      features: [
        "Everything in Essential",
        "Unlimited team members",
        "Custom branding",
        "API access",
        "Phone support"
      ],
      color: "from-purple-600 to-purple-700",
      savings: "$32.00"
    }
  ];

  const getUrgencyMessage = () => {
    if (isExpired) {
      return {
        title: "Your trial has expired",
        message: "Choose a plan to restore full access to your documents and features.",
        urgency: "urgent",
        icon: <AlertTriangle className="w-6 h-6 text-red-600" />
      };
    } else if (daysRemaining === 1) {
      return {
        title: "Last day of your free trial!",
        message: "Your trial expires in less than 24 hours. Don't lose access to your work.",
        urgency: "high",
        icon: <Clock className="w-6 h-6 text-orange-600" />
      };
    } else if (isExpiringSoon) {
      return {
        title: `${daysRemaining} days left in your trial`,
        message: "Your trial is ending soon. Continue with a paid plan to keep all features.",
        urgency: "medium",
        icon: <Clock className="w-6 h-6 text-yellow-600" />
      };
    } else {
      return {
        title: `${daysRemaining} days remaining`,
        message: "You're enjoying your free trial. Consider upgrading for continued access.",
        urgency: "low",
        icon: <Gift className="w-6 h-6 text-green-600" />
      };
    }
  };

  const urgencyInfo = getUrgencyMessage();

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Trial Status Card */}
      <Card className={`mb-8 ${isExpiringSoon ? 'border-orange-200 bg-orange-50' : 'border-blue-200 bg-blue-50'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {urgencyInfo.icon}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{urgencyInfo.title}</h3>
                <p className="text-sm text-gray-600">{urgencyInfo.message}</p>
              </div>
            </div>
            {!isExpired && (
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
                </div>
                <div className="text-xs text-gray-500">remaining</div>
              </div>
            )}
          </div>
          
          {!isExpired && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Trial Progress</span>
                <span>{Math.round(progressPercentage)}% complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conversion Offers */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isExpired ? "Restore Full Access" : "Continue Your Journey"}
          </h2>
          <p className="text-gray-600">
            {isExpired 
              ? "Choose a plan to regain access to all your documents and features"
              : "Special pricing available for trial users - limited time offer!"
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {conversionOffers.map((offer) => (
            <Card key={offer.id} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 text-xs font-bold">
                {offer.badge}
              </div>
              
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    {offer.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{offer.name}</CardTitle>
                    <Badge className="mt-1 bg-red-100 text-red-800 text-xs">
                      {offer.discount} - {offer.discountDuration}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Pricing */}
                  <div className="text-center py-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <span className="text-3xl font-bold text-green-600">
                        ${offer.discountedPrice}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        ${offer.originalPrice}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Save {offer.savings} your first month
                    </div>
                    <div className="text-xs text-green-600 font-semibold mt-1">
                      Then ${offer.originalPrice}/month
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2">
                    {offer.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={() => onUpgrade(offer.id)}
                    className={`w-full py-3 bg-gradient-to-r ${offer.color} hover:opacity-90 text-white font-semibold`}
                  >
                    {isExpired ? "Restore Access" : "Claim This Offer"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  {isExpiringSoon && (
                    <div className="text-center">
                      <p className="text-xs text-orange-600 font-semibold">
                        ⏰ Limited time offer expires with your trial!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Trust Indicators */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <Sparkles className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900">Why Continue with LegalEaseFile?</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Users className="w-6 h-6 text-blue-600 mb-2" />
              <div className="text-sm font-semibold text-gray-900">10,000+ Users</div>
              <div className="text-xs text-gray-600">Trust our platform</div>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="w-6 h-6 text-green-600 mb-2" />
              <div className="text-sm font-semibold text-gray-900">Bank-Level Security</div>
              <div className="text-xs text-gray-600">Your data is protected</div>
            </div>
            <div className="flex flex-col items-center">
              <Phone className="w-6 h-6 text-purple-600 mb-2" />
              <div className="text-sm font-semibold text-gray-900">24/7 Support</div>
              <div className="text-xs text-gray-600">We're here to help</div>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              30-day money-back guarantee • Cancel anytime • No long-term contracts
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
