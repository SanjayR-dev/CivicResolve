import React, { useState } from 'react';
import {
  Search,
  Building,
  MapPin,
  Sparkles,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { getComplaintById } from '../services/api.js';
import PriorityBadge from '../components/PriorityBadge.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import Timeline from '../components/Timeline.jsx';

export default function TrackComplaint({ complaints = [], setActiveTab }) {
  const [queryId, setQueryId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!queryId.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await getComplaintById(queryId.trim());
      if (res.success && res.complaint) {
        setComplaint(res.complaint);
      } else {
        // Search local complaints array if API lookup returned false
        const local = complaints.find(
          (c) => c.id.toUpperCase() === queryId.trim().toUpperCase()
        );
        if (local) {
          setComplaint(local);
        } else {
          setError(`No record found with Complaint ID "${queryId.trim()}". Please verify the reference.`);
          setComplaint(null);
        }
      }
    } catch {
      const local = complaints.find(
        (c) => c.id.toUpperCase() === queryId.trim().toUpperCase()
      );
      if (local) {
        setComplaint(local);
      } else {
        setError(`No record found with Complaint ID "${queryId.trim()}".`);
        setComplaint(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Search Hero */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
          <Search className="w-3.5 h-3.5" />
          <span>Real-time Grievance Tracking</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Your Civic Grievance
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Enter your unique reference ID to verify current redressal status, assigned department, and live field logs.
        </p>

        {/* Search input form */}
        <form onSubmit={handleTrack} className="mt-6 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={queryId}
              onChange={(e) => setQueryId(e.target.value)}
              placeholder="e.g. CR-2026-8801"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-mono text-sm sm:text-base uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-sm shadow-md transition-all shrink-0"
          >
            {loading ? 'Searching...' : 'Track Grievance'}
          </button>
        </form>

        {/* Quick sample chips */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
          <span>Try sample IDs:</span>
          {complaints.slice(0, 3).map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setQueryId(c.id);
                setComplaint(c);
                setError('');
              }}
              className="font-mono text-blue-600 hover:underline"
            >
              {c.id}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 max-w-xl mx-auto mb-8">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Card */}
      {complaint && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-5 mb-6 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  {complaint.id}
                </span>
                <PriorityBadge priority={complaint.priority} size="sm" />
                <StatusBadge status={complaint.status} size="sm" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {complaint.title}
              </h2>
            </div>
            <div className="text-right text-xs text-slate-400">
              <span>Reported on: </span>
              <span className="text-slate-700 font-medium block">
                {new Date(complaint.created_at).toLocaleDateString([], {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Optional Image */}
          {complaint.imageUrl && (
            <div className="mb-6 rounded-xl overflow-hidden border border-slate-200 max-h-72 bg-slate-100">
              <img
                src={complaint.imageUrl}
                alt={complaint.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Meta Information Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-6 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Category</span>
              <span className="font-bold text-slate-800 mt-0.5 block">{complaint.category}</span>
              <span className="text-[11px] text-slate-500">{complaint.subcategory}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Assigned Municipal Wing</span>
              <span className="font-bold text-blue-800 mt-0.5 block">{complaint.assigned_department}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Location</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">{complaint.location}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Citizen Complaint Statement
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
              {complaint.description}
            </p>
          </div>

          {/* AI Analysis Box */}
          <div className={`mb-8 border rounded-xl p-4 ${
            complaint.isGeminiResult || complaint.is_ai_generated
              ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-blue-200'
              : 'bg-amber-50/60 border-amber-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                <Sparkles className={`w-4 h-4 ${
                  complaint.isGeminiResult || complaint.is_ai_generated ? 'text-blue-600' : 'text-amber-600'
                }`} />
                <span>
                  {complaint.isGeminiResult || complaint.is_ai_generated
                    ? (complaint.engine_name || 'Google Gemini AI Triage')
                    : 'Heuristic Rule Engine (Fallback)'}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                complaint.isGeminiResult || complaint.is_ai_generated
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {complaint.isGeminiResult || complaint.is_ai_generated ? '✨ Live AI Analysis' : '⚡ Heuristic Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-700 italic mb-2">
              "{complaint.rationale || complaint.classification_explanation}"
            </p>
            {(complaint.recommendedAction || complaint.suggested_action) && (
              <p className="text-xs text-slate-800 font-medium">
                <strong>Recommended Field Action:</strong> {complaint.recommendedAction || complaint.suggested_action}
              </p>
            )}
          </div>

          {/* Step Timeline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Redressal Status Progression
            </h4>
            <Timeline
              status={complaint.status}
              statusHistory={complaint.status_history || []}
            />
          </div>
        </div>
      )}
    </div>
  );
}
