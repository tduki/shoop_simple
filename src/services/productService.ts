'use client';

import { Product, searchProducts, getProductById } from '@/data/products';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Types for cart and favorites
export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

// Local storage keys
const CART_STORAGE_KEY = 'streeter_cart';
const FAVORITES_STORAGE_KEY = 'streeter_favorites';
const RECENTLY_VIEWED_KEY = 'streeter_recently_viewed';
const COMPARE_STORAGE_KEY = 'streeter_compare_list';

// Maximum number of products to keep in recently viewed
const MAX_RECENTLY_VIEWED = 8;

// Utility to safely access localStorage (only in client)
const getLocalStorage = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
};

// Fonction pour vérifier si l'utilisateur est authentifié
export const isAuthenticated = async (): Promise<boolean> => {
  // Dans un environnement réel, vérifiez le jeton d'authentification ou la session
  // Pour cette démo, nous renvoyons toujours true
  return Promise.resolve(true);
};

// Fonction pour afficher un message et rediriger si l'utilisateur n'est pas connecté
export const requireAuth = (redirectPath: string = '/auth/login'): boolean => {
  try {
    if (!isAuthenticated()) {
      if (typeof window !== 'undefined') {
        // Stocker la page actuelle pour rediriger après connexion
        const currentPath = window.location.pathname;
        if (currentPath !== '/auth/login' && currentPath !== '/auth/register') {
          localStorage.setItem('redirectAfterLogin', currentPath);
        }
        
        alert('Veuillez vous connecter pour effectuer cette action.');
        window.location.href = redirectPath;
      }
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in requireAuth:', error);
    return false;
  }
};

// Cart functions
export const getCartItems = (): CartItem[] => {
  const storage = getLocalStorage();
  if (!storage) return [];
  
  try {
    const cartData = storage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error getting cart items:', error);
    return [];
  }
};

const emitCartUpdatedEvent = () => {
  if (typeof window !== 'undefined') {
    // Émettre un événement personnalisé
    const event = new CustomEvent('cartUpdated');
    window.dispatchEvent(event);
    
    // Déclencher un événement de stockage pour la synchronisation entre onglets
    const storageEvent = new StorageEvent('storage', {
      key: CART_STORAGE_KEY,
      newValue: localStorage.getItem(CART_STORAGE_KEY),
      url: window.location.href,
      storageArea: localStorage
    });
    window.dispatchEvent(storageEvent);
  }
};

export const addToCart = (productId: string, quantity: number = 1, size?: string, color?: string): boolean => {
  // Vérifier l'authentification
  if (!isAuthenticated()) {
    requireAuth();
    return false;
  }
  
  const storage = getLocalStorage();
  if (!storage) return false;
  
  try {
    // Récupérer le produit par son ID
    const product = getProductById(productId);
    if (!product) {
      console.error('Product not found:', productId);
      return false;
    }
    
    const cartItems = getCartItems();
    const existingItemIndex = cartItems.findIndex(
      item => item.product.id === productId && item.size === size && item.color === color
    );
    
    if (existingItemIndex > -1) {
      // Update quantity if item already exists with same options
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cartItems.push({ product, quantity, size, color });
    }
    
    storage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    emitCartUpdatedEvent();
    
    // Afficher une confirmation
    if (typeof window !== 'undefined') {
      const toastEl = document.createElement('div');
      toastEl.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fadeIn';
      toastEl.innerHTML = 'Produit ajouté au panier';
      document.body.appendChild(toastEl);
      
      setTimeout(() => {
        toastEl.classList.add('animate-fadeOut');
        setTimeout(() => toastEl.remove(), 500);
      }, 3000);
    }
    
    return true;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return false;
  }
};

export const removeFromCart = (productId: string, size?: string, color?: string): void => {
  const storage = getLocalStorage();
  if (!storage) return;
  
  try {
    let cartItems = getCartItems();
    cartItems = cartItems.filter(
      item => !(item.product.id === productId && item.size === size && item.color === color)
    );
    
    storage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    emitCartUpdatedEvent();
  } catch (error) {
    console.error('Error removing item from cart:', error);
  }
};

export const updateCartItemQuantity = (productId: string, quantity: number, size?: string, color?: string): void => {
  const storage = getLocalStorage();
  if (!storage) return;
  
  try {
    const cartItems = getCartItems();
    const itemIndex = cartItems.findIndex(
      item => item.product.id === productId && item.size === size && item.color === color
    );
    
    if (itemIndex > -1) {
      cartItems[itemIndex].quantity = quantity;
      storage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      emitCartUpdatedEvent();
    }
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
  }
};

export const clearCart = (): void => {
  const storage = getLocalStorage();
  if (!storage) return;
  
  try {
    storage.removeItem(CART_STORAGE_KEY);
    emitCartUpdatedEvent();
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
};

export const getCartTotal = (): number => {
  const cartItems = getCartItems();
  return cartItems.reduce((total, item) => {
    // Vérifier que le produit et son prix sont valides
    if (!item.product || !item.product.price) return total;
    
    // Convertir le prix en nombre si nécessaire
    const basePrice = parseFloat(item.product.price.toString()) || 0;
    
    // Utiliser le prix réduit si disponible
    const price = item.product.discount 
      ? basePrice * (1 - item.product.discount / 100) 
      : basePrice;
    
    return total + (price * item.quantity);
  }, 0);
};

export const getCartItemCount = (): number => {
  const cartItems = getCartItems();
  return cartItems.reduce((count, item) => {
    // Vérifier que l'item est valide
    if (!item || !item.quantity) return count;
    return count + (parseInt(item.quantity.toString()) || 0);
  }, 0);
};

// Favorites functions
export const getFavorites = (): string[] => {
  const storage = getLocalStorage();
  if (!storage) return [];
  
  try {
    const favoritesData = storage.getItem(FAVORITES_STORAGE_KEY);
    return favoritesData ? JSON.parse(favoritesData) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const getFavoriteProducts = (): Product[] => {
  const favoriteIds = getFavorites();
  return favoriteIds
    .map(id => getProductById(id))
    .filter((product): product is Product => product !== undefined);
};

const emitFavoritesUpdatedEvent = () => {
  if (typeof window !== 'undefined') {
    // Émettre un événement personnalisé
    const event = new CustomEvent('favoritesUpdated');
    window.dispatchEvent(event);
    
    // Déclencher un événement de stockage pour la synchronisation entre onglets
    const storageEvent = new StorageEvent('storage', {
      key: FAVORITES_STORAGE_KEY,
      newValue: localStorage.getItem(FAVORITES_STORAGE_KEY),
      url: window.location.href,
      storageArea: localStorage
    });
    window.dispatchEvent(storageEvent);
  }
};

export const addToFavorites = (productId: string): boolean => {
  // Vérifier l'authentification
  if (!isAuthenticated()) {
    requireAuth();
    return false;
  }
  
  const storage = getLocalStorage();
  if (!storage) return false;
  
  try {
    const favorites = getFavorites();
    if (!favorites.includes(productId)) {
      favorites.push(productId);
      storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      emitFavoritesUpdatedEvent();
      
      // Afficher une confirmation
      if (typeof window !== 'undefined') {
        const toastEl = document.createElement('div');
        toastEl.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fadeIn';
        toastEl.innerHTML = 'Produit ajouté aux favoris';
        document.body.appendChild(toastEl);
        
        setTimeout(() => {
          toastEl.classList.add('animate-fadeOut');
          setTimeout(() => toastEl.remove(), 500);
        }, 3000);
      }
    }
    return true;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
};

export const removeFromFavorites = (productId: string): boolean => {
  // Vérifier l'authentification
  if (!isAuthenticated()) {
    requireAuth();
    return false;
  }
  
  const storage = getLocalStorage();
  if (!storage) return false;
  
  try {
    let favorites = getFavorites();
    favorites = favorites.filter(id => id !== productId);
    storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    emitFavoritesUpdatedEvent();
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

export const toggleFavorite = (productId: string): boolean => {
  // Vérifier l'authentification
  if (!isAuthenticated()) {
    requireAuth();
    return false;
  }
  
  const favorites = getFavorites();
  const isFavorite = favorites.includes(productId);
  
  if (isFavorite) {
    removeFromFavorites(productId);
    return false;
  } else {
    addToFavorites(productId);
    return true;
  }
};

export const isProductFavorite = (productId: string): boolean => {
  const favorites = getFavorites();
  return favorites.includes(productId);
};

// Search function
export const searchProductsService = (query: string): Product[] => {
  return searchProducts(query);
};

// Add product to compare list
export const addToCompare = (productId: string): boolean => {
  try {
    if (!isAuthenticated()) {
      requireAuth();
      return false;
    }
    
    const storage = getLocalStorage();
    if (!storage) return false;
    
    const product = getProductById(productId);
    if (!product) return false;
    
    // Récupérer la liste existante
    let compareList: Product[] = [];
    const savedList = storage.getItem('compare_products');
    if (savedList) {
      compareList = JSON.parse(savedList);
    }
    
    // Vérifier si le produit est déjà dans la liste
    if (compareList.some(item => item.id === productId)) {
      toast.error('Ce produit est déjà dans votre liste de comparaison');
      return false;
    }
    
    // Limiter à 4 produits
    if (compareList.length >= 4) {
      toast.error('Vous ne pouvez comparer que 4 produits maximum');
      return false;
    }
    
    // Ajouter le produit
    compareList.push(product);
    storage.setItem('compare_products', JSON.stringify(compareList));
    
    // Emettre un événement pour notifier les autres composants
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('compareUpdated'));
    }
    
    toast.success('Produit ajouté à la comparaison');
    return true;
  } catch (error) {
    console.error('Error adding product to compare:', error);
    return false;
  }
};

// Remove product from compare list
export const removeFromCompare = (productId: string): boolean => {
  try {
    const storage = getLocalStorage();
    if (!storage) return false;
    
    // Récupérer la liste existante
    let compareList: Product[] = [];
    const savedList = storage.getItem('compare_products');
    if (savedList) {
      compareList = JSON.parse(savedList);
    }
    
    // Filtrer le produit
    const updatedList = compareList.filter(product => product.id !== productId);
    storage.setItem('compare_products', JSON.stringify(updatedList));
    
    // Emettre un événement pour notifier les autres composants
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('compareUpdated'));
    }
    
    return true;
  } catch (error) {
    console.error('Error removing product from compare:', error);
    return false;
  }
};

// Get compare list
export const getCompareList = (): Product[] => {
  try {
    const storage = getLocalStorage();
    if (!storage) return [];
    
    const savedList = storage.getItem('compare_products');
    if (savedList) {
      return JSON.parse(savedList);
    }
    
    return [];
  } catch (error) {
    console.error('Error getting compare list:', error);
    return [];
  }
};

// Recently viewed functions
export const addToRecentlyViewed = (productId: string): void => {
  const storage = getLocalStorage();
  if (!storage) return;
  
  try {
    // Get current list
    const recentlyViewedData = storage.getItem(RECENTLY_VIEWED_KEY);
    let recentlyViewed: string[] = recentlyViewedData ? JSON.parse(recentlyViewedData) : [];
    
    // Remove if already exists (to move it to the top)
    recentlyViewed = recentlyViewed.filter(id => id !== productId);
    
    // Add to the beginning of the array
    recentlyViewed.unshift(productId);
    
    // Limit to max items
    if (recentlyViewed.length > MAX_RECENTLY_VIEWED) {
      recentlyViewed = recentlyViewed.slice(0, MAX_RECENTLY_VIEWED);
    }
    
    // Save back to storage
    storage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
    
    // Emit custom event
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('recentlyViewedUpdated');
      window.dispatchEvent(event);
    }
  } catch (error) {
    console.error('Error adding to recently viewed:', error);
  }
};

export const getRecentlyViewed = (): string[] => {
  const storage = getLocalStorage();
  if (!storage) return [];
  
  try {
    const recentlyViewedData = storage.getItem(RECENTLY_VIEWED_KEY);
    return recentlyViewedData ? JSON.parse(recentlyViewedData) : [];
  } catch (error) {
    console.error('Error getting recently viewed:', error);
    return [];
  }
};

export const getRecentlyViewedProducts = (): Product[] => {
  const recentlyViewedIds = getRecentlyViewed();
  return recentlyViewedIds
    .map(id => getProductById(id))
    .filter((product): product is Product => product !== undefined);
};

export const clearRecentlyViewed = (): void => {
  const storage = getLocalStorage();
  if (!storage) return;
  
  try {
    storage.removeItem(RECENTLY_VIEWED_KEY);
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('recentlyViewedUpdated');
      window.dispatchEvent(event);
    }
  } catch (error) {
    console.error('Error clearing recently viewed:', error);
  }
};