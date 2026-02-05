import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Send, Sparkles, ArrowUpRight, ArrowDownRight, MoreHorizontal, Globe, Activity, RefreshCw, TrendingUp, ChevronRight, Info, BarChart3, Zap, AlertTriangle, BrainCircuit, Target, Lightbulb, Compass, FileText, TrendingDown, Download, Bookmark, Users, Signal, Trophy, Percent, ShieldCheck, Crosshair, Newspaper, DollarSign, Briefcase, X } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { HeatmapItem, NicheTopic, ChatMessage, MarketPriority } from '../../types';
import { chatWithAgent, generateMarketSignals, generateCompetitorAnalysis } from '../../services/geminiService';
import { jsPDF } from 'jspdf';
import { INSIGHTS_DATA, COMPETITOR_NEWS_MOCK } from '../../data/mockData';

interface MarketIntelligenceProps {
    view: string;
    isDarkMode: boolean;
    marketPriority: MarketPriority;
    competitors: string[];
    userCompany: string;
}

// Extended Interface for local state to include insights
interface EnrichedHeatmapItem extends HeatmapItem {
    driver: string;
    volume: string;
    insight: string;
    indexValue?: string; // e.g. "14,500"
}

// Extend ChatMessage to hold metadata
interface ExtendedChatMessage extends ChatMessage {
    groundingMetadata?: any;
}

const SUGGESTED_PROMPTS = [
    "Forecast the impact of rising oil prices on the Logistics sector.",
    "Analyze correlations between US Tech stocks and Asian markets.",
    "What are the projected risks for AI regulation in the EU?"
];

// Default Mock Data for Radar Chart to ensure it's never empty
const DEFAULT_RADAR_DATA = [
    { subject: 'Innovation', A: 135, B: 90, fullMark: 150, insight: "Leading with AI-driven forecasting" },
    { subject: 'Market Share', A: 95, B: 140, fullMark: 150, insight: "Competitor aggressive in APAC" },
    { subject: 'Mkt. Growth', A: 110, B: 130, fullMark: 150, insight: "Rapid emerging market entry" },
    { subject: 'R&D Spend', A: 145, B: 85, fullMark: 150, insight: "Dedicating 18% revenue to R&D" },
    { subject: 'Brand Velocity', A: 100, B: 135, fullMark: 150, insight: "Viral campaign success" },
    { subject: 'Talent', A: 125, B: 95, fullMark: 150, insight: "Quantitative team stable" },
    { subject: 'ESG Score', A: 115, B: 80, fullMark: 150, insight: "Green Bond framework superior" },
    { subject: 'Revenue', A: 90, B: 125, fullMark: 150, insight: "M&A strategy paying off" },
];

const MarketIntelligence: React.FC<MarketIntelligenceProps> = ({ view, isDarkMode, marketPriority, competitors, userCompany }) => {
    const [sectors, setSectors] = useState<EnrichedHeatmapItem[]>([]);
    const [nicheTopics, setNicheTopics] = useState<NicheTopic[]>([]);
    const [groundingMetadata, setGroundingMetadata] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [expandedInsightId, setExpandedInsightId] = useState<number | null>(null);

    // Niche Detail Modal State
    const [selectedNiche, setSelectedNiche] = useState<NicheTopic | null>(null);

    // Radar State - Initialize with DEFAULT data to prevent empty state
    const [radarData, setRadarData] = useState<any[]>(DEFAULT_RADAR_DATA);
    const [radarTakeaways, setRadarTakeaways] = useState<any[]>([
        { category: "Competitor Action", icon: "Zap", title: "Market Move", text: `Competitor X is aggressively discounting to capture market share.`, sentiment: "negative" },
        { category: "Innovation Defense", icon: "BrainCircuit", title: "Tech Lead", text: `${userCompany} retains a strong IP portfolio advantage in core tech.`, sentiment: "positive" },
        { category: "Talent Metrics", icon: "Users", title: "Stability", text: "Turnover rates remain low compared to industry average.", sentiment: "positive" }
    ]);
    const [radarLoading, setRadarLoading] = useState(false);

    // Static Data for Instant Load & Premium UI
    useEffect(() => {
        // Immediate population with premium mock data
        setSectors([
            { sector: 'Technology', indexValue: '18,342', change: 2.8, volatility: 'High', driver: 'AI Hardware Rally', volume: 'High', insight: 'Semiconductor earnings beat expectations by 15%, signaling sustained demand for AI infrastructure well into Q4, with cloud providers increasing CapEx guidance.' },
            { sector: 'Energy', indexValue: '4,210', change: -1.2, volatility: 'Medium', driver: 'OPEC+ Supply', volume: 'Med', insight: 'Price correction following inventory surplus report; major producers likely to maintain current output caps to stabilize floor price around $78/barrel.' },
            { sector: 'Health', indexValue: '5,890', change: 0.9, volatility: 'Low', driver: 'BioTech M&A', volume: 'Med', insight: 'Defensive rotation into large-cap pharma as investors seek stability amidst rate uncertainty, fueled by rumors of a mega-merger in the oncology space.' },
            { sector: 'Finance', indexValue: '34,205', change: 1.5, volatility: 'Medium', driver: 'Yield Curve', volume: 'High', insight: 'Regional banks stabilizing post-stress test results, with net interest margins showing unexpected resilience despite inverted yield curve pressures.' },
            { sector: 'Crypto', indexValue: '68,500', change: -3.4, volatility: 'High', driver: 'Regulatory News', volume: 'High', insight: 'Sharp sell-off triggered by new SEC guidance on staking services; institutional volume remains flat as uncertainty regarding ETF approvals lingers.' },
            { sector: 'Retail', indexValue: '2,450', change: 0.4, volatility: 'Low', driver: 'Consumer Sentiment', volume: 'Low', insight: 'Mixed earnings from big-box retailers suggest consumer spending is shifting heavily towards essentials and discount channels.' },
            { sector: 'Real Estate', indexValue: '1,120', change: -0.5, volatility: 'Low', driver: 'Mortgage Rates', volume: 'Low', insight: 'Commercial sector remains under pressure due to refinancing risks in metropolitan office markets, though industrial warehousing demand stays robust.' },
            { sector: 'Industrials', indexValue: '9,840', change: 1.8, volatility: 'Medium', driver: 'Infrastructure Bill', volume: 'Med', insight: 'Capital goods orders showing strength driven by federal spending on green manufacturing hubs and defense contract renewals.' },
            { sector: 'Utilities', indexValue: '870', change: 0.2, volatility: 'Low', driver: 'Safe Haven', volume: 'Low', insight: 'Flat performance amidst growth sector rally; dividend yields remain attractive for conservative portfolios seeking inflation hedges.' },
            { sector: 'Materials', indexValue: '3,300', change: 1.1, volatility: 'Medium', driver: 'Commodity Prices', volume: 'Med', insight: 'Copper demand rising on EV production targets; lithium markets showing signs of bottoming out after last quarter\'s oversold conditions.' },
            { sector: 'Cons. Disc.', indexValue: '6,780', change: 2.1, volatility: 'High', driver: 'Luxury Demand', volume: 'High', insight: 'Asian markets driving luxury rebound, specifically in high-end fashion and automotive segments, offsetting softer North American sales.' },
            { sector: 'Telecom', indexValue: '1,950', change: -0.8, volatility: 'Low', driver: '5G CapEx', volume: 'Low', insight: 'Slowing subscriber growth in EU markets prompting CapEx cuts for major carriers, impacting equipment suppliers negatively.' },
        ]);
        setNicheTopics([
            { topic: 'Solid-State Batteries', signal: 'High', mentions: 1240, growth: '+45%', insight: 'Breakthroughs in energy density are accelerating EV adoption timelines by 2-3 years, prompting major automotive OEMs to re-evaluate supply chain contracts.' },
            { topic: 'Generative Design', signal: 'Medium', mentions: 850, growth: '+22%', insight: 'Manufacturing sectors are adopting AI design tools to reduce material waste by up to 30%, driving efficiency in aerospace and automotive fabrication.' },
            { topic: 'Green Hydrogen', signal: 'High', mentions: 980, growth: '+38%', insight: 'Heavy industry subsidies in the EU are driving a Capex boom in electrolysis infrastructure, creating new opportunities for specialized engineering firms.' },
            { topic: 'Quantum Encryption', signal: 'Low', mentions: 320, growth: '+12%', insight: 'Early-stage pilots in banking sector suggest a coming shift in cybersecurity standards, though widespread commercial viability remains 5+ years out.' },
            { topic: 'Neuromorphic Chips', signal: 'Medium', mentions: 540, growth: '+28%', insight: 'Edge AI applications are demanding lower latency and power consumption, pushing neuromorphic architecture from research labs to specialized use cases.' },
            { topic: 'Space Logistics', signal: 'High', mentions: 410, growth: '+65%', insight: 'Private launch costs dropping below $1,500/kg is opening new markets for orbital manufacturing and satellite servicing, attracting significant VC interest.' },
            { topic: 'Synthetic Biology', signal: 'Medium', mentions: 670, growth: '+31%', insight: 'Precision fermentation technologies are reaching price parity with traditional agriculture in specific high-value protein segments.' },
            { topic: 'Carbon Capture', signal: 'High', mentions: 1100, growth: '+42%', insight: 'Direct Air Capture (DAC) facilities are securing long-term offtake agreements with major tech firms, validating the business model for scalable carbon removal.' },
            { topic: 'Legacy Auto', signal: 'Low', mentions: 800, growth: '-15%', insight: 'Traditional auto manufacturers losing market share rapidly.' },
            { topic: 'Coal Mining', signal: 'Low', mentions: 300, growth: '-22%', insight: 'Regulatory pressure closing mines faster than expected.' },
        ]);

        // If view changes or priority changes, try to fetch new data if cache isn't valid
        if (view === 'market_heatmap' || view === 'market_niche') {
            handleRefresh();
        }
        if (view === 'market_radar') {
            handleRadarRefresh();
        }
    }, [marketPriority, view, userCompany, competitors]); // Re-run if user changes company or competitors

    const handleRefresh = async () => {
        setLoading(true);
        const result = await generateMarketSignals(marketPriority);
        if (result && result.data && result.data.sectors) {
            // Map API result to Enriched format
            const enrichedSectors = result.data.sectors.map((s: any) => ({
                ...s,
                // Correctly map API response fields to local state, falling back to logical defaults only if missing
                driver: s.driver || 'Market Shift',
                volume: s.volume || 'Medium',
                insight: s.insight || `Recent analysis of the ${s.sector} sector indicates volatility driven by global economic shifts and ${marketPriority} trends.`,
                indexValue: s.indexValue || '4,250'
            }));
            setSectors(enrichedSectors);

            if (result.data.nicheTopics) {
                setNicheTopics(result.data.nicheTopics);
            }
            setGroundingMetadata(result.groundingMetadata);
        }
        setLoading(false);
    };

    const handleRadarRefresh = async () => {
        setRadarLoading(true);
        const result = await generateCompetitorAnalysis(userCompany, competitors);
        if (result) {
            if (result.radarData.length > 0) setRadarData(result.radarData);
            if (result.takeaways.length > 0) setRadarTakeaways(result.takeaways);
            if (result.groundingMetadata) setGroundingMetadata(result.groundingMetadata);
        } else {
            // If API fails, ensure we fallback to default so chart isn't empty
            setRadarData(DEFAULT_RADAR_DATA);
        }
        setRadarLoading(false);
    }

    // ... (Chat State & Components remain same)
    // Re-instantiating chat components for brevity
    const [messages, setMessages] = useState<ExtendedChatMessage[]>([
        {
            id: '1',
            role: 'ai',
            text: `Hello, I'm the AI Business Suite. I've calibrated your intelligence feed for **${marketPriority}**. How can I assist you?`,
            timestamp: Date.now()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (textOverride?: string) => {
        const textToSend = textOverride || input.trim();
        if (!textToSend) return;

        const userMsg: ExtendedChatMessage = { id: Date.now().toString(), role: 'user', text: textToSend, timestamp: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        const history = messages.map(m => ({
            role: m.role === 'ai' ? 'model' : 'user',
            parts: [{ text: m.text }]
        }));

        const response = await chatWithAgent(history, userMsg.text);

        const aiMsg: ExtendedChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            text: response.text,
            timestamp: Date.now(),
            groundingMetadata: response.groundingMetadata
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
    };

    const toggleInsight = (id: number) => {
        setExpandedInsightId(prev => prev === id ? null : id);
    };

    const handleDownloadNichePDF = () => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        const pageW = doc.internal.pageSize.getWidth();
        const margin = 14;
        const maxW = pageW - margin * 2;
        let y = margin;
        const lineH = 5;
        const smallH = 4;

        const addWrappedText = (text: string, fontSize: number, isBold = false): number => {
            doc.setFontSize(fontSize);
            doc.setFont('helvetica', isBold ? 'bold' : 'normal');
            const lines = doc.splitTextToSize(text, maxW);
            lines.forEach((line: string) => {
                if (y > 275) {
                    doc.addPage();
                    y = margin;
                }
                doc.text(line, margin, y);
                y += lineH;
            });
            return y;
        };

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('AI Business Suite — Niche Market Insights', margin, y);
        y += lineH * 2;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated ${new Date().toLocaleDateString()} • ${INSIGHTS_DATA.length} insights`, margin, y);
        doc.setTextColor(0, 0, 0);
        y += lineH * 1.5;

        INSIGHTS_DATA.forEach((item, idx) => {
            if (y > 260) {
                doc.addPage();
                y = margin;
            }
            y += 2;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(`${idx + 1}. ${item.title}`, margin, y);
            y += lineH;
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text(`Date: ${item.date}`, margin, y);
            y += lineH;
            doc.setTextColor(0, 0, 0);
            y = addWrappedText(item.summary, 9) + 2;
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text('Strategic implication', margin, y);
            y += lineH;
            doc.setFont('helvetica', 'normal');
            y = addWrappedText(item.details, 8) + lineH;
        });

        doc.save(`AIBusinessSuite_Niche_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    // --- Sub-Components ---
    const HeatmapComponent = ({ limit }: { limit?: number }) => (
        <div className={`grid ${limit ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'} gap-4`}>
            {(limit ? sectors.slice(0, limit) : sectors).map((item, idx) => {
                const isPositive = item.change >= 0;
                return (
                    <div key={idx} className="group cursor-pointer">
                        <GlassCard className="relative hover:-translate-y-1 hover:shadow-2xl h-32 overflow-hidden border border-white/20 dark:border-white/10 bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl" noPadding>
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${isPositive ? 'from-emerald-500/10' : 'from-red-500/10'} to-transparent rounded-full blur-2xl -mr-10 -mt-10 transition-opacity`} />
                            <div className="p-5 h-full flex flex-col justify-between relative z-10">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-gray-700 dark:text-gray-200 tracking-tight">{item.sector}</span>
                                        <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-0.5">{item.indexValue || '4,200'}</span>
                                    </div>
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border backdrop-blur-md ${isPositive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'}`}>
                                        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                        <span className="text-xs font-bold">{Math.abs(item.change)}%</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end mt-auto">
                                    <div className="flex items-center gap-1">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mr-1">Vol</span>
                                        <div className="flex gap-0.5 items-end h-3">
                                            <div className={`w-1 rounded-sm ${item.volume === 'Low' || item.volume === 'Med' || item.volume === 'High' ? 'bg-gray-400 h-1.5' : 'bg-gray-200 h-1.5'}`}></div>
                                            <div className={`w-1 rounded-sm ${item.volume === 'Med' || item.volume === 'High' ? 'bg-gray-400 h-2' : 'bg-gray-200 h-1.5'}`}></div>
                                            <div className={`w-1 rounded-sm ${item.volume === 'High' ? 'bg-gray-400 h-3' : 'bg-gray-200 h-1.5'}`}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center px-6">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 tracking-widest">Key Driver</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200 leading-snug">{item.driver}</p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full border ${item.volatility === 'High' ? 'border-red-500/30 text-red-500' : 'border-gray-500/30 text-gray-500'}`}>
                                            {item.volatility} VOL
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                );
            })}
        </div>
    );

    const AnalystNotesComponent = ({ limit }: { limit?: number }) => {
        const itemsToDisplay = limit ? sectors.slice(0, limit) : sectors;
        return (
            <div className="space-y-4 mt-8">
                <div className="flex items-center justify-between pb-4">
                    {/* Updated: Capitalize instead of uppercase */}
                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-widest flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Market Intelligence Feed
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {itemsToDisplay.map((item, idx) => {
                        const isPositive = item.change >= 0;
                        return (
                            <GlassCard key={idx} className="group relative p-4 bg-white/30 dark:bg-slate-800/20 border border-white/20 dark:border-white/5 hover:bg-white/50 dark:hover:bg-slate-800/40 transition-colors duration-75" noPadding>
                                <div className="flex items-start gap-4">
                                    <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border backdrop-blur-sm ${isPositive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                        {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-gray-900 dark:text-white">{item.sector}</span>
                                            <span className="text-[10px] text-gray-400">•</span>
                                            {/* Updated: Shortened text, removed full uppercase */}
                                            <span className="text-[10px] text-gray-500 dark:text-gray-400 capitalize tracking-wide">{item.driver}</span>
                                        </div>
                                        {/* Updated: Clamp lines to 2 */}
                                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-light line-clamp-2">
                                            {item.insight}
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>
            </div>
        );
    };

    // --- Niche Modal for Deep Dive (portal so overlay covers full page: sidebar + header) ---
    const NicheDetailModal = ({ topic, onClose }: { topic: NicheTopic, onClose: () => void }) => {
        // Mock data for chart
        const trendData = [
            { month: 'Jan', value: 30 }, { month: 'Feb', value: 45 }, { month: 'Mar', value: 42 },
            { month: 'Apr', value: 60 }, { month: 'May', value: 75 }, { month: 'Jun', value: 85 }
        ];

        const modalContent = (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-xl transition-opacity" onClick={onClose} />
                {/* Reduced size: max-w-2xl and limited height */}
                <div className="relative w-full max-w-2xl bg-white dark:bg-[#1C1C1E] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[80vh]">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-start bg-gray-50/50 dark:bg-white/5">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{topic.topic}</h2>
                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 bg-white dark:bg-white/5">
                                    {topic.signal} Signal
                                </span>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors duration-75">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Body - Simplified */}
                    <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                        {/* Section 1: Executive Insight - Shorter */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-blue-500" /> Brief
                            </h3>
                            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
                                {topic.insight}
                            </p>
                        </div>

                        {/* Section 2: Trend Chart */}
                        <div className="h-48 w-full">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-emerald-500" /> Velocity
                            </h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        labelStyle={{ color: '#888' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorTrend)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        );

        return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
    };

    const NicheComponent = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {nicheTopics.map((item, idx) => (
                <div key={idx} onClick={() => setSelectedNiche(item)} className="cursor-pointer group">
                    <GlassCard className="h-full p-6 bg-white/60 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-white/10 hover:border-blue-500/30 hover:shadow-xl transition-all relative overflow-hidden" noPadding>
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.signal === 'High' ? 'from-emerald-500/10' : item.signal === 'Medium' ? 'from-blue-500/10' : 'from-gray-500/10'} to-transparent rounded-full blur-2xl -mr-8 -mt-8`} />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${item.signal === 'High' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : item.signal === 'Medium' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10'}`}>
                                    {item.signal} Signal
                                </span>
                                <span className={`text-xs font-bold ${item.growth.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{item.growth}</span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-blue-500 transition-colors duration-75">{item.topic}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed mb-4 flex-1">{item.insight}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5 mt-auto">
                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <Activity className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-medium uppercase tracking-wider">{item.mentions} Mentions</span>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                                    <ArrowUpRight className="w-3 h-3" />
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            ))}
        </div>
    );

    const NicheInsightsCollection = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Niche Market Insights
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={handleDownloadNichePDF}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors duration-75"
                    >
                        <Download className="w-3 h-3" /> Export PDF
                    </button>
                </div>
            </div>
            <GlassCard className="p-0 overflow-hidden transition-all bg-white dark:bg-[#1C1C1E]">
                {INSIGHTS_DATA.map((item) => {
                    const isExpanded = expandedInsightId === item.id;
                    return (
                        <div key={item.id} className={`flex flex-col border-b border-gray-100 dark:border-white/5 last:border-0 transition-colors duration-75 ${isExpanded ? 'bg-gray-50 dark:bg-white/5' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                            <div
                                className="flex items-start gap-4 p-4 cursor-pointer"
                                onClick={() => toggleInsight(item.id)}
                            >
                                <div className="mt-1"><Bookmark className={`w-4 h-4 transition-colors duration-75 ${isExpanded ? 'text-blue-600' : 'text-gray-400'}`} /></div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className={`font-bold text-sm transition-colors duration-75 ${isExpanded ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>{item.title}</h4>
                                        <span className="text-[10px] text-gray-400">{item.date}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{item.summary}</p>
                                </div>
                                <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-blue-500' : ''}`} />
                            </div>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="p-4 pt-0 pl-12 pr-8">
                                    <div className="p-4 bg-white dark:bg-black/20 rounded-lg border border-gray-100 dark:border-white/5 shadow-inner">
                                        <h5 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1">
                                            <Info className="w-3 h-3" /> Strategic Implication
                                        </h5>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {item.details}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </GlassCard>
        </div>
    );

    // --- NEW: Stacked Competitive Metrics (Right Sidebar Style) ---
    const StackedCompetitiveMetrics = () => (
        <div className="flex flex-col gap-4 h-full">
            {[
                { label: "Market Cap", value: "$4.2B", compValue: "$3.8B", delta: "+10.5%", isGood: true, icon: DollarSign },
                { label: "Net Margin", value: "24.5%", compValue: "21.0%", delta: "+3.5%", isGood: true, icon: Activity },
                { label: "CAC", value: "$1,250", compValue: "$980", delta: "+27%", isGood: false, icon: Users },
                { label: "Brand Sentiment", value: "88/100", compValue: "72/100", delta: "+16pts", isGood: true, icon: Briefcase },
            ].map((m, i) => (
                <GlassCard key={i} className="p-4 flex flex-col justify-between relative group bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 transition-colors duration-75" noPadding>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gray-100 dark:bg-white/10 rounded-md text-gray-500 dark:text-gray-400">
                                <m.icon className="w-3 h-3" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{m.label}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${m.isGood ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'}`}>
                            {m.delta}
                        </span>
                    </div>
                    <div className="flex justify-between items-end">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{m.value}</h4>
                        <span className="text-[10px] text-gray-400 font-medium mb-1">vs {m.compValue}</span>
                    </div>
                </GlassCard>
            ))}
        </div>
    );

    const CompetitorNewsFeed = () => (
        <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Newspaper className="w-4 h-4 text-purple-500" /> Intelligence Feed & Signals
                </h3>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded font-medium">
                    Live Updates
                </span>
            </div>
            <div className="grid grid-cols-1 gap-3">
                {COMPETITOR_NEWS_MOCK.map((news) => (
                    <a
                        key={news.id}
                        href={(news as { url?: string }).url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:bg-white/60 dark:hover:bg-white/10 transition-all flex items-start gap-4 cursor-pointer no-underline text-inherit"
                    >
                        <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border backdrop-blur-sm ${news.sentiment === 'positive' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : news.sentiment === 'negative' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-gray-500/10 border-gray-500/20 text-gray-500'}`}>
                            <Globe className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{news.source}</span>
                                    <span className="text-[9px] bg-gray-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 font-medium">{news.tag}</span>
                                </div>
                                <span className="text-[10px] text-gray-400">{news.date}</span>
                            </div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white leading-snug group-hover:text-blue-500 transition-colors duration-75">{news.title}</h4>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-[10px] text-gray-400">Impact Score:</span>
                                <div className="flex gap-0.5">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={`w-3 h-1 rounded-full ${i <= (news.impact === 'High' ? 3 : news.impact === 'Medium' ? 2 : 1) ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-75 shrink-0" />
                    </a>
                ))}
            </div>
        </div>
    );

    const CustomRadarTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-xl p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl min-w-[240px]">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-100 dark:border-white/10 flex items-center gap-2 uppercase tracking-wider text-[10px]">
                        <Crosshair className="w-3.5 h-3.5 text-blue-500" /> {label} Analysis
                    </h4>
                    <div className="space-y-3">
                        {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-sm shadow-sm" style={{ backgroundColor: entry.stroke }}></div>
                                    <span className="text-gray-600 dark:text-gray-300 font-semibold">{entry.name}</span>
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white">{entry.value} <span className="text-[9px] font-normal text-gray-400">/ 150</span></span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/10">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-snug">
                            <span className="font-bold text-blue-500 uppercase tracking-wider text-[9px] mr-1">Signal:</span>
                            {payload[0]?.payload?.insight}
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    const GartnerRadarChart = ({ detailMode = false }: { detailMode?: boolean }) => {
        const primaryCompetitor = competitors[0] || "Competitor X";

        // Updated monochrome aesthetic colors
        // User: Silver/White glow
        const userColor = "#E2E8F0";
        // Comp: Deep Blue
        const compColor = "#3B82F6";

        return (
            <div className={`flex flex-col w-full h-full`}>
                {/* Radar Chart Container - Increased height for fix */}
                <div className={`flex-1 w-full relative flex items-center justify-center p-2 min-h-[350px]`}>
                    {/* Background Glow (CSS based) */}
                    <div className="absolute inset-0 bg-radial-glow pointer-events-none" style={{
                        background: `radial-gradient(circle at 50% 50%, ${isDarkMode ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.03)'} 0%, transparent 70%)`
                    }} />

                    {/* Always Render Chart if Data Exists (Default or API) */}
                    <ResponsiveContainer width="100%" height="100%">
                        {/* Increased outerRadius to 60% (detail) and 50% (widget) */}
                        <RadarChart cx="50%" cy="50%" outerRadius={detailMode ? "60%" : "50%"} data={radarData}>
                            <defs>
                                {/* Neon Glow Filters */}
                                <filter id="glowUser" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                                <filter id="glowComp" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                            </defs>
                            <PolarGrid
                                gridType="polygon"
                                stroke={isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}
                                strokeWidth={1}
                            />
                            <PolarAngleAxis
                                dataKey="subject"
                                tick={{
                                    fill: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                                    fontSize: 11,
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    fontFamily: 'Inter'
                                }}
                            />
                            <PolarRadiusAxis angle={30} domain={[0, 160]} tick={false} axisLine={false} />

                            <Radar
                                name={userCompany}
                                dataKey="A"
                                stroke={userColor}
                                strokeWidth={3}
                                fill={userColor}
                                fillOpacity={0.2}
                                isAnimationActive={true}
                                style={{ filter: isDarkMode ? 'url(#glowUser)' : 'none' }}
                            />

                            <Radar
                                name={primaryCompetitor}
                                dataKey="B"
                                stroke={compColor}
                                strokeWidth={3}
                                fill={compColor}
                                fillOpacity={0.2}
                                isAnimationActive={true}
                                style={{ filter: isDarkMode ? 'url(#glowComp)' : 'none' }}
                            />

                            <Tooltip content={<CustomRadarTooltip />} cursor={false} />
                            <Legend iconType="rect" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontFamily: 'Inter', fontWeight: 600, color: isDarkMode ? '#ccc' : '#333' }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    const SourcesFooter = () => {
        if (!groundingMetadata?.groundingChunks?.length) return null;
        return (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 px-2 pb-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Live Data Sources</h4>
                <div className="flex flex-wrap gap-2">
                    {groundingMetadata.groundingChunks.map((chunk: any, i: number) => (
                        chunk.web?.uri && (
                            <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] flex items-center gap-1 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 px-2 py-1 rounded transition-colors duration-75">
                                <Globe className="w-3 h-3" />
                                <span className="max-w-[150px] truncate">{chunk.web.title || new URL(chunk.web.uri).hostname}</span>
                            </a>
                        )
                    ))}
                </div>
            </div>
        )
    }

    const ChatComponent = () => {
        // Basic Markdown Parser for Bold Text
        const parseBold = (text: string) => {
            return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        };

        const renderMessageContent = (msg: ExtendedChatMessage) => {
            const lines = msg.text.split('\n');
            return (
                <>
                    {lines.map((line, i) => {
                        // Headers/Sections - Replaced Emojis with Icons
                        // Removing emoji chars and rendering corresponding Lucide icon
                        const cleanLine = line.replace(/###/g, '').replace(/\*/g, '').replace(/🔮|📊|📡|🛡️|🚀/g, '').trim();

                        if (line.includes('Forecast') || line.includes('🔮')) return <h4 key={i} className="font-bold text-purple-400 mt-4 mb-2 uppercase text-xs tracking-wider flex items-center gap-2"><Sparkles className="w-3 h-3" /> {cleanLine}</h4>;
                        if (line.includes('Evidence') || line.includes('📊')) return <h4 key={i} className="font-bold text-blue-400 mt-4 mb-2 uppercase text-xs tracking-wider flex items-center gap-2"><BarChart3 className="w-3 h-3" /> {cleanLine}</h4>;
                        if (line.includes('Signal') || line.includes('📡')) return <h4 key={i} className="font-bold text-emerald-400 mt-4 mb-2 uppercase text-xs tracking-wider flex items-center gap-2"><Signal className="w-3 h-3" /> {cleanLine}</h4>;
                        if (line.includes('Risk') || line.includes('🛡️')) return <h4 key={i} className="font-bold text-red-400 mt-4 mb-2 uppercase text-xs tracking-wider flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> {cleanLine}</h4>;
                        if (line.includes('Action') || line.includes('🚀')) return <h4 key={i} className="font-bold text-orange-400 mt-4 mb-2 uppercase text-xs tracking-wider flex items-center gap-2"><Target className="w-3 h-3" /> {cleanLine}</h4>;

                        // Blockquotes
                        if (line.trim().startsWith('>')) {
                            return (
                                <div key={i} className="pl-3 border-l-2 border-blue-500 my-2 italic text-gray-400 text-sm">
                                    {line.replace('>', '').trim()}
                                </div>
                            )
                        }

                        // Bullet points
                        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                            return (
                                <div key={i} className="flex items-start gap-2 mb-1 pl-1">
                                    <div className="w-1 h-1 rounded-full bg-gray-500 mt-2 shrink-0"></div>
                                    <span className="text-gray-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: parseBold(line.replace(/^[-*]\s/, '')) }}></span>
                                </div>
                            )
                        }

                        if (line.trim() === '') return <div key={i} className="h-1" />;

                        return <p key={i} className="text-gray-200 text-sm leading-relaxed mb-1" dangerouslySetInnerHTML={{ __html: parseBold(line) }}></p>;
                    })}

                    {/* Data References Section */}
                    {msg.groundingMetadata?.groundingChunks?.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-white/10">
                            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <Globe className="w-3 h-3" /> Data References
                            </h5>
                            <div className="flex flex-wrap gap-2">
                                {msg.groundingMetadata.groundingChunks.map((chunk: any, i: number) => (
                                    chunk.web?.uri && (
                                        <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-white/5 hover:bg-blue-900/20 border border-white/10 rounded px-2 py-1 text-[10px] text-blue-400 transition-colors duration-75">
                                            <span className="truncate max-w-[150px]">{chunk.web.title || "Source"}</span>
                                            <ArrowUpRight className="w-2.5 h-2.5 opacity-50" />
                                        </a>
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </>
            );
        };

        return (
            <div className="absolute inset-0 flex flex-col min-h-0 bg-slate-800/80">
                {/* Messages: scrollable, with padding so last message isn't under input bar */}
                <div className="flex-1 min-h-0 overflow-y-auto p-4 pb-2 space-y-4 custom-scrollbar scroll-smooth" ref={scrollRef} style={{ paddingBottom: 'calc(1rem + 88px)' }}>
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'ai' ? 'bg-white/5 text-gray-200 border border-white/10' : 'bg-blue-600 text-white shadow-md'}`}>
                                {msg.role === 'ai' ? (
                                    <div>
                                        {renderMessageContent(msg)}
                                    </div>
                                ) : (
                                    <p className="text-sm">{msg.text}</p>
                                )}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-2 border border-white/10">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    )}
                    {/* Spacing element to ensure last message isn't hidden behind edge cases */}
                    <div className="h-2"></div>
                </div>

                {/* Input Bar - Pinned to bottom of panel */}
                <div className="absolute bottom-0 left-0 right-0 shrink-0 p-4 bg-slate-800/95 border-t border-white/10 backdrop-blur-md z-20">
                    {messages.length === 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-3 custom-scrollbar">
                            {SUGGESTED_PROMPTS.map((prompt, i) => (
                                <button key={i} onClick={() => handleSend(prompt)} className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-blue-900/20 border border-white/10 rounded-lg text-xs font-medium text-gray-300 transition-colors duration-75">
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about market trends..."
                            className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder-gray-400"
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isTyping}
                            className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none"
                        >
                            <Send className="w-5 h-5" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (view === 'market_heatmap') {
        return (
            <div className="h-full flex flex-col space-y-8 pb-10">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Global Sector Heatmap</h2>
                    <button onClick={handleRefresh} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/20">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Refreshing AI...' : 'Refresh Signal'}
                    </button>
                </div>
                <HeatmapComponent />
                <AnalystNotesComponent />
                <SourcesFooter />
            </div>
        );
    }

    if (view === 'market_niche') {
        return (
            <div className="flex flex-col space-y-12 pb-32 relative">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Emerging-Niche Topics</h2>
                    <button onClick={handleRefresh} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/20">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Scanning...' : 'Scan New Niches'}
                    </button>
                </div>
                <NicheComponent />
                <div className="mb-8">
                    <NicheInsightsCollection />
                </div>
                <div className="mt-8">
                    <SourcesFooter />
                </div>

                {/* Detail Modal */}
                {selectedNiche && <NicheDetailModal topic={selectedNiche} onClose={() => setSelectedNiche(null)} />}
            </div>
        );
    }

    if (view === 'market_radar') {
        return (
            <div className="flex flex-col space-y-6 pb-10">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Competitor Analysis</h2>
                    <button onClick={handleRadarRefresh} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/20">
                        <RefreshCw className={`w-4 h-4 ${radarLoading ? 'animate-spin' : ''}`} />
                        {radarLoading ? 'Analyzing...' : 'Refresh Analysis'}
                    </button>
                </div>

                {/* Radar View Container - grows with content so nothing is cropped */}
                <GlassCard className="w-full flex flex-col bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 relative mb-4" noPadding>
                    <div className="p-8">
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-[850px]">

                            {/* Left Column: Large Hero Radar Chart (Gartner Style Central Piece) */}
                            <div className="xl:col-span-8 flex flex-col min-h-[650px]">
                                <div className="flex-1 min-h-[600px] bg-white/40 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 relative p-4 flex items-center justify-center">
                                    <div className="absolute top-4 left-4 z-10">
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Market Capabilities</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Comparative axis analysis</p>
                                    </div>
                                    <GartnerRadarChart detailMode={true} />
                                </div>
                            </div>

                            {/* Right Column: Stacked Metrics & Takeaways */}
                            <div className="xl:col-span-4 flex flex-col gap-6 pr-1">

                                {/* 1. KPIs Stack */}
                                <div className="flex-none">
                                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Key Performance Indicators</h4>
                                    <StackedCompetitiveMetrics />
                                </div>

                                {/* 2. Strategic Takeaways */}
                                <div className="flex-none space-y-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Target className="w-4 h-4 text-blue-500" />
                                        <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Strategic Implications</h3>
                                    </div>
                                    {radarTakeaways.map((takeaway, idx) => (
                                        <div key={idx} className="p-4 bg-white/40 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition-colors duration-75">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded">{takeaway.category}</span>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{takeaway.title}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{takeaway.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Row: Deep Dive Intelligence Feed */}
                        <CompetitorNewsFeed />

                        <div className="mt-12">
                            <SourcesFooter />
                        </div>
                    </div>
                </GlassCard>
            </div>
        );
    }

    if (view === 'market_chat') {
        return (
            // Increased height from 75vh to 85vh to push input further down
            <div className="h-[85vh] min-h-[650px] flex flex-col space-y-6 pb-6 w-full max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Predictive Engine</h2>
                {/* GlassCard should take full remaining height and handle layout */}
                <GlassCard className="flex-1 flex flex-col h-full bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 overflow-hidden relative" noPadding>
                    <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 shrink-0">
                        <div className="flex items-center gap-2">
                            {/* Monochrome Icon - Glassy */}
                            <div className="p-1.5 bg-gray-200 dark:bg-white/10 rounded-lg text-gray-700 dark:text-white">
                                <BrainCircuit className="w-4 h-4" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Predictive Engine</h3>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ask about correlations, forecasts, or specific data points.</p>
                    </div>
                    <div className="flex-1 relative overflow-hidden flex flex-col">
                        {/* Chat Component takes full height now */}
                        <ChatComponent />
                    </div>
                </GlassCard>
            </div>
        )
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 pb-4 overflow-hidden">
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-gray-500 dark:text-gray-400" /> Sector Heatmap
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-white/5 px-2 py-1 rounded">Live Data</span>
                            <button onClick={handleRefresh} className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors duration-75">
                                <RefreshCw className={`w-3.5 h-3.5 text-gray-500 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>
                    <HeatmapComponent limit={6} />
                    <div className="mt-8">
                        <AnalystNotesComponent limit={4} />
                    </div>
                </section>
                <SourcesFooter />
            </div>
            <div className="w-full lg:w-[380px] flex flex-col h-full lg:h-full shrink-0">
                {/* Added flex-1 to ensure widget takes full height for chat component to anchor bottom */}
                <GlassCard className="flex-1 flex flex-col h-full overflow-hidden relative !bg-slate-800/95 border border-white/10 shadow-sm shadow-blue-900/20" noPadding>
                    <div className="p-4 border-b border-white/10 bg-white/5 shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-white/10 rounded-lg text-white">
                                <BrainCircuit className="w-4 h-4" />
                            </div>
                            <h3 className="font-semibold text-white">Predictive Engine</h3>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Ask about correlations, forecasts, or specific data points.</p>
                    </div>
                    <div className="flex-1 min-h-0 relative overflow-hidden flex flex-col">
                        <ChatComponent />
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default MarketIntelligence;