import http from "../http-common";
import IRentData from "../types/rent.type"

class RentDataService {
  get(location_id: string) {
    return http.get<IRentData>(`/rent/${location_id}`);
  }
}

export default new RentDataService();