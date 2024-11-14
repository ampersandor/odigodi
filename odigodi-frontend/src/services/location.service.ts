import http from "../http-common";
import ILocationData from "../types/location.type"

class LocationDataService {
  getAll() {
    return http.get<Array<ILocationData>>("/location/get/all");
  }

}

export default new LocationDataService();