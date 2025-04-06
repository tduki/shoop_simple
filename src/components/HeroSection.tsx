'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoverEffect, setHoverEffect] = useState(-1);
  
  const slides = [
    {
      title: "Style. Culture.",
      subtitle: "Attitude.",
      description: "Découvrez la nouvelle collection Streeter - où le streetwear rencontre l'élégance urbaine.",
      ctaText: "Explorer la collection",
      ctaLink: "/products",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop",
      color: "from-indigo-600 to-purple-600"
    },
    {
      title: "Exclusivité.",
      subtitle: "Innovation.",
      description: "Des pièces uniques en édition limitée, conçues pour ceux qui osent se démarquer.",
      ctaText: "Voir les nouveautés",
      ctaLink: "/products?category=sneakers",
      image: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2070&auto=format&fit=crop",
      color: "from-red-600 to-orange-600"
    },
    {
      title: "Confort. Style.",
      subtitle: "Performance.",
      description: "Des sneakers qui vous accompagnent dans tous vos défis quotidiens.",
      ctaText: "Nos sneakers",
      ctaLink: "/products?category=sneakers",
      image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      color: "from-blue-600 to-teal-600"
    },
  ];
  
  useEffect(() => {
    // Animation d'entrée
    setIsVisible(true);
    
    // Rotation automatique des slides
    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    
    return () => clearInterval(intervalId);
  }, [slides.length]);

  const features = [
    { id: 0, title: 'Livraison gratuite', icon: '🚚' },
    { id: 1, title: 'Retours sous 30 jours', icon: '↩️' },
    { id: 2, title: 'Éditions limitées', icon: '⭐' },
    { id: 3, title: 'Membre exclusif', icon: '👑' }
  ];

  return (
    <div className="relative bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      {/* Animated background overlay */}
      <div className="absolute inset-0 z-0 bg-grid-white/[0.05] bg-[length:50px_50px]"></div>
      
      {/* Background animation */}
      <div className="absolute -top-40 -right-40 z-0">
        <div className="w-96 h-96 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      </div>
      
      <div className="absolute -bottom-40 -left-40 z-0">
        <div className="w-96 h-96 bg-gradient-to-br from-blue-500/30 to-teal-600/30 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Background Image Slider */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1500 ${
              currentSlide === index ? 'opacity-50' : 'opacity-0'
            }`}
          >
            <Image 
              src={slide.image}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover scale-[1.01] filter brightness-[0.7]"
              priority={index === 0}
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.color} mix-blend-overlay opacity-60`}></div>
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="py-24 md:py-32 flex flex-col items-center">
          <div 
            className={`text-center max-w-3xl transition-all duration-1000 ease-out transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl font-sans">
              <span className="block mb-1 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">{slides[currentSlide].title}</span>
              <span className={`block bg-gradient-to-r ${slides[currentSlide].color.replace('from-', 'from-').replace('to-', 'to-')} text-transparent bg-clip-text`}>
                {slides[currentSlide].subtitle}
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-200 drop-shadow-md">
              {slides[currentSlide].description}
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href={slides[currentSlide].ctaLink}
                className={`transition-all duration-500 transform hover:scale-105 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                } inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r ${slides[currentSlide].color} hover:brightness-110 shadow-lg hover:shadow-indigo-500/50`}
              >
                {slides[currentSlide].ctaText}
              </Link>
              <Link
                href="/products"
                className={`transition-all duration-500 transform hover:scale-105 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                } inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-gray-900 shadow-lg backdrop-blur-sm bg-white/10`}
              >
                Tous nos produits
              </Link>
            </div>
          </div>
          
          {/* Slide indicators */}
          <div className="mt-12 flex space-x-2 justify-center">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  currentSlide === index
                    ? `bg-gradient-to-r ${slides[index].color} w-8`
                    : 'bg-gray-400 bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`Aller au slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Animated features */}
          <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={feature.id}
                className={`transition-all duration-700 transform ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                } ${
                  hoverEffect === feature.id ? 'scale-105' : ''
                }`}
                style={{ transitionDelay: `${800 + index * 200}ms` }}
                onMouseEnter={() => setHoverEffect(feature.id)}
                onMouseLeave={() => setHoverEffect(-1)}
              >
                <div className="relative overflow-hidden group bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-300 to-purple-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative flex flex-col items-center justify-center space-y-3 text-white">
                    <span className="text-3xl">{feature.icon}</span>
                    <span className="text-sm font-medium">{feature.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Animated scroll down indicator */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="text-xs text-gray-300 mb-2">Découvrir</span>
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </div>
  );
} 