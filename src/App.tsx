import React, { useState } from 'react';
import { Camera } from './components/Camera';
import { Solution } from './components/Solution';
import { ProcessingState, Solution as SolutionType } from './types';
import { extractTextFromImage } from './utils/ocr';
import { getSolution } from './utils/openai';
import { GraduationCap } from 'lucide-react';

function App() {
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isCapturing: false,
    isProcessingOCR: false,
    isProcessingAI: false,
    error: null,
  });
  const [solution, setSolution] = useState<SolutionType | null>(null);

  const handleCapture = async (imageData: string) => {
    setProcessingState(prev => ({ ...prev, isCapturing: true, error: null }));
    
    try {
      // OCR Processing
      setProcessingState(prev => ({ ...prev, isProcessingOCR: true }));
      const extractedText = await extractTextFromImage(imageData);
      
      if (!extractedText) {
        throw new Error('No text was detected in the image');
      }
      
      // AI Processing
      setProcessingState(prev => ({ 
        ...prev, 
        isProcessingOCR: false, 
        isProcessingAI: true 
      }));
      const aiSolution = await getSolution(extractedText);
      
      setSolution({
        originalText: extractedText,
        solution: aiSolution,
        timestamp: new Date().toLocaleString(),
      });
    } catch (error) {
      setProcessingState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      }));
    } finally {
      setProcessingState({
        isCapturing: false,
        isProcessingOCR: false,
        isProcessingAI: false,
        error: null,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">AI Live Teacher</h1>
          </div>
          <p className="text-gray-600">
            Show your problem to the camera and get instant solutions
          </p>
        </div>

        <Camera 
          onCapture={handleCapture} 
          isCapturing={processingState.isCapturing} 
        />

        {processingState.error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {processingState.error}
          </div>
        )}

        {processingState.isProcessingOCR && (
          <div className="mt-4 text-center text-gray-600">
            Extracting text from image...
          </div>
        )}

        {processingState.isProcessingAI && (
          <div className="mt-4 text-center text-gray-600">
            Getting solution from AI...
          </div>
        )}

        <Solution solution={solution} />
      </div>
    </div>
  );
}

export default App;