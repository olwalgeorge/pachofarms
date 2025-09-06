
'use client';
import { useCart } from './CartProvider';
import { useFavorites } from './FavoritesProvider';

export default function Products() {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const products = [
    {
      id: 1,
      name: "Bird's Eye Chili",
      price: 12.99,
      image: "https://readdy.ai/api/search-image?query=Fresh%20birds%20eye%20chili%20peppers%20vibrant%20red%20and%20green%20small%20hot%20peppers%20in%20rustic%20wooden%20bowl%20on%20farm%20table%20with%20soft%20natural%20lighting%20clean%20simple%20background&width=400&height=400&seq=product1&orientation=squarish",
      category: "Hot Peppers",
      description: "Small but mighty! These fiery gems pack intense heat and bold flavor.",
      inStock: true
    },
    {
      id: 2,
      name: "Habanero Mix",
      price: 15.99,
      image: "https://readdy.ai/api/search-image?query=Colorful%20habanero%20peppers%20mix%20orange%20red%20yellow%20varieties%20fresh%20organic%20chilies%20displayed%20in%20woven%20basket%20on%20rustic%20farm%20counter%20natural%20lighting%20clean%20background&width=400&height=400&seq=product2&orientation=squarish",
      category: "Super Hot",
      description: "A colorful blend of orange, red, and chocolate habaneros with fruity heat.",
      inStock: true
    },
    {
      id: 3,
      name: "Thai Dragon",
      price: 9.99,
      image: "https://readdy.ai/api/search-image?query=Thai%20dragon%20chili%20peppers%20long%20slender%20red%20hot%20peppers%20fresh%20organic%20arranged%20on%20bamboo%20mat%20with%20natural%20farm%20lighting%20clean%20minimal%20background&width=400&height=400&seq=product3&orientation=squarish",
      category: "Asian Varieties",
      description: "Long, slender peppers with a perfect balance of heat and flavor.",
      inStock: true
    },
    {
      id: 4,
      name: "Carolina Reaper",
      price: 24.99,
      image: "https://readdy.ai/api/search-image?query=Carolina%20reaper%20peppers%20extremely%20hot%20red%20wrinkled%20superhot%20chili%20peppers%20few%20pieces%20on%20wooden%20cutting%20board%20with%20warning%20sign%20natural%20lighting%20clean%20background&width=400&height=400&seq=product4&orientation=squarish",
      category: "Extreme Heat",
      description: "The world's hottest pepper! Handle with extreme caution.",
      inStock: true
    },
    {
      id: 5,
      name: "Ghost Pepper",
      price: 19.99,
      image: "https://readdy.ai/api/search-image?query=Ghost%20pepper%20bhut%20jolokia%20red%20wrinkled%20extremely%20hot%20chili%20peppers%20on%20dark%20slate%20board%20with%20dramatic%20lighting%20clean%20simple%20background&width=400&height=400&seq=product5&orientation=squarish",
      category: "Extreme Heat",
      description: "Also known as Bhut jolokia, these peppers bring serious heat.",
      inStock: true
    },
    {
      id: 6,
      name: "Scotch Bonnet",
      price: 16.99,
      image: "https://readdy.ai/api/search-image?query=Scotch%20bonnet%20peppers%20colorful%20hot%20Caribbean%20chilies%20orange%20yellow%20red%20varieties%20fresh%20organic%20in%20small%20ceramic%20bowls%20natural%20lighting%20clean%20background&width=400&height=400&seq=product6&orientation=squarish",
      category: "Caribbean",
      description: "Essential for Caribbean cuisine, offering heat with tropical flavor notes.",
      inStock: false
    },
    {
      id: 7,
      name: "Jalapeño Premium",
      price: 8.99,
      image: "https://readdy.ai/api/search-image?query=Fresh%20jalape%C3%B1o%20peppers%20premium%20quality%20green%20medium%20heat%20chilies%20arranged%20in%20rustic%20wooden%20crate%20farm%20fresh%20organic%20natural%20lighting%20clean%20background&width=400&height=400&seq=product7&orientation=squarish",
      category: "Medium Heat",
      description: "Classic medium-heat peppers perfect for everyday cooking.",
      inStock: true
    },
    {
      id: 8,
      name: "Serrano Green",
      price: 10.99,
      image: "https://readdy.ai/api/search-image?query=Serrano%20peppers%20fresh%20green%20hot%20chilies%20small%20slender%20peppers%20arranged%20on%20marble%20surface%20with%20herbs%20natural%20lighting%20clean%20minimal%20background&width=400&height=400&seq=product8&orientation=squarish",
      category: "Hot Peppers",
      description: "Crisp, clean heat with bright flavor - perfect for salsas.",
      inStock: true
    },
    {
      id: 9,
      name: "Poblano Mild",
      price: 7.99,
      image: "https://readdy.ai/api/search-image?query=Poblano%20peppers%20large%20dark%20green%20mild%20chilies%20fresh%20organic%20arranged%20on%20wooden%20farm%20table%20with%20natural%20lighting%20clean%20simple%20background&width=400&height=400&seq=product9&orientation=squarish",
      category: "Mild Heat",
      description: "Large, mild peppers ideal for stuffing and roasting.",
      inStock: true
    }
  ];

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  const handleToggleFavorite = (product: any) => {
    toggleFavorite({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description,
      inStock: product.inStock
    });
  };

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Premium Chili Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From mild to wild, discover our carefully cultivated selection of the world's finest chili peppers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300" data-product-shop>
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-64 object-cover object-top"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Out of Stock
                    </span>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => handleToggleFavorite(product)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    <i className={`${isFavorite(product.id) ? 'ri-heart-fill text-red-500' : 'ri-heart-line text-gray-600 hover:text-red-500'} w-5 h-5 flex items-center justify-center transition-colors`}></i>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {product.description}
                </p>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className="flex-1 py-2 px-3 rounded-full text-sm font-semibold transition-colors whitespace-nowrap bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <i className="ri-shopping-cart-line mr-1"></i>
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                  <button
                    onClick={() => handleToggleFavorite(product)}
                    className="px-3 py-2 border-2 border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-colors cursor-pointer"
                  >
                    <i className={`${isFavorite(product.id) ? 'ri-heart-fill' : 'ri-heart-line'}`}></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Contact us for custom orders and seasonal varieties.
          </p>
          <a 
            href="#contact" 
            className="inline-flex items-center bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-message-line mr-2"></i>
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
