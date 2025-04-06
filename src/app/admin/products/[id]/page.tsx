'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

type ProductCategory = 'clothing' | 'electronics' | 'books' | 'home' | 'beauty' | 'sports' | 'food' | 'toys' | 'other';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl: string;
  gallery?: string[];
  stock: number;
  sku: string;
  isActive: boolean;
  attributes?: Record<string, string>;
  createdAt: string;
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Vérifie l'authentification et récupère les informations du produit
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated();
      if (!isAuth) {
        router.push('/login');
        return;
      }
      
      // Récupérer le produit
      fetchProduct(params.id);
    };
    
    checkAuth();
  }, [params.id, router]);
  
  // Fonction fictive de vérification d'authentification
  const isAuthenticated = async () => {
    // Simuler une vérification d'authentification
    return true;
  };
  
  // Fonction fictive pour récupérer le produit
  const fetchProduct = async (id: string) => {
    setIsLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Produit fictif pour démonstration
      const productData: Product = {
        id,
        name: 'Exemple de produit',
        description: 'Description détaillée du produit avec toutes ses caractéristiques. Ce produit est fait avec des matériaux de qualité supérieure et convient parfaitement à une utilisation quotidienne. Il est disponible en plusieurs coloris et tailles pour s\'adapter à tous les besoins.',
        price: 99.99,
        category: 'clothing',
        imageUrl: '/images/products/product-1.jpg',
        gallery: [
          '/images/products/product-1.jpg',
          '/images/products/product-2.jpg',
          '/images/products/product-3.jpg',
        ],
        stock: 25,
        sku: 'PROD-' + id,
        isActive: true,
        attributes: {
          'Couleur': 'Noir',
          'Taille': 'M',
          'Matériau': 'Coton'
        },
        createdAt: new Date().toISOString()
      };
      
      setProduct(productData);
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      setErrorMsg('Impossible de charger le produit. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Obtenir le nom de la catégorie en français
  const getCategoryName = (category: ProductCategory): string => {
    const categories: Record<ProductCategory, string> = {
      clothing: 'Vêtements',
      electronics: 'Électronique',
      books: 'Livres',
      home: 'Maison',
      beauty: 'Beauté',
      sports: 'Sports',
      food: 'Alimentation',
      toys: 'Jouets',
      other: 'Autre'
    };
    
    return categories[category] || 'Autre';
  };
  
  // Affichage du chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-indigo-600" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2 text-gray-700">Chargement du produit...</p>
        </div>
      </div>
    );
  }
  
  // Affichage si le produit n'est pas trouvé
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Produit non trouvé</h1>
            <p className="mb-4">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
            <Link href="/admin/products" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              Retour à la liste des produits
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Affichage des détails du produit
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Détails du produit
          </h1>
          <div className="flex space-x-3">
            <Link href={`/admin/products/edit/${product.id}`} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              Modifier
            </Link>
            <Link href="/admin/products" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Retour à la liste
            </Link>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{errorMsg}</span>
          </div>
        )}
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 flex justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">{product.name}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">SKU: {product.sku}</p>
            </div>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              product.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.isActive ? 'Actif' : 'Inactif'}
            </span>
          </div>
          
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Image principale</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="relative w-40 h-40 border rounded-md overflow-hidden">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill 
                      sizes="100%"
                      style={{ objectFit: 'cover' }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </dd>
              </div>
              
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Prix</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{product.price.toFixed(2)} €</dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Catégorie</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{getCategoryName(product.category)}</dd>
              </div>
              
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Stock</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.stock > 10 
                      ? 'bg-green-100 text-green-800' 
                      : product.stock > 0 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock} unité(s)
                  </span>
                </dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Date de création</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(product.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </dd>
              </div>
              
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{product.description}</dd>
              </div>
              
              {product.attributes && Object.keys(product.attributes).length > 0 && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Attributs</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                      {Object.entries(product.attributes).map(([key, value], index) => (
                        <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                          <div className="w-0 flex-1 flex items-center">
                            <span className="ml-2 flex-1 w-0 truncate font-medium">{key}</span>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <span className="text-gray-500">{value}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
              
              {product.gallery && product.gallery.length > 0 && (
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Galerie d'images</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {product.gallery.map((image, index) => (
                        <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden">
                          <Image 
                            src={image} 
                            alt={`Image ${index + 1}`} 
                            fill
                            sizes="100%"
                            style={{ objectFit: 'cover' }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Link 
            href="/admin/products" 
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Retour à la liste
          </Link>
          
          <div className="flex space-x-3">
            <Link 
              href={`/admin/products/edit/${product.id}`} 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Modifier ce produit
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 