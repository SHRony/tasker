import { Task } from '../types/types';

export const sampleTasks: Task[] = [
    {
        id: 'document-analysis',
        title: 'Document Analysis',
        description: 'Upload and analyze documents using AI',
        steps: [
            {
                id: 'upload-step',
                title: 'Upload Documents',
                description: 'Upload the documents you want to analyze',
                components: [
                    {
                        id: 'file-upload-1',
                        name: 'documents',
                        type: 'file-upload',
                        minFiles: 1,
                        maxFiles: 5,
                        maxFileSize: 10485760, // 10MB
                        acceptedFileTypes: ['.pdf', '.doc', '.docx', '.txt']
                    }
                ]
            },
            {
                id: 'analysis-step',
                title: 'AI Analysis',
                description: 'AI will analyze your documents',
                components: [
                    {
                        id: 'analysis-1',
                        name: 'document-analysis',
                        type: 'ai-analysis',
                        prompt: 'Analyze the uploaded documents for key insights. ${file-upload-1}'
                    }
                ]
            },
            {
                id: 'results-step',
                title: 'Analysis Results',
                description: 'Review the AI analysis of your documents',
                components: [
                    {
                        id: 'results-text',
                        name: 'analysis-results',
                        type: 'text',
                        text: 'Here are the key insights from your documents:'
                    },
                    {
                        id: 'results-display',
                        name: 'analysis-display',
                        type: 'text',
                        text: '${analysis-1}'
                    }
                ]
            }
        ]
    },
    {
        id: 'web-research',
        title: 'Web Research Assistant',
        description: 'Research a topic using web search and AI analysis',
        steps: [
            {
                id: 'topic-input',
                title: 'Research Topic',
                description: 'Enter the topic you want to research',
                components: [
                    {
                        id: 'topic-text',
                        name: 'topic',
                        type: 'input',
                        placeholder: 'Enter your research topic',
                        required: true
                    },
                    {
                        id: 'details-text',
                        name: 'details',
                        type: 'textarea',
                        placeholder: 'Add any specific details or requirements',
                        required: false
                    }
                ]
            },
            {
                id: 'search-step',
                title: 'Web Search',
                description: 'Searching the web for relevant information',
                components: [
                    {
                        id: 'web-search-1',
                        name: 'topic-search',
                        type: 'web-search',
                        query: 'Research about: ${topic-text}'
                    }
                ]
            },
            {
                id: 'analysis-step',
                title: 'AI Analysis',
                description: 'Analyzing search results',
                components: [
                    {
                        id: 'analysis-1',
                        name: 'search-analysis',
                        type: 'ai-analysis',
                        prompt: 'Analyze the following research topic: ${topic-text}\n\nAdditional context: ${details-text}\n\nSearch results: ${web-search-1}'
                    }
                ]
            }
        ]
    },
    {
        id: 'business-analysis',
        title: 'Business Idea Analysis',
        description: 'Analyze your business idea and get optimized search keywords for market research',
        steps: [
            {
                id: 'step-1',
                title: 'Enter Business Idea',
                description: 'Describe your business idea in detail. Include target market, main features, and potential benefits.',
                components: [
                    {
                        id: 'business-idea',
                        name: 'Business Idea Input',
                        type: 'textarea',
                        placeholder: 'Enter your business idea here...',
                        required: true
                    }
                ]
            },
            {
                id: 'step-2',
                title: 'Generate Keywords',
                description: 'AI will analyze your business idea and generate optimized search keywords',
                components: [
                    {
                        id: 'keyword-analysis',
                        name: 'Keyword Analysis',
                        type: 'ai-analysis',
                        prompt: 'Generate a optimized web search query for this business idea. Do not include any other text. Here is the business idea:\n\n${business-idea}'
                    }
                ]
            },
            {
                id: 'step-3',
                title: 'Review Keywords',
                description: 'Review the AI-generated keywords for your market research',
                components: [
                    {
                        id: 'keywords-intro',
                        name: 'Keywords Introduction',
                        type: 'text',
                        text: 'Here are the key search terms for your market research:'
                    },
                    {
                        id: 'keywords-display',
                        name: 'Generated Keywords',
                        type: 'text',
                        text: '${keyword-analysis}'
                    }
                ]
            },
            {
                id: 'step-4',
                title: 'Market Research',
                description: 'Performing web search using the generated keywords',
                components: [
                    {
                        id: 'market-search',
                        name: 'Market Research',
                        type: 'web-search',
                        query: '${keyword-analysis}'
                    }
                ]
            },
            {
                id: 'step-5',
                title: 'Research Results',
                description: 'Review the market research findings',
                components: [
                    {
                        id: 'search-intro',
                        name: 'Search Introduction',
                        type: 'text',
                        text: 'Here are the market research findings for your business idea:'
                    },
                    {
                        id: 'search-results',
                        name: 'Search Results',
                        type: 'text',
                        text: '${market-search}'
                    }
                ]
            },
            {
                id: 'step-6',
                title: 'Business Analysis',
                description: 'AI will analyze your business idea using market research data',
                components: [
                    {
                        id: 'business-analysis',
                        name: 'Business Analytics',
                        type: 'ai-analysis',
                        prompt: `Analyze this business idea comprehensively using the provided market research. Create a detailed business analysis report with the following sections:

1. Market Analysis:
   - Market size and growth potential (use charts)
   - Target market segments (create a table)
   - Competitor analysis (tabular format)
   - Market trends and opportunities

2. SWOT Analysis:
   - Present in a clear table format
   - Detailed explanations for each point

3. Financial Projections:
   - Estimated startup costs (table)
   - Revenue projections (chart)
   - Break-even analysis
   - Key financial metrics

4. Risk Assessment:
   - Risk matrix (table format)
   - Mitigation strategies

5. Implementation Timeline:
   - Present as a roadmap or timeline chart
   - Key milestones and deadlines

6. Success Metrics:
   - KPIs in table format
   - Monitoring and evaluation framework

Format the output using markdown tables, bullet points, and clear sections.

Business Idea:
\${business-idea}

Market Research Results:
\${market-search}`
                    }
                ]
            },
            {
                id: 'step-7',
                title: 'Final Analysis Report',
                description: 'Review the comprehensive business analysis',
                components: [
                    {
                        id: 'analysis-intro',
                        name: 'Analysis Introduction',
                        type: 'text',
                        text: 'Here is your comprehensive business analysis report:'
                    },
                    {
                        id: 'analysis-results',
                        name: 'Analysis Results',
                        type: 'text',
                        text: '${business-analysis}'
                    }
                ]
            }
        ]
    }
]; 