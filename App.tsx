import React, { useState, useEffect } from 'react';
import { AppStep, User, GeneratedImage } from './types';
import LoginScreen from './components/LoginScreen';
import ProfileSetup from './components/ProfileSetup';
import SelfieCapture from './components/SelfieCapture';
import StyleSelector from './components/StyleSelector';
import MainView from './components/MainView';
import TermsScreen from './components/TermsScreen';
import ProScreen from './components/ProScreen';
import InfoScreen from './components/InfoScreen';
import ImageModal from './components/ImageModal';
import { LoadingSpinner, CheckCircleIcon } from './components/icons';
import { generateFashionImage } from './services/geminiService';
import { APP_NAME, COOLDOWN_MINUTES } from './constants';

const USER_STORAGE_KEY = 'top-model-ai-user';
const IMAGES_STORAGE_KEY = 'top-model-ai-images';
const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

// Mock database of usernames for uniqueness check simulation
const existingUsernames = new Set(['JohnModel', 'JaneModel']);

// Constants for the GeneratingScreen component
const GENERATING_STEPS = [
    { text: "Analisando traços da selfie...", duration: 1500 },
    { text: "Esboçando 6 poses exclusivas...", duration: 2500 },
    { text: "Aplicando o estilo de moda selecionado...", duration: 3000 },
    { text: "Ajustando iluminação e cenário...", duration: 2000 },
    { text: "Renderizando em alta definição...", duration: 3500 },
    { text: "Adicionando a marca d'água final...", duration: 1000 }
];

const GENERATING_TIPS = [
    "Dica de mestre: a confiança é o seu melhor acessório.",
    "A passarela espera por você...",
    "Preparando seu close-up...",
    "Cada grande modelo começou com uma única foto.",
    "Lembre-se: você é a estrela."
];


const GeneratingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentTip, setCurrentTip] = useState(GENERATING_TIPS[0]);

  useEffect(() => {
    // Step progression with variable timing
    if (currentStep < GENERATING_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, GENERATING_STEPS[currentStep].duration);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  useEffect(() => {
    // Tip rotation
    const tipInterval = setInterval(() => {
      setCurrentTip(GENERATING_TIPS[Math.floor(Math.random() * GENERATING_TIPS.length)]);
    }, 3500);

    return () => clearInterval(tipInterval);
  }, []);

  const progress = Math.round(((currentStep + 1) / GENERATING_STEPS.length) * 100);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 text-center">
        <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500">
                Gerando sua obra-prima...
            </h2>
            <p className="text-gray-400 mt-2 mb-6">A IA está criando seu portfólio. Isso pode levar um minuto.</p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700/50 rounded-full h-2.5 mb-2">
                <div 
                    className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${progress}%` }}>
                </div>
            </div>
            <p className="text-sm font-semibold text-cyan-400 mb-6">{progress}%</p>
            
            <div className="text-left space-y-3">
                {GENERATING_STEPS.map((step, index) => (
                <div key={index} className={`flex items-center p-3 rounded-lg transition-all duration-500 ${index <= currentStep ? 'bg-gray-800' : 'bg-gray-800/50'}`}>
                    {index < currentStep ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    ) : index === currentStep ? (
                    <div className="w-5 h-5 mr-3 flex-shrink-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-fuchsia-500"></div>
                    </div>
                    ) : (
                    <div className="w-5 h-5 mr-3 flex-shrink-0">
                        <div className="w-4 h-4 rounded-full bg-gray-600"></div>
                    </div>
                    )}
                    <span className={`transition-colors duration-500 ${index <= currentStep ? 'text-white' : 'text-gray-500'}`}>{step.text}</span>
                </div>
                ))}
            </div>
            
            <p className="text-gray-500 mt-8 text-sm italic">"{currentTip}"</p>
        </div>
    </div>
  );
};


const App: React.FC = () => {
  const [appStep, setAppStep] = useState<AppStep>(AppStep.LOGIN);
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [communityImages, setCommunityImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  // Load state from localStorage on initial boot
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);

        if (parsedUser.hasCompletedSetup) {
          const storedImages = localStorage.getItem(IMAGES_STORAGE_KEY);
          if (storedImages) {
            const parsedImages: GeneratedImage[] = JSON.parse(storedImages);
            const sevenDaysAgo = Date.now() - SEVEN_DAYS_IN_MS;
            const recentImages = parsedImages.filter(img => new Date(img.createdAt).getTime() > sevenDaysAgo);
            setCommunityImages(recentImages);
          }
          setAppStep(AppStep.MAIN_VIEW);
        } else {
          // If setup wasn't completed, guide user back.
          if (!parsedUser.city) setAppStep(AppStep.PROFILE_SETUP);
          else if (!parsedUser.selfie) setAppStep(AppStep.SELFIE_CAPTURE);
          else setAppStep(AppStep.STYLE_SELECTION);
        }
      }
    } catch (err) {
      console.error("Failed to load state from localStorage", err);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(IMAGES_STORAGE_KEY);
    }
  }, []);

  // Save user state to localStorage whenever it changes
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } catch (err) {
        console.error("Failed to save user state to localStorage", err);
      }
    }
  }, [user]);

  // Save community images to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(IMAGES_STORAGE_KEY, JSON.stringify(communityImages));
    } catch (err) {
      console.error("Failed to save images to localStorage", err);
    }
  }, [communityImages]);


  const handleLogin = () => {
    const mockGoogleData = {
      firstName: 'Gaetano',
      country: 'Brasil',
    };
    let baseUsername = `${mockGoogleData.firstName}Model`;
    let finalUsername = baseUsername;
    let counter = 1;
    while (existingUsernames.has(finalUsername)) {
        finalUsername = `${baseUsername}${counter}`;
        counter++;
    }
    setUser({ name: finalUsername, country: mockGoogleData.country });
    setAppStep(AppStep.TERMS_AGREEMENT);
  };

  const handleTermsAgree = () => {
    setAppStep(AppStep.PROFILE_SETUP);
  };

  const handleProfileComplete = (name: string, city: string) => {
    setUser(prevUser => ({ ...prevUser, name, city, selfie: null }));
    existingUsernames.add(name);
    setAppStep(AppStep.SELFIE_CAPTURE);
  };

  const handleSelfieConfirm = (imageData: string) => {
    if (user) {
      setUser({ ...user, selfie: imageData });
      setAppStep(AppStep.STYLE_SELECTION);
    }
  };

  const handleStyleSelect = async (prompt: string) => {
    if (!user || !user.selfie || !user.name) {
      setError("Erro: Dados do usuário incompletos.");
      setAppStep(AppStep.MAIN_VIEW);
      return;
    }
    setAppStep(AppStep.GENERATING);
    setError(null);
    try {
      const imageUrl = await generateFashionImage(user.selfie, prompt);
      const newImage: GeneratedImage = {
        id: new Date().toISOString(),
        imageUrl,
        prompt,
        author: user.name,
        likes: 0,
        likedByUser: false,
        createdAt: new Date().toISOString(), // Add creation date
      };
      setCommunityImages(prev => [newImage, ...prev]);
      setCooldownTime(Date.now() + COOLDOWN_MINUTES * 60 * 1000);
      
      // Mark setup as complete for the user after first successful generation
      if (!user.hasCompletedSetup) {
          setUser(prevUser => ({...prevUser, hasCompletedSetup: true}));
      }

    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    } finally {
      setAppStep(AppStep.MAIN_VIEW);
    }
  };

  const handleLike = (imageId: string) => {
    setCommunityImages(prevImages =>
      prevImages.map(image => {
        if (image.id === imageId) {
          return { 
            ...image, 
            likes: image.likedByUser ? image.likes - 1 : image.likes + 1,
            likedByUser: !image.likedByUser 
          };
        }
        return image;
      })
    );
    if (selectedImage && selectedImage.id === imageId) {
        setSelectedImage(prev => prev ? { ...prev, likes: prev.likedByUser ? prev.likes - 1 : prev.likes + 1, likedByUser: !prev.likedByUser } : null);
    }
  };

  const handleShare = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'top-model-ai-image.jpg', { type: blob.type });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${APP_NAME} - Criação de @${image.author}`,
          text: `Olha que imagem incrível eu criei com o ${APP_NAME}! Estilo: ${image.prompt}`,
          files: [file],
        });
      } else {
        const link = document.createElement('a');
        link.href = image.imageUrl;
        link.download = `top-model-ai-${image.author}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Erro ao compartilhar/baixar a imagem:', error);
      alert('Não foi possível compartilhar a imagem. Iniciando o download.');
       const link = document.createElement('a');
        link.href = image.imageUrl;
        link.download = `top-model-ai-${image.author}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };
  
  const handleImageSelect = (image: GeneratedImage) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleGoToProScreen = () => {
    setAppStep(AppStep.PRO_SCREEN);
  };
  
  const handleGoToMainView = () => {
    setAppStep(AppStep.MAIN_VIEW);
  };
  
  const handleGoToInfoScreen = () => {
    setAppStep(AppStep.INFO_SCREEN);
  }

  const handleGenerateAndCloseModal = (prompt: string) => {
    handleCloseModal();
    // Use a small timeout to let the modal closing animation finish
    setTimeout(() => {
      handleStyleSelect(prompt);
    }, 200);
  };


  const renderContent = () => {
    switch (appStep) {
      case AppStep.LOGIN:
        return <LoginScreen onLogin={handleLogin} />;
      case AppStep.TERMS_AGREEMENT:
        return <TermsScreen onAgree={handleTermsAgree} />;
      case AppStep.PROFILE_SETUP:
        if (!user || !user.name || !user.country) {
          setAppStep(AppStep.LOGIN);
          return null;
        }
        return <ProfileSetup suggestedName={user.name} country={user.country} onProfileComplete={handleProfileComplete} />;
      case AppStep.SELFIE_CAPTURE:
        return <SelfieCapture onSelfieConfirm={handleSelfieConfirm} />;
      case AppStep.STYLE_SELECTION:
        return <StyleSelector onStyleSelect={handleStyleSelect} />;
      case AppStep.GENERATING:
        return <GeneratingScreen />;
      case AppStep.MAIN_VIEW:
        if (!user || !user.name || !user.city || !user.country) {
          setAppStep(AppStep.LOGIN);
          return null;
        }
        return <MainView user={user as User} images={communityImages} onGenerate={handleStyleSelect} cooldownTime={cooldownTime} onLike={handleLike} onShare={handleShare} onImageSelect={handleImageSelect} onGoToPro={handleGoToProScreen} onGoToInfo={handleGoToInfoScreen} />;
      case AppStep.PRO_SCREEN:
        return <ProScreen onBack={handleGoToMainView} />;
      case AppStep.INFO_SCREEN:
        return <InfoScreen onBack={handleGoToMainView} />;
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div>
      {error && (
         <div className="bg-red-500 text-white p-4 fixed top-0 left-0 right-0 z-50 text-center">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="absolute top-1/2 right-4 -translate-y-1/2 font-bold">X</button>
        </div>
      )}
      {renderContent()}
      {selectedImage && <ImageModal image={selectedImage} onClose={handleCloseModal} onLike={handleLike} onShare={handleShare} onGenerate={handleGenerateAndCloseModal} cooldownTime={cooldownTime} />}
    </div>
  );
};

export default App;
