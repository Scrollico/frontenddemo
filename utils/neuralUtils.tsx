import React from 'react';
import { NeuralText } from '../components/ui/NeuralText';

// Mock entity data - in a real app these would come from the same state/service as the dashboard
const ENTITIES: Record<string, { type: 'company' | 'sector' | 'trend', metrics?: any, snippet?: string }> = {
    'Apple': {
        type: 'company',
        metrics: { value: '$189.42', change: '+1.2%', isPositive: true },
        snippet: 'Reports suggest a pivot towards generative AI for iPhone 16.'
    },
    'Nvidia': {
        type: 'company',
        metrics: { value: '$721.33', change: '+4.5%', isPositive: true },
        snippet: 'Dominating data center GPU market with H100 chips.'
    },
    'Tesla': {
        type: 'company',
        metrics: { value: '$193.12', change: '-2.1%', isPositive: false },
        snippet: 'Price adjustments in China impacting Q1 margin expectations.'
    },
    'AI': {
        type: 'trend',
        snippet: 'Agentic AI is moving from research labs to production business suites.'
    },
    'Semiconductors': {
        type: 'sector',
        metrics: { value: 'Bullish', change: '+8%', isPositive: true },
        snippet: 'Supply chain normalization leading to revenue growth in 2024.'
    },
    'M&A': {
        type: 'trend',
        snippet: 'Consolidation in the green energy sector is accelerating.'
    },
    'Supply Chain': {
        type: 'sector',
        metrics: { value: 'Critical', change: '-5%', isPositive: false },
        snippet: 'Red Sea tensions creating localized delays in European logistics.'
    }
};

/**
 * Scans text for entities and markdown bolding (**), 
 * returning a React element tree.
 */
export const wrapNeuralContent = (text: string) => {
    if (!text) return text;

    // First, handle bolding and entities together to avoid conflict
    // Pattern matches either **bold** or one of the entities
    const sortedKeys = Object.keys(ENTITIES).sort((a, b) => b.length - a.length);
    const entitySubPattern = sortedKeys.join('|');
    const pattern = new RegExp(`(\\b${entitySubPattern}\\b|\\*\\*.*?\\*\\*)`, 'gi');

    const parts = text.split(pattern);
    const result: (string | React.ReactNode)[] = [];

    parts.forEach((part, i) => {
        if (!part) return;

        // Check for Bold
        if (part.startsWith('**') && part.endsWith('**')) {
            const boldText = part.substring(2, part.length - 2);
            // Recursively wrap content inside bold tag for entities
            result.push(<strong key={i} className="font-bold">{wrapNeuralContent(boldText)}</strong>);
            return;
        }

        // Check for Entity
        const match = sortedKeys.find(k => k.toLowerCase() === part.toLowerCase());
        if (match) {
            const entity = ENTITIES[match];
            result.push(
                <NeuralText
                    key={i}
                    text={part}
                    entityType={entity.type}
                    metrics={entity.metrics}
                    snippet={entity.snippet}
                />
            );
        } else {
            result.push(part);
        }
    });

    return <>{result}</>;
};
