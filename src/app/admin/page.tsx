'use client';

import AdminDashboard from './dashboard';
import { HomeIcon, ShoppingBagIcon, TagIcon, ShoppingCartIcon, UserIcon, PhotoIcon, GiftIcon, Cog6ToothIcon, 
         EnvelopeIcon, PaintBrushIcon, MegaphoneIcon, ChatBubbleLeftRightIcon, CreditCardIcon, UserGroupIcon, TicketIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const AdminModules = [
  { 
    name: "Tableau de bord", 
    icon: <HomeIcon className="h-6 w-6" />,
    description: "Vue d'ensemble des statistiques et graphiques", 
    link: "/admin"
  },
  { 
    name: "Produits", 
    icon: <ShoppingBagIcon className="h-6 w-6" />,
    description: "Gérer les produits et les stocks", 
    link: "/admin/products"
  },
  { 
    name: "Catégories", 
    icon: <TagIcon className="h-6 w-6" />,
    description: "Gérer les catégories de produits", 
    link: "/admin/categories"
  },
  { 
    name: "Commandes", 
    icon: <ShoppingCartIcon className="h-6 w-6" />,
    description: "Gérer les commandes et les livraisons", 
    link: "/admin/orders"
  },
  { 
    name: "Clients", 
    icon: <UserGroupIcon className="h-6 w-6" />,
    description: "Gestion des comptes clients", 
    link: "/admin/customers"
  },
  { 
    name: "Médias", 
    icon: <PhotoIcon className="h-6 w-6" />,
    description: "Gérer les images et les fichiers", 
    link: "/admin/media"
  },
  { 
    name: "Promotions", 
    icon: <GiftIcon className="h-6 w-6" />,
    description: "Gérer les codes promo et offres spéciales", 
    link: "/admin/promotions"
  },
  { 
    name: "Méthodes de paiement", 
    icon: <CreditCardIcon className="h-6 w-6" />,
    description: "Configurer les moyens de paiement", 
    link: "/admin/payment-methods"
  },
  { 
    name: "Paramètres", 
    icon: <Cog6ToothIcon className="h-6 w-6" />,
    description: "Configuration générale de la boutique", 
    link: "/admin/settings"
  },
  { 
    name: "Marketing", 
    icon: <MegaphoneIcon className="h-6 w-6" />,
    description: "Gérer les campagnes et newsletters", 
    link: "/admin/marketing"
  },
  { 
    name: "Support", 
    icon: <ChatBubbleLeftRightIcon className="h-6 w-6" />,
    description: "Gérer les tickets et demandes clients", 
    link: "/admin/support"
  },
  { 
    name: "Thème", 
    icon: <PaintBrushIcon className="h-6 w-6" />,
    description: "Personnaliser l'apparence du site", 
    link: "/admin/theme"
  }
];

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Administration</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AdminModules.map((module) => (
          <Link 
            href={module.link} 
            key={module.name}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
          >
            <div className="px-4 py-5 sm:p-6 flex items-start">
              <div className="flex-shrink-0 rounded-md bg-indigo-100 p-3 text-indigo-600">
                {module.icon}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{module.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{module.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 