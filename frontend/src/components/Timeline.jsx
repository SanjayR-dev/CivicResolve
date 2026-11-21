import React from 'react';
import { Check, Clock, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function Timeline({ status = 'Reported', statusHistory = [] }) {
  const steps = [
    { key: 'Reported', label: '1. Reported', desc: 'Complaint registered & AI triaged', icon: Clock },
    { key: 'In Progress', label: '2. In Progress', desc: 'Assigned to field division', icon: RefreshCw },
    { key: 'Resolved', label: '3. Resolved', desc: 'Resolution verified by authority', icon: CheckCircle2 }
  ];

  const getStepIndex = (st) => {
    if (st === 'Resolved') return 2;
    if (st === 'In Progress') return 1;
    return 0;
  };

  const currentIdx = getStepIndex(status);

  return (
    <div className="w-full">
      {/* Visual Step Bar */}
      <div className="relative flex items-center justify-between my-6 px-4">
        {/* Connecting Line Background */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />
        
        {/* Active Progress Line */}
        <div
          className="absolute left-8 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-500 z-0"
          style={{ width: `${(currentIdx / (steps.length - 1)) * 82}%` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-md ${
                  isCompleted
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                    : isCurrent
                    ? 'bg-navy-900 text-white ring-4 ring-blue-200 animate-pulse'
                    : 'bg-white text-slate-400 border-2 border-slate-300'
                }`}
                style={isCurrent ? { backgroundColor: '#1e3a8a' } : {}}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : <StepIcon className="w-4 h-4" />}
              </div>
              <div className="text-center mt-2">
                <p className={`text-xs font-semibold ${isCurrent || isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-slate-500 hidden sm:block max-w-[100px]">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Status History Log */}
      {statusHistory && statusHistory.length > 0 && (
        <div className="mt-6 border-t border-slate-100 pt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Redressal Activity Log
          </h4>
          <div className="space-y-3">
            {statusHistory.map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                <div className="mt-0.5 w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">
                      {item.status} — <span className="font-normal text-slate-600">{item.updated_by || 'Admin'}</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {item.timestamp ? new Date(item.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                    </span>
                  </div>
                  {item.remarks && (
                    <p className="text-slate-600 mt-1 italic">
                      "{item.remarks}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
