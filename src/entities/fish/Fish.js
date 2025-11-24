import * as THREE from 'three';

export class Fish {
    constructor(scene, x, y, z) {
        this.scene = scene;

        this.position = new THREE.Vector3(x, y, z);
        this.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 1.5
        );
        this.acceleration = new THREE.Vector3();

        this.maxSpeed = 5;
        this.maxForce = 0.3;

        this.createMesh();
    }

    createMesh() {
        // Fish body shape
        const bodyGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        bodyGeometry.scale(1.5, 0.8, 0.8);

        const material = new THREE.MeshStandardMaterial({
            color: 0xff6600,
            metalness: 0.3,
            roughness: 0.7
        });

        this.mesh = new THREE.Mesh(bodyGeometry, material);

        // Tail
        const tailGeometry = new THREE.ConeGeometry(0.2, 0.5, 4);
        const tail = new THREE.Mesh(tailGeometry, material);
        tail.rotation.x = -Math.PI / 2;
        tail.position.z = -0.4;
        this.mesh.add(tail);

        this.scene.add(this.mesh);
    }

    update(deltaTime) {
        this.velocity.add(this.acceleration);

        if (this.velocity.length() > this.maxSpeed) {
            this.velocity.normalize().multiplyScalar(this.maxSpeed);
        }

        const deltaVelocity = this.velocity.clone().multiplyScalar(deltaTime);
        this.position.add(deltaVelocity);

        this.acceleration.set(0, 0, 0);

        this.mesh.position.copy(this.position);

        if (this.velocity.length() > 0.1) {
            const lookAtPoint = this.position.clone().add(this.velocity);
            this.mesh.lookAt(lookAtPoint);
        }

        // Tail swimming animation
        const time = Date.now() * 0.005;
        if (this.mesh.children[0]) {
            this.mesh.children[0].rotation.y = Math.sin(time) * 0.3;
        }
    }
}
