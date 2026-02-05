import { GoogleGenAI, Modality, Type } from "@google/genai";

// Lazy initialization to prevent crash if process.env is accessed immediately in browser
let aiClient: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiClient) {
    const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) 
      ? process.env.API_KEY 
      : '';
      
    if (!apiKey) {
      console.warn("AI Business Suite: API Key is missing. AI features will not function.");
      console.log("Debug Info: process.env.API_KEY is", typeof process !== 'undefined' && process.env ? typeof process.env.API_KEY : "undefined");
    } else {
       console.log("AI Business Suite: AI Initialized. Key length:", apiKey.length);
    }
    
    aiClient = new GoogleGenAI({ apiKey: apiKey });
  }
  return aiClient;
};

// --- CACHING LAYER ---
// Pre-initialize caches with mock data so content shows immediately on first load.
// API calls only happen on explicit refresh (forceRefresh=true).
let dailyBriefingCache: { content: string, groundingMetadata: any, sectorsKey: string } | null = null;
let marketSignalsCache: { data: any, groundingMetadata: any, focusKey: string } | null = null;

// Helper to get current context for Content Studio
export const getGlobalContext = () => {
    let context = "Context: ";
    if (dailyBriefingCache) {
        context += `\nLATEST NEWS SUMMARY:\n${dailyBriefingCache.content.substring(0, 1000)}...`;
    }
    if (marketSignalsCache) {
        context += `\nMARKET DATA:\n${JSON.stringify(marketSignalsCache.data.sectors.slice(0, 5))}`;
    }
    return context;
};

// --- MOCK DATA FOR FALLBACKS (Rate Limit Handling) ---

const MOCK_BRIEFING = `## ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} : Global Markets Rally on Tech Optimism
**Spot:** *Resilience in semiconductor supply chains drives investor confidence despite lingering inflation concerns.*

### 1. Executive Summary
Global equities are trading higher today, led by a 2.3% surge in the technology sector following robust earnings from key semiconductor players. North American markets opened strong, while Asian indices closed mixed due to localized regulatory updates. The immediate outlook suggests cautious optimism as traders await the Federal Reserve's minutes.

### 2. Top 3 Developments
**1. MegaChip Corp Announces Breakthrough Processor**
* **The Signal:** MegaChip unveiled its new 2nm process node, promising 45% efficiency gains, driving stock up 8%.
* **The Implication:** This accelerates the AI hardware race, pressuring competitors to expedite R&D timelines. (Source: TechDaily, Today)

**2. EuroZone Inflation Cools to 2.4%**
* **The Signal:** CPI data from the Eurozone came in lower than the expected 2.6%.
* **The Implication:** The ECB may pause rate hikes sooner than anticipated, lowering borrowing costs for EU expansion. (Source: FinEurope, Today)

**3. GreenEnergy - SolarX Merger Finalized**
* **The Signal:** The $12B merger between GreenEnergy and SolarX was approved by regulators.
* **The Implication:** Creates a dominant player in the renewables sector, likely squeezing mid-tier competitors. (Source: GreenWire, Today)

### 3. Market Narrative
The narrative today is dominated by "Quality Growth." Investors are rotating back into high-cash-flow tech stocks, viewing them as safe havens against macroeconomic ambiguity. While the bond market shows some volatility, the VIX index has dropped below 15, signaling reduced fear.

### 4. Key Takeaways
* Tech sector leadership is back, driven by hardware innovation.
* Inflation data in Europe provides a bullish signal for global liquidity.
* M&A activity is heating up in the energy transition space.

### 5. Reading of the Day
* **The AI Infrastructure Gap** — Analysis of grid power needs for 2025 (FutureTech, Today) — [Link]
* **Monetary Policy in Q4** — What to expect from central banks (GlobalEcon, Today) — [Link]
`;

const MOCK_MARKET_DATA = {
  sectors: [
    { sector: 'Technology', change: 2.8, volatility: 'High', driver: 'AI Hardware Rally', volume: 'High', insight: 'Semiconductor earnings beat expectations by 15%, signaling sustained demand for AI infrastructure well into Q4, with cloud providers increasing CapEx guidance.' },
    { sector: 'Energy', change: -1.2, volatility: 'Medium', driver: 'OPEC+ Supply', volume: 'Med', insight: 'Price correction following inventory surplus report; major producers likely to maintain current output caps to stabilize floor price around $78/barrel.' },
    { sector: 'Health', change: 0.9, volatility: 'Low', driver: 'BioTech M&A', volume: 'Med', insight: 'Defensive rotation into large-cap pharma as investors seek stability amidst rate uncertainty, fueled by rumors of a mega-merger in the oncology space.' },
    { sector: 'Finance', change: 1.5, volatility: 'Medium', driver: 'Yield Curve', volume: 'High', insight: 'Regional banks stabilizing post-stress test results, with net interest margins showing unexpected resilience despite inverted yield curve pressures.' },
    { sector: 'Crypto', change: -3.4, volatility: 'High', driver: 'Regulatory News', volume: 'High', insight: 'Sharp sell-off triggered by new SEC guidance on staking services; institutional volume remains flat as uncertainty regarding ETF approvals lingers.' },
    { sector: 'Retail', change: 0.4, volatility: 'Low', driver: 'Consumer Sentiment', volume: 'Low', insight: 'Mixed earnings from big-box retailers suggest consumer spending is shifting heavily towards essentials and discount channels.' },
    { sector: 'Real Estate', change: -0.5, volatility: 'Low', driver: 'Mortgage Rates', volume: 'Low', insight: 'Commercial sector remains under pressure due to refinancing risks in metropolitan office markets, though industrial warehousing demand stays robust.' },
    { sector: 'Industrials', change: 1.8, volatility: 'Medium', driver: 'Infrastructure Bill', volume: 'Med', insight: 'Capital goods orders showing strength driven by federal spending on green manufacturing hubs and defense contract renewals.' },
    { sector: 'Utilities', change: 0.2, volatility: 'Low', driver: 'Safe Haven', volume: 'Low', insight: 'Flat performance amidst growth sector rally; dividend yields remain attractive for conservative portfolios seeking inflation hedges.' },
  ],
  nicheTopics: [
    { topic: 'Solid-State Batteries', signal: 'High', mentions: 1240, growth: '+45%', insight: 'Breakthroughs in energy density are accelerating EV adoption timelines by 2-3 years.' },
    { topic: 'Generative Design', signal: 'Medium', mentions: 850, growth: '+22%', insight: 'Manufacturing sectors are adopting AI design tools to reduce material waste by up to 30%.' },
    { topic: 'Green Hydrogen', signal: 'High', mentions: 980, growth: '+38%', insight: 'Heavy industry subsidies in the EU are driving a Capex boom in electrolysis infrastructure.' },
    { topic: 'Space Logistics', signal: 'High', mentions: 410, growth: '+65%', insight: 'Private launch costs dropping below $1,500/kg is opening new markets for orbital manufacturing.' },
  ]
};

export const generateDailyBriefing = async (sectors: string[], region: string, forceRefresh: boolean = false): Promise<{ content: string, groundingMetadata: any } | null> => {
  const sectorsKey = sectors.sort().join(',');
  
  // Return cached data if available and not forcing refresh
  if (dailyBriefingCache && !forceRefresh) {
      return dailyBriefingCache;
  }
  
  // If no cache and not forcing refresh, use mock data immediately (token saving)
  if (!dailyBriefingCache && !forceRefresh) {
      const fallback = {
          content: MOCK_BRIEFING,
          groundingMetadata: null,
          sectorsKey
      };
      dailyBriefingCache = fallback;
      return fallback;
  }

  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const sectorsStr = sectors.join(", ");

  const prompt = `
# Role & Objective
You are the **Business Intelligence News Editor for AI Business Suite**. Your task is to aggregate today’s raw business news, filter for high-impact market signals with a specific focus on **${sectorsStr}**, and synthesize a prestigious, "Executive Daily" digest.

# Formatting Constraints (STRICT)
- **DO NOT** use asterisks (**) or double asterisks for bolding or lists. 
- Use plain text for headers and emphasis.
- The output must look clean, professional, and not "AI-generated".

# Inputs
* **DATE:** ${dateStr}
* **FOCUS SECTORS:** ${sectorsStr}
* **REGIONS:** ${region}

# Output Structure
## ${dateStr} : {Strong, Single-Line Business Headline}
**Spot:** *{A one-sentence "hook" or subtitle explaining why today matters for ${sectors[0] || 'Business'} leaders}*

### 1. Executive Summary
{3 concise sentences. Summarize the day's critical move. Close with a forward-looking sentence.}

### 2. Top 3 Developments
**1. {Headline of Event 1}**
* **The Signal:** {What happened? Use active voice and specific numbers.}
* **The Implication:** {Why it matters for business leaders?} (Source: Publisher, Date)

... (Repeat for 2 and 3)

### 3. Market Narrative
{1 concise paragraph (max 4 sentences) weaving secondary stories.}

### 4. Key Takeaways
* {Bullet 1: Crucial data point.}
* {Bullet 2: Crucial risk/opportunity.}
* {Bullet 3: Strategic note.}

### 5. Reading of the Day
* **{Title}** — {1-line value prop} (Publisher, Date) — [Link]
`;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const result = {
      content: response.text || "Executive Briefing currently unavailable.",
      groundingMetadata: response.candidates?.[0]?.groundingMetadata,
      sectorsKey
    };
    
    dailyBriefingCache = result;
    return result;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    const fallback = {
        content: MOCK_BRIEFING,
        groundingMetadata: null,
        sectorsKey
    };
    dailyBriefingCache = fallback;
    return fallback;
  }
};

export const generateExecutiveContent = async (type: 'linkedin' | 'talking-points', topic: string, tone: string, context?: string): Promise<string> => {
  let systemInstruction = "";
  
  if (type === 'linkedin') {
    systemInstruction = `
      You are an expert executive ghostwriter creating a high-impact LinkedIn post.
      
      **Goal:** Connect the news/topic to the broader market status using the provided Context.
      
      **Formatting Constraints (STRICT):**
      - Do **NOT** use asterisks (*) or (**) for bolding or lists. The output must be clean text.
      - Use standard hyphens (-) for bullet points if needed.
      - Use line breaks for spacing.
      
      **Structure:**
      1. **The Hook:** A contrarian or sharp take on the news.
      2. **The Data (The "Proof"):** Reference specific data points from the Context (Sector Heatmap or Briefing) explicitly.
      3. **The Insight:** What this means for leaders/strategy.
      4. **The Closer:** A question to drive comments.
      
      **Rules:**
      - Use specific emojis for bullets (e.g., 📉, 🚨, 💡, 📈).
      - Max 200 words.
      - Tone: ${tone}.
    `;
  } else {
    systemInstruction = `
      You are a Chief of Staff preparing a **Strategic Talking Points Memo**.
      
      **Goal:** Provide deep, data-backed arguments for an executive meeting based on the topic and Context.
      
      **Formatting Constraints (STRICT):**
      - Do **NOT** use asterisks (*) or (**) for bolding or lists.
      
      **Structure:**
      - **Strategic Context:** 2-3 sentences framing the issue within current market conditions (use provided Context).
      - **Key Data Arguments:** 3-4 bullet points citing specific numbers/events from the context.
      - **Risk/Opportunity:** A clear "If/Then" statement about the implication.
      - **Recommendation:** A decisive 1-sentence stance.
      
      **Tone:** ${tone}, Professional, Brief, Insightful.
    `;
  }

  const fullPrompt = `Topic: ${topic}\n\n${context || ''}`;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text || "Content generation failed.";
  } catch (error) {
    console.error("Content Gen Error:", error);
    return "Rate limit exceeded. Try again later.";
  }
};

export const generatePresentationSlides = async (topic: string, tone: string, context?: string): Promise<any[]> => {
  const prompt = `
    Create a 5-slide **Apple Keynote / Modern Glassy** executive presentation deck about: ${topic}.
    Use the following Context to enrich the slides with real data/events if applicable: ${context || ''}.
    
    **Style Guide:**
    - Titles: Minimalist, impact-focused (e.g., "The Pivot Point").
    - Subtitles: The strategic implication.
    - Points: Very concise, data-heavy.
    - Visual Note: A short keyword phrase for an abstract background image (e.g., "abstract geometric blue glass").
    
    Tone: ${tone}.
    
    Return JSON only. Format:
    [
      {
        "title": "Slide Title",
        "subtitle": "Short subtitle",
        "points": ["Bullet 1", "Bullet 2", "Bullet 3"],
        "visualNote": "keyword for unsplash"
      },
      ...
    ]
  `;
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    
    let text = response.text || "[]";
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (e) {
    console.error("Slide Gen Error", e);
    return [
      { title: "Error Generating Slides", subtitle: "Please try again", points: ["Rate limit or network error"], visualNote: "error" }
    ];
  }
};

export const generateInfographicData = async (topic: string): Promise<any> => {
  const prompt = `
    Generate synthetic but realistic financial/market data for an infographic about: ${topic}.
    Style: **Financial Times** data journalism.
    
    Return JSON only. Format:
    {
       "title": "Chart Title (FT Style)",
       "summary": "1 sentence insight describing the trend.",
       "type": "bar" or "line" or "area",
       "data": [
         { "name": "Label", "value": 120 },
         ...
       ]
    }
  `;
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    
    let text = response.text || "{}";
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (e) {
    console.error("Infographic Gen Error", e);
    return { title: "Data Unavailable", summary: "Could not generate chart.", type: 'bar', data: [] };
  }
};

export const generateMarketSignals = async (focus: string = "Global", forceRefresh: boolean = false): Promise<{ data: any, groundingMetadata: any } | null> => {
  // Return cached data if available and not forcing refresh
  if (marketSignalsCache && !forceRefresh) {
    return marketSignalsCache;
  }
  
  // If no cache and not forcing refresh, use mock data immediately (token saving)
  if (!marketSignalsCache && !forceRefresh) {
      const fallback = {
         data: MOCK_MARKET_DATA,
         groundingMetadata: null,
         focusKey: focus
      };
      marketSignalsCache = fallback;
      return fallback;
  }

  const prompt = `
  Generate a real-time market intelligence dataset prioritizing the **${focus}** sector.
  Include 12 sector performance items.
  Also identify 8 emerging niche market topics relevant to **${focus}**.
  
  RETURN JSON ONLY.
  STRICT: Do NOT use asterisks (**) for bolding within the JSON values.
  Format:
  {
    "sectors": [
      { "sector": "Name", "change": 1.2, "volatility": "Low/Medium/High", "driver": "Key Driver", "volume": "Low/Med/High", "insight": "1-2 sentences of detailed executive insight explaining the movement." }
    ],
    "nicheTopics": [
      { "topic": "Name", "signal": "Low/Medium/High", "mentions": 100, "growth": "+10%", "insight": "Executive insight" }
    ]
  }
  `;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    let jsonString = response.text || "{}";
    jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const data = JSON.parse(jsonString);
    const result = {
      data: data,
      groundingMetadata: response.candidates?.[0]?.groundingMetadata,
      focusKey: focus
    };
    
    marketSignalsCache = result;
    return result;

  } catch (error) {
    console.error("Market Signals Error:", error);
    const fallback = {
       data: MOCK_MARKET_DATA,
       groundingMetadata: null,
       focusKey: focus
    };
    marketSignalsCache = fallback;
    return fallback;
  }
};

export const generateCompetitorAnalysis = async (userCompany: string, competitors: string[]): Promise<{ radarData: any[], takeaways: any[], groundingMetadata: any }> => {
  const competitorList = competitors.length > 0 ? competitors.join(", ") : "Main Industry Competitors";
  
  const prompt = `
    Analyze the competitive landscape between **${userCompany}** and **${competitorList}**.
    
    1. Compare them across 8 axes: 
       - Innovation
       - Market Share
       - Market Share Growth
       - R&D Investment
       - Brand Velocity
       - Talent Retention
       - ESG Score
       - Revenue Growth
    
    2. Assign a score from 0-150 for ${userCompany} (metricsA) and the aggregate or primary competitor (metricsB).
    3. Generate 3 "Key Strategic Takeaways" based on *actual recent news* if found.
    
    STRICT: Do NOT use asterisks (**) for bolding in your response.
    
    RETURN JSON ONLY.
  `;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    let jsonString = response.text || "{}";
    jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonString);

    return {
      radarData: data.radarData || [],
      takeaways: data.takeaways || [],
      groundingMetadata: response.candidates?.[0]?.groundingMetadata
    };
  } catch (error) {
    console.error("Competitor Analysis Error:", error);
    return {
      radarData: [],
      takeaways: [],
      groundingMetadata: null
    };
  }
};

export const chatWithAgent = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<{ text: string, groundingMetadata: any }> => {
  try {
    const ai = getAI();
    const context = getGlobalContext();

    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: history,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `
        You are the **Predictive Engine** of the AI Business Suite.
        Your role is to provide deep, high-level strategic foresight based on the available market data and news.
        
        **CONTEXT DATA (Use this for "Evidence"):**
        ${context}

        **CORE DIRECTIVE:**
        Do not just summarize. *Predict*. Use the "Thinking about the future..." persona. Connect dots between unrelated events.

        **FORMATTING RULES:**
        - DO NOT use asterisks (**) for bolding. Use plain text and capitalized headers.
        
        **RESPONSE STRUCTURE (STRICT MARKDOWN):**

        ### 🔮 The Forecast
        (A direct, bold answer predicting the likely outcome in 3-6 months. Be specific.)

        ### 📊 The Evidence (Data-Driven)
        * **Data Point 1:** [Value/Trend] - [Context from the provided data or search]
        * **Data Point 2:** [Value/Trend] - [Context]

        ### 📡 Market Signals to Watch
        (What early indicators should the user monitor?)
        * **Signal A:** If [Event X] happens, expect [Result Y].
        * **Signal B:** Watch for competitor moves in [Sector Z].

        ### 🛡️ Risk Monitor
        * **High Probability:** [Risk 1]
        * **Black Swan:** [Risk 2]

        ### 🚀 Action Steps (Immediate)
        1.  **Defensive:** [Step 1]
        2.  **Offensive:** [Step 2]
        `,
      }
    });

    const result = await chat.sendMessage({ message });
    return {
        text: result.text || "I cannot provide an analysis at this moment.",
        groundingMetadata: result.candidates?.[0]?.groundingMetadata
    };
  } catch (error) {
    console.error("Chat Error:", error);
    return {
        text: "I am currently experiencing high traffic or connection limits. Please try again in a moment.",
        groundingMetadata: null
    };
  }
}

// Simple Single Speaker TTS
export const generateSpeech = async (text: string): Promise<string | null> => {
  try {
    const ai = getAI();
    if (!ai) return null;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: {
        parts: [{ text: text }]
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }
          }
        }
      }
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

// Specialized Podcast Generation (Dialogue + MultiSpeaker)
export const generatePodcastAudio = async (executiveSummary: string): Promise<{ audio: string | null, script: string }> => {
    const ai = getAI();
    if (!ai) return { audio: null, script: "" };

    try {
        // 1. Generate Dialogue Script (Fast using Flash)
        // We limit input to just the executive summary to keep it short (~1.5 mins)
        const scriptPrompt = `
        Convert this executive summary into a short, punchy 90-second podcast dialogue between two hosts:
        1. **Alara** (Female, Insightful, Strategic)
        2. **Arda** (Male, Analytical, Data-focused)

        **Source Text:**
        "${executiveSummary}"

        **Rules:**
        - Keep it under 200 words total.
        - Conversational but professional.
        - Start directly (No "Welcome to the podcast").
        - Output strictly in the format:
          Alara: [Text]
          Arda: [Text]
        `;

        const scriptResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: scriptPrompt
        });
        
        const script = scriptResponse.text || "";
        if (!script) return { audio: null, script: "" };

        // 2. Generate Audio with Multi-Speaker
        const audioResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: script }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    multiSpeakerVoiceConfig: {
                        speakerVoiceConfigs: [
                            {
                                speaker: 'Alara',
                                voiceConfig: {
                                    prebuiltVoiceConfig: { voiceName: 'Kore' } // Female-sounding
                                }
                            },
                            {
                                speaker: 'Arda',
                                voiceConfig: {
                                    prebuiltVoiceConfig: { voiceName: 'Fenrir' } // Male-sounding (Deep)
                                }
                            }
                        ]
                    }
                }
            }
        });

        const audioData = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
        return { audio: audioData, script };

    } catch (error) {
        console.error("Podcast Gen Error:", error);
        return { audio: null, script: "" };
    }
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = error => reject(error);
  });
};

export const generateVeoVideo = async (imageFile: File, prompt: string = "Cinematic, slow motion, professional business context"): Promise<string | null> => {
  try {
    const ai = getAI();
    const base64Image = await fileToBase64(imageFile);

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      image: {
        imageBytes: base64Image,
        mimeType: imageFile.type,
      },
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (!downloadLink) {
      throw new Error("No video URI returned.");
    }

    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Veo Generation Error:", error);
    return null;
  }
};