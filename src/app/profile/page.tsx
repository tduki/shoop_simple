'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Tab } from '@headlessui/react';
import { UserIcon, CreditCardIcon, TruckIcon, ShieldCheckIcon, CogIcon } from '@heroicons/react/24/outline';
import PersonalInfoForm from '@/components/profile/PersonalInfoForm';
import PaymentMethodsForm from '@/components/profile/PaymentMethodsForm';
import AddressForm from '@/components/profile/AddressForm';
import SecurityForm from '@/components/profile/SecurityForm';
import PreferencesForm from '@/components/profile/PreferencesForm';
import { isAuthenticated } from '@/services/productService';
import toast from 'react-hot-toast';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ProfilePage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Vérifier l'authentification
    if (!isAuthenticated()) {
      toast.error('Veuillez vous connecter pour accéder à votre profil');
      router.push('/auth/login');
      return;
    }
    
    setIsLoading(false);
    
    // Récupérer l'onglet sélectionné à partir de l'URL si présent
    const hash = window.location.hash;
    if (hash) {
      const tabIndex = {
        '#info': 0,
        '#payment': 1,
        '#addresses': 2,
        '#security': 3,
        '#preferences': 4
      }[hash];
      
      if (tabIndex !== undefined) {
        setSelectedIndex(tabIndex);
      }
    }
  }, [router]);
  
  const handleTabChange = (index: number) => {
    setSelectedIndex(index);
    
    // Mettre à jour l'URL avec le hash correspondant
    const hashes = ['#info', '#payment', '#addresses', '#security', '#preferences'];
    window.history.pushState(null, '', hashes[index]);
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
    <div className="bg-gray-50 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
          <p className="mt-2 text-gray-600">Gérez vos informations personnelles et préférences</p>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Tab.Group selectedIndex={selectedIndex} onChange={handleTabChange}>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-64 bg-gray-50 p-4 border-r border-gray-200">
                <div className="flex items-center space-x-4 p-4 mb-6">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <UserIcon className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">John Doe</p>
                    <p className="text-sm text-gray-500">john.doe@example.com</p>
                  </div>
                </div>
                
                <Tab.List className="flex flex-col space-y-1">
                  <Tab className={({ selected }) => 
                    classNames(
                      'flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md',
                      'focus:outline-none transition-colors duration-200',
                      selected
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )
                  }>
                    <UserIcon className="h-5 w-5" />
                    <span>Informations personnelles</span>
                  </Tab>
                  <Tab className={({ selected }) => 
                    classNames(
                      'flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md',
                      'focus:outline-none transition-colors duration-200',
                      selected
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )
                  }>
                    <CreditCardIcon className="h-5 w-5" />
                    <span>Moyens de paiement</span>
                  </Tab>
                  <Tab className={({ selected }) => 
                    classNames(
                      'flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md',
                      'focus:outline-none transition-colors duration-200',
                      selected
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )
                  }>
                    <TruckIcon className="h-5 w-5" />
                    <span>Adresses de livraison</span>
                  </Tab>
                  <Tab className={({ selected }) => 
                    classNames(
                      'flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md',
                      'focus:outline-none transition-colors duration-200',
                      selected
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )
                  }>
                    <ShieldCheckIcon className="h-5 w-5" />
                    <span>Sécurité</span>
                  </Tab>
                  <Tab className={({ selected }) => 
                    classNames(
                      'flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md',
                      'focus:outline-none transition-colors duration-200',
                      selected
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )
                  }>
                    <CogIcon className="h-5 w-5" />
                    <span>Préférences</span>
                  </Tab>
                </Tab.List>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link 
                    href="/dashboard" 
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                  >
                    <span>Mes commandes</span>
                  </Link>
                  <Link 
                    href="/favorites" 
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                  >
                    <span>Mes favoris</span>
                  </Link>
                  <button 
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md mt-2"
                    onClick={() => {
                      // Déconnexion (à implémenter)
                      toast.success('Vous avez été déconnecté');
                      router.push('/');
                    }}
                  >
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 p-6">
                <Tab.Panels>
                  <Tab.Panel>
                    <PersonalInfoForm />
                  </Tab.Panel>
                  <Tab.Panel>
                    <PaymentMethodsForm />
                  </Tab.Panel>
                  <Tab.Panel>
                    <AddressForm />
                  </Tab.Panel>
                  <Tab.Panel>
                    <SecurityForm />
                  </Tab.Panel>
                  <Tab.Panel>
                    <PreferencesForm />
                  </Tab.Panel>
                </Tab.Panels>
              </div>
            </div>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
} 