'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCartIcon, HeartIcon, UserIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon, ChartBarIcon, ArrowLeftOnRectangleIcon, PhotoIcon } from '@heroicons/react/24/outline';
import SearchBar from './SearchBar';
import { getCartItemCount } from '@/services/productService';
import { getFavorites } from '@/services/productService';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (typeof window !== 'undefined') {
      const authStatus = localStorage.getItem('isLoggedIn') === 'true';
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      const userDataStr = localStorage.getItem('currentUser');
      
      setIsLoggedIn(authStatus);
      setIsAdmin(adminStatus);
      
      if (userDataStr) {
        try {
          setCurrentUser(JSON.parse(userDataStr));
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
    
    // Update cart count
    const count = getCartItemCount();
    setCartCount(Number.isNaN(count) ? 0 : count);
    
    // Update favorites count
    const favorites = getFavorites();
    setFavoritesCount(favorites.length);
    
    // Add event listener for storage changes (to update counts when another tab modifies localStorage)
    const handleStorageChange = () => {
      const newCartCount = getCartItemCount();
      setCartCount(Number.isNaN(newCartCount) ? 0 : newCartCount);
      
      setFavoritesCount(getFavorites().length);
      
      // Mettre à jour l'état de connexion si changé
      const newAuthStatus = localStorage.getItem('isLoggedIn') === 'true';
      const newAdminStatus = localStorage.getItem('isAdmin') === 'true';
      setIsLoggedIn(newAuthStatus);
      setIsAdmin(newAdminStatus);
      
      const userDataStr = localStorage.getItem('currentUser');
      if (userDataStr) {
        try {
          setCurrentUser(JSON.parse(userDataStr));
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      } else {
        setCurrentUser(null);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for cart/favorites updates within the same tab
    const handleCustomEvent = () => {
      const newCartCount = getCartItemCount();
      setCartCount(Number.isNaN(newCartCount) ? 0 : newCartCount);
      
      setFavoritesCount(getFavorites().length);
    };
    
    window.addEventListener('cartUpdated', handleCustomEvent);
    window.addEventListener('favoritesUpdated', handleCustomEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCustomEvent);
      window.removeEventListener('favoritesUpdated', handleCustomEvent);
    };
  }, []);

  // Function to refresh counts (can be called after adding to cart or favorites)
  const refreshCounts = () => {
    const newCartCount = getCartItemCount();
    setCartCount(Number.isNaN(newCartCount) ? 0 : newCartCount);
    
    setFavoritesCount(getFavorites().length);
  };
  
  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentUser(null);
    setShowUserMenu(false);
    
    // Rediriger vers la page d'accueil
    window.location.href = '/';
  };

  // Assurer que cartCount est toujours un nombre valide pour l'affichage
  const displayCartCount = Number.isInteger(cartCount) ? cartCount : 0;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-black">
              Streeter
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-6">
            <Link href="/" className="text-gray-700 hover:text-black px-2 lg:px-3 py-2 text-sm font-medium">
              Accueil
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-black px-2 lg:px-3 py-2 text-sm font-medium">
              Tous les produits
            </Link>
            <Link href="/products?category=sneakers" className="text-gray-700 hover:text-black px-2 lg:px-3 py-2 text-sm font-medium">
              Sneakers
            </Link>
            <Link href="/promotions" className="text-gray-700 hover:text-black px-2 lg:px-3 py-2 text-sm font-medium">
              Réductions
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-black px-2 lg:px-3 py-2 text-sm font-medium">
              À propos
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-black px-2 lg:px-3 py-2 text-sm font-medium">
              Contact
            </Link>
          </div>
          
          {/* Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {showSearch ? (
              <div className="fixed inset-0 z-10 bg-white p-4 flex items-center">
                <SearchBar />
                <button 
                  className="ml-2 text-gray-600 hover:text-black p-1"
                  onClick={() => setShowSearch(false)}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <>
                <button 
                  className="text-gray-600 hover:text-black p-1"
                  onClick={() => setShowSearch(true)}
                >
                  <MagnifyingGlassIcon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                </button>
                <Link href="/favorites" className="text-gray-600 hover:text-black p-1 relative">
                  <HeartIcon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-red-600 text-white text-[10px] sm:text-xs flex items-center justify-center">
                      {favoritesCount > 99 ? '99+' : favoritesCount}
                    </span>
                  )}
                </Link>
                <Link href="/cart" className="text-gray-600 hover:text-black p-1 relative">
                  <ShoppingCartIcon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                  <span className={`absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full ${displayCartCount > 0 ? 'bg-indigo-600' : 'bg-gray-300'} text-white text-[10px] sm:text-xs flex items-center justify-center`}>
                    {displayCartCount > 99 ? '99+' : displayCartCount}
                  </span>
                </Link>
                
                {isLoggedIn ? (
                  <div className="relative">
                    <button 
                      className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-black"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      <span className="hidden sm:inline-block">
                        {currentUser ? `Bonjour, ${currentUser.firstName}` : 'Mon compte'}
                      </span>
                      <UserIcon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                    </button>
                    
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {currentUser?.firstName} {currentUser?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
                        </div>
                        
                        <Link 
                          href="/profile" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Mon profil
                        </Link>
                        
                        {isAdmin && (
                          <Link 
                            href="/admin" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <span className="flex items-center">
                              <ChartBarIcon className="h-4 w-4 mr-2" />
                              Administration
                            </span>
                          </Link>
                        )}
                        
                        {isAdmin && (
                          <Link 
                            href="/admin/media" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <PhotoIcon className="h-4 w-4 mr-2" />
                            Médiathèque
                          </Link>
                        )}
                        
                        <Link 
                          href="/favorites" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Mes favoris
                        </Link>
                        
                        <Link 
                          href="/cart" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Mon panier
                        </Link>
                        
                        <button 
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={handleLogout}
                        >
                          <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
                          Déconnexion
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/auth/login" className="text-gray-600 hover:text-black p-1">
                    <UserIcon className="h-6 w-6" aria-hidden="true" />
                  </Link>
                )}
                
                {/* Mobile menu button */}
                <button 
                  className="md:hidden text-gray-600 hover:text-black p-1"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? (
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            <Link 
              href="/" 
              className="block text-gray-700 hover:text-black px-3 py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link 
              href="/products" 
              className="block text-gray-700 hover:text-black px-3 py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Tous les produits
            </Link>
            <Link 
              href="/products?category=sneakers" 
              className="block text-gray-700 hover:text-black px-3 py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Sneakers
            </Link>
            <Link 
              href="/promotions" 
              className="block text-gray-700 hover:text-black px-3 py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Réductions
            </Link>
            <Link 
              href="/about" 
              className="block text-gray-700 hover:text-black px-3 py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              À propos
            </Link>
            <Link 
              href="/contact" 
              className="block text-gray-700 hover:text-black px-3 py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
            {isAdmin && (
              <Link 
                href="/dashboard" 
                className="block text-gray-700 hover:text-black px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Tableau de bord
              </Link>
            )}
            
            {isAdmin && (
              <Link href="/admin/media">
                <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  <PhotoIcon className="mr-2 h-5 w-5 inline-block" aria-hidden="true" />
                  Médiathèque
                </span>
              </Link>
            )}
            
            {isLoggedIn && (
              <button 
                className="flex w-full items-center text-red-600 hover:text-red-800 px-3 py-2 text-base font-medium"
                onClick={handleLogout}
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                Déconnexion
              </button>
            )}
            
            <div className="px-3 py-2">
              <SearchBar />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 