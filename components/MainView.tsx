import React, { useState, useEffect } from 'react';
import { User, GeneratedImage, StyleOption, Language } from '../types';
import { STYLE_OPTIONS, APP_NAME, COOLDOWN_MINUTES } from '../constants';
import CommunityFeed from './CommunityFeed';
import { QuestionMarkCircleIcon, UserIcon, LogoutIcon } from './icons';

interface MainViewProps {
  user: User;
  images: GeneratedImage[];
  onGenerate: (prompt: string) => void;
  cooldownTime: number;
  onLike: (imageId: string) => void;
  onShare: (image: GeneratedImage) => void;
  onImageSelect: (image: GeneratedImage) => void;
  onGoToPro: () => void;
  onGoToInfo: () => void;
  onGoToProfile: () => void;
  onLogout: () => void;
  t: (key: string, ...args: any[]) => string;
  language: Language;
}

const MainView: React.FC<MainViewProps> = ({ user, images, onGenerate, cooldownTime, onLike, onShare, onImageSelect, onGoToPro, onGoToInfo, onGoToProfile, onLogout, t, language }) => {
  const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>(STYLE_OPTIONS[0]);
  const [customStyle, setCustomStyle] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (cooldownTime > Date.now()) {
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


  const handleGenerate = () => {
    if (isCustom && customStyle.trim()) {
      onGenerate(customStyle.trim());
    } else if (selectedStyle) {
      onGenerate(selectedStyle.prompt);
    }
  };

  const canGenerate = ((isCustom && customStyle.trim()) || (!isCustom && selectedStyle)) && cooldownTime < Date.now();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-sm p-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500">
            {APP_NAME}
          </h1>
          <div className="flex items-center space-x-4">
             <button onClick={onGoToInfo} className="text-gray-400 hover:text-white transition-colors" aria-label={t('aria_info')}>
                <QuestionMarkCircleIcon className="w-6 h-6" />
            </button>
            <button onClick={onGoToProfile} className="text-gray-400 hover:text-white transition-colors" aria-label={t('aria_my_profile')}>
                <UserIcon className="w-6 h-6" />
            </button>
            <button onClick={onLogout} className="text-gray-400 hover:text-white transition-colors" aria-label={t('aria_logout')}>
                <LogoutIcon className="w-6 h-6" />
            </button>
            {user.selfie && (
                <img src={user.selfie} alt={t('aria_user_selfie')} className="w-10 h-10 rounded-full object-cover border-2 border-fuchsia-500" />
            )}
          </div>
        </div>
      </header>
      
      <main className="p-4">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-6 mb-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">{t('main_view_create_title')}</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                    <h3 className="font-semibold mb-2">{t('main_view_step1')}</h3>
                    <div className="flex flex-wrap gap-2">
                        {STYLE_OPTIONS.map(opt => (
                            <button key={opt.id} onClick={() => { setSelectedStyle(opt); setIsCustom(false); }} className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedStyle?.id === opt.id && !isCustom ? 'bg-fuchsia-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>{t(opt.name)}</button>
                        ))}
                         <button onClick={() => { setIsCustom(true); setSelectedStyle(null); }} className={`px-3 py-1 text-sm rounded-full transition-colors ${isCustom ? 'bg-fuchsia-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>{t('main_view_style_other')}</button>
                    </div>
                     {isCustom && (
                        <input
                        type="text"
                        value={customStyle}
                        onChange={(e) => setCustomStyle(e.target.value)}
                        placeholder={t('main_view_style_placeholder')}
                        className="w-full mt-3 px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                        />
                    )}
               </div>
               <div className="flex flex-col justify-between">
                    <div>
                        <h3 className="font-semibold mb-2">{t('main_view_step2')}</h3>
                        <button
                            onClick={handleGenerate}
                            disabled={!canGenerate}
                            className="w-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity duration-300"
                            >
                            {cooldownTime > Date.now() ? (
                                <span>{t('main_view_wait_button')} {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
                            ) : (
                                t('main_view_generate_button')
                            )}
                        </button>
                    </div>
                     {cooldownTime > Date.now() ? (
                        <div className="text-center mt-2 p-3 bg-gray-700/50 rounded-lg">
                           <p className="font-semibold text-fuchsia-400">{t('main_view_pro_promo_title')}</p>
                           <p className="text-xs text-gray-300 mt-1">{t('main_view_pro_promo_subtitle')}</p>
                           <button onClick={onGoToPro} className="mt-2 text-sm bg-white text-gray-900 font-bold py-1 px-4 rounded-full hover:bg-gray-200 transition-colors">
                            {t('main_view_pro_promo_button')}
                           </button>
                        </div>
                     ) : (
                         <p className="text-xs text-gray-400 text-center mt-2">{t('main_view_cooldown_message', COOLDOWN_MINUTES)}</p>
                     )}
               </div>
           </div>
        </div>

        <CommunityFeed images={images} onLike={onLike} onShare={onShare} onImageSelect={onImageSelect} onGenerate={onGenerate} cooldownTime={cooldownTime} t={t} language={language} />
      </main>
    </div>
  );
};

export default MainView;