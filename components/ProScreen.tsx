import React, { useState } from 'react';
import { ArrowLeftIcon, CheckCircleIcon } from './icons';

interface ProScreenProps {
  onBack: () => void;
}

const ProScreen: React.FC<ProScreenProps> = ({ onBack }) => {
    const [whatsapp, setWhatsapp] = useState('');

    const handlePlusSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Obrigado! Em breve você receberá novidades no WhatsApp: ${whatsapp}. A função de upload foi liberada! (simulação)`);
        onBack();
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <header className="relative flex justify-center items-center mb-6">
                <button onClick={onBack} className="absolute left-0 p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">Planos</h1>
            </header>

            <main className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500">
                        Desbloqueie seu Potencial Máximo
                    </h2>
                    <p className="text-gray-400 mt-2">Escolha o plano perfeito para acelerar sua carreira de modelo.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* PLUS Plan */}
                    <div className="bg-gray-800 border border-cyan-500/50 rounded-xl p-6 flex flex-col shadow-lg shadow-cyan-500/10">
                        <h3 className="text-2xl font-bold text-cyan-400">PLUS</h3>
                        <p className="text-gray-400 mt-1 mb-4">Pagamento Único</p>
                        
                        <div className="mb-4">
                            <p className="text-lg font-semibold">Desbloqueie o Upload de Fotos</p>
                            <p className="text-sm text-gray-400">Use qualquer foto do seu dispositivo para gerar imagens, não apenas a sua selfie!</p>
                        </div>

                        <form onSubmit={handlePlusSubmit} className="mt-auto">
                           <label htmlFor="whatsapp" className="text-sm font-medium text-gray-300">Cadastre seu WhatsApp para novidades</label>
                           <input
                             id="whatsapp"
                             type="tel"
                             value={whatsapp}
                             onChange={(e) => setWhatsapp(e.target.value)}
                             placeholder="(XX) XXXXX-XXXX"
                             required
                             className="w-full mt-2 px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                           />
                           <button type="submit" className="w-full mt-4 bg-cyan-500 text-white font-bold py-3 rounded-md hover:bg-cyan-600 transition-colors">
                            Desbloquear com WhatsApp
                           </button>
                        </form>
                    </div>

                    {/* PRO Plan */}
                    <div className="bg-gray-800 border border-fuchsia-500/50 rounded-xl p-6 flex flex-col shadow-lg shadow-fuchsia-500/10">
                        <h3 className="text-2xl font-bold text-fuchsia-400">PRO</h3>
                        <p className="text-gray-400 mt-1 mb-4">A experiência completa de modelo</p>

                        <ul className="space-y-3 mb-6">
                            <li className="flex items-center">
                                <CheckCircleIcon className="w-5 h-5 text-fuchsia-400 mr-2"/> Gerações ilimitadas (sem espera)
                            </li>
                            <li className="flex items-center">
                                <CheckCircleIcon className="w-5 h-5 text-fuchsia-400 mr-2"/> Qualidade de imagem superior (HD)
                            </li>
                            <li className="flex items-center">
                                <CheckCircleIcon className="w-5 h-5 text-fuchsia-400 mr-2"/> Sem marca d'água nas fotos
                            </li>
                             <li className="flex items-center">
                                <CheckCircleIcon className="w-5 h-5 text-fuchsia-400 mr-2"/> Acesso a estilos e poses exclusivas
                            </li>
                        </ul>
                        
                        <div className="mt-auto">
                             <p className="text-center text-3xl font-bold mb-4">R$ 29,90<span className="text-lg font-normal text-gray-400">/mês</span></p>
                             <button onClick={() => alert('Sistema de pagamento em breve!')} className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-bold py-3 rounded-md hover:opacity-90 transition-opacity">
                                Assinar PRO
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProScreen;
