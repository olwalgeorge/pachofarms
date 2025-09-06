
'use client';

import { useState } from 'react';
import { useFavorites } from '../../components/FavoritesProvider';
import { useCart } from '../../components/CartProvider';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const products = [
  {
    id: 1,
    name: "Bird's Eye Chili",
    price: 24.99,
    image: "https://readdy.ai/api/search-image?query=Fresh%20birds%20eye%20chili%20peppers%2C%20vibrant%20red%20and%20orange%20small%20hot%20peppers%2C%20arranged%20on%20rustic%20wooden%20surface%2C%20natural%20lighting%2C%20organic%20farm%20fresh%20produce&width=400&height=300&seq=product1&orientation=landscape",
    description: "Extremely hot chili peppers perfect for authentic Asian cuisine",
    category: "Super Hot",
    heat: "100,000 SHU",
    origin: "Southeast Asia"
  },
  {
    id: 2,
    name: "Habanero Mix",
    price: 19.99,
    image: "https://readdy.ai/api/search-image?query=Colorful%20habanero%20peppers%20mix%2C%20orange%20red%20yellow%20habaneros%2C%20fresh%20whole%20peppers%20on%20clean%20white%20background%2C%20vibrant%20colors%2C%20premium%20quality%20produce&width=400&height=300&seq=product2&orientation=landscape",
    description: "Fruity and fiery habanero peppers with intense heat",
    category: "Hot",
    heat: "350,000 SHU",
    origin: "Caribbean"
  },
  {
    id: 3,
    name: "Thai Dragon",
    price: 22.99,
    image: "https://readdy.ai/api/search-image?query=Thai%20dragon%20chili%20peppers%2C%20long%20thin%20red%20hot%20peppers%2C%20fresh%20spicy%20chilies%20arranged%20artistically%2C%20clean%20background%2C%20traditional%20Thai%20cooking%20ingredients&width=400&height=300&seq=product3&orientation=landscape",
    description: "Long, thin peppers with serious heat for Thai cooking",
    category: "Hot",
    heat: "50,000 SHU",
    origin: "Thailand"
  },
  {
    id: 4,
    name: "Carolina Reaper",
    price: 34.99,
    image: "https://readdy.ai/api/search-image?query=Carolina%20reaper%20peppers%2C%20worlds%20hottest%20pepper%2C%20wrinkled%20red%20superhot%20peppers%2C%20dangerous%20looking%20chili%20peppers%2C%20extreme%20heat%20warning%2C%20premium%20quality&width=400&height=300&seq=product4&orientation=landscape",
    description: "World's hottest pepper - handle with extreme caution!",
    category: "Extreme",
    heat: "2,200,000 SHU",
    origin: "South Carolina"
  },
  {
    id: 5,
    name: "Jalapeño Fresh",
    price: 12.99,
    image: "https://readdy.ai/api/search-image?query=Fresh%20green%20jalapeno%20peppers%2C%20medium%20heat%20peppers%2C%20glossy%20green%20chilies%20in%20basket%2C%20Mexican%20cooking%20peppers%2C%20mild%20to%20medium%20spice%20level&width=400&height=300&seq=product5&orientation=landscape",
    description: "Classic medium-heat peppers perfect for everyday cooking",
    category: "Medium",
    heat: "5,000 SHU",
    origin: "Mexico"
  },
  {
    id: 6,
    name: "Ghost Pepper",
    price: 29.99,
    image: "https://readdy.ai/api/search-image?query=Ghost%20pepper%20bhut%20jolokia%2C%20wrinkled%20orange%20red%20superhot%20peppers%2C%20extremely%20hot%20Indian%20peppers%2C%20warning%20level%20spiciness%2C%20traditional%20Indian%20chilies&width=400&height=300&seq=product6&orientation=landscape",
    description: "Bhut jolokia - the legendary ghost pepper from India",
    category: "Extreme",
    heat: "1,000,000 SHU",
    origin: "India"
  },
  {
    id: 7,
    name: "Serrano Verde",
    price: 15.99,
    image: "https://readdy.ai/api/search-image?query=Fresh%20green%20serrano%20peppers%2C%20small%20hot%20Mexican%20peppers%2C%20bright%20green%20chilies%2C%20authentic%20Mexican%20cooking%20ingredients%2C%20medium-hot%20spice%20level&width=400&height=300&seq=product7&orientation=landscape",
    description: "Bright, crisp peppers with vibrant heat",
    category: "Medium",
    heat: "25,000 SHU",
    origin: "Mexico"
  },
  {
    id: 8,
    name: "Scotch Bonnet",
    price: 26.99,
    image: "https://readdy.ai/api/search-image?query=Scotch%20bonnet%20peppers%2C%20colorful%20Caribbean%20hot%20peppers%2C%20yellow%20orange%20red%20peppers%2C%20traditional%20Caribbean%20cooking%2C%20fruity%20hot%20peppers&width=400&height=300&seq=product8&orientation=landscape",
    description: "Caribbean favorite with fruity heat and incredible flavor",
    category: "Hot",
    heat: "350,000 SHU",
    origin: "Caribbean"
  },
  {
    id: 9,
    name: "Cayenne Long",
    price: 16.99,
    image: "https://readdy.ai/api/search-image?query=Long%20red%20cayenne%20peppers%2C%20thin%20dried%20red%20chili%20peppers%2C%20classic%20spicy%20seasoning%20peppers%2C%20traditional%20cooking%20spices%2C%20medium-hot%20dried%20chilies&width=400&height=300&seq=product9&orientation=landscape",
    description: "Classic long red peppers perfect for drying and spice making",
    category: "Medium",
    heat: "30,000 SHU",
    origin: "French Guiana"
  },
  {
    id: 10,
    name: "Poblano Premium",
    price: 14.99,
    image: "https://readdy.ai/api/search-image?query=Dark%20green%20poblano%20peppers%2C%20large%20mild%20Mexican%20peppers%2C%20perfect%20for%20stuffing%2C%20traditional%20Mexican%20cooking%2C%20mild%20heat%20level%20peppers&width=400&height=300&seq=product10&orientation=landscape",
    description: "Large, mild peppers perfect for stuffing and roasting",
    category: "Mild",
    heat: "2,000 SHU",
    origin: "Mexico"
  },
  {
    id: 11,
    name: "Hungarian Wax",
    price: 13.99,
    image: "https://readdy.ai/api/search-image?query=Yellow%20Hungarian%20wax%20peppers%2C%20bright%20yellow%20hot%20peppers%2C%20European%20chili%20variety%2C%20mild%20to%20medium%20heat%2C%20traditional%20European%20cooking%20peppers&width=400&height=300&seq=product11&orientation=landscape",
    description: "Bright yellow peppers with moderate heat and tangy flavor",
    category: "Medium",
    heat: "8,000 SHU",
    origin: "Hungary"
  },
  {
    id: 12,
    name: "Fresno Red",
    price: 17.99,
    image: "https://readdy.ai/api/search-image?query=Red%20fresno%20peppers%2C%20medium-hot%20red%20chilies%2C%20California%20grown%20peppers%2C%20bright%20red%20color%2C%20fresh%20spicy%20peppers%20for%20cooking&width=400&height=300&seq=product12&orientation=landscape",
    description: "California-grown red peppers with balanced heat and sweetness",
    category: "Medium",
    heat: "10,000 SHU",
    origin: "California"
  },
  {
    id: 13,
    name: "Bell Pepper Mix",
    price: 9.99,
    image: "https://readdy.ai/api/search-image?query=Colorful%20bell%20peppers%20mix%2C%20red%20yellow%20green%20bell%20peppers%2C%20sweet%20peppers%20no%20heat%2C%20fresh%20vegetables%20for%20cooking%2C%20vibrant%20colors&width=400&height=300&seq=product13&orientation=landscape",
    description: "Sweet, crisp peppers with no heat - perfect for beginners",
    category: "No Heat",
    heat: "0 SHU",
    origin: "Worldwide"
  }
];

const categories = ["All", "No Heat", "Mild", "Medium", "Hot", "Super Hot", "Extreme"];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  const filteredProducts = products.filter(product => 
    selectedCategory === "All" || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "heat":
        return parseInt(b.heat.replace(/[^\d]/g, '')) - parseInt(a.heat.replace(/[^\d]/g, ''));
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleFavoriteToggle = (product: typeof products[0]) => {
    const isFavorited = favorites.some(fav => fav.id === product.id);
    if (isFavorited) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Premium Chili Collection</h1>
            <p className="text-xl text-green-100 mb-8">From mild to extreme - find your perfect heat level</p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full">
                <span className="text-sm font-medium">Farm Fresh</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full">
                <span className="text-sm font-medium">Organic Grown</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full">
                <span className="text-sm font-medium">Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Category Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Heat Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
              >
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="heat">Heat Level: High to Low</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{sortedProducts.length}</span> of <span className="font-semibold">{products.length}</span> products
              {selectedCategory !== "All" && (
                <span className="ml-2 text-green-600">in {selectedCategory} category</span>
              )}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group" data-product-shop>
              <div className="aspect-w-4 aspect-h-3 relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    product.category === 'Extreme' ? 'bg-red-600 text-white' :
                    product.category === 'Super Hot' ? 'bg-orange-600 text-white' :
                    product.category === 'Hot' ? 'bg-red-500 text-white' :
                    product.category === 'Medium' ? 'bg-yellow-500 text-white' :
                    product.category === 'Mild' ? 'bg-green-500 text-white' :
                    'bg-blue-500 text-white'
                  }`}>
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Heat Level:</span>
                      <span className="font-semibold text-red-600">{product.heat}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Origin:</span>
                      <span className="text-gray-700">{product.origin}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-600">${product.price}</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i key={star} className="ri-star-fill text-sm"></i>
                      ))}
                    </div>
                    <span className="text-gray-500 text-sm">(4.8)</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 py-2 px-3 rounded-full text-sm font-semibold transition-colors whitespace-nowrap bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                  >
                    <i className="ri-shopping-cart-line mr-1"></i>Add to Cart
                  </button>
                  <button
                    onClick={() => handleFavoriteToggle(product)}
                    className="px-3 py-2 border-2 border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-colors cursor-pointer"
                  >
                    <i className={favorites.some(fav => fav.id === product.id) ? "ri-heart-fill" : "ri-heart-line"}></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Products Message */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <i className="ri-search-line text-6xl text-gray-300"></i>
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">No products found</h3>
            <p className="text-gray-500 mb-6">
              No peppers match your current filters. Try selecting a different category.
            </p>
            <button
              onClick={() => setSelectedCategory("All")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              View All Products
            </button>
          </div>
        )}
      </div>

      {/* Newsletter CTA */}
      <div className="bg-green-600 text-white py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with New Varieties</h2>
          <p className="text-xl text-green-100 mb-8">
            Be the first to know about new pepper varieties, growing tips, and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-300 focus:outline-none"
            />
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
