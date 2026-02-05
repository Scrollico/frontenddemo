import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, Diamond, ChevronRight, User, HelpCircle, LogOut, X, CreditCard, Settings, Mail, Menu } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onToggleSidebar?: () => void; // Added prop
}

const getBreadcrumbs = (tab: string): string[] => {
  const map: Record<string, string[]> = {
    'daily': ['Executive Daily'],
    'daily_briefing': ['Executive Daily', 'Daily Briefings'],
    'daily_export': ['Executive Daily', 'Export & Integration'],
    'daily_podcast': ['Executive Daily', 'AI Podcast Mode'],
    'market': ['Market Intelligence'],
    'market_heatmap': ['Market Intelligence', 'Sector Heatmap'],
    'market_niche': ['Market Intelligence', 'Emerging-Niche'],
    'market_radar': ['Market Intelligence', 'Competitor Radar'],
    'market_chat': ['Market Intelligence', 'Predictive Engine'],
    'content': ['Content Studio'],
    'content_linkedin': ['Content Studio', 'LinkedIn Generator'],
    'content_talking': ['Content Studio', 'Talking Points'],
    'content_presentation': ['Content Studio', 'Presentation Deck'],
    'content_infographics': ['Content Studio', 'Data Infographics'],
    'agents': ['AI Agents'],
    'settings': ['Settings'],
    'settings_market': ['Settings', 'Market Prioritization'],
    'settings_competitors': ['Settings', 'Competitor List'],
    'settings_source': ['Settings', 'Source Management'],
    'settings_persona': ['Settings', 'Persona & Voice'],
    'settings_team': ['Settings', 'Team Members'],
  };
  return map[tab] || ['Dashboard'];
};

// --- Account Settings Modal ---
const AccountSettingsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white/80 dark:bg-[#1c1c1e]/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10 bg-white/40 dark:bg-white/5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-500" /> Account Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors duration-75"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Side */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-white/5 border-4 border-white dark:border-[#374151] shadow-inner flex items-center justify-center text-gray-700 dark:text-white font-bold text-2xl relative overflow-hidden">
                {/* Inner glow */}
                <div className="absolute inset-0 bg-white/20 dark:bg-white/5 blur-xl"></div>
                AB
              </div>
              <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">Change Avatar</button>
            </div>

            {/* Form Side */}
            <div className="flex-1 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">First Name</label>
                  <input type="text" defaultValue="Akın" className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Last Name</label>
                  <input type="text" defaultValue="Birgen" className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input type="email" defaultValue="akin.birgen@alara.ai" className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Subscription Plan</h3>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-100 dark:border-blue-500/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                      <Diamond className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">Professional Plan</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Billed Annually</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Manage</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors duration-75"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-bold text-white bg-gray-900 dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg shadow-lg transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({ activeTab, theme, toggleTheme, onToggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const crumbs = getBreadcrumbs(activeTab);

  return (
    <>
      <header className="h-20 px-4 lg:px-8 flex items-center justify-between border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-[#374151]/80 backdrop-blur-xl sticky top-0 z-40 shrink-0 transition-colors duration-75">

        {/* Mobile Menu Toggle */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden mr-4 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg transition-colors duration-75"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Left: Breadcrumbs - Hidden on small mobile */}
        <div className="flex flex-1 md:flex-none items-center gap-2 text-sm min-w-0 overflow-hidden">
          <span className="text-gray-500 font-medium whitespace-nowrap hidden sm:inline">AI Business Suite</span>
          {crumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className={`${idx === crumbs.length - 1 ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500'}`}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Center: Search Bar - Improved margins and max-width */}
        <div className="hidden md:flex flex-1 max-w-lg mx-auto px-4 relative group">
          <div className="absolute inset-y-0 left-7 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-75" strokeWidth={1.5} />
          </div>
          <input
            type="text"
            placeholder="Search news, competitors, or topics..."
            className="w-full bg-gray-100 dark:bg-black/10 border border-transparent dark:border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm dark:shadow-lg dark:shadow-black/20"
          />
          <div className="absolute inset-y-0 right-7 flex items-center pointer-events-none">
            <span className="text-xs text-gray-500 border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5">⌘K</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 min-w-[200px] justify-end">





          {/* Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors duration-75"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" strokeWidth={1.5} /> : <Moon className="w-5 h-5" strokeWidth={1.5} />}
            </button>
            <button className="relative p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors duration-75">
              <Bell className="w-5 h-5" strokeWidth={1.5} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#374151]"></span>
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 pl-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors duration-75 focus:outline-none"
            >
              <div className="text-right hidden xl:block">
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">Akın Birgen</p>
                <p className="text-xs text-gray-500 mt-1 leading-none">CEO / Alara Inc.</p>
              </div>
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-white/10 border-2 border-white dark:border-[#374151] shadow-sm flex items-center justify-center overflow-hidden">
                <img src="/images/ilgaz.webp" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#272e3a] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl animate-fade-in overflow-hidden z-50">
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => { setIsSettingsOpen(true); setIsProfileOpen(false); }}
                    className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors duration-75"
                  >
                    <User className="w-4 h-4 text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
                    Account Settings
                  </button>
                  <button className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors duration-75">
                    <HelpCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
                    Help & Support
                  </button>
                  <div className="h-px bg-gray-200 dark:bg-white/10 my-1"></div>
                  <button className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors duration-75">
                    <LogOut className="w-4 h-4" strokeWidth={1.5} />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Account Settings Modal */}
      <AccountSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};