import express from 'express';
import multer from 'multer';
import { analyzeComplaint } from '../services/geminiService.js';
import {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  getAnalyticsStats
} from '../data/complaintsStore.js';

const router = express.Router();

// Memory storage for image uploads to convert to base64 for Gemini & preview
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * POST /api/complaints/analyze
 * Pure AI / Heuristic analysis endpoint
 */
router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;

    let imageBase64 = null;
    let imageMimeType = null;

    if (req.file) {
      imageBase64 = req.file.buffer.toString('base64');
      imageMimeType = req.file.mimetype;
    } else if (req.body.imageBase64) {
      imageBase64 = req.body.imageBase64.replace(/^data:image\/\w+;base64,/, '');
      imageMimeType = req.body.imageMimeType || 'image/jpeg';
    }

    const analysis = await analyzeComplaint({
      title,
      description,
      imageBase64,
      imageMimeType
    });

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Error in analyze route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze complaint',
      error: error.message
    });
  }
});

/**
 * POST /api/complaints
 * Submit and register a new civic complaint
 */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      latitude,
      longitude,
      citizen_name,
      citizen_contact
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required.'
      });
    }

    let imageBase64 = null;
    let imageMimeType = null;
    let imageUrl = req.body.imageUrl || null;

    if (req.file) {
      imageBase64 = req.file.buffer.toString('base64');
      imageMimeType = req.file.mimetype;
      // Data URI for inline persistence in demo/prototype
      imageUrl = `data:${imageMimeType};base64,${imageBase64}`;
    } else if (req.body.imageBase64) {
      imageBase64 = req.body.imageBase64.replace(/^data:image\/\w+;base64,/, '');
      imageMimeType = req.body.imageMimeType || 'image/jpeg';
      imageUrl = req.body.imageBase64;
    }

    // Run Gemini AI Engine triage
    const analysis = await analyzeComplaint({
      title,
      description,
      imageBase64,
      imageMimeType
    });

    // Coordinates parsing
    let coordinates = null;
    if (latitude && longitude) {
      coordinates = {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude)
      };
    }

    // Persist complaint
    const newComplaint = createComplaint({
      title,
      description,
      location,
      coordinates,
      imageUrl,
      category: analysis.category,
      subcategory: analysis.subcategory,
      priority: analysis.priority,
      urgencyScore: analysis.urgencyScore,
      urgency_score: analysis.urgency_score,
      department: analysis.department,
      assigned_department: analysis.assigned_department,
      rationale: analysis.rationale,
      classification_explanation: analysis.classification_explanation,
      recommendedAction: analysis.recommendedAction,
      suggested_action: analysis.suggested_action,
      ai_status: analysis.ai_status,
      isGeminiResult: analysis.isGeminiResult,
      is_ai_generated: analysis.is_ai_generated,
      engine_name: analysis.engine_name,
      model_used: analysis.model_used,
      citizen_name,
      citizen_contact
    });

    res.status(201).json({
      success: true,
      message: 'Grievance submitted and triaged successfully.',
      complaint: newComplaint
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating grievance.',
      error: error.message
    });
  }
});

/**
 * GET /api/complaints
 * Fetch all complaints with filtering options
 */
router.get('/', (req, res) => {
  try {
    let complaints = getAllComplaints();
    const { category, priority, status, search } = req.query;

    if (category && category !== 'All') {
      complaints = complaints.filter(c => c.category === category);
    }
    if (priority && priority !== 'All') {
      complaints = complaints.filter(c => c.priority === priority);
    }
    if (status && status !== 'All') {
      complaints = complaints.filter(c => c.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      complaints = complaints.filter(
        c =>
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.assigned_department.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: complaints.length,
      complaints
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve complaints.'
    });
  }
});

/**
 * GET /api/complaints/:id
 * Fetch individual complaint by ID
 */
router.get('/:id', (req, res) => {
  try {
    const complaint = getComplaintById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint with ID ${req.params.id} not found.`
      });
    }
    res.json({
      success: true,
      complaint
    });
  } catch (error) {
    console.error('Error fetching complaint by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve complaint.'
    });
  }
});

/**
 * PATCH /api/complaints/:id
 * Admin update: status, department, remarks
 */
router.patch('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status, assigned_department, remarks, updated_by } = req.body;

    const updates = {};
    if (status) updates.status = status;
    if (assigned_department) updates.assigned_department = assigned_department;
    if (remarks) updates.remarks = remarks;
    if (updated_by) updates.updated_by = updated_by;

    const updated = updateComplaint(id, updates);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Complaint with ID ${id} not found.`
      });
    }

    res.json({
      success: true,
      message: 'Complaint updated successfully.',
      complaint: updated
    });
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update complaint.'
    });
  }
});

export default router;
