import React, { useState } from 'react';
import { ArrowLeftIcon, CheckCircleIcon, LockIcon } from './icons';
import { Language } from '../types';

interface PaymentScreenProps {
  onBack: () => void;
  t: (key: string, ...args: any[]) => string;
  language: Language;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ onBack, t }) => {
    const [selectedMethod, setSelectedMethod] = useState('card');

    const paymentMethods = [
        { id: 'pix', name: t('payment_screen_pix'), icon: 'fa-brands fa-pix' },
        { id: 'card', name: t('payment_screen_card'), icon: 'fa-regular fa-credit-card' },
        { id: 'paypal', name: t('payment_screen_paypal'), icon: 'fa-brands fa-paypal' },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 animate-fade-in">
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
            <header className="relative flex justify-center items-center mb-6">
                <button onClick={onBack} className="absolute left-0 p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">{t('payment_screen_title')}</h1>
            </header>

            <main className="max-w-lg mx-auto">
                <div className="text-center mb-8">
                    <p className="text-gray-400 mt-2">{t('payment_screen_subtitle')}</p>
                </div>

                <div className="bg-gray-800 border border-fuchsia-500/50 rounded-xl p-6 flex flex-col shadow-lg shadow-fuchsia-500/10">
                    <div className="text-center">
                        <p className="text-4xl font-bold">{t('payment_screen_price')}<span className="text-xl font-normal text-gray-400">{t('payment_screen_monthly')}</span></p>
                    </div>

                    <ul className="space-y-3 my-6 text-sm">
                        <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-fuchsia-400 mr-2 flex-shrink-0"/> {t('payment_screen_feature1')}</li>
                        <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-fuchsia-400 mr-2 flex-shrink-0"/> {t('payment_screen_feature2')}</li>
                        <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-fuchsia-400 mr-2 flex-shrink-0"/> {t('payment_screen_feature3')}</li>
                        <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-fuchsia-400 mr-2 flex-shrink-0"/> {t('payment_screen_feature4')}</li>
                    </ul>

                    <div className="border-t border-gray-700 pt-6">
                         <h3 className="font-semibold text-center mb-4">{t('payment_screen_select_method')}</h3>
                         <div className="space-y-3 mb-6">
                            {paymentMethods.map(method => (
                                <button 
                                    key={method.id} 
                                    onClick={() => setSelectedMethod(method.id)}
                                    className={`w-full flex items-center p-4 rounded-lg border-2 transition-all ${selectedMethod === method.id ? 'bg-fuchsia-500/10 border-fuchsia-500' : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'}`}
                                >
                                    <i className={`${method.icon} text-2xl mr-4 w-8 text-center`}></i>
                                    <span className="font-semibold">{method.name}</span>
                                    <div className={`w-5 h-5 rounded-full border-2 ml-auto flex-shrink-0 ${selectedMethod === method.id ? 'bg-fuchsia-500 border-fuchsia-400' : 'border-gray-500'}`}></div>
                                </button>
                            ))}
                         </div>

                         <button onClick={() => alert(t('alert_payment_soon'))} className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-bold py-3 rounded-md hover:opacity-90 transition-opacity">
                            {t('payment_screen_pay_button')}
                        </button>
                    </div>

                    <div className="flex items-center justify-center mt-4 text-xs text-gray-400">
                        <LockIcon className="w-4 h-4 mr-1.5"/>
                        <span>{t('payment_screen_secure_payment')}</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaymentScreen;