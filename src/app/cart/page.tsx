'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { XMarkIcon, TagIcon, CheckIcon } from '@heroicons/react/24/outline';
import { getCartItems, removeFromCart, updateCartItemQuantity, getCartTotal, clearCart, isAuthenticated } from '@/services/productService';
import { CartItem } from '@/services/productService';
import toast from 'react-hot-toast';

// Image de remplacement en cas d'erreur
const FALLBACK_IMAGE = '/placeholder.svg';

// Types for promotions and payment methods
interface Promo {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minPurchase?: number;
  validUntil?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  icon: string;
  fee: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderTotal, setOrderTotal] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<Promo | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        // Sauvegarder la page actuelle pour rediriger après connexion
        if (typeof window !== 'undefined') {
          localStorage.setItem('redirectAfterLogin', '/cart');
        }
        
        // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        toast.error('Veuillez vous connecter pour accéder à votre panier');
        router.push('/auth/login');
        return false;
      }
      return true;
    };

    // Vérifier l'authentification avant de charger les articles du panier
    if (checkAuth()) {
      // Load cart items from localStorage
      loadCartItems();
      // Load payment methods
      loadPaymentMethods();
    }
  }, [router]);

  const loadCartItems = () => {
    setIsLoading(true);
    try {
      // Petit délai pour simuler un chargement et permettre au localStorage d'être prêt
      setTimeout(() => {
        const items = getCartItems();
        // Filtrer les éléments invalides
        const validItems = items.filter(item => 
          item && item.product && item.product.id && item.product.name && item.product.price
        );
        setCartItems(validItems);
        setOrderTotal(getCartTotal());
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
      toast.error('Impossible de charger votre panier');
      setIsLoading(false);
    }
  };

  // Simuler le chargement des méthodes de paiement depuis l'API
  const loadPaymentMethods = () => {
    // Simulation de récupération des méthodes de paiement à partir des paramètres
    setTimeout(() => {
      // Récupérer les méthodes depuis le localStorage (si configurées par l'admin)
      try {
        const savedMethods = localStorage.getItem('payment_methods');
        
        // Méthodes par défaut
        let methods: PaymentMethod[] = [
          { id: 'card', name: 'Carte bancaire', enabled: true, icon: 'credit-card', fee: 0 },
          { id: 'paypal', name: 'PayPal', enabled: true, icon: 'paypal', fee: 0 },
          { id: 'bank_transfer', name: 'Virement bancaire', enabled: true, icon: 'bank', fee: 0 },
          { id: 'cash_on_delivery', name: 'Paiement à la livraison', enabled: false, icon: 'cash', fee: 5 }
        ];
        
        // Si des méthodes ont été configurées par l'administrateur, les utiliser
        if (savedMethods) {
          const adminMethods = JSON.parse(savedMethods);
          // Transformer les méthodes de l'admin au format requis pour le panier
          methods = adminMethods
            .filter((method: any) => method.enabled)
            .map((method: any) => ({
              id: method.id,
              name: method.name,
              enabled: true,
              icon: method.icon,
              fee: method.fee || 0
            }));
        }
      
        // Filtrer les méthodes désactivées
        const enabledMethods = methods.filter(method => method.enabled);
        setPaymentMethods(enabledMethods);
        
        // Définir la méthode par défaut (la première disponible)
        if (enabledMethods.length > 0) {
          setSelectedPaymentMethod(enabledMethods[0].id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des méthodes de paiement:', error);
        // Fallback vers les méthodes par défaut en cas d'erreur
        const defaultMethods: PaymentMethod[] = [
          { id: 'card', name: 'Carte bancaire', enabled: true, icon: 'credit-card', fee: 0 }
        ];
        setPaymentMethods(defaultMethods);
        setSelectedPaymentMethod('card');
      }
    }, 300);
  };

  const handleRemoveFromCart = (productId: string, size?: string, color?: string) => {
    removeFromCart(productId, size, color);
    loadCartItems();
    // Recalculer après suppression
    if (appliedPromo) {
      applyPromoCode(appliedPromo.code);
    }
    toast.success('Article retiré du panier');
  };

  const handleUpdateQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    updateCartItemQuantity(productId, quantity, size, color);
    loadCartItems();
    // Recalculer après mise à jour
    if (appliedPromo) {
      applyPromoCode(appliedPromo.code);
    }
    toast.success('Quantité mise à jour');
  };

  const handleClearCart = () => {
    if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      clearCart();
      loadCartItems();
      setAppliedPromo(null);
      toast.success('Panier vidé avec succès');
    }
  };

  const applyPromoCode = (code: string) => {
    setIsApplyingPromo(true);
    
    // Simuler une vérification du code promo
    setTimeout(() => {
      // Liste des codes promo valides (simulation)
      const validPromos: Promo[] = [
        { code: 'WELCOME10', discount: 10, type: 'percentage' },
        { code: 'SUMMER20', discount: 20, type: 'percentage', minPurchase: 100 },
        { code: 'FREESHIP', discount: 10, type: 'fixed' },
        { code: 'FLASH25', discount: 25, type: 'percentage', validUntil: '2023-12-31' },
        { code: 'NEWCUSTOMER', discount: 15, type: 'percentage' },
        { code: 'BUNDLE5', discount: 5, type: 'fixed', minPurchase: 50 }
      ];
      
      const promo = validPromos.find(p => p.code.toUpperCase() === code.toUpperCase());
      
      if (!promo) {
        toast.error('Code promo invalide');
        setAppliedPromo(null);
        setIsApplyingPromo(false);
        return;
      }
      
      // Vérifier si le code est expiré
      if (promo.validUntil) {
        const expiryDate = new Date(promo.validUntil);
        if (expiryDate < new Date()) {
          toast.error('Ce code promo a expiré');
          setAppliedPromo(null);
          setIsApplyingPromo(false);
          return;
        }
      }
      
      // Vérifier si le montant minimum est atteint
      if (promo.minPurchase && orderTotal < promo.minPurchase) {
        toast.error(`Ce code nécessite un achat minimum de ${promo.minPurchase}€`);
        setAppliedPromo(null);
        setIsApplyingPromo(false);
        return;
      }
      
      setAppliedPromo(promo);
      toast.success('Code promo appliqué avec succès');
      setIsApplyingPromo(false);
    }, 800);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) {
      toast.error('Veuillez entrer un code promo');
      return;
    }
    
    applyPromoCode(promoCode.trim());
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    toast.success('Code promo retiré');
  };

  const calculateShipping = () => {
    // Simple shipping calculation based on order total
    return orderTotal > 100 ? 0 : 10;
  };

  // Calculer le montant de la réduction
  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    
    if (appliedPromo.type === 'percentage') {
      return (orderTotal * appliedPromo.discount) / 100;
    } else {
      return appliedPromo.discount;
    }
  };

  // Calculer le montant de la commission de paiement
  const calculatePaymentFee = () => {
    if (!selectedPaymentMethod) return 0;
    
    const method = paymentMethods.find(m => m.id === selectedPaymentMethod);
    return method ? method.fee : 0;
  };

  // Calculer le montant total de la commande avec remises et frais
  const calculateTotal = () => {
    const shipping = calculateShipping();
    const discount = calculateDiscount();
    const paymentFee = calculatePaymentFee();
    
    return orderTotal + shipping + paymentFee - discount;
  };

  // Fonction pour obtenir l'URL de l'image avec une solution de secours
  const getImageUrl = (item: CartItem): string => {
    if (item?.product?.images && item.product.images.length > 0) {
      return item.product.images[0];
    }
    return FALLBACK_IMAGE;
  };

  // Calculer le nombre total d'articles (en tenant compte des quantités)
  const getTotalItemCount = () => {
    return cartItems.reduce((count, item) => count + (item.quantity || 0), 0);
  };

  // Afficher l'icône de la méthode de paiement
  const renderPaymentIcon = (iconName: string) => {
    switch (iconName) {
      case 'credit-card':
        return <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>;
      case 'paypal':
        return <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 7h10q1 0 1.5 1t0 2l-3 10H6l-1.5-10q-.5-3 2-3Z"></path><path d="M10.5 7h8q1 0 1.5 1t0 2l-2 6"></path></svg>;
      case 'bank':
        return <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="9" width="20" height="12" rx="2" ry="2"></rect><circle cx="12" cy="14" r="3"></circle><path d="M2 9v0a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v0"></path></svg>;
      case 'cash':
        return <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>;
      default:
        return <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Votre Panier</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40 bg-white rounded-lg shadow p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            <span className="ml-3 text-gray-600">Chargement de votre panier...</span>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow p-6">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="mt-2 text-lg font-medium text-gray-900">Votre panier est vide</h2>
            <p className="mt-1 text-sm text-gray-500">
              Commencez à magasiner pour ajouter des articles à votre panier
            </p>
            <div className="mt-6">
              <Link href="/products" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Parcourir les produits
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items - 8 columns on large screens */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                  <p className="text-gray-700 font-medium">{getTotalItemCount()} {getTotalItemCount() === 1 ? 'article' : 'articles'} dans votre panier</p>
                  <button 
                    onClick={handleClearCart}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Vider le panier
                  </button>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item, index) => (
                    <div key={`${item.product.id}-${item.size}-${item.color}-${index}`} className="p-6">
                      <div className="flex flex-col sm:flex-row">
                        {/* Product Image */}
                        <div className="sm:w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                          <Image 
                            src={getImageUrl(item)} 
                            alt={item.product.name} 
                            width={96} 
                            height={96} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 sm:ml-6 mt-4 sm:mt-0">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-base font-medium text-gray-900">
                                <Link href={`/products/${item.product.id}`} className="hover:text-indigo-600">
                                  {item.product.name}
                                </Link>
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">
                                {item.color && <span className="mr-2">Couleur: {item.color}</span>}
                                {item.size && <span>Taille: {item.size}</span>}
                              </p>
                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {(parseFloat(item.product.price.toString()) || 0).toFixed(2)}€
                              </p>
                            </div>
                            
                            <button 
                              onClick={() => handleRemoveFromCart(item.product.id, item.size, item.color)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </div>
                          
                          <div className="mt-4 flex items-center">
                            <label htmlFor={`quantity-${index}`} className="mr-2 text-sm text-gray-600">
                              Qté:
                            </label>
                            <select
                              id={`quantity-${index}`}
                              value={item.quantity}
                              onChange={(e) => handleUpdateQuantity(
                                item.product.id, 
                                parseInt(e.target.value), 
                                item.size, 
                                item.color
                              )}
                              className="rounded-md border-gray-300 py-1 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            >
                              {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1}
                                </option>
                              ))}
                            </select>
                            
                            <span className="ml-auto text-base font-medium text-gray-900">
                              {((parseFloat(item.product.price.toString()) || 0) * item.quantity).toFixed(2)}€
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order Summary - 4 columns on large screens */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Récapitulatif</h2>
                
                {/* Code Promo */}
                <div className="mb-6">
                  <form onSubmit={handleApplyPromo}>
                    <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700 mb-1">
                      Code promotionnel
                    </label>
                    <div className="flex">
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <TagIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="promo-code"
                          className="block w-full pl-10 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Entrez votre code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          disabled={!!appliedPromo || isApplyingPromo}
                        />
                        {appliedPromo && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <CheckIcon className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>
                      <button
                        type="submit"
                        className={`px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white ${
                          appliedPromo
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        disabled={!!appliedPromo || isApplyingPromo}
                      >
                        {isApplyingPromo ? 'Vérification...' : appliedPromo ? 'Appliqué' : 'Appliquer'}
                      </button>
                    </div>
                  </form>
                  
                  {appliedPromo && (
                    <div className="mt-2 flex justify-between items-center">
                      <div className="text-sm text-green-600">
                        {appliedPromo.type === 'percentage'
                          ? `Code ${appliedPromo.code} (-${appliedPromo.discount}%)`
                          : `Code ${appliedPromo.code} (-${appliedPromo.discount}€)`}
                      </div>
                      <button
                        onClick={handleRemovePromo}
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        Retirer
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Payment Methods */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Modes de paiement</h3>
                  <div className="grid gap-2">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                          selectedPaymentMethod === method.id
                            ? 'bg-indigo-50 border-indigo-300'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={() => setSelectedPaymentMethod(method.id)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <div className="ml-3 flex flex-1 items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-2">
                              {renderPaymentIcon(method.icon)}
                            </span>
                            <span className="text-sm font-medium text-gray-900">{method.name}</span>
                          </div>
                          {method.fee > 0 && (
                            <span className="text-xs text-gray-500">+{method.fee.toFixed(2)}€</span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-medium text-gray-900">{orderTotal.toFixed(2)}€</span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Livraison</span>
                    <span className="font-medium text-gray-900">
                      {calculateShipping() === 0 ? 'Gratuite' : `${calculateShipping().toFixed(2)}€`}
                    </span>
                  </div>
                  
                  {calculatePaymentFee() > 0 && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Frais de paiement</span>
                      <span className="font-medium text-gray-900">{calculatePaymentFee().toFixed(2)}€</span>
                    </div>
                  )}
                  
                  {calculateDiscount() > 0 && (
                    <div className="flex justify-between py-2 text-green-600">
                      <span>Réduction</span>
                      <span className="font-medium">-{calculateDiscount().toFixed(2)}€</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-4 mt-2">
                    <div className="flex justify-between py-2">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-gray-900">{calculateTotal().toFixed(2)}€</span>
                    </div>
                  </div>
                  
                  <button 
                    className="mt-6 w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => router.push('/checkout')}
                    disabled={cartItems.length === 0 || !selectedPaymentMethod}
                  >
                    Procéder au paiement
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 