'use client';

import { useState } from 'react';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

type Address = {
  id: string;
  name: string;
  street: string;
  additionalInfo?: string;
  postalCode: string;
  city: string;
  country: string;
  default: boolean;
  phone?: string;
};

export default function AddressForm() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'Domicile',
      street: '123 Rue de la Paix',
      postalCode: '75001',
      city: 'Paris',
      country: 'France',
      default: true,
      phone: '+33 6 12 34 56 78'
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    name: '',
    street: '',
    additionalInfo: '',
    postalCode: '',
    city: '',
    country: 'France',
    default: false,
    phone: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      street: '',
      additionalInfo: '',
      postalCode: '',
      city: '',
      country: 'France',
      default: false,
      phone: ''
    });
    setShowForm(false);
    setIsEditing(null);
  };
  
  const handleEditAddress = (address: Address) => {
    setFormData({
      name: address.name,
      street: address.street,
      additionalInfo: address.additionalInfo || '',
      postalCode: address.postalCode,
      city: address.city,
      country: address.country,
      default: address.default,
      phone: address.phone || ''
    });
    setIsEditing(address.id);
    setShowForm(true);
  };
  
  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(address => address.id !== id));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      // Mise à jour d'une adresse existante
      setAddresses(addresses.map(address => {
        if (address.id === isEditing) {
          return {
            ...formData,
            id: isEditing
          };
        }
        // Si on définit cette adresse comme par défaut, on retire ce statut des autres
        if (formData.default && address.id !== isEditing) {
          return {
            ...address,
            default: false
          };
        }
        return address;
      }));
    } else {
      // Ajout d'une nouvelle adresse
      const newAddress: Address = {
        ...formData,
        id: `address-${Date.now()}`
      };
      
      // Si c'est la première adresse ou si elle est définie par défaut
      if (addresses.length === 0 || formData.default) {
        setAddresses([
          newAddress,
          ...addresses.map(a => ({ ...a, default: false }))
        ]);
      } else {
        setAddresses([...addresses, newAddress]);
      }
    }
    
    resetForm();
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Mes adresses de livraison</h2>
      
      {addresses.length > 0 ? (
        <div className="space-y-4 mb-6">
          {addresses.map(address => (
            <div 
              key={address.id} 
              className={`p-4 border rounded-lg ${address.default ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
            >
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900">{address.name}</h3>
                    {address.default && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded">
                        Par défaut
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mt-1">{address.street}</p>
                  {address.additionalInfo && <p className="text-gray-700">{address.additionalInfo}</p>}
                  <p className="text-gray-700">{address.postalCode} {address.city}</p>
                  <p className="text-gray-700">{address.country}</p>
                  {address.phone && <p className="text-gray-700 mt-1">{address.phone}</p>}
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditAddress(address)}
                    className="p-1 text-gray-600 hover:text-indigo-600"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteAddress(address.id)}
                    className="p-1 text-gray-600 hover:text-red-600"
                    disabled={address.default && addresses.length > 1}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 mb-6">
          <p className="text-gray-600">Vous n'avez pas encore d'adresse enregistrée.</p>
        </div>
      )}
      
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Ajouter une adresse</span>
        </button>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {isEditing ? 'Modifier l\'adresse' : 'Ajouter une adresse'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom de l'adresse
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Domicile, Bureau, etc."
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    required
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                  Rue
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    required
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
                  Complément d'adresse (optionnel)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Code postal
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Ville
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Pays
                </label>
                <div className="mt-1">
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    required
                  >
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="default"
                      name="default"
                      type="checkbox"
                      checked={formData.default}
                      onChange={handleCheckboxChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="default" className="font-medium text-gray-700">
                      Définir comme adresse par défaut
                    </label>
                    <p className="text-gray-500">Cette adresse sera utilisée automatiquement lors de vos prochaines commandes.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isEditing ? 'Enregistrer les modifications' : 'Ajouter cette adresse'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 