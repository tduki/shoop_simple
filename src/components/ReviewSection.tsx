'use client';

import React, { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { Review, getProductReviews } from '@/data/products';
import { useRouter } from 'next/navigation';

interface ReviewSectionProps {
  productId: string;
}

// Simuler un état de connexion (à remplacer par un vrai système d'authentification)
const useAuth = () => {
  // Pour notre démo, nous utilisons localStorage pour simuler l'état de connexion
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement de la page
    if (typeof window !== 'undefined') {
      const authStatus = localStorage.getItem('isLoggedIn');
      setIsLoggedIn(authStatus === 'true');
    }
  }, []);
  
  return { isLoggedIn };
};

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const reviews = getProductReviews(productId);
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [newReview, setNewReview] = useState({
    rating: 0,
    text: '',
    name: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loginAlert, setLoginAlert] = useState(false);

  const handleRatingClick = (rating: number) => {
    setNewReview({ ...newReview, rating });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      setLoginAlert(true);
      setTimeout(() => setLoginAlert(false), 3000);
      return;
    }
    
    // Vérification de base
    if (newReview.rating === 0 || !newReview.text.trim() || !newReview.name.trim()) {
      alert('Veuillez remplir tous les champs et donner une note.');
      return;
    }

    // Dans une application réelle, on enverrait l'avis au serveur ici
    console.log('Nouvel avis soumis:', newReview);
    
    // Afficher un message de succès
    setSuccessMessage('Merci pour votre avis ! Il sera visible après modération.');
    
    // Réinitialiser le formulaire
    setNewReview({ rating: 0, text: '', name: '' });
    setShowForm(false);
    
    // Cacher le message après 5 secondes
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  const handleAddReviewClick = () => {
    if (!isLoggedIn) {
      setLoginAlert(true);
      setTimeout(() => setLoginAlert(false), 3000);
    } else {
      setShowForm(true);
    }
  };

  const redirectToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900">Avis des clients</h2>
      
      {successMessage && (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      
      {loginAlert && (
        <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-md flex items-center justify-between">
          <span>Vous devez être connecté pour laisser un avis.</span>
          <button 
            onClick={redirectToLogin}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Se connecter
          </button>
        </div>
      )}
      
      {reviews.length > 0 ? (
        <div className="mt-6 space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-5 w-5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="ml-2 text-sm text-gray-500">{review.rating}/5</p>
              </div>
              
              <h3 className="font-medium text-gray-900">{review.userName}</h3>
              <time className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('fr-FR')}</time>
              
              <p className="mt-2 text-gray-600">{review.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-500">Aucun avis pour ce produit pour le moment.</p>
      )}
      
      {!showForm ? (
        <button
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleAddReviewClick}
        >
          Donner mon avis
        </button>
      ) : (
        <div className="mt-6 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Votre avis</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                Note
              </label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className="text-2xl focus:outline-none mr-1"
                  >
                    {star <= newReview.rating ? (
                      <StarIcon className="h-6 w-6 text-yellow-400" />
                    ) : (
                      <StarOutlineIcon className="h-6 w-6 text-gray-400 hover:text-yellow-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Votre nom
              </label>
              <input
                type="text"
                id="name"
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                Votre avis
              </label>
              <textarea
                id="text"
                rows={4}
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Soumettre
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 