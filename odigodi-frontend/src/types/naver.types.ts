declare global {
  interface Window {
    naver: typeof naver;
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
        function addListener(target: any, type: string, handler: Function): void;
      }
    }
  }
}

export interface MapBounds {
  sw: { lat: number; lng: number };
  ne: { lat: number; lng: number };
}

export interface NaverMapInstance {
  map: naver.maps.Map;
  markers: naver.maps.Marker[];
  infoWindows: naver.maps.InfoWindow[];
}
export interface Location {
  lat: number;
  lng: number;
  offinm: string;  // 장소명
  id: string;
}

export interface MapOptions {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  zoomControl?: boolean;
}

export {};

// export declare namespace naver {
//   namespace maps {
//     class Map {
//       constructor(element: string | HTMLElement, options: MapOptions);
//       destroy(): void;
//       setOptions(options: Partial<MapOptions>): void;
//       getCenter(): LatLng;
//       getZoom(): number;
//       setCenter(location: LatLng): void;
//       setZoom(level: number, useEffect?: boolean): void;
//       setZoomControl(zoomControl: boolean): void;
//     }
//     class LatLng {
//       constructor(lat: number, lng: number);
//       lat(): number;
//       lng(): number;
//     }
//     class Event {
//       static addListener(instance: Map, eventName: string, handler: Function): void;
//     }
//     interface MapOptions {
//       center: LatLng;
//       zoom: number;
//       minZoom?: number;
//       maxZoom?: number;
//       zoomControl?: boolean;
//     }
//     class Marker {
//       constructor(options: MarkerOptions);
//     }
//     class InfoWindow {
//       constructor(options: InfoWindowOptions);
//     }

//     interface MarkerOptions {
//       position: LatLng;
//       map?: Map;
//       title: string;
//     }
//     interface InfoWindowOptions {
//       content: string;
//       position: LatLng;
//     }
//   }
// }

// declare global {
//   interface Window {
//     naver: {
//       maps: {
//         Map: typeof naver.maps.Map;
//         LatLng: typeof naver.maps.LatLng;
//         MapOptions: naver.maps.MapOptions;
//         Event: typeof naver.maps.Event;
//       };
//     };
//   }
// }

// export interface NaverMapOptions {
//   center: {
//     lat: number;
//     lng: number;
//   };
//   zoom: number;
//   minZoom?: number;
//   maxZoom?: number;
//   zoomControl?: boolean;
// }

// export interface MarkerOptions {
//   position: naver.maps.LatLng;
//   map?: naver.maps.Map;
//   title: string;
// }

// export interface InfoWindowOptions {
//   content: string;
//   position: naver.maps.LatLng;
// }

// export interface Location {
//   lat: number;
//   lng: number;
//   offinm: string;  // 장소명
// }

// export interface NaverMapInstance {
//   map: naver.maps.Map;
//   markers: naver.maps.Marker[];
//   infoWindows: naver.maps.InfoWindow[];
// }

// export interface MapMarker {
//   position: {
//     lat: number;
//     lng: number;
//   };
//   title: string;
// }

// export interface MapBounds {
//   sw: { lat: number; lng: number };
//   ne: { lat: number; lng: number };
// }