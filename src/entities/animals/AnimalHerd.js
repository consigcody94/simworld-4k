import * as THREE from 'three';
import { RealisticAnimal } from '../../models/RealisticAnimal.js';

export class AnimalHerd {
    constructor(scene, world, count, startPosition) {
        this.scene = scene;
        this.world = world;
        this.animals = [];

        this.createAnimals(count, startPosition);
    }

    createAnimals(count, startPosition) {
        for (let i = 0; i < count; i++) {
            const offset = {
                x: (Math.random() - 0.5) * 10,
                z: (Math.random() - 0.5) * 10
            };

            const x = startPosition.x + offset.x;
            const z = startPosition.z + offset.z;
            const y = this.world.getHeightAt(x, z);

            const species = RealisticAnimal.randomSpecies();
            const animal = new RealisticAnimal(this.scene, this.world, x, y, z, species);
            this.animals.push(animal);
        }
    }

    update(deltaTime) {
        this.animals.forEach(animal => {
            animal.update(deltaTime);
        });
    }

    getAnimalCount() {
        return this.animals.length;
    }
}
