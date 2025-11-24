import * as THREE from 'three';
import { RealisticBird } from '../../models/RealisticBird.js';

export class Flock {
    constructor(scene, count, startPosition) {
        this.scene = scene;
        this.birds = [];
        this.center = new THREE.Vector3(startPosition.x, startPosition.y, startPosition.z);

        this.createBirds(count, startPosition);
    }

    createBirds(count, startPosition) {
        for (let i = 0; i < count; i++) {
            const offset = {
                x: (Math.random() - 0.5) * 20,
                y: (Math.random() - 0.5) * 10,
                z: (Math.random() - 0.5) * 20
            };

            const species = RealisticBird.randomSpecies();
            const bird = new RealisticBird(
                this.scene,
                startPosition.x + offset.x,
                startPosition.y + offset.y,
                startPosition.z + offset.z,
                species
            );

            this.birds.push(bird);
        }
    }

    update(deltaTime) {
        // Calculate flock center
        this.center.set(0, 0, 0);
        this.birds.forEach(bird => {
            this.center.add(bird.position);
        });
        this.center.divideScalar(this.birds.length);

        // Update each bird with flocking behavior
        this.birds.forEach(bird => {
            this.applyFlockingBehavior(bird);
            bird.update(deltaTime);
        });
    }

    applyFlockingBehavior(bird) {
        const separation = new THREE.Vector3();
        const alignment = new THREE.Vector3();
        const cohesion = new THREE.Vector3();

        let nearbyCount = 0;
        const perceptionRadius = 15;

        // Check all other birds
        this.birds.forEach(other => {
            if (other === bird) return;

            const distance = bird.position.distanceTo(other.position);

            if (distance < perceptionRadius) {
                // Separation: avoid crowding
                const diff = new THREE.Vector3().subVectors(bird.position, other.position);
                diff.divideScalar(distance);
                separation.add(diff);

                // Alignment: steer towards average heading
                alignment.add(other.velocity);

                // Cohesion: steer towards average position
                cohesion.add(other.position);

                nearbyCount++;
            }
        });

        if (nearbyCount > 0) {
            // Separation
            separation.divideScalar(nearbyCount);
            if (separation.length() > 0) {
                separation.normalize().multiplyScalar(0.3);
            }

            // Alignment
            alignment.divideScalar(nearbyCount);
            alignment.normalize().multiplyScalar(0.2);

            // Cohesion
            cohesion.divideScalar(nearbyCount);
            cohesion.sub(bird.position);
            cohesion.normalize().multiplyScalar(0.1);

            // Apply forces
            bird.acceleration.add(separation);
            bird.acceleration.add(alignment);
            bird.acceleration.add(cohesion);
        }

        // Keep birds in bounds
        this.applyBounds(bird);
    }

    applyBounds(bird) {
        const bounds = 400;
        const turnFactor = 0.5;

        if (bird.position.x > bounds) {
            bird.acceleration.x -= turnFactor;
        }
        if (bird.position.x < -bounds) {
            bird.acceleration.x += turnFactor;
        }
        if (bird.position.z > bounds) {
            bird.acceleration.z -= turnFactor;
        }
        if (bird.position.z < -bounds) {
            bird.acceleration.z += turnFactor;
        }
        if (bird.position.y > 100) {
            bird.acceleration.y -= turnFactor;
        }
        if (bird.position.y < 20) {
            bird.acceleration.y += turnFactor;
        }
    }

    getBirdCount() {
        return this.birds.length;
    }
}
