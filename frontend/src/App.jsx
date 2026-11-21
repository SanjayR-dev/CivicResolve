import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import LandingPage from './pages/LandingPage.jsx';
import CitizenPortal from './pages/CitizenPortal.jsx';
import CitizenDashboard from './pages/CitizenDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import TrackComplaint from './pages/TrackComplaint.jsx';
import { subscribeToComplaints } from './services/firebase.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time complaint updates (Firestore onSnapshot or live sync)
  useEffect(() => {
    const unsubscribe = subscribeToComplaints(
      (updatedComplaints) => {
        setComplaints(updatedComplaints);
        setLoading(false);
      },
      (error) => {
        console.error('Subscription error in App:', error);
        setLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleComplaintSubmitted = (newComplaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  const handleComplaintUpdated = (updated) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            setActiveTab={setActiveTab}
            complaints={complaints}
          />
        )}

        {activeTab === 'report' && (
          <CitizenPortal
            setActiveTab={setActiveTab}
            onComplaintSubmitted={handleComplaintSubmitted}
          />
        )}

        {activeTab === 'citizen' && (
          <CitizenDashboard
            complaints={complaints}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            complaints={complaints}
            onComplaintUpdated={handleComplaintUpdated}
            isAdminMode={isAdminMode}
            setIsAdminMode={setIsAdminMode}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPage complaints={complaints} />
        )}

        {activeTab === 'track' && (
          <TrackComplaint
            complaints={complaints}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Global Civic Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
