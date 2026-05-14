import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const MAX_CHARS = 5000;
const WARN_THRESHOLD = 0.9;

const SAMPLE_EXAMPLES = [
  {
    label: "Clean Scientific Text",
    icon: "🔬",
    text: "Photosynthesis is the biological process by which plants, algae, and cyanobacteria convert light energy into chemical energy stored as glucose. In the chloroplasts of plant cells, chlorophyll absorbs sunlight and uses the energy to combine carbon dioxide from the air with water absorbed through the roots. This reaction produces oxygen as a byproduct, which is released into the atmosphere. The net equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. Studies consistently show that the efficiency of this process is approximately 3–6% for most terrestrial plants under natural conditions.",
  },
  {
    label: "Hallucinated AI Response",
    icon: "⚠️",
    text: "Reportedly, many experts now agree that quantum computing will allegedly replace all classical computers by 2027. According to some studies, this technology has supposedly been proven to solve every NP-hard problem in polynomial time [1]. Various researchers have suggested that IBM's undisclosed Project Aurora has already achieved this breakthrough, though details remain classified [2]. It has been widely claimed that the U.S. government is purportedly investing trillions in this effort. Numerous sources indicate that conventional encryption will essentially become obsolete within the next few months [3].",
  },
  {
    label: "Mixed Content",
    icon: "🔀",
    text: "The human brain contains approximately 86 billion neurons, connected by roughly 100 trillion synaptic connections. Memory formation is well-understood to involve long-term potentiation in the hippocampus. However, some researchers have allegedly discovered that humans only use 10% of their brain capacity — a figure that is reportedly backed by several unnamed neuroscience labs [1]. Furthermore, it has been suggested that playing classical music to infants supposedly increases IQ by up to 25 points, though the studies cited for this claim [2] remain unverifiable. In reality, the brain is active across all regions, as confirmed by fMRI imaging.",
  },
];

export default function HomePage() {
  const [inputText, setInputText] = useState("");
  const navigate = useNavigate();
  const { analyze, analyzeMock, isLoading, error, isActorReady } =
    useAnalysis();
  const charCount = inputText.length;
  const charRatio = charCount / MAX_CHARS;
  const isNearLimit = charRatio >= WARN_THRESHOLD;
  const isOverLimit = charCount > MAX_CHARS;
  const isEmpty = inputText.trim().length === 0;
  const isDisabled = isEmpty || isLoading || isOverLimit;

  function handleAnalyze() {
    if (isActorReady) {
      analyze(inputText, {
        onSuccess: () => {
          navigate({ to: "/results" });
        },
      });
    } else {
      // Demo mode: use mock when actor not ready
      analyzeMock(inputText);
      navigate({ to: "/results" });
    }
  }

  function loadSample(text: string) {
    setInputText(text);
  }

  return (
    <div className="flex flex-col items-center py-12 px-4 min-h-[calc(100vh-4rem)]">
      {/* Hero heading */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex flex-col items-center gap-3 mb-10 text-center"
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-medium mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered Hallucination Detection
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground tracking-tight">
          Halu<span className="text-primary">ciDetect</span>
        </h1>
        <p className="text-muted-foreground text-base max-w-md">
          Paste any AI-generated text, article, or claim and get an instant
          trust score with sentence-level analysis.
        </p>
      </motion.div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="w-full max-w-2xl card-elevated p-6 flex flex-col gap-5"
      >
        {/* Textarea */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="analysis-input"
            className="text-sm font-medium text-foreground"
          >
            Text to Analyse
          </label>
          <Textarea
            id="analysis-input"
            data-ocid="home.input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste an AI-generated paragraph, article excerpt, or any claim you want to verify…"
            className="min-h-[180px] resize-y text-sm font-mono leading-relaxed placeholder:text-muted-foreground/50"
            disabled={isLoading}
          />
          {/* Character counter */}
          <div className="flex justify-end">
            <span
              className={`text-xs font-mono transition-colors ${
                isNearLimit
                  ? "text-destructive font-semibold"
                  : "text-muted-foreground"
              }`}
              data-ocid="home.char_count"
            >
              {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-start gap-2.5 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3"
            data-ocid="home.error_state"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}

        {/* Analyze button */}
        <Button
          type="button"
          data-ocid="home.submit_button"
          onClick={handleAnalyze}
          disabled={isDisabled}
          className="w-full h-11 font-semibold text-sm gap-2 transition-smooth"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analysing…
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Analyse Text
            </>
          )}
        </Button>
      </motion.div>

      {/* Sample examples */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="w-full max-w-2xl mt-6 flex flex-col gap-3"
      >
        <p className="text-xs text-muted-foreground text-center uppercase tracking-wider font-medium">
          Try a sample
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SAMPLE_EXAMPLES.map((ex, i) => (
            <button
              key={ex.label}
              type="button"
              data-ocid={`home.sample.${i + 1}`}
              onClick={() => loadSample(ex.text)}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2.5 text-left text-xs font-medium text-foreground hover:bg-muted/60 hover:border-primary/40 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-base leading-none">{ex.icon}</span>
              <span className="line-clamp-1">{ex.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Feature hints */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-2xl mt-8 grid grid-cols-3 gap-3"
      >
        {[
          { label: "Trust Score", desc: "0–100 confidence rating" },
          { label: "Risk Badges", desc: "Low / Medium / High signals" },
          { label: "Sentence Highlights", desc: "Pinpoints suspicious claims" },
        ].map((f, i) => (
          <div
            key={f.label}
            className="rounded-md border border-border bg-muted/30 px-3 py-3 flex flex-col gap-1"
            data-ocid={`home.feature.${i + 1}`}
          >
            <span className="text-xs font-semibold text-foreground">
              {f.label}
            </span>
            <span className="text-xs text-muted-foreground">{f.desc}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
