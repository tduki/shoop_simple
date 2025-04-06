'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [hasSubscribed, setHasSubscribed] = useState(false);
  
  useEffect(() => {
    // Vérifier si l'utilisateur a déjà souscrit
    const hasAlreadySubscribed = localStorage.getItem('newsletter_subscribed') === 'true';
    if (hasAlreadySubscribed) {
      setHasSubscribed(true);
      return;
    }
    
    // Montrer le popup après 15 secondes
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 15000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleClose = () => {
    setIsVisible(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }
    
    // Simuler l'inscription
    toast.success('Merci pour votre inscription à notre newsletter !');
    localStorage.setItem('newsletter_subscribed', 'true');
    setHasSubscribed(true);
    setIsVisible(false);
    
    // Réinitialiser l'email
    setEmail('');
  };
  
  if (!isVisible || hasSubscribed) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden transform animate-fadeIn" 
        style={{animation: 'fadeIn 0.5s ease-out'}}
      >
        <div className="relative">
          {/* Bannière supérieure */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-16"></div>
          
          {/* Badge promo */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white text-indigo-600 font-bold px-4 py-2 rounded-full shadow-md">
            10% DE RÉDUCTION
          </div>
          
          {/* Bouton fermer */}
          <button 
            onClick={handleClose} 
            className="absolute top-2 right-2 text-white hover:text-gray-200 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 pt-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Rejoignez notre communauté</h2>
          <p className="text-gray-600 mb-6">
            Inscrivez-vous à notre newsletter et obtenez 10% de réduction sur votre prochaine commande !
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-md transition-colors shadow-md hover:shadow-lg"
            >
              S'inscrire et économiser 10%
            </button>
          </form>
          
          <p className="mt-4 text-xs text-gray-500">
            En vous inscrivant, vous acceptez de recevoir des emails marketing. Vous pourrez vous désinscrire à tout moment.
          </p>
        </div>
      </div>
    </div>
  );
} 