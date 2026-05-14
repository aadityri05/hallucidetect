import { createActor } from "@/backend";
import type { AnalysisResult } from "@/backend";
import { RiskLevel } from "@/backend";
import { useAnalysisStore } from "@/store/analysisStore";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";

export function useAnalysis() {
  const { actor, isFetching } = useActor(createActor);
  const setResult = useAnalysisStore((s) => s.setResult);
  const clearResult = useAnalysisStore((s) => s.clearResult);

  const mutation = useMutation<AnalysisResult, Error, string>({
    mutationFn: async (text: string): Promise<AnalysisResult> => {
      if (!actor) throw new Error("Backend not ready. Please try again.");
      const response = await actor.analyzeForHallucination(text);
      if (response.__kind__ === "err") {
        throw new Error(response.err);
      }
      return response.ok;
    },
    onSuccess: (result, inputText) => {
      setResult(result, inputText);
    },
  });

  return {
    analyze: mutation.mutate,
    analyzeAsync: mutation.mutateAsync,
    isLoading: mutation.isPending || isFetching,
    error: mutation.error?.message ?? null,
    isActorReady: !!actor && !isFetching,
    reset: () => {
      mutation.reset();
      clearResult();
    },
    // Expose a mock for development/demo when no backend is connected
    analyzeMock: (text: string) => {
      const mockResult: AnalysisResult = {
        trustScore: BigInt(72),
        riskLevel: RiskLevel.Medium,
        overallConfidence: BigInt(85),
        analysisExplanation:
          "The text contains several unverifiable claims and references to studies without proper citations. Semantic analysis detected moderate inconsistency patterns typical of AI hallucination.",
        suspiciousSentences: [
          {
            sentence: text.split(".")[0] ?? text,
            riskLevel: RiskLevel.Medium,
            confidence: BigInt(76),
          },
        ],
        citations: [],
      };
      setResult(mockResult, text);
    },
  };
}
