'use client';

import { useState, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  InboxIcon, 
  UserCircleIcon, 
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowPathIcon,
  ChatBubbleLeftIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  FolderIcon,
  ChevronDownIcon,
  ArrowsPointingOutIcon,
  EnvelopeIcon,
  FaceFrownIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import AdminDashboard from '../dashboard';
import { isAuthenticated } from '@/services/productService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AdminHeader from '@/components/AdminHeader';
import { Toaster } from 'react-hot-toast';

export default function SupportPage() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const authResult = await isAuthenticated();
      if (!authResult) {
        window.location.href = '/auth/login?returnUrl=/admin/support';
        return;
      }
      
      fetchTickets();
    };
    
    checkAuth();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    
    // Simulation d'une récupération d'API
    setTimeout(() => {
      const mockTickets = [
        {
          id: 'ticket-1',
          subject: 'Problème avec ma commande #ORD-1042',
          customer: {
            id: 'cust-1',
            name: 'Marie Dupont',
            email: 'marie.dupont@example.com',
            avatar: '/images/avatars/avatar-1.png'
          },
          status: 'open',
          priority: 'high',
          category: 'order',
          createdAt: '2023-06-15T09:30:00Z',
          updatedAt: '2023-06-15T14:20:00Z',
          messages: [
            {
              id: 'msg-1',
              content: 'Bonjour, je n\'ai toujours pas reçu ma commande #ORD-1042 passée il y a plus de 10 jours. Pouvez-vous me dire où elle en est ?',
              sender: 'customer',
              timestamp: '2023-06-15T09:30:00Z'
            },
            {
              id: 'msg-2',
              content: 'Bonjour Marie, je suis désolé pour ce retard. Je vérifie immédiatement l\'état de votre commande et reviens vers vous.',
              sender: 'agent',
              agent: 'Sophie Martin',
              timestamp: '2023-06-15T10:15:00Z'
            },
            {
              id: 'msg-3',
              content: 'Après vérification, il semble que votre colis ait été retardé chez notre transporteur. Il devrait être livré dans les 48 heures. Je vous envoie le nouveau numéro de suivi par email.',
              sender: 'agent',
              agent: 'Sophie Martin',
              timestamp: '2023-06-15T14:20:00Z'
            }
          ]
        },
        {
          id: 'ticket-2',
          subject: 'Comment retourner un produit ?',
          customer: {
            id: 'cust-2',
            name: 'Jean Lefebvre',
            email: 'jean.lefebvre@example.com',
            avatar: '/images/avatars/avatar-2.png'
          },
          status: 'pending',
          priority: 'medium',
          category: 'return',
          createdAt: '2023-06-14T16:45:00Z',
          updatedAt: '2023-06-15T11:10:00Z',
          messages: [
            {
              id: 'msg-4',
              content: 'Bonjour, j\'ai reçu des sneakers qui ne me conviennent pas (trop petites). Comment faire pour les retourner et être remboursé ?',
              sender: 'customer',
              timestamp: '2023-06-14T16:45:00Z'
            },
            {
              id: 'msg-5',
              content: 'Bonjour Jean, je suis navré que les sneakers ne vous conviennent pas. Vous pouvez effectuer un retour dans les 30 jours suivant la réception. Pour cela, connectez-vous à votre compte et suivez la procédure dans la section "Mes commandes". Avez-vous besoin d\'aide pour cette démarche ?',
              sender: 'agent',
              agent: 'Thomas Durand',
              timestamp: '2023-06-15T09:20:00Z'
            },
            {
              id: 'msg-6',
              content: 'Merci pour votre réponse. J\'ai trouvé la section, mais quand je clique sur "retourner", j\'ai un message d\'erreur. Pouvez-vous m\'aider ?',
              sender: 'customer',
              timestamp: '2023-06-15T11:10:00Z'
            }
          ]
        },
        {
          id: 'ticket-3',
          subject: 'Demande d\'information sur les délais de livraison',
          customer: {
            id: 'cust-3',
            name: 'Antoine Moreau',
            email: 'antoine.moreau@example.com',
            avatar: '/images/avatars/avatar-3.png'
          },
          status: 'closed',
          priority: 'low',
          category: 'shipping',
          createdAt: '2023-06-12T14:30:00Z',
          updatedAt: '2023-06-13T10:45:00Z',
          messages: [
            {
              id: 'msg-7',
              content: 'Bonjour, quels sont vos délais de livraison habituels pour la France métropolitaine ? Merci d\'avance.',
              sender: 'customer',
              timestamp: '2023-06-12T14:30:00Z'
            },
            {
              id: 'msg-8',
              content: 'Bonjour Antoine, nos délais de livraison pour la France métropolitaine sont généralement de 2 à 3 jours ouvrés. Si vous commandez avant 14h, votre colis part le jour même. N\'hésitez pas si vous avez d\'autres questions !',
              sender: 'agent',
              agent: 'Lucie Petit',
              timestamp: '2023-06-13T09:15:00Z'
            },
            {
              id: 'msg-9',
              content: 'Parfait, merci pour ces informations !',
              sender: 'customer',
              timestamp: '2023-06-13T10:30:00Z'
            },
            {
              id: 'msg-10',
              content: 'Avec plaisir, Antoine. Nous restons à votre disposition pour toute autre question.',
              sender: 'agent',
              agent: 'Lucie Petit',
              timestamp: '2023-06-13T10:45:00Z'
            }
          ]
        },
        {
          id: 'ticket-4',
          subject: 'Question sur la disponibilité d\'un produit',
          customer: {
            id: 'cust-4',
            name: 'Claire Dubois',
            email: 'claire.dubois@example.com',
            avatar: '/images/avatars/avatar-4.png'
          },
          status: 'open',
          priority: 'medium',
          category: 'product',
          createdAt: '2023-06-15T08:15:00Z',
          updatedAt: '2023-06-15T08:15:00Z',
          messages: [
            {
              id: 'msg-11',
              content: 'Bonjour, j\'ai vu que les Sneakers Premium en taille 39 sont en rupture de stock. Savez-vous quand elles seront à nouveau disponibles ? Merci',
              sender: 'customer',
              timestamp: '2023-06-15T08:15:00Z'
            }
          ]
        },
        {
          id: 'ticket-5',
          subject: 'Problème technique sur le site',
          customer: {
            id: 'cust-5',
            name: 'Paul Martin',
            email: 'paul.martin@example.com',
            avatar: '/images/avatars/avatar-5.png'
          },
          status: 'in_progress',
          priority: 'high',
          category: 'technical',
          createdAt: '2023-06-14T11:20:00Z',
          updatedAt: '2023-06-15T16:05:00Z',
          messages: [
            {
              id: 'msg-12',
              content: 'Bonjour, je n\'arrive pas à finaliser mon paiement sur votre site. Quand je clique sur "Payer", la page se recharge mais rien ne se passe.',
              sender: 'customer',
              timestamp: '2023-06-14T11:20:00Z'
            },
            {
              id: 'msg-13',
              content: 'Bonjour Paul, je suis désolé pour ce désagrément. Pouvez-vous me préciser quel navigateur et quel appareil vous utilisez ? Avez-vous essayé de vider votre cache ?',
              sender: 'agent',
              agent: 'Marc Leroy',
              timestamp: '2023-06-14T13:45:00Z'
            },
            {
              id: 'msg-14',
              content: 'J\'utilise Chrome sur un PC portable. Je viens d\'essayer de vider le cache comme vous me l\'avez suggéré mais j\'ai toujours le même problème.',
              sender: 'customer',
              timestamp: '2023-06-14T15:30:00Z'
            },
            {
              id: 'msg-15',
              content: 'Merci pour ces précisions. Notre équipe technique est en train d\'examiner le problème. Je vous propose une solution alternative : pouvez-vous essayer d\'utiliser un autre navigateur comme Firefox ou Edge ?',
              sender: 'agent',
              agent: 'Marc Leroy',
              timestamp: '2023-06-15T09:20:00Z'
            },
            {
              id: 'msg-16',
              content: 'J\'ai essayé avec Firefox et ça a fonctionné ! Merci pour votre aide.',
              sender: 'customer',
              timestamp: '2023-06-15T16:05:00Z'
            }
          ]
        }
      ];
      
      setTickets(mockTickets);
      setLoading(false);
    }, 600);
  };

  const handleTicketClick = (ticket: any) => {
    setSelectedTicket(ticket);
  };

  const goToTicketDetail = (ticketId: string) => {
    router.push(`/admin/support/tickets/${ticketId}`);
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyText.trim()) return;
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      content: replyText,
      sender: 'agent',
      agent: 'Admin',
      timestamp: new Date().toISOString()
    };
    
    const updatedTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage],
      updatedAt: new Date().toISOString()
    };
    
    setSelectedTicket(updatedTicket);
    
    // Update ticket in the list
    setTickets(tickets.map(ticket => 
      ticket.id === selectedTicket.id ? updatedTicket : ticket
    ));
    
    setReplyText('');
  };

  const updateTicketStatus = (status: string) => {
    if (!selectedTicket) return;
    
    const updatedTicket = {
      ...selectedTicket,
      status,
      updatedAt: new Date().toISOString()
    };
    
    setSelectedTicket(updatedTicket);
    
    // Update ticket in the list
    setTickets(tickets.map(ticket => 
      ticket.id === selectedTicket.id ? updatedTicket : ticket
    ));
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        ticket.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        ticket.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesCategory = selectedCategory === 'all' || ticket.category === selectedCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ouvert</span>;
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">En attente</span>;
      case 'in_progress':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">En cours</span>;
      case 'closed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Résolu</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Haute</span>;
      case 'medium':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">Moyenne</span>;
      case 'low':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Basse</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{priority}</span>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'order':
        return <FolderIcon className="h-5 w-5 text-indigo-500" />;
      case 'return':
        return <FolderIcon className="h-5 w-5 text-green-500" />;
      case 'shipping':
        return <FolderIcon className="h-5 w-5 text-blue-500" />;
      case 'product':
        return <FolderIcon className="h-5 w-5 text-purple-500" />;
      case 'technical':
        return <FolderIcon className="h-5 w-5 text-red-500" />;
      default:
        return <FolderIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'order': return 'Commande';
      case 'return': return 'Retour';
      case 'shipping': return 'Livraison';
      case 'product': return 'Produit';
      case 'technical': return 'Technique';
      default: return category;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <AdminHeader 
        title="Support client"
        actionButton={
          <div className="flex space-x-2">
            <button
              onClick={fetchTickets}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Rafraîchir
            </button>
          </div>
        }
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button 
                className="py-4 px-6 text-center border-b-2 border-indigo-500 font-medium text-sm text-indigo-600"
              >
                <div className="flex items-center">
                  <InboxIcon className="h-5 w-5 mr-2" />
                  Tickets
                </div>
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">Gestion des tickets</h2>
              
              <div className="w-full sm:w-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="w-full sm:w-64 pr-10 pl-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <select
                    className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="open">Ouverts</option>
                    <option value="pending">En attente</option>
                    <option value="in_progress">En cours</option>
                    <option value="closed">Résolus</option>
                  </select>
                  
                  <select
                    className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">Toutes catégories</option>
                    <option value="order">Commandes</option>
                    <option value="return">Retours</option>
                    <option value="shipping">Livraison</option>
                    <option value="product">Produits</option>
                    <option value="technical">Technique</option>
                  </select>
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-16">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Aucun ticket trouvé</h3>
                <p className="text-gray-500">Il n'y a pas de tickets correspondant à vos critères.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID / Sujet
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priorité
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tickets
                      .filter((ticket) => {
                        // Filtrer par statut
                        if (statusFilter !== 'all' && ticket.status !== statusFilter) {
                          return false;
                        }
                        // Filtrer par catégorie
                        if (selectedCategory !== 'all' && ticket.category !== selectedCategory) {
                          return false;
                        }
                        // Filtrer par recherche
                        if (searchQuery) {
                          const query = searchQuery.toLowerCase();
                          return (
                            ticket.subject.toLowerCase().includes(query) ||
                            ticket.customer.name.toLowerCase().includes(query) ||
                            ticket.customer.email.toLowerCase().includes(query) ||
                            ticket.id.toLowerCase().includes(query)
                          );
                        }
                        return true;
                      })
                      .map((ticket) => (
                        <tr 
                          key={ticket.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => goToTicketDetail(ticket.id)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-100 rounded-full">
                                {getCategoryIcon(ticket.category)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {ticket.id}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {ticket.subject}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <img className="h-8 w-8 rounded-full" src={ticket.customer.avatar || 'https://via.placeholder.com/40'} alt="" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {ticket.customer.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {ticket.customer.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(ticket.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getPriorityBadge(ticket.priority)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getCategoryLabel(ticket.category)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(ticket.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/admin/support/tickets/${ticket.id}`} className="text-indigo-600 hover:text-indigo-900 mr-3" onClick={(e) => e.stopPropagation()}>
                              Détails
                            </Link>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        {/* Modal pour le ticket sélectionné - Déprécié, remplacé par une page dédiée */}
        {false && selectedTicket && (
          <div>
            {/* L'ancien contenu modal a été déplacé vers la page détaillée des tickets */}
          </div>
        )}
      </main>
    </div>
  );
} 