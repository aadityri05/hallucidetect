module {
  public type RiskLevel = {
    #Low;
    #Medium;
    #High;
  };

  public type SuspiciousSentence = {
    sentence : Text;
    riskLevel : RiskLevel;
    confidence : Nat; // 0-100
  };

  public type Citation = {
    citationText : Text;
    isFake : Bool;
    explanation : Text;
  };

  public type AnalysisResult = {
    trustScore : Nat; // 0-100
    riskLevel : RiskLevel;
    suspiciousSentences : [SuspiciousSentence];
    citations : [Citation];
    overallConfidence : Nat; // 0-100
    analysisExplanation : Text;
  };

  public type AnalysisResponse = {
    #ok : AnalysisResult;
    #err : Text;
  };
}
