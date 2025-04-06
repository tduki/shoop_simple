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
  sizeStocks?: SizeStock[];
}

interface SizeStock {
  size: string;
  quantity: number;
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([]);
  const [newAttributeKey, setNewAttributeKey] = useState('');
  const [newAttributeValue, setNewAttributeValue] = useState('');
  const [sizeStocks, setSizeStocks] = useState<SizeStock[]>([]);
  const [newSize, setNewSize] = useState('');
  const [newQuantity, setNewQuantity] = useState(0);

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
        description: 'Description détaillée du produit avec toutes ses caractéristiques.',
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
        sizeStocks: [
          { size: 'S', quantity: 5 },
          { size: 'M', quantity: 10 },
          { size: 'L', quantity: 8 },
          { size: 'XL', quantity: 2 }
        ],
        createdAt: new Date().toISOString()
      };
      
      setProduct(productData);
      
      // Convertir les attributs du produit en tableau pour l'édition
      if (productData.attributes) {
        const attributesArray = Object.entries(productData.attributes).map(([key, value]) => ({
          key,
          value
        }));
        setAttributes(attributesArray);
      }
      
      // Définir les stocks par taille
      if (productData.sizeStocks) {
        setSizeStocks(productData.sizeStocks);
      }
      
      // Définir l'image sélectionnée
      if (productData.imageUrl) {
        setSelectedImage(productData.imageUrl);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      setErrorMsg('Impossible de charger le produit. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Gestion des changements dans le formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (product) {
      if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setProduct({ ...product, [name]: checked });
      } else if (name === 'price' || name === 'stock') {
        setProduct({ ...product, [name]: parseFloat(value) || 0 });
      } else {
        setProduct({ ...product, [name]: value });
      }
    }
  };
  
  // Ajouter un nouvel attribut
  const addAttribute = () => {
    if (newAttributeKey.trim() === '' || newAttributeValue.trim() === '') {
      return;
    }
    
    setAttributes([...attributes, { key: newAttributeKey, value: newAttributeValue }]);
    setNewAttributeKey('');
    setNewAttributeValue('');
  };
  
  // Supprimer un attribut
  const removeAttribute = (index: number) => {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  };
  
  // Modifier un attribut existant
  const updateAttribute = (index: number, field: 'key' | 'value', value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };
  
  // Sélectionner une image de la galerie comme image principale
  const selectImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    if (product) {
      setProduct({ ...product, imageUrl });
    }
  };
  
  // Ajouter un nouveau stock par taille
  const addSizeStock = () => {
    if (newSize.trim() === '' || newQuantity < 0) {
      return;
    }
    
    // Vérifier si la taille existe déjà
    const existingIndex = sizeStocks.findIndex(stock => stock.size === newSize);
    
    if (existingIndex !== -1) {
      // Mettre à jour la quantité si la taille existe déjà
      const updatedStocks = [...sizeStocks];
      updatedStocks[existingIndex].quantity = newQuantity;
      setSizeStocks(updatedStocks);
    } else {
      // Ajouter une nouvelle entrée
      setSizeStocks([...sizeStocks, { size: newSize, quantity: newQuantity }]);
    }
    
    setNewSize('');
    setNewQuantity(0);
  };
  
  // Supprimer un stock par taille
  const removeSizeStock = (index: number) => {
    const newSizeStocks = [...sizeStocks];
    newSizeStocks.splice(index, 1);
    setSizeStocks(newSizeStocks);
  };
  
  // Modifier un stock par taille
  const updateSizeStock = (index: number, field: 'size' | 'quantity', value: any) => {
    const newSizeStocks = [...sizeStocks];
    if (field === 'quantity') {
      newSizeStocks[index][field] = parseInt(value) || 0;
    } else {
      newSizeStocks[index][field] = value;
    }
    setSizeStocks(newSizeStocks);
  };
  
  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;
    
    // Convertir les attributs de tableau à objet
    const attributesObject: Record<string, string> = {};
    attributes.forEach(attr => {
      attributesObject[attr.key] = attr.value;
    });
    
    const updatedProduct = {
      ...product,
      attributes: attributesObject,
      sizeStocks: sizeStocks
    };
    
    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Produit mis à jour:', updatedProduct);
      setSuccessMsg('Produit mis à jour avec succès!');
      
      // Rediriger après 2 secondes
      setTimeout(() => {
        router.push('/admin/products');
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      setErrorMsg('Erreur lors de la mise à jour du produit. Veuillez réessayer.');
    } finally {
      setIsSaving(false);
    }
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
  
  // Affichage du formulaire
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Édition du produit
          </h1>
          <div className="flex space-x-3">
            <Link href="/admin/products" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Annuler
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
        
        {successMsg && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{successMsg}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Informations du produit</h2>
              <p className="mt-1 text-sm text-gray-500">
                Informations générales sur le produit.
              </p>
            </div>
            
            <div className="p-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom du produit
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={product.name}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    value={product.description}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Prix
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">€</span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    required
                    min="0"
                    step="0.01"
                    value={product.price}
                    onChange={handleInputChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
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
              
              <div className="sm:col-span-3">
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                  SKU
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="sku"
                    id="sku"
                    value={product.sku}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="stock"
                    id="stock"
                    min="0"
                    value={product.stock}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <div className="flex items-center">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={product.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Produit actif (visible sur le site)
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Images du produit</h2>
              <p className="mt-1 text-sm text-gray-500">
                Gérez les images du produit. Cliquez sur une image pour la définir comme image principale.
              </p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Image principale</p>
                {selectedImage && (
                  <div className="relative w-40 h-40 border rounded-md overflow-hidden">
                    <Image 
                      src={selectedImage} 
                      alt="Image principale" 
                      fill 
                      sizes="100%"
                      style={{ objectFit: 'cover' }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Galerie d'images</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {product.gallery && product.gallery.map((image, index) => (
                    <div 
                      key={index} 
                      className={`relative w-24 h-24 border rounded-md overflow-hidden cursor-pointer ${
                        selectedImage === image ? 'ring-2 ring-indigo-500' : ''
                      }`}
                      onClick={() => selectImage(image)}
                    >
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
                  
                  <div className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="sr-only">Ajouter une image</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Attributs du produit</h2>
              <p className="mt-1 text-sm text-gray-500">
                Ajoutez des attributs personnalisés comme la couleur, la taille, etc.
              </p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="grid grid-cols-12 gap-3 mb-3">
                  <div className="col-span-5">
                    <label className="block text-sm font-medium text-gray-700">Attribut</label>
                  </div>
                  <div className="col-span-5">
                    <label className="block text-sm font-medium text-gray-700">Valeur</label>
                  </div>
                </div>
                
                {attributes.map((attr, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 mb-3">
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={attr.key}
                        onChange={(e) => updateAttribute(index, 'key', e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={attr.value}
                        onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-2 flex items-center">
                      <button
                        type="button"
                        onClick={() => removeAttribute(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="grid grid-cols-12 gap-3 mt-4">
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={newAttributeKey}
                      onChange={(e) => setNewAttributeKey(e.target.value)}
                      placeholder="Nouvel attribut"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={newAttributeValue}
                      onChange={(e) => setNewAttributeValue(e.target.value)}
                      placeholder="Valeur"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={addAttribute}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Gestion des tailles et des stocks</h2>
              <p className="mt-1 text-sm text-gray-500">
                Configurez les quantités disponibles pour chaque taille du produit.
              </p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="grid grid-cols-12 gap-3 mb-3">
                  <div className="col-span-5">
                    <label className="block text-sm font-medium text-gray-700">Taille</label>
                  </div>
                  <div className="col-span-5">
                    <label className="block text-sm font-medium text-gray-700">Quantité en stock</label>
                  </div>
                </div>
                
                {sizeStocks.map((stock, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 mb-3">
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={stock.size}
                        onChange={(e) => updateSizeStock(index, 'size', e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-5">
                      <input
                        type="number"
                        min="0"
                        value={stock.quantity}
                        onChange={(e) => updateSizeStock(index, 'quantity', e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-2 flex items-center">
                      <button
                        type="button"
                        onClick={() => removeSizeStock(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="grid grid-cols-12 gap-3 mt-4">
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      placeholder="Nouvelle taille (ex: S, M, L)"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="col-span-5">
                    <input
                      type="number"
                      min="0"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
                      placeholder="Quantité"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={addSizeStock}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mb-6">
            <Link 
              href="/admin/products" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isSaving ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSaving ? (
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
        </form>
      </main>
    </div>
  );
} 