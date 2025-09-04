import React from 'react';
import Icon from '../../../components/AppIcon';

const EmployeeSummaryCards = ({ employees = [] }) => {
  const totalEmployees = employees?.length;
  const activeEmployees = employees?.filter(emp => emp?.status === 'active')?.length;
  const inactiveEmployees = totalEmployees - activeEmployees;
  
  // Calculate service assignment distribution
  const serviceAssignments = employees?.reduce((acc, emp) => {
    emp?.assignedWorks?.forEach(service => {
      acc[service.name] = (acc?.[service?.name] || 0) + 1;
    });
    return acc;
  }, {});

  const topServices = Object.entries(serviceAssignments)?.sort(([,a], [,b]) => b - a)?.slice(0, 3);

  const cards = [
    {
      title: 'Total Employees',
      value: totalEmployees,
      icon: 'Users',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: null
    },
    {
      title: 'Active Employees',
      value: activeEmployees,
      icon: 'UserCheck',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: totalEmployees > 0 ? `${Math.round((activeEmployees / totalEmployees) * 100)}%` : '0%'
    },
    {
      title: 'Inactive Employees',
      value: inactiveEmployees,
      icon: 'UserX',
      color: 'text-error',
      bgColor: 'bg-error/10',
      change: totalEmployees > 0 ? `${Math.round((inactiveEmployees / totalEmployees) * 100)}%` : '0%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4">
        {cards?.map((card, index) => (
          <div key={index} className="bg-card rounded-lg border border-border p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {card?.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {card?.value?.toLocaleString()}
                </p>
                {card?.change && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {card?.change} of total
                  </p>
                )}
              </div>
              <div className={`w-12 h-12 rounded-lg ${card?.bgColor} flex items-center justify-center`}>
                <Icon name={card?.icon} size={24} className={card?.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Service Assignment Distribution */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Service Assignments</h3>
          <Icon name="BarChart3" size={20} className="text-muted-foreground" />
        </div>
        
        {topServices?.length > 0 ? (
          <div className="space-y-4">
            {topServices?.map(([serviceName, count], index) => {
              const percentage = totalEmployees > 0 ? (count / totalEmployees) * 100 : 0;
              return (
                <div key={serviceName} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground truncate">
                      {serviceName}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {count} employee{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === 0 ? 'bg-primary' : 
                        index === 1 ? 'bg-accent' : 'bg-secondary'
                      }`}
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {percentage?.toFixed(1)}% of employees
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Icon name="BarChart3" size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No service assignments yet
            </p>
          </div>
        )}
      </div>
      {/* Quick Stats */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Avg. Services per Employee</span>
            <span className="text-sm font-medium text-foreground">
              {totalEmployees > 0 
                ? (employees?.reduce((sum, emp) => sum + emp?.assignedWorks?.length, 0) / totalEmployees)?.toFixed(1)
                : '0'
              }
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Most Recent Login</span>
            <span className="text-sm font-medium text-foreground">
              {employees?.length > 0 
                ? new Date(Math.max(...employees.map(emp => new Date(emp.lastLogin))))?.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })
                : 'N/A'
              }
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Unassigned Employees</span>
            <span className="text-sm font-medium text-foreground">
              {employees?.filter(emp => emp?.assignedWorks?.length === 0)?.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSummaryCards;