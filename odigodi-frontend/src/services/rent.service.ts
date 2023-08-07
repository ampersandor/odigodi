import http from "../http-common";
import IRentData from "../types/rent.type"

class RentDataService {
  get(name: string) {
    return http.get<IRentData>(`/rent/${name}`);
  }
}

export default new RentDataService();