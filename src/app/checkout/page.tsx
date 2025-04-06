'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCartItems, getCartTotal, isAuthenticated } from '@/services/productService';
import toast from 'react-hot-toast';

// Ajouter l'interface PaymentMethod
interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  icon: string;
  fee: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [orderTotal, setOrderTotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });
  const [errors, setErrors] = useState({} as Record<string, string>);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    // Vérifier l'authentification
    if (!isAuthenticated()) {
      toast.error('Veuillez vous connecter pour accéder au paiement');
      localStorage.setItem('redirectAfterLogin', '/cart');
      router.push('/auth/login');
      return;
    }

    // Vérifier que le panier n'est pas vide
    const items = getCartItems();
    if (items.length === 0) {
      toast.error('Votre panier est vide');
      router.push('/cart');
      return;
    }

    // Calculer les totaux
    const subtotal = getCartTotal();
    const shipping = subtotal > 100 ? 0 : 10;
    
    setOrderTotal(subtotal);
    setShippingCost(shipping);
    
    // Récupérer les modes de paiement depuis localStorage
    const paymentMethodId = localStorage.getItem('selectedPaymentMethod');
    if (paymentMethodId) {
      setFormData(prev => ({
        ...prev,
        paymentMethod: paymentMethodId
      }));
    }
    
    // Charger les modes de paiement disponibles
    loadPaymentMethods();
    
    setIsLoading(false);
  }, [router]);

  // Function to load payment methods
  const loadPaymentMethods = () => {
    // Simulation de récupération des méthodes de paiement à partir des paramètres
    setTimeout(() => {
      const methods: PaymentMethod[] = [
        { id: 'card', name: 'Carte bancaire', enabled: true, icon: 'credit-card', fee: 0 },
        { id: 'paypal', name: 'PayPal', enabled: true, icon: 'paypal', fee: 0 },
        { id: 'bank_transfer', name: 'Virement bancaire', enabled: true, icon: 'bank', fee: 0 },
        { id: 'cash_on_delivery', name: 'Paiement à la livraison', enabled: false, icon: 'cash', fee: 5 }
      ];
      
      // Filtrer les méthodes désactivées
      const enabledMethods = methods.filter(method => method.enabled);
      setPaymentMethods(enabledMethods);
    }, 300);
  };

  // Render payment method icon
  const renderPaymentIcon = (iconName: string) => {
    switch (iconName) {
      case 'credit-card':
        return <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>;
      case 'paypal':
        return <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 7h10q1 0 1.5 1t0 2l-3 10H6l-1.5-10q-.5-3 2-3Z"></path><path d="M10.5 7h8q1 0 1.5 1t0 2l-2 6"></path></svg>;
      case 'bank':
        return <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="9" width="20" height="12" rx="2" ry="2"></rect><circle cx="12" cy="14" r="3"></circle><path d="M2 9v0a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v0"></path></svg>;
      case 'cash':
        return <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>;
      default:
        return null;
    }
  };

  // Calculate payment fee
  const getPaymentFee = () => {
    const method = paymentMethods.find(m => m.id === formData.paymentMethod);
    return method ? method.fee : 0;
  };
  
  // Ajouter le coût du moyen de paiement au total
  const paymentFee = getPaymentFee();
  const totalWithFees = orderTotal + shippingCost + paymentFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Effacer l'erreur quand l'utilisateur corrige le champ
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validation des champs requis
    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise';
    if (!formData.city.trim()) newErrors.city = 'La ville est requise';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Le code postal est requis';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Veuillez sélectionner un mode de paiement';
    
    // Validation email
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    // Validation code postal
    if (formData.postalCode && !/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Le code postal doit contenir 5 chiffres';
    }
    
    // Validation carte de crédit (si méthode de paiement par carte)
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Le numéro de carte est requis';
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'La date d\'expiration est requise';
      if (!formData.cardCvc.trim()) newErrors.cardCvc = 'Le code de sécurité est requis';
      
      // Format numéro de carte
      if (formData.cardNumber && !/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Numéro de carte invalide';
      }
      
      // Format date d'expiration
      if (formData.cardExpiry && !/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = 'Format invalide (MM/YY)';
      }
      
      // Format CVC
      if (formData.cardCvc && !/^\d{3}$/.test(formData.cardCvc)) {
        newErrors.cardCvc = 'Le CVC doit contenir 3 chiffres';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }
    
    // Sauvegarder le mode de paiement sélectionné
    localStorage.setItem('selectedPaymentMethod', formData.paymentMethod);
    
    // Simuler le traitement du paiement
    setProcessingPayment(true);
    setTimeout(() => {
      setProcessingPayment(false);
      // Rediriger vers une page de confirmation
      router.push('/checkout/confirmation');
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="ml-3 text-gray-600">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Finaliser votre commande</h1>
          
          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Récapitulatif de la commande</h2>
            </div>
            <div className="px-6 py-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-medium text-gray-900">{orderTotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Livraison</span>
                <span className="font-medium text-gray-900">
                  {shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(2)}€`}
                </span>
              </div>
              {paymentFee > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Frais de paiement</span>
                  <span className="font-medium text-gray-900">{paymentFee.toFixed(2)}€</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-4 mt-2">
                <div className="flex justify-between py-2">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-semibold text-gray-900">{totalWithFees.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow overflow-hidden mb-6">
            {/* Informations de livraison */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Informations de livraison</h2>
            </div>
            <div className="px-6 py-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Adresse
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900`}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Ville
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Code postal
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900`}
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
                )}
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Pays
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                >
                  <option value="France">France</option>
                  <option value="Belgique">Belgique</option>
                  <option value="Suisse">Suisse</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
            </div>
            
            {/* Informations de paiement */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Méthode de paiement</h2>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors ${
                      formData.paymentMethod === method.id
                        ? 'bg-indigo-50 border-indigo-300'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={formData.paymentMethod === method.id}
                      onChange={handleInputChange}
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
                {errors.paymentMethod && (
                  <p className="mt-1 text-sm text-red-600">{errors.paymentMethod}</p>
                )}
              </div>
            </div>
            
            {/* Afficher les champs de carte uniquement si mode de paiement par carte */}
            {formData.paymentMethod === 'card' && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                  <div className="sm:col-span-3">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                      Numéro de carte
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className={`mt-1 block w-full border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900`}
                    />
                    {errors.cardNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700">
                      Date d'expiration
                    </label>
                    <input
                      type="text"
                      id="cardExpiry"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className={`mt-1 block w-full border ${errors.cardExpiry ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900`}
                    />
                    {errors.cardExpiry && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardExpiry}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700">
                      CVC
                    </label>
                    <input
                      type="text"
                      id="cardCvc"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleInputChange}
                      placeholder="123"
                      className={`mt-1 block w-full border ${errors.cardCvc ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900`}
                    />
                    {errors.cardCvc && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardCvc}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Boutons d'action */}
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
              <Link href="/cart" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                Retour au panier
              </Link>
              
              <button
                type="submit"
                disabled={processingPayment}
                className={`inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${processingPayment ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {processingPayment ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Traitement en cours...
                  </>
                ) : (
                  'Confirmer la commande'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 