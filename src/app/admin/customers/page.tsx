'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  EyeIcon, 
  ArrowPathIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ShoppingBagIcon,
  UserIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { isAuthenticated } from '@/services/productService';

// Types pour les clients
type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country: string;
  registrationDate: string;
  lastLoginDate?: string;
  totalOrders: number;
  totalSpent: number;
  isSubscribedToNewsletter: boolean;
  status: 'active' | 'inactive' | 'blocked';
};

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'blocked'>('all');
  const [newsletterFilter, setNewsletterFilter] = useState<'all' | 'subscribed' | 'unsubscribed'>('all');
  const [sortBy, setSortBy] = useState<string>('registrationDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const customersPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const authResult = await isAuthenticated();
      if (!authResult) {
        router.push('/auth/login?returnUrl=/admin/customers');
        return;
      }
      
      fetchCustomers();
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    // Filtrage, tri et recherche
    let filtered = [...customers];
    
    // Appliquer les filtres
    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }
    
    if (newsletterFilter !== 'all') {
      filtered = filtered.filter(customer => 
        newsletterFilter === 'subscribed' ? customer.isSubscribedToNewsletter : !customer.isSubscribedToNewsletter
      );
    }
    
    // Appliquer la recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(customer => 
        customer.firstName.toLowerCase().includes(query) ||
        customer.lastName.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        (customer.phone && customer.phone.includes(query)) ||
        (customer.address && customer.address.toLowerCase().includes(query)) ||
        (customer.city && customer.city.toLowerCase().includes(query)) ||
        (customer.postalCode && customer.postalCode.includes(query))
      );
    }
    
    // Trier les résultats
    filtered.sort((a, b) => {
      let valueA: any = a[sortBy as keyof Customer];
      let valueB: any = b[sortBy as keyof Customer];
      
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
    
    setFilteredCustomers(filtered);
    setTotalPages(Math.ceil(filtered.length / customersPerPage));
    setCurrentPage(1); // Réinitialiser à la première page lors du filtrage
  }, [customers, searchQuery, statusFilter, newsletterFilter, sortBy, sortDirection]);

  const fetchCustomers = () => {
    setIsLoading(true);
    
    // Simulation d'une récupération d'API
    setTimeout(() => {
      const mockCustomers: Customer[] = Array.from({ length: 35 }, (_, i) => {
        const registrationDate = new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000));
        const lastLoginDate = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
        const totalOrders = Math.floor(Math.random() * 20);
        const totalSpent = Math.floor(Math.random() * 200) * 10 + 50;
        const status = ['active', 'active', 'active', 'inactive', 'blocked'][Math.floor(Math.random() * 5)] as 'active' | 'inactive' | 'blocked';
        
        return {
          id: `CUST-${10000 + i}`,
          firstName: [`Thomas`, `Marie`, `Julie`, `Nicolas`, `Sophie`, `Pierre`, `Camille`, `Lucas`, `Emma`, `Antoine`][Math.floor(Math.random() * 10)],
          lastName: [`Martin`, `Dubois`, `Bernard`, `Thomas`, `Petit`, `Robert`, `Richard`, `Durand`, `Leroy`, `Moreau`][Math.floor(Math.random() * 10)],
          email: `client${i + 1}@example.com`,
          phone: Math.random() > 0.2 ? `0${Math.floor(Math.random() * 9) + 1}${Array.from({length: 8}, () => Math.floor(Math.random() * 10)).join('')}` : undefined,
          address: Math.random() > 0.3 ? `${Math.floor(Math.random() * 100) + 1} Rue ${['Principale', 'de Paris', 'du Commerce', 'Saint-Michel', 'Victor Hugo'][Math.floor(Math.random() * 5)]}` : undefined,
          city: Math.random() > 0.3 ? ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille', 'Toulouse', 'Nantes', 'Strasbourg'][Math.floor(Math.random() * 8)] : undefined,
          postalCode: Math.random() > 0.3 ? `${Math.floor(Math.random() * 90000) + 10000}` : undefined,
          country: 'France',
          registrationDate: registrationDate.toISOString(),
          lastLoginDate: Math.random() > 0.1 ? lastLoginDate.toISOString() : undefined,
          totalOrders,
          totalSpent,
          isSubscribedToNewsletter: Math.random() > 0.4,
          status
        };
      });
      
      setCustomers(mockCustomers);
      setFilteredCustomers(mockCustomers);
      setTotalPages(Math.ceil(mockCustomers.length / customersPerPage));
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

  const getStatusBadge = (status: 'active' | 'inactive' | 'blocked') => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Actif</span>;
      case 'inactive':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Inactif</span>;
      case 'blocked':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Bloqué</span>;
    }
  };

  // Pagination des clients
  const displayedCustomers = filteredCustomers.slice(
    (currentPage - 1) * customersPerPage,
    currentPage * customersPerPage
  );

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
            <h1 className="text-3xl font-bold text-gray-900">Gestion des clients</h1>
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Retour au tableau de bord
                </span>
              </Link>
              <button
                onClick={fetchCustomers}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowPathIcon className="mr-2 h-5 w-5" />
                Rafraîchir
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Résumé des statistiques clients */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserCircleIcon className="h-6 w-6 text-indigo-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500">Clients totaux</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{customers.length}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarIcon className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500">Nouveaux ce mois</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {customers.filter(c => {
                          const date = new Date(c.registrationDate);
                          const now = new Date();
                          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                        }).length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <EnvelopeIcon className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500">Abonnés newsletter</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {customers.filter(c => c.isSubscribedToNewsletter).length}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        ({Math.round((customers.filter(c => c.isSubscribedToNewsletter).length / customers.length) * 100)}%)
                      </span>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShoppingBagIcon className="h-6 w-6 text-purple-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500">Panier moyen</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.totalOrders, 0) || 0}€
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="p-5 border-b border-gray-200">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Rechercher un client..."
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive' | 'blocked')}
                  className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actifs</option>
                  <option value="inactive">Inactifs</option>
                  <option value="blocked">Bloqués</option>
                </select>
                <select
                  value={newsletterFilter}
                  onChange={(e) => setNewsletterFilter(e.target.value as 'all' | 'subscribed' | 'unsubscribed')}
                  className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="all">Newsletter (tous)</option>
                  <option value="subscribed">Abonnés</option>
                  <option value="unsubscribed">Non abonnés</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des clients */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Clients</h3>
            <span className="text-sm text-gray-500">{filteredCustomers.length} client(s)</span>
          </div>
          
          {filteredCustomers.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">Aucun client trouvé.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('id')}
                      >
                        ID {getSortIcon('id')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('lastName')}
                      >
                        Client {getSortIcon('lastName')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('email')}
                      >
                        Contact {getSortIcon('email')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('registrationDate')}
                      >
                        Inscription {getSortIcon('registrationDate')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('totalOrders')}
                      >
                        Commandes {getSortIcon('totalOrders')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('totalSpent')}
                      >
                        Dépenses {getSortIcon('totalSpent')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('status')}
                      >
                        Statut {getSortIcon('status')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {displayedCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{customer.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <UserIcon className="h-10 w-10 rounded-full bg-gray-100 p-2 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{customer.firstName} {customer.lastName}</div>
                              <div className="text-sm text-gray-500">{customer.city}, {customer.country}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="flex items-center text-sm text-gray-900">
                              <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                              {customer.email}
                            </div>
                            {customer.phone && (
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                                {customer.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(customer.registrationDate).toLocaleDateString('fr-FR')}
                          </div>
                          {customer.lastLoginDate && (
                            <div className="text-xs text-gray-500">
                              Dernière connexion: {new Date(customer.lastLoginDate).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.totalOrders}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.totalSpent} €
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusBadge(customer.status)}
                            {customer.isSubscribedToNewsletter && (
                              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Newsletter</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/admin/customers/${customer.id}`}>
                            <span className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
                              <EyeIcon className="h-5 w-5" />
                            </span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-700">
                      Affichage de <span className="font-medium">{(currentPage - 1) * customersPerPage + 1}</span> à <span className="font-medium">{Math.min(currentPage * customersPerPage, filteredCustomers.length)}</span> sur <span className="font-medium">{filteredCustomers.length}</span> clients
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(old => Math.max(old - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        &laquo; Précédent
                      </button>
                      
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                        <button
                          key={i + 1}
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
                      
                      {totalPages > 5 && (
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          ...
                        </span>
                      )}
                      
                      <button
                        onClick={() => setCurrentPage(old => Math.min(old + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        Suivant &raquo;
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
} 