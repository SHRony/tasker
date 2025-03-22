// TASK TYPES

export interface Task {
    id: string;
    title: string;
    description: string;
    steps: Step[];
}
export interface Step {
    id: string;
    title: string;
    description: string;
    components: Component[];
    actions: Action[];
}

//task components
export type Component = TextComponent | FileUploadComponent | InputComponent | TextAreaComponent;

export type TextComponent = {
    id: string;
    name: string;
    type: "text";
    text: string;
}

export type FileUploadComponent = {
    id: string;
    name: string;
    type: "file-upload";
    minFiles: number;
    maxFiles: number;
    maxFileSize: number;
    acceptedFileTypes: string[];
}

export type InputComponent = {
    id: string;
    name: string;
    type: "input";
    placeholder: string;
    required: boolean;
}

export type TextAreaComponent = {
    id: string;
    name: string;
    type: "textarea";
    placeholder: string;
    required: boolean;
}
// task actions
export type Action = AIAnalysisAction | WebSearchAction;
export type AIAnalysisAction = {
    id: string;
    name: string;
    type: "ai-analysis";
    prompt: string;
}

export type WebSearchAction = {
    id: string;
    name: string;
    type: "web-search";
    query: string;
}













// Response types for AI actions
export type AIResponse = {
    content: string;
    functionCall?: {
        name: string;
        arguments: string;
    };
    error?: string;
}