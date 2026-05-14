// Shared TypeScript types matching backend contract types
import type { RiskLevel as BackendRiskLevel } from "@/backend";

export type { RiskLevel } from "@/backend";
export type {
  AnalysisResult,
  AnalysisResponse,
  SuspiciousSentence,
  Citation,
} from "@/backend";

// Re-export the enum values for convenience
export { RiskLevel as RiskLevelEnum } from "@/backend";

// UI-level types
export interface AnalysisState {
  result: import("@/backend").AnalysisResult | null;
  inputText: string;
  isLoading: boolean;
  error: string | null;
}
