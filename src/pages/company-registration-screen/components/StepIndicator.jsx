import React from 'react';
import Icon from '../../../components/AppIcon';

const StepIndicator = ({ currentStep = 1, totalSteps = 4 }) => {
  const steps = [
    { number: 1, title: "Company Details", description: "Basic information" },
    { number: 2, title: "Business Hours", description: "Operating schedule" },
    { number: 3, title: "Admin Account", description: "Administrator setup" },
    { number: 4, title: "Confirmation", description: "Review & complete" }
  ];

  const getStepStatus = (stepNumber) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepClasses = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground border-success';
      case 'current':
        return 'bg-primary text-primary-foreground border-primary';
      case 'upcoming':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-border -z-10">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>

        {steps?.map((step, index) => {
          const status = getStepStatus(step?.number);
          const isLast = index === steps?.length - 1;

          return (
            <div key={step?.number} className="flex flex-col items-center relative">
              {/* Step Circle */}
              <div className={`
                w-12 h-12 rounded-full border-2 flex items-center justify-center
                transition-all duration-300 ${getStepClasses(status)}
              `}>
                {status === 'completed' ? (
                  <Icon name="Check" size={20} />
                ) : (
                  <span className="text-sm font-semibold">{step?.number}</span>
                )}
              </div>
              {/* Step Info */}
              <div className="mt-3 text-center max-w-24 sm:max-w-32">
                <p className={`text-sm font-medium ${
                  status === 'current' ? 'text-primary' : 
                  status === 'completed' ? 'text-success' : 'text-muted-foreground'
                }`}>
                  {step?.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
                  {step?.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;