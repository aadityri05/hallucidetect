import Types "../types/hallucination-detection";
import Lib "../lib/hallucination-detection";
import OutCall "mo:caffeineai-http-outcalls/outcall";

mixin () {
  // Transform callback required by the IC HTTP outcalls system.
  // Acts as a passthrough — kept for HTTP outcall readiness.
  public query func transform(
    input : OutCall.TransformationInput
  ) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Accepts user text (max 5000 chars), runs rule-based NLP analysis,
  // and returns a structured hallucination analysis result.
  public shared func analyzeForHallucination(
    text : Text
  ) : async Types.AnalysisResponse {
    Lib.analyzeText(text);
  };
}
