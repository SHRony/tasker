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
    }
]; 