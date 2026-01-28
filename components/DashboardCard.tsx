
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, trend, trendUp }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <span className="text-slate-500 text-sm font-medium">{title}</span>
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      {trend && (
        <div className={`text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </div>
      )}
    </div>
  );
};
