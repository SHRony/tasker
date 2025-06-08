'use client';

import React, { useState, useCallback } from 'react';
import { Task, Step } from '../../types/component_schema';
import { sampleTasks } from '../../data/sampleTasks';
import { Steps } from 'antd';
import 'antd/dist/reset.css';
import { TextInputExecutor } from '../../components/executors/TextInputExecutor';
import { TextExecutor } from '../../components/executors/TextExecutor';
import { AiAnalysisExecutor } from '../../components/executors/AiAnalysisExecutor';
import { RecordsProvider } from '../../contexts/RecordsContext';

function isValidTaskJson(str: string): Task | null {
    try {
        const obj = JSON.parse(str);
        if (obj && obj.name && obj.steps && Array.isArray(obj.steps)) {
            return obj as Task;
        }
    } catch {}
    return null;
}

export default function Gallery() {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [customJson, setCustomJson] = useState('');
    const [jsonError, setJsonError] = useState('');
    const [copiedTaskId, setCopiedTaskId] = useState<string | null>(null);

    // Copy task JSON to clipboard
    const handleCopy = async (task: Task) => {
        await navigator.clipboard.writeText(JSON.stringify(task, null, 2));
        setCopiedTaskId(task.id);
        setTimeout(() => setCopiedTaskId(null), 1200);
    };

    // Execute custom JSON
    const handleExecuteCustom = () => {
        const parsed = isValidTaskJson(customJson);
        if (parsed) {
            setSelectedTask(parsed);
            setJsonError('');
        } else {
            setJsonError('Invalid Task JSON');
        }
    };

    // Execute from gallery
    const handleSelectTask = (task: Task) => {
        setSelectedTask(task);
        setJsonError('');
    };
    if(selectedTask) {
        return <TaskExecutor task={selectedTask} />;
    }

    return (
        <main className="min-h-screen h-screen flex flex-col items-center bg-white">
            {/* Header at the very top */}
            <div className="w-full px-4 pt-12 pb-4 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1677ff]    ">
                    Task Gallery
                </h1>
                <p className="mt-2 text-lg md:text-xl font-medium max-w-2xl mx-auto text-slate-600">
                    Browse, copy, or run a sample task. Or paste your own JSON below!
                </p>
            </div>
            {/* Gallery UI */}
            <div className="w-full max-w-4xl px-4 flex flex-col md:flex-row gap-8 mb-10">
                {/* Task List */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="font-semibold text-[#1976d2] text-lg mb-2">Sample Tasks</div>
                    {sampleTasks.map(task => (
                        <div
                            key={task.id}
                            className={`rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between cursor-pointer hover:shadow-md transition bg-white ${selectedTask?.id === task.id ? 'ring-2 ring-[#1976d2]/60' : ''}`}
                            onClick={() => handleSelectTask(task)}
                        >
                            <div>
                                <div className="font-bold text-[#1976d2] text-lg">{task.name}</div>
                                <div className="text-slate-600 text-sm max-w-xs">{task.description}</div>
                            </div>
                            <button
                                className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium border border-[#1976d2] text-[#1976d2] bg-white hover:bg-[#1976d2] hover:text-white transition ${copiedTaskId === task.id ? 'bg-[#1976d2] text-white' : ''}`}
                                onClick={e => { e.stopPropagation(); handleCopy(task); }}
                            >
                                {copiedTaskId === task.id ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    ))}
                </div>
                {/* Custom JSON Input */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="font-semibold text-[#1976d2] text-lg mb-2">Custom Task JSON</div>
                    <textarea
                        className="w-full min-h-[160px] rounded-lg border border-slate-200 p-3 font-mono text-sm focus:ring-2 focus:ring-[#1976d2]/30 focus:outline-none"
                        placeholder="Paste or write a Task JSON here..."
                        value={customJson}
                        onChange={e => setCustomJson(e.target.value)}
                    />
                    {jsonError && <div className="text-red-600 text-sm">{jsonError}</div>}
                    <button
                        className="self-end px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-[#1976d2] to-[#1677ff] shadow hover:scale-105 transition"
                        onClick={handleExecuteCustom}
                    >
                        Execute
                    </button>
                </div>
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

    // Memoize getRecords so it only changes when records changes
    const getRecords = useCallback(
        (key: string) => records[key],
        [records]
    );

    return (
        <RecordsProvider getRecords={getRecords}>
            <div className="w-full mx-auto py-0 flex flex-col gap-0 px-12">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight text-[#1677ff]">{task.name}</h1>
                    <p className="mb-8 text-slate-600 text-lg font-medium">{task.description}</p>
                </div>
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

    // Debug: Log props and state on every render
    console.log('[StepExecutor] render', {
        step,
        onStepComplete,
        records,
        readyMap,
        isStepReady: step.components.every(comp => readyMap[comp.id]),
    });

    // Log when component mounts and when step or its components change
    React.useEffect(() => {
        console.log('[StepExecutor] mounted or step/components changed', { step, components: step.components });
    }, [step, step.components]);

    // Log when records or readyMap change
    React.useEffect(() => {
        console.log('[StepExecutor] records changed', records);
    }, [records]);
    React.useEffect(() => {
        console.log('[StepExecutor] readyMap changed', readyMap);
    }, [readyMap]);

    const putRecord = (key: string, value: string) => {
        if(records[key] !== value) {
            setRecords(prev => {
                const newRecords = { ...prev };
                newRecords[key] = value;
                console.log('[StepExecutor] putRecord', { key, value, newRecords });
                return newRecords;
            });
        }
    };

    const setReady = (componentId: string, ready: boolean) => {
        if(readyMap[componentId] !== ready) {
            setReadyMap(prev => {
                const newReadyMap = { ...prev, [componentId]: ready };
                console.log('[StepExecutor] setReady', { componentId, ready, newReadyMap });
                return newReadyMap;
            });
        }
    };

    const isStepReady = step.components.every(comp => readyMap[comp.id]);
    React.useEffect(() => {
        console.log('[StepExecutor] isStepReady changed', isStepReady);
    }, [isStepReady]);
    
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