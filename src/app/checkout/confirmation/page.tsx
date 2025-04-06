'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { isAuthenticated, clearCart } from '@/services/productService';
import toast from 'react-hot-toast';

export default function ConfirmationPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');
  
  useEffect(() => {
    // Vérifier l'authentification
    if (!isAuthenticated()) {
      toast.error('Veuillez vous connecter pour accéder à cette page');
      router.push('/auth/login');
      return;
    }
    
    // Générer un numéro de commande fictif
    const generateOrderNumber = () => {
      const randomNum = Math.floor(Math.random() * 1000000);
      return `CMD-${randomNum.toString().padStart(6, '0')}`;
    };
    
    setOrderNumber(generateOrderNumber());
    
    // Vider le panier après confirmation de la commande
    clearCart();
  }, [router]);
  
  return (
    <div className="bg-gray-50 min-h-screen py-16 flex items-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="py-12 px-6 sm:px-12 text-center">
            <div className="flex justify-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Commande confirmée
            </h1>
            <p className="mt-2 text-base text-gray-600">
              Merci pour votre achat! Votre commande a été traitée avec succès.
            </p>
            
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Détails de la commande
              </h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Numéro de commande:</span>
                <span className="font-medium text-gray-900">{orderNumber}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Statut:</span>
                <span className="font-medium text-green-600">Confirmée</span>
              </div>
            </div>
            
            <div className="mt-8 text-sm text-gray-600">
              <p>Un email de confirmation a été envoyé à votre adresse email.</p>
              <p className="mt-1">Vous pouvez suivre le statut de votre commande dans votre espace client.</p>
            </div>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Voir mes commandes
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continuer vos achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 