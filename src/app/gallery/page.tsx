'use client';

import React, { useState } from 'react';
import { Task, Step } from '../../types/component_schema';
import { sampleTasks } from '../../data/sampleTasks';
import { Steps } from 'antd';
import 'antd/dist/reset.css';
import { TextInputExecutor } from '../../components/executors/TextInputExecutor';
import { TextExecutor } from '../../components/executors/TextExecutor';
import { AiAnalysisExecutor } from '../../components/executors/AiAnalysisExecutor';
import { RecordsProvider } from '../../contexts/RecordsContext';

// Main Page Component
export default function Gallery() {
    const [selectedTask] = useState<Task>(sampleTasks[0]);

    return (
        <main className="min-h-screen h-screen flex flex-col items-center bg-white">
            {/* Header at the very top */}
            <div className="w-full px-4 pt-12 pb-4 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1677ff]    ">
                    {selectedTask.name}
                </h1>
                <p className="mt-2 text-lg md:text-xl font-medium max-w-2xl mx-auto text-slate-600">
                    {selectedTask.description}
                </p>
            </div>
            {/* Main content card below */}
            <div className="w-full px-4">
                <TaskExecutor task={selectedTask} />
            </div>
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
            <div className="w-full mx-auto px-0 py-0 flex flex-col gap-0">
                {/* Steps Progress */}
                <div className="mb-8">
                    <Steps
                        current={currentStepIndex}
                        items={task.steps.map(step => ({ title: step.name }))}
                        className="custom-steps"
                    />
                </div>
                {/* Main Content Area */}
                <div className="shadow-md rounded-xl bg-white p-8">
                    <StepExecutor
                        step={task.steps[currentStepIndex]}
                        onStepComplete={handleStepComplete}
                    />
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
            <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight text-[#1677ff]">{step.name}</h2>
            <p className="mb-8 text-slate-600 text-lg font-medium">{step.description}</p>

            <div className="space-y-8">
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
                <div className="mt-10 flex justify-end">
                    <button
                        onClick={() => onStepComplete(records)}
                        className="px-8 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 shadow-xl hover:scale-105 hover:shadow-blue-200/40 transition-all duration-200 text-lg tracking-wide"
                    >
                        Continue
                    </button>
                </div>
            )}
        </div>
    );
}; 