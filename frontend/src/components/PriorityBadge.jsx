import React from 'react';
import { AlertCircle, AlertTriangle, Info, ShieldCheck } from 'lucide-react';

export default function PriorityBadge({ priority, showIcon = true, size = 'md' }) {
  const p = priority || 'Medium';

  const config = {
    Critical: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
      dot: 'bg-rose-500 animate-pulse',
      icon: AlertCircle,
      label: 'Critical'
    },
    High: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-500/20',
      dot: 'bg-amber-500',
      icon: AlertTriangle,
      label: 'High'
    },
    Medium: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20',
      dot: 'bg-blue-500',
      icon: Info,
      label: 'Medium'
    },
    Low: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
      dot: 'bg-emerald-500',
      icon: ShieldCheck,
      label: 'Low'
    }
  }[p] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20',
    dot: 'bg-slate-500',
    icon: Info,
    label: p
  };

  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-semibold px-2.5 py-1',
    lg: 'text-sm font-semibold px-3 py-1.5'
  }[size] || 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-2xs font-medium tracking-wide uppercase ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {showIcon && <IconComponent className="w-3.5 h-3.5" />}
      {config.label}
    </span>
  );
}
