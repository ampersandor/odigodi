export interface Bounds {
    northEast: {
      lat: number;
      lng: number;
    };
    southWest: {
      lat: number;
      lng: number;
    };
  }
  
  // 필요한 경우 다른 지도 관련 타입들도 추가
export interface Coordinates {
    lat: number;
  lng: number;
}