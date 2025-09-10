import React, { useState } from 'react';
import { APP_NAME } from '../constants';
import { Language } from '../types';

interface TermsScreenProps {
    onAgree: () => void;
    // Fix: Update type for t function to allow for arguments
    t: (key: string, ...args: any[]) => string;
    language: Language;
}

const TermsScreen: React.FC<TermsScreenProps> = ({ onAgree, t }) => {
    const [agreed, setAgreed] = useState(false);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-lg bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-white mb-4">{t('terms_title')}</h2>
                <div className="h-64 overflow-y-auto bg-gray-700/50 p-4 rounded-md text-gray-300 text-sm space-y-3 mb-6 border border-gray-600">
                    <p>{t('terms_welcome', APP_NAME)}</p>
                    <p>{t('terms_intro')}</p>
                    <p><strong>1. {t('terms_1_title')}:</strong> {t('terms_1_text')}</p>
                    <p><strong>2. {t('terms_2_title')}:</strong> {t('terms_2_text')}</p>
                    <p><strong>3. {t('terms_3_title')}:</strong> {t('terms_3_text', APP_NAME, APP_NAME)}</p>
                    <p><strong>4. {t('terms_4_title')}:</strong> {t('terms_4_text', APP_NAME)}</p>
                    <p><strong>5. {t('terms_5_title')}:</strong> {t('terms_5_text')}</p>
                </div>
                <div className="flex items-center mb-6">
                    <input
                        id="agree-checkbox"
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                    />
                    <label htmlFor="agree-checkbox" className="ml-2 block text-sm text-gray-200">
                        {t('terms_checkbox_label')}
                    </label>
                </div>
                <button
                    onClick={onAgree}
                    disabled={!agreed}
                    className="w-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity duration-300"
                >
                    {t('terms_agree_button')}
                </button>
            </div>
        </div>
    );
};

export default TermsScreen;
