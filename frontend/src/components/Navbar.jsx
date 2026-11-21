import React, { useState } from 'react';
import {
  Building2,
  PlusCircle,
  LayoutDashboard,
  ShieldAlert,
  BarChart3,
  Search,
  Menu,
  X,
  Sparkles,
  UserCheck
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isAdminMode, setIsAdminMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Building2 },
    { id: 'report', label: 'Report Issue', icon: PlusCircle, highlight: true },
    { id: 'citizen', label: 'Citizen Portal', icon: LayoutDashboard },
    { id: 'admin', label: 'Admin Command', icon: ShieldAlert, badge: 'Official' },
    { id: 'analytics', label: 'Civic Analytics', icon: BarChart3 },
    { id: 'track', label: 'Track Status', icon: Search }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white font-heading">
                  CIVIC<span className="text-blue-400">RESOLVE</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-500/20 text-blue-300 border border-blue-400/30 px-1.5 py-0.5 rounded">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide font-medium hidden sm:block">
                Report. Track. Resolve.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="flex items-center gap-2 px-3.5 py-2 mx-1 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-blue-400 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-80" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 px-1 py-0.2 rounded ml-0.5">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Demo Admin Role Switcher & Action */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => {
                const next = !isAdminMode;
                setIsAdminMode(next);
                if (next) setActiveTab('admin');
              }}
              title="Toggle Demo Admin Mode for instant testing"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isAdminMode
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm shadow-amber-500/20 ring-2 ring-amber-400/30'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{isAdminMode ? 'Admin Mode (Active)' : 'Demo: Switch to Admin'}</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                const next = !isAdminMode;
                setIsAdminMode(next);
                if (next) setActiveTab('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-amber-500/20 border border-amber-400/40 text-amber-300"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isAdminMode ? 'Deactivate Admin Mode' : 'Activate Demo Admin Mode'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
