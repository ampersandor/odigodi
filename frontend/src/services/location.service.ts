import http from "../http-common";
import ILocationData from "../types/location.type"

class LocationDataService {
  getAll() {
    return http.get<Array<ILocationData>>("/location");
  }

  get(id: string) {
    return http.get<ILocationData>(`/location/${id}`);
  }

  create(data: ILocationData) {
    return http.post<ILocationData>("/location", data);
  }

  update(data: ILocationData, id: any) {
    return http.put<any>(`/location/${id}`, data);
  }

  delete(id: any) {
    return http.delete<any>(`/location/${id}`);
  }

  deleteAll() {
    return http.delete<any>(`/location`);
  }

  findByName(name: string) {
    return http.get<Array<ILocationData>>(`/location?name=${name}`);
  }
}

export default new LocationDataService();