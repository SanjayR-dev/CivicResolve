import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  getAnalyticsStats
} from '../backend/src/data/complaintsStore.js';
import { analyzeComplaint } from '../backend/src/services/geminiService.js';

describe('CivicResolve Core Modules & Evaluation Test Suite', () => {

  describe('1. Complaint Storage & Status Lifecycle', () => {
    let testComplaintId;

    test('should create a new complaint with generated reference ID and initial "Reported" status', () => {
      const payload = {
        title: 'Broken water valve overflowing street',
        description: 'Potable water spilling onto pedestrian walkway near market',
        location: 'Sector 5 Market',
        reportedBy: 'Test Citizen',
        contactEmail: 'citizen@example.com',
        category: 'Water Supply',
        priority: 'High',
        urgencyScore: 82,
        department: 'Municipal Water Supply & Sewerage Board'
      };

      const created = createComplaint(payload);
      assert.ok(created);
      assert.ok(created.id);
      assert.match(created.id, /^CR-\d{4}-\d+$/);
      assert.equal(created.status, 'Reported');
      assert.equal(created.category, 'Water Supply');
      assert.equal(created.priority, 'High');
      const history = created.status_history || created.statusHistory || [];
      assert.ok(history.length >= 1);
      assert.equal(history[0].status, 'Reported');

      testComplaintId = created.id;
    });

    test('should retrieve an existing complaint by its unique Reference ID', () => {
      const retrieved = getComplaintById(testComplaintId);
      assert.ok(retrieved);
      assert.equal(retrieved.id, testComplaintId);
      assert.equal(retrieved.title, 'Broken water valve overflowing street');
    });

    test('should update complaint status to "In Progress" with admin remarks and audit logging', () => {
      const updated = updateComplaint(testComplaintId, {
        status: 'In Progress',
        remarks: 'Field maintenance crew dispatched.',
        updated_by: 'Municipal Ward Supervisor'
      });

      assert.ok(updated);
      assert.equal(updated.status, 'In Progress');
      const history = updated.status_history || updated.statusHistory || [];
      assert.ok(history.length >= 2);
      assert.equal(history[history.length - 1].status, 'In Progress');
    });

    test('should update complaint status to "Resolved" with final resolution notes', () => {
      const updated = updateComplaint(testComplaintId, {
        status: 'Resolved',
        remarks: 'Valve repaired and road cleared.',
        updated_by: 'Municipal Ward Supervisor'
      });

      assert.ok(updated);
      assert.equal(updated.status, 'Resolved');
      const history = updated.status_history || updated.statusHistory || [];
      assert.ok(history.length >= 3);
      assert.equal(history[history.length - 1].status, 'Resolved');
    });
  });

  describe('2. Civic Analytics Aggregation Engine', () => {
    test('should compute valid analytics metrics, counts, and resolution rates', () => {
      const stats = getAnalyticsStats();
      assert.ok(stats);
      assert.ok(typeof stats.total === 'number');
      assert.ok(typeof stats.resolved === 'number');
      assert.ok(typeof stats.inProgress === 'number');
      assert.ok(typeof stats.reported === 'number');
      assert.ok(typeof stats.resolutionRate === 'number');
      assert.ok(stats.resolutionRate >= 0 && stats.resolutionRate <= 100);
      assert.ok(Array.isArray(stats.byCategory));
      assert.ok(Array.isArray(stats.byPriority));
    });
  });

  describe('3. AI Grievance Classification Engine Contract', () => {
    const VALID_CATEGORIES = [
      'Road Infrastructure',
      'Sanitation',
      'Electricity',
      'Water Supply',
      'Drainage',
      'Public Safety',
      'Other'
    ];

    const VALID_PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];

    test('should analyze complaint and conform to strict CivicResolve JSON schema', async () => {
      const analysis = await analyzeComplaint({
        title: 'Dangerous exposed power lines hanging over playground',
        description: 'Live electrical cable snapped and hanging 4 feet above children playground ground with visible sparks.'
      });

      assert.ok(analysis, 'Analysis object must be defined');
      assert.ok(VALID_CATEGORIES.includes(analysis.category), `Category must be valid: got ${analysis.category}`);
      assert.ok(VALID_PRIORITIES.includes(analysis.priority), `Priority must be valid: got ${analysis.priority}`);
      assert.ok(typeof analysis.urgencyScore === 'number', 'urgencyScore must be a number');
      assert.ok(analysis.urgencyScore >= 0 && analysis.urgencyScore <= 100, 'urgencyScore must be between 0 and 100');
      assert.ok(analysis.department && typeof analysis.department === 'string', 'department must be non-empty');
      assert.ok(analysis.rationale && typeof analysis.rationale === 'string', 'rationale must be non-empty');
      assert.ok(analysis.recommendedAction && typeof analysis.recommendedAction === 'string', 'recommendedAction must be non-empty');
      assert.ok(typeof analysis.isGeminiResult === 'boolean', 'isGeminiResult must be boolean');
    });
  });

});
