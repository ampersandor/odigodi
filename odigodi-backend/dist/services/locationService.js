"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("../models"));
const sequelize_1 = require("sequelize");
class LocationService {
    /**
     * 새로운 위치 생성
     */
    async create(locationData) {
        try {
            const location = await models_1.default.location.create(locationData);
            return location;
        }
        catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to create location");
        }
    }
    /**
     * 모든 위치 조회
     */
    async findAll() {
        try {
            return await models_1.default.location.findAll({
                order: [['offinm', 'ASC']] // 이름순 정렬
            });
        }
        catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to retrieve locations");
        }
    }
    /**
     * ID로 위치 조회
     */
    async findOne(id) {
        try {
            const location = await models_1.default.location.findByPk(id);
            return location;
        }
        catch (error) {
            throw new Error(error instanceof Error ? error.message : `Failed to retrieve location with id=${id}`);
        }
    }
    /**
     * 이름으로 위치 검색
     */
    async findByName(offinm) {
        try {
            return await models_1.default.location.findAll({
                where: {
                    offinm: {
                        [sequelize_1.Op.iLike]: `%${offinm}%`
                    }
                },
                order: [['offinm', 'ASC']]
            });
        }
        catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to search locations");
        }
    }
    /**
     * 특정 범위 내의 위치 검색
     */
    async findInRadius(lat, lng, radiusKm) {
        try {
            // Haversine formula를 사용한 거리 계산
            const earthRadiusKm = 6371; // 지구 반경 (km)
            return await models_1.default.location.findAll({
                where: models_1.default.Sequelize.literal(`
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
        }
        catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to find locations in radius");
        }
    }
    /**
     * 위치 존재 여부 확인
     */
    async exists(id) {
        try {
            const count = await models_1.default.location.count({
                where: { id }
            });
            return count > 0;
        }
        catch (error) {
            throw new Error(error instanceof Error ? error.message : `Failed to check location existence with id=${id}`);
        }
    }
}
exports.default = new LocationService();
