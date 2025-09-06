
'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="contact" className="bg-green-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/" className="flex items-center space-x-3 mb-6 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <i className="ri-plant-line text-2xl text-white"></i>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <i className="ri-fire-fill text-xs text-white"></i>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-['Pacifico'] text-white leading-tight">Pacho Farm</span>
                <span className="text-xs text-green-300 font-medium uppercase tracking-wide">Premium Chilies</span>
              </div>
            </Link>
            <p className="text-green-200 mb-6 leading-relaxed">
              Heritage horticulture in the heart of Kenya, specializing in premium African and Asian chili varieties. 
              Grown with passion, delivered with care across East Africa.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-green-800 hover:bg-green-700 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                <i className="ri-facebook-fill text-xl text-white"></i>
              </div>
              <div className="w-10 h-10 bg-green-800 hover:bg-green-700 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                <i className="ri-instagram-line text-xl text-white"></i>
              </div>
              <div className="w-10 h-10 bg-green-800 hover:bg-green-700 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                <i className="ri-twitter-line text-xl text-white"></i>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-green-200 hover:text-white transition-colors cursor-pointer">Home</Link></li>
              <li><Link href="/about" className="text-green-200 hover:text-white transition-colors cursor-pointer">About Us</Link></li>
              <li><Link href="/products" className="text-green-200 hover:text-white transition-colors cursor-pointer">Our Products</Link></li>
              <li><a href="/#testimonials" className="text-green-200 hover:text-white transition-colors cursor-pointer">Testimonials</a></li>
              <li><a href="#" className="text-green-200 hover:text-white transition-colors cursor-pointer">Farm Tours</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6">Products</h3>
            <ul className="space-y-3">
              <li><span className="text-green-200">African Varieties</span></li>
              <li><span className="text-green-200">Asian Varieties</span></li>
              <li><span className="text-green-200">Dried Peppers</span></li>
              <li><span className="text-green-200">Pepper Flakes</span></li>
              <li><span className="text-green-200">Seasonal Specials</span></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 flex items-center justify-center mt-1">
                  <i className="ri-map-pin-line text-green-400"></i>
                </div>
                <div>
                  <p className="text-green-200">P.O. Box 1847</p>
                  <p className="text-green-200">Kisumu, Kenya 40100</p>
                  <p className="text-green-200">Nyanza Province</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-phone-line text-green-400"></i>
                </div>
                <p className="text-green-200">+254 703 456 789</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-mail-line text-green-400"></i>
                </div>
                <p className="text-green-200">hello@pachofarm.co.ke</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-green-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-green-300 mb-4 md:mb-0">
              © 2024 Pacho Farm. All rights reserved. | Kenya Organic Agriculture Network Certified
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-green-300 hover:text-white transition-colors cursor-pointer">Privacy Policy</a>
              <a href="#" className="text-green-300 hover:text-white transition-colors cursor-pointer">Terms of Service</a>
              <a href="#" className="text-green-300 hover:text-white transition-colors cursor-pointer">Shipping Info</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
