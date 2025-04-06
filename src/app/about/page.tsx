'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Bannière de la page */}
      <div className="relative h-72 md:h-96 bg-gradient-to-r from-gray-900 to-indigo-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6 max-w-4xl">
            <h1 className="text-4xl font-bold text-white mb-4 sm:text-5xl">Qui sommes-nous</h1>
            <p className="text-xl text-indigo-100">Découvrez l'histoire et les valeurs de Streeter</p>
          </div>
        </div>
      </div>

      {/* Section Notre Histoire */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Notre Histoire</h2>
            <p className="text-lg text-gray-600">
              Fondée en 2020 à Perpignan, Streeter est née d'une passion pour la mode urbaine et le street-wear. Tout a commencé avec un petit magasin dans le centre-ville, où notre fondateur Anis a commencé à proposer une sélection soigneusement choisie de sneakers et de vêtements représentant l'esprit de la rue.
            </p>
            <p className="text-lg text-gray-600">
              Face à l'enthousiasme croissant de notre clientèle locale, nous avons rapidement étendu notre offre et développé notre présence en ligne pour permettre à un public plus large de découvrir notre univers. Aujourd'hui, Streeter est devenue une référence incontournable pour les amateurs de mode urbaine authentique.
            </p>
            <p className="text-lg text-gray-600">
              Notre objectif reste le même qu'au premier jour : proposer des pièces de qualité qui allient style, confort et originalité, tout en restant fidèles à l'esprit de la culture urbaine qui nous anime.
            </p>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
            <Image 
              src="https://images.unsplash.com/photo-1606036525923-925899f9108f?q=80&w=2071&auto=format&fit=crop" 
              alt="Fondateur de Streeter dans sa boutique" 
              fill 
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Section Nos Valeurs */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Nos Valeurs</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Chez Streeter, nous construisons notre identité autour de valeurs fortes qui guident toutes nos décisions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="rounded-full bg-indigo-100 p-4 mb-4">
                <svg className="h-10 w-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Authenticité</h3>
              <p className="text-gray-600">
                Nous croyons en l'importance d'être fidèles à nos racines et de proposer des produits qui reflètent véritablement la culture street, sans compromis sur la qualité ou l'esthétique.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="rounded-full bg-indigo-100 p-4 mb-4">
                <svg className="h-10 w-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-600">
                Constamment à l'affût des dernières tendances et évolutions de la mode urbaine, nous cherchons toujours à proposer des pièces innovantes qui repoussent les limites du style conventionnel.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="rounded-full bg-indigo-100 p-4 mb-4">
                <svg className="h-10 w-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Communauté</h3>
              <p className="text-gray-600">
                Plus qu'une simple marque, nous construisons une communauté de passionnés partageant les mêmes valeurs. Nous soutenons activement la scène locale et les artistes urbains qui font vivre cette culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notre équipe */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Notre Équipe</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Passionnés et experts, notre équipe s'engage chaque jour à vous offrir la meilleure expérience possible
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
              <Image 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" 
                alt="Anis - Fondateur" 
                fill 
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Anis</h3>
            <p className="text-indigo-600">Fondateur & CEO</p>
          </div>
          
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
              <Image 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop" 
                alt="Sarah - Directrice Artistique" 
                fill 
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Sarah</h3>
            <p className="text-indigo-600">Directrice Artistique</p>
          </div>
          
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
              <Image 
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop" 
                alt="Thomas - Responsable Produit" 
                fill 
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Thomas</h3>
            <p className="text-indigo-600">Responsable Produit</p>
          </div>
          
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
              <Image 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070&auto=format&fit=crop" 
                alt="Emma - Service Client" 
                fill 
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Emma</h3>
            <p className="text-indigo-600">Responsable Service Client</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Rejoignez l'aventure Streeter</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Découvrez notre collection et rejoignez notre communauté de passionnés de mode urbaine.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/products" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-100 transition-colors">
              Voir la collection
            </a>
            <a href="/contact" className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-800 transition-colors">
              Nous contacter
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 