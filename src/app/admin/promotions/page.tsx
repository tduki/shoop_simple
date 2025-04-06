'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon,
  CheckIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  CurrencyEuroIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { isAuthenticated } from '@/services/productService';

// Types pour les codes promo
type PromoType = 'percentage' | 'fixed' | 'free_shipping';

type PromoCode = {
  id: string;
  code: string;
  type: PromoType;
  value: number;
  minimum_purchase?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageCount: number;
  active: boolean;
};

export default function AdminPromotions() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  
  // État du formulaire
  const [formData, setFormData] = useState<Omit<PromoCode, 'id' | 'usageCount'> & {id?: string}>({
    code: '',
    type: 'percentage',
    value: 0,
    minimum_purchase: undefined,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: undefined,
    active: true
  });

  useEffect(() => {
    const checkAuth = async () => {
      const authResult = await isAuthenticated();
      if (!authResult) {
        router.push('/auth/login?returnUrl=/admin/promotions');
        return;
      }
      
      // Charger les codes promo
      fetchPromoCodes();
    };

    checkAuth();
  }, [router]);

  // Fonction pour récupérer les codes promo (simulée)
  const fetchPromoCodes = () => {
    setIsLoading(true);
    
    // Simulation d'une API
    setTimeout(() => {
      const mockPromoCodes: PromoCode[] = [
        {
          id: 'promo-1',
          code: 'SUMMER2024',
          type: 'percentage',
          value: 20,
          startDate: '2024-06-01',
          endDate: '2024-08-31',
          usageCount: 45,
          usageLimit: 100,
          active: true
        },
        {
          id: 'promo-2',
          code: 'WELCOME10',
          type: 'percentage',
          value: 10,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          usageCount: 210,
          active: true
        },
        {
          id: 'promo-3',
          code: 'FREESHIP',
          type: 'free_shipping',
          value: 0,
          minimum_purchase: 50,
          startDate: '2024-05-15',
          endDate: '2024-07-15',
          usageCount: 78,
          active: true
        },
        {
          id: 'promo-4',
          code: 'FIXED20',
          type: 'fixed',
          value: 20,
          minimum_purchase: 100,
          startDate: '2024-04-01',
          endDate: '2024-05-01',
          usageCount: 12,
          active: false
        }
      ];
      
      setPromoCodes(mockPromoCodes);
      setIsLoading(false);
    }, 800);
  };

  // Fonction pour ajouter un code promo
  const handleAddPromoCode = () => {
    if (!validateForm()) return;
    
    const newId = `promo-${Date.now()}`;
    const newPromoCode: PromoCode = {
      id: newId,
      ...formData,
      usageCount: 0
    };
    
    setPromoCodes([...promoCodes, newPromoCode]);
    resetForm();
    setShowForm(false);
    
    // Afficher un message de confirmation
    alert('Code promo ajouté avec succès !');
  };

  // Fonction pour modifier un code promo
  const handleEditPromoCode = () => {
    if (!validateForm() || !editingId) return;
    
    const updatedPromoCodes = promoCodes.map(promo => 
      promo.id === editingId
        ? { ...promo, ...formData }
        : promo
    );
    
    setPromoCodes(updatedPromoCodes);
    resetForm();
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
    
    // Afficher un message de confirmation
    alert('Code promo modifié avec succès !');
  };

  // Fonction pour supprimer un code promo
  const handleDeletePromoCode = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce code promo ?')) {
      setPromoCodes(promoCodes.filter(promo => promo.id !== id));
    }
  };

  // Fonction pour activer/désactiver un code promo
  const togglePromoCodeStatus = (id: string) => {
    setPromoCodes(promoCodes.map(promo => 
      promo.id === id ? { ...promo, active: !promo.active } : promo
    ));
  };

  // Fonction pour préparer l'édition d'un code promo
  const prepareEditPromoCode = (promo: PromoCode) => {
    setFormData({
      code: promo.code,
      type: promo.type,
      value: promo.value,
      minimum_purchase: promo.minimum_purchase,
      startDate: promo.startDate,
      endDate: promo.endDate,
      usageLimit: promo.usageLimit,
      active: promo.active
    });
    
    setIsEditing(true);
    setEditingId(promo.id);
    setShowForm(true);
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: 0,
      minimum_purchase: undefined,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageLimit: undefined,
      active: true
    });
    setFormErrors({});
  };

  // Fonction pour gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? undefined : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.code.trim()) {
      errors.code = "Le code promo est requis";
    } else if (!/^[A-Z0-9_-]+$/.test(formData.code)) {
      errors.code = "Le code ne peut contenir que des lettres majuscules, des chiffres, des tirets et des underscores";
    }
    
    if (formData.type === 'percentage' && (formData.value <= 0 || formData.value > 100)) {
      errors.value = "Le pourcentage doit être entre 1 et 100";
    }
    
    if (formData.type === 'fixed' && formData.value <= 0) {
      errors.value = "La valeur de réduction doit être positive";
    }
    
    if (formData.minimum_purchase !== undefined && formData.minimum_purchase < 0) {
      errors.minimum_purchase = "Le montant minimum d'achat ne peut pas être négatif";
    }
    
    if (!formData.startDate) {
      errors.startDate = "La date de début est requise";
    }
    
    if (!formData.endDate) {
      errors.endDate = "La date de fin est requise";
    } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      errors.endDate = "La date de fin doit être postérieure à la date de début";
    }
    
    if (formData.usageLimit !== undefined && formData.usageLimit <= 0) {
      errors.usageLimit = "La limite d'utilisation doit être positive";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Gestion des promotions</h1>
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Retour au tableau de bord
                </span>
              </Link>
              <button
                onClick={() => {
                  resetForm();
                  setIsEditing(false);
                  setEditingId(null);
                  setShowForm(!showForm);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {showForm ? (
                  <XMarkIcon className="mr-2 h-5 w-5" />
                ) : (
                  <PlusIcon className="mr-2 h-5 w-5" />
                )}
                {showForm ? "Annuler" : "Ajouter un code promo"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Formulaire d'ajout/modification */}
        {showForm && (
          <div className="bg-white rounded-lg shadow mb-8 p-6">
            <h2 className="text-lg font-medium mb-6">{isEditing ? "Modifier le code promo" : "Ajouter un nouveau code promo"}</h2>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Code promo *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="code"
                    id="code"
                    value={formData.code}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formErrors.code ? 'border-red-300' : ''
                    }`}
                    placeholder="ex: SUMMER2024"
                  />
                  {formErrors.code && <p className="mt-1 text-sm text-red-600">{formErrors.code}</p>}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type de promotion *
                </label>
                <div className="mt-1">
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="percentage">Pourcentage</option>
                    <option value="fixed">Montant fixe</option>
                    <option value="free_shipping">Livraison gratuite</option>
                  </select>
                </div>
              </div>

              {formData.type !== 'free_shipping' && (
                <div className="sm:col-span-2">
                  <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                    {formData.type === 'percentage' ? 'Pourcentage (%)' : 'Montant fixe (€)'}
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      name="value"
                      id="value"
                      value={formData.value}
                      onChange={handleChange}
                      className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        formErrors.value ? 'border-red-300' : ''
                      }`}
                      min={0}
                      max={formData.type === 'percentage' ? 100 : undefined}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">
                        {formData.type === 'percentage' ? '%' : '€'}
                      </span>
                    </div>
                  </div>
                  {formErrors.value && <p className="mt-1 text-sm text-red-600">{formErrors.value}</p>}
                </div>
              )}

              <div className="sm:col-span-2">
                <label htmlFor="minimum_purchase" className="block text-sm font-medium text-gray-700">
                  Montant d'achat minimum (€)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    name="minimum_purchase"
                    id="minimum_purchase"
                    value={formData.minimum_purchase === undefined ? '' : formData.minimum_purchase}
                    onChange={handleChange}
                    className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formErrors.minimum_purchase ? 'border-red-300' : ''
                    }`}
                    min={0}
                    placeholder="Optionnel"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">€</span>
                  </div>
                </div>
                {formErrors.minimum_purchase && <p className="mt-1 text-sm text-red-600">{formErrors.minimum_purchase}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700">
                  Limite d'utilisation
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="usageLimit"
                    id="usageLimit"
                    value={formData.usageLimit === undefined ? '' : formData.usageLimit}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formErrors.usageLimit ? 'border-red-300' : ''
                    }`}
                    min={1}
                    placeholder="Illimité"
                  />
                  {formErrors.usageLimit && <p className="mt-1 text-sm text-red-600">{formErrors.usageLimit}</p>}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Date de début *
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formErrors.startDate ? 'border-red-300' : ''
                    }`}
                  />
                  {formErrors.startDate && <p className="mt-1 text-sm text-red-600">{formErrors.startDate}</p>}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  Date de fin *
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formErrors.endDate ? 'border-red-300' : ''
                    }`}
                  />
                  {formErrors.endDate && <p className="mt-1 text-sm text-red-600">{formErrors.endDate}</p>}
                </div>
              </div>

              <div className="sm:col-span-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="active"
                      name="active"
                      type="checkbox"
                      checked={formData.active}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="active" className="font-medium text-gray-700">Actif</label>
                    <p className="text-gray-500">Les codes promo inactifs ne peuvent pas être utilisés, même s'ils sont dans la période de validité.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={isEditing ? handleEditPromoCode : handleAddPromoCode}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {isEditing ? "Mettre à jour" : "Ajouter"}
              </button>
            </div>
          </div>
        )}

        {/* Liste des codes promo */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Codes promotionnels</h3>
            <span className="text-sm text-gray-500">{promoCodes.length} code(s) promo</span>
          </div>
          
          {promoCodes.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">Aucun code promo n'a été créé.</p>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusIcon className="mr-2 h-5 w-5" />
                Ajouter un code promo
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valeur
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Période de validité
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisation
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {promoCodes.map((promo) => (
                    <tr key={promo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{promo.code}</div>
                        {promo.minimum_purchase && (
                          <div className="text-xs text-gray-500">Min. {promo.minimum_purchase}€</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {promo.type === 'percentage' && (
                            <span className="flex items-center">
                              <span className="h-5 w-5 text-indigo-500 mr-1 flex items-center justify-center">%</span>
                              <span className="text-sm text-gray-900">Pourcentage</span>
                            </span>
                          )}
                          {promo.type === 'fixed' && (
                            <span className="flex items-center">
                              <CurrencyEuroIcon className="h-5 w-5 text-green-500 mr-1" />
                              <span className="text-sm text-gray-900">Montant fixe</span>
                            </span>
                          )}
                          {promo.type === 'free_shipping' && (
                            <span className="flex items-center">
                              <TruckIcon className="h-5 w-5 text-blue-500 mr-1" />
                              <span className="text-sm text-gray-900">Livraison gratuite</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {promo.type === 'percentage' && (
                          <span className="text-sm text-gray-900">{promo.value}%</span>
                        )}
                        {promo.type === 'fixed' && (
                          <span className="text-sm text-gray-900">{promo.value}€</span>
                        )}
                        {promo.type === 'free_shipping' && (
                          <span className="text-sm text-gray-900">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">
                            {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        {new Date(promo.endDate) < new Date() && (
                          <span className="text-xs text-red-600">Expiré</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {promo.usageCount} utilisation{promo.usageCount !== 1 ? 's' : ''}
                        </div>
                        {promo.usageLimit && (
                          <div className="text-xs text-gray-500">
                            Limite: {promo.usageLimit} ({Math.round((promo.usageCount / promo.usageLimit) * 100)}%)
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          promo.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {promo.active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => togglePromoCodeStatus(promo.id)}
                            className={`text-gray-400 hover:text-gray-500`}
                            title={promo.active ? 'Désactiver' : 'Activer'}
                          >
                            {promo.active ? (
                              <XMarkIcon className="h-5 w-5" />
                            ) : (
                              <CheckIcon className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => prepareEditPromoCode(promo)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Modifier"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeletePromoCode(promo.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Supprimer"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 