import React, { useState, useEffect, useCallback } from 'react';
import { AppStep, User, GeneratedImage, Language } from './types';
import LoginScreen from './components/LoginScreen';
import ProfileSetup from './components/ProfileSetup';
import SelfieCapture from './components/SelfieCapture';
import StyleSelector from './components/StyleSelector';
import MainView from './components/MainView';
import TermsScreen from './components/TermsScreen';
import PaymentScreen from './components/PaymentScreen';
import InfoScreen from './components/InfoScreen';
import ProfileScreen from './components/ProfileScreen';
import ImageModal from './components/ImageModal';
import { LoadingSpinner, CheckCircleIcon } from './components/icons';
import { generateFashionImage } from './services/geminiService';
import { APP_NAME, COOLDOWN_MINUTES } from './constants';
import { translations } from './translations';

const USER_STORAGE_KEY = 'top-model-ai-user';
const IMAGES_STORAGE_KEY = 'top-model-ai-images';
const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

const existingUsernames = new Set(['JohnModel', 'JaneModel']);

const App: React.FC = () => {
  const [appStep, setAppStep] = useState<AppStep>(AppStep.LOGIN);
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [communityImages, setCommunityImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState<boolean>(false);
  // Default language is now always Portuguese for new users
  const [language, setLanguage] = useState<Language>('pt');

  const t = useCallback((key: string, ...args: (string | number)[]) => {
    const translation = translations[key]?.[language] || key;
    if (args.length > 0) {
        return translation.replace(/\{(\d+)\}/g, (match, index) => {
            return String(args[parseInt(index)] ?? match);
        });
    }
    return translation;
  }, [language]);

  const GENERATING_STEPS = [
    { text: t('generating_step1'), duration: 1500 },
    { text: t('generating_step2'), duration: 2500 },
    { text: t('generating_step3'), duration: 3000 },
    { text: t('generating_step4'), duration: 2000 },
    { text: t('generating_step5'), duration: 3500 },
    { text: t('generating_step6'), duration: 1000 }
  ];

  const GENERATING_TIPS = [
    t('generating_tip1'),
    t('generating_tip2'),
    t('generating_tip3'),
    t('generating_tip4'),
    t('generating_tip5'),
  ];

  const GeneratingScreen = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [currentTip, setCurrentTip] = useState(GENERATING_TIPS[0]);

    useEffect(() => {
      if (currentStep < GENERATING_STEPS.length - 1) {
        const timer = setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, GENERATING_STEPS[currentStep].duration);
        return () => clearTimeout(timer);
      }
    }, [currentStep]);

    useEffect(() => {
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
            {t('generating_title')}
          </h2>
          <p className="text-gray-400 mt-2 mb-6">{t('generating_subtitle')}</p>
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
  
  const translateError = (errorCode: string) => {
    if(!errorCode) return t('error_unknown');
    const [key, ...args] = errorCode.split('|');
    return t(key, ...args);
  }

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setLanguage(parsedUser.language || 'pt'); // Default to PT if language is missing

        if (parsedUser.hasCompletedSetup) {
          setShowWelcomeBanner(true);
          const welcomeTimer = setTimeout(() => setShowWelcomeBanner(false), 2500);

          const storedImages = localStorage.getItem(IMAGES_STORAGE_KEY);
          if (storedImages) {
            const parsedImages: GeneratedImage[] = JSON.parse(storedImages);
            const sevenDaysAgo = Date.now() - SEVEN_DAYS_IN_MS;
            const recentImages = parsedImages.filter(img => new Date(img.createdAt).getTime() > sevenDaysAgo);
            setCommunityImages(recentImages);
          }
          setAppStep(AppStep.MAIN_VIEW);
          return () => clearTimeout(welcomeTimer);
        } else {
          if (!parsedUser.city) setAppStep(AppStep.PROFILE_SETUP);
          else if (!parsedUser.selfie) setAppStep(AppStep.SELFIE_CAPTURE);
          else setAppStep(AppStep.STYLE_SELECTION);
        }
      } else {
        // New user, default is already 'pt'
      }
    } catch (err) {
      console.error("Failed to load state from localStorage", err);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(IMAGES_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } catch (err) {
        console.error("Failed to save user state to localStorage", err);
      }
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(IMAGES_STORAGE_KEY, JSON.stringify(communityImages));
    } catch (err) {
      console.error("Failed to save images to localStorage", err);
    }
  }, [communityImages]);

  const handleLogin = () => {
    // Default country is Brasil
    const mockGoogleData = { firstName: 'Gaetano', country: 'Brasil' };
    let baseUsername = `${mockGoogleData.firstName}Model`;
    let finalUsername = baseUsername;
    let counter = 1;
    while (existingUsernames.has(finalUsername)) {
      finalUsername = `${baseUsername}${counter}`;
      counter++;
    }
    setUser({ name: finalUsername, country: mockGoogleData.country, language });
    setAppStep(AppStep.TERMS_AGREEMENT);
  };

  const handleLogout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(IMAGES_STORAGE_KEY);
    setUser(null);
    setCommunityImages([]);
    setAppStep(AppStep.LOGIN);
  };

  const handleTermsAgree = () => {
    setAppStep(AppStep.PROFILE_SETUP);
  };

  // Updated to accept country from the setup screen
  const handleProfileComplete = (name: string, city: string, country: string, selectedLanguage: Language) => {
    setUser(prevUser => ({ ...prevUser, name, city, country, language: selectedLanguage, selfie: null }));
    setLanguage(selectedLanguage);
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
    if (!user || !user.selfie || !user.name || !user.city || !user.country) {
      setError(t('error_incomplete_user_data'));
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
        authorCity: user.city,
        authorCountry: user.country,
        likes: 0,
        likedByUser: false,
        createdAt: new Date().toISOString(),
      };
      setCommunityImages(prev => [newImage, ...prev]);
      setCooldownTime(Date.now() + COOLDOWN_MINUTES * 60 * 1000);
      if (!user.hasCompletedSetup) {
        setUser(prevUser => ({ ...prevUser, hasCompletedSetup: true }));
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(translateError(e.message));
      } else {
        setError(t('error_unknown'));
      }
    } finally {
      setAppStep(AppStep.MAIN_VIEW);
    }
  };

  const handleLike = (imageId: string) => {
    setCommunityImages(prevImages =>
      prevImages.map(image => {
        if (image.id === imageId) {
          return { ...image, likes: image.likedByUser ? image.likes - 1 : image.likes + 1, likedByUser: !image.likedByUser };
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
          title: t('share_title', image.author),
          text: t('share_text', image.prompt),
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
      console.error(t('error_sharing'), error);
      alert(t('alert_share_failed'));
      const link = document.createElement('a');
      link.href = image.imageUrl;
      link.download = `top-model-ai-${image.author}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleImageSelect = (image: GeneratedImage) => setSelectedImage(image);
  const handleCloseModal = () => setSelectedImage(null);
  const handleGoToPaymentScreen = () => setAppStep(AppStep.PAYMENT_SCREEN);
  const handleGoToMainView = () => setAppStep(AppStep.MAIN_VIEW);
  const handleGoToInfoScreen = () => setAppStep(AppStep.INFO_SCREEN);
  const handleGoToProfileScreen = () => setAppStep(AppStep.PROFILE_SCREEN);

  const handleGenerateAndCloseModal = (prompt: string) => {
    handleCloseModal();
    setTimeout(() => handleStyleSelect(prompt), 200);
  };

  // Fix: Move commonProps out of renderContent to be accessible by ImageModal
  const commonProps = { t, language };

  const renderContent = () => {
    switch (appStep) {
      case AppStep.LOGIN:
        return <LoginScreen onLogin={handleLogin} {...commonProps} />;
      case AppStep.TERMS_AGREEMENT:
        return <TermsScreen onAgree={handleTermsAgree} {...commonProps} />;
      case AppStep.PROFILE_SETUP:
        if (!user || !user.name || !user.country) { setAppStep(AppStep.LOGIN); return null; }
        return <ProfileSetup suggestedName={user.name} country={user.country} onProfileComplete={handleProfileComplete} {...commonProps} />;
      case AppStep.SELFIE_CAPTURE:
        return <SelfieCapture onSelfieConfirm={handleSelfieConfirm} {...commonProps} />;
      case AppStep.STYLE_SELECTION:
        return <StyleSelector onStyleSelect={handleStyleSelect} {...commonProps} />;
      case AppStep.GENERATING:
        return <GeneratingScreen />;
      case AppStep.MAIN_VIEW:
        if (!user || !user.name || !user.city || !user.country) { setAppStep(AppStep.LOGIN); return null; }
        return <MainView user={user as User} images={communityImages} onGenerate={handleStyleSelect} cooldownTime={cooldownTime} onLike={handleLike} onShare={handleShare} onImageSelect={handleImageSelect} onGoToPayment={handleGoToPaymentScreen} onGoToInfo={handleGoToInfoScreen} onGoToProfile={handleGoToProfileScreen} onLogout={handleLogout} {...commonProps} />;
      case AppStep.PAYMENT_SCREEN:
        return <PaymentScreen onBack={handleGoToMainView} {...commonProps} />;
      case AppStep.PROFILE_SCREEN:
        if (!user) { setAppStep(AppStep.LOGIN); return null; }
        return <ProfileScreen user={user as User} onBack={handleGoToMainView} onGoToPayment={handleGoToPaymentScreen} {...commonProps} />;
      case AppStep.INFO_SCREEN:
        return <InfoScreen onBack={handleGoToMainView} {...commonProps} />;
      default:
        return <LoginScreen onLogin={handleLogin} {...commonProps} />;
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
      {showWelcomeBanner && user && (
        <div className="bg-green-500 text-white p-3 fixed top-4 left-1/2 -translate-x-1/2 z-50 text-center rounded-lg shadow-lg animate-fade-in-down">
          <p className="font-semibold">{t('welcome_back', user.name ?? '')}</p>
          <style>{`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translate(-50%, -20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
            `}</style>
        </div>
      )}
      {renderContent()}
      {selectedImage && <ImageModal image={selectedImage} onClose={handleCloseModal} onLike={handleLike} onShare={handleShare} onGenerate={handleGenerateAndCloseModal} cooldownTime={cooldownTime} {...commonProps} />}
    </div>
  );
};

export default App;