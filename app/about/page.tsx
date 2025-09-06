
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Pacho Farm</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              For over 25 years, we've been growing the world's finest chili peppers with passion, 
              dedication, and sustainable farming practices.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img
                src="https://readdy.ai/api/search-image?query=Organic%20chili%20pepper%20farm%20with%20rows%20of%20pepper%20plants%2C%20sustainable%20agriculture%2C%20green%20fields%20under%20blue%20sky%2C%20farmer%20working%20in%20pepper%20field%2C%20natural%20farming%20environment&width=600&height=400&seq=about1&orientation=landscape"
                alt="Pacho Farm Fields"
                className="w-full h-80 object-cover object-top rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 1998 by the Pacho family, our farm started as a small plot of land with a big dream: 
                to grow the most flavorful and highest quality chili peppers in the region.
              </p>
              <p className="text-gray-600 mb-4">
                Today, we cultivate over 50 varieties of peppers across 200 acres, from mild bell peppers 
                to the world's hottest superhots, all grown using organic and sustainable methods.
              </p>
              <p className="text-gray-600">
                Every pepper is hand-picked at peak ripeness and carefully processed to preserve maximum 
                flavor and heat, ensuring you get the freshest, most potent peppers possible.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-leaf-line text-2xl text-green-600"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Sustainable</h3>
                <p className="text-gray-600">
                  We use eco-friendly farming practices that protect our soil and environment for future generations.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-award-line text-2xl text-green-600"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality</h3>
                <p className="text-gray-600">
                  Every pepper is carefully selected and tested to ensure it meets our high standards for flavor and heat.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-heart-line text-2xl text-green-600"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Passion</h3>
                <p className="text-gray-600">
                  Growing peppers isn't just our business - it's our passion and we love sharing it with fellow enthusiasts.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet the Team</h2>
              <p className="text-gray-600 mb-4">
                Our experienced team of farmers, botanists, and pepper enthusiasts work together to bring you 
                the finest chili peppers from around the world.
              </p>
              <p className="text-gray-600 mb-6">
                Led by founder Maria Pacho, our team combines traditional farming wisdom with modern 
                agricultural techniques to consistently produce exceptional peppers.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-green-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Maria Pacho</h4>
                    <p className="text-sm text-gray-600">Founder & Head Farmer</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-green-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Carlos Martinez</h4>
                    <p className="text-sm text-gray-600">Agricultural Specialist</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-green-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Dr. Elena Rodriguez</h4>
                    <p className="text-sm text-gray-600">Plant Botanist</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://readdy.ai/api/search-image?query=Happy%20farming%20team%20working%20together%20in%20chili%20pepper%20greenhouse%2C%20diverse%20group%20of%20farmers%20and%20agricultural%20specialists%2C%20professional%20farming%20environment%2C%20teamwork%20in%20agriculture&width=600&height=400&seq=about2&orientation=landscape"
                alt="Pacho Farm Team"
                className="w-full h-80 object-cover object-top rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
