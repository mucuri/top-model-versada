import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CameraIcon, CheckIcon, FlipCameraIcon } from './icons';
import { Language } from '../types';

interface SelfieCaptureProps {
  onSelfieConfirm: (imageData: string) => void;
  // Fix: Update type for t function to allow for arguments
  t: (key: string, ...args: any[]) => string;
  language: Language;
}

const SelfieCapture: React.FC<SelfieCaptureProps> = ({ onSelfieConfirm, t }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null); // Use a ref to manage the stream
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const startCamera = useCallback(async (mode: 'user' | 'environment') => {
    // Stop any existing stream
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
    }
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { 
            facingMode: mode,
            aspectRatio: 1 
        }
      });
      streamRef.current = newStream; // Store stream in ref
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert(t('alert_camera_permission'));
    }
  }, [t]); // Dependency on `t` for the alert message

  useEffect(() => {
    startCamera(facingMode);

    // Cleanup function when the component unmounts or dependencies change
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode, startCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      const size = Math.min(video.videoWidth, video.videoHeight);
      canvas.width = size;
      canvas.height = size;
      
      const context = canvas.getContext('2d');
      if (context) {
        const sx = (video.videoWidth - size) / 2;
        const sy = (video.videoHeight - size) / 2;
        
        // Flip the captured image horizontally for the user-facing camera to match the preview
        if (facingMode === 'user') {
            context.save();
            context.scale(-1, 1);
            context.drawImage(video, sx, sy, size, size, -size, 0, size, size);
            context.restore();
        } else {
            context.drawImage(video, sx, sy, size, size, 0, 0, size, size);
        }
        
        const imageData = canvas.toDataURL('image/png');
        setCapturedImage(imageData);
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };
  
  const handleToggleFacingMode = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md mx-auto bg-gray-800 rounded-xl overflow-hidden shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white pt-6">{t('selfie_capture_title')}</h2>
        <p className="text-center text-gray-400 mb-4 px-6">{t('selfie_capture_subtitle')}</p>

        <div className="relative w-full aspect-square bg-gray-700">
          {capturedImage ? (
            <img src={capturedImage} alt="Captured Selfie" className="w-full h-full object-cover" />
          ) : (
            // Mirror the video preview for a more natural selfie experience
            <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${facingMode === 'user' ? 'transform -scale-x-100' : ''}`} />
          )}
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>

        <div className="p-6">
          {capturedImage ? (
            <div className="flex space-x-4">
              <button
                onClick={handleRetake}
                className="w-full bg-gray-600 text-white font-bold py-3 rounded-md hover:bg-gray-500 transition-colors"
              >
                {t('selfie_capture_retake_button')}
              </button>
              <button
                onClick={() => onSelfieConfirm(capturedImage)}
                className="w-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-bold py-3 rounded-md hover:opacity-90 transition-opacity flex items-center justify-center"
              >
                {t('selfie_capture_confirm_button')} <CheckIcon className="w-5 h-5 ml-2" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-4">
              <button onClick={handleToggleFacingMode} className="p-4 bg-gray-700 rounded-full text-white hover:bg-gray-600 transition-colors">
                <FlipCameraIcon />
              </button>
              <button
                onClick={handleCapture}
                className="w-20 h-20 bg-white rounded-full border-4 border-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <CameraIcon className="w-8 h-8 text-gray-800" />
              </button>
              <div className="w-14 h-14"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelfieCapture;