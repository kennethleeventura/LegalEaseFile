import { z } from "zod";

// Trial Management Service for handling free trials and conversions
export class TrialManagementService {
  
  // Start a free trial for a user
  static async startFreeTrial(userId: string) {
    const trialStartDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialStartDate.getDate() + 14); // 14-day trial

    return {
      userId,
      trialStartDate,
      trialEndDate,
      trialStatus: 'active',
      trialPlan: 'free_trial',
      daysRemaining: 14,
      features: {
        documentsPerMonth: -1, // Unlimited
        emergencyFilings: -1, // Unlimited
        aiAnalysisMinutes: -1, // Unlimited
        storageGB: -1, // Unlimited
        collaborators: 5,
        templates: -1, // Unlimited
        premiumSupport: true,
        advancedAnalytics: true
      }
    };
  }

  // Check trial status for a user
  static async getTrialStatus(userId: string) {
    // In a real implementation, this would query the database
    const mockTrialData = {
      userId,
      trialStartDate: new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)), // 7 days ago
      trialEndDate: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), // 7 days from now
      trialStatus: 'active',
      daysRemaining: 7
    };

    const now = new Date();
    const daysRemaining = Math.ceil((mockTrialData.trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      ...mockTrialData,
      daysRemaining: Math.max(0, daysRemaining),
      isExpired: daysRemaining <= 0,
      isExpiringSoon: daysRemaining <= 3 && daysRemaining > 0
    };
  }

  // Get conversion offers based on trial usage
  static async getConversionOffers(userId: string) {
    const trialStatus = await this.getTrialStatus(userId);
    
    // Personalized offers based on trial usage
    const offers = [
      {
        id: "starter_special",
        planId: "starter_plan",
        name: "Starter Plan - Special Offer",
        originalPrice: 39.99,
        discountedPrice: 19.99,
        discount: "50% OFF",
        discountDuration: "first 3 months",
        features: [
          "Continue all trial features",
          "Unlimited premium templates",
          "Priority support",
          "Team collaboration (10 members)"
        ],
        urgency: trialStatus.isExpiringSoon ? "Trial expires in " + trialStatus.daysRemaining + " days!" : null,
        ctaText: "Continue with 50% OFF",
        badge: "LIMITED TIME"
      },
      {
        id: "professional_upgrade",
        planId: "professional_plan", 
        name: "Professional Plan - Best Value",
        originalPrice: 79.99,
        discountedPrice: 49.99,
        discount: "38% OFF",
        discountDuration: "first 6 months",
        features: [
          "Everything in Starter",
          "Custom branding",
          "API access",
          "Advanced analytics",
          "Priority phone support"
        ],
        badge: "MOST POPULAR",
        ctaText: "Upgrade to Professional"
      }
    ];

    return offers;
  }

  // Handle trial expiration and grace period
  static async handleTrialExpiration(userId: string) {
    const trialStatus = await this.getTrialStatus(userId);
    
    if (trialStatus.isExpired) {
      return {
        status: 'expired',
        gracePeriodDays: 7,
        limitedAccess: {
          documentsPerMonth: 5, // Limited access
          emergencyFilings: 1,
          aiAnalysisMinutes: 30,
          storageGB: 1,
          collaborators: 1,
          templates: 10
        },
        conversionOffers: await this.getConversionOffers(userId),
        message: "Your free trial has expired. Upgrade now to continue with unlimited access!"
      };
    }

    return {
      status: 'active',
      daysRemaining: trialStatus.daysRemaining
    };
  }

  // Track trial conversion metrics
  static async getTrialMetrics() {
    // Mock data - in real implementation, query from database
    return {
      totalTrialsStarted: 2847,
      activeTrials: 1250,
      expiredTrials: 1597,
      conversions: {
        total: 892,
        conversionRate: 31.3,
        byPlan: {
          starter: 534,
          professional: 289,
          enterprise: 69
        }
      },
      averageTrialDuration: 12.5,
      topConversionTriggers: [
        "Trial expiration reminder",
        "Feature usage limit reached", 
        "Emergency filing needed",
        "Team collaboration request"
      ],
      revenueFromTrials: {
        monthly: 42850,
        projected: 514200
      }
    };
  }

  // Generate trial conversion emails/notifications
  static async getTrialNotifications(userId: string) {
    const trialStatus = await this.getTrialStatus(userId);
    const offers = await this.getConversionOffers(userId);
    
    const notifications = [];

    // Day 7 notification
    if (trialStatus.daysRemaining === 7) {
      notifications.push({
        type: "trial_midpoint",
        title: "You're halfway through your free trial!",
        message: "7 days left to explore all premium features. Need help getting the most out of LegalEaseFile?",
        cta: "Get Help",
        priority: "medium"
      });
    }

    // Day 3 notification
    if (trialStatus.daysRemaining === 3) {
      notifications.push({
        type: "trial_expiring_soon",
        title: "Your trial expires in 3 days",
        message: "Don't lose access to unlimited documents and AI analysis. Continue with 50% off!",
        cta: "Claim 50% Discount",
        priority: "high",
        offer: offers[0]
      });
    }

    // Day 1 notification
    if (trialStatus.daysRemaining === 1) {
      notifications.push({
        type: "trial_last_day",
        title: "Last day of your free trial!",
        message: "Your trial expires tomorrow. Upgrade now to keep all your documents and settings.",
        cta: "Upgrade Now",
        priority: "urgent",
        offer: offers[0]
      });
    }

    // Expired notification
    if (trialStatus.isExpired) {
      notifications.push({
        type: "trial_expired",
        title: "Your trial has expired",
        message: "You now have limited access. Upgrade to restore full functionality.",
        cta: "Restore Full Access",
        priority: "urgent",
        offer: offers[0]
      });
    }

    return notifications;
  }

  // A/B test different trial lengths and offers
  static async getOptimalTrialConfiguration(userSegment: string) {
    const configurations = {
      "new_lawyer": {
        trialDays: 21, // Longer trial for new lawyers
        features: "full_access",
        conversionOffer: {
          discount: 60,
          duration: "first_6_months"
        }
      },
      "small_firm": {
        trialDays: 14,
        features: "full_access",
        conversionOffer: {
          discount: 50,
          duration: "first_3_months"
        }
      },
      "enterprise": {
        trialDays: 30, // Longer trial for enterprise
        features: "full_access_plus_consultation",
        conversionOffer: {
          discount: 40,
          duration: "first_year",
          customDemo: true
        }
      },
      "default": {
        trialDays: 14,
        features: "full_access",
        conversionOffer: {
          discount: 50,
          duration: "first_3_months"
        }
      }
    };

    return configurations[userSegment] || configurations["default"];
  }

  // Calculate trial ROI and optimization opportunities
  static async getTrialROI() {
    const metrics = await this.getTrialMetrics();
    
    return {
      trialCostPerUser: 2.50, // Estimated cost to provide trial
      averageRevenuePerConversion: 480, // Annual revenue per converted user
      roi: {
        perTrial: (480 * 0.313) - 2.50, // Revenue * conversion rate - cost
        monthly: metrics.revenueFromTrials.monthly - (metrics.totalTrialsStarted * 2.50),
        annual: metrics.revenueFromTrials.projected * 12
      },
      optimizationOpportunities: [
        {
          opportunity: "Extend trial to 21 days for new lawyers",
          projectedImpact: "+15% conversion rate",
          estimatedRevenue: "+$77,000 annually"
        },
        {
          opportunity: "Add onboarding call for enterprise trials",
          projectedImpact: "+25% enterprise conversion",
          estimatedRevenue: "+$125,000 annually"
        },
        {
          opportunity: "Implement usage-based conversion triggers",
          projectedImpact: "+8% overall conversion",
          estimatedRevenue: "+$41,000 annually"
        }
      ]
    };
  }
}

// Trial conversion tracking
export class TrialAnalytics {
  static async trackTrialEvent(userId: string, event: string, metadata?: any) {
    const eventData = {
      userId,
      event,
      timestamp: new Date(),
      metadata: metadata || {}
    };

    // In real implementation, send to analytics service
    console.log('Trial Event:', eventData);
    
    return eventData;
  }

  static async getConversionFunnel() {
    return {
      trialSignups: 2847,
      trialActivations: 2654, // 93.2%
      day7Engagement: 2103, // 79.2%
      day14Retention: 1876, // 89.2%
      conversionAttempts: 1234, // 65.8%
      successfulConversions: 892, // 72.3%
      overallConversionRate: 31.3 // %
    };
  }
}
