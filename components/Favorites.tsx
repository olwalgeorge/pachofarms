'use client';
import React, { useState } from 'react';
import { useFavorites } from './FavoritesProvider';
import { useCart } from './CartProvider';

export default function Favorites() {
  const { favorites, removeFromFavorites, clearFavorites, favoritesCount } = useFavorites();
  const { addToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  return (
    <>
      {/* Favorites Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <i className="ri-heart-fill text-red-500 w-6 h-6 flex items-center justify-center mr-3"></i>
                <h2 className="text-lg font-semibold text-gray-900">My Favorites</h2>
                <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                  {favoritesCount}
                </span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <i className="ri-heart-line w-16 h-16 flex items-center justify-center text-gray-300 mx-auto mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                  <p className="text-gray-500 mb-6">Save your favorite chili products to easily find them later</p>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Clear All Button */}
                  {favorites.length > 0 && (
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">{favoritesCount} saved items</p>
                      <button
                        onClick={clearFavorites}
                        className="text-sm text-red-600 hover:text-red-800 cursor-pointer font-medium"
                      >
                        Clear All
                      </button>
                    </div>
                  )}

                  {/* Favorites List */}
                  {favorites.map((product) => (
                    <div key={product.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                        <p className="text-sm text-gray-500 truncate">{product.category}</p>
                        <p className="text-lg font-bold text-green-600">${product.price}</p>
                        {!product.inStock && (
                          <p className="text-xs text-red-600 font-medium">Out of Stock</p>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-full hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <i className="ri-shopping-cart-line mr-1"></i>
                          Add
                        </button>
                        <button
                          onClick={() => removeFromFavorites(product.id)}
                          className="px-3 py-1 text-red-600 hover:text-red-800 text-sm cursor-pointer"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {favorites.length > 0 && (
              <div className="border-t border-gray-200 p-6">
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="flex-1 bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap text-center"
                  >
                    Continue Shopping
                  </button>
                  <button 
                    onClick={() => {
                      favorites.forEach(product => {
                        if (product.inStock) {
                          handleAddToCart(product);
                        }
                      });
                      setIsOpen(false);
                    }}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap text-center"
                  >
                    Add All to Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Favorites Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-gray-600 hover:text-red-500 transition-colors cursor-pointer"
      >
        <i className={`${favoritesCount > 0 ? 'ri-heart-fill text-red-500' : 'ri-heart-line'} w-6 h-6 flex items-center justify-center`}></i>
        {favoritesCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {favoritesCount}
          </span>
        )}
      </button>
    </>
  );
}