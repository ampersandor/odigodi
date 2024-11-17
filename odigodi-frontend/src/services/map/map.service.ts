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
    const clusterer = new MarkerClustering({
      minClusterSize: 2,
      maxZoom: 13,
      map: map,
      markers: markers,
      disableClickZoom: false,
      gridSize: 120,
      icons: [
        {
          content: this.createClusterIcon(markers.length, 1),
          size: new naver.maps.Size(40, 40),
          anchor: new naver.maps.Point(20, 20)
        },
        {
          content: this.createClusterIcon(markers.length, 2),
          size: new naver.maps.Size(50, 50),
          anchor: new naver.maps.Point(25, 25)
        },
        {
          content: this.createClusterIcon(markers.length, 3),
          size: new naver.maps.Size(60, 60),
          anchor: new naver.maps.Point(30, 30)
        }
      ]
    });

    return { map, markers, infoWindows, clusterer };
  }
  private createClusterIcon(count: number, level: number): string {
    return `
      <div class="cluster cluster-${level}" style="
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        border-radius: 50%;
        background: ${this.getClusterColor(level)};
        width: ${this.getClusterSize(level)}px;
        height: ${this.getClusterSize(level)}px;
        font-size: ${12 + (level * 2)}px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      ">
        ${count}
      </div>
    `;
  }

  private getClusterColor(level: number): string {
    switch (level) {
      case 1:
        return 'rgba(29, 97, 255, 0.8)';
      case 2:
        return 'rgba(25, 77, 209, 0.8)';
      case 3:
        return 'rgba(21, 57, 163, 0.8)';
      default:
        return 'rgba(29, 97, 255, 0.8)';
    }
  }

  private getClusterSize(level: number): number {
    return 40 + (level - 1) * 10;  // 40px, 50px, 60px
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