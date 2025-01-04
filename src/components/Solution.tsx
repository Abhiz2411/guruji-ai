import React from 'react';
import { Solution as SolutionType } from '../types';
import { BookOpen } from 'lucide-react';

interface SolutionProps {
  solution: SolutionType | null;
}

export function Solution({ solution }: SolutionProps) {
  if (!solution) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center space-x-2 mb-4">
        <BookOpen className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Solution</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Detected Text:</h3>
          <p className="mt-1 text-gray-800">{solution.originalText}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Solution:</h3>
          <p className="mt-1 text-gray-800 whitespace-pre-wrap">{solution.solution}</p>
        </div>
        
        <div className="text-xs text-gray-400">
          Processed at: {solution.timestamp}
        </div>
      </div>
    </div>
  );
}