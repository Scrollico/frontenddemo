
import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { Search, LayoutDashboard, LineChart, FileText, Zap, Settings, Sun, Moon, LogOut, ArrowRight, CornerDownLeft } from 'lucide-react';
import { SEARCH_NAV_ITEMS, INSIGHTS_DATA } from '../../data/mockData';

interface CommandPaletteProps {
    onNavigate: (tab: string) => void;
    toggleTheme: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onNavigate, toggleTheme }) => {
    const [open, setOpen] = useState(false);

    // Toggle with Cmd+K and Ctrl+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const handleSelect = (callback: () => void) => {
        callback();
        setOpen(false);
    };

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Global Command Menu"
            className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)} />

            {/* content */}
            <div className="relative w-full max-w-xl bg-white dark:bg-[#1C1C1E] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden animate-slide-up-fade">
                <div className="flex items-center border-b border-gray-200 dark:border-white/10 px-4">
                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                    <Command.Input
                        placeholder="What do you need?..."
                        className="w-full h-14 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 text-sm"
                    />
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded border border-gray-200 dark:border-white/5">ESC</span>
                    </div>
                </div>

                <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 custom-scrollbar">
                    <Command.Empty className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        No results found.
                    </Command.Empty>

                    <Command.Group heading="Navigation" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                        {SEARCH_NAV_ITEMS.map((item) => (
                            <Command.Item
                                key={item.id}
                                onSelect={() => handleSelect(() => onNavigate(item.id))}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-blue-600 cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-blue-600 aria-selected:text-black dark:aria-selected:text-white transition-colors duration-75 group"
                            >
                                {item.group === 'Dashboard' && <LayoutDashboard className="w-4 h-4 text-gray-400 group-aria-selected:text-current" />}
                                {item.group === 'Intelligence' && <LineChart className="w-4 h-4 text-gray-400 group-aria-selected:text-current" />}
                                {item.group === 'Create' && <FileText className="w-4 h-4 text-gray-400 group-aria-selected:text-current" />}
                                {item.group === 'System' && <Settings className="w-4 h-4 text-gray-400 group-aria-selected:text-current" />}

                                <span className="flex-1">{item.label}</span>
                                <CornerDownLeft className="w-3 h-3 opacity-0 group-aria-selected:opacity-50" />
                            </Command.Item>
                        ))}
                    </Command.Group>

                    <Command.Separator className="h-px bg-gray-200 dark:bg-white/10 my-2 mx-2" />

                    <Command.Group heading="Intelligence & Insights" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                        {INSIGHTS_DATA.map((insight) => (
                            <Command.Item
                                key={insight.id}
                                onSelect={() => handleSelect(() => onNavigate('market_niche'))} // Simplification: Go to niche page
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-blue-600 cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-blue-600 aria-selected:text-black dark:aria-selected:text-white transition-colors duration-75 group"
                            >
                                <Zap className="w-4 h-4 text-yellow-500 group-aria-selected:text-current" />
                                <div className="flex flex-col">
                                    <span className="font-medium">{insight.title}</span>
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 group-aria-selected:text-gray-200 truncate max-w-[300px]">{insight.summary}</span>
                                </div>
                            </Command.Item>
                        ))}
                    </Command.Group>

                    <Command.Separator className="h-px bg-gray-200 dark:bg-white/10 my-2 mx-2" />

                    <Command.Group heading="System" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                        <Command.Item
                            onSelect={() => handleSelect(toggleTheme)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-blue-600 cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-blue-600 aria-selected:text-black dark:aria-selected:text-white transition-colors duration-75 group"
                        >
                            <Sun className="w-4 h-4 text-gray-400 group-aria-selected:text-current dark:hidden" />
                            <Moon className="w-4 h-4 text-gray-400 group-aria-selected:text-current hidden dark:block" />
                            <span>Toggle Theme</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => handleSelect(() => window.location.reload())}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 cursor-pointer aria-selected:bg-red-50 dark:aria-selected:bg-red-900/30 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Log Out</span>
                        </Command.Item>
                    </Command.Group>
                </Command.List>

                <div className="border-t border-gray-200 dark:border-white/10 p-2 px-4 flex items-center justify-between bg-gray-50 dark:bg-white/5">
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                        Search for apps, commands, and more...
                    </span>
                    <div className="flex gap-2">
                        <span className="text-[10px] text-gray-400">Use arrow keys</span>
                        <span className="text-[10px] text-gray-400">Enter to select</span>
                    </div>
                </div>
            </div>
        </Command.Dialog>
    );
};
