declare global {
  interface Window {
    naver: typeof naver;
    MarkerClustering?: typeof MarkerClustering;
  }

  class MarkerClustering {
    constructor(options: MarkerClusteringOptions);
    setMap(map: naver.maps.Map | null): void;
    getMarkers(): naver.maps.Marker[];
  }

  interface MarkerClusteringOptions {
    map: naver.maps.Map;
    markers: naver.maps.Marker[];
    minClusterSize?: number;
    maxZoom?: number;
    gridSize?: number;
    icons?: Array<{
      content: string;
      size: naver.maps.Size;
      anchor: naver.maps.Point;
    }>;
    disableClickZoom?: boolean;
  }

  namespace naver {
    namespace maps {
      class Map {
        constructor(element: HTMLElement, options?: MapOptions);
        getBounds(): any;
      }
      
      class LatLng {
        constructor(lat: number, lng: number);
        lat(): number;
        lng(): number;
      }

      class Marker {
        constructor(options: MarkerOptions);
        setMap(map: Map | null): void;
        getTitle(): string;
      }

      class InfoWindow {
        constructor(options: InfoWindowOptions);
        open(map: Map, marker: Marker): void;
        close(): void;
        getMap(): Map | null;
      }

      class MapEventListener {
        constructor(map: Map, eventType: string, handler: Function);
      }

      class Point {
        constructor(x: number, y: number);
      }

      class Size {
        constructor(width: number, height: number);
      }

      interface MarkerOptions {
        position: LatLng;
        map?: Map;
        title?: string;
        id?: string;
      }

      interface InfoWindowOptions {
        content: string;
        position?: LatLng;
        [key: string]: any;
      }

      interface MapOptions {
        center: LatLng;
        zoom?: number;
        [key: string]: any;
      }

      namespace Event {
        function addListener(target: any, type: string, handler: Function): MapEventListener;
        function removeListener(listener: MapEventListener): void;
      }
    }
  }
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapBounds {
  sw: Coordinates;
  ne: Coordinates;
}

export interface NaverMapInstance {
  map: naver.maps.Map;
  markers: naver.maps.Marker[];
  infoWindows: naver.maps.InfoWindow[];
  clusterer?: MarkerClustering;
}

export interface Location extends Coordinates {
  offinm: string;
  id: string;
}


export {};