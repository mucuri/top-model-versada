import React from 'react';
import { GeneratedImage } from '../types';
import { APP_NAME } from '../constants';
import { HeartIcon, ShareIcon, MagicWandIcon } from './icons';

interface CommunityFeedProps {
  images: GeneratedImage[];
  onLike: (imageId: string) => void;
  onShare: (image: GeneratedImage) => void;
  onImageSelect: (image: GeneratedImage) => void;
  onGenerate: (prompt: string) => void;
  cooldownTime: number;
}

const countryToFlag = (countryName: string): string => {
    // Simple mapping for demo purposes. A real app would use a library.
    const flags: { [key: string]: string } = {
        'Brasil': '🇧🇷',
    };
    return flags[countryName] || '🏳️';
};

const CommunityFeed: React.FC<CommunityFeedProps> = ({ images, onLike, onShare, onImageSelect, onGenerate, cooldownTime }) => {
  const canGenerate = cooldownTime < Date.now();

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6">Comunidade Top Model</h2>
      {images.length === 0 ? (
        <p className="text-center text-gray-400">A comunidade ainda está vazia. Seja o primeiro a criar uma imagem!</p>
      ) : (
        <div className="columns-2 md:columns-3 gap-4">
          {images.map((image) => (
            <div 
                key={image.id} 
                className="mb-4 break-inside-avoid relative group cursor-pointer"
                onClick={() => onImageSelect(image)}
            >
              <img src={image.imageUrl} alt={image.prompt} className="w-full rounded-lg shadow-lg" />
              
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 rounded-lg flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100">
                <div className="flex items-center space-x-2">
                    <span className="text-xl">{countryToFlag(image.authorCountry)}</span>
                    <div>
                        <p className="text-white text-sm font-bold">@{image.author}</p>
                        <p className="text-white text-xs">{image.authorCity}</p>
                    </div>
                </div>
                
                <div className="flex justify-end items-center space-x-3">
                   <button 
                      onClick={(e) => { e.stopPropagation(); onGenerate(image.prompt); }} 
                      disabled={!canGenerate}
                      className="text-white hover:text-fuchsia-400 transition-colors disabled:text-gray-600 disabled:cursor-not-allowed"
                      aria-label="Gerar com este estilo"
                      title="Gerar com este estilo"
                  >
                      <MagicWandIcon className="w-5 h-5" />
                  </button>
                  <button 
                      onClick={(e) => { e.stopPropagation(); onLike(image.id); }} 
                      className="flex items-center space-x-1.5 text-white hover:text-red-400 transition-colors"
                      aria-label={`Like image by ${image.author}, currently ${image.likes} likes`}
                  >
                      <HeartIcon className="w-5 h-5" filled={image.likedByUser} />
                      <span className="font-semibold text-base">{image.likes}</span>
                  </button>
                  <button 
                      onClick={(e) => { e.stopPropagation(); onShare(image); }}
                      className="text-white hover:text-cyan-400 transition-colors"
                      aria-label="Share or download image"
                  >
                      <ShareIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;