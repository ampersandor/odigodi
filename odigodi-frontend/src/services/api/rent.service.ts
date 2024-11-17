import { BaseApiService } from './base.service';
import { RentData, ApiResponse } from '../../types';

class RentService extends BaseApiService {
  private static instance: RentService;

  private constructor() {
    super();
  }

  static getInstance(): RentService {
    if (!RentService.instance) {
      RentService.instance = new RentService();
    }
    return RentService.instance;
  }

  async fetchRentData(locationId: string): Promise<ApiResponse<RentData>> {
    try {
      return await this.get<RentData>(`/rent/${locationId}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  // 필요한 경우 추가 메서드
  async getRentHistory(locationId: string, period?: string): Promise<ApiResponse<RentData[]>> {
    try {
      const url = period 
        ? `/rent/${locationId}/history?period=${period}`
        : `/rent/${locationId}/history`;
      return await this.get<RentData[]>(url);
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default RentService.getInstance();