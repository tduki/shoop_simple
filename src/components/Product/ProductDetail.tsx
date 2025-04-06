"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/data/products"; 
import { StarIcon, ShoppingCartIcon, HeartIcon } from "@heroicons/react/24/solid";
import { addToCart, addToFavorites, isProductFavorite, removeFromFavorites } from "@/services/productService";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  useEffect(() => {
    setIsFavorite(isProductFavorite(product.id));
  }, [product.id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Veuillez sélectionner une taille");
      return;
    }

    if (!selectedColor) {
      toast.error("Veuillez sélectionner une couleur");
      return;
    }

    const success = addToCart(product, quantity, selectedSize, selectedColor);

    if (success) {
      toast.success(`${product.name} a été ajouté au panier`);
    } else {
      toast.error("Vous devez être connecté pour ajouter au panier");
    }
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      const success = removeFromFavorites(product.id);
      if (success) {
        setIsFavorite(false);
        toast.success("Retiré des favoris");
      }
    } else {
      const success = addToFavorites(product.id);
      if (success) {
        setIsFavorite(true);
        toast.success("Ajouté aux favoris");
      } else {
        toast.error("Vous devez être connecté pour ajouter aux favoris");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Images Section */}
        <motion.div 
          className="lg:w-1/2 sticky top-[90px] self-start"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative aspect-square overflow-hidden rounded-xl mb-4 bg-gray-100">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover object-center hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div 
                key={index} 
                className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${selectedImage === image ? 'border-indigo-500' : 'border-transparent'}`}
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 25vw, 10vw"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Product Info Section */}
        <motion.div 
          className="lg:w-1/2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array(5).fill(0).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < product.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.numReviews} avis)
              </span>
              <span className="text-sm text-gray-500 ml-2">
                {product.inStock ? (
                  <span className="text-green-600 font-medium">En stock</span>
                ) : (
                  <span className="text-red-600 font-medium">Épuisé</span>
                )}
              </span>
            </div>
            <p className="text-3xl font-bold text-indigo-600 mb-4">
              {product.price.toFixed(2)} €
              {product.originalPrice && (
                <span className="text-gray-400 line-through text-lg ml-2">
                  {product.originalPrice.toFixed(2)} €
                </span>
              )}
            </p>
            <div className="prose prose-indigo max-w-none mb-6 text-gray-600">
              <p>{product.description}</p>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-6 mb-8">
            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Couleur</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`
                        w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                        transition-transform hover:scale-110
                        ${selectedColor === color ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
                      `}
                      style={{ backgroundColor: color.toLowerCase() }}
                      aria-label={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Taille</h3>
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Guide des tailles
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`
                        py-2 px-4 rounded-md font-medium text-sm
                        hover:bg-indigo-50 transition-colors duration-200
                        ${
                          selectedSize === size
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "bg-gray-100 text-gray-800"
                        }
                      `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quantité</h3>
              <div className="flex items-center border border-gray-300 rounded-md w-32">
                <button
                  type="button"
                  className="px-3 py-1 text-gray-600 hover:text-indigo-600 text-lg font-bold"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <div className="flex-1 text-center py-1">{quantity}</div>
                <button
                  type="button"
                  className="px-3 py-1 text-gray-600 hover:text-indigo-600 text-lg font-bold"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`
                flex items-center justify-center w-full py-3 px-6 rounded-lg
                text-white font-medium text-lg
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                transition-all duration-200
                ${
                  product.inStock
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-400 cursor-not-allowed"
                }
              `}
            >
              <ShoppingCartIcon className="w-5 h-5 mr-2" />
              Ajouter au panier
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleFavorite}
              className={`
                flex items-center justify-center w-full py-3 px-6 rounded-lg
                font-medium text-lg border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                transition-all duration-200
                ${
                  isFavorite
                    ? "bg-pink-50 text-pink-600 border-pink-200"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              <HeartIcon 
                className={`w-5 h-5 mr-2 ${isFavorite ? "text-pink-600" : "text-gray-400"}`} 
              />
              {isFavorite ? "Retiré des favoris" : "Ajouter aux favoris"}
            </motion.button>
          </div>
          
          {/* Additional Information */}
          <div className="mt-10 border-t pt-6">
            <div className="flex border-b">
              <button
                className={`py-3 px-4 font-medium text-sm mr-4 border-b-2 ${
                  activeTab === "description" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`py-3 px-4 font-medium text-sm mr-4 border-b-2 ${
                  activeTab === "details" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("details")}
              >
                Détails
              </button>
              <button
                className={`py-3 px-4 font-medium text-sm border-b-2 ${
                  activeTab === "reviews" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                Avis ({product.numReviews})
              </button>
            </div>

            <div className="py-4">
              {activeTab === "description" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="prose prose-indigo max-w-none"
                >
                  <p className="text-gray-600">{product.description}</p>
                  <p className="mt-4 text-gray-600">
                    Le {product.name} est fabriqué avec des matériaux de haute qualité pour garantir
                    confort et durabilité. Parfait pour une utilisation quotidienne, il associe style et
                    fonctionnalité.
                  </p>
                </motion.div>
              )}

              {activeTab === "details" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-medium text-gray-900">Caractéristiques:</h3>
                  <ul className="mt-2 list-disc pl-5 text-gray-600 space-y-1">
                    <li>Marque: Streeter</li>
                    <li>Catégorie: {product.category}</li>
                    <li>Référence: {product.id}</li>
                    <li>Matériaux de qualité premium</li>
                    <li>Fabriqué en France</li>
                    <li>Livraison gratuite à partir de 50€</li>
                  </ul>
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {product.reviews && Array.isArray(product.reviews) && product.reviews.length > 0 ? (
                    product.reviews.map((review: any, index: number) => (
                      <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <div className="flex items-center mb-1">
                          <div className="flex">
                            {Array(5).fill(0).map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-900">{review.author}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{review.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{review.date}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">Aucun avis pour le moment.</p>
                  )}
                  <button className="mt-2 text-indigo-600 font-medium text-sm hover:text-indigo-800">
                    Laisser un avis
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 