import Types "../types/hallucination-detection";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import List "mo:core/List";

module {
  // ── Hedge / vague word lists ────────────────────────────────────────────
  let hedgeWords : [Text] = [
    "may", "might", "could", "allegedly", "reportedly",
    "some say", "it is claimed", "it is said", "supposedly",
    "perhaps", "possibly", "apparently", "rumored", "unconfirmed",
  ];

  let vagueQuantifiers : [Text] = [
    "many", "most", "few", "several", "some", "various",
    "numerous", "countless", "a lot", "a number of",
  ];

  // ── Citation-pattern helpers ────────────────────────────────────────────

  // Returns true when the sentence looks like it contains a numbered reference.
  func hasNumberedRef(s : Text) : Bool {
    let lower = s.toLower();
    // Simple heuristic: look for bracket patterns like [1], [2], [12]
    var i = 0;
    let chars = lower.toArray();
    let len = chars.size();
    label scan loop {
      if (i >= len) break scan;
      if (chars[i] == '[') {
        var j = i + 1;
        var digits = 0;
        label inner loop {
          if (j >= len) break inner;
          let c = chars[j];
          if (c >= '0' and c <= '9') { digits += 1; j += 1 }
          else break inner;
        };
        if (digits > 0 and j < len and chars[j] == ']') return true;
      };
      i += 1;
    };
    false;
  };

  func hasUrl(s : Text) : Bool {
    let lower = s.toLower();
    lower.contains(#text "http://") or lower.contains(#text "https://");
  };

  func hasCitationPhrase(s : Text) : Bool {
    let lower = s.toLower();
    lower.contains(#text "according to") or
    lower.contains(#text "cited in") or
    lower.contains(#text "as reported by") or
    lower.contains(#text "citation needed") or
    lower.contains(#text "[source]") or
    lower.contains(#text "[ref]");
  };

  // Detect citations in a single sentence; returns them as Citation records.
  func detectCitationsInSentence(sentence : Text) : [Types.Citation] {
    let results = List.empty<Types.Citation>();
    if (hasNumberedRef(sentence)) {
      results.add({
        citationText = sentence;
        isFake = true;
        explanation = "Contains numbered reference [N] that cannot be verified without source list";
      });
    };
    if (hasUrl(sentence)) {
      results.add({
        citationText = sentence;
        isFake = false;
        explanation = "Contains URL — verify the link leads to a real, authoritative source";
      });
    };
    if (hasCitationPhrase(sentence)) {
      results.add({
        citationText = sentence;
        isFake = true;
        explanation = "Contains citation phrase without verifiable source";
      });
    };
    results.toArray();
  };

  // ── Sentence scoring ────────────────────────────────────────────────────

  // Count how many entries from a word list appear in the lower-cased sentence.
  func countMatches(lower : Text, words : [Text]) : Nat {
    words.foldLeft(0 : Nat, func(acc : Nat, w : Text) : Nat {
      if (lower.contains(#text w)) acc + 1 else acc;
    });
  };

  // Heuristic confidence score for a single sentence (0-100).
  // Higher = more confident / less likely hallucinated.
  public func scoreSentence(sentence : Text) : Nat {
    if (sentence.size() == 0) return 100;
    let lower = sentence.toLower();

    // Penalty accumulators (each 0-100 internally, then combined)
    var penalty : Nat = 0;

    // Hedge-word penalty: up to 40 pts
    let hedgeCount = countMatches(lower, hedgeWords);
    let hedgePenalty = if (hedgeCount >= 3) 40
      else if (hedgeCount == 2) 28
      else if (hedgeCount == 1) 18
      else 0;
    penalty += hedgePenalty;

    // Vague-quantifier penalty: up to 20 pts
    let vagueCount = countMatches(lower, vagueQuantifiers);
    let vaguePenalty = if (vagueCount >= 2) 20
      else if (vagueCount == 1) 10
      else 0;
    penalty += vaguePenalty;

    // Citation-phrase penalty: up to 20 pts
    let citePenalty = if (hasCitationPhrase(sentence) or hasNumberedRef(sentence)) 20 else 0;
    penalty += citePenalty;

    // Very short sentences (< 20 chars) are almost always fine
    let lenPenalty = if (sentence.size() < 20) 0
      // Extremely long sentences (> 300 chars) may be run-on / unprovable
      else if (sentence.size() > 300) 10
      else 0;
    penalty += lenPenalty;

    // Clamp confidence to 0-100
    if (penalty >= 100) 0 else 100 - penalty;
  };

  // Classify a sentence confidence into a risk level.
  func confidenceToRisk(conf : Nat) : Types.RiskLevel {
    if (conf >= 70) #Low
    else if (conf >= 40) #Medium
    else #High;
  };

  // ── Sentence splitter ───────────────────────────────────────────────────

  // Split text into sentences on '.', '!', '?' boundaries.
  public func splitSentences(text : Text) : [Text] {
    // Replace sentence-ending punctuation with a sentinel, then split on it.
    let sentinel = "|"; 
    let step1 = text.replace(#char '.', sentinel);
    let step2 = step1.replace(#char '!', sentinel);
    let step3 = step2.replace(#char '?', sentinel);
    let parts = step3.split(#text sentinel);
    let results = List.empty<Text>();
    for (part in parts) {
      let trimmed = part.trim(#predicate (func(c) { c == ' ' or c == '\n' or c == '\r' or c == '\t' }));
      if (trimmed.size() > 0) results.add(trimmed);
    };
    results.toArray();
  };

  // ── Main analysis entry point ───────────────────────────────────────────

  public func analyzeText(text : Text) : Types.AnalysisResponse {
    // Validate length
    if (text.size() > 5000) {
      return #err "Text exceeds 5000 character limit. Please shorten your input.";
    };
    if (text.size() == 0) {
      return #err "Input text is empty.";
    };

    let sentences = splitSentences(text);
    if (sentences.size() == 0) {
      return #err "No sentences detected in the input.";
    };

    // Score each sentence
    let scoredSentences = sentences.map(func(s) {
      { sentence = s; conf = scoreSentence(s) };
    });

    // Overall trust score = average sentence confidence
    let totalConf = scoredSentences.foldLeft(0 : Nat, func(acc : Nat, s : { sentence : Text; conf : Nat }) : Nat { acc + s.conf });
    let avgConf = totalConf / scoredSentences.size();
    let trustScore = avgConf;

    // Determine overall risk level
    let overallRisk : Types.RiskLevel = if (trustScore >= 70) #Low
      else if (trustScore >= 40) #Medium
      else #High;

    // Build suspicious sentences list (confidence < 60 OR hedge/vague words)
    let suspicious = List.empty<Types.SuspiciousSentence>();
    scoredSentences.forEach(func(s) {
      let lower = s.sentence.toLower();
      let hasHedge = countMatches(lower, hedgeWords) > 0;
      let hasVague = countMatches(lower, vagueQuantifiers) > 0;
      if (s.conf < 60 or hasHedge or hasVague) {
        suspicious.add({
          sentence = s.sentence;
          riskLevel = confidenceToRisk(s.conf);
          confidence = s.conf;
        });
      };
    });

    // Collect citations from all sentences
    let citations = List.empty<Types.Citation>();
    sentences.forEach(func(s) {
      let sentCitations = detectCitationsInSentence(s);
      sentCitations.forEach(func(c) { citations.add(c) });
    });

    // Build explanation
    let riskLabel = switch (overallRisk) {
      case (#Low) "LOW";
      case (#Medium) "MEDIUM";
      case (#High) "HIGH";
    };
    let explanation = "Rule-based NLP analysis. Trust score: " # trustScore.toText() #
      "%. Risk level: " # riskLabel #
      ". Analyzed " # sentences.size().toText() # " sentence(s). " #
      suspicious.size().toText() # " suspicious sentence(s) detected. " #
      citations.size().toText() # " potential citation issue(s) found.";

    #ok {
      trustScore;
      riskLevel = overallRisk;
      suspiciousSentences = suspicious.toArray();
      citations = citations.toArray();
      overallConfidence = avgConf;
      analysisExplanation = explanation;
    };
  };
}
