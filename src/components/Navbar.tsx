import React, { useState } from 'react';
import { UserRole } from '../types';
import { Shield, ShieldCheck, User, Building2, Briefcase, Landmark, Search, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onSearchLookup: (query: string) => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole, onSelectRole, onSearchLookup, onGoHome }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchLookup(searchQuery.trim());
    }
  };

  const roleConfig = [
    { role: 'citizen' as UserRole, label: 'Citizen Verifier', icon: User, color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300' },
    { role: 'recruiter' as UserRole, label: 'Recruiter / HR', icon: Briefcase, color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' },
    { role: 'institution' as UserRole, label: 'Issuer Portal', icon: Building2, color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' },
    { role: 'admin' as UserRole, label: 'Govt Admin', icon: Landmark, color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={onGoHome}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">TrustVerify</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Universal Document Verification Platform</p>
            </div>
          </div>

          {/* Search Lookup Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Lookup Cert No. (e.g. AU-2023-CS-88912) or Blockchain Hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </form>
          </div>

          {/* Role Navigation Switcher */}
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
            {roleConfig.map((item) => {
              const Icon = item.icon;
              const isActive = currentRole === item.role;
              return (
                <button
                  key={item.role}
                  onClick={() => onSelectRole(item.role)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                  title={`Switch to ${item.label}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Subheader bar for active role context */}
      <div className="bg-slate-950/60 border-t border-slate-800/80 px-4 py-1.5 text-xs text-slate-400 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-300 font-medium capitalize">{currentRole} Workspace</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              SHA-256 Ledger: <code className="text-cyan-400 font-mono">32 Nodes Active</code>
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="hidden md:inline">Supports: Education, Govt IDs, Salary Slips, GST, Medical Licenses</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px]">
              AES-256 ENCRYPTED
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
