'use client';

import React from 'react';
import Link from 'next/link';
import { FaInstagram, FaTwitter, FaFacebook, FaPinterest } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Streeter</h3>
            <p className="text-gray-300 text-sm">
              Boutique de mode située à Perpignan, spécialisée dans les vêtements et sneakers de marque.
            </p>
            <div className="mt-6 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaPinterest className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                  Tous les produits
                </Link>
              </li>
              <li>
                <Link href="/products?category=sneakers" className="text-gray-300 hover:text-white transition-colors">
                  Sneakers
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  Qui sommes-nous
                </Link>
              </li>
              <li>
                <Link href="/promotions" className="text-gray-300 hover:text-white transition-colors">
                  Réductions
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Service client</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/faq#livraison" className="text-gray-300 hover:text-white transition-colors">
                  Livraison
                </Link>
              </li>
              <li>
                <Link href="/faq#retours" className="text-gray-300 hover:text-white transition-colors">
                  Retours
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-300 text-sm mb-4">
              Inscrivez-vous pour recevoir nos actualités et promotions.
            </p>
            <form className="mt-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-l focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-gray-900 rounded-r font-medium hover:bg-gray-200 transition-colors"
                >
                  S'inscrire
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Streeter. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
} 