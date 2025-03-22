'use client';

import React, { createContext, useContext, useReducer, useState } from 'react';
import { Task, Step, Component, FileUploadComponent, InputComponent, TextAreaComponent, TextComponent, AIAnalysisAction } from '../types/types';
import { sampleTasks } from '../data/sampleTasks';
import { generateResponse } from '../lib/ai';

// Context Types
interface TaskState {
    task: Task | null;
    currentStepIndex: number;
    componentData: Record<string, any>;
    actionResults: Record<string, string>;
    actionLoading: Record<string, boolean>;
    stepActionStatus: Record<string, 'pending' | 'loading' | 'completed' | 'error'>;
    fileProcessingStatus: Record<string, boolean>;
}

type TaskAction =
    | { type: 'SET_TASK'; payload: Task }
    | { type: 'CLEAR_TASK' }
    | { type: 'NEXT_STEP' }
    | { type: 'PREVIOUS_STEP' }
    | { type: 'SET_COMPONENT_DATA'; payload: { componentId: string; data: any } }
    | { type: 'SET_ACTION_RESULT'; payload: { actionId: string; result: string } }
    | { type: 'SET_ACTION_LOADING'; payload: { actionId: string; loading: boolean } }
    | { type: 'SET_STEP_ACTION_STATUS'; payload: { stepId: string; status: 'pending' | 'loading' | 'completed' | 'error' } }
    | { type: 'SET_FILE_PROCESSING'; payload: { componentId: string; processing: boolean } };

// Initial State
const initialState: TaskState = {
    task: null,
    currentStepIndex: 0,
    componentData: {},
    actionResults: {},
    actionLoading: {},
    stepActionStatus: {},
    fileProcessingStatus: {}
};

// Context Creation
const TaskContext = createContext<{
    state: TaskState;
    dispatch: React.Dispatch<TaskAction>;
    executeStepActions: (stepId: string) => Promise<boolean>;
} | null>(null);

// Add interface for processed file data
interface ProcessedFile {
    name: string;
    text: string;
}

// Utility function to extract text from files
async function getTextFromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target?.result as string);
        };
        reader.onerror = (e) => {
            reject(new Error('Failed to read file'));
        };
        reader.readAsText(file);
    });
}

// Utility function for variable interpolation
function interpolateVariables(text: string, state: TaskState): string {
    return text.replace(/\${([^}]+)}/g, (match, componentId) => {
        // Check if this is a component result
        if (state.actionResults[componentId]) {
            return state.actionResults[componentId];
        }
        // Check if this is component data
        if (state.componentData[componentId]) {
            const data = state.componentData[componentId];
            // Handle ProcessedFile arrays
            if (Array.isArray(data) && data.length > 0 && 'text' in data[0]) {
                return (data as ProcessedFile[]).map(file => file.text).join('\n\n');
            }
            // Handle other component data
            return data;
        }
        return 'Waiting for data...';
    });
}

// Reducer
function taskReducer(state: TaskState, action: TaskAction): TaskState {
    switch (action.type) {
        case 'SET_TASK':
            return {
                ...state,
                task: action.payload,
                currentStepIndex: 0,
                componentData: {},
                actionResults: {},
                actionLoading: {},
                stepActionStatus: {},
                fileProcessingStatus: {}
            };
        case 'CLEAR_TASK':
            return initialState;
        case 'NEXT_STEP':
            return {
                ...state,
                currentStepIndex: state.task 
                    ? Math.min(state.currentStepIndex + 1, state.task.steps.length - 1)
                    : 0
            };
        case 'PREVIOUS_STEP':
            return {
                ...state,
                currentStepIndex: Math.max(0, state.currentStepIndex - 1)
            };
        case 'SET_COMPONENT_DATA':
            return {
                ...state,
                componentData: {
                    ...state.componentData,
                    [action.payload.componentId]: action.payload.data
                }
            };
        case 'SET_ACTION_RESULT':
            return {
                ...state,
                actionResults: {
                    ...state.actionResults,
                    [action.payload.actionId]: action.payload.result
                }
            };
        case 'SET_ACTION_LOADING':
            return {
                ...state,
                actionLoading: {
                    ...state.actionLoading,
                    [action.payload.actionId]: action.payload.loading
                }
            };
        case 'SET_STEP_ACTION_STATUS':
            return {
                ...state,
                stepActionStatus: {
                    ...state.stepActionStatus,
                    [action.payload.stepId]: action.payload.status
                }
            };
        case 'SET_FILE_PROCESSING':
            return {
                ...state,
                fileProcessingStatus: {
                    ...state.fileProcessingStatus,
                    [action.payload.componentId]: action.payload.processing
                }
            };
        default:
            return state;
    }
}

// Context Provider
function TaskProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(taskReducer, initialState);

    const executeStepActions = async (stepId: string): Promise<boolean> => {
        const step = state.task?.steps.find(s => s.id === stepId);
        if (!step) return false;

        // Check if any files are still processing
        const hasProcessingFiles = Object.values(state.fileProcessingStatus).some(status => status);
        if (hasProcessingFiles) {
            console.error('Cannot proceed while files are still processing');
            return false;
        }

        dispatch({ 
            type: 'SET_STEP_ACTION_STATUS', 
            payload: { stepId, status: 'loading' } 
        });

        try {
            // Get all AI analysis actions in this step
            const aiActions = step.components.filter(
                (c): c is AIAnalysisAction => c.type === 'ai-analysis'
            );

            // Execute each AI action
            for (const action of aiActions) {
                dispatch({ 
                    type: 'SET_ACTION_LOADING', 
                    payload: { actionId: action.id, loading: true } 
                });

                try {
                    // Get relevant data from previous steps if needed
                    const uploadedFiles = Object.entries(state.componentData)
                        .filter(([id]) => id.includes('file-upload'))
                        .map(([, data]) => data);

                    // Prepare the prompt with context and interpolate variables
                    let contextualPrompt = interpolateVariables(action.prompt, state);
                    if (uploadedFiles.length > 0) {
                        contextualPrompt += `\nAnalyzing ${uploadedFiles.length} uploaded files: ${uploadedFiles.map((file: File) => file.name).join(', ')}`;
                    }

                    // Get input data from previous steps
                    const inputData = Object.entries(state.componentData)
                        .filter(([id]) => id.includes('input') || id.includes('textarea'))
                        .reduce((acc, [id, value]) => ({ ...acc, [id]: value }), {});

                    if (Object.keys(inputData).length > 0) {
                        contextualPrompt += `\n\nContext from previous inputs:\n${JSON.stringify(inputData, null, 2)}`;
                    }

                    // Define the response schema for structured output
                    const responseSchema = {
                        summary: "A brief summary of the analysis",
                        keyFindings: ["Array of key findings"],
                        recommendations: ["Array of recommendations"],
                        nextSteps: ["Array of suggested next steps"],
                        confidence: "Number between 0 and 1 indicating confidence in the analysis"
                    };

                    // Call the AI
                    const result = await generateResponse(contextualPrompt, responseSchema, {
                        temperature: 0.7,
                        maxTokens: 2048,
                        topP: 0.8,
                        topK: 40
                    });

                    // Parse the result
                    let formattedResult: string;
                    try {
                        const parsedResult = JSON.parse(result);
                        if (parsedResult.error) {
                            throw new Error(parsedResult.error);
                        }
                        formattedResult = `Analysis Results:

Summary:
${parsedResult.summary}

Key Findings:
${parsedResult.keyFindings.map((finding: string, i: number) => `${i + 1}. ${finding}`).join('\n')}

Recommendations:
${parsedResult.recommendations.map((rec: string, i: number) => `${i + 1}. ${rec}`).join('\n')}

Next Steps:
${parsedResult.nextSteps.map((step: string, i: number) => `${i + 1}. ${step}`).join('\n')}

Confidence Score: ${(parsedResult.confidence * 100).toFixed(1)}%`;
                    } catch (error) {
                        // If parsing fails, use the raw result
                        formattedResult = result;
                    }

                    dispatch({ 
                        type: 'SET_ACTION_RESULT', 
                        payload: { actionId: action.id, result: formattedResult } 
                    });
                } finally {
                    dispatch({ 
                        type: 'SET_ACTION_LOADING', 
                        payload: { actionId: action.id, loading: false } 
                    });
                }
            }

            dispatch({ 
                type: 'SET_STEP_ACTION_STATUS', 
                payload: { stepId, status: 'completed' } 
            });
            return true;
        } catch (error) {
            console.error('Error executing step actions:', error);
            dispatch({ 
                type: 'SET_STEP_ACTION_STATUS', 
                payload: { stepId, status: 'error' } 
            });
            return false;
        }
    };

    return (
        <TaskContext.Provider value={{ state, dispatch, executeStepActions }}>
            {children}
        </TaskContext.Provider>
    );
}

// Custom Hook
function useTask() {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTask must be used within a TaskProvider');
    }
    return context;
}

// Component Implementation
const TaskHome = () => {
    const { state } = useTask();

    return (
        <div className="container mx-auto p-4">
            {!state.task ? <TaskInput /> : <TaskExecutor />}
        </div>
    );
};

const TaskInput = () => {
    const { dispatch } = useTask();
    const [selectedSampleTask, setSelectedSampleTask] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSampleTaskSelect = (taskId: string) => {
        const selectedTask = sampleTasks.find((task: Task) => task.id === taskId);
        if (selectedTask) {
            dispatch({ type: 'SET_TASK', payload: selectedTask });
            setError(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Task Assistant</h1>
                <p className="text-xl text-gray-600">Select a task template to get started</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sampleTasks.map((task: Task) => (
                    <div 
                        key={task.id}
                        onClick={() => handleSampleTaskSelect(task.id)}
                        className={`
                            p-6 rounded-lg border-2 cursor-pointer transition-all duration-200
                            ${selectedSampleTask === task.id 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            }
                        `}
                    >
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
                        <p className="text-gray-600 mb-4">{task.description}</p>
                        <div className="space-y-2">
                            {task.steps.map((step, index) => (
                                <div key={step.id} className="flex items-center text-sm text-gray-500">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-2">
                                        {index + 1}
                                    </div>
                                    {step.title}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    {error}
                </div>
            )}
        </div>
    );
};

const TaskExecutor = () => {
    const { state, dispatch, executeStepActions } = useTask();
    const currentStep = state.task?.steps[state.currentStepIndex];

    const handleNext = async () => {
        if (!currentStep) return;

        const stepStatus = state.stepActionStatus[currentStep.id];
        const hasActions = currentStep.components.some((c: Component) => c.type === 'ai-analysis' || c.type === 'web-search');
        
        // Check if any files are still processing in the current step
        const hasProcessingFiles = currentStep.components.some(
            component => state.fileProcessingStatus[component.id]
        );

        if (hasProcessingFiles) {
            return;
        }

        if (hasActions && stepStatus !== 'completed') {
            const success = await executeStepActions(currentStep.id);
            if (success) {
                dispatch({ type: 'NEXT_STEP' });
            }
        } else {
            dispatch({ type: 'NEXT_STEP' });
        }
    };

    if (!state.task || !currentStep) return null;

    const hasProcessingFiles = currentStep.components.some(
        component => state.fileProcessingStatus[component.id]
    );

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">{state.task.title}</h2>
                <button
                    onClick={() => dispatch({ type: 'CLEAR_TASK' })}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <div className="mb-12">
                <div className="flex items-center justify-between mb-4">
                    {state.task?.steps.map((step: Step, index: number) => (
                        <div key={step.id} className="flex-1 relative">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center
                                ${index === state.currentStepIndex 
                                    ? 'bg-blue-500 text-white' 
                                    : index < state.currentStepIndex
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                }
                                ${index < state.task!.steps.length - 1 ? 'mb-2' : ''}
                            `}>
                                {index < state.currentStepIndex ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    index + 1
                                )}
                            </div>
                            {index < (state.task?.steps.length || 0) - 1 && (
                                <div className={`
                                    absolute top-5 left-10 w-full h-0.5
                                    ${index < state.currentStepIndex ? 'bg-green-500' : 'bg-gray-200'}
                                `} />
                            )}
                            <p className={`
                                text-sm mt-2 font-medium
                                ${index === state.currentStepIndex ? 'text-blue-600' : 'text-gray-500'}
                            `}>
                                {step.title}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{currentStep.title}</h3>
                <p className="text-gray-600 mb-6">{currentStep.description}</p>
                <div className="space-y-6">
                    {currentStep.components.map((component: Component) => (
                        <TaskComponent key={component.id} component={component} />
                    ))}
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <button
                    onClick={() => dispatch({ type: 'PREVIOUS_STEP' })}
                    disabled={state.currentStepIndex === 0 || hasProcessingFiles}
                    className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={
                        state.currentStepIndex === state.task.steps.length - 1 ||
                        state.stepActionStatus[currentStep.id] === 'loading' ||
                        hasProcessingFiles
                    }
                    className="px-6 py-3 rounded-lg bg-blue-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                    {state.stepActionStatus[currentStep.id] === 'loading' || hasProcessingFiles ? (
                        <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>{hasProcessingFiles ? 'Processing Files...' : 'Processing...'}</span>
                        </>
                    ) : (
                        <span>{state.currentStepIndex === state.task.steps.length - 1 ? 'Finish' : 'Next'}</span>
                    )}
                </button>
            </div>
        </div>
    );
};

const TaskStep = ({ step }: { step: Step }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600 mb-4">{step.description}</p>
            <div className="space-y-4">
                {step.components.map((component: Component) => (
                    <TaskComponent key={component.id} component={component} />
                ))}
            </div>
        </div>
    );
};

const TaskComponent = ({ component }: { component: Component }) => {
    switch (component.type) {
        case 'file-upload':
            return <TaskFileUploadComponent component={component as FileUploadComponent} />;
        case 'input':
            return <TaskInputComponent component={component as InputComponent} />;
        case 'textarea':
            return <TaskTextAreaComponent component={component as TextAreaComponent} />;
        case 'text':
            return <TaskTextComponent component={component as TextComponent} />;
        case 'ai-analysis':
            return <TaskActionComponent component={component as AIAnalysisAction} />;
        default:
            return null;
    }
};

const TaskFileUploadComponent = ({ component }: { component: FileUploadComponent }) => {
    const { state, dispatch } = useTask();
    const files = state.componentData[component.id] as (File[] | ProcessedFile[]) | undefined;
    const isProcessing = state.fileProcessingStatus[component.id];

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileArray = Array.from(e.target.files);
            
            // Start processing
            dispatch({
                type: 'SET_FILE_PROCESSING',
                payload: { componentId: component.id, processing: true }
            });

            try {
                // Process all files and extract text
                const fileTexts = await Promise.all(fileArray.map(async (file) => {
                    const text = await getTextFromFile(file);
                    return {
                        name: file.name,
                        text: text
                    } as ProcessedFile;
                }));

                // Update component data with processed text
                dispatch({ 
                    type: 'SET_COMPONENT_DATA', 
                    payload: { 
                        componentId: component.id, 
                        data: fileTexts
                    }
                });
            } catch (error) {
                console.error('Error processing files:', error);
            } finally {
                dispatch({
                    type: 'SET_FILE_PROCESSING',
                    payload: { componentId: component.id, processing: false }
                });
            }
        }
    };

    return (
        <div className="border-2 border-dashed rounded-lg p-6 bg-gray-50">
            <div className="flex flex-col items-center justify-center">
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <input
                    type="file"
                    multiple={component.maxFiles > 1}
                    accept={component.acceptedFileTypes.join(',')}
                    onChange={handleFileChange}
                    className="hidden"
                    id={component.id}
                    disabled={isProcessing}
                />
                <label
                    htmlFor={component.id}
                    className={`
                        px-4 py-2 rounded-lg border-2 cursor-pointer transition-colors
                        ${isProcessing
                            ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                            : 'border-blue-500 text-blue-500 hover:bg-blue-50'
                        }
                    `}
                >
                    {isProcessing ? 'Processing...' : 'Choose Files'}
                </label>
                <p className="text-sm text-gray-500 mt-2">
                    {component.acceptedFileTypes.join(', ')} files accepted
                </p>
            </div>

            {isProcessing && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center text-blue-600">
                        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Extracting text from files...</span>
                    </div>
                </div>
            )}

            {files && files.length > 0 && !isProcessing && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Processed files:</p>
                    <ul className="space-y-2">
                        {files.map((file, index) => (
                            <li key={index} className="flex items-center text-sm">
                                <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-gray-600">{file instanceof File ? file.name : file.name}</span>
                                {!(file instanceof File) && (
                                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs">
                                        Text extracted
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const TaskInputComponent = ({ component }: { component: InputComponent }) => {
    const { state, dispatch } = useTask();
    const value = state.componentData[component.id] as string | undefined;

    return (
        <input
            type="text"
            value={value || ''}
            onChange={(e) => dispatch({
                type: 'SET_COMPONENT_DATA',
                payload: { componentId: component.id, data: e.target.value }
            })}
            placeholder={component.placeholder}
            required={component.required}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
        />
    );
};

const TaskTextAreaComponent = ({ component }: { component: TextAreaComponent }) => {
    const { state, dispatch } = useTask();
    const value = state.componentData[component.id] as string | undefined;

    return (
        <textarea
            value={value || ''}
            onChange={(e) => dispatch({
                type: 'SET_COMPONENT_DATA',
                payload: { componentId: component.id, data: e.target.value }
            })}
            placeholder={component.placeholder}
            required={component.required}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all min-h-[120px]"
        />
    );
};

const TaskTextComponent = ({ component }: { component: TextComponent }) => {
    const { state } = useTask();
    const text = interpolateVariables(component.text, state);

    return (
        <div className="prose max-w-none">
            {text}
        </div>
    );
};

const TaskActionComponent = ({ component }: { component: AIAnalysisAction }) => {
    const { state } = useTask();
    const result = state.actionResults[component.id];
    const loading = state.actionLoading[component.id];

    if (loading) {
        return (
            <div className="p-6 bg-blue-50 rounded-lg">
                <div className="flex items-center text-blue-600">
                    <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="font-medium">Analyzing...</span>
                </div>
            </div>
        );
    }

    if (result) {
        return (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <pre className="whitespace-pre-wrap text-gray-700 font-mono text-sm">{result}</pre>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-gray-500">
            Waiting to start analysis...
        </div>
    );
};

export default function Page() {
    return (
        <TaskProvider>
            <TaskHome />
        </TaskProvider>
    );
}