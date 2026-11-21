import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { syncComplaintToFirestore } from '../services/firebaseService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'complaints.json');

// Initial seed data with high-quality realistic civic complaints
const SEED_COMPLAINTS = [
  {
    id: "CR-2026-8801",
    title: "Dangerous Sinkhole Opening on 4th Main Crossroad",
    description: "Deep sinkhole measuring approx 4ft across has caved in next to the public school bus stop. Pavement collapsing rapidly under heavy traffic.",
    location: "4th Main Road, Near St. Mary's Academy, Sector 4",
    coordinates: { lat: 12.9716, lng: 77.5946 },
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    category: "Road Infrastructure",
    subcategory: "Hazardous Road Defect / Sinkhole",
    priority: "Critical",
    urgency_score: 96,
    assigned_department: "Public Works Department (PWD)",
    status: "In Progress",
    classification_explanation: "Severe immediate hazard situated directly adjacent to a school transit zone with imminent risk of vehicular collapse.",
    suggested_action: "Erect immediate perimeter barriers and deploy rapid concrete backfill crew.",
    ai_status: "success",
    is_ai_generated: true,
    citizen_name: "Anita Sharma",
    citizen_contact: "anita.s@example.com",
    created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    status_history: [
      {
        status: "Reported",
        timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        remarks: "Grievance registered via CivicResolve Citizen Portal. AI triage assigned Critical priority.",
        updated_by: "System / AI Triage"
      },
      {
        status: "In Progress",
        timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        remarks: "Site inspected by Junior Engineer M. Rao. Barricades placed; excavation crew mobilized.",
        updated_by: "Admin: PWD Division Office"
      }
    ]
  },
  {
    id: "CR-2026-8802",
    title: "Major Drinking Water Pipe Fracture & Street Flooding",
    description: "Treated potable water distribution line cracked near Metro Pillar 142. Clean water gushing at high pressure, submerging pedestrian pathway.",
    location: "Outer Ring Road, Metro Pillar 142, Indiranagar",
    coordinates: { lat: 12.9784, lng: 77.6408 },
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18f156f?auto=format&fit=crop&w=800&q=80",
    category: "Water Supply",
    subcategory: "Major Main Pipeline Burst",
    priority: "Critical",
    urgency_score: 92,
    assigned_department: "Municipal Water Supply & Sewerage Board",
    status: "Reported",
    classification_explanation: "High-volume wastage of purified civic drinking water paired with localized pedestrian roadway inundation.",
    suggested_action: "Isolate sector sluice valve and initiate emergency pipe clamp replacement.",
    ai_status: "success",
    is_ai_generated: true,
    citizen_name: "Rahul Verma",
    citizen_contact: "rahul.v@example.com",
    created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    status_history: [
      {
        status: "Reported",
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        remarks: "Reported with geocoded coordinates. Dispatched notification to Water Board rapid response.",
        updated_by: "System / AI Triage"
      }
    ]
  },
  {
    id: "CR-2026-8803",
    title: "Overflowing Commercial Trash Compactor & Foul Odor",
    description: "Municipal waste bin near vegetable market has been uncollected for 5 days. Garbage spilled onto road blocking half the lane and creating health hazard.",
    location: "Gandhi Market South Gate, Old City Area",
    coordinates: { lat: 12.9650, lng: 77.5810 },
    imageUrl: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80",
    category: "Sanitation",
    subcategory: "Illegal Garbage Dumping / Waste Overflow",
    priority: "High",
    urgency_score: 76,
    assigned_department: "Municipal Sanitation & Waste Management",
    status: "In Progress",
    classification_explanation: "Significant public health risk and bio-burden near fresh food vending zone with traffic restriction.",
    suggested_action: "Deploy dual hydraulic compactor trucks and disinfect ground with lime powder.",
    ai_status: "success",
    is_ai_generated: true,
    citizen_name: "Sunil Kulkarni",
    citizen_contact: "sunil.k@example.com",
    created_at: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    status_history: [
      {
        status: "Reported",
        timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
        remarks: "Complaint received and categorized as Sanitation priority.",
        updated_by: "System / AI Triage"
      },
      {
        status: "In Progress",
        timestamp: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
        remarks: "Compactor vehicle assigned (Truck #KA-03-9122). Waste clearing underway.",
        updated_by: "Admin: Sanitation Supervisor"
      }
    ]
  },
  {
    id: "CR-2026-8804",
    title: "Open Storm Drain Manhole on Pedestrian Sidewalk",
    description: "Cast iron manhole lid missing on sidewalk. Multiple pedestrians have narrowly avoided falling in during evening hours.",
    location: "17th Cross, Residential Layout Phase 2, Koramangala",
    coordinates: { lat: 12.9352, lng: 77.6245 },
    imageUrl: null,
    category: "Drainage",
    subcategory: "Open / Missing Manhole Cover",
    priority: "Critical",
    urgency_score: 95,
    assigned_department: "Stormwater & Drainage Maintenance Wing",
    status: "Resolved",
    classification_explanation: "Extreme fall hazard on designated footway creating severe threat to life, particularly after sundown.",
    suggested_action: "Immediate barricade placement followed by standard heavy-duty cast concrete lid installation.",
    ai_status: "success",
    is_ai_generated: true,
    citizen_name: "Priya Nair",
    citizen_contact: "priya.n@example.com",
    created_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    status_history: [
      {
        status: "Reported",
        timestamp: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
        remarks: "Emergency civic hazard reported by citizen.",
        updated_by: "System / AI Triage"
      },
      {
        status: "In Progress",
        timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        remarks: "Warning cones placed by traffic wardens. Replacement slab ordered from central depot.",
        updated_by: "Admin: Ward 142 Engineer"
      },
      {
        status: "Resolved",
        timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
        remarks: "Reinforced composite cover successfully fitted and level tested. Site cleared.",
        updated_by: "Admin: Ward 142 Engineer"
      }
    ]
  },
  {
    id: "CR-2026-8805",
    title: "Flickering & Completely Dark Streetlights on Hospital Road",
    description: "Four consecutive streetlights out along the ambulance ingress corridor leading to General Hospital. The road is pitch dark at night.",
    location: "Hospital Approach Road, Ward 22, Jayanagar",
    coordinates: { lat: 12.9299, lng: 77.5833 },
    imageUrl: null,
    category: "Electricity",
    subcategory: "Streetlight Fixture Malfunction",
    priority: "Medium",
    urgency_score: 58,
    assigned_department: "State Electricity Distribution Board",
    status: "Resolved",
    classification_explanation: "Lighting failure in a critical emergency transit area impacting nocturnal visibility and safety.",
    suggested_action: "Test phase cable loop and replace defective 90W LED driver modules.",
    ai_status: "success",
    is_ai_generated: true,
    citizen_name: "Dr. K. S. Raman",
    citizen_contact: "ksraman@example.com",
    created_at: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    status_history: [
      {
        status: "Reported",
        timestamp: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
        remarks: "Reported by hospital administration.",
        updated_by: "System / AI Triage"
      },
      {
        status: "In Progress",
        timestamp: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
        remarks: "Electrical crew dispatched with bucket lifter van.",
        updated_by: "Admin: Electrical Substation 4"
      },
      {
        status: "Resolved",
        timestamp: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
        remarks: "Replaced 3 blown LED driver units and restored lighting along 200m stretch.",
        updated_by: "Admin: Electrical Substation 4"
      }
    ]
  },
  {
    id: "CR-2026-8806",
    title: "Aggressive Stray Pack Encircling Park Play Area",
    description: "Pack of 8-10 aggressive stray canines congregating around children's play area in public garden. Two park visitors chased yesterday.",
    location: "Netaji Subhash Park, Children's Play Zone, West Enclave",
    coordinates: { lat: 12.9850, lng: 77.5533 },
    imageUrl: null,
    category: "Public Safety",
    subcategory: "Public Threat / Civic Hazard",
    priority: "High",
    urgency_score: 72,
    assigned_department: "Civic Safety & Law Enforcement Dept",
    status: "Reported",
    classification_explanation: "Direct threat to vulnerable populations (children and elderly) within recreational civic premises.",
    suggested_action: "Mobilize Animal Husbandry Squad for humane capture, vaccination, and sterilization protocol.",
    ai_status: "success",
    is_ai_generated: true,
    citizen_name: "Deepak Mehta",
    citizen_contact: "deepak.m@example.com",
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    status_history: [
      {
        status: "Reported",
        timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        remarks: "Complaint forwarded to Animal Control & Welfare wing.",
        updated_by: "System / AI Triage"
      }
    ]
  }
];

// Helper to ensure data directory and file exist
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(SEED_COMPLAINTS, null, 2), 'utf-8');
  }
}

export function getAllComplaints() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading complaints file:', err);
    return SEED_COMPLAINTS;
  }
}

export function saveComplaints(complaints) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(complaints, null, 2), 'utf-8');
}

export function getComplaintById(id) {
  const all = getAllComplaints();
  return all.find(c => c.id.toUpperCase() === id.trim().toUpperCase()) || null;
}

export function createComplaint(complaintData) {
  const all = getAllComplaints();
  
  // Generate human-friendly ID e.g. CR-2026-9042
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const id = `CR-2026-${randomSuffix}`;
  const now = new Date().toISOString();

  const newComplaint = {
    id,
    title: complaintData.title || "Untitled Grievance",
    description: complaintData.description || "",
    location: complaintData.location || "Location not specified",
    coordinates: complaintData.coordinates || null,
    imageUrl: complaintData.imageUrl || null,
    category: complaintData.category || "Other",
    subcategory: complaintData.subcategory || "General Civic Concern",
    priority: complaintData.priority || "Medium",
    urgencyScore: complaintData.urgencyScore !== undefined ? complaintData.urgencyScore : (complaintData.urgency_score !== undefined ? complaintData.urgency_score : 50),
    urgency_score: complaintData.urgency_score !== undefined ? complaintData.urgency_score : (complaintData.urgencyScore !== undefined ? complaintData.urgencyScore : 50),
    department: complaintData.department || complaintData.assigned_department || "General Grievance Redressal Cell",
    assigned_department: complaintData.assigned_department || complaintData.department || "General Grievance Redressal Cell",
    status: "Reported",
    rationale: complaintData.rationale || complaintData.classification_explanation || "Processed and recorded into municipal registry.",
    classification_explanation: complaintData.classification_explanation || complaintData.rationale || "Processed and recorded into municipal registry.",
    recommendedAction: complaintData.recommendedAction || complaintData.suggested_action || "Schedule routine municipal inspection.",
    suggested_action: complaintData.suggested_action || complaintData.recommendedAction || "Schedule routine municipal inspection.",
    ai_status: complaintData.ai_status || "fallback_heuristic",
    isGeminiResult: Boolean(complaintData.isGeminiResult),
    is_ai_generated: Boolean(complaintData.is_ai_generated),
    engine_name: complaintData.engine_name || (complaintData.is_ai_generated ? "Google Gemini AI" : "Heuristic Rule Engine (Fallback)"),
    model_used: complaintData.model_used || null,
    citizen_name: complaintData.citizen_name || "Concerned Citizen",
    citizen_contact: complaintData.citizen_contact || "",
    created_at: now,
    updated_at: now,
    status_history: [
      {
        status: "Reported",
        timestamp: now,
        remarks: complaintData.initial_remarks || "Grievance submitted by citizen and logged in CivicResolve platform.",
        updated_by: complaintData.is_ai_generated ? "CivicResolve AI Triage Engine" : "Citizen / Platform Entry"
      }
    ]
  };

  all.unshift(newComplaint);
  saveComplaints(all);
  // Asynchronously attempt to sync to Firestore if configured
  syncComplaintToFirestore(newComplaint).catch(() => {});
  return newComplaint;
}

export function updateComplaint(id, updates) {
  const all = getAllComplaints();
  const index = all.findIndex(c => c.id.toUpperCase() === id.trim().toUpperCase());
  if (index === -1) return null;

  const current = all[index];
  const now = new Date().toISOString();

  const updatedComplaint = {
    ...current,
    ...updates,
    updated_at: now
  };

  // If status changed or remarks added, append to status history
  if (updates.status && updates.status !== current.status) {
    const historyEntry = {
      status: updates.status,
      timestamp: now,
      remarks: updates.remarks || `Status updated from ${current.status} to ${updates.status}.`,
      updated_by: updates.updated_by || "Municipal Admin"
    };
    updatedComplaint.status_history = [...(current.status_history || []), historyEntry];
  } else if (updates.remarks && updates.remarks.trim() !== "") {
    const historyEntry = {
      status: current.status,
      timestamp: now,
      remarks: updates.remarks,
      updated_by: updates.updated_by || "Municipal Admin"
    };
    updatedComplaint.status_history = [...(current.status_history || []), historyEntry];
  }

  all[index] = updatedComplaint;
  saveComplaints(all);
  // Asynchronously attempt to sync update to Firestore if configured
  syncComplaintToFirestore(updatedComplaint).catch(() => {});
  return updatedComplaint;
}

export function getAnalyticsStats() {
  const all = getAllComplaints();
  
  const total = all.length;
  const reported = all.filter(c => c.status === 'Reported').length;
  const inProgress = all.filter(c => c.status === 'In Progress').length;
  const resolved = all.filter(c => c.status === 'Resolved').length;
  const critical = all.filter(c => c.priority === 'Critical').length;
  const high = all.filter(c => c.priority === 'High').length;

  // Breakdown by Category
  const byCategory = {};
  all.forEach(c => {
    byCategory[c.category] = (byCategory[c.category] || 0) + 1;
  });

  // Breakdown by Priority
  const byPriority = {
    'Critical': all.filter(c => c.priority === 'Critical').length,
    'High': all.filter(c => c.priority === 'High').length,
    'Medium': all.filter(c => c.priority === 'Medium').length,
    'Low': all.filter(c => c.priority === 'Low').length
  };

  // Breakdown by Department
  const byDepartment = {};
  all.forEach(c => {
    byDepartment[c.assigned_department] = (byDepartment[c.assigned_department] || 0) + 1;
  });

  // Average resolution time in hours for resolved complaints
  let totalResolutionHours = 0;
  let resolvedCount = 0;
  all.forEach(c => {
    if (c.status === 'Resolved' && c.created_at && c.updated_at) {
      const created = new Date(c.created_at).getTime();
      const updated = new Date(c.updated_at).getTime();
      const diffHours = (updated - created) / (1000 * 3600);
      if (diffHours >= 0) {
        totalResolutionHours += diffHours;
        resolvedCount++;
      }
    }
  });

  const avgResolutionTimeHours = resolvedCount > 0 
    ? Math.round((totalResolutionHours / resolvedCount) * 10) / 10 
    : 24.5; // fallback average

  return {
    total,
    reported,
    inProgress,
    resolved,
    critical,
    high,
    resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
    avgResolutionHours: avgResolutionTimeHours,
    byCategory: Object.entries(byCategory).map(([name, count]) => ({ name, count })),
    byPriority: Object.entries(byPriority).map(([name, count]) => ({ name, count })),
    byDepartment: Object.entries(byDepartment).map(([name, count]) => ({ name, count }))
  };
}
