import { useState } from 'react';
import { Search, MapPin, BedDouble, Star, Sliders, Map as MapIcon, List } from 'lucide-react';
import { useNavigate } from 'react-router';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const MOCK_PROPERTIES = [
  {
    id: 1,
    title: '2BR Modern Apartment in Westlands',
    location: 'Westlands, Nairobi, Kenya',
    price: 'KES 45,000',
    bedrooms: 2,
    rating: 4.8,
    reviews: 24,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
    lat: -1.2632,
    lng: 36.8054,
  },
  {
    id: 2,
    title: '3BR Family House with Garden',
    location: 'Karen, Nairobi, Kenya',
    price: 'KES 85,000',
    bedrooms: 3,
    rating: 4.9,
    reviews: 18,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    lat: -1.3206,
    lng: 36.7073,
  },
  {
    id: 3,
    title: 'Studio Apartment - CBD',
    location: 'Central Business District, Nairobi, Kenya',
    price: 'KES 28,000',
    bedrooms: 1,
    rating: 4.5,
    reviews: 32,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
    lat: -1.2864,
    lng: 36.8172,
  },
  {
    id: 4,
    title: 'Luxury 4BR Penthouse',
    location: 'Kilimani, Nairobi, Kenya',
    price: 'KES 120,000',
    bedrooms: 4,
    rating: 5.0,
    reviews: 12,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
    lat: -1.2921,
    lng: 36.7833,
  },
  {
    id: 5,
    title: '2BR Beachfront Apartment',
    location: 'Nyali, Mombasa, Kenya',
    price: 'KES 55,000',
    bedrooms: 2,
    rating: 4.7,
    reviews: 28,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
    lat: -4.0435,
    lng: 39.7224,
  },
  {
    id: 6,
    title: '1BR Serviced Apartment',
    location: 'Masaki, Dar es Salaam, Tanzania',
    price: 'TZS 850,000',
    bedrooms: 1,
    rating: 4.6,
    reviews: 15,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    lat: -6.7924,
    lng: 39.2793,
  },
  {
    id: 7,
    title: '3BR Villa in Kampala',
    location: 'Kololo, Kampala, Uganda',
    price: 'UGX 2,500,000',
    bedrooms: 3,
    rating: 4.8,
    reviews: 21,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
    lat: 0.3163,
    lng: 32.5825,
  },
  {
    id: 8,
    title: '2BR Garden Apartment',
    location: 'Runda, Nairobi, Kenya',
    price: 'KES 65,000',
    bedrooms: 2,
    rating: 4.9,
    reviews: 19,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
    lat: -1.2167,
    lng: 36.7833,
  },
];

export default function PropertySearch() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'split' | 'list'>('split');
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Search Bar */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location, neighborhood, or property name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Sliders className="h-5 w-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('split')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  viewMode === 'split'
                    ? 'bg-[#1a2e4a] text-white'
                    : 'bg-white border border-gray-300'
                }`}
              >
                <MapIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Map</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  viewMode === 'list'
                    ? 'bg-[#1a2e4a] text-white'
                    : 'bg-white border border-gray-300'
                }`}
              >
                <List className="h-5 w-5" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:border-[#2ecc71] whitespace-nowrap">
              Price: Any
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:border-[#2ecc71] whitespace-nowrap">
              Bedrooms: Any
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:border-[#2ecc71] whitespace-nowrap">
              Property Type: All
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:border-[#2ecc71] whitespace-nowrap">
              City: All
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className={`flex ${viewMode === 'split' ? 'h-[calc(100vh-200px)]' : ''}`}>
        {/* Listings */}
        <div
          className={`${
            viewMode === 'split' ? 'w-1/2 overflow-y-auto' : 'w-full'
          } p-4`}
        >
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-600 mb-4">{MOCK_PROPERTIES.length} properties found</p>

            <div className="space-y-4">
              {MOCK_PROPERTIES.map((property) => (
                <div
                  key={property.id}
                  onClick={() => navigate(`/property/${property.id}`)}
                  onMouseEnter={() => setSelectedProperty(property.id)}
                  onMouseLeave={() => setSelectedProperty(null)}
                  className={`bg-white border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                    selectedProperty === property.id
                      ? 'border-[#2ecc71] shadow-lg'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full sm:w-64 h-48 object-cover"
                    />
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg text-[#1a2e4a]">{property.title}</h3>
                        <button className="px-3 py-1 bg-[#2ecc71] text-white rounded-md text-sm hover:bg-[#27ae60]">
                          Book Viewing
                        </button>
                      </div>

                      <div className="flex items-center gap-1 text-gray-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{property.location}</span>
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <BedDouble className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-[#2ecc71] text-[#2ecc71]" />
                          <span className="text-sm">
                            {property.rating} ({property.reviews} reviews)
                          </span>
                        </div>
                      </div>

                      <p className="text-2xl text-[#1a2e4a]">
                        {property.price}
                        <span className="text-sm text-gray-500">/month</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        {viewMode === 'split' && (
          <div className="w-1/2 bg-gray-100 border-l border-gray-200 sticky top-0 h-[calc(100vh-200px)]">
            <div className="h-full flex items-center justify-center relative">
              {/* Map Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="h-full w-full relative">
                  {/* Simulated map markers */}
                  {MOCK_PROPERTIES.map((property, idx) => (
                    <div
                      key={property.id}
                      onClick={() => navigate(`/property/${property.id}`)}
                      className={`absolute cursor-pointer transition-all ${
                        selectedProperty === property.id ? 'z-10 scale-125' : ''
                      }`}
                      style={{
                        left: `${20 + idx * 10}%`,
                        top: `${25 + (idx % 3) * 20}%`,
                      }}
                    >
                      <div
                        className={`px-3 py-1 rounded-full shadow-lg ${
                          selectedProperty === property.id
                            ? 'bg-[#2ecc71] text-white'
                            : 'bg-white text-[#1a2e4a]'
                        }`}
                      >
                        <span className="text-sm">{property.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#2ecc71]" />
                <span>Interactive Map View</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {viewMode === 'list' && <Footer />}
    </div>
  );
}
