import { Search, Building2, CreditCard, BarChart3, Shield, Clock, Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a2e4a] to-[#2c4a6e] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl mb-6">
                Find Your Perfect Home in East Africa
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                Your property, managed smarter. Browse thousands of listings across Kenya, Tanzania, and Uganda.
              </p>

              {/* Search Bar */}
              <div className="bg-white rounded-lg p-2 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <select className="px-4 py-3 bg-gray-50 rounded-md text-gray-800">
                    <option>Location</option>
                    <option>Nairobi, Kenya</option>
                    <option>Dar es Salaam, Tanzania</option>
                    <option>Kampala, Uganda</option>
                    <option>Mombasa, Kenya</option>
                  </select>
                  <select className="px-4 py-3 bg-gray-50 rounded-md text-gray-800">
                    <option>Property Type</option>
                    <option>Apartment</option>
                    <option>House</option>
                    <option>Studio</option>
                    <option>Commercial</option>
                  </select>
                  <select className="px-4 py-3 bg-gray-50 rounded-md text-gray-800">
                    <option>Price Range</option>
                    <option>KES 10,000 - 30,000</option>
                    <option>KES 30,000 - 60,000</option>
                    <option>KES 60,000 - 100,000</option>
                    <option>KES 100,000+</option>
                  </select>
                </div>
                <button
                  onClick={() => navigate('/search')}
                  className="w-full mt-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white px-6 py-3 rounded-md flex items-center justify-center gap-2"
                >
                  <Search className="h-5 w-5" />
                  Search Properties
                </button>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => navigate('/onboarding')}
                  className="px-6 py-3 bg-[#2ecc71] hover:bg-[#27ae60] rounded-lg"
                >
                  I'm Looking for a Home
                </button>
                <button
                  onClick={() => navigate('/pricing')}
                  className="px-6 py-3 border border-white hover:bg-white hover:text-[#1a2e4a] rounded-lg"
                >
                  I'm a Landlord
                </button>
              </div>
            </div>

            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&h=400&fit=crop"
                alt="Modern apartments in East Africa"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-[#1a2e4a] mb-4">Why Choose NestKenya?</h2>
            <p className="text-xl text-gray-600">Everything you need to manage properties or find your dream home</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-[#2ecc71] rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl text-[#1a2e4a] mb-2">Smart Search</h3>
              <p className="text-gray-600">
                Advanced filters and interactive maps help you find properties that match your exact needs.
              </p>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-[#2ecc71] rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl text-[#1a2e4a] mb-2">Easy Payments</h3>
              <p className="text-gray-600">
                Tenants can pay rent online with M-Pesa, cards, or bank transfer. Landlords get instant notifications.
              </p>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-[#2ecc71] rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl text-[#1a2e4a] mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Real-time insights on occupancy rates, revenue, and tenant payments for informed decisions.
              </p>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-[#2ecc71] rounded-lg flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl text-[#1a2e4a] mb-2">Property Management</h3>
              <p className="text-gray-600">
                Manage multiple properties, track maintenance requests, and communicate with tenants in one place.
              </p>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-[#2ecc71] rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl text-[#1a2e4a] mb-2">Verified Listings</h3>
              <p className="text-gray-600">
                All properties are verified with photos, documents, and landlord credentials for your safety.
              </p>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-[#2ecc71] rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl text-[#1a2e4a] mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our support team is always ready to help landlords and tenants resolve any issues quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-[#1a2e4a] mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Trusted by thousands across East Africa</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-[#2ecc71] text-[#2ecc71]" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "NestKenya made it so easy to manage my 15 rental units in Nairobi. Rent collection is automated and I can track everything from my phone!"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#1a2e4a] rounded-full flex items-center justify-center text-white">
                  JK
                </div>
                <div>
                  <p>James Kariuki</p>
                  <p className="text-sm text-gray-500">Landlord, Nairobi</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-[#2ecc71] text-[#2ecc71]" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "I found my dream apartment in Dar es Salaam within a week! The map view and filters saved me so much time compared to traditional searching."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#1a2e4a] rounded-full flex items-center justify-center text-white">
                  AM
                </div>
                <div>
                  <p>Amina Mwangi</p>
                  <p className="text-sm text-gray-500">Tenant, Dar es Salaam</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-[#2ecc71] text-[#2ecc71]" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The maintenance request feature is a game changer. My tenants submit requests directly and I can track repairs without endless phone calls."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#1a2e4a] rounded-full flex items-center justify-center text-white">
                  PM
                </div>
                <div>
                  <p>Peter Mugisha</p>
                  <p className="text-sm text-gray-500">Property Manager, Kampala</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-[#1a2e4a] mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your portfolio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
              <h3 className="text-2xl text-[#1a2e4a] mb-2">Starter</h3>
              <p className="text-gray-600 mb-4">For individual landlords</p>
              <p className="text-4xl mb-6">
                <span className="text-[#1a2e4a]">KES 2,999</span>
                <span className="text-lg text-gray-500">/month</span>
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-[#2ecc71] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Up to 5 properties</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-[#2ecc71] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Online rent collection</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-[#2ecc71] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Basic analytics</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('/pricing')}
                className="w-full py-2 border-2 border-[#1a2e4a] text-[#1a2e4a] hover:bg-[#1a2e4a] hover:text-white rounded-lg"
              >
                Learn More
              </button>
            </div>

            <div className="p-6 bg-[#2ecc71] text-white rounded-lg shadow-xl relative">
              <div className="absolute -top-3 right-6 bg-[#1a2e4a] text-white px-3 py-1 rounded-full text-sm">
                Most Popular
              </div>
              <h3 className="text-2xl mb-2">Growth</h3>
              <p className="text-green-100 mb-4">For growing portfolios</p>
              <p className="text-4xl mb-6">
                <span>KES 6,999</span>
                <span className="text-lg text-green-100">/month</span>
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-white rounded-full flex items-center justify-center">
                    <span className="text-[#2ecc71] text-xs">✓</span>
                  </div>
                  <span>Up to 20 properties</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-white rounded-full flex items-center justify-center">
                    <span className="text-[#2ecc71] text-xs">✓</span>
                  </div>
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-white rounded-full flex items-center justify-center">
                    <span className="text-[#2ecc71] text-xs">✓</span>
                  </div>
                  <span>Tenant screening</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('/pricing')}
                className="w-full py-2 bg-white text-[#2ecc71] hover:bg-gray-100 rounded-lg"
              >
                Start Free Trial
              </button>
            </div>

            <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
              <h3 className="text-2xl text-[#1a2e4a] mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-4">For large portfolios</p>
              <p className="text-4xl mb-6">
                <span className="text-[#1a2e4a]">Custom</span>
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-[#2ecc71] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Unlimited properties</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-[#2ecc71] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>API access</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-[#2ecc71] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Dedicated support</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('/pricing')}
                className="w-full py-2 border-2 border-[#1a2e4a] text-[#1a2e4a] hover:bg-[#1a2e4a] hover:text-white rounded-lg"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#1a2e4a] to-[#2c4a6e] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-200 mb-8">
            Join thousands of landlords and tenants across Kenya, Tanzania, and Uganda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/search')}
              className="px-8 py-3 bg-[#2ecc71] hover:bg-[#27ae60] rounded-lg text-lg"
            >
              Browse Properties
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="px-8 py-3 bg-white text-[#1a2e4a] hover:bg-gray-100 rounded-lg text-lg"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
