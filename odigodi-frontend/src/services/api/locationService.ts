import { MapBounds, Location } from '../../types/naver.types';

class LocationService {
  private static instance: LocationService;

  private constructor() {}

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async fetchLocationsInBounds(bounds: MapBounds): Promise<Location[]> {
    console.log("fetchLocationsInBounds");
    try {
      const { sw, ne } = bounds;
      const params = new URLSearchParams({
        northEast: JSON.stringify({ lat: ne.lat, lng: ne.lng }),
        southWest: JSON.stringify({ lat: sw.lat, lng: sw.lng })
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/location/get/bounds?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      const { data } = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  }
}

export default LocationService.getInstance();