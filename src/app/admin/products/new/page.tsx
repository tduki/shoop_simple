'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeftIcon,
  PhotoIcon,
  CheckIcon,
  XMarkIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import { isAuthenticated } from '@/services/productService';

// Types pour les produits
type ProductCategory = 'clothing' | 'electronics' | 'books' | 'home' | 'beauty' | 'sports' | 'food' | 'toys' | 'other';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: ProductCategory;
  imageUrl: string;
  stock: number;
  sku: string;
  isActive: boolean;
  createdAt: string;
  attributes?: Record<string, string>;
}

export default function NewProduct() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([]);
  const [newAttributeKey, setNewAttributeKey] = useState('');
  const [newAttributeValue, setNewAttributeValue] = useState('');
  
  const [product, setProduct] = useState<Product>({
    id: '', // Généré lors de la sauvegarde
    name: '',
    description: '',
    price: 0,
    oldPrice: undefined,
    category: 'other',
    imageUrl: '',
    stock: 0,
    sku: '',
    isActive: true,
    createdAt: new Date().toISOString(),
    attributes: {}
  });

  useEffect(() => {
    const checkAuth = async () => {
      const authResult = await isAuthenticated();
      if (!authResult) {
        router.push('/auth/login?returnUrl=/admin/products/new');
        return;
      }
      
      // Pas besoin de récupérer un produit existant
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setProduct({
        ...product,
        [name]: parseFloat(value)
      });
    } else if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setProduct({
        ...product,
        [name]: target.checked
      });
    } else {
      setProduct({
        ...product,
        [name]: value
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('L\'image est trop volumineuse. Taille maximale: 5 Mo');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setErrorMessage('Format d\'image non pris en charge. Utiliser: JPG, PNG, WEBP ou GIF');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewImage(reader.result);
        // Dans une application réelle, vous téléchargeriez ce fichier sur un serveur
        // et mettriez à jour l'URL de l'image du produit
        setProduct({
          ...product,
          imageUrl: reader.result
        });
      }
    };
    reader.readAsDataURL(file);
    setErrorMessage('');
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setProduct({
      ...product,
      imageUrl: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    // Validation basique
    if (!product.name.trim()) {
      setErrorMessage('Le nom du produit est requis');
      setIsSaving(false);
      return;
    }
    
    if (product.price <= 0) {
      setErrorMessage('Le prix doit être supérieur à 0');
      setIsSaving(false);
      return;
    }
    
    if (product.stock < 0) {
      setErrorMessage('Le stock ne peut pas être négatif');
      setIsSaving(false);
      return;
    }
    
    if (!product.sku.trim()) {
      setErrorMessage('La référence (SKU) est requise');
      setIsSaving(false);
      return;
    }
    
    // Convertir les attributs de tableau à objet
    const attributesObject: Record<string, string> = {};
    attributes.forEach(attr => {
      attributesObject[attr.key] = attr.value;
    });
    
    const newProduct = {
      ...product,
      attributes: attributesObject
    };
    
    // Simuler une sauvegarde
    setTimeout(() => {
      // Dans une application réelle, vous feriez une requête API ici
      // Générer un ID pour le nouveau produit
      const newProductId = Math.random().toString(36).substr(2, 9); // ID aléatoire
      
      setSuccessMessage('Produit créé avec succès !');
      setIsSaving(false);
      
      // Redirection après un délai
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
    }, 1000);
  };

  const getCategoryLabel = (category: ProductCategory) => {
    const labels: Record<ProductCategory, string> = {
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
    
    return labels[category] || category;
  };

  const generateSKU = () => {
    const prefix = product.category.substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const sku = `${prefix}-${random}`;
    setProduct({ ...product, sku });
  };

  const addAttribute = () => {
    if (newAttributeKey.trim() === '' || newAttributeValue.trim() === '') {
      return;
    }
    
    setAttributes([...attributes, { key: newAttributeKey, value: newAttributeValue }]);
    setNewAttributeKey('');
    setNewAttributeValue('');
  };

  const removeAttribute = (index: number) => {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  };

  const updateAttribute = (index: number, field: 'key' | 'value', value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
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
            <div className="flex items-center">
              <Link href="/admin/products">
                <span className="mr-4 inline-flex items-center text-indigo-600 hover:text-indigo-800">
                  <ArrowLeftIcon className="h-5 w-5" />
                </span>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Ajouter un nouveau produit
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-md p-4 flex items-center">
            <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-center">
            <XMarkIcon className="h-5 w-5 text-red-500 mr-2" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                {/* Section Information produit */}
                <div className="sm:col-span-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Informations produit</h3>
                </div>

                {/* Image du produit */}
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">Image du produit</label>
                  <div className="mt-2 flex items-center">
                    {previewImage ? (
                      <div className="relative group">
                        <div className="w-48 h-48 rounded-md overflow-hidden bg-gray-100">
                          <Image 
                            src={previewImage} 
                            alt={product.name || "Aperçu"}
                            width={192}
                            height={192}
                            className="w-full h-full object-cover"
                            unoptimized={true}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-48 h-48 border-2 border-gray-300 border-dashed rounded-md flex items-center justify-center">
                        <PhotoIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="ml-5">
                      <label htmlFor="product-image" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                          <ArrowUpTrayIcon className="mr-2 h-5 w-5 text-gray-400" />
                          Télécharger une image
                        </span>
                        <input 
                          id="product-image" 
                          name="product-image" 
                          type="file" 
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="mt-2 text-xs text-gray-500">PNG, JPG, WEBP or GIF jusqu'à 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Nom du produit */}
                <div className="sm:col-span-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom du produit
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={product.name}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                {/* SKU */}
                <div className="sm:col-span-2">
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                    Référence (SKU)
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="sku"
                      name="sku"
                      value={product.sku}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={product.description}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Catégorie */}
                <div className="sm:col-span-3">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Catégorie
                  </label>
                  <div className="mt-1">
                    <select
                      id="category"
                      name="category"
                      value={product.category}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="clothing">Vêtements</option>
                      <option value="electronics">Électronique</option>
                      <option value="books">Livres</option>
                      <option value="home">Maison</option>
                      <option value="beauty">Beauté</option>
                      <option value="sports">Sports</option>
                      <option value="food">Alimentation</option>
                      <option value="toys">Jouets</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                </div>

                {/* Statut */}
                <div className="sm:col-span-3">
                  <label htmlFor="isActive" className="block text-sm font-medium text-gray-700">
                    Statut
                  </label>
                  <div className="mt-1">
                    <select
                      id="isActive"
                      name="isActive"
                      value={product.isActive ? 'true' : 'false'}
                      onChange={(e) => {
                        setProduct({
                          ...product,
                          isActive: e.target.value === 'true'
                        });
                      }}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="true">Actif</option>
                      <option value="false">Inactif</option>
                    </select>
                  </div>
                </div>

                {/* Prix */}
                <div className="sm:col-span-2">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Prix (€)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="price"
                      name="price"
                      step="0.01"
                      min="0"
                      value={product.price}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                {/* Prix barré */}
                <div className="sm:col-span-2">
                  <label htmlFor="oldPrice" className="block text-sm font-medium text-gray-700">
                    Prix barré (€)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="oldPrice"
                      name="oldPrice"
                      step="0.01"
                      min="0"
                      value={product.oldPrice || ''}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Laisser vide s'il n'y a pas de prix barré</p>
                </div>

                {/* Stock */}
                <div className="sm:col-span-2">
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      min="0"
                      value={product.stock}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <Link href="/admin/products">
                <span className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-3">
                  Annuler
                </span>
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Création...
                  </>
                ) : (
                  'Créer le produit'
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
} 