'use server';

import fetch from 'node-fetch';

interface SearchResult {
    title: string;
    link: string;
    snippet: string;
}

interface GoogleSearchItem {
    title: string;
    link: string;
    snippet: string;
    pagemap?: {
        metatags?: Array<{
            [key: string]: string;
        }>;
    };
}

interface GoogleSearchResponse {
    items: GoogleSearchItem[];
    searchInformation: {
        totalResults: string;
        searchTime: number;
    };
}

export async function webSearch(query: string): Promise<SearchResult[]> {
    try {
        // Google Custom Search API endpoint
        const GOOGLE_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
        const GOOGLE_CX = process.env.SEARCH_ENGINE_ID;
        const endpoint = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(query)}`;
        console.log(endpoint);
        const response = await fetch(endpoint);
        const data = await response.json() as GoogleSearchResponse;

        if (!data.items) {
            console.log('No search results found:', data);
            return [];
        }

        // Transform Google results to our format
        const results: SearchResult[] = data.items
            .slice(0, 5)
            .map(item => ({
                title: item.title,
                link: item.link,
                snippet: item.snippet || ''
            }));

        return results;
    } catch (error) {
        console.error('Web search error:', error);
        return [];
    }
} 