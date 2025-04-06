'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowPathIcon,
  Cog6ToothIcon, 
  CreditCardIcon,
  TruckIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  QrCodeIcon,
  IdentificationIcon,
  BanknotesIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { isAuthenticated } from '@/services/productService';

type Setting = {
  id: string;
  key: string;
  value: string;
  group: 'general' | 'payment' | 'shipping' | 'email' | 'security' | 'legal' | 'social' | 'categories' | 'payment_methods';
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'color' | 'json' | 'array';
  options?: string[];
  label: string;
  description?: string;
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Setting['group']>('general');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const authResult = await isAuthenticated();
      if (!authResult) {
        router.push('/auth/login?returnUrl=/admin/settings');
        return;
      }
      
      fetchSettings();
    };

    checkAuth();
  }, [router]);

  const fetchSettings = () => {
    setIsLoading(true);
    
    // Simulation d'une récupération d'API
    setTimeout(() => {
      const mockSettings: Setting[] = [
        // Paramètres généraux
        {
          id: 'setting-1',
          key: 'store_name',
          value: 'Streeter',
          group: 'general',
          type: 'text',
          label: 'Nom de la boutique'
        },
        {
          id: 'setting-2',
          key: 'store_description',
          value: 'Votre boutique de streetwear en ligne',
          group: 'general',
          type: 'textarea',
          label: 'Description de la boutique'
        },
        {
          id: 'setting-3',
          key: 'store_email',
          value: 'contact@streeter.com',
          group: 'general',
          type: 'text',
          label: 'Email de contact'
        },
        {
          id: 'setting-4',
          key: 'store_phone',
          value: '+33123456789',
          group: 'general',
          type: 'text',
          label: 'Téléphone'
        },
        {
          id: 'setting-5',
          key: 'store_address',
          value: '123 Rue Principale, 75001 Paris, France',
          group: 'general',
          type: 'textarea',
          label: 'Adresse physique'
        },
        {
          id: 'setting-6',
          key: 'currency',
          value: 'EUR',
          group: 'general',
          type: 'select',
          options: ['EUR', 'USD', 'GBP'],
          label: 'Devise principale'
        },
        {
          id: 'setting-7',
          key: 'language',
          value: 'fr',
          group: 'general',
          type: 'select',
          options: ['fr', 'en', 'es', 'de'],
          label: 'Langue par défaut'
        },
        
        // Paramètres de paiement
        {
          id: 'setting-8',
          key: 'stripe_enabled',
          value: 'true',
          group: 'payment',
          type: 'boolean',
          label: 'Activer Stripe'
        },
        {
          id: 'setting-9',
          key: 'stripe_public_key',
          value: 'pk_test_51NMmZtKnW7fFIecb',
          group: 'payment',
          type: 'text',
          label: 'Clé publique Stripe',
          description: 'Votre clé publique Stripe pour l\'intégration du paiement'
        },
        {
          id: 'setting-10',
          key: 'stripe_secret_key',
          value: 'sk_test_51NMmZtKnW7fFIecb',
          group: 'payment',
          type: 'text',
          label: 'Clé secrète Stripe',
          description: 'Votre clé secrète Stripe (gardez-la confidentielle)'
        },
        {
          id: 'setting-11',
          key: 'paypal_enabled',
          value: 'true',
          group: 'payment',
          type: 'boolean',
          label: 'Activer PayPal'
        },
        {
          id: 'setting-12',
          key: 'paypal_client_id',
          value: 'ATJbRdxBa7_daCVf8ivJ8xBnFbU',
          group: 'payment',
          type: 'text',
          label: 'Client ID PayPal',
          description: 'Votre identifiant client PayPal pour l\'intégration'
        },
        
        // Paramètres d'expédition
        {
          id: 'setting-13',
          key: 'shipping_national_price',
          value: '5.90',
          group: 'shipping',
          type: 'number',
          label: 'Prix d\'expédition national (€)'
        },
        {
          id: 'setting-14',
          key: 'shipping_international_price',
          value: '15.90',
          group: 'shipping',
          type: 'number',
          label: 'Prix d\'expédition international (€)'
        },
        {
          id: 'setting-15',
          key: 'free_shipping_threshold',
          value: '50',
          group: 'shipping',
          type: 'number',
          label: 'Seuil pour la livraison gratuite (€)',
          description: 'Montant minimum d\'achat pour bénéficier de la livraison gratuite'
        },
        {
          id: 'setting-16',
          key: 'shipping_countries',
          value: 'FR,BE,LU,DE,CH,ES,IT,GB',
          group: 'shipping',
          type: 'textarea',
          label: 'Pays d\'expédition',
          description: 'Liste des codes pays séparés par des virgules'
        },
        
        // Paramètres d'email
        {
          id: 'setting-17',
          key: 'smtp_host',
          value: 'smtp.example.com',
          group: 'email',
          type: 'text',
          label: 'Hôte SMTP'
        },
        {
          id: 'setting-18',
          key: 'smtp_port',
          value: '587',
          group: 'email',
          type: 'number',
          label: 'Port SMTP'
        },
        {
          id: 'setting-19',
          key: 'smtp_user',
          value: 'contact@streeter.com',
          group: 'email',
          type: 'text',
          label: 'Utilisateur SMTP'
        },
        {
          id: 'setting-20',
          key: 'smtp_password',
          value: '************',
          group: 'email',
          type: 'text',
          label: 'Mot de passe SMTP'
        },
        {
          id: 'setting-21',
          key: 'email_sender_name',
          value: 'Streeter Shop',
          group: 'email',
          type: 'text',
          label: 'Nom de l\'expéditeur'
        },
        
        // Paramètres de sécurité
        {
          id: 'setting-22',
          key: 'login_attempts',
          value: '5',
          group: 'security',
          type: 'number',
          label: 'Nombre de tentatives de connexion',
          description: 'Nombre de tentatives avant verrouillage temporaire'
        },
        {
          id: 'setting-23',
          key: 'session_timeout',
          value: '30',
          group: 'security',
          type: 'number',
          label: 'Délai d\'expiration de session (minutes)'
        },
        {
          id: 'setting-24',
          key: 'enable_captcha',
          value: 'true',
          group: 'security',
          type: 'boolean',
          label: 'Activer CAPTCHA pour les formulaires'
        },
        {
          id: 'setting-25',
          key: 'captcha_site_key',
          value: '6LdXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
          group: 'security',
          type: 'text',
          label: 'Clé de site reCAPTCHA'
        },
        
        // Modes de paiement personnalisés
        {
          id: 'setting-payment-method-1',
          key: 'payment_methods',
          value: JSON.stringify([
            { id: 'card', name: 'Carte bancaire', enabled: true, icon: 'credit-card', fee: 0 },
            { id: 'paypal', name: 'PayPal', enabled: true, icon: 'paypal', fee: 0 },
            { id: 'bank_transfer', name: 'Virement bancaire', enabled: true, icon: 'bank', fee: 0 },
            { id: 'cash_on_delivery', name: 'Paiement à la livraison', enabled: false, icon: 'cash', fee: 5 }
          ]),
          group: 'payment_methods',
          type: 'json',
          label: 'Modes de paiement',
          description: 'Configurez les modes de paiement disponibles sur votre site'
        },
        {
          id: 'setting-payment-method-2',
          key: 'display_payment_icons',
          value: 'true',
          group: 'payment_methods',
          type: 'boolean',
          label: 'Afficher les icônes de paiement',
          description: 'Afficher les icônes des modes de paiement sur la page de paiement'
        },
        {
          id: 'setting-payment-method-3',
          key: 'default_payment_method',
          value: 'card',
          group: 'payment_methods',
          type: 'select',
          options: ['card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
          label: 'Mode de paiement par défaut',
          description: 'Le mode de paiement sélectionné par défaut lors du checkout'
        },
        
        // Catégories d'articles
        {
          id: 'setting-category-1',
          key: 'product_categories',
          value: JSON.stringify([
            { id: 'sneakers', name: 'Sneakers', slug: 'sneakers', description: 'Chaussures de sport et de streetwear', active: true },
            { id: 'clothing', name: 'Vêtements', slug: 'clothing', description: 'T-shirts, hoodies, pantalons et autres vêtements', active: true },
            { id: 'accessories', name: 'Accessoires', slug: 'accessories', description: 'Casquettes, sacs et autres accessoires', active: true },
            { id: 'limited', name: 'Éditions limitées', slug: 'limited', description: 'Articles en édition limitée', active: true }
          ]),
          group: 'categories',
          type: 'json',
          label: 'Catégories de produits',
          description: 'Gérez les catégories de produits affichées sur votre site'
        },
        {
          id: 'setting-category-2',
          key: 'show_category_descriptions',
          value: 'true',
          group: 'categories',
          type: 'boolean',
          label: 'Afficher les descriptions des catégories',
          description: 'Afficher les descriptions des catégories sur les pages de liste de produits'
        },
        {
          id: 'setting-category-3',
          key: 'category_display_type',
          value: 'grid',
          group: 'categories',
          type: 'select',
          options: ['grid', 'list', 'compact'],
          label: 'Type d\'affichage des catégories',
          description: 'Comment les catégories sont affichées sur la page d\'accueil'
        },
        {
          id: 'setting-category-4',
          key: 'featured_categories',
          value: JSON.stringify(['sneakers', 'limited']),
          group: 'categories',
          type: 'array',
          label: 'Catégories en vedette',
          description: 'Catégories à mettre en évidence sur la page d\'accueil'
        }
      ];
      
      setSettings(mockSettings);
      
      // Initialiser formData avec les valeurs actuelles
      const initialFormData: Record<string, string> = {};
      mockSettings.forEach(setting => {
        initialFormData[setting.key] = setting.value;
      });
      setFormData(initialFormData);
      
      setIsLoading(false);
    }, 600);
  };

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simuler une sauvegarde API
    setTimeout(() => {
      // Mettre à jour les settings avec les nouvelles valeurs
      const updatedSettings = settings.map(setting => ({
        ...setting,
        value: formData[setting.key] || setting.value
      }));
      
      setSettings(updatedSettings);
      setIsLoading(false);
      
      // Afficher message de succès
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 800);
  };

  // Filtrer les paramètres en fonction de l'onglet actif
  const filteredSettings = settings.filter(setting => setting.group === activeTab);

  if (isLoading && settings.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const renderSettingInput = (setting: Setting) => {
    switch (setting.type) {
      case 'text':
        return (
          <input
            type="text"
            id={setting.key}
            value={formData[setting.key] || ''}
            onChange={(e) => handleChange(setting.key, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        );
      case 'textarea':
        return (
          <textarea
            id={setting.key}
            value={formData[setting.key] || ''}
            onChange={(e) => handleChange(setting.key, e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            id={setting.key}
            value={formData[setting.key] || ''}
            onChange={(e) => handleChange(setting.key, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        );
      case 'boolean':
        return (
          <div className="mt-1">
            <select
              id={setting.key}
              value={formData[setting.key] || 'false'}
              onChange={(e) => handleChange(setting.key, e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="true">Activé</option>
              <option value="false">Désactivé</option>
            </select>
          </div>
        );
      case 'select':
        return (
          <select
            id={setting.key}
            value={formData[setting.key] || ''}
            onChange={(e) => handleChange(setting.key, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {setting.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'color':
        return (
          <div className="mt-1 flex items-center">
            <input
              type="color"
              id={setting.key}
              value={formData[setting.key] || '#000000'}
              onChange={(e) => handleChange(setting.key, e.target.value)}
              className="h-8 w-8 rounded-md border-gray-300 shadow-sm"
            />
            <input
              type="text"
              value={formData[setting.key] || ''}
              onChange={(e) => handleChange(setting.key, e.target.value)}
              className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        );
      case 'json':
        return (
          <textarea
            id={setting.key}
            value={formData[setting.key] || ''}
            onChange={(e) => handleChange(setting.key, e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        );
      case 'array':
        return (
          <textarea
            id={setting.key}
            value={formData[setting.key] || ''}
            onChange={(e) => handleChange(setting.key, e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        );
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: <Cog6ToothIcon className="w-5 h-5 mr-2" /> },
    { id: 'payment', label: 'Paiement', icon: <CreditCardIcon className="w-5 h-5 mr-2" /> },
    { id: 'shipping', label: 'Expédition', icon: <TruckIcon className="w-5 h-5 mr-2" /> },
    { id: 'email', label: 'Emails', icon: <EnvelopeIcon className="w-5 h-5 mr-2" /> },
    { id: 'security', label: 'Sécurité', icon: <ShieldCheckIcon className="w-5 h-5 mr-2" /> },
    { id: 'categories', label: 'Catégories', icon: <QrCodeIcon className="w-5 h-5 mr-2" /> },
    { id: 'payment_methods', label: 'Modes de paiement', icon: <BanknotesIcon className="w-5 h-5 mr-2" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Retour au tableau de bord
                </span>
              </Link>
              <button
                onClick={handleSaveSettings}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer les modifications'
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {saveSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-md p-4 flex items-center">
            <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
            <span>Les paramètres ont été enregistrés avec succès.</span>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Onglets de navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Setting['group'])}
                  className={`py-4 px-6 font-medium text-sm inline-flex items-center ${
                    activeTab === tab.id
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contenu des paramètres */}
          <div className="p-6">
            <div className="grid grid-cols-1 gap-y-6">
              {filteredSettings.map((setting) => (
                <div key={setting.id} className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                  <label htmlFor={setting.key} className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    {setting.label}
                    {setting.description && (
                      <p className="mt-1 text-xs text-gray-500">{setting.description}</p>
                    )}
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    {renderSettingInput(setting)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 