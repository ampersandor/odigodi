import { useEffect, useRef } from 'react';
import LineGraph from './LineGraph';

function App() {
  const mapElement = useRef(null);


  useEffect(() => {
    const { naver } = window;
    if (!mapElement.current || !naver) return;

    // 지도에 표시할 위치의 위도와 경도 좌표를 파라미터로 넣어줍니다.
    const location = new naver.maps.LatLng(37.516, 127.1123);
    const mapOptions: naver.maps.MapOptions = {
      center: location,
      zoom: 18,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT,
      },
    };
    const map = new naver.maps.Map(mapElement.current, mapOptions);
    new naver.maps.Marker({
      position: location,
      map,
    });
    new naver.maps.Marker({
      position: new naver.maps.LatLng(37.516, 127.113),
      map,
    });
  }, []);


  // return <div ref={mapElement} style={{ minHeight: '800px' }} />;
    return <LineGraph></LineGraph>
}


export default App;