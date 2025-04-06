'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, ArrowsRightLeftIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Product } from '@/data/products';

export default function CompareProducts() {
  const [isVisible, setIsVisible] = useState(false);
  const [compareList, setCompareList] = useState<Product[]>([]);
  
  useEffect(() => {
    // Récupérer la liste des produits à comparer depuis localStorage
    const loadCompareList = () => {
      if (typeof window !== 'undefined') {
        try {
          const savedList = localStorage.getItem('compare_products');
          if (savedList) {
            setCompareList(JSON.parse(savedList));
          }
        } catch (error) {
          console.error('Erreur lors du chargement de la liste de comparaison:', error);
        }
      }
    };
    
    // Charger la liste au montage du composant
    loadCompareList();
    
    // Écouter les événements de mise à jour de la liste
    const handleCompareUpdate = () => {
      loadCompareList();
    };
    
    window.addEventListener('compareUpdated', handleCompareUpdate);
    
    return () => {
      window.removeEventListener('compareUpdated', handleCompareUpdate);
    };
  }, []);
  
  // Mise à jour de l'état visible si des produits sont ajoutés
  useEffect(() => {
    if (compareList.length > 0) {
      setIsVisible(true);
    }
  }, [compareList]);
  
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  
  const removeFromCompare = (productId: string) => {
    const updatedList = compareList.filter(product => product.id !== productId);
    setCompareList(updatedList);
    
    // Mettre à jour localStorage
    localStorage.setItem('compare_products', JSON.stringify(updatedList));
    
    // Notification
    toast.success('Produit retiré de la comparaison');
    
    // Si la liste est vide, masquer le composant
    if (updatedList.length === 0) {
      setIsVisible(false);
    }
  };
  
  const clearCompareList = () => {
    setCompareList([]);
    localStorage.removeItem('compare_products');
    setIsVisible(false);
    toast.success('Liste de comparaison vidée');
  };
  
  if (!isVisible) {
    return (
      <button 
        onClick={toggleVisibility}
        className="fixed bottom-8 left-8 z-40 bg-gray-800 hover:bg-gray-900 text-white rounded-full p-3 shadow-lg flex items-center space-x-2"
      >
        <ArrowsRightLeftIcon className="h-5 w-5" />
        <span className="pr-2">Comparer</span>
      </button>
    );
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg transform transition-transform duration-300">
      {/* En-tête */}
      <div className="p-3 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <ArrowsRightLeftIcon className="h-5 w-5 text-gray-700 mr-2" />
          <h3 className="font-medium text-gray-800">
            Comparaison de produits ({compareList.length})
          </h3>
        </div>
        
        <div className="flex items-center space-x-4">
          {compareList.length >= 2 && (
            <Link 
              href="/compare"
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Comparer en détail
            </Link>
          )}
          
          {compareList.length > 0 && (
            <button 
              onClick={clearCompareList}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Tout effacer
            </button>
          )}
          
          <button 
            onClick={toggleVisibility}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronUpIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Liste des produits */}
      <div className="p-4 overflow-x-auto">
        <div className="flex space-x-4">
          {compareList.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-6">
              <p className="text-gray-500 mb-3">Aucun produit à comparer</p>
              <Link 
                href="/products"
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                Parcourir les produits
              </Link>
            </div>
          ) : (
            compareList.map(product => (
              <div key={product.id} className="flex-none w-48 bg-white rounded-lg border border-gray-200 p-3 relative">
                <button 
                  onClick={() => removeFromCompare(product.id)}
                  className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
                
                <div className="h-32 relative mb-2">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                
                <div className="text-center">
                  <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                  <p className="text-indigo-600 font-bold mt-1">{product.price.toFixed(2)}€</p>
                  
                  {product.originalPrice && (
                    <p className="text-gray-500 line-through text-xs">
                      {product.originalPrice.toFixed(2)}€
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
          
          {/* Emplacement pour ajouter un produit */}
          {compareList.length > 0 && compareList.length < 4 && (
            <div className="flex-none w-48 h-52 border border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <Link 
                href="/products"
                className="text-indigo-600 hover:text-indigo-800 text-sm text-center"
              >
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-2">+</span>
                  <span>Ajouter un produit</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 