import React from 'react';
import { GeneratedImage, Language } from '../types';
import { HeartIcon, ShareIcon, MagicWandIcon } from './icons';

interface CommunityFeedProps {
  images: GeneratedImage[];
  onLike: (imageId: string) => void;
  onShare: (image: GeneratedImage) => void;
  onImageSelect: (image: GeneratedImage) => void;
  onGenerate: (prompt: string) => void;
  cooldownTime: number;
  t: (key: string, ...args: any[]) => string;
  language: Language;
}

const countryToFlag = (countryName: string): string => {
    const flags: { [key: string]: string } = {
        'Brasil': '🇧🇷',
        'Italia': '🇮🇹',
        'Italy': '🇮🇹',
    };
    return flags[countryName] || '🏳️';
};

const CommunityFeed: React.FC<CommunityFeedProps> = ({ images, onLike, onShare, onImageSelect, onGenerate, cooldownTime, t }) => {
  const canGenerate = cooldownTime < Date.now();

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6">{t('community_title')}</h2>
      {images.length === 0 ? (
        <p className="text-center text-gray-400">{t('community_empty')}</p>
      ) : (
        <div className="columns-2 md:columns-3 gap-4">
          {images.map((image) => (
            <div 
                key={image.id} 
                className="mb-4 break-inside-avoid bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col"
            >
              <img 
                src={image.imageUrl} 
                alt={image.prompt} 
                className="w-full cursor-pointer"
                onClick={() => onImageSelect(image)}
              />
              
              <div className="p-3">
                <div className="flex items-center space-x-2 mb-2" onClick={() => onImageSelect(image)}>
                    <span className="text-xl">{countryToFlag(image.authorCountry)}</span>
                    <div>
                        <p className="text-white text-sm font-bold leading-tight">@{image.author}</p>
                        <p className="text-gray-400 text-xs leading-tight">{image.authorCity}</p>
                    </div>
                </div>
                
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-700/50">
                   <button 
                      onClick={(e) => { e.stopPropagation(); onLike(image.id); }} 
                      className="flex items-center space-x-1.5 text-gray-300 hover:text-red-400 transition-colors"
                      aria-label={t('aria_like_image', image.author, image.likes)}
                  >
                      <HeartIcon className="w-5 h-5" filled={image.likedByUser} />
                      <span className="font-semibold text-sm">{image.likes}</span>
                  </button>
                  <div className="flex items-center space-x-3">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onGenerate(image.prompt); }} 
                        disabled={!canGenerate}
                        className="text-gray-300 hover:text-fuchsia-400 transition-colors disabled:text-gray-600 disabled:cursor-not-allowed"
                        aria-label={t('aria_generate_with_style')}
                        title={t('aria_generate_with_style')}
                    >
                        <MagicWandIcon className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onShare(image); }}
                        className="text-gray-300 hover:text-cyan-400 transition-colors"
                        aria-label={t('aria_share_image')}
                    >
                        <ShareIcon className="w-5 h-5" />
                    </button>
                  </div>
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