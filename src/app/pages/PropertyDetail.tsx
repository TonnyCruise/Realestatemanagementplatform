import { useState } from 'react';
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Star,
  Heart,
  Share2,
  Wifi,
  Car,
  Waves,
  Dumbbell,
  Shield,
  Zap,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
];

const REVIEWS = [
  {
    id: 1,
    author: 'Sarah Ochieng',
    rating: 5,
    date: 'March 2026',
    comment: 'Amazing apartment in a great location. The landlord is very responsive and the building is well-maintained.',
  },
  {
    id: 2,
    author: 'David Mutua',
    rating: 5,
    date: 'February 2026',
    comment: 'Love living here! Close to everything and the amenities are excellent. Highly recommend.',
  },
  {
    id: 3,
    author: 'Grace Wanjiru',
    rating: 4,
    date: 'January 2026',
    comment: 'Great value for money. The apartment is spacious and the neighborhood is safe and quiet.',
  },
];

const SIMILAR_PROPERTIES = [
  {
    id: 2,
    title: '3BR Family House',
    location: 'Karen, Nairobi',
    price: 'KES 85,000',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=200&fit=crop',
    rating: 4.9,
  },
  {
    id: 3,
    title: 'Studio - CBD',
    location: 'CBD, Nairobi',
    price: 'KES 28,000',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop',
    rating: 4.5,
  },
  {
    id: 4,
    title: 'Luxury Penthouse',
    location: 'Kilimani, Nairobi',
    price: 'KES 120,000',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=200&fit=crop',
    rating: 5.0,
  },
];

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % PROPERTY_IMAGES.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + PROPERTY_IMAGES.length) % PROPERTY_IMAGES.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-[500px]">
            <div className="lg:col-span-2 relative rounded-lg overflow-hidden">
              <img
                src={PROPERTY_IMAGES[currentImageIndex]}
                alt="Property"
                className="w-full h-full object-cover"
              />
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {PROPERTY_IMAGES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-2">
              {PROPERTY_IMAGES.slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx + 1)}
                  className="rounded-lg overflow-hidden cursor-pointer hover:opacity-90"
                >
                  <img src={img} alt={`Property ${idx + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl text-[#1a2e4a]">2BR Modern Apartment in Westlands</h1>
                <div className="flex gap-2">
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-5 w-5" />
                  <span>Westlands, Nairobi, Kenya</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-[#2ecc71] text-[#2ecc71]" />
                  <span>4.8 (24 reviews)</span>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="flex gap-6 py-6 border-y border-gray-200 mb-6">
              <div className="flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-gray-500" />
                <span>2 Bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-gray-500" />
                <span>2 Bathrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize className="h-5 w-5 text-gray-500" />
                <span>120 m²</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl text-[#1a2e4a] mb-4">About this property</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Beautiful 2-bedroom apartment in the heart of Westlands, one of Nairobi's most vibrant neighborhoods.
                This modern unit features contemporary finishes, an open-plan living area, and a private balcony with
                city views.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Located within walking distance to shopping malls, restaurants, and entertainment venues. Easy access to
                public transportation and major highways. Perfect for professionals and small families looking for
                convenience and comfort.
              </p>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-2xl text-[#1a2e4a] mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Wifi className="h-5 w-5 text-[#1a2e4a]" />
                  </div>
                  <span>WiFi Included</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Car className="h-5 w-5 text-[#1a2e4a]" />
                  </div>
                  <span>Parking Space</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Waves className="h-5 w-5 text-[#1a2e4a]" />
                  </div>
                  <span>Swimming Pool</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Dumbbell className="h-5 w-5 text-[#1a2e4a]" />
                  </div>
                  <span>Gym</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-[#1a2e4a]" />
                  </div>
                  <span>24/7 Security</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-[#1a2e4a]" />
                  </div>
                  <span>Backup Generator</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="mb-8">
              <h2 className="text-2xl text-[#1a2e4a] mb-4">Location & Neighborhood</h2>
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg h-64 flex items-center justify-center mb-4">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-[#2ecc71] mx-auto mb-2" />
                  <p className="text-gray-600">Interactive Map</p>
                </div>
              </div>
              <p className="text-gray-600">
                Westlands is a thriving commercial and residential area known for its cosmopolitan atmosphere. The
                neighborhood offers excellent schools, healthcare facilities, shopping centers, and a vibrant nightlife.
              </p>
            </div>

            {/* Reviews */}
            <div className="mb-8">
              <h2 className="text-2xl text-[#1a2e4a] mb-4">
                Reviews <span className="text-gray-500">(24)</span>
              </h2>
              <div className="space-y-4">
                {REVIEWS.map((review) => (
                  <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-[#1a2e4a] rounded-full flex items-center justify-center text-white">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p>{review.author}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-[#2ecc71] text-[#2ecc71]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              {/* Booking Card */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-lg mb-6">
                <p className="text-3xl text-[#1a2e4a] mb-1">
                  KES 45,000
                  <span className="text-lg text-gray-500">/month</span>
                </p>
                <p className="text-sm text-gray-500 mb-4">Deposit: KES 90,000 (2 months)</p>

                {!showBookingForm ? (
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="w-full py-3 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-lg mb-3"
                  >
                    Book a Viewing
                  </button>
                ) : (
                  <div className="space-y-3 mb-3">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="date"
                      placeholder="Preferred Date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <textarea
                      placeholder="Message (optional)"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button className="w-full py-3 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-lg">
                      Submit Request
                    </button>
                    <button
                      onClick={() => setShowBookingForm(false)}
                      className="w-full py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                <button className="w-full py-2 border border-[#1a2e4a] text-[#1a2e4a] hover:bg-[#1a2e4a] hover:text-white rounded-lg">
                  Send Message
                </button>
              </div>

              {/* Landlord Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg text-[#1a2e4a] mb-4">Landlord</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-14 w-14 bg-[#1a2e4a] rounded-full flex items-center justify-center text-white text-xl">
                    JM
                  </div>
                  <div>
                    <p>John Mwangi</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-[#2ecc71] text-[#2ecc71]" />
                      <span className="text-sm text-gray-600">4.9 (18 properties)</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Verified landlord with 5+ years experience managing premium properties in Nairobi.
                </p>
                <button className="w-full py-2 bg-[#1a2e4a] text-white rounded-lg hover:bg-[#2c4a6e]">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        <div className="mt-16">
          <h2 className="text-2xl text-[#1a2e4a] mb-6">Similar Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SIMILAR_PROPERTIES.map((property) => (
              <div
                key={property.id}
                onClick={() => navigate(`/property/${property.id}`)}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                <img src={property.image} alt={property.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg text-[#1a2e4a] mb-1">{property.title}</h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xl text-[#1a2e4a]">{property.price}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-[#2ecc71] text-[#2ecc71]" />
                      <span className="text-sm">{property.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
