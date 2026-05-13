import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import {
  Home, ArrowLeft, Upload, X, Loader2, ImagePlus, MapPin,
} from 'lucide-react';
import { api } from '../../lib/api';

const PROPERTY_TYPES = ['APARTMENT', 'HOUSE', 'STUDIO', 'VILLA', 'COMMERCIAL', 'LAND'] as const;
const CURRENCIES = ['KES', 'TZS', 'UGX'] as const;
const COUNTRIES = ['KE', 'TZ', 'UG'] as const;

const AMENITY_OPTIONS = [
  'Parking', 'Security', 'Water', 'Electricity', 'Wi-Fi', 'Gym', 'Swimming Pool',
  'Balcony', 'Garden', 'Lift/Elevator', 'CCTV', 'Backup Generator',
];

interface UploadedPhoto {
  url: string;
  publicId: string;
}

export default function AddProperty() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'APARTMENT' as typeof PROPERTY_TYPES[number],
    address: '',
    city: '',
    country: 'KE' as typeof COUNTRIES[number],
    lat: '',
    lng: '',
    pricePerMonth: '',
    currency: 'KES' as typeof CURRENCIES[number],
    amenities: [] as string[],
  });

  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createProperty = useMutation({
    mutationFn: (data: any) => api.post('/properties', data).then((r) => r.data),
    onSuccess: () => navigate('/landlord/dashboard'),
    onError: (err: any) => {
      setSubmitError(err.response?.data?.message ?? 'Failed to create property');
    },
  });

  async function uploadFile(file: File) {
    setUploadingCount((c) => c + 1);
    setUploadError('');
    try {
      const { data: params } = await api.post('/uploads/sign?folder=nestea/properties');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', params.apiKey);
      formData.append('timestamp', String(params.timestamp));
      formData.append('signature', params.signature);
      formData.append('folder', params.folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${params.cloudName}/image/upload`,
        { method: 'POST', body: formData },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message ?? 'Upload failed');
      setPhotos((prev) => [...prev, { url: json.secure_url, publicId: json.public_id }]);
    } catch (err: any) {
      setUploadError(err.message ?? 'Photo upload failed');
    } finally {
      setUploadingCount((c) => c - 1);
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const allowed = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (photos.length + allowed.length > 10) {
      setUploadError('Maximum 10 photos allowed');
      return;
    }
    allowed.forEach(uploadFile);
  }

  function removePhoto(publicId: string) {
    setPhotos((prev) => prev.filter((p) => p.publicId !== publicId));
  }

  function toggleAmenity(amenity: string) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(amenity)
        ? f.amenities.filter((a) => a !== amenity)
        : [...f.amenities, amenity],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError('');
    createProperty.mutate({
      ...form,
      lat: Number(form.lat),
      lng: Number(form.lng),
      pricePerMonth: Number(form.pricePerMonth),
      photos: photos.map((p) => p.url),
    });
  }

  const isUploading = uploadingCount > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="px-4 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <button
              onClick={() => navigate('/landlord/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <Home className="h-6 w-6 text-[#2ecc71]" />
              <span className="text-xl text-[#1a2e4a]">NestKenya</span>
            </div>
            <span className="text-gray-400">/ Add Property</span>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl text-[#1a2e4a] mb-2">Add New Property</h1>
        <p className="text-gray-500 mb-8">Fill in the details to list your property.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-[#1a2e4a]">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Modern 2BR Apartment in Westlands"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ecc71] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Describe your property — features, nearby amenities, access..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ecc71] text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Type</label>
              <div className="grid grid-cols-3 gap-3">
                {PROPERTY_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: t }))}
                    className={`py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                      form.type === t
                        ? 'border-[#2ecc71] bg-green-50 text-[#1a2e4a]'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {t.charAt(0) + t.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-[#1a2e4a] flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#2ecc71]" /> Location
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="e.g. 14 Westlands Road"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ecc71] text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  placeholder="e.g. Nairobi"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ecc71] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                <select
                  value={form.country}
                  onChange={(e) => {
                    const country = e.target.value as typeof COUNTRIES[number];
                    const currency = country === 'KE' ? 'KES' : country === 'TZ' ? 'TZS' : 'UGX';
                    setForm((f) => ({ ...f, country, currency: currency as typeof CURRENCIES[number] }));
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ecc71] text-sm bg-white"
                >
                  <option value="KE">Kenya</option>
                  <option value="TZ">Tanzania</option>
                  <option value="UG">Uganda</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Latitude</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={form.lat}
                  onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
                  placeholder="-1.2921"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ecc71] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Longitude</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={form.lng}
                  onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
                  placeholder="36.8219"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ecc71] text-sm"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Find coordinates at{' '}
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2ecc71] hover:underline"
              >
                maps.google.com
              </a>
              {' '}— right-click a location and copy the lat/lng.
            </p>
          </section>

          {/* Pricing */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-[#1a2e4a]">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Monthly Rent</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={form.pricePerMonth}
                  onChange={(e) => setForm((f) => ({ ...f, pricePerMonth: e.target.value }))}
                  placeholder="25000"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ecc71] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value as typeof CURRENCIES[number] }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ecc71] text-sm bg-white"
                >
                  <option value="KES">KES — Kenyan Shilling</option>
                  <option value="TZS">TZS — Tanzanian Shilling</option>
                  <option value="UGX">UGX — Ugandan Shilling</option>
                </select>
              </div>
            </div>
          </section>

          {/* Amenities */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#1a2e4a]">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    form.amenities.includes(amenity)
                      ? 'border-[#2ecc71] bg-green-50 text-[#1a2e4a]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </section>

          {/* Photos */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1a2e4a] flex items-center gap-2">
                <ImagePlus className="h-5 w-5 text-[#2ecc71]" /> Photos
              </h2>
              <span className="text-sm text-gray-400">{photos.length}/10</span>
            </div>

            {/* Upload zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#2ecc71] hover:bg-green-50/30 transition-colors"
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 text-[#2ecc71] animate-spin" />
                  <p className="text-sm text-gray-500">Uploading {uploadingCount} photo{uploadingCount > 1 ? 's' : ''}…</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="text-gray-600 text-sm">Click to upload or drag & drop</p>
                  <p className="text-gray-400 text-xs">JPG, PNG, WebP — up to 10 photos</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            {uploadError && (
              <p className="text-sm text-red-600">{uploadError}</p>
            )}

            {/* Photo grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {photos.map((photo, i) => (
                  <div key={photo.publicId} className="relative rounded-lg overflow-hidden aspect-video bg-gray-100">
                    <img src={photo.url} alt={`Property ${i + 1}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-[#1a2e4a] text-white text-xs px-1.5 py-0.5 rounded">Cover</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.publicId)}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {submitError}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/landlord/dashboard')}
              className="flex-1 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createProperty.isPending || isUploading}
              className="flex-1 py-3 bg-[#2ecc71] hover:bg-[#27ae60] text-white font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {createProperty.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {createProperty.isPending ? 'Creating…' : 'Create Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
