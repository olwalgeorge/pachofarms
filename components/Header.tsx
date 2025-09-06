
'use client';
import { useState } from 'react';
import Link from 'next/link';
import Cart from './Cart';
import Favorites from './Favorites';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <i className="ri-plant-line text-2xl text-white"></i>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <i className="ri-fire-fill text-xs text-white"></i>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-['Pacifico'] text-green-700 leading-tight">
                Pacho Farm
              </div>
              <div className="text-xs text-green-600 font-medium uppercase tracking-wide">
                Premium Chilies
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-green-600 font-medium transition-colors cursor-pointer relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-green-600 font-medium transition-colors cursor-pointer relative group">
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600 font-medium transition-colors cursor-pointer relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <a href="#contact" className="text-gray-700 hover:text-green-600 font-medium transition-colors cursor-pointer relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Favorites />
            <Cart />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-green-600 transition-colors cursor-pointer"
          >
            <i className={`${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'} w-6 h-6 flex items-center justify-center`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <a 
                href="#contact" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              
              {/* Mobile Actions */}
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                <Favorites />
                <Cart />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
