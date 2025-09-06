'use client';

import Link from 'next/link';

export default function CTA() {
  return (
    <section 
      className="py-20 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://readdy.ai/api/search-image?query=Rustic%20farm%20barn%20at%20golden%20hour%20with%20chili%20pepper%20plants%20in%20foreground%2C%20warm%20sunset%20lighting%2C%20organic%20farming%20landscape%2C%20wooden%20structures%2C%20fertile%20agricultural%20fields%2C%20authentic%20rural%20farming%20atmosphere%2C%20professional%20agricultural%20photography&width=1200&height=500&seq=cta1&orientation=landscape')`
      }}
    >
      <div className="container mx-auto px-6 text-center text-white relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Ready to Spice Up
          <span className="text-green-400 block">Your Kitchen?</span>
        </h2>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
          Order fresh, organic chilies directly from our farm or book an immersive 
          farm experience to learn about heritage horticulture firsthand.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Link href="/products">
            <button className="bg-green-600 text-white px-10 py-4 rounded-full text-xl font-semibold hover:bg-green-700 transition-all transform hover:scale-105 cursor-pointer whitespace-nowrap">
              <i className="ri-shopping-cart-line mr-3"></i>
              Order Fresh Produce
            </button>
          </Link>
          <button className="border-2 border-white text-white px-10 py-4 rounded-full text-xl font-semibold hover:bg-white hover:text-green-800 transition-all cursor-pointer whitespace-nowrap">
            <i className="ri-calendar-event-line mr-3"></i>
            Book Farm Tour
          </button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-truck-line text-3xl text-white"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
            <p className="text-green-200">On orders over $50</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-shield-check-line text-3xl text-white"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Quality Guarantee</h3>
            <p className="text-green-200">100% satisfaction promise</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-leaf-line text-3xl text-white"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Certified Organic</h3>
            <p className="text-green-200">Kenya Organic Agriculture Network</p>
          </div>
        </div>
      </div>
    </section>
  );
}