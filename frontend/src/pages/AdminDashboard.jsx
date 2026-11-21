import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertTriangle,
  Building,
  Edit3,
  MapPin,
  Sparkles,
  ChevronRight,
  X,
  Save,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { updateComplaintStatus } from '../services/api.js';
import PriorityBadge from '../components/PriorityBadge.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import Timeline from '../components/Timeline.jsx';

export default function AdminDashboard({ complaints = [], onComplaintUpdated, isAdminMode, setIsAdminMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Active editing complaint state
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Department options for re-assignment
  const departments = [
    'Public Works Department (PWD)',
    'Municipal Sanitation & Waste Management',
    'State Electricity Distribution Board',
    'Municipal Water Supply & Sewerage Board',
    'Stormwater & Drainage Maintenance Wing',
    'Civic Safety & Law Enforcement Dept',
    'General Grievance Redressal Cell'
  ];

  // Quick KPI calculation
  const total = complaints.length;
  const reported = complaints.filter((c) => c.status === 'Reported').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;
  const critical = complaints.filter((c) => c.priority === 'Critical').length;

  // Filter complaints
  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.assigned_department?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesPriority = selectedPriority === 'All' || c.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const openEditModal = (complaint) => {
    setEditingComplaint(complaint);
    setNewStatus(complaint.status);
    setNewDepartment(complaint.assigned_department);
    setAdminRemarks('');
    setSaveError('');
    setSaveSuccess(false);
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    if (!editingComplaint) return;

    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const payload = {
        status: newStatus,
        assigned_department: newDepartment,
        remarks: adminRemarks.trim(),
        updated_by: 'Municipal Authority (Admin Command)'
      };

      const res = await updateComplaintStatus(editingComplaint.id, payload);
      if (res.success && res.complaint) {
        setSaveSuccess(true);
        if (onComplaintUpdated) {
          onComplaintUpdated(res.complaint);
        }
        setTimeout(() => {
          setEditingComplaint(null);
          setSaveSuccess(false);
        }, 800);
      } else {
        setSaveError(res.message || 'Failed to update complaint.');
      }
    } catch (err) {
      console.error('Update error:', err);
      setSaveError(err.response?.data?.message || err.message || 'Server error occurred.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Demo Admin Notification Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-5 mb-8 border border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center font-bold shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-wide">
                Municipal Authority Command Console
              </span>
              <span className="text-[10px] uppercase font-extrabold tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full">
                Demo Admin Mode
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Authorized municipal officer role. Direct privileges to triage, reassign wings, log action notes, and advance statuses.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdminMode(!isAdminMode)}
          className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shrink-0"
        >
          {isAdminMode ? 'Disable Demo Admin Mode' : 'Enable Demo Admin Mode'}
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">Total Inflow</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block">{total}</span>
          <span className="text-[11px] text-slate-500 font-medium">All logged grievances</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-xs uppercase font-bold tracking-wider text-sky-700 block">Reported</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-sky-600 mt-1 block">{reported}</span>
          <span className="text-[11px] text-slate-500 font-medium">Awaiting action</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-700 block">In Progress</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 mt-1 block">{inProgress}</span>
          <span className="text-[11px] text-slate-500 font-medium">Field crew active</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 block">Resolved</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1 block">{resolved}</span>
          <span className="text-[11px] text-emerald-600 font-medium">
            {total > 0 ? Math.round((resolved / total) * 100) : 0}% clearance
          </span>
        </div>

        <div className="bg-white rounded-xl border border-rose-200 p-4 shadow-2xs bg-rose-50/30">
          <span className="text-xs uppercase font-bold tracking-wider text-rose-700 block">Critical Threats</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-1 block">{critical}</span>
          <span className="text-[11px] text-rose-600 font-medium">Requires rapid response</span>
        </div>
      </div>

      {/* Filter and Management Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by ID, keywords, department..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Categories</option>
              <option value="Road Infrastructure">Road Infrastructure</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Electricity">Electricity</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Drainage">Drainage</option>
              <option value="Public Safety">Public Safety</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table of Complaints */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold text-[11px]">
                <th className="py-3.5 px-4">Complaint ID</th>
                <th className="py-3.5 px-4">Title & Details</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Priority & Urgency</th>
                <th className="py-3.5 px-4">Assigned Department</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No complaints match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 whitespace-nowrap">
                      {item.id}
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-slate-900 truncate" title={item.title}>
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate" title={item.location}>
                        📍 {item.location}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-medium text-slate-800">{item.category}</span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">
                        {item.subcategory}
                      </span>
                    </td>

                    {/* Priority & Urgency */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <PriorityBadge priority={item.priority} size="sm" />
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-700">{item.urgency_score}/100</span>
                          <span className="text-[10px] text-slate-400">urgency</span>
                        </div>
                      </div>
                    </td>

                    {/* Assigned Department */}
                    <td className="py-3.5 px-4 max-w-[180px]">
                      <span className="font-medium text-slate-700 block truncate" title={item.assigned_department}>
                        {item.assigned_department}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={item.status} size="sm" />
                    </td>

                    {/* Action button */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 hover:border-blue-600 transition-all shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Action / Management Modal */}
      {editingComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {editingComplaint.id}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  Manage Complaint & Triage
                </h3>
              </div>
              <button
                onClick={() => setEditingComplaint(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Complaint updated and synchronized across all dashboards!</span>
              </div>
            )}

            {saveError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{saveError}</span>
              </div>
            )}

            {/* Complaint summary header */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{editingComplaint.title}</span>
                <PriorityBadge priority={editingComplaint.priority} size="sm" />
              </div>
              <p className="text-slate-600">{editingComplaint.description}</p>
              <p className="text-slate-500 font-medium">📍 {editingComplaint.location}</p>
            </div>

            <form onSubmit={handleSaveUpdate} className="space-y-4">
              {/* Update Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Update Redressal Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Reported">Reported (Logged & Pending Field Action)</option>
                  <option value="In Progress">In Progress (Field Crew Deployed on Site)</option>
                  <option value="Resolved">Resolved (Work Completed & Verified)</option>
                </select>
              </div>

              {/* Re-assign Department */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Responsible Municipal Department
                </label>
                <select
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-300 text-slate-800 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Admin Remarks */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Official Admin Remarks / Field Dispatch Notes
                </label>
                <textarea
                  rows={3}
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                  placeholder="e.g. Work order #WO-401 issued to road asphalt team. Repair scheduled for 3 PM."
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[10px] text-slate-400">
                  Notes are permanently recorded into the complaint's transparent audit history.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingComplaint(null)}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Updates...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save & Synchronize</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
