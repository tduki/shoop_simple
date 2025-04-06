'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getDiscountedProducts } from '@/data/products';
import ProductCard from '@/components/ProductCard';

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  expiresAt: string;
  image: string;
}

export default function PromotionsPage() {
  const [discountedProducts, setDiscountedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    // Simuler le chargement des produits en réduction
    setTimeout(() => {
      const products = getDiscountedProducts();
      setDiscountedProducts(products);
      setIsLoading(false);
    }, 800);
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  // Promotions en cours
  const promotions: Promotion[] = [
    {
      id: 'summer-sale',
      title: 'Soldes d\'été',
      description: 'Profitez jusqu\'à 40% de réduction sur une sélection d\'articles d\'été.',
      discount: 'Jusqu\'à 40%',
      code: 'SUMMER40',
      expiresAt: '2024-08-31',
      image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'new-collection',
      title: 'Nouvelle Collection',
      description: '20% de réduction sur tous les articles de la nouvelle collection.',
      discount: '20%',
      code: 'NEWCOL20',
      expiresAt: '2024-07-15',
      image: 'https://images.unsplash.com/photo-1561052927-47ac3bccb355?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'sneakers-discount',
      title: 'Sneakers en promotion',
      description: '25% de réduction sur une sélection de sneakers exclusives.',
      discount: '25%',
      code: 'KICKS25',
      expiresAt: '2024-07-30',
      image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Bannière principale */}
      <div className="relative bg-gray-900 text-white py-16">
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <Image 
            src="https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=2034&auto=format&fit=crop"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Promotions & Réductions
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto">
              Découvrez nos meilleures offres et économisez sur vos articles préférés grâce à nos codes promo exclusifs.
            </p>
          </div>
        </div>
      </div>

      {/* Promotions en cours */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Promotions en cours
          </h2>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {promotions.map((promo) => (
              <div key={promo.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white py-1 px-3 m-4 rounded-md font-semibold">
                    {promo.discount}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{promo.title}</h3>
                  <p className="text-gray-600 mt-2">{promo.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">Utilisez le code:</span>
                      <span className="ml-2 bg-gray-100 px-2 py-1 rounded font-mono text-sm">{promo.code}</span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(promo.code)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      {copied === promo.code ? 'Copié !' : 'Copier'}
                    </button>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    Expire le {new Date(promo.expiresAt).toLocaleDateString()}
                  </div>
                  <Link 
                    href={`/products?promo=${promo.id}`}
                    className="mt-6 block w-full bg-indigo-600 text-white text-center py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Voir les produits
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Produits en réduction */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Articles en réduction
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {discountedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <Link
                  href="/products?discount=true"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  Voir tous les articles en réduction
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* Comment utiliser les codes promo */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Comment utiliser les codes promo ?
          </h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <ol className="space-y-6">
              <li className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Choisissez vos articles</h3>
                  <p className="mt-1 text-gray-600">Parcourez notre catalogue et ajoutez les articles que vous souhaitez acheter à votre panier.</p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Accédez à votre panier</h3>
                  <p className="mt-1 text-gray-600">Consultez votre panier en cliquant sur l'icône correspondante dans la barre de navigation.</p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Saisissez votre code promo</h3>
                  <p className="mt-1 text-gray-600">Dans la page de paiement, vous trouverez un champ "Code promo". Entrez-y votre code et cliquez sur "Appliquer".</p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Profitez de votre réduction</h3>
                  <p className="mt-1 text-gray-600">La réduction sera automatiquement appliquée à votre commande. Vérifiez le montant total et finalisez votre achat.</p>
                </div>
              </li>
            </ol>
          </div>
          
          <div className="mt-8 bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Conditions d'utilisation</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Les codes promo ne sont pas cumulables entre eux</li>
              <li>La réduction s'applique uniquement aux articles non déjà soldés, sauf mention contraire</li>
              <li>Les codes ont une date d'expiration après laquelle ils ne sont plus valides</li>
              <li>Streeter se réserve le droit de modifier ou d'annuler une promotion à tout moment</li>
              <li>Pour toute question concernant l'utilisation d'un code promo, contactez notre service client</li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-16 bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ne manquez aucune promotion</h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-3xl mx-auto">
            Inscrivez-vous à notre newsletter pour recevoir en avant-première nos offres exclusives et codes promo.
          </p>
          <form className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                className="flex-1 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-900"
                required
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-white text-indigo-700 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                S'inscrire
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
} 