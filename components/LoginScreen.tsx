import React from 'react';
import { APP_NAME } from '../constants';
import { Language } from '../types';

interface LoginScreenProps {
  onLogin: () => void;
  // Fix: Update type for t function to allow for arguments
  t: (key: string, ...args: any[]) => string;
  language: Language;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, t }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 text-center">
      <div className="w-full max-w-md">
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 mb-4">
          {APP_NAME}
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          {t('login_subtitle')}
        </p>
        <button
          onClick={onLogin}
          className="w-full bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <i className="fab fa-google text-red-500"></i>
          <span>{t('login_button')}</span>
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
