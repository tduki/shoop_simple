'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HeartIcon, XMarkIcon } from '@heroicons/react/24/solid';
import ProductCard from '@/components/ProductCard';
import { getFavoriteProducts, removeFromFavorites, isAuthenticated } from '@/services/productService';
import { Product } from '@/data/products';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmationProductId, setConfirmationProductId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        router.push('/auth/login');
        return false;
      }
      return true;
    };

    // Vérifier l'authentification avant de charger les favoris
    if (checkAuth()) {
      // Load favorites from localStorage
      setIsLoading(true);
      const favoriteProducts = getFavoriteProducts();
      setFavorites(favoriteProducts);
      setIsLoading(false);
    }
  }, [router]);

  const handleRemoveClick = (productId: string) => {
    setConfirmationProductId(productId);
  };

  const confirmRemove = () => {
    if (!confirmationProductId) return;
    
    if (removeFromFavorites(confirmationProductId)) {
      // Update the state to reflect the change
      setFavorites(prev => prev.filter(product => product.id !== confirmationProductId));
      toast.success('Produit retiré des favoris');
    }
    setConfirmationProductId(null);
  };

  const cancelRemove = () => {
    setConfirmationProductId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6">Mes Favoris</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          <p className="mb-8 text-gray-600">
            {favorites.length > 0 
              ? `Vous avez ${favorites.length} ${favorites.length === 1 ? 'article favori' : 'articles favoris'}`
              : 'Votre liste de favoris est vide'}
          </p>
          
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-medium text-gray-700 mb-2">Pas encore de favoris</h2>
              <p className="text-gray-500 mb-6">Commencez à explorer nos produits et ajoutez vos favoris</p>
              <Link href="/products" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Explorer les produits
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <AnimatePresence>
                {favorites.map(product => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard 
                      product={product}
                      onRemoveFavorite={() => handleRemoveClick(product.id)}
                      showRemoveFavorite
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {/* Modal de confirmation pour suppression des favoris */}
      {confirmationProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">Confirmer la suppression</h3>
              <button onClick={cancelRemove} className="text-gray-400 hover:text-gray-500">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-6">Voulez-vous vraiment retirer ce produit de vos favoris ?</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={cancelRemove}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-800"
              >
                Annuler
              </button>
              <button 
                onClick={confirmRemove}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-white"
              >
                Supprimer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 