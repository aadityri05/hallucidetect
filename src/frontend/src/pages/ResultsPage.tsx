import { RiskLevel } from "@/backend";
import { Button } from "@/components/ui/button";
import { useAnalysisStore } from "@/store/analysisStore";
import {
  formatConfidence,
  getRiskBadgeClass,
  getRiskColor,
  getRiskLabel,
  getTrustLabel,
  getTrustScoreColorClass,
} from "@/utils/riskUtils";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  RefreshCcw,
} from "lucide-react";
import { useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function riskFill(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case RiskLevel.Low:
      return "#4ade80"; // green-400 — readable in both themes
    case RiskLevel.Medium:
      return "#facc15"; // yellow-400 — readable in both themes
    case RiskLevel.High:
      return "#f87171"; // red-400 — readable in both themes
  }
}

function SentenceCard({
  sentence,
  riskLevel,
  confidence,
  index,
}: {
  sentence: string;
  riskLevel: RiskLevel;
  confidence: bigint;
  index: number;
}) {
  const bgMap: Record<string, string> = {
    Low: "bg-green-500/10 border-green-500/30",
    Medium: "bg-amber-500/10 border-amber-500/30",
    High: "bg-red-500/10 border-red-500/30",
  };
  const key =
    riskLevel === RiskLevel.Low
      ? "Low"
      : riskLevel === RiskLevel.Medium
        ? "Medium"
        : "High";
  return (
    <div
      data-ocid={`suspicious_sentences.item.${index}`}
      className={`rounded-lg border p-4 space-y-2 ${bgMap[key]}`}
    >
      <p className="text-sm text-foreground leading-relaxed">{sentence}</p>
      <div className="flex items-center gap-3">
        <span className={getRiskBadgeClass(riskLevel)}>
          {getRiskLabel(riskLevel)}
        </span>
        <span className="text-xs text-muted-foreground font-mono">
          Confidence: {formatConfidence(confidence)}
        </span>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const { result, clearResult } = useAnalysisStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!result) {
      navigate({ to: "/" });
    }
  }, [result, navigate]);

  if (!result) return null;

  const trustScore = Number(result.trustScore);
  const overallConf = Number(result.overallConfidence);

  const chartData = result.suspiciousSentences.map((s, i) => ({
    name: `S${i + 1}`,
    confidence: Number(s.confidence),
    riskLevel: s.riskLevel,
  }));

  const countLow = result.suspiciousSentences.filter(
    (s) => s.riskLevel === RiskLevel.Low,
  ).length;
  const countMedium = result.suspiciousSentences.filter(
    (s) => s.riskLevel === RiskLevel.Medium,
  ).length;
  const countHigh = result.suspiciousSentences.filter(
    (s) => s.riskLevel === RiskLevel.High,
  ).length;

  return (
    <div
      data-ocid="results.page"
      className="max-w-4xl mx-auto px-4 py-8 space-y-8"
    >
      {/* ── Header metrics ───────────────────────────────────────── */}
      <section data-ocid="results.summary.section">
        <h1 className="text-2xl font-display font-bold text-foreground mb-5">
          Analysis Results
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Trust Score */}
          <div className="card-elevated p-6 flex flex-col items-center gap-1">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-1">
              Trust Score
            </span>
            <span
              data-ocid="results.trust_score"
              className={`text-5xl font-display font-extrabold tabular-nums ${getTrustScoreColorClass(trustScore)}`}
            >
              {trustScore}%
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              {getTrustLabel(trustScore)}
            </span>
          </div>

          {/* Hallucination Risk */}
          <div className="card-elevated p-6 flex flex-col items-center gap-1">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-1">
              Hallucination Risk
            </span>
            <div data-ocid="results.risk_badge" className="mt-2">
              <span
                className={`text-lg font-semibold px-4 py-1.5 rounded-md ${getRiskBadgeClass(
                  result.riskLevel,
                )}`}
              >
                {getRiskLabel(result.riskLevel)}
              </span>
            </div>
            <span
              className={`text-xs mt-2 font-medium ${getRiskColor(result.riskLevel)}`}
            >
              {result.riskLevel === RiskLevel.High
                ? "Significant hallucination detected"
                : result.riskLevel === RiskLevel.Medium
                  ? "Some claims need verification"
                  : "Content appears trustworthy"}
            </span>
          </div>

          {/* Overall Confidence */}
          <div className="card-elevated p-6 flex flex-col items-center gap-1">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-1">
              Overall Confidence
            </span>
            <span
              data-ocid="results.confidence"
              className="text-5xl font-display font-extrabold tabular-nums text-primary"
            >
              {overallConf}%
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Model certainty
            </span>
          </div>
        </div>
      </section>

      {/* ── Suspicious Sentences ─────────────────────────────────── */}
      <section data-ocid="results.suspicious.section">
        <h2 className="text-lg font-display font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[oklch(var(--warning))]" />
          Suspicious Sentences
        </h2>
        {result.suspiciousSentences.length === 0 ? (
          <div
            data-ocid="suspicious_sentences.empty_state"
            className="card-elevated p-6 flex items-center gap-3 border-green-500/30 bg-green-500/10"
          >
            <CheckCircle2 className="w-6 h-6 text-[oklch(var(--success))] shrink-0" />
            <div>
              <p className="font-medium text-foreground">
                No suspicious sentences detected
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                The content passed all hallucination checks.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {result.suspiciousSentences.map((s, i) => (
              <SentenceCard
                key={s.sentence}
                sentence={s.sentence}
                riskLevel={s.riskLevel}
                confidence={s.confidence}
                index={i + 1}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Citation Detection ───────────────────────────────────── */}
      <section data-ocid="results.citations.section">
        <h2 className="text-lg font-display font-semibold text-foreground mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Citation Detection
        </h2>
        {result.citations.length === 0 ? (
          <div
            data-ocid="citations.empty_state"
            className="card-elevated p-5 text-sm text-muted-foreground"
          >
            No citations detected in the provided text.
          </div>
        ) : (
          <div className="space-y-3">
            {result.citations.map((c, i) => (
              <div
                key={c.citationText}
                data-ocid={`citations.item.${i + 1}`}
                className="card-elevated p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-foreground font-mono flex-1 min-w-0 break-words">
                    "{c.citationText}"
                  </p>
                  <span
                    className={`shrink-0 ${
                      c.isFake ? "badge-destructive" : "badge-success"
                    }`}
                  >
                    {c.isFake ? "Potentially Fake" : "Likely Valid"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{c.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Confidence Analysis Chart ────────────────────────────── */}
      {chartData.length > 0 && (
        <section data-ocid="results.confidence_chart.section">
          <h2 className="text-lg font-display font-semibold text-foreground mb-3">
            Confidence Analysis
          </h2>
          <div className="card-elevated p-4">
            <p className="text-xs text-muted-foreground mb-4">
              Per-sentence confidence scores — color-coded by risk level
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={chartData}
                margin={{ top: 4, right: 8, left: -8, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.5 0 0 / 0.25)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "oklch(0.55 0 0)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "oklch(0.55 0 0)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip
                  cursor={{ fill: "oklch(0.5 0 0 / 0.15)" }}
                  formatter={(v: number) => [`${v}%`, "Confidence"]}
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: 12,
                    color: "var(--color-foreground)",
                  }}
                />
                <Bar dataKey="confidence" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={riskFill(entry.riskLevel)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* ── Risk Distribution ────────────────────────────────────── */}
      {result.suspiciousSentences.length > 0 && (
        <section data-ocid="results.risk_distribution.section">
          <h2 className="text-lg font-display font-semibold text-foreground mb-3">
            Risk Distribution
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="card-elevated p-5 flex flex-col items-center gap-1 border-green-500/40">
              <span className="text-3xl font-display font-bold text-green-500">
                {countLow}
              </span>
              <span className="badge-success mt-1">Low Risk</span>
              <span className="text-xs text-muted-foreground mt-0.5">
                sentences
              </span>
            </div>
            <div className="card-elevated p-5 flex flex-col items-center gap-1 border-amber-500/40">
              <span className="text-3xl font-display font-bold text-amber-500">
                {countMedium}
              </span>
              <span className="badge-warning mt-1">Medium Risk</span>
              <span className="text-xs text-muted-foreground mt-0.5">
                sentences
              </span>
            </div>
            <div className="card-elevated p-5 flex flex-col items-center gap-1 border-destructive/40">
              <span className="text-3xl font-display font-bold text-destructive">
                {countHigh}
              </span>
              <span className="badge-destructive mt-1">High Risk</span>
              <span className="text-xs text-muted-foreground mt-0.5">
                sentences
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ── Explainability ───────────────────────────────────────── */}
      <section data-ocid="results.explainability.section">
        <h2 className="text-lg font-display font-semibold text-foreground mb-3">
          Explainability
        </h2>
        <div className="card-elevated divide-y divide-border overflow-hidden">
          <details className="group">
            <summary
              data-ocid="explainability.trust_score.toggle"
              className="flex items-center justify-between px-5 py-4 cursor-pointer select-none text-sm font-medium text-foreground hover:bg-muted/40 transition-smooth list-none"
            >
              <span>Trust Score Formula</span>
              <span className="text-muted-foreground text-xs group-open:rotate-180 transition-transform duration-200">
                ▼
              </span>
            </summary>
            <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground space-y-2 leading-relaxed">
              <p>
                The <strong className="text-foreground">Trust Score</strong> is
                computed as a weighted composite:{" "}
                <code className="text-xs font-mono bg-muted rounded px-1 py-0.5">
                  base_score = 100 − (high_count × 25 + medium_count × 10 +
                  low_count × 3)
                </code>
                . It is clamped to [0, 100] and then adjusted by the model's
                overall semantic confidence. High-risk sentences carry the
                strongest penalty.
              </p>
            </div>
          </details>

          <details className="group">
            <summary
              data-ocid="explainability.risk_logic.toggle"
              className="flex items-center justify-between px-5 py-4 cursor-pointer select-none text-sm font-medium text-foreground hover:bg-muted/40 transition-smooth list-none"
            >
              <span>Risk Level Logic</span>
              <span className="text-muted-foreground text-xs group-open:rotate-180 transition-transform duration-200">
                ▼
              </span>
            </summary>
            <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground space-y-2 leading-relaxed">
              <p>
                Risk levels are derived from sentence-level semantic divergence
                scores. A sentence is{" "}
                <strong className="text-foreground">High Risk</strong> when its
                embedding similarity to known factual anchors falls below 0.45.
                <strong className="text-foreground"> Medium Risk</strong>{" "}
                sentences score 0.45–0.65.
                <strong className="text-foreground"> Low Risk</strong> sentences
                exceed 0.65 similarity.
              </p>
              <p>
                The overall document risk is promoted to the highest individual
                sentence risk.
              </p>
            </div>
          </details>

          <details className="group">
            <summary
              data-ocid="explainability.confidence.toggle"
              className="flex items-center justify-between px-5 py-4 cursor-pointer select-none text-sm font-medium text-foreground hover:bg-muted/40 transition-smooth list-none"
            >
              <span>Confidence Interpretation</span>
              <span className="text-muted-foreground text-xs group-open:rotate-180 transition-transform duration-200">
                ▼
              </span>
            </summary>
            <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground space-y-2 leading-relaxed">
              <p>
                <strong className="text-foreground">Confidence</strong> (0–100%)
                reflects how certain the model is about its classification for a
                given sentence. A score above 80% means the model is highly
                certain. Between 50–80% indicates moderate certainty. Below 50%
                suggests the classification may be ambiguous and manual review
                is recommended.
              </p>
              <p>
                Low confidence on a High-Risk sentence is a strong signal that
                human fact-checking is warranted.
              </p>
            </div>
          </details>
        </div>

        {/* Analysis Explanation */}
        {result.analysisExplanation && (
          <div className="mt-4 card-elevated p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-2">
              Model Explanation
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {result.analysisExplanation}
            </p>
          </div>
        )}
      </section>

      {/* ── Analyze Another ──────────────────────────────────────── */}
      <div className="flex justify-center pt-2 pb-8">
        <Button
          data-ocid="results.analyze_another_button"
          size="lg"
          className="gap-2"
          onClick={() => {
            clearResult();
            navigate({ to: "/" });
          }}
        >
          <RefreshCcw className="w-4 h-4" />
          Analyze Another Text
        </Button>
      </div>
    </div>
  );
}
