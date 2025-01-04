import React, { useRef, useEffect } from 'react';
import { Camera as CameraIcon } from 'lucide-react';

interface CameraProps {
  onCapture: (imageData: string) => void;
  isCapturing: boolean;
}

export function Camera({ onCapture, isCapturing }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    startCamera();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg');
      onCapture(imageData);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full rounded-lg shadow-lg"
      />
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={captureImage}
        disabled={isCapturing}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
                 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full
                 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed
                 shadow-lg transition-all duration-200"
      >
        <CameraIcon className="w-6 h-6" />
        <span>{isCapturing ? 'Processing...' : 'Capture'}</span>
      </button>
    </div>
  );
}