import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2 } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = ({ planId }: { planId: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/dashboard",
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Subscription Successful",
        description: "Welcome to LegalFile AI! You now have access to all premium features.",
      });
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isLoading} 
        className="w-full"
        data-testid="button-subscribe"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Subscribe Now"
        )}
      </Button>
    </form>
  );
};

export default function Subscribe() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("professional");
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }

    // Fetch subscription plans
    const fetchPlans = async () => {
      try {
        const response = await apiRequest("GET", "/api/subscription-plans");
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load subscription plans",
          variant: "destructive",
        });
      }
    };

    fetchPlans();
  }, [isAuthenticated, toast]);

  useEffect(() => {
    if (!isAuthenticated || !selectedPlan) return;

    // Create subscription when plan is selected
    const createSubscription = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("POST", "/api/create-subscription", { planId: selectedPlan });
        const data = await response.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to initialize subscription",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    createSubscription();
  }, [isAuthenticated, selectedPlan, toast]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access subscription plans</p>
          <Button onClick={() => window.location.href = "/api/login"}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (loading || !plans.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Legal Filing Plan
          </h1>
          <p className="text-xl text-gray-600">
            Select the plan that best fits your legal document filing needs
          </p>
        </div>

        {!clientSecret ? (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`cursor-pointer transition-all duration-200 ${
                  selectedPlan === plan.id 
                    ? 'border-blue-500 shadow-lg scale-105' 
                    : 'border-gray-200 hover:shadow-md'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
                data-testid={`card-plan-${plan.id}`}
              >
                <CardHeader>
                  {plan.id === 'professional' && (
                    <Badge className="w-fit mb-2">Most Popular</Badge>
                  )}
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-lg font-normal text-gray-600">/{plan.interval}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    {plan.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-6 ${
                      selectedPlan === plan.id 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                    disabled={loading}
                    data-testid={`button-select-${plan.id}`}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Subscription</CardTitle>
                <CardDescription>
                  You selected the {plans.find(p => p.id === selectedPlan)?.name} plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <SubscribeForm planId={selectedPlan} />
                </Elements>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Legal Notice */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Subscription Terms</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            By subscribing, you agree to our Terms of Service and Privacy Policy. Subscriptions auto-renew monthly 
            and can be cancelled at any time. All payments are processed securely through Stripe. No refunds for 
            partial months. Document filing limits reset monthly on your billing date.
          </p>
        </div>
      </div>
    </div>
  );
}