'use client';

import { useState } from 'react';
import { Switch } from '@headlessui/react';

type Preference = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

type NotificationCategory = {
  id: string;
  name: string;
  items: Preference[];
};

export default function PreferencesForm() {
  const [notificationCategories, setNotificationCategories] = useState<NotificationCategory[]>([
    {
      id: 'marketing',
      name: 'Marketing',
      items: [
        {
          id: 'newsletter',
          title: 'Newsletter hebdomadaire',
          description: 'Recevez nos dernières actualités et offres spéciales chaque semaine.',
          enabled: true
        },
        {
          id: 'promotions',
          title: 'Promotions et soldes',
          description: 'Soyez informé en priorité de nos promotions exclusives et des périodes de soldes.',
          enabled: true
        },
        {
          id: 'new_products',
          title: 'Nouveaux produits',
          description: 'Découvrez les nouveaux produits dès leur mise en ligne.',
          enabled: false
        }
      ]
    },
    {
      id: 'account',
      name: 'Compte et commandes',
      items: [
        {
          id: 'order_status',
          title: 'Statut des commandes',
          description: 'Recevez des notifications concernant l\'état de vos commandes.',
          enabled: true
        },
        {
          id: 'delivery',
          title: 'Livraison',
          description: 'Soyez informé de l\'avancement de vos livraisons en temps réel.',
          enabled: true
        },
        {
          id: 'account_security',
          title: 'Sécurité du compte',
          description: 'Notifications concernant les connexions et les modifications apportées à votre compte.',
          enabled: true
        }
      ]
    }
  ]);
  
  const [successMessage, setSuccessMessage] = useState('');
  
  const [displayPreferences, setDisplayPreferences] = useState({
    darkMode: false,
    saveSearchHistory: true,
    showRecentlyViewed: true,
    currency: 'EUR',
    language: 'fr'
  });
  
  const togglePreference = (categoryId: string, itemId: string) => {
    setNotificationCategories(prevCategories => 
      prevCategories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.map(item => {
              if (item.id === itemId) {
                return { ...item, enabled: !item.enabled };
              }
              return item;
            })
          };
        }
        return category;
      })
    );
    
    // Simuler la sauvegarde
    setSuccessMessage('Vos préférences de notification ont été mises à jour');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  const handleDisplayPrefChange = (name: string, value: any) => {
    setDisplayPreferences(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Simuler la sauvegarde
    setSuccessMessage('Vos préférences d\'affichage ont été mises à jour');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Préférences</h2>
      
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Préférences d'affichage</h3>
          <div className="mt-5 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">Mode sombre</span>
                <p className="text-sm text-gray-500">Utiliser un thème sombre pour l'interface du site</p>
              </div>
              <Switch
                checked={displayPreferences.darkMode}
                onChange={(checked) => handleDisplayPrefChange('darkMode', checked)}
                className={`${
                  displayPreferences.darkMode ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              >
                <span className="sr-only">Activer le mode sombre</span>
                <span
                  className={`${
                    displayPreferences.darkMode ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">Enregistrer l'historique de recherche</span>
                <p className="text-sm text-gray-500">Sauvegarder vos recherches récentes pour y accéder rapidement</p>
              </div>
              <Switch
                checked={displayPreferences.saveSearchHistory}
                onChange={(checked) => handleDisplayPrefChange('saveSearchHistory', checked)}
                className={`${
                  displayPreferences.saveSearchHistory ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              >
                <span className="sr-only">Enregistrer l'historique de recherche</span>
                <span
                  className={`${
                    displayPreferences.saveSearchHistory ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">Afficher les articles récemment consultés</span>
                <p className="text-sm text-gray-500">Voir vos articles récemment consultés sur la page d'accueil</p>
              </div>
              <Switch
                checked={displayPreferences.showRecentlyViewed}
                onChange={(checked) => handleDisplayPrefChange('showRecentlyViewed', checked)}
                className={`${
                  displayPreferences.showRecentlyViewed ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              >
                <span className="sr-only">Afficher les articles récemment consultés</span>
                <span
                  className={`${
                    displayPreferences.showRecentlyViewed ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
            
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                  Devise
                </label>
                <select
                  id="currency"
                  name="currency"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  value={displayPreferences.currency}
                  onChange={(e) => handleDisplayPrefChange('currency', e.target.value)}
                >
                  <option value="EUR">Euro (€)</option>
                  <option value="USD">Dollar américain ($)</option>
                  <option value="GBP">Livre sterling (£)</option>
                  <option value="CAD">Dollar canadien ($)</option>
                  <option value="CHF">Franc suisse (Fr)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                  Langue
                </label>
                <select
                  id="language"
                  name="language"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  value={displayPreferences.language}
                  onChange={(e) => handleDisplayPrefChange('language', e.target.value)}
                >
                  <option value="fr">Français</option>
                  <option value="en">Anglais</option>
                  <option value="es">Espagnol</option>
                  <option value="de">Allemand</option>
                  <option value="it">Italien</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {notificationCategories.map(category => (
        <div key={category.id} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Notifications {category.name}</h3>
            <div className="mt-5 space-y-6">
              {category.items.map(item => (
                <div key={item.id} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={item.id}
                      name={item.id}
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => togglePreference(category.id, item.id)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor={item.id} className="font-medium text-gray-700">{item.title}</label>
                    <p className="text-gray-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Canaux de communication</h3>
          <p className="mt-1 text-sm text-gray-500">
            Indiquez comment vous souhaitez recevoir vos notifications.
          </p>
          <div className="mt-5">
            <fieldset>
              <legend className="sr-only">Canaux de notification</legend>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="email"
                      name="email"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      defaultChecked
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="email" className="font-medium text-gray-700">E-mail</label>
                    <p className="text-gray-500">Recevoir les notifications par e-mail.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="sms"
                      name="sms"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="sms" className="font-medium text-gray-700">SMS</label>
                    <p className="text-gray-500">Recevoir les notifications par SMS.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="browser"
                      name="browser"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      defaultChecked
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="browser" className="font-medium text-gray-700">Navigateur</label>
                    <p className="text-gray-500">Recevoir les notifications push sur votre navigateur.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="mobile"
                      name="mobile"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      defaultChecked
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="mobile" className="font-medium text-gray-700">Application mobile</label>
                    <p className="text-gray-500">Recevoir les notifications sur notre application mobile.</p>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setSuccessMessage('Toutes vos préférences ont été enregistrées');
            setTimeout(() => {
              setSuccessMessage('');
            }, 3000);
          }}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Enregistrer toutes les préférences
        </button>
      </div>
    </div>
  );
} 