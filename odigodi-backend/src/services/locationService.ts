import { LocationModel } from "../models/location";

import db from "../models";
import { Op } from "sequelize";
class LocationService {
  /**
   * 모든 위치 조회
   */
  async findAll(): Promise<LocationModel[]> {
    try {
      return await db.location.findAll();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to retrieve locations");
    }
  }

  /**
   * ID로 위치 조회
   */
  async findOne(id: string): Promise<LocationModel | null> {
    try {
      const location = await db.location.findByPk(id);
      return location;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : `Failed to retrieve location with id=${id}`);
    }
  }

  /**
   * 이름으로 위치 검색
   */
  async findByName(offinm: string): Promise<LocationModel[]> {
    try {
      return await db.location.findAll({
        where: {
          offinm: {
            [Op.iLike]: `%${offinm}%`
          }
        },
        order: [['offinm', 'ASC']]
      });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to search locations");
    }
  }

  /**
   * 특정 범위 내의 위치 검색
   */
  async findInRadius(lat: number, lng: number, radiusKm: number): Promise<LocationModel[]> {
    try {
      // Haversine formula를 사용한 거리 계산
      const earthRadiusKm = 6371; // 지구 반경 (km)
      return await db.location.findAll({
        where: db.Sequelize.literal(`
          ${earthRadiusKm} * acos(
            cos(radians(${lat})) * 
            cos(radians(lat)) * 
            cos(radians(lng) - radians(${lng})) + 
            sin(radians(${lat})) * 
            sin(radians(lat))
          ) <= ${radiusKm}
        `),
        order: [['offinm', 'ASC']]
      });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to find locations in radius");
    }
  }

  /**
   * 위치 존재 여부 확인
   */
  async exists(id: string): Promise<boolean> {
    try {
      const count = await db.location.count({
        where: { id }
      });
      return count > 0;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : `Failed to check location existence with id=${id}`);
    }
  }
}

export default new LocationService();