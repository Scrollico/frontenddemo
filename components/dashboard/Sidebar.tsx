import React from 'react';
import { LayoutDashboard, LineChart, Feather, Settings2, ChevronDown, ChevronRight, Radar, AudioLines, ScrollText, Share2, Activity, Globe, MessageSquareText, Users, Server, ScanFace, Crosshair, ListFilter, Presentation, PieChart } from 'lucide-react';
import { DashboardTab } from '../../types';
import { AnimatedIcon } from '../ui/AnimatedIcon';

interface SidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  isOpen?: boolean;     // New prop for mobile state
  onClose?: () => void; // New prop for mobile close
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  children?: { id: string; label: string; icon?: React.ElementType }[];
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isOpen = false, onClose }) => {
  const navItems: NavItem[] = [
    {
      id: 'daily',
      label: 'Executive Daily',
      icon: LayoutDashboard,
      children: [
        { id: 'daily_briefing', label: 'Daily Briefings', icon: ScrollText },
        { id: 'daily_export', label: 'Export & Integration', icon: Share2 },
        { id: 'daily_podcast', label: 'AI Podcast Mode', icon: AudioLines },
      ]
    },
    {
      id: 'market',
      label: 'Market Intelligence',
      icon: LineChart,
      children: [
        { id: 'market_heatmap', label: 'Sector Heatmap', icon: Activity },
        { id: 'market_niche', label: 'Emerging-Niche', icon: Globe },
        { id: 'market_radar', label: 'Competitor Radar', icon: Radar },
        { id: 'market_chat', label: 'Predictive Engine', icon: MessageSquareText },
      ]
    },
    {
      id: 'content',
      label: 'Content Studio',
      icon: Feather,
      children: [
        { id: 'content_linkedin', label: 'LinkedIn Generator', icon: Share2 },
        { id: 'content_talking', label: 'Talking Points', icon: ScrollText },
        { id: 'content_presentation', label: 'Presentation Deck', icon: Presentation },
        { id: 'content_infographics', label: 'Data Infographics', icon: PieChart },
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings2,
      children: [
        { id: 'settings_market', label: 'Market Prioritization', icon: Crosshair },
        { id: 'settings_competitors', label: 'Competitor List', icon: ListFilter },
        { id: 'settings_source', label: 'Source Management', icon: Server },
        { id: 'settings_persona', label: 'Persona & Voice', icon: ScanFace },
        { id: 'settings_team', label: 'Team Members', icon: Users },
      ]
    },
  ];

  // Helper to check if a group is active (parent or any child selected)
  const isGroupActive = (item: NavItem) => {
    return activeTab === item.id || item.children?.some(child => child.id === activeTab);
  };

  return (
    <>
      {/* Mobile Overlay - Only visible on small screens when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container - Drawer on Mobile, Static on Desktop */}
      <div className={`
            fixed lg:relative inset-y-0 left-0 z-50 flex flex-col h-full glass-liquid transition-colors duration-75 transition-transform duration-500 ease-in-out border-r border-gray-200 dark:border-white/5
            w-64 lg:w-72 shadow-2xl
            ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
        {/* Logo */}
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-200 dark:border-white/5 shrink-0 group cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10" />
          <img
            src="https://media.licdn.com/dms/image/v2/D4D0BAQEmph9wW1PzWg/company-logo_200_200/company-logo_200_200/0/1738097380814/scrolli_logo?e=2147483647&v=beta&t=eYQLsmTf_cJKZ69DnG41JY7cSzGcra50-7bFKGLmiD8"
            alt="Scrolli Logo"
            className="w-8 h-8 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-blue-600/20"
          />
          <div className="flex flex-col ml-3 min-w-0">
            <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-500">Scrolli</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-tight mt-0.5">AI Business Suite</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 space-y-2 px-3 lg:px-4 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = isGroupActive(item);
            const isDirectlyActive = activeTab === item.id || (item.children?.[0] && activeTab === item.children[0].id);

            return (
              <div key={item.id} className="mb-2">
                <button
                  onClick={() => {
                    if (item.children) {
                      // On mobile, if clicking a category, we might just want to expand/collapse 
                      // if it's not the active group.
                      onTabChange(item.children[0].id);
                    } else {
                      onTabChange(item.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-500 group relative overflow-hidden ${isDirectlyActive
                    ? 'bg-iosBlue text-white shadow-xl shadow-iosBlue/30'
                    : isActive
                      ? 'bg-white/5 text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden relative z-10">
                    <AnimatedIcon
                      icon={item.icon}
                      className={`w-5 h-5 flex-shrink-0 transition-all duration-500 ${isDirectlyActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : isActive ? 'text-white/90 drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]' : 'text-gray-400 group-hover:text-white/80'}`}
                      isActive={isActive}
                    />
                    <span className="font-bold text-sm text-left truncate tracking-tight">{item.label}</span>
                  </div>
                  {item.children && (
                    <div className="transition-transform duration-500 relative z-10">
                      {isActive ? <ChevronDown className="w-4 h-4 opacity-50" /> : <ChevronRight className="w-4 h-4 opacity-50" />}
                    </div>
                  )}
                  {isDirectlyActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  )}
                </button>

                {/* Sub-menu */}
                <div className={`ml-4 pr-3 overflow-hidden transition-all duration-500 ease-in-out ${isActive && item.children ? 'max-h-80 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                  <div className="pl-4 border-l-2 border-gray-100 dark:border-white/5 space-y-1">
                    {item.children?.map((child) => (
                      <button
                        key={child.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTabChange(child.id);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] transition-all duration-300 group/sub ${activeTab === child.id
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-500/5 font-bold translate-x-2'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-500/5 hover:translate-x-2'
                          }`}
                      >
                        <span className="truncate">{child.label}</span>
                        {activeTab === child.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer / Version */}
        <div className="p-8 border-t border-gray-200 dark:border-white/5 shrink-0">
          <div className="flex flex-col items-center gap-2">
            <div className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">v1.2 Platform</span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Scrolli Intelligence Systems</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;