import { CityGenerator } from './CityGenerator.js';
import { TrafficSystem } from '../systems/TrafficSystem.js';
import { BuildingConstructor } from './BuildingConstructor.js';

export class CityManager {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;

        this.cityGenerator = new CityGenerator(scene, world);
        this.trafficSystem = new TrafficSystem(scene);
        this.buildingConstructor = new BuildingConstructor(scene);

        this.buildings = [];
        this.roads = [];

        this.initialize();
    }

    initialize() {
        // Generate initial city
        const cityData = this.cityGenerator.generateCity(100, 100, 0, 0);
        this.buildings = cityData.buildings;
        this.roads = cityData.roads;

        // Start building construction animations
        this.buildings.forEach((building, index) => {
            setTimeout(() => {
                this.buildingConstructor.constructBuilding(building);
            }, index * 500);
        });

        // Initialize traffic
        this.trafficSystem.initialize(this.roads);
    }

    update(deltaTime, cameraPosition, settings) {
        // Update building construction
        if (settings.enableConstruction) {
            this.buildingConstructor.update(deltaTime);
        }

        // Update traffic
        if (settings.enableTraffic) {
            this.trafficSystem.update(deltaTime);
        }
    }

    getVehicleCount() {
        return this.trafficSystem.getVehicleCount();
    }

    getBuildingCount() {
        return this.buildings.length;
    }
}
