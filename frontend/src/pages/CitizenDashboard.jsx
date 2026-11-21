import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Clock,
  Building,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  X,
  ExternalLink
} from 'lucide-react';
import PriorityBadge from '../components/PriorityBadge.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import Timeline from '../components/Timeline.jsx';

export default function CitizenDashboard({ complaints = [], setActiveTab }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const categories = [
    'All',
    'Road Infrastructure',
    'Sanitation',
    'Electricity',
    'Water Supply',
    'Drainage',
    'Public Safety',
    'Other'
  ];

  const statuses = ['All', 'Reported', 'In Progress', 'Resolved'];

  // Filter complaints
  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.assigned_department?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Citizen Grievance Redressal Feed
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Real-time tracking of civic reports, AI triage decisions, and municipal field status updates.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('report')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/30 transition-all hover:-translate-y-0.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Grievance</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, keyword, landmark, or department..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st === 'All' ? 'All Statuses' : `Status: ${st}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Stat Counter pill */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filtered.length}</strong> of{' '}
            <strong className="text-slate-800">{complaints.length}</strong> complaints
          </span>
          <span className="flex items-center gap-1.5 text-blue-600 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <span>Live Firestore Syncing</span>
          </span>
        </div>
      </div>

      {/* Grievance Grid / Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Complaints Match Your Filter</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or reset category and status filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedStatus('All');
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Optional Image thumbnail banner */}
              {complaint.imageUrl && (
                <div className="h-36 w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={complaint.imageUrl}
                    alt={complaint.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <PriorityBadge priority={complaint.priority} size="sm" />
                  </div>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                      {complaint.id}
                    </span>
                    {!complaint.imageUrl && (
                      <PriorityBadge priority={complaint.priority} size="sm" />
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {complaint.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {complaint.description}
                  </p>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
                  {/* Category & Subcategory */}
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400 font-medium">Category</span>
                    <span className="font-semibold text-slate-800">{complaint.category}</span>
                  </div>

                  {/* Department */}
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400 font-medium">Department</span>
                    <span className="font-medium text-slate-700 truncate max-w-[180px]" title={complaint.assigned_department}>
                      {complaint.assigned_department}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-slate-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{complaint.location}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                <StatusBadge status={complaint.status} size="sm" />
                <button
                  onClick={() => setSelectedComplaint(complaint)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Track & Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Complaint Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {selectedComplaint.id}
                  </span>
                  <PriorityBadge priority={selectedComplaint.priority} size="sm" />
                  <StatusBadge status={selectedComplaint.status} size="sm" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {selectedComplaint.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Optional Image */}
            {selectedComplaint.imageUrl && (
              <div className="mb-6 rounded-xl overflow-hidden border border-slate-200 max-h-64 bg-slate-100">
                <img
                  src={selectedComplaint.imageUrl}
                  alt={selectedComplaint.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Complaint Meta info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-6 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Category</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{selectedComplaint.category}</span>
                <span className="text-[11px] text-slate-500">{selectedComplaint.subcategory}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Assigned Department</span>
                <span className="font-bold text-blue-800 mt-0.5 block">{selectedComplaint.assigned_department}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Location</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{selectedComplaint.location}</span>
                {selectedComplaint.coordinates && (
                  <span className="text-[10px] text-emerald-600 font-mono">
                    GPS: {selectedComplaint.coordinates.lat.toFixed(4)}, {selectedComplaint.coordinates.lng.toFixed(4)}
                  </span>
                )}
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Urgency Score</span>
                <span className="font-bold text-rose-600 mt-0.5 text-sm block">
                  {selectedComplaint.urgency_score} / 100
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Issue Description
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                {selectedComplaint.description}
              </p>
            </div>

            {/* AI Triage Insights */}
            <div className={`mb-6 rounded-xl p-4 border ${
              selectedComplaint.isGeminiResult || selectedComplaint.is_ai_generated
                ? 'bg-gradient-to-br from-indigo-50/80 to-blue-50/80 border-indigo-200'
                : 'bg-amber-50/50 border-amber-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${
                    selectedComplaint.isGeminiResult || selectedComplaint.is_ai_generated ? 'text-indigo-600' : 'text-amber-600'
                  }`} />
                  <span className="text-slate-900 font-bold text-xs uppercase tracking-wider">
                    {selectedComplaint.isGeminiResult || selectedComplaint.is_ai_generated
                      ? (selectedComplaint.engine_name || 'Google Gemini AI Triage')
                      : 'Heuristic Rule Engine (Fallback)'}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedComplaint.isGeminiResult || selectedComplaint.is_ai_generated
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {selectedComplaint.isGeminiResult || selectedComplaint.is_ai_generated ? '✨ Live AI Analysis' : '⚡ Heuristic Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-700 italic leading-relaxed mb-2">
                "{selectedComplaint.rationale || selectedComplaint.classification_explanation || 'Assessed based on civic disruption metrics and public risk score.'}"
              </p>
              {(selectedComplaint.recommendedAction || selectedComplaint.suggested_action) && (
                <div className="mt-2 pt-2 border-t border-slate-200/60 text-xs">
                  <span className="font-bold text-slate-800">Recommended Action: </span>
                  <span className="text-slate-700">{selectedComplaint.recommendedAction || selectedComplaint.suggested_action}</span>
                </div>
              )}
            </div>

            {/* Progression Timeline */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Status Progression Timeline
              </h4>
              <Timeline
                status={selectedComplaint.status}
                statusHistory={selectedComplaint.status_history || []}
              />
            </div>

            {/* Close Button */}
            <div className="pt-2">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs text-center"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
