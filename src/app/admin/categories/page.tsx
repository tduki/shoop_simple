'use client';

import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { isAuthenticated } from '@/services/productService';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AdminHeader from '@/components/AdminHeader';

// Types
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent: string | null;
  image: string | null;
  active: boolean;
  productCount: number;
  createdAt: string;
}

export default function AdminCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parent: '',
    image: null as File | null,
    active: true
  });
  const [formErrors, setFormErrors] = useState({} as Record<string, string>);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier l'authentification
    if (!isAuthenticated()) {
      toast.error('Vous devez être connecté pour accéder à cette page');
      router.push('/auth/login');
      return;
    }

    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    setIsLoading(true);
    
    // Simuler une requête API
    setTimeout(() => {
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Chaussures',
          slug: 'chaussures',
          description: 'Toutes nos chaussures de qualité',
          parent: null,
          image: '/images/categories/shoes.jpg',
          active: true,
          productCount: 24,
          createdAt: '2023-09-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'Vêtements',
          slug: 'vetements',
          description: 'Notre collection de vêtements',
          parent: null,
          image: '/images/categories/clothing.jpg',
          active: true,
          productCount: 36,
          createdAt: '2023-09-14T08:20:00Z'
        },
        {
          id: '3',
          name: 'Accessoires',
          slug: 'accessoires',
          description: 'Accessoires tendance',
          parent: null,
          image: '/images/categories/accessories.jpg',
          active: true,
          productCount: 18,
          createdAt: '2023-09-13T14:15:00Z'
        },
        {
          id: '4',
          name: 'Baskets',
          slug: 'baskets',
          description: 'Baskets et sneakers',
          parent: '1',
          image: '/images/categories/sneakers.jpg',
          active: true,
          productCount: 12,
          createdAt: '2023-09-12T11:45:00Z'
        },
        {
          id: '5',
          name: 'Chaussures de ville',
          slug: 'chaussures-ville',
          description: 'Chaussures élégantes pour hommes et femmes',
          parent: '1',
          image: '/images/categories/formal-shoes.jpg',
          active: true,
          productCount: 8,
          createdAt: '2023-09-11T09:30:00Z'
        }
      ];
      
      setCategories(mockCategories);
      setIsLoading(false);
    }, 800);
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setCurrentCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description,
        parent: category.parent || '',
        image: null,
        active: category.active
      });
      setImagePreview(category.image);
    } else {
      setCurrentCategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        parent: '',
        image: null,
        active: true
      });
      setImagePreview(null);
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCategory(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: target.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Si on modifie le nom, suggérer un slug
    if (name === 'name' && !currentCategory) {
      const suggestedSlug = value.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-');
      setFormData(prev => ({ ...prev, slug: suggestedSlug }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData({ ...formData, image: file });
      
      // Aperçu de l'image
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name) errors.name = 'Le nom est requis';
    if (!formData.slug) errors.slug = 'Le slug est requis';
    if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'Le slug ne doit contenir que des lettres minuscules, des chiffres et des tirets';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Simuler la sauvegarde
    setIsLoading(true);
    
    setTimeout(() => {
      if (currentCategory) {
        // Mise à jour
        const updatedCategories = categories.map(cat => 
          cat.id === currentCategory.id 
            ? { 
                ...cat, 
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                parent: formData.parent || null,
                active: formData.active
              } 
            : cat
        );
        setCategories(updatedCategories);
        toast.success('Catégorie mise à jour avec succès');
      } else {
        // Création
        const newCategory: Category = {
          id: Date.now().toString(),
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          parent: formData.parent || null,
          image: imagePreview,
          active: formData.active,
          productCount: 0,
          createdAt: new Date().toISOString()
        };
        setCategories([...categories, newCategory]);
        toast.success('Catégorie créée avec succès');
      }
      
      setIsLoading(false);
      handleCloseModal();
    }, 1000);
  };

  const confirmDelete = (id: string) => {
    setCategoryToDelete(id);
    setIsDeleting(true);
  };

  const cancelDelete = () => {
    setCategoryToDelete(null);
    setIsDeleting(false);
  };

  const handleDelete = () => {
    if (!categoryToDelete) return;
    
    setIsLoading(true);
    
    // Vérifier si la catégorie a des sous-catégories
    const hasChildren = categories.some(cat => cat.parent === categoryToDelete);
    
    if (hasChildren) {
      toast.error('Impossible de supprimer cette catégorie car elle contient des sous-catégories');
      setIsLoading(false);
      cancelDelete();
      return;
    }
    
    // Simuler la suppression
    setTimeout(() => {
      const updatedCategories = categories.filter(cat => cat.id !== categoryToDelete);
      setCategories(updatedCategories);
      setIsLoading(false);
      cancelDelete();
      toast.success('Catégorie supprimée avec succès');
    }, 1000);
  };

  const getParentName = (parentId: string | null): string => {
    if (!parentId) return '';
    const parent = categories.find(cat => cat.id === parentId);
    return parent ? parent.name : '';
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <AdminHeader 
        title="Gestion des catégories"
        actionButton={
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Ajouter une catégorie
          </button>
        }
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <div className="flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Rechercher une catégorie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={fetchCategories}
            className="ml-4 p-2 text-gray-500 hover:text-indigo-600 transition"
            title="Rafraîchir"
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Aucune catégorie trouvée</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produits</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {category.image && (
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <Image 
                              src={category.image} 
                              alt={category.name}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-md object-cover" 
                            />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                          <div className="text-sm text-gray-500">{category.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getParentName(category.parent)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{category.productCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        category.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleOpenModal(category)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Modifier"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => confirmDelete(category.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal pour ajouter/modifier une catégorie */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center pb-4 border-b">
              <h3 className="text-xl font-medium text-gray-900">
                {currentCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border ${formErrors.slug ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {formErrors.slug && <p className="mt-1 text-sm text-red-600">{formErrors.slug}</p>}
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="parent" className="block text-sm font-medium text-gray-700">Catégorie parente</label>
                  <select
                    id="parent"
                    name="parent"
                    value={formData.parent}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Aucune (catégorie principale)</option>
                    {categories
                      .filter(cat => !cat.parent && (!currentCategory || cat.id !== currentCategory.id))
                      .map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))
                    }
                  </select>
                </div>
                
                <div className="col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  ></textarea>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Image</label>
                  <div className="mt-1 flex items-center">
                    {imagePreview ? (
                      <div className="relative">
                        <Image 
                          src={imagePreview} 
                          alt="Aperçu" 
                          width={128}
                          height={128}
                          className="h-32 w-32 object-cover rounded-md" 
                        />
                        <button
                          type="button"
                          onClick={() => { setImagePreview(null); setFormData({ ...formData, image: null }); }}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-md h-32 w-32">
                        <label htmlFor="image-upload" className="cursor-pointer text-center p-4">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="mt-2 block text-xs font-medium text-gray-600">
                            Télécharger
                          </span>
                          <input
                            id="image-upload"
                            name="image"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center">
                    <input
                      id="active"
                      name="active"
                      type="checkbox"
                      checked={formData.active}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                      Activer cette catégorie
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {currentCategory ? 'Mettre à jour' : 'Créer la catégorie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {isDeleting && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Confirmer la suppression</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action ne peut pas être annulée.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-700 focus:outline-none"
                >
                  Supprimer
                </button>
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-base font-medium rounded-md w-24 hover:bg-gray-300 focus:outline-none"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 