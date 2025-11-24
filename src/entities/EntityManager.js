import { Flock } from './birds/Flock.js';
import { School } from './fish/School.js';
import { AnimalHerd } from './animals/AnimalHerd.js';

export class EntityManager {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;

        this.flocks = [];
        this.schools = [];
        this.herds = [];

        this.initialize();
    }

    initialize() {
        // Create bird flocks
        this.createBirdFlocks(5, 20); // 5 flocks of 20 birds each

        // Create fish schools
        this.createFishSchools(3, 30); // 3 schools of 30 fish each

        // Create animal herds
        this.createAnimalHerds(3, 10); // 3 herds of 10 animals each
    }

    createBirdFlocks(flockCount, birdsPerFlock) {
        for (let i = 0; i < flockCount; i++) {
            const x = (Math.random() - 0.5) * 500;
            const y = 30 + Math.random() * 40;
            const z = (Math.random() - 0.5) * 500;

            const flock = new Flock(this.scene, birdsPerFlock, { x, y, z });
            this.flocks.push(flock);
        }
    }

    createFishSchools(schoolCount, fishPerSchool) {
        for (let i = 0; i < schoolCount; i++) {
            const x = (Math.random() - 0.5) * 400;
            const y = -5 - Math.random() * 10; // Underwater
            const z = (Math.random() - 0.5) * 400;

            const school = new School(this.scene, fishPerSchool, { x, y, z });
            this.schools.push(school);
        }
    }

    createAnimalHerds(herdCount, animalsPerHerd) {
        for (let i = 0; i < herdCount; i++) {
            const x = (Math.random() - 0.5) * 400;
            const z = (Math.random() - 0.5) * 400;
            const y = this.world.getHeightAt(x, z);

            const herd = new AnimalHerd(this.scene, this.world, animalsPerHerd, { x, y, z });
            this.herds.push(herd);
        }
    }

    update(deltaTime, cameraPosition, settings) {
        // Update birds
        if (settings.enableBirds) {
            this.flocks.forEach(flock => flock.update(deltaTime));
        }

        // Update fish
        if (settings.enableFish) {
            this.schools.forEach(school => school.update(deltaTime));
        }

        // Update animals
        if (settings.enableAnimals) {
            this.herds.forEach(herd => herd.update(deltaTime));
        }
    }

    getBirdCount() {
        return this.flocks.reduce((sum, flock) => sum + flock.getBirdCount(), 0);
    }

    getFishCount() {
        return this.schools.reduce((sum, school) => sum + school.getFishCount(), 0);
    }

    getAnimalCount() {
        return this.herds.reduce((sum, herd) => sum + herd.getAnimalCount(), 0);
    }
}
