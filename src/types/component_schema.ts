
export type Task = {
    id: string;
    name: string;
    description: string;
    steps: Step[];
}

export type Step = {
    id: string;
    name: string;
    description: string;
    components: Component[];
}

export type Component = ActionComponent | DisplayComponent | InteractionComponent;

export type ActionComponent = AiAnalysisComponent;
export type DisplayComponent = TextComponent;
export type InteractionComponent = TextInputComponent;

export type AiAnalysisComponent = {
    id: string;
    name: string;
    type: "ai-analysis";
    prompt: string;
}

export type TextComponent = {
    id: string;
    name: string;
    type: "text";
    text: string;
}

export type TextInputComponent = {
    id: string;
    name: string;
    type: "text-input";
    placeholder: string;
    required: boolean;
}

// export type TextComponent = {
//     id: string;
//     name: string;
//     type: "text";
//     text: string;
// }

// export type FileUploadComponent = {
//     id: string;
//     name: string;
//     type: "file-upload";
//     minFiles: number;
//     maxFiles: number;
//     maxFileSize: number;
//     acceptedFileTypes: string[];
// }

// export type InputComponent = {
//     id: string;
//     name: string;
//     type: "input";
//     placeholder: string;
//     required: boolean;
// }

// export type TextAreaComponent = {
//     id: string;
//     name: string;
//     type: "textarea";
//     placeholder: string;
//     required: boolean;
// }

// export type AIAnalysisAction = {
//     id: string;
//     name: string;
//     type: "ai-analysis";
//     prompt: string;
// }

// export type WebSearchAction = {
//     id: string;
//     name: string;
//     type: "web-search";
//     query: string;
// }

// export type Component = TextComponent | FileUploadComponent | InputComponent | TextAreaComponent | AIAnalysisAction | WebSearchAction;

// export interface Step {
//     id: string;
//     title: string;
//     description: string;
//     components: Component[];
// }

// export interface Task {
//     id: string;
//     title: string;
//     description: string;
//     steps: Step[];
// }

// export type Action = AIAnalysisAction | WebSearchAction;

// // Response types for AI actions
// export type AIResponse = {
//     content: string;
//     functionCall?: {
//         name: string;
//         arguments: string;
//     };
//     error?: string;
// }

// export interface ProcessedFile {
//     name: string;
//     text: string;
// } 