'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getCompareList, addToCart } from '@/services/productService';
import { Product } from '@/data/products';
import { StarIcon, XMarkIcon, ShoppingCartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ComparePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const loadCompareProducts = () => {
      try {
        const compareList = getCompareList();
        setProducts(compareList);
      } catch (error) {
        console.error('Erreur lors du chargement des produits à comparer:', error);
        toast.error('Impossible de charger les produits à comparer');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCompareProducts();
  }, []);
  
  const handleAddToCart = (productId: string) => {
    const result = addToCart(productId);
    if (result) {
      toast.success('Produit ajouté au panier');
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h1 className="text-3xl font-bold mb-6">Comparaison de produits</h1>
          <p className="text-gray-600 mb-8">Vous n'avez pas de produits à comparer.</p>
          <Link 
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Parcourir les produits
          </Link>
        </div>
      </div>
    );
  }
  
  if (products.length === 1) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h1 className="text-3xl font-bold mb-6">Comparaison de produits</h1>
          <p className="text-gray-600 mb-8">Ajoutez au moins un autre produit pour effectuer une comparaison.</p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Ajouter des produits
            </Link>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Les caractéristiques à comparer
  const comparisonFeatures = [
    { name: 'Catégorie', key: 'category' },
    { name: 'Prix', key: 'price', format: (value: number) => `${value.toFixed(2)}€` },
    { name: 'Note', key: 'rating' },
    { name: 'Avis', key: 'reviews' },
    { name: 'En stock', key: 'inStock', format: (value: boolean) => value ? 'Oui' : 'Non' },
  ];
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <button
          onClick={() => router.back()}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold">Comparaison de produits</h1>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          {/* En-tête avec images et noms des produits */}
          <thead>
            <tr>
              <th className="w-40 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Caractéristiques
              </th>
              
              {products.map((product) => (
                <th 
                  key={product.id}
                  className="px-6 py-4 text-center bg-white"
                >
                  <div className="flex flex-col items-center">
                    <div className="relative h-40 w-40 mb-4">
                      <Image 
                        src={product.images[0]} 
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h3>
                    <div className="flex items-center justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-500">({product.reviews})</span>
                    </div>
                    <div className="font-bold text-xl text-indigo-600 mb-2">
                      {product.price.toFixed(2)}€
                      {product.originalPrice && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          {product.originalPrice.toFixed(2)}€
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <ShoppingCartIcon className="h-4 w-4 mr-1" />
                        Ajouter
                      </button>
                      <Link
                        href={`/products/${product.id}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Détails
                      </Link>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Corps avec les caractéristiques */}
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Rangée pour la description */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                Description
              </td>
              
              {products.map((product) => (
                <td key={product.id} className="px-6 py-4 text-sm text-gray-500">
                  <p className="line-clamp-3">{product.description}</p>
                </td>
              ))}
            </tr>
            
            {/* Rangées pour les autres caractéristiques */}
            {comparisonFeatures.map((feature) => (
              <tr key={feature.key}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                  {feature.name}
                </td>
                
                {products.map((product) => {
                  // @ts-ignore - accès dynamique aux propriétés
                  const value = product[feature.key];
                  return (
                    <td key={`${product.id}-${feature.key}`} className="px-6 py-4 text-sm text-gray-500 text-center">
                      {feature.format ? feature.format(value) : value}
                    </td>
                  );
                })}
              </tr>
            ))}
            
            {/* Rangée pour les tailles */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                Tailles disponibles
              </td>
              
              {products.map((product) => (
                <td key={`${product.id}-sizes`} className="px-6 py-4 text-sm text-gray-500">
                  {product.sizes ? (
                    <div className="flex flex-wrap justify-center gap-2">
                      {product.sizes.map((size) => (
                        <span 
                          key={size} 
                          className="px-2 py-1 bg-gray-100 rounded-md text-xs"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  ) : 'Non applicable'}
                </td>
              ))}
            </tr>
            
            {/* Rangée pour les couleurs */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                Couleurs disponibles
              </td>
              
              {products.map((product) => (
                <td key={`${product.id}-colors`} className="px-6 py-4 text-sm text-gray-500">
                  {product.colors ? (
                    <div className="flex flex-wrap justify-center gap-2">
                      {product.colors.map((color) => (
                        <span 
                          key={color} 
                          className="px-2 py-1 bg-gray-100 rounded-md text-xs"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  ) : 'Non applicable'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 