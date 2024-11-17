import { BaseApiService } from './base.service';
import { TradeData, ApiResponse } from '../../types';

class TradeService extends BaseApiService {
  private static instance: TradeService;

  private constructor() {
    super();
  }

  static getInstance(): TradeService {
    if (!TradeService.instance) {
      TradeService.instance = new TradeService();
    }
    return TradeService.instance;
  }

  async fetchTradeData(locationId: string): Promise<ApiResponse<TradeData>> {
    try {
      return await this.get<TradeData>(`/trade/${locationId}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  // 필요한 경우 추가 메서드
  async getTradeHistory(locationId: string, period?: string): Promise<ApiResponse<TradeData[]>> {
    try {
      const url = period 
        ? `/trade/${locationId}/history?period=${period}`
        : `/trade/${locationId}/history`;
      return await this.get<TradeData[]>(url);
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default TradeService.getInstance();