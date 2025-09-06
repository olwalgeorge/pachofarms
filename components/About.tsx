
'use client';

import { useState } from 'react';

export default function About() {
  const [showStory, setShowStory] = useState(false);

  const toggleStory = () => {
    setShowStory(!showStory);
  };

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
              Heritage Farming
              <span className="text-green-600 block">Since 1985</span>
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              At Pacho Farm, we specialize in cultivating the finest African and Asian chili varieties 
              using traditional organic farming methods passed down through generations. Our commitment 
              to sustainable horticulture ensures every harvest delivers exceptional flavor and quality.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-leaf-line text-2xl text-green-600"></i>
                </div>
                <h3 className="font-semibold text-green-800 mb-2">100% Organic</h3>
                <p className="text-sm text-gray-600">No pesticides or chemicals</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-seedling-line text-2xl text-green-600"></i>
                </div>
                <h3 className="font-semibold text-green-800 mb-2">Heritage Seeds</h3>
                <p className="text-sm text-gray-600">Authentic varieties preserved</p>
              </div>
            </div>
            <button 
              onClick={toggleStory}
              className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              {showStory ? 'Hide Our Story' : 'Learn Our Story'}
            </button>
          </div>
          
          <div className="relative">
            <img 
              src="https://readdy.ai/api/search-image?query=Experienced%20farmer%20hands%20holding%20fresh%20harvested%20colorful%20chili%20peppers%2C%20various%20African%20and%20Asian%20chili%20varieties%20in%20wicker%20basket%2C%20rustic%20wooden%20farm%20background%2C%20warm%20natural%20lighting%2C%20authentic%20organic%20farming%20lifestyle%2C%20detailed%20close-up%20showing%20texture%20and%20vibrant%20colors%20of%20different%20chili%20types&width=500&height=600&seq=about1&orientation=portrait"
              alt="Fresh harvested chilies"
              className="rounded-2xl shadow-2xl object-cover w-full h-full"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-2xl font-bold text-green-800">25+</h4>
              <p className="text-gray-600">Chili Varieties</p>
            </div>
          </div>
        </div>

        {showStory && (
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 md:p-12 transition-all duration-500">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-green-800 mb-6">Our Family Legacy</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Founded by Joseph Pacho in 1985, our farm began as a small plot of land in Kisumu with just 
                  five chili varieties. Joseph's passion for preserving authentic African pepper seeds led him 
                  to travel across Kenya, collecting heritage varieties from local farmers.
                </p>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Today, his daughter Sarah continues the tradition, expanding our collection to include rare 
                  Asian varieties while maintaining the same organic principles. Every seed is hand-selected, 
                  every plant is naturally grown, and every harvest reflects our commitment to quality.
                </p>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">39</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">500+</div>
                    <div className="text-sm text-gray-600">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">100%</div>
                    <div className="text-sm text-gray-600">Organic Certified</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://readdy.ai/api/search-image?query=African%20family%20farmer%20portrait%20in%20chili%20pepper%20field%2C%20traditional%20farming%20tools%2C%20generations%20working%20together%20on%20organic%20farm%2C%20warm%20golden%20hour%20lighting%2C%20authentic%20rural%20Kenya%20landscape%2C%20heritage%20agricultural%20practices%2C%20family%20legacy%20farming%20story&width=500&height=400&seq=story1&orientation=landscape"
                  alt="Pacho family farming legacy"
                  className="rounded-xl shadow-lg object-cover w-full h-80"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
