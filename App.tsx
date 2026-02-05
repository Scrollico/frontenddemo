import React, { useState, useEffect } from 'react';
import { Server, ScanFace, Users, ShieldCheck, Crosshair, Zap, BadgeDollarSign, Sparkles, BriefcaseBusiness, Cpu, Globe, ListFilter, Plus, X, Building2, Upload, Rss, Lock, Loader2, Send, Trash2 } from 'lucide-react';
import { LoginScreen } from './components/auth/LoginScreen';
import Onboarding from './components/Onboarding';
import Sidebar from './components/dashboard/Sidebar';
import { Header } from './components/dashboard/Header';
import ExecutiveDaily from './components/dashboard/ExecutiveDaily';
import MarketIntelligence from './components/dashboard/MarketIntelligence';
import ContentStudio from './components/dashboard/ContentStudio';
import AgentsView from './components/dashboard/AgentsView';
import { ViewState, DashboardTab, MarketPriority } from './types';
import { GlassCard } from './components/ui/GlassCard';
import { CommandPalette } from './components/ui/CommandPalette';

// --- Settings Sub-Components ---

const MarketPrioritization = ({ selected, onSelect }: { selected: MarketPriority, onSelect: (p: MarketPriority) => void }) => {
  const priorities: { id: MarketPriority, label: string, icon: React.ElementType }[] = [
    { id: 'General', label: 'General Market', icon: Globe },
    { id: 'Energy', label: 'Energy Sector', icon: Zap },
    { id: 'Finance', label: 'Global Finance', icon: BadgeDollarSign },
    { id: 'Innovation', label: 'Innovation & R&D', icon: Sparkles },
    { id: 'Business', label: 'Business Strategy', icon: BriefcaseBusiness },
    { id: 'Tech', label: 'Technology', icon: Cpu },
  ];

  return (
    <GlassCard className="space-y-8 bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 dark:border-white/10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Market Prioritization</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Select a primary focus area to tailor your daily intelligence feed.</p>
        </div>
        <div className="p-2 bg-gray-100 dark:bg-white/10 rounded-full text-gray-900 dark:text-white">
          <Crosshair className="w-6 h-6" strokeWidth={1.25} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {priorities.map((p) => {
          const isSelected = selected === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={`relative p-6 rounded-2xl border transition-all duration-300 text-left group overflow-hidden ${isSelected
                ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/30 transform scale-[1.02]'
                : 'bg-white/50 dark:bg-white/5 border-white/20 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 hover:bg-white/80 dark:hover:bg-white/10'
                }`}
            >
              {/* Monochrome Glass Icon Box */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border shadow-sm backdrop-blur-md transition-colors ${isSelected
                ? 'bg-white/20 border-white/30 text-white'
                : 'bg-white/50 dark:bg-white/5 border-white/40 dark:border-white/10 text-slate-700 dark:text-white'
                }`}>
                <p.icon className={`w-7 h-7 ${isSelected ? 'opacity-100' : 'opacity-80'}`} strokeWidth={1.25} />
              </div>

              <h3 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{p.label}</h3>
              <p className={`text-xs mt-1.5 font-medium ${isSelected ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                {isSelected ? 'Active Priority' : 'Click to Activate'}
              </p>
            </button>
          )
        })}
      </div>
    </GlassCard>
  );
};

const CompetitorListSettings = ({
  competitors,
  onAdd,
  onRemove,
  userCompany,
  onUpdateUserCompany
}: {
  competitors: string[],
  onAdd: (name: string) => void,
  onRemove: (name: string) => void,
  userCompany: string,
  onUpdateUserCompany: (name: string) => void
}) => {
  const [input, setInput] = useState('');
  const [companyInput, setCompanyInput] = useState(userCompany);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (input.trim()) {
      setIsAdding(true);
      // Simulate Google Search Enrichment
      setTimeout(() => {
        onAdd(input.trim());
        setInput('');
        setIsAdding(false);
      }, 1500);
    }
  };

  const handleUpdateCompany = () => {
    if (companyInput.trim()) {
      onUpdateUserCompany(companyInput.trim());
    }
  }

  return (
    <GlassCard className="space-y-10 bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 dark:border-white/10">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Competitor Watchlist</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage the entities tracked in your Competitor Radar.</p>
        </div>
        <div className="p-2 bg-gray-100 dark:bg-white/10 rounded-full text-gray-900 dark:text-white">
          <ListFilter className="w-6 h-6" strokeWidth={1.25} />
        </div>
      </div>

      {/* My Entity Section */}
      <div className="mt-8 p-6 bg-blue-50/30 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/20 mb-8 backdrop-blur-sm">
        <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4" strokeWidth={1.25} /> Your Organization
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={companyInput}
            onChange={(e) => setCompanyInput(e.target.value)}
            onBlur={handleUpdateCompany}
            onKeyDown={(e) => e.key === 'Enter' && handleUpdateCompany()}
            className="flex-1 bg-white/50 dark:bg-black/20 border border-blue-200 dark:border-blue-500/30 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
          />
          <button
            onClick={handleUpdateCompany}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-sm transition-colors"
          >
            Update
          </button>
        </div>
        <p className="text-xs text-blue-600/60 dark:text-blue-400/60 mt-3">
          This entity will be used as the primary subject for comparative analysis.
        </p>
      </div>

      <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-white/5">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Tracked Competitors</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Enter competitor name (e.g., Acme Corp)"
            className="flex-1 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
          />
          <button
            onClick={handleAdd}
            disabled={!input.trim() || isAdding}
            className="px-6 py-3 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2 min-w-[120px] justify-center"
          >
            {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" strokeWidth={1.25} />}
            {isAdding ? 'Enriching...' : 'Add'}
          </button>
        </div>
        {isAdding && (
          <p className="text-xs text-blue-500 animate-pulse mb-4 flex items-center gap-2">
            <Globe className="w-3 h-3" /> Searching Google for company financials & news...
          </p>
        )}

        <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
          {competitors.length === 0 ? (
            <div className="text-center py-8 text-gray-400 dark:text-gray-600 bg-white/30 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
              No competitors added yet.
            </div>
          ) : (
            competitors.map((comp, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white/40 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl group hover:bg-white/60 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center font-bold text-xs text-gray-600 dark:text-gray-300">
                    {comp.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{comp}</span>
                </div>
                <button
                  onClick={() => onRemove(comp)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" strokeWidth={1.25} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </GlassCard>
  );
};

const SourceManagement = () => {
  const [activeTab, setActiveTab] = useState<'api' | 'file' | 'rss'>('api');
  const [paywallEnabled, setPaywallEnabled] = useState(false);

  return (
    <GlassCard className="space-y-6 bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 dark:border-white/10">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Source Management</h2>

      {/* Paywall Killer Feature */}
      <div className="p-5 mb-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-100 dark:border-amber-500/20 flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Premium Intelligence Access</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Unlock paywalled content from NYTimes, Financial Times, WSJ, and Dow Jones.
            </p>
          </div>
        </div>
        <button
          onClick={() => setPaywallEnabled(!paywallEnabled)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-75 ${paywallEnabled ? 'bg-amber-500' : 'bg-gray-300 dark:bg-white/10'}`}
        >
          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${paywallEnabled ? 'translate-x-6' : ''}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-white/10 mb-6">
        <button onClick={() => setActiveTab('api')} className={`pb-3 px-4 text-sm font-bold transition-colors ${activeTab === 'api' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500'}`}>API Connections</button>
        <button onClick={() => setActiveTab('file')} className={`pb-3 px-4 text-sm font-bold transition-colors ${activeTab === 'file' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500'}`}>File Upload</button>
        <button onClick={() => setActiveTab('rss')} className={`pb-3 px-4 text-sm font-bold transition-colors ${activeTab === 'rss' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500'}`}>RSS Feeds</button>
      </div>

      <div className="space-y-4 min-h-[200px]">
        {activeTab === 'api' && (
          <>
            <div className="flex items-center justify-between p-4 bg-white/40 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500/10 dark:bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Server className="w-5 h-5 text-green-600 dark:text-green-400" strokeWidth={1.25} />
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">Global Equities</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Live API Connection</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Connected
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/40 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={1.25} />
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">Regulatory News Feed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">SEC & Global Compliance</p>
                </div>
              </div>
              <button className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Configure</button>
            </div>
          </>
        )}

        {activeTab === 'file' && (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
            <Upload className="w-10 h-10 text-gray-400 group-hover:text-blue-500 transition-colors mb-4" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">Upload Internal Reports (PDF, CSV)</p>
            <p className="text-xs text-gray-500 mt-2">Drag & drop or click to browse</p>
          </div>
        )}

        {activeTab === 'rss' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input type="text" placeholder="Enter RSS Feed URL" className="flex-1 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none" />
              <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-bold">Add Feed</button>
            </div>
            <div className="p-4 bg-white/40 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5 flex items-center gap-3">
              <Rss className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">TechCrunch Main Feed</p>
                <p className="text-xs text-gray-500">Last updated: 10m ago</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

const PERSONA_OPTIONS = [
  { id: 'visionary', label: 'Visionary Leader', icon: ScanFace, description: 'Optimistic, forward-looking, and focused on innovation and macro trends.', iconClass: 'text-blue-600 dark:text-blue-400' },
  { id: 'pragmatic', label: 'Pragmatic Operator', icon: ShieldCheck, description: 'Data-driven, realistic, and focused on execution and efficiency.', iconClass: 'text-gray-400 dark:text-gray-400' },
  { id: 'disruptor', label: 'Disruptor / Contrarian', icon: Zap, description: 'Challenging status quo, bold takes, and high-energy rhetoric.', iconClass: 'text-yellow-500 dark:text-yellow-400' },
  { id: 'empathetic', label: 'Empathetic Connector', icon: Users, description: 'People-focused, cultural, and focused on organizational health.', iconClass: 'text-green-500 dark:text-green-400' },
] as const;

const PersonaVoice = () => {
  const [selectedPersona, setSelectedPersona] = useState<string>('visionary');

  return (
    <GlassCard className="space-y-6 bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 dark:border-white/10">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Content Persona & Voice</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PERSONA_OPTIONS.map((persona) => {
          const isSelected = selectedPersona === persona.id;
          const Icon = persona.icon;
          return (
            <button
              key={persona.id}
              type="button"
              onClick={() => setSelectedPersona(persona.id)}
              className={`p-6 rounded-xl border text-left transition-all cursor-pointer ${isSelected
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 ring-2 ring-blue-500/30'
                : 'border-gray-200 dark:border-white/10 bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20'
                }`}
            >
              <Icon className={`w-8 h-8 mb-4 ${persona.iconClass}`} strokeWidth={0.75} />
              <h3 className={`font-bold text-lg ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-300'}`}>
                {persona.label}
              </h3>
              <p className={`text-sm mt-2 ${isSelected ? 'text-blue-600/70 dark:text-blue-200/60' : 'text-gray-500 dark:text-gray-500'}`}>
                {persona.description}
              </p>
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
};

type TeamMemberRole = 'Editor' | 'Viewer';
interface TeamMemberRow {
  id: string;
  name: string;
  title: string;
  role: TeamMemberRole;
  pending?: boolean;
}

const INITIAL_TEAM_MEMBERS: TeamMemberRow[] = [
  { id: '1', name: 'Aylin Yılmaz', title: 'Chief Strategy Officer', role: 'Editor' },
  { id: '2', name: 'Mehmet Demir', title: 'Chief Strategy Officer', role: 'Editor' },
  { id: '3', name: 'Zeynep Kaya', title: 'Chief Strategy Officer', role: 'Editor' },
];

const TeamMembers = () => {
  const [members, setMembers] = useState<TeamMemberRow[]>(INITIAL_TEAM_MEMBERS);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);

  const handleRemove = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleRoleChange = (id: string, role: TeamMemberRole) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setTimeout(() => {
      const newMember: TeamMemberRow = {
        id: `new-${Date.now()}`,
        name: inviteEmail.trim(),
        title: 'Pending invite',
        role: 'Viewer',
        pending: true,
      };
      setMembers((prev) => [...prev, newMember]);
      setInviteEmail('');
      setInviting(false);
    }, 800);
  }

  return (
    <GlassCard className="space-y-6 bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 dark:border-white/10">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Team Access</h2>

      <div className="space-y-4 mb-8">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between gap-3 p-3 border-b border-gray-100 dark:border-white/5 last:border-0">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-400 to-gray-600 dark:from-gray-600 dark:to-gray-800 flex-shrink-0"></div>
              <div className="min-w-0">
                <p className="text-sm text-gray-900 dark:text-white font-medium truncate">{member.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{member.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <select
                value={member.role}
                onChange={(e) => handleRoleChange(member.id, e.target.value as TeamMemberRole)}
                className="bg-gray-100 dark:bg-black/20 text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded p-1.5"
              >
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
              <button
                type="button"
                onClick={() => handleRemove(member.id)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                title="Remove member"
              >
                <Trash2 className="w-4 h-4" strokeWidth={1.25} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-gray-200 dark:border-white/10">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Invite New Member</h3>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="colleague@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
            className="flex-1 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <button
            onClick={handleInvite}
            disabled={!inviteEmail.trim() || inviting}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send Invite
          </button>
        </div>
      </div>
    </GlassCard>
  );
};

const MainSettings = ({ marketPriority, competitors, userCompany }: { marketPriority: string, competitors: string[], userCompany: string }) => (
  <div className="max-w-4xl mx-auto space-y-6">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings Overview</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <GlassCard className="p-6 bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 dark:border-white/10" noPadding>
        <div className="p-6">
          {/* Monochrome Icon */}
          <Crosshair className="w-8 h-8 text-gray-700 dark:text-gray-300 mb-4" strokeWidth={1} />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Focus</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-4">Priority: {marketPriority}</p>
          <div className="w-full h-1 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div className="w-full h-full bg-blue-600"></div>
          </div>
        </div>
      </GlassCard>
      <GlassCard className="p-6 bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 dark:border-white/10" noPadding>
        <div className="p-6">
          {/* Monochrome Icon */}
          <Building2 className="w-8 h-8 text-gray-700 dark:text-gray-300 mb-4" strokeWidth={1} />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Entity Profile</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-1">{userCompany}</p>
          <p className="text-xs text-gray-400">Tracking against {competitors.length} competitors</p>
        </div>
      </GlassCard>
      <GlassCard className="p-6 bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 dark:border-white/10" noPadding>
        <div className="p-6">
          {/* Monochrome Icon */}
          <Users className="w-8 h-8 text-gray-700 dark:text-gray-300 mb-4" strokeWidth={1} />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Team</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-4">4 Active Members</p>
        </div>
      </GlassCard>
    </div>
  </div>
);

interface SettingsViewProps {
  view: string;
  marketPriority: MarketPriority;
  setMarketPriority: (p: MarketPriority) => void;
  competitors: string[];
  setCompetitors: React.Dispatch<React.SetStateAction<string[]>>;
  userCompany: string;
  setUserCompany: (n: string) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ view, marketPriority, setMarketPriority, competitors, setCompetitors, userCompany, setUserCompany }) => {
  if (view === 'settings_market') return <MarketPrioritization selected={marketPriority} onSelect={setMarketPriority} />;
  if (view === 'settings_competitors') return (
    <CompetitorListSettings
      competitors={competitors}
      onAdd={(name) => setCompetitors(prev => [...prev, name])}
      onRemove={(name) => setCompetitors(prev => prev.filter(c => c !== name))}
      userCompany={userCompany}
      onUpdateUserCompany={setUserCompany}
    />
  );
  if (view === 'settings_source') return <SourceManagement />;
  if (view === 'settings_persona') return <PersonaVoice />;
  if (view === 'settings_team') return <TeamMembers />;
  return <MainSettings marketPriority={marketPriority} competitors={competitors} userCompany={userCompany} />;
};

const ONBOARDING_SESSION_KEY = 'ai-business-suite-onboarding-done';

const App: React.FC = () => {
  // Show onboarding only once per session; skip to dashboard on refresh if already completed
  const [viewState, setViewState] = useState<ViewState>(() =>
    typeof window !== 'undefined' && sessionStorage.getItem(ONBOARDING_SESSION_KEY) ? 'dashboard' : 'onboarding'
  );
  const [activeTab, setActiveTab] = useState<DashboardTab>('daily');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  // Mobile Sidebar State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // App-Wide State
  const [marketPriority, setMarketPriority] = useState<MarketPriority>('General');
  const [competitors, setCompetitors] = useState<string[]>(['Competitor X']);
  const [userCompany, setUserCompany] = useState<string>("Mimas Consulting");

  // Auth State (Session Persistence)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('ai-business-suite-auth') === 'true';
    }
    return false;
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('ai-business-suite-auth', 'true');
  };

  // Initialize theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const renderContent = () => {
    // Determine which main module to render based on the activeTab string
    if (activeTab.startsWith('daily')) return <ExecutiveDaily view={activeTab} marketPriority={marketPriority} />;
    if (activeTab.startsWith('market')) return <MarketIntelligence view={activeTab} isDarkMode={theme === 'dark'} marketPriority={marketPriority} competitors={competitors} userCompany={userCompany} />;
    // Pass onNavigate prop to ContentStudio
    if (activeTab.startsWith('content')) return <ContentStudio view={activeTab} onNavigate={setActiveTab} />;
    if (activeTab === 'agents') return <AgentsView />;
    if (activeTab.startsWith('settings')) return (
      <SettingsView
        view={activeTab}
        marketPriority={marketPriority}
        setMarketPriority={setMarketPriority}
        competitors={competitors}
        setCompetitors={setCompetitors}
        userCompany={userCompany}
        setUserCompany={setUserCompany}
      />
    );

    // Default fallback
    return <ExecutiveDaily view="daily" marketPriority={marketPriority} />;
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    // Updated background text-slate-900 to ensure readability
    <div className="min-h-screen w-full bg-[#F5F5F7] dark:bg-[#374151] text-slate-900 dark:text-white font-sans transition-colors duration-75">
      <CommandPalette onNavigate={(tab) => setActiveTab(tab as DashboardTab)} toggleTheme={toggleTheme} />

      {/* Background Ambience Layer for Slate Theme */}
      <div className="fixed inset-0 pointer-events-none z-0 hidden dark:block">
        {/* Subtle top sheen */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"></div>
        {/* Very subtle radial glow to give depth to the flat slate */}
        <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-blue-900/10 rounded-full blur-[120px]"></div>
      </div>

      {viewState === 'onboarding' ? (
        <Onboarding onComplete={() => {
          sessionStorage.setItem(ONBOARDING_SESSION_KEY, '1');
          setViewState('dashboard');
        }} />
      ) : (
        <div className="relative z-10 flex h-screen overflow-hidden">
          {/* Sidebar - Passed mobile state props */}
          <Sidebar
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setIsMobileMenuOpen(false); // Close on selection (mobile)
            }}
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />

          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            <Header
              activeTab={activeTab}
              theme={theme}
              toggleTheme={toggleTheme}
              onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
            {/* Added animation key to force smooth transitions */}
            <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-32 custom-scrollbar relative animate-fade-in" key={activeTab}>
              {renderContent()}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;