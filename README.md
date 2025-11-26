# Alara AI

## About

**Alara AI** is a prestigious, AI-powered executive intelligence suite designed to provide business leaders with comprehensive daily briefings, real-time market intelligence, and strategic content generation. Built with React and TypeScript, Alara AI leverages Google's Gemini AI to deliver personalized insights, competitor analysis, and actionable intelligence tailored to your organization's needs.

## Features

### 📊 Executive Daily Briefing

- **AI-Generated Daily Briefings**: Personalized executive summaries powered by Gemini AI
- **Multi-Format Export**: Download briefings as PDF documents
- **Audio Podcast Generation**: Convert briefings into audio format for on-the-go consumption
- **Video Generation**: Create video briefings using Google's Veo video generation
- **Market-Priority Focused**: Briefings tailored to your selected market priority (General, Energy, Finance, Innovation, Business, or Technology)

### 🔍 Market Intelligence

- **Real-Time Market Signals**: Track emerging trends and market movements
- **Competitor Radar**: Comprehensive competitor analysis and tracking
- **Strategic Heatmaps**: Visual representation of market opportunities and risks
- **Interactive AI Agent**: Chat with an AI agent for deep-dive market analysis
- **Niche Topic Discovery**: Identify emerging topics and opportunities in your market
- **Competitive Intelligence**: Compare your organization against tracked competitors

### ✍️ Content Studio

- **AI-Powered Content Generation**: Create strategic content using advanced AI
- **Multiple Content Formats**: Generate various types of business content
- **Persona-Based Writing**: Content tailored to your selected voice and persona

### ⚙️ Settings & Customization

- **Market Prioritization**: Focus on specific sectors (Energy, Finance, Innovation, Business, Technology, or General)
- **Competitor Watchlist**: Manage and track your organization's competitors
- **Source Management**: Configure data sources and regulatory feeds
- **Content Persona**: Choose between Visionary Leader or Pragmatic Operator voice
- **Team Access Control**: Manage team members and their access levels

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 6
- **AI Integration**: Google Gemini AI (@google/genai)
- **UI Components**: Lucide React (icons), Recharts (data visualization)
- **PDF Generation**: jsPDF
- **Styling**: Tailwind CSS with dark mode support

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager
- **Google Gemini API Key** (required for AI features)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Scrollico/frontenddemo.git
   cd frontenddemo
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your Gemini API key:

   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

   You can obtain a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally

## Project Structure

```
alara-ai/
├── components/
│   ├── dashboard/          # Main dashboard components
│   │   ├── ContentStudio.tsx
│   │   ├── ExecutiveDaily.tsx
│   │   ├── Header.tsx
│   │   ├── MarketIntelligence.tsx
│   │   └── Sidebar.tsx
│   ├── ui/                 # Reusable UI components
│   │   ├── AnimatedIcon.tsx
│   │   └── GlassCard.tsx
│   └── Onboarding.tsx       # Initial onboarding flow
├── services/
│   └── geminiService.ts     # Gemini AI service integration
├── App.tsx                  # Main application component
├── types.ts                 # TypeScript type definitions
└── vite.config.ts           # Vite configuration
```

## Usage

1. **Onboarding**: Complete the initial onboarding to set up your organization profile
2. **Select Market Priority**: Choose your primary market focus area in Settings
3. **Add Competitors**: Configure your competitor watchlist for competitive intelligence
4. **Generate Daily Briefing**: Access your personalized executive briefing in the Daily tab
5. **Explore Market Intelligence**: Use the Market Intelligence tab to analyze trends and competitors
6. **Create Content**: Generate strategic content using the Content Studio

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Support

For issues, questions, or feature requests, please open an issue in this repository.
