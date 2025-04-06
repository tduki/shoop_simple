'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Tab } from '@headlessui/react';
import { UserIcon, ClockIcon, HeartIcon, ShoppingBagIcon, ArrowRightOnRectangleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getRecentlyViewedProducts, clearRecentlyViewed, getFavoriteProducts } from '@/services/productService';
import ProductCard from '@/components/ProductCard';
import { toast, Toaster } from 'react-hot-toast';

// Définir les interfaces pour les données
interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: number;
}

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function AccountPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const checkAuth = () => {
      const isUserLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(isUserLoggedIn);
      
      if (!isUserLoggedIn) {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        router.push('/auth/login');
        return false;
      }
      return true;
    };
    
    if (checkAuth()) {
      // Simuler le chargement des données utilisateur
      setIsLoading(true);
      
      // Récupérer les données utilisateur (simulé)
      setTimeout(() => {
        setUser({
          id: '123',
          name: 'Jean Dupont',
          email: 'jean.dupont@example.com',
          phone: '+33 6 12 34 56 78',
          avatar: 'https://i.pravatar.cc/150?img=3'
        });
        
        // Simuler la récupération des commandes
        setOrders([
          { id: 'ORD-2023-001', date: '2023-08-15', status: 'Livré', total: 159.90, items: 3 },
          { id: 'ORD-2023-002', date: '2023-09-02', status: 'En cours', total: 89.95, items: 2 },
          { id: 'ORD-2023-003', date: '2023-09-20', status: 'En préparation', total: 129.90, items: 1 }
        ]);
        
        // Simuler la récupération des adresses
        setAddresses([
          {
            id: 'adr-001',
            name: 'Domicile',
            street: '123 Rue de Paris',
            city: 'Paris',
            postalCode: '75001',
            country: 'France',
            isDefault: true
          },
          {
            id: 'adr-002',
            name: 'Travail',
            street: '45 Avenue des Champs-Élysées',
            city: 'Paris',
            postalCode: '75008',
            country: 'France',
            isDefault: false
          }
        ]);
        
        // Récupérer les produits récemment consultés
        const recentProducts = getRecentlyViewedProducts();
        setRecentlyViewed(recentProducts);
        
        // Récupérer les produits favoris
        const favoriteProducts = getFavoriteProducts();
        setFavorites(favoriteProducts);
        
        setIsLoading(false);
      }, 1000);
    }
  }, [router]);
  
  const handleLogout = () => {
    // Simuler la déconnexion
    localStorage.removeItem('isLoggedIn');
    toast.success('Vous avez été déconnecté avec succès');
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };
  
  const handleClearRecentlyViewed = () => {
    clearRecentlyViewed();
    setRecentlyViewed([]);
    toast.success('Historique de navigation effacé');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de la page compte */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-indigo-100">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-indigo-500" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500">{user.email} | {user.phone}</p>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
              Déconnexion
            </button>
          </div>
        </div>
        
        {/* Onglets du compte */}
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-white p-1 shadow-sm mb-6">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-3 text-sm font-medium leading-5 
                ${selected 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`
              }
            >
              <div className="flex items-center justify-center">
                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                Commandes
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-3 text-sm font-medium leading-5 
                ${selected 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`
              }
            >
              <div className="flex items-center justify-center">
                <UserIcon className="h-5 w-5 mr-2" />
                Adresses
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-3 text-sm font-medium leading-5 
                ${selected 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`
              }
            >
              <div className="flex items-center justify-center">
                <HeartIcon className="h-5 w-5 mr-2" />
                Favoris
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-3 text-sm font-medium leading-5 
                ${selected 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`
              }
            >
              <div className="flex items-center justify-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                Historique
              </div>
            </Tab>
          </Tab.List>
          
          <Tab.Panels>
            {/* Panel des commandes */}
            <Tab.Panel className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Mes commandes</h2>
              
              {orders.length === 0 ? (
                <div className="text-center py-10">
                  <ShoppingBagIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Vous n'avez pas encore passé de commande.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                              ${order.status === 'Livré' ? 'bg-green-100 text-green-800' : 
                                order.status === 'En cours' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-yellow-100 text-yellow-800'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total.toFixed(2)} €</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Link href={`/account/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900">
                              Détails
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Tab.Panel>
            
            {/* Panel des adresses */}
            <Tab.Panel className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Mes adresses</h2>
                <button className="px-3 py-1 bg-indigo-500 text-white rounded-md text-sm hover:bg-indigo-600">
                  Ajouter une adresse
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <div key={address.id} className={`border rounded-lg p-4 ${address.isDefault ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{address.name}</h3>
                        {address.isDefault && (
                          <span className="text-xs text-indigo-600 font-medium">Adresse par défaut</span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button className="text-gray-400 hover:text-red-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>{address.street}</p>
                      <p>{address.postalCode} {address.city}</p>
                      <p>{address.country}</p>
                    </div>
                    {!address.isDefault && (
                      <button className="mt-3 text-xs text-indigo-600 hover:text-indigo-800">
                        Définir comme adresse par défaut
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Tab.Panel>
            
            {/* Panel des favoris */}
            <Tab.Panel className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Mes produits favoris</h2>
              
              {favorites.length === 0 ? (
                <div className="text-center py-10">
                  <HeartIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Vous n'avez pas encore ajouté de produits à vos favoris.</p>
                  <Link href="/products" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
                    Explorer nos produits
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {favorites.map((product) => (
                    <ProductCard key={product.id} product={product} showRemoveFavorite />
                  ))}
                </div>
              )}
            </Tab.Panel>
            
            {/* Panel de l'historique */}
            <Tab.Panel className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Produits récemment consultés</h2>
                {recentlyViewed.length > 0 && (
                  <button 
                    onClick={handleClearRecentlyViewed}
                    className="flex items-center text-sm text-gray-500 hover:text-red-500"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Effacer l'historique
                  </button>
                )}
              </div>
              
              {recentlyViewed.length === 0 ? (
                <div className="text-center py-10">
                  <ClockIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Vous n'avez pas encore consulté de produits.</p>
                  <Link href="/products" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
                    Explorer nos produits
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {recentlyViewed.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
} 