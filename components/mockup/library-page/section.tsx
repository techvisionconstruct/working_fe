import React, { ReactNode } from "react";

interface SectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, description, children, icon, action }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
};
