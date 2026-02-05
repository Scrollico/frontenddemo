import React, { useState, useEffect, useRef } from 'react';
import {
    Linkedin, MessageSquare, Copy, Check, Sparkles, FileText,
    Loader2, ArrowRight, Presentation, PieChart,
    BarChart as BarChartIcon, Share2, ThumbsUp, MessageCircle,
    Send, Repeat, Printer, Download, User, Mic, MonitorPlay,
    TrendingUp, Quote, FileDown, Image as ImageIcon, Mail,
    Zap
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { generateExecutiveContent, generatePresentationSlides, generateInfographicData, getGlobalContext } from '../../services/geminiService';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { jsPDF } from 'jspdf';
import PptxGenJS from 'pptxgenjs';
import html2canvas from 'html2canvas';

interface ContentStudioProps {
    view: string;
    onNavigate?: (view: string) => void;
}

// --- CONFIG PANEL COMPONENT ---
interface ConfigPanelProps {
    title: string;
    icon: any;
    placeholder: string;
    topic: string;
    setTopic: (val: string) => void;
    tone: string;
    setTone: (val: string) => void;
    view: string;
    isGenerating: boolean;
    handleGenerate: () => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({
    title, icon: Icon, placeholder, topic, setTopic, tone, setTone, view, isGenerating, handleGenerate
}) => (
    <div className="h-full flex flex-col">
        <div className="mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h1>
                <p className="text-xs text-gray-500">AI Configuration</p>
            </div>
        </div>

        <div className="space-y-6 flex-1 overflow-y-auto">
            <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Topic / Prompt</label>
                <textarea
                    className="w-full h-40 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none transition-all"
                    placeholder={placeholder}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                />
            </div>

            {view !== 'content_infographics' && (
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Executive Tone</label>
                    <div className="grid grid-cols-2 gap-2">
                        {['Visionary', 'Pragmatic', 'Contrarian', 'Empathetic'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTone(t)}
                                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${tone === t ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-black' : 'bg-transparent text-gray-500 border-gray-200 dark:border-white/10 hover:border-gray-400'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="pt-6 mt-auto border-t border-gray-100 dark:border-white/5">
            <button
                onClick={handleGenerate}
                disabled={!topic || isGenerating}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-white transition-all active:scale-[0.98] relative overflow-hidden group
                    bg-blue-600/80 hover:bg-blue-500/90 backdrop-blur-xl border border-white/20 shadow-xl shadow-blue-500/30
                    ${isGenerating ? 'opacity-70 cursor-wait' : ''}`}
            >
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
                {isGenerating ? 'Synthesizing...' : 'Generate Asset'}
            </button>
        </div>
    </div>
);

// --- LAZY IMAGE FOR SLIDES ---
const SlideImage = ({ keyword }: { keyword: string }) => {
    // Use Pollinations.ai for AI-generated images based on the visual note
    // We encode the keyword to ensure it's URL safe
    const prompt = encodeURIComponent(`${keyword} abstract business background, high quality, 4k, cinematic lighting`);
    const src = `https://image.pollinations.ai/prompt/${prompt}?width=1600&height=900&nologo=true`;

    return (
        <img
            src={src}
            alt="Slide Background"
            crossOrigin="anonymous"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            onError={(e) => {
                // Fallback if generic fails
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80";
            }}
        />
    )
}

const ContentStudio: React.FC<ContentStudioProps> = ({ view, onNavigate }) => {
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState('Visionary');
    const [generatedContent, setGeneratedContent] = useState<any>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [copied, setCopied] = useState(false);
    const [slides, setSlides] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any>(null);

    // Ref for chart export
    const chartRef = useRef<HTMLDivElement>(null);

    const getContentType = (): 'linkedin' | 'talking-points' | 'presentation' | 'infographic' => {
        if (view === 'content_talking') return 'talking-points';
        if (view === 'content_presentation') return 'presentation';
        if (view === 'content_infographics') return 'infographic';
        return 'linkedin';
    };

    const handleGenerate = async () => {
        if (!topic) return;
        setIsGenerating(true);
        setGeneratedContent("");
        setSlides([]);
        setChartData(null);

        const type = getContentType();
        // Retrieve global context (Briefing + Market Data)
        const context = getGlobalContext();

        if (type === 'presentation') {
            const result = await generatePresentationSlides(topic, tone, context);
            setSlides(result);
            setGeneratedContent(JSON.stringify(result));
        } else if (type === 'infographic') {
            const result = await generateInfographicData(topic);
            setChartData(result);
            setGeneratedContent(JSON.stringify(result));
        } else {
            const result = await generateExecutiveContent(type, topic, tone, context);
            setGeneratedContent(result);
        }

        setIsGenerating(false);
    };

    const handleCopy = () => {
        const text = typeof generatedContent === 'string' ? generatedContent : JSON.stringify(generatedContent, null, 2);
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        setGeneratedContent('');
        setSlides([]);
        setChartData(null);
        setTopic('');
    }, [view]);

    // --- 1. MAIN MENU VIEW ---
    if (view === 'content') {
        return (
            <div className="max-w-6xl mx-auto space-y-8 pb-10 animate-fade-in">
                <div className="text-left border-b border-gray-200 dark:border-white/10 pb-6">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white font-display tracking-tight">Content Studio</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mt-2 max-w-2xl font-light">
                        Select a generator to create high-impact assets tailored to your executive voice.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {/* LinkedIn Card */}
                    <div onClick={() => onNavigate?.('content_linkedin')}>
                        <GlassCard className="group relative overflow-hidden min-h-[260px] cursor-pointer bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 hover:shadow-2xl" noPadding>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                            <div className="relative z-10 p-8 h-full flex flex-col items-start">
                                <div className="w-14 h-14 bg-white/50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/40 dark:border-white/10 text-slate-700 dark:text-white shadow-sm backdrop-blur-md">
                                    <Linkedin className="w-7 h-7 opacity-80" strokeWidth={1.25} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">LinkedIn Architect</h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm leading-relaxed max-w-sm">
                                    Craft viral, thought-leadership posts optimized for engagement.
                                </p>
                                <div className="mt-auto pt-6 flex items-center text-gray-900 dark:text-white font-semibold text-xs tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                                    Open Editor <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Talking Points Card */}
                    <div onClick={() => onNavigate?.('content_talking')}>
                        <GlassCard className="group relative overflow-hidden min-h-[260px] cursor-pointer bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 hover:shadow-2xl" noPadding>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                            <div className="relative z-10 p-8 h-full flex flex-col items-start">
                                <div className="w-14 h-14 bg-white/50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/40 dark:border-white/10 text-slate-700 dark:text-white shadow-sm backdrop-blur-md">
                                    <Mic className="w-7 h-7 opacity-80" strokeWidth={1.25} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Talking Points Memo</h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm leading-relaxed max-w-sm">
                                    Synthesize complex topics into concise, printable arguments.
                                </p>
                                <div className="mt-auto pt-6 flex items-center text-gray-900 dark:text-white font-semibold text-xs tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                                    Open Memo <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Presentation Card */}
                    <div onClick={() => onNavigate?.('content_presentation')}>
                        <GlassCard className="group relative overflow-hidden min-h-[260px] cursor-pointer bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 hover:shadow-2xl" noPadding>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                            <div className="relative z-10 p-8 h-full flex flex-col items-start">
                                <div className="w-14 h-14 bg-white/50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/40 dark:border-white/10 text-slate-700 dark:text-white shadow-sm backdrop-blur-md">
                                    <Presentation className="w-7 h-7 opacity-80" strokeWidth={1.25} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Presentation Deck</h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm leading-relaxed max-w-sm">
                                    Generate "Apple Keynote" style slide structures and narratives.
                                </p>
                                <div className="mt-auto pt-6 flex items-center text-gray-900 dark:text-white font-semibold text-xs tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                                    Create Deck <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Infographics Card */}
                    <div onClick={() => onNavigate?.('content_infographics')}>
                        <GlassCard className="group relative overflow-hidden min-h-[260px] cursor-pointer bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 hover:shadow-2xl" noPadding>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                            <div className="relative z-10 p-8 h-full flex flex-col items-start">
                                <div className="w-14 h-14 bg-white/50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/40 dark:border-white/10 text-slate-700 dark:text-white shadow-sm backdrop-blur-md">
                                    <PieChart className="w-7 h-7 opacity-80" strokeWidth={1.25} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Data Infographics</h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm leading-relaxed max-w-sm">
                                    Turn raw concepts into Financial Times style charts.
                                </p>
                                <div className="mt-auto pt-6 flex items-center text-gray-900 dark:text-white font-semibold text-xs tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                                    Generate Chart <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        );
    }

    // --- SPECIFIC PREVIEW LAYOUTS ---

    // 1. LinkedIn (Updated to Glassy Style)
    const LinkedInPreview = () => {
        const shareToLinkedIn = () => {
            if (!generatedContent) return;
            const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(generatedContent)}`;
            window.open(url, '_blank');
        };

        return (
            <div className="h-full overflow-y-auto custom-scrollbar p-6 pb-32">
                {/* Glassy Box instead of solid white/black */}
                <div className="mx-auto w-full max-w-[480px] bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-xl shadow-xl flex flex-col relative overflow-hidden min-h-[500px]">
                    <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-white/40 dark:bg-white/5 backdrop-blur-md shrink-0">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Post Preview</span>
                        <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                    </div>

                    <div className="flex-1 p-6 text-sm text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed font-sans overflow-y-auto">
                        {generatedContent || <span className="text-gray-400 italic">Your post will appear here...</span>}
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 p-6 bg-gradient-to-t from-white/90 via-white/80 to-transparent dark:from-[#1C1C1E]/90 dark:via-[#1C1C1E]/80 dark:to-transparent">
                        <button
                            onClick={shareToLinkedIn}
                            disabled={!generatedContent}
                            className="w-full py-4 backdrop-blur-xl bg-[#0A66C2]/90 hover:bg-[#0A66C2] border border-white/20 text-white rounded-2xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95"
                        >
                            <Share2 className="w-4 h-4" /> Post to LinkedIn
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Talking Points (Updated to Glassy Style)
    const MemoPreview = () => {
        const sendEmail = () => {
            if (!generatedContent) return;
            const subject = "Strategic Memo: " + (topic ? topic.substring(0, 30) + "..." : "Executive Update");
            const body = generatedContent;
            window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
        };

        return (
            <div className="h-full overflow-y-auto custom-scrollbar p-10 pb-32 relative">
                {/* Glass Slate - No solid backgrounds */}
                <div className="mx-auto w-full max-w-[800px] bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl shadow-2xl p-12 relative border border-white/20 dark:border-white/10 rounded-2xl overflow-hidden min-h-full">

                    {/* Header */}
                    <div className="mb-10 border-b border-gray-200 dark:border-white/10 pb-8">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-widest uppercase font-sans mb-1">Executive Memorandum</h2>
                        <div className="h-1 w-24 bg-gray-900 dark:bg-white mt-4"></div>
                    </div>

                    <div className="grid grid-cols-[100px_1fr] gap-y-4 text-sm font-sans mb-12">
                        <span className="font-bold text-gray-400 uppercase tracking-wider text-xs pt-1">To:</span>
                        <span className="font-medium text-gray-900 dark:text-white">Executive Strategy Committee</span>

                        <span className="font-bold text-gray-400 uppercase tracking-wider text-xs pt-1">From:</span>
                        <span className="font-medium text-gray-900 dark:text-white">Office of the CSO</span>

                        <span className="font-bold text-gray-400 uppercase tracking-wider text-xs pt-1">Date:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>

                        <span className="font-bold text-gray-400 uppercase tracking-wider text-xs pt-1">Subject:</span>
                        <span className="font-bold text-gray-900 dark:text-white">{topic || "Strategic Update"}</span>
                    </div>

                    {/* Body */}
                    <div className="prose prose-slate dark:prose-invert max-w-none font-serif leading-loose text-base text-justify">
                        {generatedContent ? (
                            <div className="whitespace-pre-wrap">{generatedContent}</div>
                        ) : (
                            <div className="text-gray-300 dark:text-gray-500 italic text-center mt-20 font-sans">
                                <Mic className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                [ Awaiting Analysis Generation ]
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-16 pt-6 border-t border-gray-200 dark:border-white/10 flex justify-between items-center text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                        <span>Confidential • Internal Distribution Only</span>
                        <span>Alara Intelligence v1.1</span>
                    </div>
                </div>

                <div className="absolute bottom-8 right-8 z-20">
                    <button
                        onClick={sendEmail}
                        disabled={!generatedContent}
                        className="p-4 backdrop-blur-xl bg-blue-600/90 hover:bg-blue-600 border border-white/20 text-white rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none group"
                        title="Send via Email"
                    >
                        <Mail className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        );
    }

    // 3. Presentation (Updated with robust export)
    const SlidePreview = () => {
        // Ref to capture the slide container for PDF generation
        const slidesContainerRef = useRef<HTMLDivElement>(null);

        const exportPDF = async () => {
            if (!slidesContainerRef.current) return;

            try {
                setIsExporting(true);
                const doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1280, 720] }); // 720p aspect ratio

                const slideElements = slidesContainerRef.current.querySelectorAll('.slide-node');

                if (slideElements.length === 0) {
                    console.warn("No slides to export");
                    return;
                }

                for (let i = 0; i < slideElements.length; i++) {
                    if (i > 0) doc.addPage();

                    const canvas = await html2canvas(slideElements[i] as HTMLElement, {
                        scale: 2, // Higher resolution
                        useCORS: true, // Allow cross-origin images
                        backgroundColor: '#000000',
                        logging: false // Disable html2canvas logging
                    });

                    const imgData = canvas.toDataURL('image/jpeg', 0.9);
                    doc.addImage(imgData, 'JPEG', 0, 0, 1280, 720);
                }

                doc.save(`Presentation_${new Date().toISOString().split('T')[0]}.pdf`);
            } catch (error) {
                console.error("PDF Export Failed:", error);
                alert("Failed to generate PDF. Please try again.");
            } finally {
                setIsExporting(false);
            }
        };

        const exportPPTX = async () => {
            setIsExporting(true);
            try {
                const pptx = new PptxGenJS();

                // Define master layout if needed, or just add slides loop

                for (const slide of slides) {
                    const slideObj = pptx.addSlide();

                    // Add Background Image
                    // Note: PptxGenJS can take a URL. Pollinations URLs might be slow, so we trust it handles it.
                    // If not, we might need to pre-fetch. For now, try direct URL.
                    const bgPrompt = encodeURIComponent(`${slide.visualNote || 'business'} abstract business background, high quality, 4k`);
                    const bgUrl = `https://image.pollinations.ai/prompt/${bgPrompt}?width=1600&height=900&nologo=true`;

                    slideObj.background = { path: bgUrl };

                    // Dark Overlay built-in? No, but we can add a semi-transparent rectangle
                    slideObj.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: '000000', transparency: 40 } });

                    // Title
                    slideObj.addText(slide.title, {
                        x: 0.5, y: 1.5, w: 9, h: 1,
                        fontSize: 44, fontFace: 'Arial', bold: true, color: 'FFFFFF',
                        shadow: { type: 'outer', color: '000000', blur: 10, offset: 2, angle: 45 }
                    });

                    // Subtitle
                    slideObj.addText(slide.subtitle, {
                        x: 0.5, y: 2.6, w: 9, h: 0.5,
                        fontSize: 20, fontFace: 'Arial', color: 'DDDDDD', italic: true
                    });

                    // Bullets
                    if (slide.points && slide.points.length > 0) {
                        // We'll create a text box with bullets
                        const bulletItems = slide.points.map((p: string) => ({
                            text: p,
                            options: { fontSize: 18, color: 'EEEEEE', breakLine: true, bullet: true }
                        }));

                        // Add a "Glass card" background for text if needed, or just text
                        slideObj.addText(bulletItems, {
                            x: 1, y: 3.5, w: 8, h: 3.5,
                            align: 'left', valign: 'top',
                            // rect: { fill: { color: 'FFFFFF', transparency: 90 } } // Optional glass effect
                        });
                    }

                    // Footer
                    slideObj.addText(`AI Business Suite • ${new Date().toLocaleDateString()}`, {
                        x: 0.5, y: 7, w: 9, h: 0.3,
                        fontSize: 10, color: '888888', align: 'center'
                    });
                }

                await pptx.writeFile({ fileName: `Keynote_Deck_${new Date().toISOString().split('T')[0]}.pptx` });
            } catch (e) {
                console.error("PPTX Export failed", e);
            } finally {
                setIsExporting(false);
            }
        };

        return (
            // Changed to dark slate glass instead of pure black for better integration
            <div className="h-full flex flex-col bg-gray-900/95 dark:bg-[#1C1C1E]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden relative">
                <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-white/5 backdrop-blur-xl absolute top-0 w-full z-20">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={exportPDF} disabled={!slides.length || isExporting} className="flex items-center gap-1 px-4 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold text-white transition-colors duration-75 disabled:opacity-50">
                            {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileDown className="w-3 h-3" />} PDF
                        </button>
                        <button onClick={exportPPTX} disabled={!slides.length || isExporting} className="flex items-center gap-1 px-4 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold text-white transition-colors duration-75 disabled:opacity-50">
                            {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Presentation className="w-3 h-3" />} PPTX
                        </button>
                    </div>
                </div>

                <div ref={slidesContainerRef} className="flex-1 overflow-y-auto custom-scrollbar p-12 pt-24 bg-transparent">
                    {slides.length > 0 ? slides.map((slide, idx) => (
                        <div key={idx} className="slide-node mb-20 last:mb-0 max-w-5xl mx-auto shadow-2xl rounded-2xl overflow-hidden relative group border border-white/10">
                            {/* Aspect Ratio 16:9 */}
                            <div className="aspect-video bg-black relative">
                                {/* Background */}
                                <div className="absolute inset-0 z-0">
                                    <SlideImage keyword={slide.visualNote || 'business abstract'} />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
                                </div>

                                {/* Content */}
                                <div className="relative z-10 p-16 h-full flex flex-col justify-center font-sans">
                                    <h2 className="text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-lg leading-tight">{slide.title}</h2>
                                    <p className="text-xl text-gray-300 font-light mb-12 max-w-2xl border-l-2 border-blue-500 pl-4">{slide.subtitle}</p>

                                    {/* Bullets Card */}
                                    <div className="space-y-6 max-w-xl backdrop-blur-md bg-white/5 p-8 rounded-2xl border border-white/10">
                                        {slide.points?.map((p: string, i: number) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="w-1.5 h-1.5 bg-blue-400 mt-2.5 rounded-full shrink-0 shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
                                                <p className="text-gray-200 text-lg leading-relaxed font-light">{p}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer / Number */}
                                <div className="absolute bottom-6 right-8 text-[10px] text-gray-500 font-mono tracking-widest uppercase opacity-50">
                                    Slide {idx + 1}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <Presentation className="w-20 h-20 mb-6 opacity-20" />
                            <p className="text-lg font-light tracking-wide">Ready to design your keynote...</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // 4. Infographics (Updated to Glassy Style)
    const ChartPreview = () => {
        const isDark = document.documentElement.classList.contains('dark');

        const exportJPEG = () => {
            if (!chartRef.current) return;
            const svg = chartRef.current.querySelector('svg');
            if (!svg) return;
            const serializer = new XMLSerializer();
            const svgStr = serializer.serializeToString(svg);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const svgRect = svg.getBoundingClientRect();
            canvas.width = svgRect.width * 2;
            canvas.height = svgRect.height * 2;
            const img = new Image();
            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)));
            img.onload = () => {
                if (ctx) {
                    ctx.fillStyle = '#1e1e1e';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const link = document.createElement('a');
                    link.download = `Chart_${new Date().getTime()}.jpg`;
                    link.href = canvas.toDataURL('image/jpeg', 0.9);
                    link.click();
                }
            };
        };

        return (
            <div className="h-full flex flex-col p-8 items-center justify-center relative pb-32 overflow-y-auto custom-scrollbar">
                {chartData ? (
                    <div ref={chartRef} className="w-full max-w-4xl bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl p-10 relative rounded-3xl font-sans">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-100 dark:border-white/5">
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{chartData.title}</h2>
                                <p className="text-base text-gray-500 dark:text-gray-400 mt-2 font-light">{chartData.summary}</p>
                            </div>
                            <button onClick={exportJPEG} className="ml-4 flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-xl text-xs font-bold text-gray-900 dark:text-white transition-colors duration-75">
                                <ImageIcon className="w-4 h-4" /> Export JPEG
                            </button>
                        </div>

                        <div className="aspect-[16/9] w-full p-4 relative min-h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                {chartData.type === 'line' || chartData.type === 'area' ? (
                                    <AreaChart data={chartData.data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#333' : '#eee'} />
                                        <XAxis dataKey="name" tick={{ fill: isDark ? '#9CA3AF' : '#4B5563', fontSize: 13, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} interval={0} height={60} />
                                        <YAxis tick={{ fill: isDark ? '#9CA3AF' : '#4B5563', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10} />
                                        <Tooltip contentStyle={{ backgroundColor: isDark ? '#1F2937' : '#fff', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', color: isDark ? '#fff' : '#000' }} />
                                        <Area type="monotone" dataKey="value" stroke="#3B82F6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                                    </AreaChart>
                                ) : (
                                    <BarChart data={chartData.data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#333' : '#eee'} />
                                        <XAxis dataKey="name" tick={{ fill: isDark ? '#9CA3AF' : '#4B5563', fontSize: 13, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} interval={0} height={60} />
                                        <YAxis tick={{ fill: isDark ? '#9CA3AF' : '#4B5563', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10} />
                                        <Tooltip contentStyle={{ backgroundColor: isDark ? '#1F2937' : '#fff', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', color: isDark ? '#fff' : '#000' }} cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
                                        <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                )}
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-6 flex justify-between items-end pt-4 border-t border-gray-100 dark:border-white/5">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Generated by AI Business Suite</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-400">
                        <PieChart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-light">Configure data parameters to visualize.</p>
                    </div>
                )}
            </div>
        )
    }

    // --- RENDER ROUTER ---
    return (
        <div className="h-full flex flex-col lg:flex-row gap-6 max-w-full mx-auto pb-0 overflow-hidden">
            {/* Left: Configuration Box */}
            <GlassCard className="w-full lg:w-[400px] bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 relative z-10 shrink-0 h-full">
                {view === 'content_linkedin' &&
                    <ConfigPanel
                        title="LinkedIn Architect"
                        icon={Linkedin}
                        placeholder="e.g., The impact of AI on supply chain logistics..."
                        topic={topic} setTopic={setTopic}
                        tone={tone} setTone={setTone}
                        view={view}
                        isGenerating={isGenerating}
                        handleGenerate={handleGenerate}
                    />
                }
                {view === 'content_talking' &&
                    <ConfigPanel
                        title="Talking Points"
                        icon={Mic}
                        placeholder="e.g., Argument for increasing Q3 R&D budget..."
                        topic={topic} setTopic={setTopic}
                        tone={tone} setTone={setTone}
                        view={view}
                        isGenerating={isGenerating}
                        handleGenerate={handleGenerate}
                    />
                }
                {view === 'content_presentation' &&
                    <ConfigPanel
                        title="Presentation Deck"
                        icon={Presentation}
                        placeholder="e.g., Q3 Strategy Overview..."
                        topic={topic} setTopic={setTopic}
                        tone={tone} setTone={setTone}
                        view={view}
                        isGenerating={isGenerating}
                        handleGenerate={handleGenerate}
                    />
                }
                {view === 'content_infographics' &&
                    <ConfigPanel
                        title="Infographics"
                        icon={PieChart}
                        placeholder="e.g., Global EV Market Share 2024..."
                        topic={topic} setTopic={setTopic}
                        tone={tone} setTone={setTone}
                        view={view}
                        isGenerating={isGenerating}
                        handleGenerate={handleGenerate}
                    />
                }
            </GlassCard>

            {/* Right: Preview Area Box */}
            <GlassCard className="flex-1 bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 relative overflow-hidden flex flex-col h-full" noPadding>
                <div className="h-14 border-b border-gray-200 dark:border-white/10 flex items-center justify-center px-6 bg-white/50 dark:bg-white/5 backdrop-blur-sm relative shrink-0">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest absolute left-6">
                        {view === 'content_presentation' ? 'KEYNOTE PREVIEW' : view === 'content_infographics' ? 'DATA VIZ' : 'LIVE PREVIEW'}
                    </span>
                    <div className="absolute right-6 flex gap-2">
                        <button
                            onClick={handleCopy}
                            disabled={!generatedContent}
                            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors duration-75"
                            title="Copy"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    {(isGenerating || isExporting) && (
                        <div className="absolute inset-0 z-50 bg-white/80 dark:bg-[#1c1c1e]/90 backdrop-blur-sm flex flex-col items-center justify-center">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 animate-pulse">
                                {isExporting ? 'Generating Document...' : 'Consulting Neural Models...'}
                            </p>
                        </div>
                    )}

                    {view === 'content_linkedin' && <LinkedInPreview />}
                    {view === 'content_talking' && <MemoPreview />}
                    {view === 'content_presentation' && <SlidePreview />}
                    {view === 'content_infographics' && <ChartPreview />}
                </div>
            </GlassCard>
        </div>
    );
};

export default ContentStudio;