'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { products, Product } from '@/data/products';
import { motion } from 'framer-motion';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('category');
  
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [sortOption, setSortOption] = useState('default');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthMessage, setShowAuthMessage] = useState(false);
  
  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authStatus = localStorage.getItem('isLoggedIn');
      setIsLoggedIn(authStatus === 'true');
    }
  }, []);
  
  // Filter products based on category
  useEffect(() => {
    if (activeCategory) {
      setFilteredProducts(products.filter(product => product.category === activeCategory));
    } else {
      setFilteredProducts(products);
    }
  }, [activeCategory]);
  
  // Sort products
  useEffect(() => {
    let sortedProducts = [...filteredProducts];
    
    switch(sortOption) {
      case 'price-asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Default sorting (no specific sort)
        break;
    }
    
    setFilteredProducts(sortedProducts);
  }, [sortOption]);
  
  const handleCategoryClick = (category: string | null) => {
    setActiveCategory(category);
  };
  
  const handleAddToFavorites = (productId: string) => {
    if (!isLoggedIn) {
      setShowAuthMessage(true);
      setTimeout(() => {
        setShowAuthMessage(false);
        router.push('/auth/login');
      }, 2000);
      return;
    }
    
    setFavorites(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
    
    // Émettre un événement personnalisé pour mettre à jour le compteur des favoris
    window.dispatchEvent(new CustomEvent('favorites-updated'));
  };
  
  const categories = [
    { label: 'Tous les produits', value: null },
    { label: 'Sneakers', value: 'sneakers' },
    { label: 'T-shirts', value: 'tshirts' },
    { label: 'Pantalons', value: 'pants' },
    { label: 'Pulls', value: 'sweaters' },
    { label: 'Accessoires', value: 'accessories' },
  ];
  
  return (
    <div className="bg-white">
      {/* Message d'authentification */}
      {showAuthMessage && (
        <div className="fixed top-20 right-5 bg-yellow-500 text-white px-6 py-3 rounded-md shadow-lg z-50 animate-fade-in">
          Veuillez vous connecter pour ajouter aux favoris. Redirection...
        </div>
      )}
      
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {activeCategory ? 
              categories.find(cat => cat.value === activeCategory)?.label : 
              'Tous nos produits'
            }
          </h1>
          <p className="mt-4 text-base text-gray-500">
            Découvrez notre sélection de vêtements et accessoires de marque.
          </p>
        </div>
        
        {/* Filters Section */}
        <div className="mb-10 border-b border-gray-200 pb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
              {categories.map((category) => (
                <button
                  key={category.value || 'all'}
                  onClick={() => handleCategoryClick(category.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeCategory === category.value
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
            
            {/* Sorting */}
            <div className="w-full sm:w-auto">
              <label htmlFor="sort" className="sr-only">Trier par</label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="default">Tri par défaut</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="rating">Meilleures notes</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <motion.div 
          className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductCard 
                product={product} 
                isFavorite={favorites.includes(product.id)}
                onAddToFavorites={handleAddToFavorites}
              />
            </motion.div>
          ))}
        </motion.div>
        
        {/* No products message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Aucun produit trouvé</h3>
            <p className="mt-2 text-sm text-gray-500">
              Essayez de modifier vos filtres ou de choisir une autre catégorie.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 