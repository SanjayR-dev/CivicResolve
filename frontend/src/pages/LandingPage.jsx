import React, { useState, useEffect } from 'react';
import {
  Building2,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  Camera,
  Activity,
  Layers,
  Send,
  Users
} from 'lucide-react';
import { getAnalytics } from '../services/api.js';
import PriorityBadge from '../components/PriorityBadge.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function LandingPage({ setActiveTab, complaints = [] }) {
  const [stats, setStats] = useState({
    total: 24,
    reported: 8,
    inProgress: 11,
    resolved: 5,
    critical: 4,
    avgResolutionHours: 18.5
  });

  useEffect(() => {
    getAnalytics()
      .then((data) => {
        if (data.success && data.analytics) {
          setStats(data.analytics);
        }
      })
      .catch((err) => console.log('Analytics loading:', err.message));
  }, []);

  const recentItems = complaints.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white pt-16 pb-24 border-b border-slate-800">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Next-Gen Civic Governance Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Report. Track. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">Resolve.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Empowering citizens to report public infrastructure issues with intelligent 
              <span className="text-blue-400 font-medium"> Google Gemini AI </span> 
              triage, instant departmental dispatch, and real-time resolution transparency.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setActiveTab('report')}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Report an Issue</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('citizen')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors"
              >
                <span>Citizen Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('track')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
              >
                <span>Track Grievance</span>
              </button>
            </div>

            {/* Live Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 text-left">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/60 p-4 rounded-xl">
                <span className="text-xs uppercase tracking-wider text-slate-400 block font-semibold">Total Grievances</span>
                <span className="text-3xl font-extrabold text-white mt-1 block">{stats.total || complaints.length || 24}</span>
                <span className="text-[11px] text-blue-400 font-medium">Civic records indexed</span>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/60 p-4 rounded-xl">
                <span className="text-xs uppercase tracking-wider text-slate-400 block font-semibold">In Progress</span>
                <span className="text-3xl font-extrabold text-indigo-400 mt-1 block">{stats.inProgress || 11}</span>
                <span className="text-[11px] text-slate-400 font-medium">Field crews deployed</span>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/60 p-4 rounded-xl">
                <span className="text-xs uppercase tracking-wider text-slate-400 block font-semibold">Resolved</span>
                <span className="text-3xl font-extrabold text-emerald-400 mt-1 block">{stats.resolved || 8}</span>
                <span className="text-[11px] text-emerald-400/80 font-medium">{stats.resolutionRate || 68}% completion rate</span>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/60 p-4 rounded-xl">
                <span className="text-xs uppercase tracking-wider text-slate-400 block font-semibold">Avg Turnaround</span>
                <span className="text-3xl font-extrabold text-amber-400 mt-1 block">{stats.avgResolutionHours || 18.5}h</span>
                <span className="text-[11px] text-slate-400 font-medium">Fast civic triage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Workflow Architecture
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
              How CivicResolve Solves Urban Problems
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              A closed-loop civic intelligence pipeline connecting citizens directly to responsible municipal departments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-sm shadow-blue-500/30">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step 01</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Citizen Reports</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Snap an image, describe the defect, and capture precise GPS coordinates in under 30 seconds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-sm shadow-indigo-500/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Step 02</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Gemini AI Triage</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Multimodal AI classifies the domain, scores urgency (0-100), and routes to the correct municipal wing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-sm shadow-amber-500/30">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Step 03</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Field Dispatch</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Responsible engineers receive structured work orders, prioritized by danger to life and public order.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-sm shadow-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Step 04</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Audited Resolution</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Status progression updates live via real-time listeners. Verified resolution logs with citizen feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Grievances Showcase */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Live Civic Redressal Feed</h3>
              <p className="text-slate-600 text-sm">Real-time grievances currently being handled by municipal authorities</p>
            </div>
            <button
              onClick={() => setActiveTab('citizen')}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
            >
              <span>View all complaints</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveTab('citizen')}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {item.id}
                    </span>
                    <PriorityBadge priority={item.priority} size="sm" />
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm line-clamp-2 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {item.description}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3 mt-2 flex items-center justify-between text-xs">
                  <StatusBadge status={item.status} size="sm" />
                  <span className="text-slate-400 font-medium truncate max-w-[120px]">
                    {item.assigned_department?.split(' ')[0] || 'Civil'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="bg-slate-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Notice a civic issue in your neighborhood?
          </h3>
          <p className="text-slate-300 max-w-xl mx-auto text-sm mb-6">
            Help improve your city. Report road hazards, leaking pipes, open manholes, or sanitation overflows in seconds.
          </p>
          <button
            onClick={() => setActiveTab('report')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-transform hover:scale-105"
          >
            <Send className="w-4 h-4" />
            <span>Submit a Civic Grievance Now</span>
          </button>
        </div>
      </section>
    </div>
  );
}
