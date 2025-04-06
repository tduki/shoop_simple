'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowTrendingUpIcon, 
  EnvelopeIcon, 
  MegaphoneIcon, 
  ChartBarIcon,
  RssIcon,
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  ArrowsPointingOutIcon,
  CursorArrowRippleIcon,
  TagIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import AdminDashboard from '../dashboard';
import { isAuthenticated } from '@/services/productService';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/AdminHeader';
import { Toaster } from 'react-hot-toast';

// Types
interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  audience: string;
  startDate: string;
  endDate: string;
  budget: number;
  performance: {
    sent?: number;
    opened?: number;
    impressions?: number;
    clicks?: number;
    clicked?: number;
    converted?: number;
    engagement?: number;
    cost?: number;
  };
}

interface Newsletter {
  id: string;
  title: string;
  subject: string;
  audience: string;
  status: string;
  sentDate: string;
  openRate: number;
  clickRate: number;
}

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<Campaign | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const authResult = await isAuthenticated();
      if (!authResult) {
        router.push('/auth/login?returnUrl=/admin/marketing');
        return;
      }
      
      fetchData();
    };
    
    checkAuth();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'campaigns') {
      fetchCampaigns();
    } else if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchCampaigns = async () => {
    // Simulation d'une récupération d'API
    setTimeout(() => {
      const mockCampaigns = [
        {
          id: 'camp-1',
          name: 'Soldes d\'été',
          type: 'email',
          status: 'active',
          audience: 'Tous les clients',
          startDate: '2023-06-01',
          endDate: '2023-06-30',
          budget: 500,
          performance: {
            sent: 2500,
            opened: 1245,
            clicked: 487,
            converted: 93
          }
        },
        {
          id: 'camp-2',
          name: 'Lancement Sneakers Premium',
          type: 'social',
          status: 'scheduled',
          audience: 'Clients premium',
          startDate: '2023-07-15',
          endDate: '2023-08-15',
          budget: 1200,
          performance: {
            impressions: 15000,
            engagement: 2800,
            clicks: 850,
            converted: 120
          }
        },
        {
          id: 'camp-3',
          name: 'Promotion Flash Weekend',
          type: 'banner',
          status: 'completed',
          audience: 'Visiteurs du site',
          startDate: '2023-05-12',
          endDate: '2023-05-14',
          budget: 300,
          performance: {
            impressions: 8500,
            clicks: 720,
            converted: 65
          }
        },
        {
          id: 'camp-4',
          name: 'Newsletter Mensuelle',
          type: 'email',
          status: 'active',
          audience: 'Abonnés newsletter',
          startDate: '2023-06-01',
          endDate: '2023-12-31',
          budget: 100,
          performance: {
            sent: 1800,
            opened: 950,
            clicked: 320,
            converted: 48
          }
        },
        {
          id: 'camp-5',
          name: 'Campagne Google Ads',
          type: 'ads',
          status: 'active',
          audience: 'Prospects',
          startDate: '2023-05-01',
          endDate: '2023-07-31',
          budget: 2000,
          performance: {
            impressions: 45000,
            clicks: 3200,
            cost: 1250,
            converted: 230
          }
        }
      ];
      
      setCampaigns(mockCampaigns);
      setLoading(false);
    }, 600);
  };

  const fetchAnalytics = async () => {
    // Simulation d'une récupération d'API
    setTimeout(() => {
      const mockAnalytics = {
        trafficSources: [
          { source: 'Direct', visits: 15420, percentage: 32 },
          { source: 'Organic Search', visits: 12850, percentage: 27 },
          { source: 'Social Media', visits: 8640, percentage: 18 },
          { source: 'Referral', visits: 5720, percentage: 12 },
          { source: 'Email', visits: 3290, percentage: 7 },
          { source: 'Paid Search', visits: 2110, percentage: 4 }
        ],
        conversionRate: 3.2,
        averageSessionTime: '2m 45s',
        bounceRate: 42.5,
        monthlyVisits: [
          { month: 'Jan', visits: 12500 },
          { month: 'Feb', visits: 13200 },
          { month: 'Mar', visits: 14500 },
          { month: 'Apr', visits: 15800 },
          { month: 'May', visits: 18200 },
          { month: 'Jun', visits: 17500 }
        ],
        topReferrers: [
          { name: 'instagram.com', visits: 3240, conversionRate: 2.8 },
          { name: 'facebook.com', visits: 2850, conversionRate: 2.2 },
          { name: 'google.com', visits: 2420, conversionRate: 3.5 },
          { name: 'twitter.com', visits: 1920, conversionRate: 1.8 },
          { name: 'pinterest.com', visits: 1250, conversionRate: 2.4 }
        ],
        deviceBreakdown: {
          mobile: 58,
          desktop: 34,
          tablet: 8
        }
      };
      
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 600);
  };

  const openCreateModal = () => {
    setCurrentItem(null);
    setShowModal(true);
  };

  const openEditModal = (campaign: any) => {
    setCurrentItem(campaign);
    setShowModal(true);
  };

  const deleteCampaign = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette campagne ?')) {
      setCampaigns(campaigns.filter(campaign => campaign.id !== id));
    }
  };

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <EnvelopeIcon className="h-5 w-5 text-blue-500" />;
      case 'social':
        return <RssIcon className="h-5 w-5 text-purple-500" />;
      case 'banner':
        return <MegaphoneIcon className="h-5 w-5 text-yellow-500" />;
      case 'ads':
        return <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />;
      default:
        return <MegaphoneIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCampaignStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>;
      case 'scheduled':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Planifiée</span>;
      case 'completed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Terminée</span>;
      case 'paused':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">En pause</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <AdminHeader 
        title="Marketing"
        actionButton={
          activeTab === 'campaigns' ? (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nouvelle campagne
            </button>
          ) : activeTab === 'newsletters' ? (
            <button
              onClick={() => setShowNewsletterModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nouvelle newsletter
            </button>
          ) : null
        }
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button 
                onClick={() => setActiveTab('campaigns')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'campaigns'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <MegaphoneIcon className="h-5 w-5 mr-2" />
                  Campagnes
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('newsletters')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'newsletters'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 mr-2" />
                  Newsletters
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('statistics')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'statistics'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Statistiques
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <>
                {activeTab === 'campaigns' && (
                  <div>
                    <div className="mb-6 flex justify-between items-center">
                      <h2 className="text-xl font-bold text-gray-900">Campagnes Marketing</h2>
                      <button 
                        onClick={openCreateModal}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center"
                      >
                        <PlusIcon className="h-5 w-5 mr-1" />
                        Nouvelle campagne
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Campagne
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Statut
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Période
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Budget
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Performance
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {campaigns.map((campaign) => (
                            <tr key={campaign.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">{campaign.name}</div>
                                <div className="text-sm text-gray-500">{campaign.audience}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {getCampaignTypeIcon(campaign.type)}
                                  <span className="ml-2 text-sm text-gray-900">
                                    {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getCampaignStatusBadge(campaign.status)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {campaign.startDate} - {campaign.endDate}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {campaign.budget} €
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {campaign.type === 'email' ? (
                                  <div className="text-sm text-gray-900">
                                    <div>Envoyés: {campaign.performance.sent}</div>
                                    <div>Ouvertures: {campaign.performance.opened} ({Math.round(campaign.performance.opened / campaign.performance.sent * 100)}%)</div>
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-900">
                                    <div>Impressions: {campaign.performance.impressions || '-'}</div>
                                    <div>Clics: {campaign.performance.clicks || '-'}</div>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center space-x-2">
                                  <button 
                                    onClick={() => openEditModal(campaign)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    <PencilIcon className="h-5 w-5" />
                                  </button>
                                  <button 
                                    onClick={() => deleteCampaign(campaign.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <TrashIcon className="h-5 w-5" />
                                  </button>
                                  <Link 
                                    href={`/admin/marketing/campaigns/${campaign.id}`}
                                    className="text-gray-600 hover:text-gray-900"
                                  >
                                    <ArrowsPointingOutIcon className="h-5 w-5" />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'newsletters' && (
                  <div>
                    {/* ... existing newsletters tab content ... */}
                  </div>
                )}

                {activeTab === 'statistics' && (
                  <div>
                    {/* ... existing statistics tab content ... */}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {currentItem ? 'Modifier la campagne' : 'Créer une campagne'}
                </h3>
                <div className="mt-4 space-y-4">
                  {/* Formulaire à implémenter */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
                    <input 
                      type="text" 
                      name="name" 
                      id="name" 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      defaultValue={currentItem?.name || ''}
                    />
                  </div>
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                    <select 
                      name="type" 
                      id="type" 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      defaultValue={currentItem?.type || 'email'}
                    >
                      <option value="email">Email</option>
                      <option value="social">Réseaux sociaux</option>
                      <option value="banner">Bannières</option>
                      <option value="ads">Publicités</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Date de début</label>
                      <input 
                        type="date" 
                        name="startDate" 
                        id="startDate" 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        defaultValue={currentItem?.startDate || ''}
                      />
                    </div>
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Date de fin</label>
                      <input 
                        type="date" 
                        name="endDate" 
                        id="endDate" 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        defaultValue={currentItem?.endDate || ''}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  {currentItem ? 'Enregistrer' : 'Créer'}
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
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