import { RiskLevel } from "@/backend";

/**
 * Returns the CSS badge class name for a given risk level.
 * Uses the design system badge utilities from index.css.
 */
export function getRiskBadgeClass(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case RiskLevel.Low:
      return "badge-success";
    case RiskLevel.Medium:
      return "badge-warning";
    case RiskLevel.High:
      return "badge-destructive";
    default:
      return "badge-warning";
  }
}

/**
 * Returns Tailwind text color class for a given risk level.
 */
export function getRiskColor(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case RiskLevel.Low:
      return "text-[oklch(var(--success))]";
    case RiskLevel.Medium:
      return "text-[oklch(var(--warning))]";
    case RiskLevel.High:
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
}

/**
 * Returns a human-readable label for a risk level.
 */
export function getRiskLabel(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case RiskLevel.Low:
      return "Low Risk";
    case RiskLevel.Medium:
      return "Medium Risk";
    case RiskLevel.High:
      return "High Risk";
    default:
      return "Unknown";
  }
}

/**
 * Formats a 0–100 number as a percentage string.
 */
export function formatConfidence(value: number | bigint): string {
  const num = typeof value === "bigint" ? Number(value) : value;
  return `${Math.min(100, Math.max(0, Math.round(num)))}%`;
}

/**
 * Returns a descriptive label for a trust score value.
 */
export function getTrustLabel(score: number | bigint): string {
  const num = typeof score === "bigint" ? Number(score) : score;
  if (num >= 80) return "Highly Trustworthy";
  if (num >= 60) return "Mostly Reliable";
  if (num >= 40) return "Somewhat Unreliable";
  return "Likely Hallucinated";
}

/**
 * Returns the trust score ring/bar color class.
 */
export function getTrustScoreColorClass(score: number | bigint): string {
  const num = typeof score === "bigint" ? Number(score) : score;
  if (num >= 70) return "text-[oklch(var(--success))]";
  if (num >= 40) return "text-[oklch(var(--warning))]";
  return "text-destructive";
}
