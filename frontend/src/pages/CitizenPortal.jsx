import React, { useState } from 'react';
import {
  Send,
  MapPin,
  Camera,
  X,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Upload,
  ArrowRight,
  Shield,
  Building,
  Info
} from 'lucide-react';
import { submitComplaint } from '../services/api.js';
import PriorityBadge from '../components/PriorityBadge.jsx';

export default function CitizenPortal({ onComplaintSubmitted, setActiveTab }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [citizenName, setCitizenName] = useState('');
  const [citizenContact, setCitizenContact] = useState('');

  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Geo-location loading state
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successComplaint, setSuccessComplaint] = useState(null);

  // Handle GPS location detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLoading(true);
    setGeoError('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoordinates({ lat: latitude, lng: longitude });

        // Reverse geocode via free OpenStreetMap Nominatim or standard fallback
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          if (res.ok) {
            const data = await res.json();
            setLocation(data.display_name || `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
          } else {
            setLocation(`Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)} (GPS Verified)`);
          }
        } catch {
          setLocation(`Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)} (GPS Verified)`);
        } finally {
          setGeoLoading(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGeoError('Location access denied or unavailable. Please enter address manually.');
        setGeoLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('File size exceeds 8MB. Please select a smaller photo.');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setSubmitError('Please provide both an issue title and detailed description.');
      return;
    }
    if (!location.trim()) {
      setSubmitError('Please specify the location or use Current Location detection.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('location', location.trim());
      if (coordinates) {
        formData.append('latitude', coordinates.lat);
        formData.append('longitude', coordinates.lng);
      }
      if (citizenName.trim()) formData.append('citizen_name', citizenName.trim());
      if (citizenContact.trim()) formData.append('citizen_contact', citizenContact.trim());
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await submitComplaint(formData);
      if (res.success && res.complaint) {
        setSuccessComplaint(res.complaint);
        if (onComplaintSubmitted) {
          onComplaintSubmitted(res.complaint);
        }
        // Reset form
        setTitle('');
        setDescription('');
        setLocation('');
        setCoordinates(null);
        setImageFile(null);
        setImagePreview(null);
      } else {
        setSubmitError(res.message || 'Failed to submit complaint.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError(err.response?.data?.message || err.message || 'Error communicating with server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Citizen Grievance Portal</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Report a Public Civic Issue
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Provide details of public infrastructure damage. Google Gemini AI will inspect your report, assess urgency, and assign the appropriate civic department.
        </p>
      </div>

      {/* Main Submission Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        {submitError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-semibold">Submission Incomplete</p>
              <p className="text-xs text-rose-700 mt-0.5">{submitError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issue Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Complaint Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hazardous deep pothole on 4th Main Road"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the nature of the hazard, dimensions, risk to vehicles or pedestrians, how long it has persisted..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>Gemini AI scans description keywords to determine urgency score (0-100) and department.</span>
            </p>
          </div>

          {/* Location & GPS Detection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Location & Landmark <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={geoLoading}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50 transition-colors"
              >
                {geoLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <MapPin className="w-3.5 h-3.5" />
                )}
                <span>{geoLoading ? 'Detecting GPS...' : 'Detect Current Location'}</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter street, landmark, sector, or click Detect Current Location above"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {coordinates && (
              <div className="mt-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-flex items-center gap-1 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>GPS Coordinates Locked: {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}</span>
              </div>
            )}
            {geoError && (
              <p className="text-xs text-rose-600 mt-1">{geoError}</p>
            )}
          </div>

          {/* Optional Image Upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Site Photograph (Optional, Recommended for AI Visual Inspection)
            </label>

            {!imagePreview ? (
              <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/30 transition-all">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  Click to upload or drag & drop photo
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  PNG, JPG, WebP up to 8MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-w-sm">
                <img
                  src={imagePreview}
                  alt="Complaint Preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors shadow"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="p-2 bg-white text-[11px] text-slate-600 flex items-center justify-between border-t border-slate-200">
                  <span className="truncate">{imageFile?.name || 'Photo attached'}</span>
                  <span className="text-emerald-600 font-semibold">Ready for AI Analysis</span>
                </div>
              </div>
            )}
          </div>

          {/* Citizen Contact (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Your Name (Optional)
              </label>
              <input
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Contact Phone or Email (Optional)
              </label>
              <input
                type="text"
                value={citizenContact}
                onChange={(e) => setCitizenContact(e.target.value)}
                placeholder="For status SMS / updates"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-60 shadow-md shadow-blue-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing with Gemini AI Triage Engine...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Complaint & Trigger AI Triage</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              By submitting, your grievance is entered into the municipal audit ledger with verifiable timestamps.
            </p>
          </div>
        </form>
      </div>

      {/* Success Modal Showing Gemini Analysis Breakdown */}
      {successComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Grievance Registered!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Complaint Reference ID: <span className="font-mono font-bold text-blue-600 text-sm">{successComplaint.id}</span>
              </p>
            </div>

            {/* AI Triage Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    successComplaint.isGeminiResult || successComplaint.is_ai_generated
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                      {successComplaint.isGeminiResult || successComplaint.is_ai_generated
                        ? (successComplaint.engine_name || 'Google Gemini 2.0 Flash')
                        : 'Heuristic Rule Engine (Fallback)'}
                    </span>
                    <span className={`text-[10px] font-bold flex items-center gap-1 ${
                      successComplaint.isGeminiResult || successComplaint.is_ai_generated
                        ? 'text-emerald-700'
                        : 'text-amber-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        successComplaint.isGeminiResult || successComplaint.is_ai_generated
                          ? 'bg-emerald-500 animate-pulse'
                          : 'bg-amber-500'
                      }`} />
                      {successComplaint.isGeminiResult || successComplaint.is_ai_generated
                        ? 'Live Cloud AI Vision & NLP Triage'
                        : 'Algorithmic Fallback Active'}
                    </span>
                  </div>
                </div>
                <PriorityBadge priority={successComplaint.priority} size="md" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Domain Category</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{successComplaint.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Urgency Rating</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-bold text-slate-900">{successComplaint.urgency_score}/100</span>
                    <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${successComplaint.urgency_score}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block font-medium">Routed Department</span>
                  <span className="font-semibold text-blue-700 mt-0.5 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" />
                    <span>{successComplaint.assigned_department}</span>
                  </span>
                </div>
              </div>

              {successComplaint.classification_explanation && (
                <div className="border-t border-slate-200/80 pt-3">
                  <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                    AI Rationale
                  </span>
                  <p className="text-xs text-slate-600 italic">
                    "{successComplaint.classification_explanation}"
                  </p>
                </div>
              )}

              {successComplaint.suggested_action && (
                <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-200/60">
                  <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wide block mb-1">
                    Recommended Field Action
                  </span>
                  <p className="text-xs text-blue-900">
                    {successComplaint.suggested_action}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setSuccessComplaint(null);
                  setActiveTab('citizen');
                }}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 text-xs sm:text-sm text-center shadow"
              >
                View on Citizen Dashboard
              </button>
              <button
                onClick={() => setSuccessComplaint(null)}
                className="py-3 px-4 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs sm:text-sm text-center"
              >
                Submit Another Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
