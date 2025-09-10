import React from 'react';
import { User, Language } from '../types';
import { ArrowLeftIcon } from './icons';

interface ProfileScreenProps {
  user: User;
  onBack: () => void;
  onGoToPayment: () => void;
  // Fix: Update type for t function to allow for arguments
  t: (key: string, ...args: any[]) => string;
  language: Language;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onBack, onGoToPayment, t }) => {

  const countryToFlag = (countryName: string): string => {
    const flags: { [key: string]: string } = { 'Brasil': '🇧🇷', 'Italia': '🇮🇹', 'Italy': '🇮🇹' };
    return flags[countryName] || '🌍';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="relative flex justify-center items-center mb-8">
        <button onClick={onBack} className="absolute left-0 p-2 bg-gray-800 rounded-full hover:bg-gray-700">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">{t('profile_screen_title')}</h1>
      </header>

      <main className="max-w-md mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <img src={user.selfie || ''} alt="User selfie" className="w-32 h-32 rounded-full object-cover border-4 border-fuchsia-500" />
            <div 
              onClick={onGoToPayment}
              className="absolute inset-0 bg-black/70 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-2 text-center"
            >
              <i className="fa-solid fa-lock text-yellow-400 mb-1"></i>
              <span className="text-white text-sm font-bold">{t('profile_screen_change_selfie')}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">{t('profile_setup_username_label')}</label>
            <div className="relative">
              <input type="text" value={user.name} disabled className="w-full mt-1 px-3 py-2 bg-gray-800/50 text-gray-300 border border-gray-700 rounded-md cursor-not-allowed" />
              <i className="fa-solid fa-lock text-gray-500 absolute right-3 top-1/2 -translate-y-1/2"></i>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">{t('profile_setup_city_label')}</label>
            <input type="text" value={user.city} disabled className="w-full mt-1 px-3 py-2 bg-gray-800/50 text-gray-300 border border-gray-700 rounded-md cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">{t('profile_setup_country_label')}</label>
            <p className="w-full mt-1 px-3 py-2 bg-gray-800/50 text-gray-300 border border-gray-700 rounded-md">
              {countryToFlag(user.country)} {user.country}
            </p>
          </div>
        </div>

        <div className="mt-10 text-center p-4 bg-gray-800 border border-fuchsia-500/30 rounded-lg">
            <h3 className="font-bold text-lg text-fuchsia-400">{t('profile_screen_pro_title')}</h3>
            <p className="text-sm text-gray-300 mt-2 mb-4">{t('profile_screen_pro_desc')}</p>
            <button onClick={onGoToPayment} className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-bold py-3 rounded-md hover:opacity-90 transition-opacity">
                {t('profile_screen_pro_button')}
            </button>
        </div>
      </main>
    </div>
  );
};

export default ProfileScreen;