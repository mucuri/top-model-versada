import React, { useState, useEffect } from 'react';
import { Language } from '../types';

interface ProfileSetupProps {
  suggestedName: string;
  country: string;
  onProfileComplete: (name: string, city: string, country: string, language: Language) => void;
  // Fix: Update type for t function to allow for arguments
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
        // For English ('en'), let the user type their country.
        setCurrentCountry('');
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && city.trim() && currentCountry.trim()) {
      onProfileComplete(name, city, currentCountry, selectedLanguage);
    }
  };

  const languageOptions: { lang: Language; flag: string; label: string }[] = [
    { lang: 'pt', flag: '🇧🇷', label: 'Português' },
    { lang: 'it', flag: '🇮🇹', label: 'Italiano' },
    { lang: 'en', flag: '🌍', label: 'World' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-sm bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-white mb-2">{t('profile_setup_title')}</h2>
        <p className="text-center text-gray-400 mb-6">{t('profile_setup_subtitle')}</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('profile_setup_language_label')}</label>
            <div className="flex justify-around items-center bg-gray-700/50 p-2 rounded-md">
              {languageOptions.map(({ lang, flag, label }) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLanguageChange(lang)}
                  className={`text-center transition-all duration-200 p-1 rounded-md ${selectedLanguage === lang ? 'ring-2 ring-fuchsia-500 ring-offset-2 ring-offset-gray-800' : 'opacity-60 hover:opacity-100'}`}
                >
                  <span className="text-2xl">{flag}</span>
                  <span className="block text-xs mt-1">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">{t('profile_setup_country_label')}</label>
             <input
              type="text"
              id="country"
              value={currentCountry}
              onChange={(e) => setCurrentCountry(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder={t('profile_setup_country_placeholder')}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">{t('profile_setup_username_label')}</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">{t('profile_setup_city_label')}</label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder={t('profile_setup_city_placeholder')}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity duration-300 disabled:opacity-50"
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