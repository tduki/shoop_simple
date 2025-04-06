'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  TrashIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  PencilSquareIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  EyeIcon,
  XMarkIcon,
  CheckIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { isAuthenticated } from '@/services/productService';
import AdminHeader from '@/components/AdminHeader';
import { Toaster } from 'react-hot-toast';

// Types pour les produits
type ProductCategory = 'sneakers' | 't-shirts' | 'pants' | 'jackets' | 'accessories';

type Product = {
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
};

export default function AdminProducts() {
  const router = useRouter();
  
  // États
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // Filtres et recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 10;
  
  // Confirmation de suppression
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  
  // Nouveaux états pour les actions par lot
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const authResult = await isAuthenticated();
      if (!authResult) {
        router.push('/auth/login?returnUrl=/admin/products');
        return;
      }
      
      fetchProducts();
    };
    
    checkAuth();
  }, [router]);
  
  const fetchProducts = () => {
    setIsLoading(true);
    
    // Simulation d'une requête API
    setTimeout(() => {
      const mockProducts: Product[] = [];
      const categories: ProductCategory[] = ['sneakers', 't-shirts', 'pants', 'jackets', 'accessories'];
      
      // Générer des produits fictifs
      for (let i = 1; i <= 40; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        mockProducts.push({
          id: `prod-${i}`,
          name: `${category.charAt(0).toUpperCase() + category.slice(1)} ${i}`,
          description: `Description produit ${i}`,
          price: Math.floor(Math.random() * 150) + 50,
          oldPrice: Math.random() > 0.5 ? Math.floor((Math.floor(Math.random() * 150) + 50) * 1.2) : undefined,
          category,
          imageUrl: `https://via.placeholder.com/100x100?text=Product+${i}`,
          stock: Math.floor(Math.random() * 100),
          sku: `SKU-${i}`,
          isActive: Math.random() > 0.2,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString()
        });
      }
      
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setTotalPages(Math.ceil(mockProducts.length / productsPerPage));
      setIsLoading(false);
    }, 800);
  };
  
  useEffect(() => {
    // Appliquer les filtres à chaque changement de filtre ou de recherche
    let filtered = [...products];
    
    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
      );
    }
    
    // Filtre par catégorie
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    // Filtre par stock
    if (stockFilter === 'instock') {
      filtered = filtered.filter(product => product.stock > 0);
    } else if (stockFilter === 'outofstock') {
      filtered = filtered.filter(product => product.stock === 0);
    } else if (stockFilter === 'lowstock') {
      filtered = filtered.filter(product => product.stock > 0 && product.stock <= 5);
    }
    
    setFilteredProducts(filtered);
    setTotalPages(Math.ceil(filtered.length / productsPerPage));
    setCurrentPage(1); // Réinitialiser à la première page après un changement de filtre
  }, [products, searchQuery, categoryFilter, stockFilter]);
  
  const handleDeleteProduct = (id: string) => {
    // Afficher la confirmation
    setDeleteProductId(id);
  };
  
  const confirmDelete = () => {
    if (!deleteProductId) return;
    
    // Simuler la suppression
    const updatedProducts = products.filter(product => product.id !== deleteProductId);
    setProducts(updatedProducts);
    setDeleteProductId(null);
  };
  
  const toggleProductStatus = (id: string) => {
    // Trouver et mettre à jour le statut du produit
    const updatedProducts = products.map(product => {
      if (product.id === id) {
        return { ...product, isActive: !product.isActive };
      }
      return product;
    });
    
    setProducts(updatedProducts);
  };
  
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };
  
  // Sélectionner/désélectionner tous les produits
  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product.id));
    }
  };

  // Sélectionner/désélectionner un produit
  const toggleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  // Appliquer une action en lot aux produits sélectionnés
  const applyBulkAction = () => {
    if (!bulkAction || selectedProducts.length === 0) return;

    if (bulkAction === "delete" && !confirm(`Êtes-vous sûr de vouloir supprimer ${selectedProducts.length} produit(s) ?`)) {
      return;
    }

    const newProducts = [...products];
    
    switch (bulkAction) {
      case "delete":
        // Supprimer les produits sélectionnés
        const updatedProducts = newProducts.filter(product => !selectedProducts.includes(product.id));
        setProducts(updatedProducts);
        // Mettre à jour les produits filtrés
        const filtered = filterProductsByFilters(updatedProducts, searchQuery, categoryFilter, stockFilter);
        setFilteredProducts(filtered);
        setTotalPages(Math.max(1, Math.ceil(filtered.length / productsPerPage)));
        break;
      
      case "activate":
        // Activer les produits sélectionnés
        newProducts.forEach(product => {
          if (selectedProducts.includes(product.id)) {
            product.isActive = true;
          }
        });
        setProducts(newProducts);
        // Mettre à jour les produits filtrés
        const filteredActivate = filterProductsByFilters(newProducts, searchQuery, categoryFilter, stockFilter);
        setFilteredProducts(filteredActivate);
        setTotalPages(Math.max(1, Math.ceil(filteredActivate.length / productsPerPage)));
        break;
      
      case "deactivate":
        // Désactiver les produits sélectionnés
        newProducts.forEach(product => {
          if (selectedProducts.includes(product.id)) {
            product.isActive = false;
          }
        });
        setProducts(newProducts);
        // Mettre à jour les produits filtrés
        const filteredDeactivate = filterProductsByFilters(newProducts, searchQuery, categoryFilter, stockFilter);
        setFilteredProducts(filteredDeactivate);
        setTotalPages(Math.max(1, Math.ceil(filteredDeactivate.length / productsPerPage)));
        break;
    }

    // Réinitialiser la sélection
    setSelectedProducts([]);
    setBulkAction("");
    
    // Afficher une notification
    alert(`Action ${bulkAction} appliquée avec succès sur ${selectedProducts.length} produit(s).`);
  };

  // Fonction pour filtrer les produits (pour la réutilisation dans plusieurs endroits)
  const filterProductsByFilters = (productList: Product[], query: string, category: string, stock: string) => {
    return productList.filter((product) => {
      // Filtre par recherche
      const matchesSearch = query === "" || 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.sku.toLowerCase().includes(query.toLowerCase());
      
      // Filtre par catégorie
      const matchesCategory = category === "all" || product.category === category;
      
      // Filtre par stock
      let matchesStock = true;
      if (stock === "in-stock") {
        matchesStock = product.stock > 0;
      } else if (stock === "low-stock") {
        matchesStock = product.stock > 0 && product.stock < 10;
      } else if (stock === "out-of-stock") {
        matchesStock = product.stock === 0;
      }
      
      return matchesSearch && matchesCategory && matchesStock;
    });
  };

  // Exporter les produits en CSV
  const exportProductsToCSV = () => {
    // Déterminer les produits à exporter (tous ou seulement ceux sélectionnés)
    const productsToExport = selectedProducts.length > 0 
      ? products.filter(product => selectedProducts.includes(product.id)) 
      : filteredProducts;
    
    // Créer les en-têtes du CSV
    const headers = ["ID", "Nom", "Description", "Prix", "Catégorie", "Stock", "SKU", "Statut", "Date de création"];
    
    // Créer les lignes du CSV
    const csvRows = [
      headers.join(','), // En-têtes
      ...productsToExport.map(product => {
        return [
          product.id,
          `"${product.name.replace(/"/g, '""')}"`, // Échapper les guillemets
          `"${product.description.replace(/"/g, '""')}"`,
          product.price,
          product.category,
          product.stock,
          product.sku,
          product.isActive ? "Actif" : "Inactif",
          new Date(product.createdAt).toLocaleDateString('fr-FR')
        ].join(',');
      })
    ];
    
    // Créer le contenu du CSV
    const csvContent = csvRows.join('\n');
    
    // Créer un lien de téléchargement
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `produits_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    
    // Nettoyer
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
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
      <Toaster />
      <AdminHeader 
        title="Gestion des produits"
        actionButton={
          <div className="flex space-x-3">
            <Link href="/admin/products/new" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Ajouter un produit
            </Link>
          </div>
        }
      />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg">
          {/* Filtres et recherche */}
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Rechercher un produit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
                  <select
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md sm:text-sm"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">Toutes les catégories</option>
                    <option value="sneakers">Sneakers</option>
                    <option value="t-shirts">T-shirts</option>
                    <option value="pants">Pantalons</option>
                    <option value="jackets">Vestes</option>
                    <option value="accessories">Accessoires</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <select
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md sm:text-sm"
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                  >
                    <option value="all">Tous les stocks</option>
                    <option value="instock">En stock</option>
                    <option value="outofstock">Rupture</option>
                    <option value="lowstock">Stock faible</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setStockFilter('all');
                  }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-1" />
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>

          {/* Tableau des produits */}
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Produit
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Catégorie
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Prix
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Stock
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Statut
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getCurrentPageItems().length > 0 ? (
                        getCurrentPageItems().map((product) => (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 relative">
                                  <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    width={40}
                                    height={40}
                                    className="h-10 w-10 rounded-md object-cover"
                                    unoptimized={true}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                  <div className="text-sm text-gray-500">{product.sku}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{product.category}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {product.oldPrice ? (
                                  <>
                                    <span className="font-medium">{product.price.toFixed(2)} €</span>
                                    <span className="ml-2 line-through text-gray-500">{product.oldPrice.toFixed(2)} €</span>
                                  </>
                                ) : (
                                  <span>{product.price.toFixed(2)} €</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                  product.stock === 0
                                    ? 'bg-red-100 text-red-800'
                                    : product.stock <= 5
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                                }`}
                              >
                                {product.stock} unités
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  product.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {product.isActive ? 'Actif' : 'Inactif'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <Link href={`/admin/products/edit/${product.id}`}>
                                  <span className="text-indigo-600 hover:text-indigo-900 cursor-pointer p-1 hover:bg-gray-100 rounded">
                                    <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                </Link>
                                <button
                                  onClick={() => toggleProductStatus(product.id)}
                                  className={`${
                                    product.isActive ? 'text-gray-600' : 'text-green-600'
                                  } hover:text-indigo-900 p-1 hover:bg-gray-100 rounded`}
                                >
                                  {product.isActive ? (
                                    <XCircleIcon className="h-5 w-5" aria-hidden="true" />
                                  ) : (
                                    <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="text-red-600 hover:text-red-900 p-1 hover:bg-gray-100 rounded"
                                >
                                  <TrashIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-10 text-center">
                            <p className="text-gray-500">Aucun produit ne correspond à vos critères.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{filteredProducts.length}</span> produits au total
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Précédent</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === page
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        } text-sm font-medium`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Suivant</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal de confirmation de suppression */}
      {deleteProductId && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Supprimer le produit</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Supprimer
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setDeleteProductId(null)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'export */}
      {showExportModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Exporter les produits
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {selectedProducts.length > 0 
                        ? `Exporter ${selectedProducts.length} produit(s) sélectionné(s)` 
                        : `Exporter tous les produits filtrés (${filteredProducts.length})`}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={exportProductsToCSV}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:col-start-2 sm:text-sm"
                >
                  Exporter en CSV
                </button>
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm"
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