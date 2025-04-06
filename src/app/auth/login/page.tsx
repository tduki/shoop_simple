'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@streeter.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simuler un délai de chargement pour une meilleure UX
    setTimeout(() => {
      // Vérification des identifiants admin spécifiques (pour la démo)
      if (email === 'admin@streeter.com' && password === 'admin123') {
        // Stocker l'état de connexion
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
          email: 'admin@streeter.com',
          firstName: 'Admin',
          lastName: 'Streeter',
          isAdmin: true
        }));
        
        setSuccess(true);
        
        // Rediriger après un court délai
        setTimeout(() => {
          const redirectPath = localStorage.getItem('redirectAfterLogin');
          if (redirectPath && redirectPath !== '/auth/login') {
            localStorage.removeItem('redirectAfterLogin');
            router.push(redirectPath);
          } else {
            router.push('/dashboard');
          }
        }, 1500);
        
        setLoading(false);
        return;
      }
      
      // Vérifier dans les utilisateurs enregistrés
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((user: any) => user.email === email && user.password === password);
      
      if (user) {
        // Stocker l'état de connexion
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('isAdmin', user.isAdmin ? 'true' : 'false');
        localStorage.setItem('currentUser', JSON.stringify({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin
        }));
        
        setSuccess(true);
        
        // Rediriger après un court délai
        setTimeout(() => {
          const redirectPath = localStorage.getItem('redirectAfterLogin');
          if (redirectPath && redirectPath !== '/auth/login') {
            localStorage.removeItem('redirectAfterLogin');
            router.push(redirectPath);
          } else if (user.isAdmin) {
            router.push('/dashboard');
          } else {
            router.push('/');
          }
        }, 1500);
      } else {
        setError('Adresse e-mail ou mot de passe incorrect.');
      }
      
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 py-6 px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Streeter</h2>
        </div>
        
        <div className="relative py-6">
          <div className="absolute left-1/2 -top-10 transform -translate-x-1/2 bg-white rounded-full p-4 shadow-md">
            <div className="bg-indigo-500 rounded-full h-12 w-12 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="px-6 pb-8">
          <h3 className="text-xl font-bold text-center text-gray-800 mb-5">Connexion</h3>
          
          {success ? (
            <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 text-center">
              Connexion réussie! Redirection en cours...
              <div className="loader mx-auto mt-2"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Se souvenir de moi
                  </label>
                </div>
                
                <div className="text-sm">
                  <Link
                    href="/auth/forgot-password"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connexion en cours...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </button>
              </div>
            </form>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                S'inscrire
              </Link>
            </p>
          </div>
          
          {/* Demo credentials */}
          <div className="mt-6 text-center text-xs text-gray-500 border-t border-gray-200 pt-4">
            <p className="font-medium mb-1">Identifiants de démonstration :</p>
            <p>Admin : admin@streeter.com / admin123</p>
            <p>Utilisateur : anis@gmail.com / anis</p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .loader {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 2px solid #fff;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 