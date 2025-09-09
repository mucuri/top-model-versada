import React, { useState } from 'react';
import { APP_NAME } from '../constants';

interface TermsScreenProps {
    onAgree: () => void;
}

const TermsScreen: React.FC<TermsScreenProps> = ({ onAgree }) => {
    const [agreed, setAgreed] = useState(false);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-lg bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-white mb-4">Termos de Serviço e Consentimento</h2>
                <div className="h-64 overflow-y-auto bg-gray-700/50 p-4 rounded-md text-gray-300 text-sm space-y-3 mb-6 border border-gray-600">
                    <p>Bem-vindo(a) ao {APP_NAME}!</p>
                    <p>Ao usar nosso aplicativo, você concorda com os seguintes termos:</p>
                    <p><strong>1. Gênero na Moda:</strong> Você entende que a moda é uma forma de arte e expressão. As imagens geradas podem apresentar estilos andróginos ou não convencionais. Os estilistas frequentemente vestem modelos masculinos com roupas que podem parecer femininas e vice-versa. O aplicativo refletirá essa diversidade criativa.</p>
                    <p><strong>2. Exibição na Comunidade:</strong> Você autoriza que as imagens geradas com seu rosto apareçam na seção "Comunidade" do aplicativo por um período de até 7 (sete) dias. Essas imagens serão visíveis para outros usuários da plataforma.</p>
                    <p><strong>3. Compartilhamento Externo:</strong> As imagens na comunidade podem ser compartilhadas por outros usuários para fora do aplicativo {APP_NAME}, através de links ou downloads. O {APP_NAME} não se responsabiliza pelo uso de sua imagem fora da nossa plataforma.</p>
                    <p><strong>4. Uso de Dados e Imagens:</strong> Você concede ao {APP_NAME} o direito de usar e armazenar, a nosso critério, todos os dados fornecidos (nome de usuário, cidade) e as imagens geradas por você na plataforma para fins de melhoria do serviço, marketing e operações internas.</p>
                    <p><strong>5. Responsabilidade:</strong> Use o aplicativo de forma responsável. Não envie imagens de terceiros sem consentimento ou conteúdo que seja ilegal ou ofensivo.</p>
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
                        Eu li, entendi e concordo com os Termos de Serviço.
                    </label>
                </div>
                <button
                    onClick={onAgree}
                    disabled={!agreed}
                    className="w-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity duration-300"
                >
                    Concordo e Continuar
                </button>
            </div>
        </div>
    );
};

export default TermsScreen;
