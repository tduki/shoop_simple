'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { ShoppingBagIcon, TruckIcon, CheckBadgeIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { getFeaturedProducts, getDiscountedProducts } from '@/data/products';
import StoreLocationMap from '@/components/StoreLocationMap';
import AnimatedText from '@/components/AnimatedText';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [discountedProducts, setDiscountedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState({
    trending: false,
    categories: false,
    newsletter: false,
    benefits: false,
    discounts: false,
    storeLocation: false
  });
  const router = useRouter();
  
  // Animation au défilement
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      
      // Section produits tendance
      const trendingSection = document.getElementById('trending-section');
      if (trendingSection && scrollPosition > trendingSection.offsetTop + 100) {
        setIsVisible(prev => ({ ...prev, trending: true }));
      }
      
      // Section catégories
      const categoriesSection = document.getElementById('categories-section');
      if (categoriesSection && scrollPosition > categoriesSection.offsetTop + 100) {
        setIsVisible(prev => ({ ...prev, categories: true }));
      }
      
      // Section promotions
      const discountsSection = document.getElementById('discounts-section');
      if (discountsSection && scrollPosition > discountsSection.offsetTop + 100) {
        setIsVisible(prev => ({ ...prev, discounts: true }));
      }
      
      // Section avantages
      const benefitsSection = document.getElementById('benefits-section');
      if (benefitsSection && scrollPosition > benefitsSection.offsetTop + 100) {
        setIsVisible(prev => ({ ...prev, benefits: true }));
      }
      
      // Section newsletter
      const newsletterSection = document.getElementById('newsletter-section');
      if (newsletterSection && scrollPosition > newsletterSection.offsetTop) {
        setIsVisible(prev => ({ ...prev, newsletter: true }));
      }
      
      // Section emplacement du magasin
      const storeLocationSection = document.getElementById('store-location-section');
      if (storeLocationSection && scrollPosition > storeLocationSection.offsetTop + 100) {
        setIsVisible(prev => ({ ...prev, storeLocation: true }));
      }
    };
    
    // Récupérer les produits
    const featured = getFeaturedProducts();
    const discounted = getDiscountedProducts().slice(0, 4); // Limiter à 4 produits
    
    setTimeout(() => {
      setFeaturedProducts(featured);
      setDiscountedProducts(discounted);
      setIsLoading(false);
    }, 800);
    
    window.addEventListener('scroll', handleScroll);
    // Déclencher une fois au chargement
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Catégories principales
  const categories = [
    { name: 'Vêtements', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop', slug: 'clothing' },
    { name: 'Sneakers', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop', slug: 'sneakers' },
    { name: 'Accessoires', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=2069&auto=format&fit=crop', slug: 'accessories' },
  ];

  // Ajouter des témoignages clients
  const testimonials = [
    {
      id: 1,
      content: "J'ai toujours des compliments sur mes chaussures achetées ici. La qualité est incroyable et elles sont très confortables.",
      author: "Sophie M.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      date: "15 mars 2024"
    },
    {
      id: 2,
      content: "Service client impeccable et livraison super rapide. Je recommande vivement cette boutique à tous mes amis.",
      author: "Thomas D.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg", 
      date: "28 février 2024"
    },
    {
      id: 3,
      content: "Les produits sont exactement comme décrits sur le site. Je suis cliente depuis 2 ans et je n'ai jamais été déçue.",
      author: "Emma L.",
      rating: 4,
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      date: "10 avril 2024"
    },
  ];

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section avec Arrière-Plan Animé */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden -mt-16">
        {/* Overlay pour améliorer la lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10"></div>
        
        {/* Arrière-plan GIF animé */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-black animate-pulse opacity-10"></div>
          <Image 
            src="/images/animations/fashion-bg.gif"
            alt="Fashion background animation"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            quality={100}
          />
        </div>
        
        {/* Contenu Hero */}
        <div className="container mx-auto px-6 relative z-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            <AnimatedText 
              text="Exclusivité." 
              type="glowing" 
              color="#ffffff"
              className="block text-white md:text-7xl font-bold"
            />
            <AnimatedText 
              text="Innovation." 
              type="slideIn" 
              color="#ef4444"
              delay={1000}
              speed={300}
              className="block text-red-600 md:text-7xl font-bold"
            />
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto opacity-0 animate-fadeIn" style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
            Des pièces uniques en édition limitée, conçues pour ceux qui osent se démarquer.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 opacity-0 animate-fadeIn" style={{ animationDelay: '2.5s', animationFillMode: 'forwards' }}>
            <Link href="/products" className="px-8 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors">
              Voir les nouveautés
            </Link>
            <Link href="/products" className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-white/10 transition-colors">
              Tous nos produits
            </Link>
          </div>
        </div>
        
        {/* Indicateur de défilement */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white flex items-start justify-center p-1">
            <div className="w-1 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>
      
      {/* Avantages */}
      <section id="benefits-section" className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-700 transform ${
            isVisible.benefits ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="flex items-center space-x-4 p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-indigo-100 rounded-full">
                <TruckIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Livraison rapide</h3>
                <p className="text-gray-500">Livraison offerte à partir de 100€</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-indigo-100 rounded-full">
                <ShoppingBagIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Retours gratuits</h3>
                <p className="text-gray-500">Satisfait ou remboursé sous 30 jours</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-indigo-100 rounded-full">
                <CheckBadgeIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Produits authentiques</h3>
                <p className="text-gray-500">Garantie d'authenticité sur tous nos articles</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Promotions Section */}
      <section id="discounts-section" className="py-16 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-700 transform ${
            isVisible.discounts ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <span className="inline-block px-3 py-1 text-sm font-semibold text-red-800 bg-red-100 rounded-full mb-3">Offres limitées</span>
            <h2 className="text-3xl font-bold text-gray-900">Promotions</h2>
            <p className="mt-4 text-xl text-gray-500">Profitez de nos réductions exclusives</p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {discountedProducts.map((product, index) => (
                <div 
                  key={product.id}
                  className={`transition-all duration-700 transform ${
                    isVisible.discounts ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
          
          <div className={`text-center mt-12 transition-all duration-700 transform ${
            isVisible.discounts ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`} style={{ transitionDelay: '600ms' }}>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-red-500/30 transition-all transform hover:scale-105"
            >
              Voir toutes les promotions
            </Link>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section id="categories-section" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-700 transform ${
            isVisible.categories ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-800 bg-indigo-100 rounded-full mb-3">Collections</span>
            <h2 className="text-3xl font-bold text-gray-900">Explorez nos catégories</h2>
            <p className="mt-4 text-xl text-gray-500">Découvrez nos collections exclusives</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div
                key={category.slug}
                className={`transition-all duration-700 transform ${
                  isVisible.categories ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="group relative h-80 overflow-hidden rounded-lg shadow-xl">
                  <div className="absolute inset-0">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70"></div>
                  </div>
                  <div className="relative h-full flex flex-col items-center justify-end p-8 text-center">
                    <h3 className="text-2xl font-bold mb-2 text-white">{category.name}</h3>
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="mt-2 inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-indigo-100 bg-indigo-600 hover:bg-indigo-700 transition-all transform hover:scale-105"
                    >
                      Découvrir
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Instagram Gallery Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-800 bg-indigo-100 rounded-full mb-3">@streeter</span>
            <h2 className="text-3xl font-bold text-gray-900">Notre Instagram</h2>
            <p className="mt-4 text-xl text-gray-500">Suivez-nous pour plus d'inspiration</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1508254627334-d4fa3a515b22?q=80&w=2070&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1588117305388-c2631a279f82?q=80&w=1974&auto=format&fit=crop',
            ].map((image, index) => (
              <div key={index} className="relative aspect-square overflow-hidden group">
                <Image
                  src={image}
                  alt={`Instagram post ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-2xl">♥</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter Section with Dark Gradient */}
      <section id="newsletter-section" className="py-16 bg-gradient-to-r from-gray-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-xl mx-auto text-center transition-all duration-1000 transform ${
            isVisible.newsletter ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-200 bg-indigo-900 rounded-full mb-3">-10% sur votre première commande</span>
            <h2 className="text-3xl font-bold mb-4">Rejoignez notre communauté</h2>
            <p className="text-lg text-indigo-200 mb-8">
              Inscrivez-vous à notre newsletter pour découvrir nos nouvelles collections en avant-première et bénéficier d'offres exclusives.
            </p>
            
            <form className="mt-8 sm:flex justify-center">
              <div className="min-w-0 flex-1">
                <label htmlFor="email" className="sr-only">Adresse email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Votre adresse email"
                  className="block w-full rounded-md border-0 px-4 py-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <button
                  type="submit"
                  className="block w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-base transition-all transform hover:scale-105"
                >
                  S'abonner
                </button>
              </div>
            </form>
            
            <p className="mt-3 text-sm text-indigo-200">
              Nous respectons votre vie privée. Désabonnement possible à tout moment.
            </p>
          </div>
        </div>
      </section>
      
      {/* Store Location Section */}
      <section id="store-location-section" className={`transition-all duration-700 transform ${
        isVisible.storeLocation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <StoreLocationMap />
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials-section" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-800 bg-indigo-100 rounded-full mb-3">Témoignages</span>
            <h2 className="text-3xl font-bold text-gray-900">Ce que nos clients disent</h2>
            <p className="mt-4 text-xl text-gray-500">Découvrez l'expérience de nos clients satisfaits</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                    <Image 
                      src={testimonial.avatar} 
                      alt={testimonial.author} 
                      width={48} 
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.author}</h4>
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <div className="ml-auto text-xs text-gray-500">{testimonial.date}</div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}