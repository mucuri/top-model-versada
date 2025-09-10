import React from 'react';
import { ArrowLeftIcon } from './icons';
import { APP_NAME } from '../constants';
import { Language } from '../types';

interface InfoScreenProps {
  onBack: () => void;
  // Fix: Update type for t function to allow for arguments
  t: (key: string, ...args: any[]) => string;
  language: Language;
}

const InfoScreen: React.FC<InfoScreenProps> = ({ onBack, t }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 animate-fade-in">
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
      <header className="relative flex justify-center items-center mb-6">
        <button onClick={onBack} className="absolute left-0 p-2 bg-gray-800 rounded-full hover:bg-gray-700">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">{t('info_screen_title')}</h1>
      </header>

      <main className="max-w-3xl mx-auto space-y-8 pb-10">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-fuchsia-400 mb-3">{t('info_screen_what_is_title', APP_NAME)}</h2>
          <p className="text-gray-300">
            {/* Fix: Removed extra APP_NAME argument from t function call */}
            {t('info_screen_what_is_desc', APP_NAME)}
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-fuchsia-400 mb-4">{t('info_screen_faq_title')}</h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-semibold text-white">{t('info_screen_faq1_q')}</h3>
              <p>{t('info_screen_faq1_a')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-white">{t('info_screen_faq2_q')}</h3>
              <p>{t('info_screen_faq2_a')}</p>
            </div>
             <div>
              <h3 className="font-semibold text-white">{t('info_screen_faq3_q')}</h3>
              <p>{t('info_screen_faq3_a')}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-fuchsia-400 mb-3">{t('info_screen_plans_title')}</h2>
            <p className="text-gray-300 mb-4">{t('info_screen_plans_desc')}</p>
            <div className="space-y-4">
                <div className="p-4 bg-gray-700/50 rounded-md border-l-4 border-cyan-500">
                    <h3 className="font-bold text-lg text-cyan-400">PLUS</h3>
                    <p className="text-gray-300">{t('info_screen_plus_desc')}</p>
                </div>
                 <div className="p-4 bg-gray-700/50 rounded-md border-l-4 border-fuchsia-500">
                    <h3 className="font-bold text-lg text-fuchsia-400">PRO</h3>
                    <p className="text-gray-300">{t('info_screen_pro_desc')}</p>
                </div>
            </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-fuchsia-400 mb-3">{t('info_screen_contact_title')}</h2>
            <p className="text-gray-300 mb-4">{t('info_screen_contact_desc')}</p>
            <div className="flex space-x-4">
                 <a href="#" className="text-gray-300 hover:text-white transition-colors">Instagram</a>
                 <a href="#" className="text-gray-300 hover:text-white transition-colors">TikTok</a>
                 <a href="#" className="text-gray-300 hover:text-white transition-colors">{t('info_screen_contact_email')}</a>
            </div>
        </div>

      </main>
    </div>
  );
};

export default InfoScreen;
