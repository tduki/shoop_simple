'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  TruckIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  BanknotesIcon,
  PencilIcon,
  CheckIcon,
  PrinterIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { isAuthenticated } from '@/services/productService';

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

export default function OrderDetail() {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [currentStatus, setCurrentStatus] = useState<OrderStatus | ''>('');
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const orderId = params.id as string;

  useEffect(() => {
    const checkAuth = async () => {
      const authResult = await isAuthenticated();
      if (!authResult) {
        router.push(`/auth/login?returnUrl=/admin/orders/${orderId}`);
        return;
      }
      
      fetchOrderDetails();
    };

    checkAuth();
  }, [router, orderId]);

  const fetchOrderDetails = () => {
    setIsLoading(true);
    
    // Simulation d'une récupération d'API
    setTimeout(() => {
      // Générer une commande fictive
      const mockOrder: Order = {
        id: orderId,
        customerId: `CUST-${20000 + Math.floor(Math.random() * 100)}`,
        customerName: 'Thomas Martin',
        customerEmail: 'thomas.martin@example.com',
        date: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)).toISOString(),
        status: ['pending', 'paid', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 5)] as OrderStatus,
        paymentMethod: 'credit_card',
        paymentStatus: 'paid',
        shippingAddress: {
          fullName: 'Thomas Martin',
          address: '42 Rue des Roses',
          city: 'Paris',
          postalCode: '75008',
          country: 'France',
          phone: '0612345678'
        },
        items: [
          {
            id: `ITEM-1`,
            productId: 'PROD-101',
            productName: 'Sneakers Classic',
            price: 120,
            quantity: 1,
            size: '42',
            color: 'Noir',
            total: 120
          },
          {
            id: `ITEM-2`,
            productId: 'PROD-205',
            productName: 'T-shirt Premium',
            price: 40,
            quantity: 2,
            size: 'L',
            color: 'Blanc',
            total: 80
          }
        ],
        subtotal: 200,
        shipping: 5.90,
        tax: 40,
        discount: 20,
        total: 225.90,
        notes: 'Livraison à l\'étage, merci d\'appeler avant de livrer.',
        trackingNumber: undefined
      };
      
      // Si le statut est shipped ou delivered, ajouter un numéro de suivi
      if (mockOrder.status === 'shipped' || mockOrder.status === 'delivered') {
        mockOrder.trackingNumber = `TR${Math.floor(Math.random() * 1000000)}`;
      }
      
      setOrder(mockOrder);
      setCurrentStatus(mockOrder.status);
      setTrackingNumber(mockOrder.trackingNumber || '');
      setIsLoading(false);
    }, 800);
  };

  const handleStatusUpdate = () => {
    if (!currentStatus) return;
    
    setIsUpdating(true);
    
    // Simuler un délai de mise à jour
    setTimeout(() => {
      if (order) {
        const updatedOrder = { 
          ...order, 
          status: currentStatus as OrderStatus,
          trackingNumber: currentStatus === 'shipped' || currentStatus === 'delivered' 
            ? (trackingNumber || `TR${Math.floor(Math.random() * 1000000)}`) 
            : undefined
        };
        
        setOrder(updatedOrder);
        setTrackingNumber(updatedOrder.trackingNumber || '');
        setShowStatusForm(false);
        setSuccessMessage('Statut de la commande mis à jour avec succès !');
        
        // Masquer le message après 3 secondes
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
      
      setIsUpdating(false);
    }, 800);
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, { color: string, bgColor: string, label: string }> = {
      pending: { color: 'text-yellow-800', bgColor: 'bg-yellow-100', label: 'En attente' },
      paid: { color: 'text-blue-800', bgColor: 'bg-blue-100', label: 'Payée' },
      processing: { color: 'text-indigo-800', bgColor: 'bg-indigo-100', label: 'En préparation' },
      shipped: { color: 'text-purple-800', bgColor: 'bg-purple-100', label: 'Expédiée' },
      delivered: { color: 'text-green-800', bgColor: 'bg-green-100', label: 'Livrée' },
      cancelled: { color: 'text-red-800', bgColor: 'bg-red-100', label: 'Annulée' },
      refunded: { color: 'text-gray-800', bgColor: 'bg-gray-100', label: 'Remboursée' }
    };
    
    return (
      <span className={`px-3 py-1 text-sm rounded-full ${statusMap[status].bgColor} ${statusMap[status].color}`}>
        {statusMap[status].label}
      </span>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const methodMap: Record<string, string> = {
      credit_card: 'Carte bancaire',
      paypal: 'PayPal',
      bank_transfer: 'Virement bancaire'
    };
    
    return methodMap[method] || method;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Commande non trouvée</h1>
          <p className="text-gray-700 mb-6">La commande demandée n'existe pas ou a été supprimée.</p>
          <Link href="/admin/orders">
            <span className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              <ArrowLeftIcon className="h-5 w-5 mr-2" /> Retour aux commandes
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/admin/orders">
                <span className="mr-4 inline-flex items-center text-indigo-600 hover:text-indigo-800">
                  <ArrowLeftIcon className="h-5 w-5" />
                </span>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Commande {order.id}</h1>
              <div className="ml-4">{getStatusBadge(order.status)}</div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <PrinterIcon className="mr-2 h-5 w-5" />
                Imprimer
              </button>
              <button
                onClick={() => setShowStatusForm(!showStatusForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PencilIcon className="mr-2 h-5 w-5" />
                Modifier le statut
              </button>
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
        
        {/* Formulaire de mise à jour du statut */}
        {showStatusForm && (
          <div className="bg-white shadow rounded-lg mb-6 p-6">
            <h2 className="text-lg font-medium mb-4">Mettre à jour le statut de la commande</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="order-status" className="block text-sm font-medium text-gray-700 mb-1">
                  Statut de la commande
                </label>
                <select
                  id="order-status"
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value as OrderStatus)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Sélectionner un statut</option>
                  <option value="pending">En attente</option>
                  <option value="paid">Payée</option>
                  <option value="processing">En préparation</option>
                  <option value="shipped">Expédiée</option>
                  <option value="delivered">Livrée</option>
                  <option value="cancelled">Annulée</option>
                  <option value="refunded">Remboursée</option>
                </select>
              </div>
              
              {(currentStatus === 'shipped' || currentStatus === 'delivered') && (
                <div>
                  <label htmlFor="tracking-number" className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de suivi
                  </label>
                  <input
                    type="text"
                    id="tracking-number"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Ex: TR123456"
                  />
                </div>
              )}
            </div>
            
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowStatusForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleStatusUpdate}
                disabled={!currentStatus || isUpdating}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300"
              >
                {isUpdating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mise à jour...
                  </>
                ) : (
                  'Mettre à jour'
                )}
              </button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Informations de commande */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Informations</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Date de commande
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(order.date).toLocaleDateString('fr-FR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Méthode de paiement
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {getPaymentMethodLabel(order.paymentMethod)}
                  </dd>
                </div>
                
                {order.trackingNumber && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <TruckIcon className="h-5 w-5 text-gray-400 mr-2" />
                      Numéro de suivi
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {order.trackingNumber}
                    </dd>
                  </div>
                )}
                
                {order.notes && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Notes</dt>
                    <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">
                      {order.notes}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
          
          {/* Client */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Client</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-gray-500" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">{order.customerName}</h4>
                  <p className="text-sm text-gray-500">Client ID: {order.customerId}</p>
                </div>
              </div>
              
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a href={`mailto:${order.customerEmail}`} className="text-indigo-600 hover:text-indigo-500">
                      {order.customerEmail}
                    </a>
                  </dd>
                </div>
                
                {order.shippingAddress.phone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                      Téléphone
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <a href={`tel:${order.shippingAddress.phone}`} className="text-indigo-600 hover:text-indigo-500">
                        {order.shippingAddress.phone}
                      </a>
                    </dd>
                  </div>
                )}
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Adresse de livraison
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <address className="not-italic">
                      {order.shippingAddress.fullName}<br />
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.postalCode} {order.shippingAddress.city}<br />
                      {order.shippingAddress.country}
                    </address>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Résumé financier */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Résumé</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="space-y-3">
                <div className="flex justify-between py-1">
                  <dt className="text-sm text-gray-500">Sous-total</dt>
                  <dd className="text-sm font-medium text-gray-900">{order.subtotal.toFixed(2)} €</dd>
                </div>
                
                {order.discount && (
                  <div className="flex justify-between py-1">
                    <dt className="text-sm text-gray-500">Remise</dt>
                    <dd className="text-sm font-medium text-red-600">-{order.discount.toFixed(2)} €</dd>
                  </div>
                )}
                
                <div className="flex justify-between py-1">
                  <dt className="text-sm text-gray-500">Livraison</dt>
                  <dd className="text-sm font-medium text-gray-900">{order.shipping.toFixed(2)} €</dd>
                </div>
                
                <div className="flex justify-between py-1">
                  <dt className="text-sm text-gray-500">TVA (20%)</dt>
                  <dd className="text-sm font-medium text-gray-900">{order.tax.toFixed(2)} €</dd>
                </div>
                
                <div className="flex justify-between py-3 border-t border-gray-200 font-medium">
                  <dt className="text-base text-gray-900">Total</dt>
                  <dd className="text-base text-gray-900">{order.total.toFixed(2)} €</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        
        {/* Articles commandés */}
        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Articles commandés</h3>
            <span className="text-sm text-gray-500">{order.items.length} article(s)</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix unitaire
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                          <span className="text-gray-500 text-xs">{item.productId}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                          <div className="text-sm text-gray-500">
                            {item.size && <span>Taille: {item.size}</span>}
                            {item.size && item.color && <span> | </span>}
                            {item.color && <span>Couleur: {item.color}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.price.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.total.toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
} 