export interface MarkerData {
    id: number;
    position: {
      lat: number;
      lng: number;
    };
    title: string;
  }
  
  export interface Bounds {
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
  }
  