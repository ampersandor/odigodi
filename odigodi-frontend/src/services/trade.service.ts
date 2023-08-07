import http from "../http-common";
import ITradeData from "../types/trade.type"

class TradeDataService {
  get(name: string) {
    return http.get<ITradeData>(`/trade/${name}`);
  }
}

export default new TradeDataService();