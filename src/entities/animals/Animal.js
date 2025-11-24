import * as THREE from 'three';

export class Animal {
    constructor(scene, world, x, y, z) {
        this.scene = scene;
        this.world = world;

        this.position = new THREE.Vector3(x, y, z);
        this.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.5,
            0,
            (Math.random() - 0.5) * 0.5
        );

        this.speed = 2;
        this.wanderAngle = Math.random() * Math.PI * 2;
        this.wanderChangeRate = 0.1;

        this.createMesh();
    }

    createMesh() {
        // Simple animal shape (deer-like)
        const group = new THREE.Group();

        // Body
        const bodyGeometry = new THREE.BoxGeometry(0.8, 0.6, 1.2);
        const material = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            flatShading: true
        });
        const body = new THREE.Mesh(bodyGeometry, material);
        body.position.y = 0.8;
        body.castShadow = true;
        group.add(body);

        // Head
        const headGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.5);
        const head = new THREE.Mesh(headGeometry, material);
        head.position.set(0, 1.1, 0.7);
        head.castShadow = true;
        group.add(head);

        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8);
        const legs = [
            [-0.3, 0.4, 0.4],
            [0.3, 0.4, 0.4],
            [-0.3, 0.4, -0.4],
            [0.3, 0.4, -0.4]
        ];

        legs.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, material);
            leg.position.set(pos[0], pos[1], pos[2]);
            leg.castShadow = true;
            group.add(leg);
        });

        this.mesh = group;
        this.scene.add(this.mesh);
    }

    update(deltaTime) {
        // Simple wandering behavior
        this.wanderAngle += (Math.random() - 0.5) * this.wanderChangeRate;

        this.velocity.x = Math.cos(this.wanderAngle) * this.speed;
        this.velocity.z = Math.sin(this.wanderAngle) * this.speed;

        // Update position
        const deltaVelocity = this.velocity.clone().multiplyScalar(deltaTime);
        this.position.x += deltaVelocity.x;
        this.position.z += deltaVelocity.z;

        // Update Y position based on terrain
        this.position.y = this.world.getHeightAt(this.position.x, this.position.z);

        // Keep in bounds
        const bounds = 300;
        if (Math.abs(this.position.x) > bounds || Math.abs(this.position.z) > bounds) {
            this.wanderAngle += Math.PI;
        }

        // Update mesh
        this.mesh.position.copy(this.position);

        // Rotate to face direction
        if (this.velocity.length() > 0.1) {
            const angle = Math.atan2(this.velocity.x, this.velocity.z);
            this.mesh.rotation.y = angle;
        }

        // Animate legs (simple bobbing)
        const time = Date.now() * 0.005;
        this.mesh.children.forEach((child, index) => {
            if (index >= 2) { // Legs
                child.position.y = 0.4 + Math.abs(Math.sin(time + index)) * 0.1;
            }
        });
    }
}
