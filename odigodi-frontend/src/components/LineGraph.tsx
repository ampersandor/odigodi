// @ts-nocheck
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, TimeScale} from 'chart.js';
import { Chart, Line } from 'react-chartjs-2';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import RentDataService from "../services/rent.service";
import TradeDataService from "../services/trade.service";
import { FunctionComponent, useEffect, useState } from 'react';
import 'chartjs-adapter-date-fns';
import lottieData from "../static/find.json";
import Lottie from "react-lottie";
import React from 'react'
import './linegraph.css'
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, TimeScale
);
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: lottieData,
  rendererSettings: {
    preserveAspectRatio: "none",
  },
};

interface Props {
  name: string;
  location_id: string;
}
type trans_rent = {
  trade_ymd: string;
  deposit: number;
};
type trans_trade = {
  trade_ymd: string;
  dealamount: number;
}

function timeout(delay: number) {
  return new Promise( res => setTimeout(res, delay) );
}

const LineGraph: FunctionComponent<Props> = ({name, location_id})  =>{
  console.log("l-> LineGraph is rendered with: " + name + " and " + location_id);
  const [rents, setRents] = useState<Map<string, Array<trans_rent>>>();
  const [trades, setTrades] = useState<Map<string, Array<trans_trade>>>();
  const [sortedKeys, setSortedKeys] = useState(Array<string>); // State for storing the sorted keys
  const [selectedTab, setSelectedTab] = useState<string>();

  const options = { 
    spanGaps: true, 
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: name,
      },
    },
    scales: {
      x: { type: 'time', ticks: { color: "black", autoSkip: true, }, grid: { display: false, },},
      y: { title: { display: false }, ticks: { color: "black", autoSkip: true}, },
    } 
  };
  useEffect(() => {
    if(rents && trades){
      console.log("sort selected keys")
      const allKeys = [...Object.keys(rents), ...Object.keys(trades)];
      const uniqueKeys = Array.from(new Set(allKeys));
      const sortedKeys = uniqueKeys.sort();

      setSortedKeys(sortedKeys); // Store the sorted keys in state
      setSelectedTab(sortedKeys[0]);
    }
  }, [rents, trades]);

  useEffect(() => {
    TradeDataService.get(location_id)
      .then((response: any) => {
        console.log("From Backend, retrieved Trades:", response.data.data);
        var trades = new Map<string, Array<trans_trade>>();
        response.data.data.forEach((value: any, key: any) => {           
          if(trades.has(value.excluusear)){
            trades.get(value.excluusear)?.push({x: value.trade_ymd, y: value.dealamount})
          }
          else{
            trades.set(value.excluusear, [{x: value.trade_ymd, y: value.dealamount}])
          }
        })
        const tradeObject = Object.fromEntries(trades);
        setTrades(tradeObject);
      })
      .catch((e: Error) => {
        console.log(e);
      });

        RentDataService.get(location_id)
      .then((response: any) => {
        console.log("From Backend, retrieved Rents:", response.data.data);
        const rents = new Map<string, Array<trans_rent>>();
        
        response.data.data.forEach((value: any) => {           
          if(rents.has(value.excluusear)){
            rents.get(value.excluusear)?.push({
              x: value.trade_ymd, 
              y: value.deposit
            })
          } else {
            rents.set(value.excluusear, [{
              x: value.trade_ymd, 
              y: value.deposit
            }])
          }
        });

        // Map을 Object로 단순 변환
        const rentsObject = Object.fromEntries(rents);
        setRents(rentsObject);
        console.log("Processed Rents:", rentsObject);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }, []);

  return (
        <>
        {(rents && trades && sortedKeys) ? 
        <React.Fragment>
          <Tabs
            transition={false}
            id="noanim-tab-example"
            className="mb-3"
            onSelect={(tabKey) => setSelectedTab(tabKey)} // Update the selectedTab state when a new tab is selected          
          >
            {Object.values(sortedKeys).map((areaKey) => (
              <Tab key={areaKey} eventKey={areaKey} title={`${areaKey}m\xB2`} />
            ))}
          </Tabs>
            <Line data={
              {
                datasets: [
                  {
                    label: '전세가',
                    data: rents[selectedTab],
                    lineTension: 0.5,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                  },
                  {
                    label: '매매가',
                    data: trades[selectedTab],
                    lineTension: 0.5,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                  }
                ]
              }
            } options={options}/>
        </React.Fragment>
        :
        <Lottie
                options={defaultOptions}
                height='80%'
                width='80%'
                isStopped={false}
                isPaused={false} />
        }
        </>
  )
}
export default LineGraph;