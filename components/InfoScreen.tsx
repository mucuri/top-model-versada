import React from 'react';
import { ArrowLeftIcon } from './icons';
import { APP_NAME } from '../constants';

interface InfoScreenProps {
  onBack: () => void;
}

const InfoScreen: React.FC<InfoScreenProps> = ({ onBack }) => {
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
        <h1 className="text-2xl font-bold">Informações</h1>
      </header>

      <main className="max-w-3xl mx-auto space-y-8 pb-10">
        {/* O que é o App? */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-fuchsia-400 mb-3">O que é o {APP_NAME}?</h2>
          <p className="text-gray-300">
            {APP_NAME} é o seu estúdio de moda pessoal, alimentado por inteligência artificial. Transforme uma simples selfie em um portfólio de modelo profissional, experimentando estilos de grandes marcas e cenários deslumbrantes. É o primeiro passo para a sua carreira dos sonhos.
          </p>
        </div>

        {/* FAQ */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-fuchsia-400 mb-4">Perguntas Frequentes (FAQ)</h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-semibold text-white">Como a minha selfie é usada?</h3>
              <p>Sua selfie é usada como base para o rosto do modelo nas fotos geradas. A IA integra seu rosto de forma realista nas poses e estilos que você escolher.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white">Posso usar fotos de outras pessoas?</h3>
              <p>Na versão gratuita, você só pode usar a selfie que tirou no cadastro. A versão PLUS permite que você faça upload de outras fotos.</p>
            </div>
             <div>
              <h3 className="font-semibold text-white">As minhas imagens são privadas?</h3>
              <p>As imagens que você gera aparecem na Community Feed por 7 dias, visíveis a outros usuários, como especificado nos Termos de Serviço.</p>
            </div>
          </div>
        </div>
        
        {/* Planos */}
        <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-fuchsia-400 mb-3">Planos PLUS e PRO</h2>
            <p className="text-gray-300 mb-4">Eleve sua experiência e acelere sua carreira com nossos planos:</p>
            <div className="space-y-4">
                <div className="p-4 bg-gray-700/50 rounded-md border-l-4 border-cyan-500">
                    <h3 className="font-bold text-lg text-cyan-400">PLUS</h3>
                    <p className="text-gray-300">Permite que você faça o upload de qualquer foto do seu dispositivo, dando mais liberdade criativa.</p>
                </div>
                 <div className="p-4 bg-gray-700/50 rounded-md border-l-4 border-fuchsia-500">
                    <h3 className="font-bold text-lg text-fuchsia-400">PRO</h3>
                    <p className="text-gray-300">Gerações ilimitadas sem espera, qualidade superior (HD), sem marca d'água e acesso a estilos e poses exclusivas.</p>
                </div>
            </div>
        </div>
        
        {/* Contatos e Social */}
        <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-fuchsia-400 mb-3">Contatos e Redes Sociais</h2>
            <p className="text-gray-300 mb-4">Siga-nos e fique por dentro das novidades!</p>
            <div className="flex space-x-4">
                 <a href="#" className="text-gray-300 hover:text-white transition-colors">Instagram</a>
                 <a href="#" className="text-gray-300 hover:text-white transition-colors">TikTok</a>
                 <a href="#" className="text-gray-300 hover:text-white transition-colors">Contato por E-mail</a>
            </div>
        </div>

      </main>
    </div>
  );
};

export default InfoScreen;
