'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { searchProducts, Product } from '@/data/products';
import Image from 'next/image';
import Link from 'next/link';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 1) {
      setLoading(true);
      
      // Ajouter un petit délai pour ne pas lancer trop de recherches pendant la frappe
      const timer = setTimeout(() => {
        // Recherche des produits correspondants
        const matchingProducts = searchProducts(value);
        setResults(matchingProducts.slice(0, 6)); // Limiter à 6 résultats
        setIsOpen(true);
        setLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsOpen(false);
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      setIsOpen(false);
      router.push(`/products?search=${encodeURIComponent(query)}`);
    }
  };
  
  const handleFocus = () => {
    setIsInputFocused(true);
    if (query.length > 1 && results.length > 0) {
      setIsOpen(true);
    }
  };

  // Fermer les résultats lorsqu'on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsInputFocused(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Raccourci clavier pour focus sur la recherche
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K ou Cmd+K (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      
      // Échap pour fermer
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative transition-all duration-200 ${isInputFocused ? 'ring-2 ring-indigo-500 scale-105 shadow-md' : ''}`}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleSearch}
            onFocus={handleFocus}
            placeholder="Rechercher un produit... (Ctrl+K)"
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none transition-all duration-200 text-gray-900"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className={`w-5 h-5 transition-colors duration-200 ${isInputFocused ? 'text-indigo-500' : 'text-gray-400'}`} />
          </div>
          {query && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsOpen(false);
                inputRef.current?.focus();
              }}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {loading && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Recherche en cours...</p>
        </div>
      )}

      {isOpen && results.length > 0 && !loading && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-fadeIn">
          <ul className="py-1 max-h-[60vh] overflow-y-auto">
            {results.map((product, index) => (
              <li 
                key={product.id} 
                className="px-4 py-3 hover:bg-gray-100 transition-colors duration-150"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link 
                  href={`/products/${product.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-4 hover:translate-x-1 transition-transform duration-200"
                >
                  <div className="w-14 h-14 relative flex-shrink-0 overflow-hidden rounded-md transition-transform hover:scale-105 duration-200">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover hover-rotate"
                    />
                    {product.discount && (
                      <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-bl">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center mt-1">
                      {product.originalPrice ? (
                        <>
                          <p className="text-sm font-medium text-red-600">
                            {Math.round(product.price * (1 - product.discount! / 100))} €
                          </p>
                          <p className="text-xs text-gray-500 line-through ml-2">
                            {product.price} €
                          </p>
                        </>
                      ) : (
                        <p className="text-sm font-medium text-gray-700">
                          {product.price} €
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 capitalize">
                      {product.category}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              className="w-full text-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors hover:underline flex items-center justify-center"
            >
              <span>Voir tous les résultats pour "{query}"</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {isOpen && query.length > 1 && results.length === 0 && !loading && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 animate-fadeIn">
          <div className="p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-2 text-base font-medium text-gray-900">Aucun résultat trouvé</p>
            <p className="mt-1 text-sm text-gray-500">
              Aucun produit ne correspond à "{query}". Essayez d'autres termes ou consultez toutes nos catégories.
            </p>
            <div className="mt-6">
              <Link 
                href="/products" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setIsOpen(false)}
              >
                Voir tous les produits
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 