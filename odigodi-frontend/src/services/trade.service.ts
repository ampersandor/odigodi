import http from "../http-common";
import ITradeData from "../types/trade.type"

class TradeDataService {
  get(location_id: string) {
    return http.get<ITradeData>(`/trade/${location_id}`);
  }
}

export default new TradeDataService();