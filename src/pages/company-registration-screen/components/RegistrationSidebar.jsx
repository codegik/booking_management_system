import React from 'react';
import Icon from '../../../components/AppIcon';

const RegistrationSidebar = ({ currentStep = 1 }) => {
  const sidebarContent = {
    1: {
      title: "Company Setup Made Easy",
      features: [
        {
          icon: "Building2",
          title: "Multi-tenant Architecture",
          description: "Your company gets its own secure space with complete data isolation"
        },
        {
          icon: "Users",
          title: "Team Management",
          description: "Add unlimited employees and manage their roles and permissions"
        },
        {
          icon: "Calendar",
          title: "Smart Scheduling",
          description: "48-slot daily system ensures optimal booking availability"
        }
      ],
      tip: "Choose your business type carefully as it helps us customize features for your industry."
    },
    2: {
      title: "Flexible Business Hours",
      features: [
        {
          icon: "Clock",
          title: "30-Minute Time Slots",
          description: "Precise scheduling with 48 available slots per day"
        },
        {
          icon: "Calendar",
          title: "Day-by-Day Control",
          description: "Set different hours for each day or mark days as closed"
        },
        {
          icon: "Zap",
          title: "Real-time Availability",
          description: "Customers see live availability based on your schedule"
        }
      ],
      tip: "Your business hours directly impact when customers can book appointments. You can always modify these later."
    },
    3: {
      title: "Secure Administrator Setup",
      features: [
        {
          icon: "Shield",
          title: "Full Access Control",
          description: "Administrator account has complete system privileges"
        },
        {
          icon: "Key",
          title: "Strong Security",
          description: "Password requirements ensure your account stays protected"
        },
        {
          icon: "UserCheck",
          title: "Profile Management",
          description: "Manage your profile and company settings anytime"
        }
      ],
      tip: "Use a strong, unique password. This account will have full control over your booking system."
    },
    4: {
      title: "Ready to Launch",
      features: [
        {
          icon: "Rocket",
          title: "Instant Activation",
          description: "Your booking system will be ready immediately after confirmation"
        },
        {
          icon: "Mail",
          title: "Email Verification",
          description: "Check your email for account verification instructions"
        },
        {
          icon: "BarChart3",
          title: "Dashboard Access",
          description: "Get insights and manage everything from your admin dashboard"
        }
      ],
      tip: "After registration, you'll receive a verification email. Check your spam folder if you don't see it."
    }
  };

  const content = sidebarContent?.[currentStep] || sidebarContent?.[1];

  return (
    <div className="bg-muted/30 rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {content?.title}
        </h3>
      </div>
      <div className="space-y-4">
        {content?.features?.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={feature?.icon} size={16} className="text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm">
                {feature?.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {feature?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={16} className="text-accent mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-foreground text-sm">Pro Tip</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {content?.tip}
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-border pt-4">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Shield" size={14} />
          <span>SSL Secured</span>
          <span>•</span>
          <Icon name="Lock" size={14} />
          <span>Data Protected</span>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSidebar;