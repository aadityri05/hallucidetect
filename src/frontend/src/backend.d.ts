import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type AnalysisResponse = {
    __kind__: "ok";
    ok: AnalysisResult;
} | {
    __kind__: "err";
    err: string;
};
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Citation {
    citationText: string;
    explanation: string;
    isFake: boolean;
}
export interface SuspiciousSentence {
    sentence: string;
    confidence: bigint;
    riskLevel: RiskLevel;
}
export interface AnalysisResult {
    suspiciousSentences: Array<SuspiciousSentence>;
    trustScore: bigint;
    overallConfidence: bigint;
    analysisExplanation: string;
    citations: Array<Citation>;
    riskLevel: RiskLevel;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export enum RiskLevel {
    Low = "Low",
    High = "High",
    Medium = "Medium"
}
export interface backendInterface {
    analyzeForHallucination(text: string): Promise<AnalysisResponse>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
