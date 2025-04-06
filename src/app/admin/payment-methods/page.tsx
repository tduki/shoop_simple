'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon, 
  CreditCardIcon,
  BanknotesIcon,
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import { toast, Toaster } from 'react-hot-toast';
import AdminHeader from '@/components/AdminHeader';

// Types pour les méthodes de paiement
interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  fee: number;
  feeType: 'percentage' | 'fixed';
  enabled: boolean;
  tokenRequired: boolean;
  tokenLabel?: string;
  tokenPlaceholder?: string;
  credentials?: Record<string, string>;
}

// Composant principal de la page
export default function PaymentMethodsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentMethod, setCurrentMethod] = useState<PaymentMethod | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Record<string, string>>({});

  // Méthode en cours d'édition ou nouvelle méthode
  const [editedMethod, setEditedMethod] = useState<PaymentMethod>({
    id: '',
    name: '',
    description: '',
    icon: 'credit-card',
    fee: 0,
    feeType: 'fixed',
    enabled: true,
    tokenRequired: false,
    tokenLabel: '',
    tokenPlaceholder: '',
    credentials: {}
  });

  // Vérifier l'authentification au chargement
  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  // Récupérer les méthodes de paiement (simulation ou localStorage)
  const fetchPaymentMethods = () => {
    setIsLoading(true);
    
    // Vérifier si des méthodes existent déjà dans le localStorage
    try {
      const savedMethods = localStorage.getItem('payment_methods');
      if (savedMethods) {
        const parsedMethods = JSON.parse(savedMethods);
        if (Array.isArray(parsedMethods) && parsedMethods.length > 0) {
          setPaymentMethods(parsedMethods);
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des méthodes de paiement:', error);
    }
    
    // Si aucune méthode n'est trouvée dans le localStorage, utiliser les valeurs par défaut
    setTimeout(() => {
      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: 'card',
          name: 'Carte bancaire',
          description: 'Paiement par carte Visa, Mastercard, etc.',
          icon: 'credit-card',
          fee: 0,
          feeType: 'fixed',
          enabled: true,
          tokenRequired: true,
          tokenLabel: 'Clé API Stripe',
          tokenPlaceholder: 'sk_test_...',
          credentials: {
            apiKey: 'sk_test_example123',
            publicKey: 'pk_test_example456'
          }
        },
        {
          id: 'paypal',
          name: 'PayPal',
          description: 'Paiement via compte PayPal',
          icon: 'paypal',
          fee: 2.9,
          feeType: 'percentage',
          enabled: true,
          tokenRequired: true,
          tokenLabel: 'ID Client PayPal',
          tokenPlaceholder: 'client_id_...',
          credentials: {
            clientId: 'client_id_example',
            clientSecret: 'client_secret_example'
          }
        },
        {
          id: 'bank_transfer',
          name: 'Virement bancaire',
          description: 'Paiement par virement bancaire',
          icon: 'bank',
          fee: 0,
          feeType: 'fixed',
          enabled: true,
          tokenRequired: false
        },
        {
          id: 'cash_on_delivery',
          name: 'Paiement à la livraison',
          description: 'Paiement en espèces à la réception',
          icon: 'cash',
          fee: 5,
          feeType: 'fixed',
          enabled: false,
          tokenRequired: false
        }
      ];
      
      // Sauvegarder les méthodes par défaut dans le localStorage
      try {
        localStorage.setItem('payment_methods', JSON.stringify(mockPaymentMethods));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des méthodes de paiement par défaut:', error);
      }
      
      setPaymentMethods(mockPaymentMethods);
      setIsLoading(false);
    }, 800);
  };

  // Ouvrir le modal pour éditer une méthode
  const handleEditMethod = (method: PaymentMethod) => {
    setEditedMethod({...method});
    setCredentials(method.credentials || {});
    setCurrentMethod(method);
    setShowModal(true);
  };

  // Ouvrir le modal pour créer une nouvelle méthode
  const handleAddMethod = () => {
    setEditedMethod({
      id: `method_${Date.now()}`,
      name: '',
      description: '',
      icon: 'credit-card',
      fee: 0,
      feeType: 'fixed',
      enabled: true,
      tokenRequired: false,
      tokenLabel: '',
      tokenPlaceholder: '',
      credentials: {}
    });
    setCredentials({});
    setCurrentMethod(null);
    setShowModal(true);
  };

  // Gérer la mise à jour des champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditedMethod({...editedMethod, [name]: checked});
    } else if (name === 'fee') {
      setEditedMethod({...editedMethod, [name]: parseFloat(value) || 0});
    } else {
      setEditedMethod({...editedMethod, [name]: value});
    }
  };

  // Gérer la mise à jour des identifiants API
  const handleCredentialChange = (key: string, value: string) => {
    setCredentials({...credentials, [key]: value});
  };

  // Gérer l'ajout d'un nouveau champ d'identifiants
  const handleAddCredentialField = () => {
    setCredentials({...credentials, [`key_${Object.keys(credentials).length}`]: ''});
  };

  // Gérer la suppression d'un champ d'identifiants
  const handleRemoveCredentialField = (key: string) => {
    const updatedCredentials = {...credentials};
    delete updatedCredentials[key];
    setCredentials(updatedCredentials);
  };

  // Sauvegarder la méthode de paiement
  const handleSaveMethod = () => {
    // Validation basique
    if (!editedMethod.name.trim()) {
      toast.error('Le nom de la méthode est requis');
      return;
    }
    
    if (editedMethod.tokenRequired && !editedMethod.tokenLabel) {
      toast.error('Le libellé du token est requis');
      return;
    }
    
    // Ajouter les identifiants
    const methodToSave = {
      ...editedMethod,
      credentials: credentials
    };
    
    // Mettre à jour ou ajouter la méthode
    let updatedMethods: PaymentMethod[];
    
    if (currentMethod) {
      // Mise à jour
      updatedMethods = paymentMethods.map(method => 
        method.id === currentMethod.id ? methodToSave : method
      );
      toast.success('Méthode de paiement mise à jour');
    } else {
      // Création
      updatedMethods = [...paymentMethods, methodToSave];
      toast.success('Méthode de paiement ajoutée');
    }
    
    setPaymentMethods(updatedMethods);
    
    // Sauvegarder les méthodes dans le localStorage pour être utilisées par le panier
    try {
      localStorage.setItem('payment_methods', JSON.stringify(updatedMethods));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des méthodes de paiement:', error);
      toast.error('Erreur lors de la sauvegarde dans le navigateur');
    }
    
    setShowModal(false);
  };

  // Supprimer une méthode de paiement
  const handleDeleteMethod = (id: string) => {
    setConfirmDelete(id);
  };

  // Confirmer la suppression
  const confirmDeleteMethod = () => {
    if (!confirmDelete) return;
    
    const updatedMethods = paymentMethods.filter(method => method.id !== confirmDelete);
    setPaymentMethods(updatedMethods);
    
    // Mettre à jour le localStorage
    try {
      localStorage.setItem('payment_methods', JSON.stringify(updatedMethods));
    } catch (error) {
      console.error('Erreur lors de la mise à jour des méthodes de paiement:', error);
    }
    
    setConfirmDelete(null);
    toast.success('Méthode de paiement supprimée');
  };

  // Activer/désactiver une méthode de paiement
  const toggleMethodStatus = (id: string) => {
    const updatedMethods = paymentMethods.map(method => {
      if (method.id === id) {
        return {...method, enabled: !method.enabled};
      }
      return method;
    });
    
    setPaymentMethods(updatedMethods);
    
    // Mettre à jour le localStorage
    try {
      localStorage.setItem('payment_methods', JSON.stringify(updatedMethods));
    } catch (error) {
      console.error('Erreur lors de la mise à jour des méthodes de paiement:', error);
    }
    
    const method = paymentMethods.find(m => m.id === id);
    if (method) {
      toast.success(`Méthode ${method.enabled ? 'désactivée' : 'activée'}`);
    }
  };

  // Obtenir l'icône d'une méthode de paiement
  const getMethodIcon = (iconName: string) => {
    switch (iconName) {
      case 'credit-card':
        return <CreditCardIcon className="h-6 w-6" />;
      case 'bank':
        return <BanknotesIcon className="h-6 w-6" />;
      case 'cash':
        return <CurrencyDollarIcon className="h-6 w-6" />;
      case 'paypal':
        return (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.58 2.975-2.477 6.17-8.233 6.17h-2.19c-.1 0-.197.022-.276.064L8.56 24h4.516c.432 0 .796-.316.863-.745l.357-2.324.009-.042.051-.326.391-2.54a.87.87 0 0 1 .863-.746h.55c3.537 0 6.292-1.442 7.097-5.611.3-1.544.268-2.836-.439-3.741-.009-.011-.022-.023-.03-.034l-.069-.067z" />
          </svg>
        );
      default:
        return <CreditCardIcon className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <AdminHeader 
        title="Méthodes de paiement" 
        actionButton={
          <button
            onClick={handleAddMethod}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Ajouter une méthode
          </button>
        }
      />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <span className="ml-3 text-gray-700">Chargement des méthodes de paiement...</span>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {paymentMethods.map((method) => (
                <li key={method.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center ${method.enabled ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                        {getMethodIcon(method.icon)}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">{method.name}</h3>
                          {method.enabled ? (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Actif
                            </span>
                          ) : (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              Inactif
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{method.description}</p>
                        <div className="mt-1 text-sm text-gray-500">
                          <span className="font-medium">Frais:</span> {method.fee > 0 ? (
                            method.feeType === 'percentage' ? `${method.fee}%` : `${method.fee}€`
                          ) : 'Aucun'}
                        </div>
                        {method.tokenRequired && (
                          <div className="mt-1 text-sm text-indigo-600">
                            <span>Configuration requise: {method.tokenLabel}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleMethodStatus(method.id)}
                        className={`p-2 rounded-full ${method.enabled ? 'text-gray-400 hover:text-red-500' : 'text-gray-400 hover:text-green-500'}`}
                        title={method.enabled ? "Désactiver" : "Activer"}
                      >
                        {method.enabled ? (
                          <XMarkIcon className="h-5 w-5" />
                        ) : (
                          <CheckIcon className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEditMethod(method)}
                        className="p-2 rounded-full text-gray-400 hover:text-indigo-600"
                        title="Modifier"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMethod(method.id)}
                        className="p-2 rounded-full text-gray-400 hover:text-red-600"
                        title="Supprimer"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
              
              {paymentMethods.length === 0 && (
                <li className="px-6 py-8 text-center">
                  <p className="text-gray-500">Aucune méthode de paiement configurée</p>
                  <button
                    onClick={handleAddMethod}
                    className="mt-3 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                  >
                    <PlusIcon className="h-5 w-5 inline-block mr-1" />
                    Ajouter une méthode
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </main>

      {/* Modal d'édition */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {currentMethod ? 'Modifier' : 'Ajouter'} une méthode de paiement
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom de la méthode <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={editedMethod.name}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={editedMethod.description}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
                    Icône
                  </label>
                  <div className="mt-1">
                    <select
                      id="icon"
                      name="icon"
                      value={editedMethod.icon}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="credit-card">Carte bancaire</option>
                      <option value="bank">Banque</option>
                      <option value="cash">Espèces</option>
                      <option value="paypal">PayPal</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="fee" className="block text-sm font-medium text-gray-700">
                    Frais
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="number"
                      name="fee"
                      id="fee"
                      min="0"
                      step="0.01"
                      value={editedMethod.fee}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    <select
                      name="feeType"
                      value={editedMethod.feeType}
                      onChange={handleInputChange}
                      className="ml-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="fixed">€</option>
                      <option value="percentage">%</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <div className="flex items-center">
                    <input
                      id="enabled"
                      name="enabled"
                      type="checkbox"
                      checked={editedMethod.enabled}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900">
                      Méthode active
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <div className="flex items-center">
                    <input
                      id="tokenRequired"
                      name="tokenRequired"
                      type="checkbox"
                      checked={editedMethod.tokenRequired}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="tokenRequired" className="ml-2 block text-sm text-gray-900">
                      Configuration API requise
                    </label>
                  </div>
                </div>

                {editedMethod.tokenRequired && (
                  <>
                    <div className="sm:col-span-3">
                      <label htmlFor="tokenLabel" className="block text-sm font-medium text-gray-700">
                        Libellé du token <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="tokenLabel"
                          id="tokenLabel"
                          value={editedMethod.tokenLabel || ''}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="tokenPlaceholder" className="block text-sm font-medium text-gray-700">
                        Placeholder
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="tokenPlaceholder"
                          id="tokenPlaceholder"
                          value={editedMethod.tokenPlaceholder || ''}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <div className="border-t border-gray-200 pt-4 mb-2">
                        <h4 className="text-sm font-medium text-gray-900 flex justify-between">
                          <span>Identifiants d'API</span>
                          <button
                            type="button"
                            onClick={handleAddCredentialField}
                            className="text-indigo-600 hover:text-indigo-900 text-sm"
                          >
                            + Ajouter un champ
                          </button>
                        </h4>
                      </div>
                      
                      {Object.entries(credentials).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 mb-3">
                          <input
                            type="text"
                            value={key}
                            onChange={(e) => {
                              const newCredentials = {...credentials};
                              delete newCredentials[key];
                              newCredentials[e.target.value] = value;
                              setCredentials(newCredentials);
                            }}
                            placeholder="Clé"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handleCredentialChange(key, e.target.value)}
                            placeholder="Valeur"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveCredentialField(key)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none mr-3"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveMethod}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <ExclamationTriangleIcon className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                Confirmer la suppression
              </h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Êtes-vous sûr de vouloir supprimer cette méthode de paiement ? Cette action est irréversible.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(null)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteMethod}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 