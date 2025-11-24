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

        // Find suitable location on land (not in water) - sample many points
        let cityBaseHeight = 10;
        let cityX = 200; // Start far from water
        let cityZ = 200;

        // Sample terrain extensively to find best flat land area
        let bestScore = -1;
        for (let attempt = 0; attempt < 50; attempt++) {
            const testX = offsetX + (Math.random() - 0.5) * 400 + 200;
            const testZ = offsetZ + (Math.random() - 0.5) * 400 + 200;
            const height = this.world.getHeightAt(testX, testZ);

            // Check multiple points around this location for flatness
            let flatnessScore = 0;
            let allAboveWater = true;

            for (let dx = -20; dx <= 20; dx += 10) {
                for (let dz = -20; dz <= 20; dz += 10) {
                    const checkHeight = this.world.getHeightAt(testX + dx, testZ + dz);

                    // Must be above water
                    if (checkHeight < 5) {
                        allAboveWater = false;
                        break;
                    }

                    // Calculate flatness
                    flatnessScore += Math.abs(checkHeight - height);
                }
                if (!allAboveWater) break;
            }

            // Good elevation for city: above water but not too steep
            if (allAboveWater && height > 8 && height < 25 && flatnessScore < 20) {
                const score = height - flatnessScore;
                if (score > bestScore) {
                    bestScore = score;
                    cityX = testX;
                    cityZ = testZ;
                    cityBaseHeight = height;
                }
            }
        }

        console.log(`🏙️  City placed at height: ${cityBaseHeight.toFixed(2)}`);

        // Generate grid-based city on suitable terrain
        for (let x = 0; x < sizeX; x += blockSize + roadWidth) {
            for (let z = 0; z < sizeZ; z += blockSize + roadWidth) {
                const worldX = cityX + x - sizeX / 2;
                const worldZ = cityZ + z - sizeZ / 2;

                // Check terrain height - only build on suitable land
                const terrainHeight = this.world.getHeightAt(worldX, worldZ);

                // STRICT: Only build city on land (well above water level)
                if (terrainHeight < 8 || terrainHeight > 30) {
                    continue; // Skip this block if underwater or too steep
                }

                // Also check surrounding area isn't too steep
                const surroundingHeights = [
                    this.world.getHeightAt(worldX + 5, worldZ),
                    this.world.getHeightAt(worldX - 5, worldZ),
                    this.world.getHeightAt(worldX, worldZ + 5),
                    this.world.getHeightAt(worldX, worldZ - 5)
                ];

                const maxHeightDiff = Math.max(...surroundingHeights) - Math.min(...surroundingHeights);
                if (maxHeightDiff > 5) {
                    continue; // Too steep, skip
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
