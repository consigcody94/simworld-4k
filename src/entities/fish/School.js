import * as THREE from 'three';
import { RealisticFish } from '../../models/RealisticFish.js';

export class School {
    constructor(scene, count, startPosition) {
        this.scene = scene;
        this.fish = [];
        this.center = new THREE.Vector3(startPosition.x, startPosition.y, startPosition.z);

        this.createFish(count, startPosition);
    }

    createFish(count, startPosition) {
        for (let i = 0; i < count; i++) {
            const offset = {
                x: (Math.random() - 0.5) * 15,
                y: (Math.random() - 0.5) * 5,
                z: (Math.random() - 0.5) * 15
            };

            const species = RealisticFish.randomSpecies();
            const fish = new RealisticFish(
                this.scene,
                startPosition.x + offset.x,
                startPosition.y + offset.y,
                startPosition.z + offset.z,
                species
            );

            this.fish.push(fish);
        }
    }

    update(deltaTime) {
        // Calculate school center
        this.center.set(0, 0, 0);
        this.fish.forEach(fish => {
            this.center.add(fish.position);
        });
        this.center.divideScalar(this.fish.length);

        // Update each fish with schooling behavior
        this.fish.forEach(fish => {
            this.applySchoolingBehavior(fish);
            fish.update(deltaTime);
        });
    }

    applySchoolingBehavior(fish) {
        const separation = new THREE.Vector3();
        const alignment = new THREE.Vector3();
        const cohesion = new THREE.Vector3();

        let nearbyCount = 0;
        const perceptionRadius = 10;

        this.fish.forEach(other => {
            if (other === fish) return;

            const distance = fish.position.distanceTo(other.position);

            if (distance < perceptionRadius) {
                const diff = new THREE.Vector3().subVectors(fish.position, other.position);
                diff.divideScalar(distance);
                separation.add(diff);

                alignment.add(other.velocity);
                cohesion.add(other.position);

                nearbyCount++;
            }
        });

        if (nearbyCount > 0) {
            separation.divideScalar(nearbyCount);
            if (separation.length() > 0) {
                separation.normalize().multiplyScalar(0.4);
            }

            alignment.divideScalar(nearbyCount);
            alignment.normalize().multiplyScalar(0.3);

            cohesion.divideScalar(nearbyCount);
            cohesion.sub(fish.position);
            cohesion.normalize().multiplyScalar(0.15);

            fish.acceleration.add(separation);
            fish.acceleration.add(alignment);
            fish.acceleration.add(cohesion);
        }

        this.applyBounds(fish);
    }

    applyBounds(fish) {
        const bounds = 400;
        const turnFactor = 0.3;

        if (fish.position.x > bounds) fish.acceleration.x -= turnFactor;
        if (fish.position.x < -bounds) fish.acceleration.x += turnFactor;
        if (fish.position.z > bounds) fish.acceleration.z -= turnFactor;
        if (fish.position.z < -bounds) fish.acceleration.z += turnFactor;

        // Keep fish underwater
        if (fish.position.y > -2) fish.acceleration.y -= turnFactor;
        if (fish.position.y < -20) fish.acceleration.y += turnFactor;
    }

    getFishCount() {
        return this.fish.length;
    }
}
