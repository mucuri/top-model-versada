import React, { useState } from 'react';
import { StyleOption, Language } from '../types';
import { STYLE_OPTIONS } from '../constants';

interface StyleSelectorProps {
  onStyleSelect: (prompt: string) => void;
  // Fix: Update type for t function to allow for arguments
  t: (key: string, ...args: any[]) => string;
  language: Language;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ onStyleSelect, t }) => {
  const [customStyle, setCustomStyle] = useState('');

  const handleStyleButtonClick = (option: StyleOption) => {
    setCustomStyle(option.prompt);
  };
  
  const handleGenerate = () => {
    if (customStyle.trim()) {
      onStyleSelect(customStyle.trim());
    }
  };

  const canGenerate = customStyle.trim() !== '';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-white mb-2">{t('style_selector_title')}</h2>
        <p className="text-gray-400 mb-8">{t('style_selector_subtitle')}</p>
        
        <div className="mb-6">
            <input
              type="text"
              value={customStyle}
              onChange={(e) => setCustomStyle(e.target.value)}
              placeholder={t('style_selector_placeholder')}
              className="w-full px-5 py-4 bg-gray-800 text-white border-2 border-gray-700 rounded-full focus:outline-none focus:ring-4 focus:ring-fuchsia-500/50 transition-all duration-300 text-center text-lg"
            />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="text-gray-400 text-sm self-center mr-2">{t('style_selector_suggestions')}:</span>
            {STYLE_OPTIONS.map((option) => (
               <button 
                key={option.id}
                onClick={() => handleStyleButtonClick(option)}
                className="px-4 py-2 bg-gray-700 text-gray-200 font-semibold rounded-full hover:bg-fuchsia-500 hover:text-white transition-colors duration-300"
               >
                   {t(option.name)}
               </button>
            ))}
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="w-full max-w-sm mx-auto bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-bold py-4 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg shadow-fuchsia-500/20 text-xl"
        >
          {t('style_selector_generate_button')}
        </button>
      </div>
    </div>
  );
};

export default StyleSelector;
