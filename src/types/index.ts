export interface ProcessingState {
  isCapturing: boolean;
  isProcessingOCR: boolean;
  isProcessingAI: boolean;
  error: string | null;
}

export interface Solution {
  originalText: string;
  solution: string;
  timestamp: string;
}