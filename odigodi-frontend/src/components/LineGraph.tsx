import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import RentDataService from "../services/api/rent.service";
import TradeDataService from "../services/api/trade.service";
import 'chartjs-adapter-date-fns';
import Lottie from 'lottie-react';
import lottieData from "../assets/find.json";
import { RentData, TradeData } from '../types';
import "./Tabs.css";

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface LineGraphProps {
  name: string;
  location_id: string;
}

interface TransactionRent {
  x: string;  // trade_ymd
  y: number;  // deposit
}

interface TransactionTrade {
  x: string;  // trade_ymd
  y: number;  // dealamount
}

interface TransactionData {
  [key: string]: TransactionRent[] | TransactionTrade[];
}

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: lottieData,
  rendererSettings: {
    preserveAspectRatio: "none",
  },
};

const chartOptions = {
    spanGaps: true,
    responsive: true,
    maintainAspectRatio: true, // 이 옵션을 true로 설정
    aspectRatio: 2, // 너비:높이 = 2:1 비율 설정
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '',
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        ticks: { color: "black", autoSkip: true },
        grid: { display: false },
      },
      y: {
        title: { display: false },
        ticks: { color: "black", autoSkip: true },
      },
    }
  };
const LineGraph: React.FC<LineGraphProps> = ({ name, location_id }) => {
  const [rents, setRents] = useState<TransactionData>({});
  const [trades, setTrades] = useState<TransactionData>({});
  const [sortedKeys, setSortedKeys] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [tradeResponse, rentResponse] = await Promise.all([
          TradeDataService.fetchTradeData(location_id),
          RentDataService.fetchRentData(location_id)
        ]);
        // Process trade data
        const tradeData: TransactionData = {};
        (tradeResponse.data as TradeData[]).forEach((value) => {
            if (!tradeData[value.excluusear]) {
                tradeData[value.excluusear] = [];
            }
            tradeData[value.excluusear].push({
                x: value.trade_ymd,
                y: value.dealamount
            });
        });
        setTrades(tradeData);
        // Process rent data
        const rentData: TransactionData = {};
        (rentResponse.data as RentData[]).forEach((value) => {
            if (!rentData[value.excluusear]) {
            rentData[value.excluusear] = [];
          }
          rentData[value.excluusear].push({
            x: value.trade_ymd,
            y: value.deposit
          });
        });
        setRents(rentData);

        setIsLoading(false);
      } catch (error) {
        console.error('Error in Drawing Line Graph:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [location_id]);

  useEffect(() => {
    if (rents && trades) {
      const allKeys = [...Object.keys(rents), ...Object.keys(trades)];
      const uniqueKeys = Array.from(new Set(allKeys));
      const sorted = uniqueKeys.sort();
      setSortedKeys(sorted);
      setSelectedTab(sorted[0]);
    }
  }, [rents, trades]);

  if (isLoading) {
    return (
      <Lottie
        animationData={lottieData}
        height='80%'
        width='80%'
      />
    );
  }

  const chartData = {
    datasets: [
      {
        label: '전세가',
        data: selectedTab ? rents[selectedTab] || [] : [],
        lineTension: 0.5,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '매매가',
        data: selectedTab ? trades[selectedTab] || [] : [],
        lineTension: 0.5,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      }
    ]
  };

  return (
    
    <div>
      {sortedKeys.length == 0 && (
        <div className="no-data-container">
            <h2 className="no-data-message">전세 및 매매 데이터가 없습니다.(월세 및 반전세 제외)</h2>
        </div>
      )}
      {sortedKeys.length > 0 && (
        <>
            <div className="tabs-container">
                <Tabs
                transition={false}
                id="area-tabs"
                className="mb-3"
                activeKey={selectedTab}
                onSelect={(key) => key && setSelectedTab(key)}
                >
                {sortedKeys.map((areaKey) => (
                    <Tab key={areaKey} eventKey={areaKey} title={`${areaKey}m²`} />
                ))}
            </Tabs>
            </div>
            <div style={{ width: '100%', height: 'calc(100% - 50px)' }}>
                <Line
                    data={chartData}
                options={{
                ...chartOptions,
                plugins: {
                    ...chartOptions.plugins,
                    title: {
                    ...chartOptions.plugins.title,
                    text: name
                    }
                }
                }}
                />
            </div>
        </>
      )}
    </div>
  );
};

export default LineGraph;