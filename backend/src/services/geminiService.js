import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

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

const DEPARTMENT_MAP = {
  'Road Infrastructure': 'Public Works Department (PWD)',
  'Sanitation': 'Municipal Sanitation & Waste Management',
  'Electricity': 'State Electricity Distribution Board',
  'Water Supply': 'Municipal Water Supply & Sewerage Board',
  'Drainage': 'Stormwater & Drainage Maintenance Wing',
  'Public Safety': 'Civic Safety & Law Enforcement Dept',
  'Other': 'General Grievance Redressal Cell'
};

/**
 * Intelligent Rule-Based Fallback Classifier
 * Preserved and active when Gemini API Key is missing or call fails/times out.
 */
function runFallbackClassification(title, description, fallbackReason = 'Algorithmic heuristic fallback') {
  const combined = `${title || ''} ${description || ''}`.toLowerCase();

  let category = 'Other';
  let subcategory = 'General Civic Concern';
  let priority = 'Medium';
  let urgencyScore = 50;
  let explanation = 'Classified via algorithmic rule-based fallback based on civic keyword heuristics.';
  let suggestedAction = 'Dispatch field officer for preliminary assessment within 48 hours.';

  // 1. Water Supply
  if (
    combined.includes('water') ||
    combined.includes('pipe') ||
    combined.includes('pipeline') ||
    combined.includes('tap') ||
    combined.includes('leak') ||
    combined.includes('gushing') ||
    combined.includes('drinking water')
  ) {
    category = 'Water Supply';
    if (combined.includes('burst') || combined.includes('gushing') || combined.includes('flood') || combined.includes('high pressure')) {
      priority = 'Critical';
      urgencyScore = 93;
      subcategory = 'High-Volume Main Pipeline Burst';
      suggestedAction = 'Isolate sector valve immediately and deploy emergency hydraulic welding crew.';
      explanation = 'Severe drinking water pipeline rupture causing roadway flooding and municipal resource loss.';
    } else if (combined.includes('dirty') || combined.includes('contaminat') || combined.includes('smell')) {
      priority = 'High';
      urgencyScore = 84;
      subcategory = 'Drinking Water Contamination';
      suggestedAction = 'Dispatch mobile water testing unit and flush affected distribution lines.';
      explanation = 'Potential public health hazard from compromised municipal water quality.';
    } else {
      priority = 'Medium';
      urgencyScore = 58;
      subcategory = 'Low Pressure / Minor Line Leakage';
      suggestedAction = 'Inspect feeder valve calibration during next scheduled maintenance.';
      explanation = 'Minor distribution inconsistency affecting local civic supply.';
    }
  }
  // 2. Road Infrastructure
  else if (
    combined.includes('pothole') ||
    combined.includes('road') ||
    combined.includes('asphalt') ||
    combined.includes('sinkhole') ||
    combined.includes('crater') ||
    combined.includes('footpath') ||
    combined.includes('sidewalk') ||
    combined.includes('divider') ||
    combined.includes('bridge') ||
    combined.includes('pavement') ||
    combined.includes('speed breaker')
  ) {
    category = 'Road Infrastructure';
    if (combined.includes('sinkhole') || combined.includes('accident') || combined.includes('deep crater') || combined.includes('collapse') || combined.includes('danger')) {
      priority = 'Critical';
      urgencyScore = 96;
      subcategory = 'Hazardous Road Defect / Sinkhole';
      suggestedAction = 'Barricade danger zone immediately and deploy hot-mix asphalt team.';
      explanation = 'High-risk road deformation posing imminent collision or vehicle damage threat.';
    } else if (combined.includes('pothole') || combined.includes('broken')) {
      priority = 'High';
      urgencyScore = 78;
      subcategory = 'Road Surface Deterioration / Potholes';
      suggestedAction = 'Schedule surface milling and asphalt patch within 72 hours.';
      explanation = 'Substantial road wear disrupting traffic flow and pedestrian safety.';
    } else {
      priority = 'Medium';
      urgencyScore = 55;
      subcategory = 'Curb / Pavement Maintenance';
      suggestedAction = 'Log for routine zonal road repairs.';
      explanation = 'Moderate civic infrastructure wear.';
    }
  }
  // 3. Sanitation
  else if (
    combined.includes('garbage') ||
    combined.includes('trash') ||
    combined.includes('waste') ||
    combined.includes('dump') ||
    combined.includes('sanitation') ||
    combined.includes('stink') ||
    combined.includes('smell') ||
    combined.includes('litter') ||
    combined.includes('debris') ||
    combined.includes('carcass')
  ) {
    category = 'Sanitation';
    if (combined.includes('hospital') || combined.includes('school') || combined.includes('toxic') || combined.includes('carcass') || combined.includes('infest')) {
      priority = 'Critical';
      urgencyScore = 90;
      subcategory = 'Bio-hazardous Waste / Acute Dumping';
      suggestedAction = 'Deploy emergency municipal compactor with biocidal spray.';
      explanation = 'Significant disease risk due to decomposed waste near vulnerable public zones.';
    } else {
      priority = 'High';
      urgencyScore = 72;
      subcategory = 'Commercial Garbage Dump / Waste Overflow';
      suggestedAction = 'Dispatch municipal waste collection vehicle for priority site clearance.';
      explanation = 'Public nuisance and sanitation violation on public municipal easement.';
    }
  }
  // 4. Electricity
  else if (
    combined.includes('electric') ||
    combined.includes('wire') ||
    combined.includes('pole') ||
    combined.includes('transformer') ||
    combined.includes('spark') ||
    combined.includes('shock') ||
    combined.includes('power') ||
    combined.includes('blackout') ||
    combined.includes('streetlight') ||
    combined.includes('voltage') ||
    combined.includes('cable')
  ) {
    category = 'Electricity';
    if (combined.includes('spark') || combined.includes('live wire') || combined.includes('hanging') || combined.includes('shock') || combined.includes('fire')) {
      priority = 'Critical';
      urgencyScore = 98;
      subcategory = 'High Voltage / Exposed Live Wire Hazard';
      suggestedAction = 'Isolate feeder circuit breaker remotely and dispatch lineman van immediately.';
      explanation = 'Direct mortal electrocution and fire threat on civic corridor.';
    } else if (combined.includes('streetlight') || combined.includes('dark')) {
      priority = 'Medium';
      urgencyScore = 48;
      subcategory = 'Streetlight Fixture Malfunction';
      suggestedAction = 'Replace faulty luminaire driver during routine evening sweep.';
      explanation = 'Public illumination failure impairing night navigation.';
    } else {
      priority = 'High';
      urgencyScore = 80;
      subcategory = 'Power Distribution Outage';
      suggestedAction = 'Inspect local step-down transformer and restore phase distribution.';
      explanation = 'Widespread electrical outage impacting civic establishments.';
    }
  }
  // 5. Drainage
  else if (
    combined.includes('drain') ||
    combined.includes('sewage') ||
    combined.includes('manhole') ||
    combined.includes('gutter') ||
    combined.includes('overflow') ||
    combined.includes('clog') ||
    combined.includes('drainage') ||
    combined.includes('sewer')
  ) {
    category = 'Drainage';
    if (combined.includes('manhole') || combined.includes('cover') || combined.includes('missing') || combined.includes('open')) {
      priority = 'Critical';
      urgencyScore = 97;
      subcategory = 'Open / Missing Manhole Cover';
      suggestedAction = 'Place high-visibility safety cones and install reinforced cover slab.';
      explanation = 'Severe danger of pedestrian or cyclist falling into deep subsurface chamber.';
    } else {
      priority = 'High';
      urgencyScore = 76;
      subcategory = 'Sewage Line Backflow / Overflow';
      suggestedAction = 'Deploy high-velocity sewer jetting machine for desilting.';
      explanation = 'Sewer backflow polluting pedestrian thoroughfare.';
    }
  }
  // 6. Public Safety
  else if (
    combined.includes('safety') ||
    combined.includes('stray') ||
    combined.includes('dog') ||
    combined.includes('bite') ||
    combined.includes('crime') ||
    combined.includes('encroach') ||
    combined.includes('hazard') ||
    combined.includes('threat')
  ) {
    category = 'Public Safety';
    subcategory = 'Public Threat / Civic Hazard';
    priority = combined.includes('bite') || combined.includes('urgent') ? 'High' : 'Medium';
    urgencyScore = priority === 'High' ? 76 : 52;
    suggestedAction = 'Alert municipal enforcement unit and ward inspector for inspection.';
    explanation = 'Threat to pedestrian security within civic jurisdiction.';
  }

  const assignedDepartment = DEPARTMENT_MAP[category] || 'General Grievance Redressal Cell';

  return {
    category,
    subcategory,
    priority,
    urgencyScore,
    urgency_score: urgencyScore,
    department: assignedDepartment,
    assigned_department: assignedDepartment,
    rationale: explanation,
    classification_explanation: explanation,
    recommendedAction: suggestedAction,
    suggested_action: suggestedAction,
    ai_status: 'fallback_heuristic',
    isGeminiResult: false,
    is_ai_generated: false,
    engine_name: 'Heuristic Rule Engine (Fallback)',
    fallback_reason: fallbackReason,
    analyzed_at: new Date().toISOString()
  };
}

/**
 * Validates the parsed AI response against required schema and domain rules.
 */
function validateAIResponse(parsed) {
  if (!parsed || typeof parsed !== 'object') return false;
  if (!VALID_CATEGORIES.includes(parsed.category)) return false;
  if (!VALID_PRIORITIES.includes(parsed.priority)) return false;

  const score = parsed.urgencyScore !== undefined ? parsed.urgencyScore : parsed.urgency_score;
  if (typeof score !== 'number' || score < 0 || score > 100) return false;

  if (!parsed.subcategory || typeof parsed.subcategory !== 'string') return false;

  const dept = parsed.department || parsed.assigned_department;
  if (!dept || typeof dept !== 'string') return false;

  const rationale = parsed.rationale || parsed.classification_explanation;
  if (!rationale || typeof rationale !== 'string') return false;

  const action = parsed.recommendedAction || parsed.suggested_action;
  if (!action || typeof action !== 'string') return false;

  return true;
}

/**
 * Analyzes civic complaint using Google Gemini API (@google/genai SDK)
 * Multimodal: analyzes description + optional attached image.
 * Uses currently supported Gemini Flash models with robust schema validation & fallback.
 */
export async function analyzeComplaint({ title, description, imageBase64, imageMimeType }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    console.log('[Gemini Engine] GEMINI_API_KEY not configured. Running heuristic fallback classifier.');
    return runFallbackClassification(title, description, 'GEMINI_API_KEY not configured in backend/.env');
  }

  const promptText = `
You are the AI triage engine for CIVICRESOLVE, an intelligent citizen grievance management and resolution platform.
Analyze the submitted citizen complaint and determine the precise civic classification.

Complaint Title: ${title || 'N/A'}
Complaint Description: ${description || 'N/A'}
${imageBase64 ? '[IMAGE EVIDENCE ATTACHED: Inspect the attached photograph for visual evidence of infrastructure damage, defect dimensions, and hazard severity.]' : ''}

Supported Categories (Select exactly one):
- Road Infrastructure
- Sanitation
- Electricity
- Water Supply
- Drainage
- Public Safety
- Other

Priority Levels (Select exactly one):
- Critical: Immediate risk of death, injury, live electric wire, active street flooding, open manholes.
- High: Severe disruption, impassable road crater, contaminated drinking water, overflowing bio-waste.
- Medium: Public inconvenience, moderate pothole, garbage dump, dark alley.
- Low: Non-urgent aesthetic issues, faint bulb, paint peeling, loose sign.

Urgency Score:
An integer between 0 and 100 representing the critical urgency of field dispatch.

Responsible Departments:
- Public Works Department (PWD)
- Municipal Sanitation & Waste Management
- State Electricity Distribution Board
- Municipal Water Supply & Sewerage Board
- Stormwater & Drainage Maintenance Wing
- Civic Safety & Law Enforcement Dept
- General Grievance Redressal Cell

You MUST respond strictly with a valid JSON object matching this exact schema:
{
  "category": "One of the supported categories",
  "subcategory": "Specific defect description (e.g., Severe Road Crater, High Voltage Sparking Wire, Main Pipeline Rupture)",
  "priority": "Critical" | "High" | "Medium" | "Low",
  "urgencyScore": 0-100,
  "department": "Name of responsible municipal department",
  "rationale": "A concise 2-3 sentence explanation justifying the category and priority based on risk to public health and vehicular safety",
  "recommendedAction": "A concrete 1-2 sentence recommendation for field crew deployment"
}
Do not include markdown fences, backticks, or additional commentary. Return pure JSON only.
`;

  const contents = [];
  if (imageBase64 && imageMimeType) {
    contents.push({
      inlineData: {
        mimeType: imageMimeType,
        data: imageBase64
      }
    });
    contents.push({ text: promptText });
  } else {
    contents.push(promptText);
  }

  // Supported Gemini Flash models in priority order
  const candidateModels = [
    process.env.GEMINI_MODEL,
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-2.5-flash'
  ].filter(Boolean);

  let lastError = null;

  for (const model of candidateModels) {
    try {
      console.log(`[Gemini Engine] Attempting analysis using model: ${model}...`);
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text?.trim() || '';
      const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (validateAIResponse(parsed)) {
        const urgencyScore = typeof parsed.urgencyScore === 'number' ? parsed.urgencyScore : (parsed.urgency_score || 50);
        const department = parsed.department || parsed.assigned_department || 'General Grievance Redressal Cell';
        const rationale = parsed.rationale || parsed.classification_explanation || 'Classified based on civic risk assessment.';
        const recommendedAction = parsed.recommendedAction || parsed.suggested_action || 'Dispatch field crew for inspection.';

        console.log(`[Gemini Engine] Success with ${model}! Priority: ${parsed.priority}, Urgency: ${urgencyScore}`);

        return {
          category: parsed.category,
          subcategory: parsed.subcategory,
          priority: parsed.priority,
          urgencyScore,
          urgency_score: urgencyScore,
          department,
          assigned_department: department,
          rationale,
          classification_explanation: rationale,
          recommendedAction,
          suggested_action: recommendedAction,
          ai_status: 'success',
          isGeminiResult: true,
          is_ai_generated: true,
          engine_name: `Google Gemini AI (${model})`,
          model_used: model,
          analyzed_at: new Date().toISOString()
        };
      } else {
        console.warn(`[Gemini Engine] Response from ${model} did not conform to schema:`, parsed);
      }
    } catch (err) {
      console.warn(`[Gemini Engine] Model ${model} failed:`, err.message);
      lastError = err;
    }
  }

  // If all candidate Gemini models fail, cleanly fall back to heuristic engine
  console.error('[Gemini Engine] All Gemini Flash models failed. Engaging heuristic fallback.');
  const fallback = runFallbackClassification(title, description, `Gemini API call failed: ${lastError?.message || 'Unknown error'}`);
  fallback.ai_status = 'error_fallback';
  fallback.error_message = lastError?.message;
  return fallback;
}
