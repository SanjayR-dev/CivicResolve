import React from 'react';
import { Building2, Heart, Shield, Radio, CheckCircle, PhoneCall } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Building2 className="w-5 h-5 text-blue-400" />
              <span>CIVIC<span className="text-blue-400">RESOLVE</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering urban citizens with AI-driven public grievance triage, real-time tracking, and municipal accountability.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Civic Systems Operational</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('report')} className="hover:text-blue-400 transition-colors">
                  Report Public Grievance
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('citizen')} className="hover:text-blue-400 transition-colors">
                  Citizen Grievance Portal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('track')} className="hover:text-blue-400 transition-colors">
                  Track Grievance by ID
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('analytics')} className="hover:text-blue-400 transition-colors">
                  Open Civic Data & Insights
                </button>
              </li>
            </ul>
          </div>

          {/* Department Directory */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Integrated Wings
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Public Works Department (PWD)</li>
              <li>• Municipal Sanitation & Waste</li>
              <li>• Electricity Distribution Board</li>
              <li>• Water Supply & Sewerage Board</li>
              <li>• Stormwater Drainage Maintenance</li>
              <li>• Civic Safety & Law Enforcement</li>
            </ul>
          </div>

          {/* Emergency & Municipal Helplines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Civic Helplines
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 bg-slate-800/60 p-2 rounded-lg border border-slate-700/60">
                <PhoneCall className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <span className="text-slate-200 font-semibold block">Civic Toll-Free: 1913</span>
                  <span className="text-[11px] text-slate-400">24x7 Emergency Grievances</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/60 p-2 rounded-lg border border-slate-700/60">
                <Shield className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <span className="text-slate-200 font-semibold block">Smart City Command: 1800-425</span>
                  <span className="text-[11px] text-slate-400">Central Monitoring Cell</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 CivicResolve. AI-Powered Citizen Grievance Management and Resolution Platform.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Smart Cities
            </span>
            <span>•</span>
            <span>Google Gemini 2.5 Flash</span>
            <span>•</span>
            <span>Firebase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
