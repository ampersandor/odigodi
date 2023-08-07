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
}
type trans_rent = {
  trade_ymd: string;
  deposite: number;
};
type trans_trade = {
  trade_ymd: string;
  price: number;
}

function timeout(delay: number) {
  return new Promise( res => setTimeout(res, delay) );
}

const LineGraph: FunctionComponent<Props> = ({name})  =>{
  console.log("l-> LineGraph is rendered with: " + name);
  const [rents, setRents] = useState<Map<string, Array<trans_rent>>>();
  const [trades, setTrades] = useState<Map<string, Array<trans_trade>>>();
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
    TradeDataService.get(name)
      .then((response: any) => {
        var trades = new Map<string, Array<trans_trade>>();
        response.data.forEach((value: any, key: any) => {           
          if(trades.has(value.area)){
            trades.get(value.area)?.push({x: value.trade_ymd, y: value.price})
          }
          else{
            trades.set(value.area, [{x: value.trade_ymd, y: value.price}])
          }
        })
        const tradesObject = Object.fromEntries(trades?.entries() || []);
        const sortedTradesObject = Object.keys(tradesObject).sort().reduce((sortedObj, key) => {
            sortedObj[key] = tradesObject[key];
            return sortedObj
        }, {});
        setTrades(sortedTradesObject);
        console.log("From Backend, retrieved Trades");
      })
      .catch((e: Error) => {
        console.log(e);
      });
    }, [])

  useEffect(() => {
      RentDataService.get(name)
        .then((response: any) => {
          var rents = new Map<string, Array<trans_rent>>();
          response.data.forEach((value: any, key: any) => {           
            if(rents.has(value.area)){
              rents.get(value.area)?.push({x: value.trade_ymd, y: value.deposite})
            }
            else{
              rents.set(value.area, [{x: value.trade_ymd, y: value.deposite}])
            }
          })
          const rentsObject = Object.fromEntries(rents?.entries() || []);
          const sortedRentsObject = Object.keys(rentsObject).sort().reduce((sortedObj, key) => {
              sortedObj[key] = rentsObject[key];
              return sortedObj
          }, {});
          setRents(sortedRentsObject);
          setSelectedTab(Object.keys(sortedRentsObject)[0]);
          console.log("From Backend, retrieved Rents");
        })
        .catch((e: Error) => {
          console.log(e);
        });
  }, []);

  return (
        <>
        {(rents && trades) ? 
        <React.Fragment>
          <Tabs
            transition={false}
            id="noanim-tab-example"
            className="mb-3"
            onSelect={(tabKey) => setSelectedTab(tabKey)} // Update the selectedTab state when a new tab is selected          
          >
            {Object.keys(rents).map((rentKey) => (
              <Tab key={rentKey} eventKey={rentKey} title={`${rentKey}m\xB2`} />
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