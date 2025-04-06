'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon, ShoppingCartIcon, ArrowsRightLeftIcon, EyeIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Product } from '@/data/products';
import { toggleFavorite, isProductFavorite, addToCart, addToCompare } from '@/services/productService';
import toast from 'react-hot-toast';

export interface ProductCardProps {
  product: Product;
  className?: string;
  showRemoveFavorite?: boolean;
  onRemoveFavorite?: (productId: string) => void;
}

export default function ProductCard({ product, className, showRemoveFavorite, onRemoveFavorite }: ProductCardProps) {
  // Initialize favorite state with the prop or from storage
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [zoomImage, setZoomImage] = useState(false);
  
  useEffect(() => {
    // Check if product is in favorites
    setIsFavorite(isProductFavorite(product.id));
  }, [product.id]);
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Si on est dans la page des favoris et qu'on a la prop onRemoveFavorite
    if (showRemoveFavorite && onRemoveFavorite) {
      onRemoveFavorite(product.id);
      return;
    }
    
    const result = toggleFavorite(product.id);
    setIsFavorite(result);
    
    if (result) {
      toast.success('Produit ajouté aux favoris');
    } else {
      toast.success('Produit retiré des favoris');
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const result = addToCart(product.id);
    if (result) {
      toast.success('Produit ajouté au panier');
    }
  };
  
  const handleAddToCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const result = addToCompare(product.id);
    if (result) {
      toast.success('Produit ajouté à la comparaison');
    }
  };

  const handleImageHover = () => {
    setZoomImage(true);
  };

  return (
    <div 
      className={`product-card relative bg-white rounded-lg overflow-hidden shadow-sm ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image et favoris */}
      <div className="relative aspect-square">
        {product.images && product.images.length > 0 ? (
          <Link href={`/products/${product.id}`}>
            <div className="relative h-full w-full overflow-hidden">
              <Image 
                src={zoomImage && product.images.length > 1 ? product.images[1] : product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={80}
                className={`object-cover transition-transform duration-500 ${zoomImage ? 'scale-110' : 'scale-100'}`}
                onMouseEnter={handleImageHover}
                onMouseLeave={() => setZoomImage(false)}
              />
            </div>
          </Link>
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <PhotoIcon className="h-10 w-10 text-gray-400" />
          </div>
        )}
        
        <button 
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-sm hover:bg-gray-100"
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          {isFavorite ? (
            <HeartIconSolid className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5" style={{ color: 'var(--color-accent)' }} />
          )}
        </button>
        
        {product.discount && product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}
      </div>
      
      {/* Informations produit */}
      <div className="p-4">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{product.name}</h3>
        </Link>
        
        {/* Prix */}
        <div className="mt-1 flex items-center">
          {product.originalPrice ? (
            <>
              <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{product.price.toFixed(2)}€</span>
              <span className="ml-2 text-xs line-through text-gray-500">{product.originalPrice.toFixed(2)}€</span>
            </>
          ) : (
            <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{product.price.toFixed(2)}€</span>
          )}
        </div>
        
        {/* Actions */}
        <div className="mt-3 flex justify-between items-center">
          <button 
            onClick={handleAddToCompare}
            className="text-xs flex items-center hover:underline"
            style={{ color: 'var(--color-secondary)' }}
          >
            <ArrowsRightLeftIcon className="h-4 w-4 mr-1" />
            Comparer
          </button>
          
          <button 
            onClick={handleAddToCart}
            className="btn-accent text-xs py-1.5 px-3 flex items-center justify-center"
            style={{ 
              backgroundColor: 'var(--color-accent)',
              color: 'white',
              borderRadius: 'var(--border-radius)'
            }}
          >
            <ShoppingCartIcon className="h-4 w-4 mr-1" />
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
} 