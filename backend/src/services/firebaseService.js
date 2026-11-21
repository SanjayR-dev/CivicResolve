/**
 * Firebase Firestore Service (Backend)
 * Supports direct Firestore persistence when FIREBASE_PROJECT_ID is configured,
 * while maintaining 100% resilient local fallback.
 */

export async function syncComplaintToFirestore(complaint) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId || projectId.trim() === '' || projectId === 'your_project_id') {
    // Firestore not configured on backend; fallback to local JSON store
    return null;
  }

  try {
    const documentId = complaint.id;
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/complaints?documentId=${encodeURIComponent(documentId)}`;
    
    // Convert JS object to Firestore REST fields
    const firestoreFields = {};
    for (const [key, val] of Object.entries(complaint)) {
      if (val === null || val === undefined) {
        firestoreFields[key] = { nullValue: null };
      } else if (typeof val === 'string') {
        firestoreFields[key] = { stringValue: val };
      } else if (typeof val === 'number') {
        firestoreFields[key] = Number.isInteger(val) ? { integerValue: val.toString() } : { doubleValue: val };
      } else if (typeof val === 'boolean') {
        firestoreFields[key] = { booleanValue: val };
      } else if (Array.isArray(val)) {
        firestoreFields[key] = {
          arrayValue: {
            values: val.map(item => ({ stringValue: JSON.stringify(item) }))
          }
        };
      } else if (typeof val === 'object') {
        firestoreFields[key] = { stringValue: JSON.stringify(val) };
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: firestoreFields })
    });

    if (response.ok) {
      console.log(`[Firestore Service] Successfully synced complaint ${documentId} to Firestore.`);
      return true;
    } else {
      const errText = await response.text();
      console.warn(`[Firestore Service] Firestore write returned ${response.status}:`, errText);
      return false;
    }
  } catch (err) {
    console.warn('[Firestore Service] Failed to sync to Firestore:', err.message);
    return false;
  }
}
