'use client';

import React, { useState } from 'react';
import { Task, Step } from '../types/component_schema';
import { sampleTasks } from '../data/sampleTasks';
import { Steps } from 'antd';
import 'antd/dist/reset.css';
import { TextInputExecutor } from '../components/executors/TextInputExecutor';
import { TextExecutor } from '../components/executors/TextExecutor';
import { AiAnalysisExecutor } from '../components/executors/AiAnalysisExecutor';
import { RecordsProvider } from '../contexts/RecordsContext';
import "./globals.css";

// Main Page Component
export default function Home() {
    const [selectedTask] = useState<Task>(sampleTasks[0]);

    return (
        <main className="min-h-screen h-screen flex items-stretch bg-blue-50">
            <TaskExecutor task={selectedTask} />
        </main>
    );
}

// Main Task Executor Component
const TaskExecutor: React.FC<{ task: Task }> = ({ task }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [records, setRecords] = useState<Record<string, string>>({});

    const handleStepComplete = (newRecords: Record<string, string>) => {
        setRecords(prev => ({ ...prev, ...newRecords }));
        if (currentStepIndex < task.steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    const getRecords = (key: string): string | undefined => {
        return records[key];
    };

    return (
        <RecordsProvider getRecords={getRecords}>
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header Section */}
                <div className="flex-none bg-blue-600 text-white px-12 py-8">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-4xl font-bold">
                            {task.name}
                        </h1>
                        <p className="mt-3 text-lg text-blue-100">{task.description}</p>
                    </div>
                </div>

                {/* Steps Progress */}
                <div className="flex-none bg-white border-b border-blue-100 px-12 py-6">
                    <div className="max-w-6xl mx-auto">
                        <Steps
                            current={currentStepIndex}
                            items={task.steps.map(step => ({ title: step.name }))}
                            className="custom-steps"
                        />
                    </div>
                </div>

                {/* Main Content Area - Scrollable */}
                <div className="flex-1 overflow-y-auto bg-blue-50/50">
                    <div className="max-w-6xl mx-auto px-12 py-10">
                        <div className="bg-white rounded-2xl p-10 shadow-lg">
                            <StepExecutor
                                step={task.steps[currentStepIndex]}
                                onStepComplete={handleStepComplete}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </RecordsProvider>
    );
};

// Step Executor Component
interface StepExecutorProps {
    step: Step;
    onStepComplete: (newRecords: Record<string, string>) => void;
}

const StepExecutor: React.FC<StepExecutorProps> = ({ step, onStepComplete }) => {
    const [records, setRecords] = useState<Record<string, string>>({});
    const [readyMap, setReadyMap] = useState<Record<string, boolean>>({});

    const putRecord = (key: string, value: string) => {
        setRecords(prev => {
            const newRecords = { ...prev };
            newRecords[key] = value;
            return newRecords;
        });
    };

    const setReady = (componentId: string, ready: boolean) => {
        setReadyMap(prev => ({ ...prev, [componentId]: ready }));
    };

    const isStepReady = step.components.every(comp => readyMap[comp.id]);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{step.name}</h2>
            <p className="mb-6 text-gray-600">{step.description}</p>

            <div className="space-y-6">
                {step.components.map(component => {
                    switch (component.type) {
                        case 'text-input':
                            return (
                                <TextInputExecutor
                                    key={component.id}
                                    component={component}
                                    putRecord={putRecord}
                                    setReady={(ready: boolean) => setReady(component.id, ready)}
                                />
                            );
                        case 'text':
                            return (
                                <TextExecutor
                                    key={component.id}
                                    component={component}
                                />
                            );
                        case 'ai-analysis':
                            return (
                                <AiAnalysisExecutor
                                    key={component.id}
                                    component={component}
                                    putRecord={putRecord}
                                    setReady={(ready: boolean) => setReady(component.id, ready)}
                                />
                            );
                        default:
                            return null;
                    }
                })}
            </div>

            {isStepReady && (
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={() => onStepComplete(records)}
                        className="px-6 py-2.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        Continue
                    </button>
                </div>
            )}
        </div>
    );
};

