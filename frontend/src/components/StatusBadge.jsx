import React from 'react';
import { Clock, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function StatusBadge({ status, size = 'md' }) {
  const s = status || 'Reported';

  const config = {
    Reported: {
      bg: 'bg-sky-50 text-sky-800 border-sky-200',
      icon: Clock,
      label: 'Reported'
    },
    'In Progress': {
      bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      icon: RefreshCw,
      label: 'In Progress',
      spin: true
    },
    Resolved: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle2,
      label: 'Resolved'
    }
  }[s] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock,
    label: s
  };

  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-semibold px-2.5 py-1',
    lg: 'text-sm font-semibold px-3 py-1.5'
  }[size] || 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium ${config.bg} ${sizeClasses}`}
    >
      <IconComponent className={`w-3.5 h-3.5 ${config.spin ? 'animate-spin' : ''}`} />
      <span>{config.label}</span>
    </span>
  );
}
