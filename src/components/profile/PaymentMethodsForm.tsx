'use client';

import { useState } from 'react';
import { CreditCardIcon, PlusIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';

type PaymentMethod = {
  id: string;
  type: 'card' | 'paypal';
  default: boolean;
  last4?: string;
  expiryDate?: string;
  cardBrand?: 'visa' | 'mastercard' | 'amex';
  email?: string;
};

export default function PaymentMethodsForm() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      cardBrand: 'visa',
      last4: '4242',
      expiryDate: '04/25',
      default: true
    },
    {
      id: '2',
      type: 'paypal',
      email: 'john.doe@example.com',
      default: false
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCardInfo, setNewCardInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    saveForFuture: true
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCardInfo({
      ...newCardInfo,
      [name]: value
    });
    
    // Effacer l'erreur quand l'utilisateur corrige le champ
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!newCardInfo.cardNumber.trim()) {
      newErrors.cardNumber = 'Le numéro de carte est requis';
    } else if (!/^\d{16}$/.test(newCardInfo.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Numéro de carte invalide';
    }
    
    if (!newCardInfo.cardHolder.trim()) {
      newErrors.cardHolder = 'Le nom du titulaire est requis';
    }
    
    if (!newCardInfo.expiryDate.trim()) {
      newErrors.expiryDate = 'La date d\'expiration est requise';
    } else if (!/^\d{2}\/\d{2}$/.test(newCardInfo.expiryDate)) {
      newErrors.expiryDate = 'Format invalide (MM/YY)';
    }
    
    if (!newCardInfo.cvv.trim()) {
      newErrors.cvv = 'Le code de sécurité est requis';
    } else if (!/^\d{3,4}$/.test(newCardInfo.cvv)) {
      newErrors.cvv = 'Code de sécurité invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Simuler l'ajout d'une carte
    const last4 = newCardInfo.cardNumber.slice(-4);
    const newCard: PaymentMethod = {
      id: `card-${Date.now()}`,
      type: 'card',
      cardBrand: 'visa', // Déterminer dynamiquement en production
      last4,
      expiryDate: newCardInfo.expiryDate,
      default: paymentMethods.length === 0 // Première carte = par défaut
    };
    
    setPaymentMethods([...paymentMethods, newCard]);
    
    // Réinitialiser le formulaire
    setNewCardInfo({
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
      saveForFuture: true
    });
    setShowAddForm(false);
  };
  
  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map(method => ({
        ...method,
        default: method.id === id
      }))
    );
  };
  
  const handleDelete = (id: string) => {
    // Empêcher de supprimer le moyen de paiement par défaut
    const methodToDelete = paymentMethods.find(method => method.id === id);
    if (methodToDelete?.default && paymentMethods.length > 1) {
      alert('Vous ne pouvez pas supprimer votre moyen de paiement par défaut. Veuillez d\'abord définir un autre moyen de paiement par défaut.');
      return;
    }
    
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };
  
  const getCardIcon = (brand?: 'visa' | 'mastercard' | 'amex') => {
    switch(brand) {
      case 'visa':
        return '💳 Visa';
      case 'mastercard':
        return '💳 Mastercard';
      case 'amex':
        return '💳 American Express';
      default:
        return '💳';
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Mes moyens de paiement</h2>
      
      <div className="space-y-6">
        {paymentMethods.map(method => (
          <div 
            key={method.id} 
            className={`p-4 border rounded-lg ${method.default ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {method.type === 'card' ? (
                  <div className="p-2 bg-white rounded border border-gray-200">
                    {getCardIcon(method.cardBrand)}
                  </div>
                ) : (
                  <div className="p-2 bg-white rounded border border-gray-200">
                    <span className="text-blue-600">PayPal</span>
                  </div>
                )}
                
                <div>
                  {method.type === 'card' ? (
                    <>
                      <p className="font-medium text-gray-900">•••• •••• •••• {method.last4}</p>
                      <p className="text-sm text-gray-500">Expire le {method.expiryDate}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-gray-900">Compte PayPal</p>
                      <p className="text-sm text-gray-500">{method.email}</p>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {method.default ? (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded">
                    <CheckCircleIcon className="h-4 w-4 mr-1" /> Par défaut
                  </span>
                ) : (
                  <button 
                    onClick={() => handleSetDefault(method.id)}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Définir par défaut
                  </button>
                )}
                
                <button 
                  onClick={() => handleDelete(method.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Ajouter un moyen de paiement</span>
          </button>
        ) : (
          <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter une carte de crédit</h3>
            
            <form onSubmit={handleAddCard}>
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-2">
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                    Numéro de carte
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={newCardInfo.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className={`block w-full rounded-md shadow-sm ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900`}
                    />
                    {errors.cardNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                    )}
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700">
                    Nom du titulaire
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="cardHolder"
                      name="cardHolder"
                      value={newCardInfo.cardHolder}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={`block w-full rounded-md shadow-sm ${errors.cardHolder ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900`}
                    />
                    {errors.cardHolder && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardHolder}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                    Date d'expiration
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={newCardInfo.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className={`block w-full rounded-md shadow-sm ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900`}
                    />
                    {errors.expiryDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                    Code de sécurité (CVV)
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={newCardInfo.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className={`block w-full rounded-md shadow-sm ${errors.cvv ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900`}
                    />
                    {errors.cvv && (
                      <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                    )}
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <div className="flex items-center">
                    <Switch
                      checked={newCardInfo.saveForFuture}
                      onChange={(checked) => setNewCardInfo({...newCardInfo, saveForFuture: checked})}
                      className={`${
                        newCardInfo.saveForFuture ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                    >
                      <span
                        className={`${
                          newCardInfo.saveForFuture ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                    <span className="ml-3 text-sm text-gray-600">
                      Enregistrer cette carte pour mes futurs achats
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Ajouter la carte
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      <div className="mt-10 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Moyens de paiement acceptés</h3>
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-white border border-gray-200 rounded">
            <span className="text-lg">💳 Visa</span>
          </div>
          <div className="p-2 bg-white border border-gray-200 rounded">
            <span className="text-lg">💳 Mastercard</span>
          </div>
          <div className="p-2 bg-white border border-gray-200 rounded">
            <span className="text-lg">💳 American Express</span>
          </div>
          <div className="p-2 bg-white border border-gray-200 rounded">
            <span className="text-lg">PayPal</span>
          </div>
        </div>
      </div>
    </div>
  );
} 