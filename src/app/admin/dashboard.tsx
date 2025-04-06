'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBagIcon, 
  UserGroupIcon, 
  CurrencyEuroIcon, 
  TagIcon,
  ChartBarIcon,
  TicketIcon,
  PhotoIcon,
  Cog6ToothIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  TruckIcon,
  BuildingStorefrontIcon,
  BellAlertIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline';
import { isAuthenticated } from '@/services/productService';

interface DashboardProps {
  activeModule?: string;
  children?: React.ReactNode;
}

export default function AdminDashboard({ activeModule, children }: DashboardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const authResult = await isAuthenticated();
      if (!authResult) {
        router.push('/auth/login?returnUrl=/admin');
        return;
      }
      
      fetchDashboardStats();
      fetchNotifications();
    };

    checkAuth();
  }, [router]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    
    // Simulation d'une récupération d'API
    setTimeout(() => {
      const mockStats = {
        totalRevenue: 28750,
        totalOrders: 142,
        totalCustomers: 89,
        totalProducts: 76,
        averageOrderValue: 202.46,
        pendingOrders: 8,
        lowStockProducts: 12,
        unreadMessages: 4,
        newCustomers: 12,
        revenueGrowth: 14.2,
        orderGrowth: 8.5,
        popularCategory: 'Sneakers'
      };
      
      setStats(mockStats);
      setLoading(false);
    }, 600);
  };

  const fetchNotifications = async () => {
    // Simulation d'une récupération d'API
    setTimeout(() => {
      const mockNotifications = [
        {
          id: 'notif-1',
          type: 'order',
          message: 'Nouvelle commande (#ORD-10042) de Marie Dupont',
          time: '5 minutes',
          read: false
        },
        {
          id: 'notif-2',
          type: 'stock',
          message: 'Stock faible pour "Sneakers Classic" (5 restants)',
          time: '1 heure',
          read: false
        },
        {
          id: 'notif-3',
          type: 'customer',
          message: 'Nouveau client inscrit: Jean Martin',
          time: '3 heures',
          read: true
        },
        {
          id: 'notif-4',
          type: 'message',
          message: 'Nouveau message de support de Pierre Laurent',
          time: '1 jour',
          read: true
        }
      ];
      
      setNotifications(mockNotifications);
    }, 800);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBagIcon className="h-5 w-5 text-indigo-500" />;
      case 'stock':
        return <TagIcon className="h-5 w-5 text-red-500" />;
      case 'customer':
        return <UserGroupIcon className="h-5 w-5 text-green-500" />;
      case 'message':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <BellAlertIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const adminModules = [
    {
      id: 'dashboard',
      title: 'Tableau de bord',
      description: 'Vue d\'ensemble des statistiques et performances',
      icon: <ChartBarIcon className="h-6 w-6 text-white" />,
      link: '/admin',
      bgColor: 'bg-indigo-600'
    },
    {
      id: 'products',
      title: 'Produits',
      description: 'Gérer les produits, catégories et stocks',
      icon: <ShoppingBagIcon className="h-6 w-6 text-white" />,
      link: '/admin/products',
      bgColor: 'bg-blue-600'
    },
    {
      id: 'orders',
      title: 'Commandes',
      description: 'Suivre et gérer les commandes',
      icon: <TruckIcon className="h-6 w-6 text-white" />,
      link: '/admin/orders',
      bgColor: 'bg-purple-600'
    },
    {
      id: 'customers',
      title: 'Clients',
      description: 'Gérer les informations clients',
      icon: <UserGroupIcon className="h-6 w-6 text-white" />,
      link: '/admin/customers',
      bgColor: 'bg-green-600'
    },
    {
      id: 'promotions',
      title: 'Promotions',
      description: 'Créer et gérer les codes promo',
      icon: <TicketIcon className="h-6 w-6 text-white" />,
      link: '/admin/promotions',
      bgColor: 'bg-yellow-600'
    },
    {
      id: 'media',
      title: 'Médiathèque',
      description: 'Gérer les images et médias',
      icon: <PhotoIcon className="h-6 w-6 text-white" />,
      link: '/admin/media',
      bgColor: 'bg-pink-600'
    },
    {
      id: 'theme',
      title: 'Thème',
      description: 'Personnaliser l\'apparence du site',
      icon: <PaintBrushIcon className="h-6 w-6 text-white" />,
      link: '/admin/theme',
      bgColor: 'bg-amber-600'
    },
    {
      id: 'marketing',
      title: 'Marketing',
      description: 'Campagnes et statistiques marketing',
      icon: <ArrowTrendingUpIcon className="h-6 w-6 text-white" />,
      link: '/admin/marketing',
      bgColor: 'bg-orange-600'
    },
    {
      id: 'support',
      title: 'Support',
      description: 'Gérer les messages et demandes',
      icon: <DocumentTextIcon className="h-6 w-6 text-white" />,
      link: '/admin/support',
      bgColor: 'bg-teal-600'
    },
    {
      id: 'settings',
      title: 'Paramètres',
      description: 'Configuration générale',
      icon: <Cog6ToothIcon className="h-6 w-6 text-white" />,
      link: '/admin/settings',
      bgColor: 'bg-gray-600'
    }
  ];

  // Fonction pour obtenir le titre du module actif
  const getModuleTitle = (moduleId?: string): string => {
    const module = adminModules.find(m => m.id === moduleId);
    return module ? module.title : "Administration";
  };

  // Si on est sur la page principale de l'admin, afficher le tableau de bord complet
  if (!activeModule || activeModule === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              {/* Carte de statistiques principales */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <CurrencyEuroIcon className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Chiffre d'affaires</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">
                              {stats.totalRevenue.toLocaleString('fr-FR')} €
                            </div>
                            <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                              <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                              <span className="sr-only">Augmentation de</span>
                              {stats.revenueGrowth}%
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <Link href="/admin/reports/sales" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Voir le rapport
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <ShoppingBagIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Commandes</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</div>
                            <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                              <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                              <span className="sr-only">Augmentation de</span>
                              {stats.orderGrowth}%
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <Link href="/admin/orders" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Voir les commandes
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <UserGroupIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Clients</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">{stats.totalCustomers}</div>
                            <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                              <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                              <span className="sr-only">Nouveaux</span>
                              +{stats.newCustomers}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <Link href="/admin/customers" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Voir les clients
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <TagIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Produits</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</div>
                            <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                              <span className="sr-only">Stock faible</span>
                              {stats.lowStockProducts} en stock faible
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <Link href="/admin/products" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Gérer les produits
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Notifications */}
                <div className="lg:col-span-1 bg-white shadow rounded-lg">
                  <div className="p-5 border-b border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Notifications</h3>
                  </div>
                  <div className="p-5 h-96 overflow-y-auto">
                    <ul className="divide-y divide-gray-100">
                      {notifications.length === 0 ? (
                        <li className="py-4 text-center text-gray-500">Aucune notification</li>
                      ) : (
                        notifications.map(notification => (
                          <li key={notification.id} className={`py-3 ${!notification.read ? 'bg-blue-50' : ''}`}>
                            <div className="flex items-start">
                              <div className="flex-shrink-0 pt-0.5">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="ml-3 w-0 flex-1">
                                <p className={`text-sm ${!notification.read ? 'font-medium' : 'text-gray-600'}`}>
                                  {notification.message}
                                </p>
                                <div className="mt-1 flex items-center">
                                  <ClockIcon className="flex-shrink-0 h-4 w-4 text-gray-400" />
                                  <span className="ml-1 text-xs text-gray-500">
                                    il y a {notification.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                    <div className="mt-4 text-center">
                      <button type="button" className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500">
                        Voir toutes les notifications
                      </button>
                    </div>
                  </div>
                </div>

                {/* Commandes récentes */}
                <div className="lg:col-span-2 bg-white shadow rounded-lg">
                  <div className="p-5 border-b border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Commandes récentes</h3>
                  </div>
                  <div className="p-5 h-96 overflow-y-auto">
                    <div className="text-center text-gray-500">
                      Veuillez consulter la page des commandes pour voir les commandes récentes.
                    </div>
                    <div className="mt-4 text-center">
                      <Link href="/admin/orders" className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500">
                        Voir toutes les commandes
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modules d'administration */}
              <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Accès rapides</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {adminModules.map((module) => (
                    <Link
                      key={module.id}
                      href={module.link}
                      className="flex p-4 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                    >
                      <div className={`flex items-center justify-center h-12 w-12 rounded-md ${module.bgColor}`}>
                        {module.icon}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">{module.title}</h4>
                        <p className="text-sm text-gray-500">{module.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    );
  }

  // Sinon, afficher seulement l'en-tête et le contenu passé en enfant
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {getModuleTitle(activeModule)}
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
} 