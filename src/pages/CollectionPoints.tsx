import { useState, useEffect } from 'react';
import { MapPin, Search, Navigation } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import api from '../services/api';

interface CollectionPoint {
  id: number;
  name: string;
  type: string;
  address: string;
  distance: string;
  materials: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export function CollectionPoints() {
  const [location, setLocation] = useState('');
  const [points, setPoints] = useState<CollectionPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const { latitude: currentLat, longitude: currentLng, error: geoError } = useGeolocation();

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Raio da Terra em km
    const toRad = (value: number) => (value * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distância em km
  };

  useEffect(() => {
    const fetchCollectionPoints = async () => {
      setLoading(true);
      try {
        const response = await api.get('collections/all?skip=0&limit=100',
          {
            headers: {'ngrok-skip-browser-warning': 'true'}
          }
        );

        const fetchedPoints = response.data.map((item: any) => {
          const point: CollectionPoint = {
            id: item.id,
            name: `Ponto ${item.id}`, // Nome genérico (não presente no dado original)
            type: 'Ponto de Coleta', // Tipo genérico (não presente no dado original)
            address: item.address,
            distance: currentLat && currentLng && item.latitude && item.longitude
              ? `${calculateDistance(currentLat, currentLng, item.latitude, item.longitude).toFixed(1)} km`
              : 'Indisponível',
            materials: item.materials.map((m: any) => `${m.tipo} (${m.amount} ${m.unit})`),
            coordinates: item.latitude && item.longitude
              ? { latitude: item.latitude, longitude: item.longitude }
              : undefined,
          };
          return point;
        });

        setPoints(fetchedPoints);
      } catch (error) {
        console.error('Erro ao buscar pontos de coleta:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentLat && currentLng) {
      fetchCollectionPoints();
    }
  }, [currentLat, currentLng]);

  const handleLocationSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementação de lógica de busca será feita aqui
    console.log('Searching for:', location);
  };

  const openInMaps = (point: CollectionPoint) => {
    console.log(point)
    if (point.coordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${point.coordinates.latitude},${point.coordinates.longitude}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Pontos de Coleta</h1>

        {geoError && (
          <div className="mb-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg">
            {geoError}
          </div>
        )}

        {/* Formulário de Busca */}
        <form onSubmit={handleLocationSearch} className="mb-8">
          <div className="flex gap-2 max-w-2xl">
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Digite seu endereço ou CEP"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Buscar
            </button>
          </div>
        </form>

        {/* Resultados */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando pontos de coleta...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {points.map((point) => (
              <div key={point.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{point.name}</h3>
                    <p className="text-gray-600">{point.type}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    {point.distance}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{point.address}</p>
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold mb-2">Materiais disponíveis:</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {point.materials.map((material) => (
                      <span
                        key={material}
                        className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => openInMaps(point)}
                    className="w-full flex items-center justify-center gap-2 text-green-600 hover:bg-green-50 py-2 rounded-md transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    Como chegar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
