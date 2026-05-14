import type { AnalysisResult } from "@/backend";
import { create } from "zustand";

interface AnalysisStore {
  result: AnalysisResult | null;
  inputText: string;
  setResult: (result: AnalysisResult, inputText: string) => void;
  clearResult: () => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  result: null,
  inputText: "",
  setResult: (result, inputText) => set({ result, inputText }),
  clearResult: () => set({ result: null, inputText: "" }),
}));
