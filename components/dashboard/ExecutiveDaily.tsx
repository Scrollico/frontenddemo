import React, { useEffect, useState, useRef, useMemo } from 'react';
import { RefreshCw, AudioLines, Download, Play, Pause, SkipForward, SkipBack, Share2, Mail, ScrollText, CheckCircle, ExternalLink, StopCircle, Volume2, Globe, Clock, Settings2, CloudSun, Wind, Droplets, Quote, ListMusic, BarChart3, Loader2, Video as VideoIcon, Upload, Zap, Lightbulb, BookOpen, TrendingUp, Target, Activity, AlignLeft, AlignJustify } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { SpiralAnimation } from '../ui/SpiralAnimation';
import { generateDailyBriefing, generateSpeech, generateVeoVideo, generatePodcastAudio } from '../../services/geminiService';
import { MarketPriority } from '../../types';
import { jsPDF } from 'jspdf';
import { QUOTES } from '../../data/mockData';

interface ExecutiveDailyProps {
  view: string; // 'daily', 'daily_briefing', 'daily_export', 'daily_podcast'
  marketPriority: MarketPriority;
}

// --- Lazy Image Component for Performance ---
const LazyImage: React.FC<{ src: string; alt: string; className?: string; priority?: boolean; fallbackText?: string }> = ({
  src,
  alt,
  className = "",
  priority = false,
  fallbackText
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setHasError(true);
  }, [src]);

  const initials = fallbackText ?? alt.split(/\s+/).map(n => n[0]).join('').slice(0, 2).toUpperCase();

  if (hasError && initials) {
    return (
      <div className={`flex items-center justify-center w-full h-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/10 text-slate-500 dark:text-slate-400 font-semibold text-sm tracking-wide uppercase ${className}`}>
        {initials}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-gray-200 dark:bg-white/5 ${className}`}>
      {/* Skeleton Pulse */}
      <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
      />
    </div>
  );
};



// WMO weather code → short label (Open-Meteo)
const WEATHER_LABELS: Record<number, string> = {
  0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Fog', 51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
  61: 'Rain', 63: 'Rain', 65: 'Rain', 71: 'Snow', 73: 'Snow', 75: 'Snow',
  80: 'Showers', 81: 'Showers', 82: 'Showers', 95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm',
};

const WeatherWidget = () => {
  const [weather, setWeather] = useState<{ temp: number; code: number; high: number; low: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=41.01&longitude=28.95&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Europe/Istanbul';
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const cur = data?.current;
        const daily = data?.daily;
        if (cur != null && daily?.temperature_2m_max?.[0] != null && daily?.temperature_2m_min?.[0] != null) {
          setWeather({
            temp: Math.round(cur.temperature_2m),
            code: cur.weather_code,
            high: Math.round(daily.temperature_2m_max[0]),
            low: Math.round(daily.temperature_2m_min[0]),
          });
        }
      })
      .catch(() => { });
    return () => { cancelled = true; };
  }, []);

  const temp = weather?.temp ?? '—';
  const label = weather ? (WEATHER_LABELS[weather.code] ?? 'Clear') : '—';
  const high = weather?.high ?? '—';
  const low = weather?.low ?? '—';

  return (
    <GlassCard className="flex flex-col justify-center p-4 h-full relative overflow-hidden bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 dark:border-white/10" noPadding>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      <div className="flex items-center justify-between w-full h-full p-6 relative z-10">
        <div className="flex flex-col justify-center gap-1">
          <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Istanbul, Turkey</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white leading-none">{temp}°</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
          <CloudSun className="w-10 h-10 text-orange-400 drop-shadow-md" strokeWidth={1.25} />
          <span className="text-[10px] text-gray-400 font-medium mt-2">H:{high}° L:{low}°</span>
        </div>
      </div>
    </GlassCard>
  );
};

const DailyQuoteWidget = () => {
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

  return (
    <GlassCard className="relative overflow-hidden p-0 flex items-center h-full bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 dark:border-white/10" noPadding>
      {/* Ambient Glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

      <div className="flex items-center gap-6 p-6 w-full relative z-10">
        {/* Simple Image Treatment - No quote icon */}
        <div className="w-16 h-16 rounded-full overflow-hidden border border-white/50 dark:border-white/10 shadow-lg shrink-0">
          <LazyImage src={quote.image} alt={quote.author} className="w-full h-full object-cover" />
        </div>

        <div className="min-w-0 flex flex-col justify-center flex-1">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed italic mb-3">"{quote.text}"</p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">{quote.author}</span>
            <span className="w-0.5 h-2.5 bg-gray-300 dark:bg-gray-600 hidden sm:block"></span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate hidden sm:block">{quote.role}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

interface PlaylistTrack { id: string; title: string; text: string; duration?: number; }

// --- Sub-components moved outside to prevent remounting ---

const PodcastView: React.FC<{
  playlist: PlaylistTrack[];
  currentAudioId: string | null;
  isPlaying: boolean;
  isAudioLoading: boolean;
  duration: number;
  currentTime: number;
  date: Date;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: ((prev: number) => number) | number) => void;
  handleSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  togglePlayback: () => void;
  playPlaylistTrack: (index: number) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  formatTime: (time: number) => string;
}> = ({
  playlist, currentAudioId, isPlaying, isAudioLoading, duration, currentTime,
  date, playbackSpeed, setPlaybackSpeed, handleSeek, togglePlayback,
  playPlaylistTrack, audioRef, formatTime
}) => (
    <div className="flex flex-col md:flex-row h-full gap-6 md:gap-12 px-4 md:px-6 py-4 max-w-6xl mx-auto w-full items-center justify-center">
      {/* Left Side - Visualizer & Track Info */}
      <div className="flex-none flex flex-col items-center justify-center w-full md:w-auto">
        <div className="relative w-64 h-64 mb-6 group shrink-0">
          {/* Visual Highlight Glows */}
          <div className={`absolute inset-0 bg-blue-500/10 rounded-full transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}></div>
          <div className={`absolute inset-8 bg-indigo-500/10 rounded-full transition-opacity duration-1000 delay-150 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}></div>

          {/* Main Container - Stable background, no re-render flicker */}
          <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-white dark:from-[#151516] dark:to-black rounded-full border border-gray-100 dark:border-white/10 flex items-center justify-center shadow-2xl z-10 overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
            {/* New Spiral Visualizer */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-60 scale-95'}`}>
              <SpiralAnimation
                isPlaying={isPlaying}
                size={240}
                totalDots={400}
                dotColor={isPlaying ? "#3b82f6" : "#9ca3af"}
                backgroundColor="transparent"
                duration={3}
              />
            </div>
          </div>
        </div>

        {/* Text Info */}
        <div className="text-center space-y-2 max-w-sm px-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 min-h-[3.5rem] flex items-center justify-center">
            {playlist.find(t => t.id === currentAudioId)?.title || "Executive Daily Briefing"}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border transition-all duration-300 ${isPlaying ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30' : 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-white/10 dark:text-gray-400 dark:border-white/10'}`}>
              {currentAudioId ? "Now Playing" : "Ready"}
            </span>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
              {date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Controls & Playlist */}
      <div className="flex-1 w-full max-w-xl flex flex-col gap-6 h-full md:h-auto md:max-h-[600px]">
        {/* Controls Card - Compact */}
        <div className="flex-none bg-white/60 dark:bg-white/5 rounded-3xl p-5 border border-gray-200 dark:border-white/5 shadow-xl backdrop-blur-md">
          {/* Scrubber */}
          <div className="space-y-2 mb-6">
            <div className="relative group cursor-pointer">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                disabled={!currentAudioId || isAudioLoading}
                className="absolute inset-0 w-full h-2 opacity-0 z-20 cursor-pointer"
              />
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-100 ease-linear rounded-full relative"
                  style={{ width: `${(currentTime / (duration || 0.1)) * 100}%` }}
                >
                </div>
              </div>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between px-2">
            <button
              onClick={() => setPlaybackSpeed(prev => prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1)}
              className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-75 w-10 text-left"
            >
              {playbackSpeed}x
            </button>

            <div className="flex items-center gap-6">
              <button
                onClick={() => { if (audioRef.current) audioRef.current.currentTime -= 10; }}
                disabled={!currentAudioId}
                className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-75 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full"
              >
                <SkipBack className="w-6 h-6" fill="currentColor" />
              </button>
              <button
                onClick={togglePlayback}
                className="w-16 h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center transition-all shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isAudioLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 ml-1 fill-current" />}
              </button>
              <button
                onClick={() => { if (audioRef.current) audioRef.current.currentTime += 10; }}
                disabled={!currentAudioId}
                className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-75 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full"
              >
                <SkipForward className="w-6 h-6" fill="currentColor" />
              </button>
            </div>

            <div className="w-10 flex justify-end">
              {isAudioLoading && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
            </div>
          </div>
        </div>

        {/* Playlist - Scrollable area */}
        <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-hidden">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2 flex items-center gap-2 shrink-0">
            <ListMusic className="w-3 h-3" /> Playlist
          </h3>
          <div className="space-y-2 overflow-y-auto custom-scrollbar pr-2 pb-2">
            {playlist.map((track, idx) => (
              <div key={track.id} onClick={() => playPlaylistTrack(idx)} className={`group p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all border backdrop-blur-md ${currentAudioId === track.id ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20' : 'bg-white/30 dark:bg-slate-800/30 border-white/20 dark:border-white/5 hover:bg-white/50 dark:hover:bg-slate-700/40'}`}>
                <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-75 shrink-0 ${currentAudioId === track.id ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-white/10 text-gray-400 group-hover:text-blue-500'}`}>
                  {currentAudioId === track.id && isPlaying ? <Volume2 className="w-4 h-4 text-blue-500" /> : <Play className="w-3 h-3 ml-0.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${currentAudioId === track.id ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>{track.title}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{track.text.substring(0, 50)}...</p>
                </div>
                <div className="text-xs font-mono text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                  {Math.floor(Math.random() * 3) + 1}:{(Math.floor(Math.random() * 50) + 10).toString().padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

const ExportView: React.FC<{
  handleDownloadPDF: () => void;
  handleSendEmail: () => void;
  loading: boolean;
  content: string;
}> = ({ handleDownloadPDF, handleSendEmail, loading, content }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
    <GlassCard className="h-80 relative overflow-hidden group" noPadding>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-500/10 to-transparent rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      <div className="flex flex-col h-full p-8 relative z-20">
        <div className="w-12 h-12 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center mb-6 shrink-0"><ScrollText className="w-6 h-6 text-gray-900 dark:text-white" strokeWidth={1.25} /></div>
        <div className="flex-1 min-h-0">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">PDF Report</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">Download a formal, McKinsey-style one-pager of today's briefing.</p>
        </div>
        <div className="mt-auto pt-4">
          <button
            onClick={handleDownloadPDF}
            disabled={loading || !content}
            className="w-full py-3 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 rounded-lg text-white dark:text-black transition-all flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 shadow-lg"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download PDF
          </button>
        </div>
      </div>
    </GlassCard>

    <GlassCard className="h-80 relative overflow-hidden group" noPadding>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-500/10 to-transparent rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      <div className="flex flex-col h-full p-8 relative z-20">
        <div className="w-12 h-12 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center mb-6 shrink-0"><Mail className="w-6 h-6 text-gray-900 dark:text-white" strokeWidth={1.25} /></div>
        <div className="flex-1 min-h-0">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Email Brief</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">Send this briefing to your executive team.</p>
        </div>
        <div className="mt-auto pt-4">
          <button
            onClick={handleSendEmail}
            disabled={loading || !content}
            className="w-full py-3 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 rounded-lg text-white dark:text-black transition-all flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 shadow-lg"
          >
            <Share2 className="w-4 h-4" /> Send Email
          </button>
        </div>
      </div>
    </GlassCard>
  </div>
);

const SourcesSection: React.FC<{ groundingMetadata: any; summaryMode: string }> = ({ groundingMetadata, summaryMode }) => {
  if (!groundingMetadata?.groundingChunks?.length || summaryMode === 'short') return null;
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Verified Sources</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {groundingMetadata.groundingChunks.map((chunk: any, i: number) => (
          chunk.web?.uri && (
            <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400 hover:underline bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 px-3 py-2 rounded transition-colors duration-75 border border-transparent">
              <Globe className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{chunk.web.title || chunk.web.uri}</span>
            </a>
          )
        ))}
      </div>
    </div>
  )
}


const ExecutiveDaily: React.FC<ExecutiveDailyProps> = ({ view, marketPriority }) => {
  const [content, setContent] = useState<string>("");
  const [groundingMetadata, setGroundingMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [date] = useState(new Date());

  // View Mode: Shortform vs Longform
  const [summaryMode, setSummaryMode] = useState<'short' | 'long'>('short');

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState<PlaylistTrack[]>([]);

  // Using ref for audio element to persist across renders but manageable in effects
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeRequestIdRef = useRef<string | null>(null);

  // Cache to store audio URLs for tracks to prevent re-generation lag
  const audioCache = useRef<Map<string, string>>(new Map());

  // Video Generation State (Veo)
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getSectorsFromPriority = (priority: MarketPriority): string[] => {
    switch (priority) {
      case 'Energy': return ["Oil & Gas", "Renewables", "Green Hydrogen", "Utilities"];
      case 'Finance': return ["Banking", "Fintech", "Private Equity", "Crypto"];
      case 'Innovation': return ["Startups", "Venture Capital", "Biotech", "Deep Tech"];
      case 'Business': return ["M&A", "Corporate Strategy", "Retail", "Supply Chain"];
      case 'Tech': return ["SaaS", "AI", "Semiconductors", "Cybersecurity"];
      default: return ["Tech", "Finance", "Energy", "AI"]; // General
    }
  };

  const fetchData = async (forceRefresh = false) => {
    if (content && !forceRefresh) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const sectors = getSectorsFromPriority(marketPriority);
    const region = "Global";
    const result = await generateDailyBriefing(sectors, region, forceRefresh);
    if (result) {
      setContent(result.content);
      setGroundingMetadata(result.groundingMetadata);
    }
    setLoading(false);
  };

  useEffect(() => {
    if ((view === 'daily' || view === 'daily_briefing' || view === 'daily_podcast' || view === 'daily_export')) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [view, marketPriority]);

  useEffect(() => {
    if (content) {
      const newPlaylist: PlaylistTrack[] = [];
      let trackCount = 0;
      const summaryText = getSummaryText();

      // Podcast Mode: Only add Summary as the main track initially
      if (summaryText) {
        newPlaylist.push({ id: `playlist-summary`, title: "Alara & Arda: Daily Briefing", text: summaryText });
      }

      if (view !== 'daily_podcast') {
        // Add individual items only for non-podcast view playlist (optional)
        const lines = content.split('\n');
        let currentSection = '';
        lines.forEach(line => {
          if (line.startsWith('### ')) currentSection = line;
          if (currentSection.includes('Top 3 Developments') && line.match(/^\*\*\d+\./)) {
            const title = line.replace(/^\*\*\d+\.\s*/, '').replace(/\*\*/g, '');
            const text = getDevelopmentText(title);
            newPlaylist.push({ id: `playlist-${trackCount++}`, title: title, text: text });
          }
        });
      }
      setPlaylist(newPlaylist);
    }
  }, [content, view]);

  useEffect(() => {
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsAudioLoading(false);
    setCurrentTime(0);
  };

  const togglePlayback = () => {
    if (audioRef.current && currentAudioId) {
      if (!audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else if (!currentAudioId && playlist.length > 0) {
      playPlaylistTrack(0);
    }
  };

  const playText = async (id: string, text: string, autoAdvanceIndex: number = -1, isPodcast: boolean = false) => {
    activeRequestIdRef.current = id;
    if (currentAudioId === id) {
      togglePlayback();
      return;
    }

    stopAudio();
    setCurrentAudioId(id);
    setIsAudioLoading(true);
    setDuration(0);

    try {
      let audioUrl = audioCache.current.get(id);

      if (!audioUrl) {
        let base64Audio;

        if (isPodcast) {
          // Specialized Podcast Generation (Dialogue + MultiSpeaker)
          // Note: We ignore the passed 'text' if it's too long, focusing on generating a script from summary.
          const result = await generatePodcastAudio(text); // Pass the summary text
          base64Audio = result.audio;
        } else {
          // Standard Single Speaker
          base64Audio = await generateSpeech(text);
        }

        if (activeRequestIdRef.current !== id) return;

        if (!base64Audio) {
          setCurrentAudioId(null);
          setIsAudioLoading(false);
          return;
        }

        const binaryString = window.atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);

        const wavBytes = createWavHeader(bytes);
        const wavBlob = new Blob([wavBytes], { type: 'audio/wav' });
        audioUrl = URL.createObjectURL(wavBlob);
        audioCache.current.set(id, audioUrl);
      }

      if (activeRequestIdRef.current !== id) return;

      const audio = new Audio(audioUrl);
      audio.playbackRate = playbackSpeed;

      audio.onloadedmetadata = () => {
        if (activeRequestIdRef.current === id) setDuration(audio.duration);
      };

      audio.ontimeupdate = () => {
        if (activeRequestIdRef.current === id) setCurrentTime(audio.currentTime);
      };

      // Crucial for pause button syncing
      audio.onplay = () => { if (activeRequestIdRef.current === id) setIsPlaying(true); };
      audio.onpause = () => { if (activeRequestIdRef.current === id) setIsPlaying(false); };

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        setCurrentAudioId(null);
        if (autoAdvanceIndex !== -1 && autoAdvanceIndex < playlist.length - 1) {
          const nextTrack = playlist[autoAdvanceIndex + 1];
          playText(nextTrack.id, nextTrack.text, autoAdvanceIndex + 1);
        }
      };

      audioRef.current = audio;
      await audio.play();
      setIsAudioLoading(false);
    } catch (error) {
      console.error("Audio Playback Error", error);
      if (activeRequestIdRef.current === id) {
        setCurrentAudioId(null);
        setIsAudioLoading(false);
      }
    }
  };

  const playPlaylistTrack = (index: number) => {
    const track = playlist[index];
    // If we are in podcast view, assume we want the podcast generation logic for the main summary track
    const isPodcast = view === 'daily_podcast' && index === 0;
    if (track) playText(track.id, track.text, index, isPodcast);
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) { audioRef.current.currentTime = time; setCurrentTime(time); }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsGeneratingVideo(true);
      const file = e.target.files[0];
      const video = await generateVeoVideo(file);
      if (video) {
        setVideoUrl(video);
      }
      setIsGeneratingVideo(false);
    }
  };

  // --- UPDATED EMAIL SENDING LOGIC (Newsletter Style) ---
  const handleSendEmail = () => {
    if (!content) return;

    const summary = getSummaryText();
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    // Constructing a "Rich Text" email using unicode and formatting
    const subject = `Executive Briefing: ${dateStr}`;

    // Convert main content to clean text
    let bodyContent = content.replace(/\*\*/g, '').replace(/### /g, '\n').replace(/## /g, '\n').replace(/\* /g, '• ');

    const body = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A I   B U S I N E S S   S U I T E
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DATE:   ${dateStr}
FOCUS:  ${marketPriority.toUpperCase()}
STATUS: HIGH PRIORITY

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXECUTIVE SUMMARY
─────────────────
${summary}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FULL INTELLIGENCE REPORT
────────────────────────
${bodyContent}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFIDENTIAL • FOR EXECUTIVE EYES ONLY
Generated by AI Business Suite
`;

    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const createWavHeader = (pcmData: Uint8Array) => {
    const numChannels = 1; const sampleRate = 24000; const bitsPerSample = 16;
    const blockAlign = numChannels * bitsPerSample / 8; const byteRate = sampleRate * blockAlign; const dataSize = pcmData.length;
    const buffer = new ArrayBuffer(44 + dataSize); const view = new DataView(buffer);
    writeString(view, 0, 'RIFF'); view.setUint32(4, 36 + dataSize, true); writeString(view, 8, 'WAVE'); writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, numChannels, true); view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true); view.setUint16(32, blockAlign, true); view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, 'data'); view.setUint32(40, dataSize, true);
    new Uint8Array(buffer, 44).set(pcmData);
    return buffer;
  }

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
  }

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60); const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const getDevelopmentText = (title: string) => {
    if (!content) return title;
    const lines = content.split('\n');
    const titleIndex = lines.findIndex(line => line.includes(title));
    if (titleIndex === -1) return title;
    let extracted = title + ". ";
    for (let i = titleIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('#') || (line.startsWith('**') && line.match(/^\*\*\d+\./))) break;
      if (line) extracted += line.replace(/\*\*/g, '') + " ";
    }
    return extracted;
  };

  const getSummaryText = () => {
    if (!content) return "";
    const lines = content.split('\n');
    const summaryIndex = lines.findIndex(l => l.includes('Executive Summary'));
    if (summaryIndex === -1) return "";
    let text = "";
    for (let i = summaryIndex + 1; i < lines.length; i++) {
      if (lines[i].startsWith('###')) break;
      text += lines[i] + " ";
    }
    return text.trim();
  }

  // Refined Render Content to support sections and icons
  const renderContent = (text: string) => {
    // Robust splitting that handles potential variations in spacing or formatting
    const sectionsRaw = text.split(/\n?(?=###\s+\d*\.?\s*)/g).filter(s => s.trim() !== '');

    return sectionsRaw.map((section, secIdx) => {
      const lines = section.split('\n');
      const sectionElements: React.ReactNode[] = [];
      let currentSectionTitle = '';
      let isTakeaways = false;

      // Handle Title / Spot (First chunk usually doesn't have ###)
      if (!section.startsWith('###')) {
        // Show headline in both modes
        lines.forEach((line, idx) => {
          if (line.startsWith('## ')) {
            const headlineText = line.replace(/## .*? : /, '');
            sectionElements.push(
              <div key={`head-${secIdx}-${idx}`} className="mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight font-display">
                  {headlineText || line.replace('## ', '')}
                </h1>
              </div>
            );
          } else if (line.startsWith('**Spot:**')) {
            sectionElements.push(
              <p key={`spot-${secIdx}-${idx}`} className="text-lg text-gray-600 dark:text-gray-300 italic border-l-4 border-blue-500 pl-4 mb-8 leading-relaxed font-light">
                {line.replace('**Spot:**', '').replace(/\*\*/g, '').trim()}
              </p>
            );
          }
        });
        return <div key={`sec-top-${secIdx}`}>{sectionElements}</div>;
      }

      // Handle Regular Sections with Shortform Filter
      lines.forEach((line, idx) => {
        if (line.startsWith('### ')) {
          const title = line.replace('### ', '').replace(/^\d+\.\s*/, ''); // Remove numbering
          currentSectionTitle = title;
          isTakeaways = title.includes('Key Takeaways');

          // Filtering Logic for Shortform Mode
          const isSummary = title.toLowerCase().includes('summary');
          const isDevelopments = title.toLowerCase().includes('development');

          if (summaryMode === 'short' && !isSummary && !isDevelopments) {
            // Skip other sections in short mode
            currentSectionTitle = "SKIPPED";
            return;
          }

          let Icon = ScrollText;
          if (title.includes('Executive Summary')) Icon = Activity;
          if (title.includes('Developments')) Icon = Zap;
          if (title.includes('Market Narrative')) Icon = TrendingUp;
          if (title.includes('Key Takeaways')) Icon = Lightbulb;
          if (title.includes('Reading')) Icon = BookOpen;

          sectionElements.push(
            <div key={`header-${secIdx}-${idx}`} className="mt-8 mb-4">
              <div className="h-px w-full bg-gray-200 dark:bg-white/10 mb-6"></div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-blue-500/10 rounded-lg"><Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide">{title}</h2>
              </div>
            </div>
          );
        } else if (line.trim() !== '') {
          // Strip double asterisks (common AI "bolding") for a cleaner look
          const cleanLine = line.replace(/\*\*/g, '');

          // Apply filtering logic to content as well
          if (summaryMode === 'short') {
            if (currentSectionTitle === "SKIPPED") return;

            // Fallback check in case title logic was missed
            const isSummary = currentSectionTitle.toLowerCase().includes('summary');
            const isDevelopments = currentSectionTitle.toLowerCase().includes('development');
            if (!isSummary && !isDevelopments && currentSectionTitle !== "") return;
          }

          if (isTakeaways && line.trim().startsWith('* ')) {
            sectionElements.push(
              <div key={`takeaway-${secIdx}-${idx}`} className="flex items-start gap-3 p-3 mb-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
                <Target className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-1 shrink-0" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{cleanLine.replace('* ', '')}</span>
              </div>
            );
          } else if (currentSectionTitle.toLowerCase().includes('development') && cleanLine.trim().match(/^\d+\./)) {
            // Developments Audio Buttons - Handle both **1. and 1.
            const title = cleanLine.trim().replace(/^\d+\.\s*/, '');
            // Using regex to ensure unique ID across refreshes but stable enough
            const devId = `dev-${title.substring(0, 15).replace(/\s/g, '')}-${secIdx}`;
            const isActive = currentAudioId === devId;
            sectionElements.push(
              <div key={`dev-title-${secIdx}-${idx}`} className="group flex items-start gap-3 mt-5 mb-2">
                <button
                  onClick={() => playText(devId, getDevelopmentText(title))}
                  disabled={isAudioLoading && !isActive}
                  className={`flex-shrink-0 p-2 rounded-full transition-all mt-0.5 ${isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-blue-600 hover:text-white'}`}
                >
                  {isActive && isAudioLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : isActive && isPlaying ? <Volume2 className="w-3.5 h-3.5 text-blue-500" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                </button>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight pt-1">{title}</h3>
              </div>
            );
          } else if (line.trim().startsWith('* ')) {
            const content = cleanLine.replace('* ', '');
            // More robust check for Signal/Implication that doesn't rely solely on asterisks
            const signalMatch = line.match(/\* \**The Signal:\**\s*(.*)/i);
            const implicationMatch = line.match(/\* \**The Implication:\**\s*(.*)/i);

            if (signalMatch || implicationMatch) {
              const label = signalMatch ? "THE SIGNAL" : "THE IMPLICATION";
              const value = (signalMatch ? signalMatch[1] : implicationMatch![1]).replace(/\*\*/g, '');
              sectionElements.push(
                <div key={`bullet-${secIdx}-${idx}`} className="flex flex-col sm:flex-row gap-1 sm:gap-2 mb-2 ml-11 text-gray-700 dark:text-gray-300 text-sm">
                  <span className="font-bold text-gray-900 dark:text-white min-w-[120px] text-xs uppercase tracking-wide opacity-80 mt-0.5">{label}</span>
                  <span className="flex-1 leading-relaxed">{value}</span>
                </div>
              )
            } else if (content.includes('[Link]')) {
              const parts = content.split('—');
              sectionElements.push(
                <div key={`link-${secIdx}-${idx}`} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-lg mb-2 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-75 cursor-pointer border border-gray-200 dark:border-white/5 shadow-sm ml-1">
                  <div className="mt-1"><ExternalLink className="w-4 h-4 text-blue-500" /></div>
                  <div><p className="font-semibold text-gray-900 dark:text-white text-sm">{parts[0]?.replace(/\*\*/g, '')}</p><p className="text-xs text-gray-500 mt-1">{parts[1]?.replace('[Link]', '')}</p></div>
                </div>
              )
            } else {
              sectionElements.push(<li key={`li-${secIdx}-${idx}`} className="ml-4 mb-2 text-gray-700 dark:text-gray-300 list-disc pl-2 text-sm leading-relaxed">{content}</li>);
            }
          } else {
            sectionElements.push(<p key={`p-${secIdx}-${idx}`} className="mb-3 text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{line}</p>);
          }
        }
      });
      return <div key={`sec-${secIdx}`}>{sectionElements}</div>;
    });
  };



  return (
    // Updated padding-bottom from pb-40 to pb-48 for extra margin
    <div className="h-full flex flex-col max-w-5xl mx-auto space-y-6 pb-48">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full border border-gray-200 dark:border-white/10 uppercase tracking-wider">{marketPriority} Focus</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {view === 'daily_podcast' ? 'AI Podcast' : view === 'daily_export' ? 'Export' : 'Executive Daily'}
          </h1>
        </div>
        {(view === 'daily' || view === 'daily_briefing') && (
          <button onClick={() => fetchData(true)} className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white transition-colors duration-75" title="Refresh">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {view === 'daily_podcast' ? (
        <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden h-[calc(100vh-14rem)] min-h-[500px]">
          <PodcastView
            playlist={playlist}
            currentAudioId={currentAudioId}
            isPlaying={isPlaying}
            isAudioLoading={isAudioLoading}
            duration={duration}
            currentTime={currentTime}
            date={date}
            playbackSpeed={playbackSpeed}
            setPlaybackSpeed={setPlaybackSpeed}
            handleSeek={handleSeek}
            togglePlayback={togglePlayback}
            playPlaylistTrack={playPlaylistTrack}
            audioRef={audioRef}
            formatTime={formatTime}
          />
        </GlassCard>
      ) : view === 'daily_export' ? (
        <ExportView
          handleDownloadPDF={() => {
            if (!content) return;
            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            const maxWidth = pageWidth - margin * 2;
            let yPos = margin;

            // Header
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text('AI BUSINESS SUITE', margin, yPos);
            doc.text(date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }), pageWidth - margin, yPos, { align: 'right' });
            yPos += 15;

            // Title
            doc.setFontSize(24);
            doc.setTextColor(0);
            doc.setFont('helvetica', 'bold');
            doc.text('Executive Briefing', margin, yPos);
            yPos += 5;

            // Divider line
            doc.setDrawColor(200);
            doc.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 10;

            // Process content
            doc.setFont('helvetica', 'normal');
            const lines = content.split('\n');

            for (const line of lines) {
              // Check for page break
              if (yPos > pageHeight - 30) {
                doc.addPage();
                yPos = margin;
              }

              const cleanLine = line.replace(/\*\*/g, '').replace(/\*/g, '').trim();
              if (!cleanLine) {
                yPos += 4;
                continue;
              }

              // Section headers (## or ###)
              if (line.startsWith('## ') || line.startsWith('### ')) {
                yPos += 6;
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(30, 64, 175); // Blue
                const headerText = cleanLine.replace(/^#+\s*\d*\.?\s*/, '');
                doc.text(headerText, margin, yPos);
                yPos += 8;
                doc.setTextColor(0);
                doc.setFont('helvetica', 'normal');
              }
              // Bullet points
              else if (cleanLine.startsWith('•') || cleanLine.startsWith('-') || cleanLine.startsWith('*')) {
                doc.setFontSize(10);
                const bulletText = cleanLine.replace(/^[•\-\*]\s*/, '');
                const wrappedLines = doc.splitTextToSize(bulletText, maxWidth - 10);
                doc.text('•', margin, yPos);
                doc.text(wrappedLines, margin + 5, yPos);
                yPos += wrappedLines.length * 5 + 2;
              }
              // Regular paragraphs
              else {
                doc.setFontSize(10);
                const wrappedLines = doc.splitTextToSize(cleanLine, maxWidth);
                doc.text(wrappedLines, margin, yPos);
                yPos += wrappedLines.length * 5 + 2;
              }
            }

            // Footer
            const totalPages = doc.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
              doc.setPage(i);
              doc.setFontSize(8);
              doc.setTextColor(150);
              doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
              doc.text('CONFIDENTIAL', margin, pageHeight - 10);
            }

            doc.save(`AIBusinessSuite_Brief_${date.toISOString().split('T')[0]}.pdf`);
          }}
          handleSendEmail={handleSendEmail}
          loading={loading}
          content={content}
        />
      ) : (
        loading ? (
          <div className="space-y-6 max-w-4xl mx-auto w-full mt-4">
            <div className="h-64 bg-gray-200 dark:bg-white/5 rounded-2xl w-full"></div>
            <div className="space-y-4"><div className="h-6 bg-gray-200 dark:bg-white/5 rounded w-3/4"></div><div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-full"></div></div>
          </div>
        ) : (
          <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="md:col-span-1 lg:col-span-3 h-32"><DailyQuoteWidget /></div>
              <div className="md:col-span-1 lg:col-span-2 h-32"><WeatherWidget /></div>
            </div>

            {/* Hero Section with Veo Video Support */}
            <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-xl group">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Abstract Glassy Monochrome Skyline Image */
                <LazyImage src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop&grayscale" alt="Executive Briefing Hero" className="w-full h-full group-hover:scale-105 transition-transform duration-1000 grayscale brightness-75 contrast-125" priority={true} />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent flex flex-col justify-end p-8">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold rounded mb-2 w-fit shadow-lg z-10 tracking-widest uppercase">Daily Intel</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-white max-w-3xl leading-tight drop-shadow-md z-10">Market Signals & Strategic Foresight</h2>
                    <div className="flex items-center gap-3 mt-3 z-10">
                      <button onClick={() => { const summaryText = getSummaryText(); if (summaryText) playText('summary', summaryText); }} disabled={isAudioLoading && currentAudioId !== 'summary'} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-medium transition-all">
                        {currentAudioId === 'summary' && isAudioLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : isPlaying && currentAudioId === 'summary' ? <Volume2 className="w-3 h-3 text-blue-500" /> : <Play className="w-3 h-3 fill-current" />}
                        {isPlaying && currentAudioId === 'summary' ? "Playing..." : "Listen to Summary"}
                      </button>
                    </div>
                  </div>

                  {/* Veo Animation Trigger */}
                  <div className="z-10 relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isGeneratingVideo}
                      className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white transition-all disabled:opacity-50 flex items-center gap-2"
                      title="Animate Hero with Veo"
                    >
                      {isGeneratingVideo ? <Loader2 className="w-5 h-5 animate-spin" /> : <VideoIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <GlassCard className="min-h-[600px] p-0 overflow-hidden flex flex-col bg-white/60 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/20 dark:border-white/10" noPadding>
              {/* Content Type Toggle Header - Glassy Design */}
              <div className="border-b border-gray-200 dark:border-white/10 p-4 bg-white/40 dark:bg-white/5 backdrop-blur-xl flex items-center justify-between sticky top-0 z-20">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-2">Format Selection</span>

                <div className="flex bg-gray-100 dark:bg-black/20 p-1 rounded-xl border border-gray-200 dark:border-white/5 shadow-inner">
                  <button
                    onClick={() => setSummaryMode('short')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${summaryMode === 'short' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    <AlignLeft className="w-3 h-3" /> Shortform
                  </button>
                  <button
                    onClick={() => setSummaryMode('long')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${summaryMode === 'long' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    <AlignJustify className="w-3 h-3" /> Longform
                  </button>
                </div>
              </div>

              <div className="p-8 md:p-10">
                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">{renderContent(content)}</div>
                <SourcesSection groundingMetadata={groundingMetadata} summaryMode={summaryMode} />
              </div>
            </GlassCard>
          </div>
        )
      )}
    </div>
  );
};

export default ExecutiveDaily;