'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { 
  ChartBarIcon, 
  ShoppingBagIcon, 
  UserGroupIcon, 
  HeartIcon, 
  CurrencyEuroIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { products, Product } from '@/data/products';

// Simuler un état de connexion (à remplacer par un vrai système d'authentification)
const useAuth = () => {
  // Pour notre démo, nous utilisons localStorage pour simuler l'état de connexion
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement de la page
    if (typeof window !== 'undefined') {
      const authStatus = localStorage.getItem('isLoggedIn');
      const adminStatus = localStorage.getItem('isAdmin');
      setIsLoggedIn(authStatus === 'true');
      setIsAdmin(adminStatus === 'true');
      setIsLoading(false);
    }
  }, []);
  
  return { isLoggedIn, isAdmin, isLoading };
};

export default function Dashboard() {
  const router = useRouter();
  const { isLoggedIn, isAdmin, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('statistiques');
  const [productList, setProductList] = useState<Product[]>(products);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Statistiques simulées
  const stats = {
    ventesTotales: 45789,
    ventesAujourdhui: 1245,
    clientsActifs: 3520,
    produitsFavoris: 856,
    tauxConversion: 3.2,
    ventesParCategorie: {
      sneakers: 65,
      tshirts: 20,
      pants: 10,
      sweaters: 5
    }
  };

  // Si l'utilisateur n'est pas connecté ou n'est pas administrateur, rediriger vers la page de connexion
  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        toast.error('Veuillez vous connecter pour accéder au tableau de bord');
        router.push('/auth/login');
      } else if (!isAdmin) {
        // Rediriger vers la page d'accueil si l'utilisateur est connecté mais n'est pas administrateur
        toast.error('Vous n\'avez pas les droits pour accéder au tableau de bord');
        router.push('/');
      }
    }
  }, [isLoggedIn, isAdmin, isLoading, router]);

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    toast.success('Édition du produit ' + product.name);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProductList(productList.filter(p => p.id !== productId));
      toast.success('Produit supprimé avec succès');
    }
  };

  // Rendu d'un message de chargement pendant la vérification de l'authentification
  if (isLoading || !isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white shadow-md rounded-lg text-center">
          <h1 className="text-2xl font-semibold mb-4">Chargement du tableau de bord</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="mt-2 text-sm text-gray-600">
            Bienvenue sur le tableau de bord de Streeter. Gérez vos produits et consultez vos statistiques.
          </p>
        </div>
      </div>
      
      {/* Onglets */}
      <div className="border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('statistiques')}
              className={`${
                activeTab === 'statistiques'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Statistiques
            </button>
            <button
              onClick={() => setActiveTab('produits')}
              className={`${
                activeTab === 'produits'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Gestion des produits
            </button>
          </nav>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contenu des statistiques */}
        {activeTab === 'statistiques' && (
          <div>
            {/* Cartes de statistiques */}
            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
              <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
                <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full">
                  <CurrencyEuroIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">Ventes totales</p>
                  <p className="text-lg font-semibold text-gray-700">{stats.ventesTotales} €</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
                <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full">
                  <ShoppingBagIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">Ventes aujourd'hui</p>
                  <p className="text-lg font-semibold text-gray-700">{stats.ventesAujourdhui} €</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
                <div className="p-3 mr-4 text-purple-500 bg-purple-100 rounded-full">
                  <UserGroupIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">Clients actifs</p>
                  <p className="text-lg font-semibold text-gray-700">{stats.clientsActifs}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
                <div className="p-3 mr-4 text-red-500 bg-red-100 rounded-full">
                  <HeartIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">Produits favoris</p>
                  <p className="text-lg font-semibold text-gray-700">{stats.produitsFavoris}</p>
                </div>
              </div>
            </div>
            
            {/* Graphique */}
            <div className="p-6 bg-white rounded-lg shadow-md mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Ventes par catégorie</h2>
              <div className="relative h-60">
                {/* Graphique à barres simple */}
                <div className="flex h-full items-end justify-around">
                  {Object.entries(stats.ventesParCategorie).map(([category, percentage]) => (
                    <div key={category} className="flex flex-col items-center space-y-2">
                      <div 
                        className="w-16 bg-indigo-500 rounded-t"
                        style={{ height: `${percentage}%` }}
                      ></div>
                      <span className="text-sm font-medium text-gray-600 capitalize">
                        {category}
                      </span>
                      <span className="text-xs text-gray-500">{percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Dernières ventes (simulées) */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Dernières ventes</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produit
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { id: 1, product: 'Nike Air Max 90', customer: 'Jean Dupont', date: '15/07/2023', amount: '150 €', status: 'Livré' },
                      { id: 2, product: 'Supreme Box Logo T-Shirt', customer: 'Marie Laurent', date: '14/07/2023', amount: '120 €', status: 'En cours' },
                      { id: 3, product: 'Adidas Ultraboost 22', customer: 'Thomas Martin', date: '13/07/2023', amount: '180 €', status: 'Livré' },
                      { id: 4, product: 'Bape Shark Hoodie', customer: 'Sophie Lefèvre', date: '12/07/2023', amount: '350 €', status: 'En cours' },
                      { id: 5, product: 'Off-White Industrial Belt', customer: 'Lucas Moreau', date: '11/07/2023', amount: '220 €', status: 'Livré' },
                    ].map((sale) => (
                      <tr key={sale.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {sale.product}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sale.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sale.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sale.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            sale.status === 'Livré' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {sale.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* Gestion des produits */}
        {activeTab === 'produits' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700">Liste des produits</h2>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setSelectedProduct(null); // Nouveau produit
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Ajouter un produit
              </button>
            </div>
            
            {/* Liste des produits */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {productList.map((product) => (
                  <li key={product.id}>
                    <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-16 h-16 relative flex-shrink-0 mr-4">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                          <div className="mt-1 flex items-center">
                            <p className="text-sm text-gray-500 mr-2">
                              Catégorie: {product.category}
                            </p>
                            <p className="text-sm text-gray-500 mr-2">
                              Prix: {product.price} €
                            </p>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {product.inStock ? 'En stock' : 'Rupture de stock'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Formulaire d'édition (modal) */}
            {isEditing && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {selectedProduct ? 'Modifier le produit' : 'Ajouter un produit'}
                    </h3>
                    <div className="mt-4">
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Nom
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            defaultValue={selectedProduct?.name || ''}
                          />
                        </div>
                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Prix
                          </label>
                          <input
                            type="number"
                            name="price"
                            id="price"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            defaultValue={selectedProduct?.price || ''}
                          />
                        </div>
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Catégorie
                          </label>
                          <select
                            id="category"
                            name="category"
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            defaultValue={selectedProduct?.category || 'sneakers'}
                          >
                            <option value="sneakers">Sneakers</option>
                            <option value="tshirts">T-shirts</option>
                            <option value="pants">Pantalons</option>
                            <option value="sweaters">Pulls</option>
                            <option value="accessories">Accessoires</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            defaultValue={selectedProduct?.description || ''}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            En stock
                          </label>
                          <div className="mt-1">
                            <input
                              id="inStock"
                              name="inStock"
                              type="checkbox"
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                              defaultChecked={selectedProduct?.inStock || true}
                            />
                            <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
                              Produit disponible en stock
                            </label>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setIsEditing(false)}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 