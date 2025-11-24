import * as THREE from 'three';

export class Bird {
    constructor(scene, x, y, z) {
        this.scene = scene;

        this.position = new THREE.Vector3(x, y, z);
        this.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 2
        );
        this.acceleration = new THREE.Vector3();

        this.maxSpeed = 10;
        this.maxForce = 0.5;

        this.createMesh();
    }

    createMesh() {
        // Simple bird shape using geometry
        const geometry = new THREE.ConeGeometry(0.3, 1, 4);
        const material = new THREE.MeshStandardMaterial({
            color: 0x333333,
            flatShading: true
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.rotation.x = Math.PI / 2;

        this.scene.add(this.mesh);
    }

    update(deltaTime) {
        // Update velocity
        this.velocity.add(this.acceleration);

        // Limit speed
        if (this.velocity.length() > this.maxSpeed) {
            this.velocity.normalize().multiplyScalar(this.maxSpeed);
        }

        // Update position
        const deltaVelocity = this.velocity.clone().multiplyScalar(deltaTime);
        this.position.add(deltaVelocity);

        // Reset acceleration
        this.acceleration.set(0, 0, 0);

        // Update mesh
        this.mesh.position.copy(this.position);

        // Orient bird in direction of movement
        if (this.velocity.length() > 0.1) {
            const lookAtPoint = this.position.clone().add(this.velocity);
            this.mesh.lookAt(lookAtPoint);
            this.mesh.rotation.x += Math.PI / 2;
        }

        // Add wing flapping animation
        const time = Date.now() * 0.01;
        this.mesh.rotation.z = Math.sin(time) * 0.2;
    }
}
