import { useState, useCallback, useRef } from 'react';
import { GoogleMap, useLoadScript, OverlayView } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';

const NAIROBI = { lat: -1.2921, lng: 36.8219 };
const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
];

interface PropertyPin {
  id: string;
  lat: number;
  lng: number;
  price: string;
}

interface Props {
  properties: PropertyPin[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

function PriceMarker({
  price,
  selected,
  onClick,
}: {
  price: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded-full shadow-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
        selected
          ? 'bg-[#2ecc71] text-white border-[#27ae60] scale-110 z-10'
          : 'bg-white text-[#1a2e4a] border-gray-200 hover:border-[#2ecc71]'
      }`}
    >
      {price}
    </button>
  );
}

export default function PropertyMap({ properties, selectedId, onSelect }: Props) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
  const hasValidKey = apiKey && apiKey !== 'placeholder';

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: hasValidKey ? apiKey : '',
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const onLoad = useCallback((map: google.maps.Map) => { mapRef.current = map; }, []);

  const center = properties.length > 0 && properties[0].lat
    ? { lat: properties[0].lat, lng: properties[0].lng }
    : NAIROBI;

  if (!hasValidKey) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 gap-4 p-6 text-center">
        <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm">
          <MapPin className="h-8 w-8 text-[#2ecc71]" />
        </div>
        <div>
          <h3 className="text-[#1a2e4a] font-semibold mb-1">Google Maps not configured</h3>
          <p className="text-sm text-gray-500 max-w-xs">
            Add your API key to <code className="bg-gray-200 px-1 rounded">.env</code>:
          </p>
          <code className="block mt-2 text-xs bg-white border border-gray-200 rounded px-3 py-2 text-left text-gray-700">
            VITE_GOOGLE_MAPS_API_KEY=your-key-here
          </code>
          <a
            href="https://developers.google.com/maps/documentation/javascript/get-api-key"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-3 text-sm text-[#2ecc71] hover:underline"
          >
            Get a free API key →
          </a>
        </div>
        {/* Simulated marker bubbles so it looks live */}
        <div className="w-full max-w-sm mt-2 relative bg-white rounded-lg border border-gray-200 h-32 overflow-hidden">
          {properties.slice(0, 4).map((p, i) => (
            <div
              key={p.id}
              onClick={() => onSelect(selectedId === p.id ? null : p.id)}
              className={`absolute cursor-pointer transition-all ${selectedId === p.id ? 'scale-110 z-10' : ''}`}
              style={{ left: `${15 + i * 20}%`, top: `${20 + (i % 2) * 35}%` }}
            >
              <div className={`px-2 py-1 rounded-full shadow text-xs font-semibold ${selectedId === p.id ? 'bg-[#2ecc71] text-white' : 'bg-white text-[#1a2e4a] border border-gray-200'}`}>
                {p.price}
              </div>
            </div>
          ))}
          <div className="absolute inset-x-0 bottom-0 bg-white/80 text-center text-xs text-gray-400 py-1">
            Preview — add API key for real map
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-500">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-red-400" />
          <p className="text-sm">Failed to load Google Maps</p>
          <p className="text-xs text-gray-400 mt-1">Check your API key and billing</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="h-8 w-8 border-4 border-[#2ecc71] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full"
      center={center}
      zoom={12}
      onLoad={onLoad}
      onClick={() => onSelect(null)}
      options={{
        styles: MAP_STYLE,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      {properties.map((p) => (
        p.lat && p.lng ? (
          <OverlayView
            key={p.id}
            position={{ lat: p.lat, lng: p.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <PriceMarker
              price={p.price}
              selected={selectedId === p.id}
              onClick={() => onSelect(selectedId === p.id ? null : p.id)}
            />
          </OverlayView>
        ) : null
      ))}
    </GoogleMap>
  );
}
