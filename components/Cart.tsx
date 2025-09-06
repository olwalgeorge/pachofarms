
'use client';

import React, { useState } from 'react';
import { useCart } from './CartProvider';

export default function Cart() {
  const { state, dispatch } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-gray-600 hover:text-green-600 transition-colors cursor-pointer"
      >
        <i className="ri-shopping-cart-line w-6 h-6 flex items-center justify-center"></i>
        {state.itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {state.itemCount}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Shopping Cart ({state.itemCount})
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {state.items.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <i className="ri-shopping-cart-line text-4xl text-gray-300"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-6">Add some delicious peppers to get started!</p>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover object-top rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.origin}</p>
                          <p className="text-sm font-medium text-green-600">${item.price.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 cursor-pointer"
                          >
                            <i className="ri-subtract-line"></i>
                          </button>
                          
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 cursor-pointer"
                          >
                            <i className="ri-add-line"></i>
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    ))}
                    
                    {state.items.length > 1 && (
                      <button
                        onClick={clearCart}
                        className="w-full py-2 text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer"
                      >
                        Clear All Items
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              {state.items.length > 0 && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${state.total.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-secure-payment-line mr-2"></i>
                      Proceed to Checkout
                    </button>
                    
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-full bg-gray-200 text-gray-800 py-3 rounded-full font-semibold hover:bg-gray-300 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Continue Shopping
                    </button>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                      Free shipping on orders over $50
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Checkout Modal */}
          {showCheckout && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <i className="ri-shopping-cart-2-line text-4xl text-green-600"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Order?</h3>
                  <p className="text-gray-600">
                    Contact us to complete your order of premium organic peppers
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-green-800">Order Summary:</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-green-700">
                        <span>{item.name} x{item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-green-200 pt-2 mt-2">
                      <div className="flex justify-between font-semibold text-green-800">
                        <span>Total:</span>
                        <span>${state.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <a
                    href="tel:+1-555-PACHO-FARM"
                    className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center"
                  >
                    <i className="ri-phone-line mr-2"></i>
                    Call to Order
                  </a>
                  
                  <a
                    href={`mailto:orders@pachofarm.com?subject=Order Request&body=I would like to order the items in my cart totaling $${state.total.toFixed(2)}`}
                    className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center"
                  >
                    <i className="ri-mail-line mr-2"></i>
                    Email Order
                  </a>
                  
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="w-full bg-gray-200 text-gray-800 py-3 rounded-full font-semibold hover:bg-gray-300 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Back to Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
