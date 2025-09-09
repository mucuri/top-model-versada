import React, { useState, useEffect } from 'react';
import { GeneratedImage } from '../types';
import { CloseIcon, HeartIcon, ShareIcon } from './icons';
import { APP_NAME } from '../constants';

interface ImageModalProps {
  image: GeneratedImage;
  onClose: () => void;
  onLike: (imageId: string) => void;
  onShare: (image: GeneratedImage) => void;
  onGenerate: (prompt: string) => void;
  cooldownTime: number;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose, onLike, onShare, onGenerate, cooldownTime }) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (cooldownTime > 0) {
        const remaining = Math.max(0, cooldownTime - Date.now());
        setMinutes(Math.floor((remaining / 1000 / 60) % 60));
        setSeconds(Math.floor((remaining / 1000) % 60));
      } else {
        setMinutes(0);
        setSeconds(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownTime]);

  const canGenerate = cooldownTime < Date.now();

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-modal {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
      
      <div 
        className="relative bg-gray-900/50 backdrop-blur-sm rounded-lg shadow-2xl w-full h-full max-w-lg max-h-[95vh] flex flex-col animate-fade-in-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 z-20 hover:scale-110 hover:bg-black transition-all"
          aria-label="Close image view"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {/* Image container */}
        <div className="flex-grow w-full h-full flex justify-center items-center overflow-hidden p-4 relative">
            <img 
              src={image.imageUrl} 
              alt={image.prompt} 
              className="max-h-full max-w-full w-auto h-auto object-contain rounded-md"
            />
        </div>

        {/* Info and Actions Footer */}
        <div className="flex-shrink-0 p-4 bg-black/30 rounded-b-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 mr-4">
                <p className="text-white font-bold text-base">@{image.author}</p>
                <p className="text-gray-400 text-sm mt-1">{image.prompt}</p>
              </div>
              <div className="flex items-center space-x-4">
                  <button 
                      onClick={() => onLike(image.id)} 
                      className="flex items-center space-x-1.5 text-white hover:text-red-400 transition-colors"
                      aria-label={`Like image, currently ${image.likes} likes`}
                  >
                      <HeartIcon className="w-6 h-6" filled={image.likedByUser} />
                      <span className="font-semibold text-lg">{image.likes}</span>
                  </button>
                  <button 
                      onClick={() => onShare(image)}
                      className="text-white hover:text-cyan-400 transition-colors"
                      aria-label="Share or download image"
                  >
                      <ShareIcon className="w-6 h-6" />
                  </button>
              </div>
            </div>
            <button
                onClick={() => onGenerate(image.prompt)}
                disabled={!canGenerate}
                className="w-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity duration-300 flex justify-center items-center text-base"
            >
                {canGenerate ? (
                    '✨ Usar este Estilo'
                ) : (
                    <span>Aguarde {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;