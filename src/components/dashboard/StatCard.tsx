import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType<{ className?: string }>;
  suffix?: string;
  footer?: React.ReactNode;
}

export const StatCard = ({ title, value, icon: Icon, suffix, footer }: StatCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/40 p-6 shadow-sm backdrop-blur-sm">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Icon className="size-16" />
      </div>
      <p className="mb-1 text-sm font-medium text-muted-foreground">
        {title}
      </p>
      <p className="text-3xl font-bold tracking-tight text-foreground">
        {value}
        {suffix && (
          <span className="ml-1 text-base font-normal text-muted-foreground">
            {suffix}
          </span>
        )}
      </p>
      {footer && <div className="mt-2 text-xs text-muted-foreground">{footer}</div>}
    </div>
  );
};
