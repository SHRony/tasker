'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CodeEditorCard } from '@/components/CircularCodeStack';
import { HeroStack } from '@/components/HeroStack';
import { HeroComponentPreview } from '@/components/HeroComponentPreview';
import Image from 'next/image';

// Dummy data for testimonials, features, FAQ, etc.
const faqs = [
  {
    q: 'What is a Task?',
    a: `A Task is a complete workflow that represents a goal or process you want to accomplish. It is broken down into smaller, manageable steps.\n\nFor example: If your goal is to onboard a new employee, your Task might include steps like 'Collect Documents', 'Setup Workspace', and 'Intro Meeting'.`
  },
  {
    q: 'What is a Step?',
    a: `A Step is a stage within a Task, containing one or more Components. Each Step represents a specific action or checkpoint in your workflow.\n\nFor example: In a document review Task, a Step could be 'Upload File', followed by another Step 'AI Analysis'.`
  },
  {
    q: 'What is a Component?',
    a: `A Component is a building block of a Step. Components are interactive elements like text inputs, file uploads, checklists, or AI-powered analysis.\n\nFor example: A 'File Upload' component lets users upload documents, while an 'AI Analysis' component can process and summarize the uploaded file.`
  },
  {
    q: 'Can I customize my workflows?',
    a: `Yes! You can create, edit, and organize Tasks, Steps, and Components as you like.\n\nFor example: You can add a 'Web Search' Step to your research Task, or rearrange Steps to fit your process. Components can be mixed and matched to suit your needs.`
  },
  {
    q: 'What is the rule?',
    a: `Raiden Wins`
  },
];
const features = [
  { icon: '⚡', title: 'Fast & Intuitive', desc: 'Lightning-fast UI with a focus on usability.' },
  { icon: '🔒', title: 'Secure', desc: 'Your data is encrypted and protected.' },
  { icon: '🤖', title: 'AI Powered', desc: 'Leverage AI for smarter task management.' },
  { icon: '🧩', title: 'Modular', desc: 'Build workflows with reusable components.' },
];
const componentGallery = [
  { icon: '📝', name: 'Text Input', desc: 'Collect user input with rich text formatting.' },
  { icon: '🔍', name: 'Web Search', desc: 'Search the web for information.' },
  { icon: '📚', name: 'Document Search', desc: 'Search through your documents.' },
  { icon: '📤', name: 'File Upload', desc: 'Upload documents or images.' },
  { icon: '🤖', name: 'AI Analysis', desc: 'Analyze data with AI.' },
  { icon: '📊', name: 'Display', desc: 'Show results or summaries.' },
  { icon: '🔗', name: 'Link', desc: 'Connect to other steps.' },
  { icon: '📅', name: 'Date Picker', desc: 'Select dates.' },
  { icon: '📋', name: 'Checklist', desc: 'Create interactive checklists.' },
];

// Blue SVG icons for components
const fileUploadIcon = (
  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-8m0 0l-4 4m4-4l4 4M4 20h16" /></svg>
);
const documentSearchIcon = (
  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);
const aiAnalysisIcon = (
  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
);
const webSearchIcon = (
  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" /></svg>
);
const textInputIcon = (
  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="2" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h4" /></svg>
);
const displayIcon = (
  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="14" rx="2" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 20h8" /></svg>
);
const checklistIcon = (
  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3 3L22 4" /></svg>
);

    // For the stacked card carousel
    const steps = [
        {
            title: "Document Analysis",
            desc: "Step to analyze and process documents with multiple components.",
            type: "document_analysis",
            icon: documentSearchIcon,
            components: [
                { icon: fileUploadIcon, name: 'File Upload', desc: 'Upload your document' },
                { icon: documentSearchIcon, name: 'Document Search', desc: 'Search within the document' },
            ]
        },
        {
            title: "Research & Analysis",
            desc: "Step to gather and analyze information from multiple sources.",
            type: "research",
            icon: webSearchIcon,
            components: [
                { icon: webSearchIcon, name: 'Web Search', desc: 'Search the web' },
            { icon: aiAnalysisIcon, name: 'AI Analysis', desc: 'Analyze content with AI' },

            ]
        },
        {
            title: "Task Planning",
            desc: "Step to plan and organize tasks with multiple tools.",
            type: "planning",
            icon: checklistIcon,
            components: [
            { icon: displayIcon, name: 'Display', desc: 'Show research results' },
            { icon: textInputIcon, name: 'Text Input', desc: 'Add notes and findings' },

            ]
        },
    ];

    // For the animated stack of task cards in 'What is a Task?'
    const taskStack = [
        {
            title: "Onboard New Employee",
            steps: [
                { name: "Collect Documents", desc: "Gather all necessary paperwork.", components: ["📝", "📤"] },
                { name: "Setup Workspace", desc: "Prepare desk, computer, and access.", components: ["🖥️", "🔑"] },
                { name: "Intro Meeting", desc: "Meet the team and get started.", components: ["👥", "📅"] },
            ],
        },
        {
            title: "Summarize Document",
            steps: [
                { name: "Upload File", desc: "Add your document for analysis.", components: ["📤"] },
                { name: "AI Analysis", desc: "Let AI process your document.", components: ["🤖"] },
                { name: "Summary Output", desc: "Get a concise summary.", components: ["📊"] },
            ],
        },
        {
            title: "Product Launch",
            steps: [
                { name: "Create Checklist", desc: "List all launch tasks.", components: ["📝"] },
                { name: "Assign Owners", desc: "Delegate responsibilities.", components: ["👤", "🔗"] },
                { name: "Track Progress", desc: "Monitor completion.", components: ["📈"] },
            ],
        },
    ];

// Types for our data structures
interface Step {
    title: string;
    desc: string;
    type: string;
    icon: React.ReactNode;
    components: {
        icon: React.ReactNode;
        name: string;
        desc: string;
    }[];
}

interface TaskStep {
    name: string;
    desc: string;
    components: string[];
}

interface Task {
    title: string;
    steps: TaskStep[];
}

interface Component {
    icon: string;
    name: string;
    desc: string;
}

interface Feature {
    icon: string;
    title: string;
    desc: string;
}

interface FAQ {
    q: string;
    a: string;
}

function RevealSection({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['0.2 1', '0.8 0'] });
    
    // Enhanced scroll animations
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);
    const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);
    const rotateX = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [15, 0, 0, -15]);
    
    return (
        <motion.div
            ref={ref}
            className={className}
            style={{ 
                ...style, 
                opacity, 
                scale,
                y,
                rotateX,
                transformPerspective: 1000,
                transformOrigin: 'center center'
            }}
            initial={{ opacity: 0, scale: 0.95, y: 50, rotateX: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -50, rotateX: -15 }}
            transition={{ 
                duration: 0.7, 
                ease: [0.4, 0, 0.2, 1],
                opacity: { duration: 0.5 },
                scale: { duration: 0.5 },
                y: { duration: 0.5 },
                rotateX: { duration: 0.5 }
            }}
        >
            {children}
        </motion.div>
    );
}

// Hero Section Component
function HeroSection() {
    // Example code blocks for the hero
    const codeBlocks = [
        {
            code: `{
  "title": "Onboard New Employee",
  "steps": [
    { "name": "Collect Documents" },
    { "name": "Setup Workspace" },
    { "name": "Intro Meeting" }
  ]
}`,
            filename: 'task.json',
        },
        {
            code: `{
  "title": "Summarize Document",
  "steps": [
    { "name": "Upload File" },
    { "name": "AI Analysis" },
    { "name": "Summary Output" }
  ]
}`,
            filename: 'task.json',
        },
        {
            code: `{
  "title": "Product Launch",
  "steps": [
    { "name": "Create Checklist" },
    { "name": "Assign Owners" },
    { "name": "Track Progress" }
  ]
}`,
            filename: 'task.json',
        },
    ];
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden font-sans">
            {/* Blue background image */}
            <Image
                src="/hero.png"
                alt="Hero background"
                className="absolute inset-0 w-full h-full object-cover object-center z-0"
                style={{ filter: 'brightness(1) blur(0px)' }}
                layout='responsive'
                width={1920}
                height={1080}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-100/80 via-blue-200/60 to-transparent z-10" />
            {/* Top nav and logo */}
            <div className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-between pt-8 px-6 md:px-10">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <span className="font-bold text-5xl text-blue-700 tracking-tight" style={{ fontFamily: 'cursive' }}>Tasker</span>
                </div>
                {/* Nav + CTA */}
                <div className="flex items-center gap-6 text-gray-700 text-base font-medium">
                    <a href="#" className="hover:text-blue-700 transition">Abotut Us</a>
                    <a href="#" className="hover:text-blue-700 transition">Contact Us</a>
                    <a href="#" className="hover:text-blue-700 transition">Learn More</a>
                    <a href="/gallery" className="ml-2 px-5 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow hover:scale-105 hover:shadow-blue-200/40 transition-all duration-200">Get Started</a>
                </div>
            </div>
            {/* Main hero content */}
            <div className="relative z-20 w-full max-w-3xl mx-auto flex flex-col items-center justify-center pt-16 pb-0 px-4">
                {/* Headline */}
                <h1 className="text-3xl md:text-5xl font-extrabold text-center mb-4 text-gray-900 leading-tight tracking-tight" style={{ letterSpacing: '-0.01em' }}>
                    Online Assessment &<br className="hidden md:block" />
                    <span className="underline underline-offset-4 decoration-blue-300">Diagnosis of Tasks</span>
                </h1>
                {/* Subheadline */}
                <p className="text-base md:text-lg text-center text-gray-700 mb-7 max-w-2xl mx-auto">
                    Tasker is an online workflow automation service that specialises in modular, AI-powered steps.<br />
                    By combining advanced technology with expert workflow design, we provide an accessible pathway to automation for everyone.
                </p>
                {/* CTA Buttons */}
                <div className="flex flex-row gap-4 justify-center items-center mb-10">
                    <a href="/gallery" className="px-7 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-md hover:scale-105 hover:shadow-blue-200/40 transition-all duration-200">
                        Start Assessment
                    </a>
                    <a href="#how-it-works" className="px-7 py-3 rounded-full font-semibold text-blue-900 bg-white/90 border border-blue-200 shadow hover:bg-blue-50 hover:scale-105 transition-all duration-200">
                        How it Works
                    </a>
                </div>
            </div>
            {/* Code block cards at the bottom (only top 3, moved further down) */}
            <div className="absolute left-1/2 bottom-0 translate-x-[-50%] z-20 w-full max-w-4xl flex justify-center items-end pb-12" style={{ height: '170px' }}>
                <div className="relative flex w-full justify-center items-end" style={{ height: '170px' }}>
                    <div className="absolute left-1/2 -translate-x-[120%] rotate-[-10deg] z-10" style={{ width: 320 }}>
                        <CodeEditorCard {...codeBlocks[0]} className="bg-white/60 backdrop-blur-md border-gray-200 text-gray-900" />
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 rotate-[0deg] z-20" style={{ width: 340 }}>
                        <CodeEditorCard {...codeBlocks[1]} className="bg-white/60 backdrop-blur-md border-gray-200 shadow-xl text-gray-900" />
                    </div>
                    <div className="absolute left-1/2 -translate-x-[-20%] rotate-[10deg] z-10" style={{ width: 320 }}>
                        <CodeEditorCard {...codeBlocks[2]} className="bg-white/60 backdrop-blur-md border-gray-200 text-gray-900" />
                    </div>
                </div>
            </div>
        </section>
    );
}

// What is a Task Section Component
function WhatIsTaskSection({ taskStack }: { taskStack: Task[] }) {
    return (
            <section className="py-24 bg-gradient-to-br from-white to-blue-50">
                <div className="max-w-5xl mx-auto px-4 md:px-8">
                    <h2 className="text-3xl font-bold mb-8 text-center">What is a Task?</h2>
                    <div className="flex flex-col md:flex-row-reverse items-center gap-16">
                    <div className="flex flex-col gap-8">
                            <div className="flex items-center gap-4 w-fit">
                                <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">1</span>
                                <div>
                                    <div className="font-semibold text-lg">A Task is a Workflow</div>
                                    <div className="text-gray-600">It represents your overall goal, like onboarding or document summarization.</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 w-fit">
                                <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">2</span>
                                <div>
                                    <div className="font-semibold text-lg w-fit">Contains Steps</div>
                                    <div className="text-gray-600">Each Task is broken into Steps, making complex work manageable.</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 w-fit">
                                <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">3</span>
                                <div>
                                    <div className="font-semibold text-lg">Steps Have Components</div>
                                    <div className="text-gray-600">Steps are made of Components like inputs, uploads, and AI analysis.</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 w-fit">
                                <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">4</span>
                                <div>
                                    <div className="font-semibold text-lg">Automate & Track</div>
                                    <div className="text-gray-600">Run your Task, track progress, and optimize with AI.</div>
                                </div>
                            </div>
                        </div>
                    <div className="flex items-center justify-center min-w-96">
                        
                        <HeroStack className='min-w-96 translate-y-12 md:translate-y-0 !h-48'>
                           {taskStack.map((task, i) => (
                                    <motion.div
                            key={i}
                                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                        animate={{ opacity: 1, scale: 1, y: 0, zIndex: 2 }}
                                        exit={{ opacity: 0, scale: 0.9, y: -30, zIndex: 2 }}
                                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                            className=" bg-white/30 backdrop-blur-lg border border-white/40 shadow-2xl p-8 rounded-2xl flex flex-col items-start"
                                        style={{ pointerEvents: 'auto' }}
                                    >
                            <div className="font-bold text-lg text-blue-700 mb-4">Task: {task.title}</div>
                                        <ul className="w-full flex flex-col gap-2">
                                {task.steps.map((step, i) => (
                                    <li key={i} className="flex items-center gap-3 bg-white/60 rounded-xl px-4 py-2 shadow border border-blue-100 w-72">
                                                    <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">{i + 1}</span>
                                                    <span className="font-semibold text-gray-800">{step.name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                        ))}
                        </HeroStack>
                    </div>
                    </div>
                </div>
            </section>
    );
}

// What is a Step Section Component
function WhatIsStepSection({ steps }: { steps: Step[] }) {
    return (
            <section className="py-24 bg-gradient-to-br from-orange-50 via-white to-pink-50">
                <div className="max-w-5xl mx-auto px-4 md:px-8">
                    <h2 className="text-3xl font-bold mb-8 text-center">What is a Step?</h2>
                    <div className="flex flex-col md:flex-row items-center gap-16">
                    {/* Left: Numbered List */}
                        <div className="flex-1 flex flex-col gap-10">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-4"
                        >
                            <span className="min-w-10 min-h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-lg">1</span>
                                <div>
                                    <div className="font-semibold text-lg">A Step is a Stage</div>
                                    <div className="text-gray-600">Each Step is a part of your Task, like uploading a file or running AI analysis.</div>
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="flex items-center gap-4"
                        >
                            <span className="min-w-10 min-h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-lg">2</span>
                                <div>
                                    <div className="font-semibold text-lg">Contains Components</div>
                                    <div className="text-gray-600">A Step can have one or more Components, like inputs, uploads, or AI.</div>
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex items-center gap-4"
                        >
                            <span className="min-w-10 min-h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-lg">3</span>
                                <div>
                                    <div className="font-semibold text-lg">Drives Progress</div>
                                    <div className="text-gray-600">Completing Steps moves your Task forward.</div>
                                </div>
                        </motion.div>
                            </div>
                    {/* Right: Card Stack */}
                    <HeroStack className='w-96 h-[30rem]'>

                        {
                            steps.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className={`flex items-center gap-4 px-6 py-7 flex-col border-b border-blue-50 h-[26rem] rounded-xl`}
                                    style={{ background: 'rgba(255,255,255,0.95)' }}
                                >
                                    <div>
                                        <div className="font-bold text-xl text-gray-900 mb-1">{step.title}</div>
                                        <div className="text-gray-500 text-sm">{step.desc}</div>
                        </div>
                                    {
                                        step.components.map((comp, j) => (
                                            <HeroComponentPreview
                                                key={j}
                                                icon={comp.icon}
                                                name={comp.name}
                                                desc={comp.desc}
                                                className='w-96'
                                            />
                                        ))
                                    }
                                    
                                </motion.div>
                            ))
                        }
                            </HeroStack>
                    </div>
                </div>
            </section>
    );
}

// What is a Component Section Component (now with How It Works content)
function WhatIsComponentSection({ steps }: { steps: Step[] }) {
    return (
        <section className="py-24 bg-gradient-to-br from-pink-50 via-white to-orange-50">
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center">What is a Component?</h2>
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 flex flex-col gap-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-4"
                        >
                            <span className="min-w-10 min-h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-lg">1</span>
                            <div>
                                <div className="font-semibold text-lg">Building Block</div>
                                <div className="text-gray-600">A Component is a fundamental building block of a Step, like a text input, file upload, or AI analysis.</div>
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="flex items-center gap-4"
                        >
                            <span className="min-w-10 min-h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-lg">2</span>
                            <div>
                                <div className="font-semibold text-lg">Mix & Match</div>
                                <div className="text-gray-600">Combine different Components to create powerful and flexible workflows.</div>
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex items-center gap-4"
                        >
                            <span className="min-w-10 min-h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-lg">3</span>
                            <div>
                                <div className="font-semibold text-lg">AI-Powered</div>
                                <div className="text-gray-600">Many Components leverage AI to make your workflows smarter and more efficient.</div>
                            </div>
                    </motion.div>
                    </div>
                    <HeroStack className='w-96 h-48'>
                        {steps.map((step, i) => (
                            <HeroComponentPreview
                                key={i}
                                icon={step.icon}
                                name={step.title}
                                desc={step.desc}
                                className='w-96'
                            />
                        ))}
                    </HeroStack>
                </div>
                </div>
            </section>
    );
}

// Component Gallery Section Component
function ComponentGallerySection({ componentGallery }: { componentGallery: Component[] }) {
    return (
            <section className="py-24 bg-gradient-to-br from-white to-blue-50">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-12 text-center">Component Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {componentGallery.map((c, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                            className="bg-white/70 backdrop-blur-lg border border-blue-100 rounded-2xl shadow-lg p-8 flex flex-col items-center hover:shadow-xl hover:scale-[1.02] transition-all"
                        >
                            <span className="text-4xl mb-4">{c.icon}</span>
                            <div className="font-bold text-xl mb-2">{c.name}</div>
                            <div className="text-gray-600 text-center">{c.desc}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
    );
}

// Feature Highlights Section Component
function FeatureHighlightsSection({ features }: { features: Feature[] }) {
    return (
            <section className="py-24 bg-white/80">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-12 text-center">Why Tasker?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((f, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                            className="bg-white/80 backdrop-blur-lg border border-blue-100 rounded-2xl shadow-lg p-8 flex flex-col items-center hover:shadow-xl hover:scale-[1.02] transition-all"
                        >
                            <span className="text-4xl mb-4">{f.icon}</span>
                            <div className="font-bold text-xl mb-2">{f.title}</div>
                            <div className="text-gray-600 text-center">{f.desc}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
    );
}

function HorizontalAccordion({ faqs }: { faqs: FAQ[] }) {
    const [active, setActive] = useState(0);
    return (
        <section className="py-24 bg-gradient-to-br from-slate-50 to-slate-100 w-full">
                            <h2 className="text-3xl font-bold mb-12 text-center">FAQ</h2>

            <div className="w-full mx-auto flex flex-col md:flex-row gap-0 md:gap-8 px-2 md:px-16 ">
                {/* Horizontal Accordion (Desktop) */}
                <div className="hidden md:flex w-full h-[380px] items-stretch justify-center gap-2">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className={`flex flex-col items-center justify-center border ${active == i?"grow":""} border-slate-50 bg-white shadow-2xl ${active === i ? 'z-10' : 'z-0'}`}
                            style={{
                                width: active === i ? 'unset' : '70px',
                                minWidth: active === i ? '380px' : '70px',
                                marginRight: i !== faqs.length - 1 ? '-1px' : 0,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                position: 'relative',
                            }}
                            onClick={() => setActive(i)}
                        >
                            {/* Glossy highlight overlay */}
                            <div className="absolute top-0 left-0 w-full h-1/3 pointer-events-none" style={{ background: 'linear-gradient(90deg,rgba(255,255,255,0.55) 0%,rgba(255,255,255,0.15) 100%)', zIndex: 2 }} />
                            {active === i ? (
                                <div className="w-full h-full flex flex-col justify-center px-10 py-10 text-left bg-white">
                                    <div className="text-2xl font-bold text-slate-800 mb-4 whitespace-normal">{faq.q}</div>
                                    <div className="text-gray-800 text-lg whitespace-normal">{faq.a}</div>
                                </div>
                            ) : (
                                <div
                                    className={`flex-1 flex items-center justify-center px-2 py-4 select-none font-bold text-xl text-slate-800 hover:text-slate-700`}
                                    style={{
                                        writingMode: 'vertical-rl',
                                        textOrientation: 'mixed',
                                        letterSpacing: '0.05em',
                                        height: '100%',
                                        minHeight: '220px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {faq.q}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {/* Accordion (Mobile) */}
                <div className="flex flex-col gap-2 w-full md:hidden">
                    {faqs.map((faq, i) => (
                        <div key={i} className="rounded-xl bg-white border border-blue-400 overflow-hidden">
                            <button
                                onClick={() => setActive(active === i ? -1 : i)}
                                className={`w-full text-left px-6 py-4 font-semibold text-blue-700 focus:outline-none flex justify-between items-center`}
                            >
                                {faq.q}
                                <span className={`ml-2 transition-transform ${active === i ? 'rotate-90' : ''}`}>▶</span>
                            </button>
                            <div
                                className="px-6 pb-4 text-gray-700 text-base overflow-hidden"
                                style={{ display: active === i ? 'block' : 'none' }}
                            >
                                {faq.a}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 text-gray-900">
            <RevealSection><HeroSection /></RevealSection>
            <RevealSection><WhatIsTaskSection taskStack={taskStack} /></RevealSection>
            <RevealSection><WhatIsStepSection steps={steps} /></RevealSection>
            <RevealSection><WhatIsComponentSection steps={steps} /></RevealSection>
            <RevealSection><ComponentGallerySection componentGallery={componentGallery} /></RevealSection>
            <RevealSection><FeatureHighlightsSection features={features} /></RevealSection>
            <RevealSection><HorizontalAccordion faqs={faqs} /></RevealSection>
            <RevealSection><CallToActionSection /></RevealSection>
        </main>
    );
}



// Call to Action Section Component
function CallToActionSection() {
    return (
        <section className="py-24 bg-gradient-to-r from-blue-600 to-teal-500 text-white">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold mb-6"
                >
                    Ready to Transform Your Workflow?
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-xl mb-10 text-blue-100"
                >
                    Join thousands of users who have revolutionized their productivity with Tasker.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Link 
                        href="/gallery" 
                        className="inline-block px-10 py-5 rounded-2xl font-semibold text-blue-700 bg-white/90 hover:bg-white shadow-xl hover:scale-105 transition"
                    >
                        Get Started Now
                    </Link>
                </motion.div>
                </div>
            </section>
    );
}

