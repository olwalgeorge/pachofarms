'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://readdy.ai/api/search-image?query=Lush%20organic%20farm%20landscape%20with%20rows%20of%20vibrant%20chili%20plants%20in%20foreground%2C%20golden%20sunset%20lighting%20casting%20warm%20glow%20over%20fertile%20agricultural%20fields%2C%20rustic%20wooden%20fence%20posts%2C%20rolling%20hills%20in%20background%2C%20rich%20soil%20textures%2C%20natural%20farming%20environment%20with%20authentic%20rural%20atmosphere%2C%20professional%20agricultural%20photography%20style&width=1200&height=600&seq=hero1&orientation=landscape')`
      }}
    >
      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Fresh from Our
            <span className="text-green-400 block">Organic Farm</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-90">
            Premium African & Asian chili varieties grown with passion and tradition. 
            Experience the authentic flavors of heritage horticulture at Pacho Farm.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/products">
              <button className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 cursor-pointer whitespace-nowrap">
                <i className="ri-shopping-cart-line mr-2"></i>
                Order Fresh Produce
              </button>
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-green-800 transition-all cursor-pointer whitespace-nowrap">
              <i className="ri-calendar-line mr-2"></i>
              Book Farm Experience
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-8 flex items-center justify-center">
          <i className="ri-arrow-down-line text-2xl text-white"></i>
        </div>
      </div>
    </section>
  );
}