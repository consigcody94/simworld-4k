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

        // Find suitable location on land (not in water)
        let cityBaseHeight = 0;
        let cityX = offsetX;
        let cityZ = offsetZ;

        // Sample terrain to find land area
        for (let attempt = 0; attempt < 10; attempt++) {
            const testX = offsetX + (Math.random() - 0.5) * 100;
            const testZ = offsetZ + (Math.random() - 0.5) * 100;
            const height = this.world.getHeightAt(testX, testZ);

            if (height > 5 && height < 20) { // Good elevation for city
                cityX = testX;
                cityZ = testZ;
                cityBaseHeight = height;
                break;
            }
        }

        // Generate grid-based city on suitable terrain
        for (let x = 0; x < sizeX; x += blockSize + roadWidth) {
            for (let z = 0; z < sizeZ; z += blockSize + roadWidth) {
                const worldX = cityX + x - sizeX / 2;
                const worldZ = cityZ + z - sizeZ / 2;

                // Check terrain height - only build on suitable land
                const terrainHeight = this.world.getHeightAt(worldX, worldZ);

                // Only build city on land (above water level and not too steep)
                if (terrainHeight < 3 || terrainHeight > 25) {
                    continue; // Skip this block if underwater or too steep
                }

                // Create road intersections at terrain level
                const roadH = new Road(this.scene, worldX, worldZ, blockSize + roadWidth, roadWidth, 'horizontal', terrainHeight);
                const roadV = new Road(this.scene, worldX, worldZ, roadWidth, blockSize + roadWidth, 'vertical', terrainHeight);
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
                        style,
                        terrainHeight
                    );

                    buildings.push(building);
                }
            }
        }

        return { buildings, roads };
    }
}
