'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  UserCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PaperAirplaneIcon,
  InboxIcon,
  TagIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import AdminDashboard from '@/app/admin/dashboard';
import { isAuthenticated } from '@/services/productService';

interface Message {
  id: string;
  content: string;
  sender: 'customer' | 'agent';
  agent?: string;
  timestamp: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface Ticket {
  id: string;
  subject: string;
  customer: Customer;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authResult = await isAuthenticated();
      if (!authResult) {
        router.push('/auth/login?returnUrl=/admin/support/tickets/' + params.id);
        return;
      }
      
      fetchTicket(params.id);
    };
    
    checkAuth();
  }, [params.id, router]);

  const fetchTicket = async (ticketId: string) => {
    setLoading(true);
    
    // Simulation d'une récupération d'API
    setTimeout(() => {
      // Créer un ticket de démonstration basé sur l'ID demandé
      if (ticketId === 'ticket-1' || ticketId === 'ticket-2' || ticketId === 'ticket-3' || ticketId === 'ticket-4' || ticketId === 'ticket-5') {
        const mockTicket: Ticket = {
          id: ticketId,
          subject: ticketId === 'ticket-1' ? 'Problème avec ma commande #ORD-1042' :
                  ticketId === 'ticket-2' ? 'Comment retourner un produit ?' :
                  ticketId === 'ticket-3' ? 'Demande d\'information sur les délais de livraison' :
                  ticketId === 'ticket-4' ? 'Question sur la disponibilité d\'un produit' :
                  'Problème technique sur le site',
          customer: {
            id: 'cust-' + ticketId.split('-')[1],
            name: ['Marie Dupont', 'Jean Lefebvre', 'Antoine Moreau', 'Claire Dubois', 'Paul Martin'][parseInt(ticketId.split('-')[1]) - 1],
            email: ['marie.dupont@example.com', 'jean.lefebvre@example.com', 'antoine.moreau@example.com', 'claire.dubois@example.com', 'paul.martin@example.com'][parseInt(ticketId.split('-')[1]) - 1],
            avatar: `/images/avatars/avatar-${ticketId.split('-')[1]}.png`
          },
          status: ticketId === 'ticket-1' ? 'open' :
                  ticketId === 'ticket-2' ? 'pending' :
                  ticketId === 'ticket-3' ? 'closed' :
                  ticketId === 'ticket-4' ? 'open' :
                  'in_progress',
          priority: ticketId === 'ticket-1' ? 'high' :
                    ticketId === 'ticket-2' ? 'medium' :
                    ticketId === 'ticket-3' ? 'low' :
                    ticketId === 'ticket-4' ? 'medium' :
                    'high',
          category: ticketId === 'ticket-1' ? 'order' :
                    ticketId === 'ticket-2' ? 'return' :
                    ticketId === 'ticket-3' ? 'shipping' :
                    ticketId === 'ticket-4' ? 'product' :
                    'technical',
          createdAt: '2023-06-15T09:30:00Z',
          updatedAt: '2023-06-15T14:20:00Z',
          messages: generateMessagesForTicket(ticketId),
        };
        
        setTicket(mockTicket);
        setLoading(false);
      } else {
        setNotFound(true);
        setLoading(false);
      }
    }, 600);
  };
  
  // Helper pour générer des messages de démo selon l'ID du ticket
  const generateMessagesForTicket = (ticketId: string): Message[] => {
    switch (ticketId) {
      case 'ticket-1':
        return [
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
        ];
      case 'ticket-2':
        return [
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
        ];
      // Ajouter d'autres cas pour les autres tickets...
      default:
        return [
          {
            id: 'msg-default',
            content: 'Bonjour, j\'ai une question concernant votre service.',
            sender: 'customer',
            timestamp: '2023-06-15T09:30:00Z'
          }
        ];
    }
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyText.trim() || !ticket) return;
    
    // Créer un nouveau message
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: replyText,
      sender: 'agent',
      agent: 'Agent Support',
      timestamp: new Date().toISOString()
    };
    
    // Mettre à jour le ticket avec le nouveau message
    setTicket({
      ...ticket,
      messages: [...ticket.messages, newMessage],
      updatedAt: new Date().toISOString()
    });
    
    // Réinitialiser le champ de réponse
    setReplyText('');
  };

  const updateTicketStatus = (status: string) => {
    if (!ticket) return;
    
    setTicket({
      ...ticket,
      status: status,
      updatedAt: new Date().toISOString()
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Ouvert</span>;
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">En attente</span>;
      case 'in_progress':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">En cours</span>;
      case 'closed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Résolu</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Haute</span>;
      case 'medium':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Moyenne</span>;
      case 'low':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Basse</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{priority}</span>;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'order':
        return 'Commande';
      case 'return':
        return 'Retour';
      case 'shipping':
        return 'Livraison';
      case 'product':
        return 'Produit';
      case 'technical':
        return 'Technique';
      default:
        return category;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <AdminDashboard activeModule="support">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </AdminDashboard>
    );
  }

  if (notFound) {
    return (
      <AdminDashboard activeModule="support">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <InboxIcon className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">Ticket non trouvé</h3>
            <p className="text-gray-500 mb-6">Le ticket demandé n'existe pas ou a été supprimé.</p>
            <Link href="/admin/support" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Retour à la liste des tickets
            </Link>
          </div>
        </div>
      </AdminDashboard>
    );
  }

  if (!ticket) {
    return (
      <AdminDashboard activeModule="support">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <p>Une erreur est survenue lors du chargement des données du ticket.</p>
          </div>
        </div>
      </AdminDashboard>
    );
  }

  return (
    <AdminDashboard activeModule="support">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/admin/support" className="mr-4 hover:text-indigo-500">
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <h2 className="text-xl font-semibold text-gray-900">{ticket.subject}</h2>
            </div>
            <div className="flex space-x-2">
              {getStatusBadge(ticket.status)}
              {getPriorityBadge(ticket.priority)}
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                {getCategoryLabel(ticket.category)}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between text-sm text-gray-500">
            <div className="flex items-center mb-2 sm:mb-0">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>Créé le {formatDate(ticket.createdAt)}</span>
              <span className="mx-2">•</span>
              <span>Mis à jour le {formatDate(ticket.updatedAt)}</span>
            </div>
            <div className="flex sm:justify-end space-x-2">
              <button
                onClick={() => updateTicketStatus('in_progress')}
                className={`px-3 py-1 rounded-md text-xs font-medium ${ticket.status === 'in_progress' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 hover:bg-purple-100 hover:text-purple-800'}`}
              >
                En cours
              </button>
              <button
                onClick={() => updateTicketStatus('pending')}
                className={`px-3 py-1 rounded-md text-xs font-medium ${ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 hover:bg-yellow-100 hover:text-yellow-800'}`}
              >
                En attente
              </button>
              <button
                onClick={() => updateTicketStatus('closed')}
                className={`px-3 py-1 rounded-md text-xs font-medium ${ticket.status === 'closed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 hover:bg-green-100 hover:text-green-800'}`}
              >
                Résolu
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src={ticket.customer.avatar || 'https://via.placeholder.com/40'}
                alt={ticket.customer.name}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-medium text-gray-900">
                {ticket.customer.name}
              </p>
              <p className="text-sm text-gray-500">
                {ticket.customer.email}
              </p>
            </div>
            <div>
              <Link href={`/admin/customers/${ticket.customer.id}`} className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <UserCircleIcon className="h-4 w-4 mr-1" />
                Profil client
              </Link>
            </div>
          </div>
        </div>

        <div className="px-6 pt-6 pb-3">
          <h3 className="text-base font-medium text-gray-900">Conversation</h3>
        </div>

        <div className="px-6 pb-6">
          <div className="space-y-6">
            {ticket.messages.map((message, index) => (
              <div key={message.id} className={`flex ${message.sender === 'customer' ? '' : 'justify-end'}`}>
                <div className={`flex max-w-lg ${message.sender === 'customer' ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="flex-shrink-0">
                    {message.sender === 'customer' ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={ticket.customer.avatar || 'https://via.placeholder.com/40'}
                        alt={ticket.customer.name}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <UserCircleIcon className="h-6 w-6 text-indigo-600" />
                      </div>
                    )}
                  </div>
                  <div className={`ml-3 mr-3 ${message.sender === 'customer' ? 'mr-12' : 'ml-12'}`}>
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">
                        {message.sender === 'customer' ? ticket.customer.name : message.agent || 'Support Agent'}
                      </span>
                    </div>
                    <div className={`mt-1 p-3 rounded-lg ${message.sender === 'customer' ? 'bg-gray-100' : 'bg-indigo-50'}`}>
                      <p className="text-sm text-gray-700">{message.content}</p>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {formatDate(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {ticket.status !== 'closed' && (
          <div className="px-6 pb-6">
            <form onSubmit={handleReplySubmit}>
              <div className="mt-1">
                <textarea
                  id="reply"
                  name="reply"
                  rows={4}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Tapez votre réponse..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={!replyText.trim()}
                >
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminDashboard>
  );
} 