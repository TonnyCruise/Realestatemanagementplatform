import { useState, useCallback } from 'react';
import { Search, MapPin, BedDouble, Star, Sliders, Map as MapIcon, List, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import PropertyMap from '../components/PropertyMap';
import { api } from '../../lib/api';

const PROPERTY_TYPES = ['APARTMENT', 'HOUSE', 'BEDSITTER', 'STUDIO', 'COMMERCIAL', 'LAND'];
const COUNTRIES = [{ value: 'KE', label: 'Kenya' }, { value: 'TZ', label: 'Tanzania' }, { value: 'UG', label: 'Uganda' }];

function formatPrice(amount: number, currency: string) {
  return `${currency} ${Number(amount).toLocaleString('en-KE')}`;
}

function usePropertySearch(filters: Record<string, any>) {
  return useQuery({
    queryKey: ['property-search', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
      const { data } = await api.get(`/properties?${params.toString()}`);
      return data as { total: number; items: any[] };
    },
    placeholderData: (prev) => prev,
  });
}

export default function PropertySearch() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'split' | 'list'>('split');
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    city: '',
    country: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
  });
  const [search, setSearch] = useState('');

  const activeFilters = { ...filters, city: search || filters.city };
  const { data, isLoading, isFetching } = usePropertySearch(activeFilters);
  const properties = data?.items ?? [];

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // filters already reactive via state
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Search Bar */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by city or neighborhood..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ecc71]"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 ${showFilters ? 'border-[#2ecc71] bg-green-50' : 'border-gray-300 bg-white'}`}
              >
                <Sliders className="h-5 w-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${viewMode === 'split' ? 'bg-[#1a2e4a] text-white' : 'bg-white border border-gray-300'}`}
              >
                <MapIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Map</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${viewMode === 'list' ? 'bg-[#1a2e4a] text-white' : 'bg-white border border-gray-300'}`}
              >
                <List className="h-5 w-5" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </form>

          {/* Expanded filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Country</label>
                <select value={filters.country} onChange={(e) => setFilters((f) => ({ ...f, country: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option value="">All countries</option>
                  {COUNTRIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Type</label>
                <select value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option value="">All types</option>
                  {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Min Price</label>
                <input type="number" placeholder="0" value={filters.minPrice} onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max Price</label>
                <input type="number" placeholder="Any" value={filters.maxPrice} onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className={`flex ${viewMode === 'split' ? 'h-[calc(100vh-200px)]' : ''}`}>
        {/* Listings */}
        <div className={`${viewMode === 'split' ? 'w-1/2 overflow-y-auto' : 'w-full'} p-4`}>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-gray-600">
                {isLoading ? 'Searching...' : `${data?.total ?? 0} properties found`}
              </p>
              {isFetching && !isLoading && <Loader2 className="h-4 w-4 animate-spin text-[#2ecc71]" />}
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-[#2ecc71]" />
                <p className="text-gray-500">Loading properties...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Search className="h-12 w-12 text-gray-300" />
                <h3 className="text-xl text-[#1a2e4a]">No properties found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your search filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {properties.map((property: any) => (
                  <div
                    key={property.id}
                    id={`property-${property.id}`}
                    onClick={() => navigate(`/property/${property.id}`)}
                    onMouseEnter={() => setSelectedProperty(property.id)}
                    onMouseLeave={() => setSelectedProperty(null)}
                    className={`bg-white border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                      selectedProperty === property.id ? 'border-[#2ecc71] shadow-lg' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row">
                      {property.photos?.[0] ? (
                        <img src={property.photos[0]} alt={property.title} className="w-full sm:w-64 h-48 object-cover" />
                      ) : (
                        <div className="w-full sm:w-64 h-48 bg-gray-100 flex items-center justify-center">
                          <MapPin className="h-10 w-10 text-gray-300" />
                        </div>
                      )}
                      <div className="p-4 flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg text-[#1a2e4a]">{property.title}</h3>
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/property/${property.id}`); }}
                            className="px-3 py-1 bg-[#2ecc71] text-white rounded-md text-sm hover:bg-[#27ae60] whitespace-nowrap"
                          >
                            View Details
                          </button>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{property.address}, {property.city}, {property.country}</span>
                        </div>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <BedDouble className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{property.type}</span>
                          </div>
                          {property.avgRating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-[#2ecc71] text-[#2ecc71]" />
                              <span className="text-sm">{property.avgRating}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-2xl text-[#1a2e4a]">
                          {formatPrice(property.pricePerMonth, property.currency)}
                          <span className="text-sm text-gray-500">/month</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        {viewMode === 'split' && (
          <div className="w-1/2 border-l border-gray-200 sticky top-0 h-[calc(100vh-200px)]">
            <PropertyMap
              properties={properties.map((p: any) => ({
                id: p.id,
                lat: p.location?.coordinates?.[1] ?? 0,
                lng: p.location?.coordinates?.[0] ?? 0,
                price: formatPrice(p.pricePerMonth, p.currency),
              }))}
              selectedId={selectedProperty}
              onSelect={(id) => {
                setSelectedProperty(id);
                if (id) {
                  const el = document.getElementById(`property-${id}`);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
              }}
            />
          </div>
        )}
      </div>

      {viewMode === 'list' && <Footer />}
    </div>
  );
}
