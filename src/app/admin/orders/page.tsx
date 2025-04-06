'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  PencilIcon, 
  EyeIcon, 
  TruckIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ArrowPathIcon,
  ShoppingBagIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { isAuthenticated } from '@/services/productService';
import AdminHeader from '@/components/AdminHeader';
import { Toaster } from 'react-hot-toast';

// Types pour les commandes
type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  total: number;
};

type Order = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
  total: number;
  notes?: string;
  trackingNumber?: string;
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const authResult = await isAuthenticated();
      if (!authResult) {
        router.push('/auth/login?returnUrl=/admin/orders');
        return;
      }
      
      fetchOrders();
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    // Filtrage, tri et recherche
    let filtered = [...orders];
    
    // Appliquer les filtres
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Appliquer la recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerEmail.toLowerCase().includes(query) ||
        order.shippingAddress.city.toLowerCase().includes(query) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(query))
      );
    }
    
    // Trier les résultats
    filtered.sort((a, b) => {
      let valueA: any = a[sortBy as keyof Order];
      let valueB: any = b[sortBy as keyof Order];
      
      // Gestion spéciale pour les dates
      if (sortBy === 'date') {
        valueA = new Date(a.date).getTime();
        valueB = new Date(b.date).getTime();
      }
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        if (sortDirection === 'asc') {
          return valueA.localeCompare(valueB);
        } else {
          return valueB.localeCompare(valueA);
        }
      } else {
        if (sortDirection === 'asc') {
          return valueA - valueB;
        } else {
          return valueB - valueA;
        }
      }
    });
    
    setFilteredOrders(filtered);
    setTotalPages(Math.ceil(filtered.length / ordersPerPage));
    setCurrentPage(1); // Réinitialiser à la première page lors du filtrage
  }, [orders, searchQuery, statusFilter, sortBy, sortDirection]);

  useEffect(() => {
    // Calculer le total des commandes filtrées
    const total = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    setTotalAmount(total);
  }, [filteredOrders]);

  const fetchOrders = () => {
    setIsLoading(true);
    
    // Simulation d'une récupération d'API
    setTimeout(() => {
      const mockOrders: Order[] = Array.from({ length: 25 }, (_, i) => {
        const date = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
        const status = [
          'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
        ][Math.floor(Math.random() * 7)] as OrderStatus;
        
        const subtotal = Math.floor(Math.random() * 20000) / 100 + 50;
        const shipping = Math.floor(Math.random() * 1000) / 100 + 5;
        const tax = Math.floor(subtotal * 0.2 * 100) / 100;
        const discount = Math.random() > 0.7 ? Math.floor(subtotal * 0.1 * 100) / 100 : undefined;
        const total = subtotal + shipping + tax - (discount || 0);
        
        return {
          id: `ORD-${10000 + i}`,
          customerId: `CUST-${20000 + Math.floor(Math.random() * 100)}`,
          customerName: [`Thomas Martin`, `Marie Dubois`, `Julie Bernard`, `Nicolas Thomas`, `Sophie Petit`][Math.floor(Math.random() * 5)],
          customerEmail: [`client1@example.com`, `client2@example.com`, `client3@example.com`][Math.floor(Math.random() * 3)],
          date: date.toISOString(),
          status,
          paymentMethod: ['credit_card', 'paypal', 'bank_transfer'][Math.floor(Math.random() * 3)],
          paymentStatus: status === 'refunded' ? 'refunded' : (status === 'pending' ? 'pending' : 'paid'),
          shippingAddress: {
            fullName: [`Thomas Martin`, `Marie Dubois`, `Julie Bernard`, `Nicolas Thomas`, `Sophie Petit`][Math.floor(Math.random() * 5)],
            address: `${Math.floor(Math.random() * 100) + 1} Rue ${['Principale', 'de Paris', 'du Commerce', 'Saint-Michel', 'Victor Hugo'][Math.floor(Math.random() * 5)]}`,
            city: ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille'][Math.floor(Math.random() * 5)],
            postalCode: `${Math.floor(Math.random() * 90000) + 10000}`,
            country: 'France',
            phone: `0${Math.floor(Math.random() * 9) + 1}${Array.from({length: 8}, () => Math.floor(Math.random() * 10)).join('')}`
          },
          items: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, j) => ({
            id: `ITEM-${i}-${j}`,
            productId: `PROD-${Math.floor(Math.random() * 100) + 1}`,
            productName: [`T-shirt Premium`, `Sneakers Classic`, `Jeans Slim Fit`, `Veste Urban`, `Casquette Logo`][Math.floor(Math.random() * 5)],
            price: Math.floor(Math.random() * 10000) / 100 + 20,
            quantity: Math.floor(Math.random() * 3) + 1,
            size: ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)],
            color: ['Noir', 'Blanc', 'Bleu', 'Rouge'][Math.floor(Math.random() * 4)],
            total: 0 // sera calculé ci-dessous
          })),
          subtotal,
          shipping,
          tax,
          discount,
          total,
          notes: Math.random() > 0.8 ? 'Livraison à l\'étage, merci de contacter avant livraison.' : undefined,
          trackingNumber: status === 'shipped' || status === 'delivered' ? `TR${Math.floor(Math.random() * 1000000)}` : undefined
        };
      });
      
      // Calculer le total des items
      mockOrders.forEach(order => {
        order.items.forEach(item => {
          item.total = item.price * item.quantity;
        });
      });
      
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setTotalPages(Math.ceil(mockOrders.length / ordersPerPage));
      setIsLoading(false);
    }, 800);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      // Inverser la direction du tri si on clique sur la même colonne
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Nouvelle colonne de tri, direction par défaut
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    
    return (
      <span className="ml-1 text-gray-500">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, { color: string, label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
      paid: { color: 'bg-blue-100 text-blue-800', label: 'Payée' },
      processing: { color: 'bg-indigo-100 text-indigo-800', label: 'En préparation' },
      shipped: { color: 'bg-purple-100 text-purple-800', label: 'Expédiée' },
      delivered: { color: 'bg-green-100 text-green-800', label: 'Livrée' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Annulée' },
      refunded: { color: 'bg-gray-100 text-gray-800', label: 'Remboursée' }
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusMap[status].color}`}>
        {statusMap[status].label}
      </span>
    );
  };

  const getPaymentMethodBadge = (method: string) => {
    const methodMap: Record<string, { icon: React.ReactNode, label: string }> = {
      credit_card: { 
        icon: <BanknotesIcon className="h-4 w-4 mr-1" />, 
        label: 'Carte bancaire' 
      },
      paypal: { 
        icon: <span className="text-blue-500 font-bold mr-1">P</span>, 
        label: 'PayPal' 
      },
      bank_transfer: { 
        icon: <DocumentTextIcon className="h-4 w-4 mr-1" />, 
        label: 'Virement' 
      }
    };
    
    const displayInfo = methodMap[method] || { icon: <></>, label: method };
    
    return (
      <span className="flex items-center text-sm text-gray-700">
        {displayInfo.icon}
        {displayInfo.label}
      </span>
    );
  };

  // Pagination des commandes
  const displayedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Fonction de filtrage des commandes
  const filterOrders = () => {
    let filtered = [...orders];
    
    // Filtrer par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Filtrer par date
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch(dateFilter) {
        case "today":
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= today;
          });
          break;
        case "yesterday":
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= yesterday && orderDate < today;
          });
          break;
        case "thisWeek":
          const thisWeekStart = new Date(today);
          thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= thisWeekStart;
          });
          break;
        case "thisMonth":
          const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= thisMonthStart;
          });
          break;
      }
    }
    
    // Filtrer par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerEmail.toLowerCase().includes(query) ||
        order.shippingAddress.city.toLowerCase().includes(query) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(query))
      );
    }
    
    setFilteredOrders(filtered);
  };
  
  // Appliquer les filtres quand ils changent
  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter, dateFilter]);
  
  // Sélectionner/désélectionner toutes les commandes
  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };
  
  // Sélectionner/désélectionner une commande
  const toggleSelectOrder = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };
  
  // Exporter les commandes en CSV
  const exportOrdersToCSV = () => {
    // Déterminer les commandes à exporter (toutes ou seulement celles sélectionnées)
    const ordersToExport = selectedOrders.length > 0 
      ? orders.filter(order => selectedOrders.includes(order.id)) 
      : filteredOrders;
    
    // Créer les en-têtes du CSV
    const headers = ["ID", "Client", "Email", "Date", "Statut", "Montant", "Numéro de suivi"];
    
    // Créer les lignes du CSV
    const csvRows = [
      headers.join(','), // En-têtes
      ...ordersToExport.map(order => {
        return [
          order.id,
          `"${order.customerName.replace(/"/g, '""')}"`, // Échapper les guillemets
          `"${order.customerEmail.replace(/"/g, '""')}"`,
          new Date(order.date).toLocaleDateString('fr-FR'),
          order.status,
          order.total.toFixed(2),
          order.trackingNumber || '-'
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
    link.setAttribute('download', `commandes_export_${new Date().toISOString().split('T')[0]}.csv`);
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
        title="Gestion des commandes"
        actionButton={
          <div className="flex space-x-3">
            <button
              onClick={() => setShowExportModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Exporter en CSV
            </button>
            <button
              onClick={() => router.push('/admin')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Retour au tableau de bord
            </button>
          </div>
        }
      />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Filtres */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Recherche */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une commande..."
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              {/* Filtre par statut */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="processing">En cours</option>
                  <option value="shipped">Expédiée</option>
                  <option value="delivered">Livrée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>
              
              {/* Filtre par date */}
              <div>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="all">Toutes les périodes</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="yesterday">Hier</option>
                  <option value="thisWeek">Cette semaine</option>
                  <option value="thisMonth">Ce mois-ci</option>
                </select>
              </div>
              
              {/* Info commandes */}
              <div className="bg-indigo-50 rounded-md p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-800">Commandes: {filteredOrders.length}</p>
                  <p className="text-sm font-medium text-indigo-900">Total: {totalAmount.toFixed(2)} €</p>
                </div>
                {selectedOrders.length > 0 && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                    {selectedOrders.length} sélectionnée(s)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Liste des commandes */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                    <input 
                      type="checkbox" 
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0} 
                      onChange={toggleSelectAll}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commande
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        checked={selectedOrders.includes(order.id)} 
                        onChange={() => toggleSelectOrder(order.id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order.date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.total.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/admin/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        Voir
                      </Link>
                      <Link href={`/admin/orders/${order.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                        Modifier
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Précédent
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">{(currentPage - 1) * ordersPerPage + 1}</span> à <span className="font-medium">{Math.min(currentPage * ordersPerPage, filteredOrders.length)}</span> sur <span className="font-medium">{filteredOrders.length}</span> résultats
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Précédent</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
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
        </div>
      </main>
      
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
                    Exporter les commandes
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {selectedOrders.length > 0 
                        ? `Exporter ${selectedOrders.length} commande(s) sélectionnée(s)` 
                        : `Exporter toutes les commandes filtrées (${filteredOrders.length})`}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={exportOrdersToCSV}
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