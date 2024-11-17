import { MapBounds, NaverMapInstance, Location } from '../../types/naver.types';
import { DEFAULT_MAP_OPTIONS } from './map.config';

class MapService {
  private static instance: MapService;

  private constructor() {}

  static getInstance(): MapService {
    if (!MapService.instance) {
      MapService.instance = new MapService();
    }
    return MapService.instance;
  }

  initializeMap(element: HTMLElement): naver.maps.Map {
    console.log("initializeMap");
    const { naver } = window;
    const mapOptions = {
      ...DEFAULT_MAP_OPTIONS,
      center: new naver.maps.LatLng(
        DEFAULT_MAP_OPTIONS.center.lat,
        DEFAULT_MAP_OPTIONS.center.lng
      ),
    };

    return new naver.maps.Map(element, mapOptions);
  }
  
  countMarkers(mapInstance: NaverMapInstance): number {
    return mapInstance.markers.length;
  }

  createMarkers(map: naver.maps.Map, locations: Location[], callbacks?: {
    onClick?: (marker: naver.maps.Marker, location: Location) => void;
  }): NaverMapInstance {
    const { naver } = window;
    const markers: naver.maps.Marker[] = [];
    const infoWindows: naver.maps.InfoWindow[] = [];
    
    locations.forEach((location) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(location.lat, location.lng),
        map,
        title: location.offinm,
        id: location.id,
      });

      const infoWindow = new naver.maps.InfoWindow({
        content: `
          <div class="info-window" style="
            padding: 12px 16px;
            background: white;
            color: #333;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-size: 14px;
            font-weight: 500;
            min-width: 100px;
            text-align: center;
            border: 1px solid #eee;
            white-space: nowrap;
          ">
            ${location.offinm}
          </div>
        `,
        borderWidth: 0,
        disableAnchor: true,
        backgroundColor: 'transparent',
        pixelOffset: new naver.maps.Point(0, -2),
        borderColor: 'transparent',
        anchorSkew: true,
        anchorSize: new naver.maps.Size(0, 0),
        position: new naver.maps.LatLng(location.lat, location.lng),
      });

      markers.push(marker);
      infoWindows.push(infoWindow);

      if (callbacks && typeof callbacks.onClick === 'function') {
        naver.maps.Event.addListener(marker, 'click', () => {
          callbacks.onClick!(marker, location);
        });
      }

      naver.maps.Event.addListener(marker, 'mouseover', () => {
        if (infoWindow.getMap()) {
          infoWindow.close();
        } else {
          infoWindow.open(map, marker);
        }
      });
      naver.maps.Event.addListener(marker, 'mouseout', () => {
        infoWindow.close();
      });



    });

    return { map, markers, infoWindows };
  }

  getBounds(map: naver.maps.Map): MapBounds {
    const bounds = map.getBounds();
    const sw = bounds.getSW();
    const ne = bounds.getNE();

    return {
      sw: { lat: sw.lat(), lng: sw.lng() },
      ne: { lat: ne.lat(), lng: ne.lng() }
    };
  }

  clearMarkers(mapInstance: {
    markers: naver.maps.Marker[];
    infoWindows: naver.maps.InfoWindow[];
  }): void {
    mapInstance.markers.forEach((marker: naver.maps.Marker) => {
      marker.setMap(null);
    });
  }
}

export default MapService.getInstance();