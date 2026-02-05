
// Application Mock Data
// Centralized for Search & Dashboard Consistency

export const QUOTES = [
  {
    text: "The people who are crazy enough to think they can change the world are the ones who do.",
    author: "Steve Jobs",
    role: "Co-founder, Apple",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg/220px-Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg"
  },
  {
    text: "The happiness of your life depends upon the quality of your thoughts.",
    author: "Marcus Aurelius",
    role: "Roman Emperor",
    image: "/images/marcus.webp"
  },
];

export const INSIGHTS_DATA = [
    { 
      id: 1,
      title: "Battery Supply Chain Resilience", 
      date: "Today", 
      summary: "Diversification of lithium sourcing is creating new mid-stream opportunities in South America.",
      details: "Recent policy shifts in Chile and Argentina are encouraging direct foreign investment in local processing capabilities. This moves the value chain closer to the source, reducing logistics costs by approximately 15% and mitigating geopolitical risks associated with current dominant processing hubs. Key players like Albemarle and SQM are already expanding capacity."
    },
    { 
      id: 2,
      title: "The AI Design Revolution", 
      date: "Yesterday", 
      summary: "Generative manufacturing tools are reducing prototyping costs by 40% in aerospace sectors.",
      details: "Aerospace giants are leveraging generative design algorithms to create lighter, stronger components that were previously impossible to manufacture. This shift is not just about weight reduction; it's compressing the R&D cycle from months to weeks. The integration of AI with additive manufacturing is the primary driver, with Autodesk and Ansys leading the software integration."
    },
    { 
      id: 3,
      title: "Hydrogen Infrastructure CapEx", 
      date: "2 days ago", 
      summary: "EU subsidies are accelerating the deployment of green hydrogen hubs faster than projected.",
      details: "The European Hydrogen Bank's latest auction results indicate a clearing price lower than expected, stimulating immediate CapEx deployment. Major utilities are pivoting strategy to secure early-mover advantage in the North Sea corridor. This creates a downstream effect on electrolyzer manufacturers, who are seeing order books fill up through 2026."
    }
];

export const COMPETITOR_NEWS_MOCK = [
    { id: 1, source: "Reuters", date: "4h ago", title: "Competitor X announces strategic partnership with CloudGiant to boost AI capabilities", sentiment: "positive", tag: "M&A", impact: "High", url: "https://www.reuters.com" },
    { id: 2, source: "Bloomberg", date: "12h ago", title: "Supply chain disruptions impact Q3 shipment targets for major tech rivals", sentiment: "negative", tag: "Supply Chain", impact: "Medium", url: "https://www.bloomberg.com" },
    { id: 3, source: "TechCrunch", date: "1d ago", title: "New patent filing suggests Competitor Y is moving into quantum encryption", sentiment: "neutral", tag: "R&D", impact: "Low", url: "https://techcrunch.com" },
    { id: 4, source: "Wall Street Journal", date: "2d ago", title: "Executive shakeup: Competitor X appoints new Chief Strategy Officer", sentiment: "neutral", tag: "Management", impact: "High", url: "https://www.wsj.com" },
    { id: 5, source: "Financial Times", date: "3d ago", title: "Sector Analysis: Margins tightening across EMEA region due to regulatory compliance costs", sentiment: "negative", tag: "Regulatory", impact: "Medium", url: "https://www.ft.com" },
];

export const SEARCH_NAV_ITEMS = [
  { id: 'daily', label: 'Executive Daily', group: 'Dashboard' },
  { id: 'daily_briefing', label: 'Daily Briefings', group: 'Dashboard' },
  { id: 'daily_podcast', label: 'AI Podcast Mode', group: 'Dashboard' },
  { id: 'daily_export', label: 'Export & Integration', group: 'Dashboard' },
  
  { id: 'market', label: 'Market Intelligence', group: 'Intelligence' },
  { id: 'market_heatmap', label: 'Sector Heatmap', group: 'Intelligence' },
  { id: 'market_niche', label: 'Emerging-Niche Topics', group: 'Intelligence' },
  { id: 'market_radar', label: 'Competitor Radar', group: 'Intelligence' },
  { id: 'market_chat', label: 'Predictive Engine', group: 'Intelligence' },
  
  { id: 'content', label: 'Content Studio', group: 'Create' },
  { id: 'agents', label: 'AI Agents', group: 'Create' },
  
  { id: 'settings', label: 'Settings', group: 'System' },
];
