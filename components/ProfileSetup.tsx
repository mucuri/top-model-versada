import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { UserIcon, CityIcon, GlobeIcon } from './icons';

interface ProfileSetupProps {
  suggestedName: string;
  country: string;
  onProfileComplete: (name: string, city: string, country: string, language: Language) => void;
  t: (key: string, ...args: any[]) => string;
  language: Language;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ suggestedName, country, onProfileComplete, t, language }) => {
  const [name, setName] = useState(suggestedName);
  const [city, setCity] = useState('');
  const [currentCountry, setCurrentCountry] = useState(country);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);

  useEffect(() => {
    setName(suggestedName);
  }, [suggestedName]);
  
  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    if(lang === 'pt') {
        setCurrentCountry('Brasil');
    } else if (lang === 'it') {
        setCurrentCountry('Italia');
    } else {
        setCurrentCountry('');
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && city.trim() && currentCountry.trim()) {
      onProfileComplete(name, city, currentCountry, selectedLanguage);
    }
  };

  const languageOptions: { lang: Language; flag: string; label: string; gradient: string; country: string }[] = [
    { lang: 'pt', flag: '🇧🇷', label: 'Português', gradient: 'from-green-500/20 via-yellow-400/20 to-blue-500/20', country: 'Brasil' },
    { lang: 'it', flag: '🇮🇹', label: 'Italiano', gradient: 'from-green-500/20 via-gray-200/20 to-red-500/20', country: 'Italia' },
    { lang: 'en', flag: '🌍', label: 'English', gradient: 'from-cyan-500/20 to-blue-500/20', country: 'World' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-fuchsia-900/30 p-4">
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700/50">
        <h2 className="text-3xl font-bold text-center text-white mb-2">{t('profile_setup_title')}</h2>
        <p className="text-center text-gray-400 mb-8">{t('profile_setup_subtitle')}</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3 text-center">{t('profile_setup_language_label')}</label>
            <div className="grid grid-cols-3 gap-3">
              {languageOptions.map(({ lang, flag, label, gradient, country: langCountry }) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLanguageChange(lang)}
                  className={`text-center transition-all duration-300 p-3 rounded-lg border-2 ${selectedLanguage === lang ? 'border-fuchsia-500 scale-105' : 'border-gray-700 hover:border-gray-500'} bg-gradient-to-br ${gradient}`}
                >
                  <span className="text-4xl">{flag}</span>
                  <p className="block text-xs mt-2 font-semibold">{label}</p>
                  <p className="block text-xs text-gray-400">{langCountry}</p>
                </button>
              ))}
            </div>
          </div>
          
          <div className="relative">
             <UserIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"/>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-700/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder={t('profile_setup_username_label')}
              required
            />
          </div>

          <div className="relative">
            <CityIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"/>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-700/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder={t('profile_setup_city_placeholder')}
              required
            />
          </div>

          <div className="relative">
            <GlobeIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"/>
            <input
              type="text"
              id="country"
              value={currentCountry}
              onChange={(e) => setCurrentCountry(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-700/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder={t('profile_setup_country_placeholder')}
              required
              readOnly={selectedLanguage !== 'en'} 
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 text-lg"
            disabled={!city.trim() || !name.trim() || !currentCountry.trim()}
          >
            {t('profile_setup_continue_button')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;