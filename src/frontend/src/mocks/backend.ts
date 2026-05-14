import type { backendInterface } from "../backend";
import { RiskLevel } from "../backend";

export const mockBackend: backendInterface = {
  analyzeForHallucination: async (_text: string) => ({
    __kind__: "ok",
    ok: {
      trustScore: BigInt(72),
      overallConfidence: BigInt(68),
      riskLevel: RiskLevel.Medium,
      analysisExplanation:
        "The text contains several claims that could not be verified against known sources. Some sentences show patterns typical of hallucinated content, including overly specific statistics and unverifiable citations.",
      suspiciousSentences: [
        {
          sentence:
            "Studies show that 94.7% of AI-generated content contains at least one factual error.",
          confidence: BigInt(82),
          riskLevel: RiskLevel.High,
        },
        {
          sentence:
            "The researchers at MIT published their findings in 2019 confirming this theory.",
          confidence: BigInt(61),
          riskLevel: RiskLevel.Medium,
        },
        {
          sentence: "This is a well-established fact in the scientific community.",
          confidence: BigInt(45),
          riskLevel: RiskLevel.Low,
        },
      ],
      citations: [
        {
          citationText: "Smith et al., 2023, Journal of AI Research",
          explanation: "This citation could not be verified in known databases.",
          isFake: true,
        },
        {
          citationText: "MIT AI Lab Technical Report, 2021",
          explanation: "Partial match found but publication details differ.",
          isFake: false,
        },
      ],
    },
  }),
  transform: async (input) => ({
    status: BigInt(200),
    body: input.response.body,
    headers: input.response.headers,
  }),
};
