
'use client';

import { useState } from 'react';

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Grace Otieno",
      role: "Restaurant Owner",
      location: "Kisumu, Kenya",
      text: "Pacho Farm's chilies have transformed our nyama choma and traditional dishes. The African Bird's Eye peppers add authentic heat that our customers from across Lake Victoria region absolutely love.",
      rating: 5,
      image: "https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20smiling%20Kenyan%20woman%20restaurant%20owner%20in%20modern%20Kisumu%20restaurant%2C%20warm%20lighting%2C%20confident%20African%20businesswoman%20appearance%2C%20traditional%20and%20modern%20elements%20in%20background&width=80&height=80&seq=testimonial1kenya&orientation=squarish"
    },
    {
      name: "Chef Peter Mboya",
      role: "Executive Chef",
      location: "Nairobi, Kenya",
      text: "As someone who specializes in fusion cuisine blending Luo traditions with international flavors, Pacho Farm's authentic chili varieties from Kisumu are exceptional. The quality rivals anything from international suppliers.",
      rating: 5,
      image: "https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20Kenyan%20male%20chef%20in%20white%20chef%20coat%2C%20modern%20hotel%20kitchen%20background%20in%20Nairobi%2C%20confident%20African%20culinary%20professional%20appearance%2C%20warm%20lighting&width=80&height=80&seq=testimonial2kenya&orientation=squarish"
    },
    {
      name: "Mary Awino",
      role: "Home Cook & Food Blogger",
      location: "Kisumu, Kenya",
      text: "I've been ordering from Pacho Farm for two years now. Their ghost peppers and traditional varieties help me create authentic recipes that connect our Luo heritage with modern cooking techniques.",
      rating: 5,
      image: "https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20smiling%20Kenyan%20woman%20food%20blogger%20in%20traditional%20modern%20kitchen%2C%20Kisumu%20home%20setting%2C%20warm%20natural%20lighting%2C%20African%20home%20cooking%20enthusiast%20appearance&width=80&height=80&seq=testimonial3kenya&orientation=squarish"
    },
    {
      name: "Samuel Ochieng",
      role: "Specialty Food Store Owner",
      location: "Kisumu City, Kenya",
      text: "Our customers specifically ask for Pacho Farm chilies by name. The organic certification and heritage varieties make them stand out in our premium produce section at Kisumu Central Market.",
      rating: 5,
      image: "https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20middle-aged%20Kenyan%20man%20with%20friendly%20smile%20in%20specialty%20food%20store%2C%20organic%20produce%20background%2C%20Kisumu%20market%20setting%2C%20natural%20lighting%2C%20African%20business%20owner%20headshot&width=80&height=80&seq=testimonial4kenya&orientation=squarish"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From professional chefs to home cooking enthusiasts across Kenya, discover why people 
            choose Pacho Farm for their premium chili needs.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex items-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <div key={i} className="w-6 h-6 flex items-center justify-center">
                    <i className="ri-star-fill text-yellow-400 text-xl"></i>
                  </div>
                ))}
              </div>
              
              <blockquote className="text-2xl md:text-3xl text-gray-700 leading-relaxed mb-8 font-light italic">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img 
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-16 h-16 rounded-full object-cover object-top"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-green-800">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-green-600 font-medium">
                      {testimonials[currentTestimonial].role}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {testimonials[currentTestimonial].location}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={prevTestimonial}
                    className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <i className="ri-arrow-left-line text-green-600 text-xl"></i>
                  </button>
                  <button 
                    onClick={nextTestimonial}
                    className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <i className="ri-arrow-right-line text-green-600 text-xl"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
                  index === currentTestimonial ? 'bg-green-600' : 'bg-green-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
