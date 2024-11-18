import React, { useCallback, useEffect, useRef, useState } from "react";
import mapService from "../../services/map/map.service";
import locationService from "../../services/api/locationService";
import type { NaverMapInstance, Location } from "../../types/map.types";
import LineGraph from "../../components/LineGraph";
import Modal from "../../components/Modal";


const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<NaverMapInstance | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    id: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = useCallback(() => {
    setIsModalOpen(prev => !prev);
  }, []);

  const handleMarkerClick = useCallback((_: naver.maps.Marker, location: Location) => {
    setSelectedLocation({
      name: location.offinm,
      id: location.id.toString()
    });
    setIsModalOpen(true);  // 마커 클릭 시 모달 열기
  }, []);
  
  useEffect(() => {
    const initializeMap = async () => {
      console.log("initializeMap");
      if (!window.naver || !mapRef.current) return;

      // 지도 초기화
      const map = mapService.initializeMap(mapRef.current);
      
      try {
        // 초기 마커 데이터 가져오기
        const bounds = mapService.getBounds(map);

        const locations = await locationService.fetchLocationsInBounds(bounds);
        
        // 마커 생성 및 이벤트 연결
        const instance = mapService.createMarkers(map, locations, {
          onClick: handleMarkerClick
        });        
        setMapInstance(instance);

        // 지도 이동 이벤트
        window.naver.maps.Event.addListener(map, 'idle', async () => {
          try {
            const newBounds = mapService.getBounds(map);
            const newLocations = await locationService.fetchLocationsInBounds(newBounds);
            
            if (mapInstance) {
              console.log("clearMarkers");
              mapService.clearMarkers(mapInstance);
            }
            
            const newInstance = mapService.createMarkers(map, newLocations, {
              onClick: (_, location) => {
                setSelectedLocation({
                  name: location.offinm,
                  id: location.id.toString()
                });
                setIsModalOpen(true);  // 마커 클릭 시 모달 열기
              }
            });
            console.log("countMarkers: ", mapService.countMarkers(newInstance));
            
            setMapInstance(newInstance);
          } catch (error) {
            console.error('Failed to update markers:', error);
          }
        });
      } catch (error) {
        console.error('Failed to initialize markers:', error);
      }
    };

    const loadMapScript = async () => {
        // 네이버 맵 스크립트 로드
      const mapScript = document.createElement('script');
      mapScript.src = import.meta.env.VITE_MAP_URL;
      
      // 클러스터링 스크립트 로드 (로컬 파일 사용)
      const clusterScript = document.createElement('script');
      clusterScript.src = "/MarkerClustering.js";  // public 폴더에서 로드
      
      // 스크립트 로드 순서 보장
      await new Promise<void>((resolve) => {
        mapScript.onload = () => {
          document.head.appendChild(clusterScript);
          clusterScript.onload = () => resolve();
        };
        document.head.appendChild(mapScript);
      });

      initializeMap();
    };

    loadMapScript();

    return () => {
      const scripts = document.querySelectorAll(
        `script[src*="${import.meta.env.VITE_MAP_URL}"], script[src*="MarkerClustering.js"]`
      );
      scripts.forEach(script => script.remove());
    };
  }, [handleMarkerClick]);

  return (
    <div 
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%"
      }}
    >
        {isModalOpen && selectedLocation && (
        <Modal onClickToggleModal={toggleModal}>
          <div className="graph-container">
            <LineGraph name={selectedLocation.name} location_id={selectedLocation.id} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Map;