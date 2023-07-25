import { useEffect, useRef } from 'react';
import LineGraph from './LineGraph';
import Modal from './components/modal/Modal';
import { useState, useCallback } from "react";

function App() {
  const mapElement = useRef(null);
  const [isOpenModal, setOpenModal] = useState<boolean>(false);

  const onClickToggleModal = useCallback(() => {
    setOpenModal(!isOpenModal);
  }, [isOpenModal]);


  useEffect(() => {
    const { naver } = window;
    if (!mapElement.current || !naver) return;
    const marker_position = new Map<string, number[]>();
    marker_position.set("소프라우스", [37.516, 127.113])
    marker_position.set("사보이", [37.516, 127.1123])

    const location = new naver.maps.LatLng(37.516, 127.1123);
    const mapOptions: naver.maps.MapOptions = {
      center: location,
      zoom: 18,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT,
      },
    };
    var markers: any = [], infoWindows: any = [];

    const map = new naver.maps.Map(mapElement.current, mapOptions);
    marker_position.forEach((value, key) => {
      var marker = new naver.maps.Marker({
        map: map,
        position: new naver.maps.LatLng(value[0], value[1]),
        title: key
      })

      var infoWindow = new naver.maps.InfoWindow({
        content: '<div style="width:100px;text-align:center;padding:5px;"><b>"'+ key +'"</b></div>'
      });
      
      markers.push(marker)
      infoWindows.push(infoWindow)
    });
    
    function getClickHandler(seq: any) {
      return function(e: any) {
          var marker = markers[seq],
              infoWindow = infoWindows[seq];
  
          if (infoWindow.getMap()) {
              infoWindow.close();
          } else {
              infoWindow.open(map, marker);
          }
      }
    }
    
    for (var i=0, ii=markers.length; i<ii; i++) {
        naver.maps.Event.addListener(markers[i], 'click', onClickToggleModal);
        naver.maps.Event.addListener(markers[i], 'mouseover', getClickHandler(i));
        naver.maps.Event.addListener(markers[i], "mouseout", getClickHandler(i)); 
      }

  }, []);


  return (
        <>
          {isOpenModal && (
              <Modal onClickToggleModal={onClickToggleModal}>
                <LineGraph/>
              </Modal>
          )}
          <div ref={mapElement} style={{ minHeight: '800px' }} />;
        </>
  )
}


export default App;
