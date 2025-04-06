'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon, ShoppingBagIcon, ArrowLeftIcon, StarIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { getProductById } from '@/data/products';
import { addToCart, isAuthenticated, addToRecentlyViewed, getRecentlyViewedProducts } from '@/services/productService';
import { useRouter } from 'next/navigation';
import ReviewSection from '@/components/ReviewSection';
import { toast, Toaster } from 'react-hot-toast';
import ProductCard from '@/components/ProductCard';

// Ajout d'une interface pour gérer les stocks par taille
interface SizeStock {
  size: string;
  quantity: number;
}

// Composant pour afficher les produits récemment vus
const RecentlyViewed = ({ currentProductId }: { currentProductId: string }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler une requête API pour récupérer les produits récemment vus
    setTimeout(() => {
      const recentProducts = getRecentlyViewedProducts()
        // Filtrer le produit actuel
        .filter(product => product.id !== currentProductId)
        // Limiter à 4 produits
        .slice(0, 4);
      
      setProducts(recentProducts);
      setIsLoading(false);
    }, 500);
  }, [currentProductId]);

  if (products.length === 0) {
    return null; // Ne rien afficher s'il n'y a pas de produits récemment vus
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-white mb-6">Produits récemment consultés</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function ProductDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<number>(0);
  const [isInFavorites, setIsInFavorites] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<string>('');
  const [showAuthMessage, setShowAuthMessage] = useState<boolean>(false);
  const [zoomEffect, setZoomEffect] = useState<boolean>(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [sizeStocks, setSizeStocks] = useState<SizeStock[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const isUserLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(isUserLoggedIn);
    
    // Récupérer le produit
    const fetchedProduct = getProductById(params.id);
    
    // Ajouter aux produits récemment consultés
    addToRecentlyViewed(params.id);
    
    // Simuler un chargement
    setTimeout(() => {
      setProduct(fetchedProduct);
      if (fetchedProduct) {
        if (fetchedProduct.sizes && fetchedProduct.sizes.length > 0) {
          setSelectedSize(fetchedProduct.sizes[0]);
        }
        if (fetchedProduct.colors && fetchedProduct.colors.length > 0) {
          setSelectedColor(fetchedProduct.colors[0]);
        }
      }
      setIsLoading(false);
    }, 800);
    
    // Simuler la vérification si le produit est dans les favoris
    const simulateFavoriteCheck = Math.random() > 0.5;
    setIsInFavorites(simulateFavoriteCheck);

    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated()) {
      console.log('User is not authenticated');
      // Non bloquant pour la vue du produit
    }
    
    setIsLoading(true);
    
    // Récupérer les produits favoris depuis le localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(params.id));
    
    // Simuler une requête API pour récupérer le produit
    setTimeout(() => {
      // Simuler des stocks par taille
      const stocks = product.sizes.map((size: string) => ({
        size,
        quantity: Math.floor(Math.random() * 10) // Génère un nombre aléatoire entre 0 et 9
      }));
      
      setSizeStocks(stocks);
      setProduct(product);
      setIsLoading(false);
    }, 1000);
  }, [params.id]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setShowAuthMessage(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
      return;
    }
    
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert('Veuillez sélectionner une taille');
      return;
    }
    
    if (!selectedColor && product.colors && product.colors.length > 0) {
      alert('Veuillez sélectionner une couleur');
      return;
    }
    
    // Vérifier la disponibilité de la taille sélectionnée
    const availability = getSizeAvailability(selectedSize);
    if (availability < quantity) {
      toast.error(`Quantité non disponible. Il reste seulement ${availability} en stock.`);
      return;
    }
    
    // Simuler l'ajout au panier
    setTimeout(() => {
      // On récupère le panier actuel ou on initialise un panier vide
      const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Vérifier si le produit est déjà dans le panier
      const existingItemIndex = currentCart.findIndex((item: any) => 
        item.productId === params.id && 
        item.size === selectedSize && 
        item.color === selectedColor
      );
      
      if (existingItemIndex !== -1) {
        // Mettre à jour la quantité si le produit existe déjà
        const newQuantity = currentCart[existingItemIndex].quantity + quantity;
        
        // Vérifier si la quantité totale est disponible
        if (newQuantity > availability) {
          toast.error(`Quantité non disponible. Il reste seulement ${availability} en stock.`);
          return;
        }
        
        currentCart[existingItemIndex].quantity = newQuantity;
      } else {
        // Ajouter un nouvel article
        currentCart.push({
          id: `${params.id}-${selectedSize}-${selectedColor}-${Date.now()}`,
          productId: params.id,
          name: product?.name,
          price: product?.price,
          image: product?.images[0],
          size: selectedSize,
          color: selectedColor,
          quantity: quantity
        });
      }
      
      // Sauvegarder le panier mis à jour
      localStorage.setItem('cart', JSON.stringify(currentCart));
      
      // Afficher un toast de confirmation
      toast.success('Produit ajouté au panier');
    }, 500);
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated()) {
      toast.error('Veuillez vous connecter pour ajouter des favoris');
      localStorage.setItem('redirectAfterLogin', `/products/${params.id}`);
      router.push('/auth/login');
      return;
    }
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      // Retirer des favoris
      newFavorites = favorites.filter((id: string) => id !== params.id);
      toast.success('Produit retiré des favoris');
    } else {
      // Ajouter aux favoris
      newFavorites = [...favorites, params.id];
      toast.success('Produit ajouté aux favoris');
    }
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleImageHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomEffect) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    setHoverPosition({ x, y });
  };

  // Vérifier la disponibilité d'une taille
  const getSizeAvailability = (size: string): number => {
    const sizeStock = sizeStocks.find(stock => stock.size === size);
    return sizeStock ? sizeStock.quantity : 0;
  };
  
  // Obtenir une classe CSS pour l'état de disponibilité
  const getAvailabilityClass = (quantity: number): string => {
    if (quantity === 0) return 'text-red-500';
    if (quantity < 3) return 'text-orange-500';
    return 'text-green-500';
  };
  
  // Obtenir un message de disponibilité
  const getAvailabilityMessage = (quantity: number): string => {
    if (quantity === 0) return 'Rupture de stock';
    if (quantity < 3) return `Plus que ${quantity} en stock!`;
    return 'En stock';
  };

  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };

  const shareProduct = async (platform: string) => {
    const url = window.location.href;
    const text = `Découvrez ce produit: ${product?.name}`;
    
    switch (platform) {
      case 'clipboard':
        try {
          await navigator.clipboard.writeText(url);
          toast.success('Lien copié dans le presse-papier');
        } catch (err) {
          toast.error('Impossible de copier le lien');
        }
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent('Produit intéressant')}&body=${encodeURIComponent(text + '\n\n' + url)}`, '_blank');
        break;
    }
    
    setShowShareOptions(false);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-white text-lg">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center max-w-md px-6">
          <h1 className="text-2xl font-semibold text-white mb-4">Produit non trouvé</h1>
          <p className="text-gray-300 mb-6">Désolé, le produit que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link href="/products" className="inline-flex items-center text-indigo-400 hover:text-indigo-300">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 py-8 min-h-screen -mt-16">
      <Toaster position="top-right" />
      
      {/* Notification messages */}
      {showSuccessMessage && (
        <div className="fixed top-20 right-5 bg-indigo-500 text-white px-6 py-3 rounded-md shadow-lg z-50 animate-fade-in">
          {showSuccessMessage}
        </div>
      )}
      
      {showAuthMessage && (
        <div className="fixed top-20 right-5 bg-yellow-500 text-white px-6 py-3 rounded-md shadow-lg z-50 animate-fade-in">
          Veuillez vous connecter pour effectuer cette action.
          <br />
          Redirection en cours...
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 pt-16">
          <Link href="/products" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Retour aux produits
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start">
          {/* Product Images */}
          <div className="space-y-4 md:space-y-6">
            {/* Main image */}
            <div 
              className="relative h-80 sm:h-96 md:h-[500px] w-full overflow-hidden rounded-lg cursor-zoom-in border border-gray-800 bg-gray-800"
              onClick={() => setZoomEffect(!zoomEffect)}
              onMouseMove={handleImageHover}
              onMouseLeave={() => setZoomEffect(false)}
            >
              <div className={`w-full h-full transition-all duration-300 ${zoomEffect ? 'scale-150' : 'scale-100'}`} 
                style={zoomEffect ? { transformOrigin: `${hoverPosition.x * 100}% ${hoverPosition.y * 100}%` } : {}}>
                <Image 
                  src={product.images[activeImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              {zoomEffect && (
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md">
                  Cliquez pour désactiver le zoom
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
              {product.images.map((image: string, index: number) => (
                <div 
                  key={index}
                  className={`relative h-16 sm:h-20 w-full rounded-md cursor-pointer overflow-hidden transition-all duration-300 hover:opacity-90 hover:scale-105 ${activeImage === index ? 'ring-2 ring-indigo-500' : 'opacity-60 hover:opacity-100'}`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image 
                    src={image}
                    alt={`${product.name} - vue ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="space-y-4 md:space-y-6 pt-4 md:pt-0">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{product.name}</h1>
                <p className="text-lg text-indigo-400">{product.price} €</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-full ${isFavorite ? 'bg-red-500/10 text-red-500' : 'bg-gray-800 text-gray-400 hover:text-white'} transition-colors`}
                  title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  {isFavorite ? (
                    <HeartIconSolid className="h-6 w-6" />
                  ) : (
                    <HeartIcon className="h-6 w-6" />
                  )}
                </button>
                
                <div className="relative">
                  <button 
                    onClick={handleShare}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Partager le produit"
                  >
                    <ShareIcon className="h-6 w-6 text-gray-500 hover:text-indigo-500" />
                  </button>
                  
                  {showShareOptions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button 
                          onClick={() => shareProduct('clipboard')} 
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Copier le lien
                        </button>
                        <button 
                          onClick={() => shareProduct('facebook')} 
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Facebook
                        </button>
                        <button 
                          onClick={() => shareProduct('twitter')} 
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Twitter
                        </button>
                        <button 
                          onClick={() => shareProduct('whatsapp')} 
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          WhatsApp
                        </button>
                        <button 
                          onClick={() => shareProduct('email')} 
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          E-mail
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Rating */}
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                i < Math.round(product.rating) ? (
                  <StarIconSolid key={i} className="h-5 w-5 text-yellow-400" />
                ) : (
                  <StarIcon key={i} className="h-5 w-5 text-gray-400" />
                )
              ))}
              <span className="ml-2 text-gray-300">({product.numReviews} avis)</span>
            </div>
            
            <div className="border-t border-gray-800 pt-6">
              <p className="text-gray-300">{product.description}</p>
            </div>
            
            {/* Product attributes */}
            <div className="space-y-6">
              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-3">Taille</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {product.sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 border ${selectedSize === size 
                          ? 'bg-indigo-600 text-white border-indigo-600' 
                          : 'border-gray-700 text-gray-300 hover:border-gray-500'
                        } rounded-md transition-colors text-sm`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-3">Couleur</h3>
                  <div className="flex space-x-3">
                    {product.colors.map((color: string) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`h-10 w-10 rounded-full transition-transform ${selectedColor === color ? 'ring-2 ring-white scale-110' : 'hover:scale-105'}`}
                        style={{ backgroundColor: color }}
                        title={color}
                      ></button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quantity */}
              <div>
                <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-3">Quantité</h3>
                <div className="flex items-center border border-gray-700 rounded-md w-32">
                  <button 
                    className="px-3 py-2 text-gray-300 hover:text-white disabled:opacity-50"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    className="w-12 py-2 text-center bg-transparent text-white border-0 focus:ring-0"
                    value={quantity}
                    readOnly
                  />
                  <button 
                    className="px-3 py-2 text-gray-300 hover:text-white disabled:opacity-50"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={quantity >= 10}
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Stock status */}
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full ${product.countInStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="ml-2 text-sm text-gray-300">
                  {product.countInStock > 0 
                    ? `En stock (${product.countInStock} disponibles)` 
                    : 'Rupture de stock'}
                </span>
              </div>
            </div>
            
            {/* Add to cart button */}
            <div className="pt-4 md:pt-6">
              <button
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className={`w-full py-3 px-4 md:px-6 flex items-center justify-center space-x-2 rounded-md text-white font-medium transition-all transform hover:scale-[1.02] ${
                  product.countInStock > 0 
                    ? 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800' 
                    : 'bg-gray-700 cursor-not-allowed'
                }`}
              >
                <ShoppingBagIcon className="h-5 w-5" />
                <span>{product.countInStock > 0 ? 'Ajouter au panier' : 'Indisponible'}</span>
              </button>
            </div>
            
            {/* Additional info */}
            <div className="border-t border-gray-800 pt-6 space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 text-indigo-400 mr-3">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <p className="text-sm text-gray-400">Livraison express sous 48h</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 text-indigo-400 mr-3">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"></path>
                  </svg>
                </div>
                <p className="text-sm text-gray-400">Garantie de retour sous 30 jours</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-10 md:mt-16 border-t border-gray-800 pt-6 md:pt-10">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8">Avis clients</h2>
          <ReviewSection productId={params.id} />
        </div>
        
        {/* Related Products */}
        <div className="mt-16 border-t border-gray-800 pt-10">
          <h2 className="text-2xl font-bold text-white mb-8">Vous pourriez également aimer</h2>
          {/* Add your related products component here */}
          <p className="text-gray-400">Fonctionnalité à venir...</p>
        </div>
        
        {/* Ajouter le composant des produits récemment vus à la fin de la page */}
        <RecentlyViewed currentProductId={params.id} />
      </div>
    </div>
  );
} 