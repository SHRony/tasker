import { Task } from '../types/component_schema';

export const sampleTasks: Task[] = [
    {
        id: "name-to-poem",
        name: "Name to Poem Generator",
        description: "Enter your name and get a personalized poem",
        steps: [
            {
                id: "step1",
                name: "Enter Your Name",
                description: "Please enter your name below",
                components: [
                    {
                        id: "name-input",
                        name: "Name Input",
                        type: "text-input",
                        placeholder: "Enter your name",
                        required: true
                    }
                ]
            },
            {
                id: "step2",
                name: "Generate Poem",
                description: "Generating your personalized poem...",
                components: [
                    {
                        id: "poem-generator",
                        name: "Poem Generator",
                        type: "ai-analysis",
                        prompt: "Write a short, friendly poem about the name ${name-input}. Make it 4 lines long and include the name in a creative way."
                    }
                ]
            },
            {
                id: "step3",
                name: "Display Poem",
                description: "Here's your personalized poem!",
                components: [
                    {
                        id: "poem-display",
                        name: "Poem Display",
                        type: "text",
                        text: "${poem-generator}"
                    }
                ]
            }
        ]
    },
    {
        id: "simple-greeting",
        name: "Simple Greeting",
        description: "A simple task to demonstrate the system",
        steps: [
            {
                id: "step1",
                name: "Enter Your Name",
                description: "Please enter your name",
                components: [
                    {
                        id: "name-input",
                        name: "Name Input",
                        type: "text-input",
                        placeholder: "Enter your name",
                        required: true
                    }
                ]
            },
            {
                id: "step2",
                name: "Display Greeting",
                description: "Here's your greeting!",
                components: [
                    {
                        id: "greeting-display",
                        name: "Greeting Display",
                        type: "text",
                        text: "Hello, ${name-input}! Welcome to Tasker!"
                    }
                ]
            }
        ]
    },
    {
        id: "topic-analysis",
        name: "Topic Analysis",
        description: "Analyze a topic using AI",
        steps: [
            {
                id: "step1",
                name: "Enter Topic",
                description: "Enter the topic you want to analyze",
                components: [
                    {
                        id: "topic-input",
                        name: "Topic Input",
                        type: "text-input",
                        placeholder: "Enter your topic",
                        required: true
                    }
                ]
            },
            {
                id: "step2",
                name: "AI Analysis",
                description: "Analyzing your topic...",
                components: [
                    {
                        id: "analysis",
                        name: "Topic Analysis",
                        type: "ai-analysis",
                        prompt: "Analyze the following topic in detail: ${topic-input}\n\nProvide:\n1. Key points\n2. Potential implications\n3. Related concepts"
                    }
                ]
            },
            {
                id: "step3",
                name: "Display Analysis",
                description: "Here's your analysis!",
                components: [
                    {
                        id: "analysis-display",
                        name: "Analysis Display",
                        type: "text",
                        text: "${analysis}"
                    }
                ]
            }
        ]
    }
]; 