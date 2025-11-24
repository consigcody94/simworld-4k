import * as THREE from 'three';

class Vehicle {
    constructor(scene, startPos, path) {
        this.scene = scene;
        this.position = startPos.clone();
        this.path = path;
        this.pathIndex = 0;
        this.speed = 5 + Math.random() * 5;

        this.createMesh();
    }

    createMesh() {
        const geometry = new THREE.BoxGeometry(2, 1, 4);
        const colors = [0xff0000, 0x0000ff, 0x00ff00, 0xffff00, 0xff00ff];
        const color = colors[Math.floor(Math.random() * colors.length)];

        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.8,
            roughness: 0.2
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        this.mesh.castShadow = true;

        this.scene.add(this.mesh);
    }

    update(deltaTime) {
        if (this.pathIndex >= this.path.length) {
            this.pathIndex = 0;
        }

        const target = this.path[this.pathIndex];
        const direction = new THREE.Vector3().subVectors(target, this.position);
        const distance = direction.length();

        if (distance < 1) {
            this.pathIndex++;
            return;
        }

        direction.normalize();
        const movement = direction.multiplyScalar(this.speed * deltaTime);
        this.position.add(movement);

        this.mesh.position.copy(this.position);

        // Rotate to face direction
        const angle = Math.atan2(direction.x, direction.z);
        this.mesh.rotation.y = angle;
    }

    destroy() {
        this.scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
    }
}

export class TrafficSystem {
    constructor(scene) {
        this.scene = scene;
        this.vehicles = [];
        this.roads = [];
        this.spawnTimer = 0;
        this.spawnInterval = 2;
    }

    initialize(roads) {
        this.roads = roads;

        // Spawn initial vehicles
        for (let i = 0; i < 10; i++) {
            this.spawnVehicle();
        }
    }

    spawnVehicle() {
        if (this.roads.length === 0) return;

        const randomRoad = this.roads[Math.floor(Math.random() * this.roads.length)];
        const path = randomRoad.getPath();

        if (path && path.length > 0) {
            const startPos = path[0].clone();
            const vehicle = new Vehicle(this.scene, startPos, path);
            this.vehicles.push(vehicle);
        }
    }

    update(deltaTime) {
        // Update existing vehicles
        this.vehicles.forEach(vehicle => {
            vehicle.update(deltaTime);
        });

        // Spawn new vehicles periodically
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnInterval && this.vehicles.length < 50) {
            this.spawnVehicle();
            this.spawnTimer = 0;
        }
    }

    getVehicleCount() {
        return this.vehicles.length;
    }
}
