import React, { useState, useEffect } from 'react';

interface ProfileSetupProps {
  suggestedName: string;
  country: string;
  onProfileComplete: (name: string, city: string) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ suggestedName, country, onProfileComplete }) => {
  const [name, setName] = useState(suggestedName);
  const [city, setCity] = useState('');

  useEffect(() => {
    setName(suggestedName);
  }, [suggestedName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && city.trim()) {
      onProfileComplete(name, city);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-sm bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-white mb-2">Complete seu Perfil</h2>
        <p className="text-center text-gray-400 mb-6">Estamos quase prontos para sua estreia!</p>
        <form onSubmit={handleSubmit}>
           <div className="mb-4">
            <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">País</label>
            <p id="country" className="w-full px-3 py-2 bg-gray-700/50 text-gray-300 border border-gray-600 rounded-md">{country}</p>
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome de Usuário</label>
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
            <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">Sua Cidade</label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder="Ex: São Paulo"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity duration-300 disabled:opacity-50"
            disabled={!city.trim() || !name.trim()}
          >
            Continuar para a Selfie
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;