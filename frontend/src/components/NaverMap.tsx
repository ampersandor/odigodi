import { useEffect, useRef } from 'react';
import LineGraph from './LineGraph';
import Modal from './Modal';
import { useState, useCallback } from "react";
import ILocationData from "../types/location.type"

interface NaverMapProps {
  data: ILocationData[]
}

const NaverMap: React.FC<NaverMapProps> = (props) => {
  const { data } = props;
  console.log(data)
  const mapElement = useRef(null);
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
 
  const onClickToggleModal = useCallback(() => {
    setOpenModal(!isOpenModal);
  }, [isOpenModal]);

  useEffect(() => {
    const { naver } = window;
    if (!mapElement.current || !naver) return; 

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
    data.forEach((value, key) => {
      console.log(value.lat);
      var marker = new naver.maps.Marker({
        map: map,
        position: new naver.maps.LatLng(value.lng, value.lat),
        title: key
      })
      var infoWindow = new naver.maps.InfoWindow({
        content: '<div style="width:100px;text-align:center;padding:5px;"><b>"'+ value.name +'"</b></div>'
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
  }, [data]);

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

export default NaverMap;