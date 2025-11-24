import * as THREE from 'three';
import { EnhancedBuilding } from '../graphics/EnhancedBuilding.js';
import { Road } from './Road.js';

export class CityGenerator {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
    }

    generateCity(sizeX, sizeZ, offsetX, offsetZ) {
        const buildings = [];
        const roads = [];

        const blockSize = 20;
        const roadWidth = 4;

        // Generate grid-based city
        for (let x = 0; x < sizeX; x += blockSize + roadWidth) {
            for (let z = 0; z < sizeZ; z += blockSize + roadWidth) {
                const worldX = offsetX + x - sizeX / 2;
                const worldZ = offsetZ + z - sizeZ / 2;

                // Create road intersections
                const roadH = new Road(this.scene, worldX, worldZ, blockSize + roadWidth, roadWidth, 'horizontal');
                const roadV = new Road(this.scene, worldX, worldZ, roadWidth, blockSize + roadWidth, 'vertical');
                roads.push(roadH, roadV);

                // Create building if not on road
                if (Math.random() > 0.2) {
                    const buildingWidth = blockSize - 2;
                    const buildingDepth = blockSize - 2;
                    const buildingHeight = 10 + Math.random() * 30;
                    const style = EnhancedBuilding.randomStyle();

                    const building = new EnhancedBuilding(
                        this.scene,
                        worldX + roadWidth,
                        worldZ + roadWidth,
                        buildingWidth,
                        buildingHeight,
                        buildingDepth,
                        style
                    );

                    buildings.push(building);
                }
            }
        }

        return { buildings, roads };
    }
}
