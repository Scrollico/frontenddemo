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
            fixed lg:relative inset-y-0 left-0 z-50 flex flex-col h-full bg-white/80 dark:bg-[#374151]/90 backdrop-blur-xl transition-colors duration-75 transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-white/5
            w-64 lg:w-72 
            ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
        {/* Logo */}
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-200 dark:border-white/5 shrink-0 group cursor-pointer relative">
          <img
            src="https://media.licdn.com/dms/image/v2/D4D0BAQEmph9wW1PzWg/company-logo_200_200/company-logo_200_200/0/1738097380814/scrolli_logo?e=2147483647&v=beta&t=eYQLsmTf_cJKZ69DnG41JY7cSzGcra50-7bFKGLmiD8"
            alt="Scrolli Logo"
            className="w-8 h-8 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-600/20"
          />
          <div className="flex flex-col ml-3 min-w-0">
            <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-75">Scrolli</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-tight mt-0.5">AI Business Suite</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 space-y-1 px-3 lg:px-4 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = isGroupActive(item);
            const isDirectlyActive = activeTab === item.id || (item.children?.[0] && activeTab === item.children[0].id);

            return (
              <div key={item.id} className="mb-2">
                <button
                  onClick={() => onTabChange(item.children?.[0]?.id ?? item.id)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-300 group ${isDirectlyActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 dark:shadow-blue-900/50'
                    : isActive
                      ? 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <AnimatedIcon
                      icon={item.icon}
                      className={`w-5 h-5 flex-shrink-0 ${isDirectlyActive ? 'text-white' : isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-white'}`}
                      isActive={isActive}
                    />
                    <span className="font-medium text-sm text-left truncate">{item.label}</span>
                  </div>
                  {item.children && (
                    <div className="transition-transform duration-300">
                      {isActive ? <ChevronDown className="w-4 h-4 opacity-50" /> : <ChevronRight className="w-4 h-4 opacity-50" />}
                    </div>
                  )}
                </button>

                {/* Sub-menu */}
                <div className={`ml-4 pr-3 overflow-hidden transition-all duration-300 ease-in-out ${isActive && item.children ? 'max-h-60 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                  <div className="pl-4 border-l border-gray-200 dark:border-white/10 space-y-1">
                    {item.children?.map((child) => (
                      <button
                        key={child.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTabChange(child.id);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group/sub ${activeTab === child.id
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 font-medium translate-x-1'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 hover:translate-x-1'
                          }`}
                      >
                        <span className="truncate">{child.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer / Version */}
        <div className="p-6 border-t border-gray-200 dark:border-white/5 shrink-0 text-xs text-gray-500 dark:text-gray-400 text-center">
          AI Business Suite v1.1 Pro
        </div>
      </div>
    </>
  );
};

export default Sidebar;