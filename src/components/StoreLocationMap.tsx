'use client';

import React from 'react';

export default function StoreLocationMap() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Visitez notre boutique</h2>
          <p className="text-lg text-gray-600">
            Venez découvrir notre collection en personne dans notre boutique située en plein cœur de Paris.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Streeter Paris</h3>
            <div className="space-y-3">
              <p className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                42 Rue du Commerce, 75015 Paris, France
              </p>
              <p className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +33 1 23 45 67 89
              </p>
              <p className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
                </svg>
                contact@streeter.com
              </p>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Horaires d'ouverture</h4>
                <ul className="space-y-1">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Lundi - Vendredi:</span>
                    <span className="font-medium">10h - 19h</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Samedi:</span>
                    <span className="font-medium">10h - 20h</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Dimanche:</span>
                    <span className="font-medium">12h - 18h</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="h-96 rounded-lg overflow-hidden shadow-lg">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2625.983266654209!2d2.2936945!3d48.8434635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e6701b4f58251b%3A0x167f5a60fb94aa76!2s42%20Rue%20du%20Commerce%2C%2075015%20Paris!5e0!3m2!1sfr!2sfr!4v1653384896555!5m2!1sfr!2sfr" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Emplacement de notre boutique"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="https://goo.gl/maps/JfYBCFePZkHhwNw97" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Itinéraire vers la boutique
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
} 