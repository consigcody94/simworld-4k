import * as THREE from 'three';

export class RealisticAnimal {
    constructor(scene, world, x, y, z, species = 'deer') {
        this.scene = scene;
        this.world = world;
        this.species = species;

        this.position = new THREE.Vector3(x, y, z);
        this.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.5,
            0,
            (Math.random() - 0.5) * 0.5
        );

        this.speed = 2;
        this.wanderAngle = Math.random() * Math.PI * 2;
        this.wanderChangeRate = 0.1;

        this.legPhase = 0;

        this.createMesh();
    }

    createMesh() {
        this.mesh = new THREE.Group();

        switch (this.species) {
            case 'deer':
                this.createDeer();
                break;
            case 'rabbit':
                this.createRabbit();
                break;
            case 'fox':
                this.createFox();
                break;
            default:
                this.createDeer();
        }

        this.scene.add(this.mesh);
    }

    createDeer() {
        const bodyColor = 0x8B7355;
        const material = new THREE.MeshStandardMaterial({
            color: bodyColor,
            roughness: 0.8,
            metalness: 0.1
        });

        // Body
        const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8);
        const body = new THREE.Mesh(bodyGeometry, material);
        body.rotation.z = Math.PI / 2;
        body.position.y = 1;
        body.castShadow = true;
        this.mesh.add(body);

        // Neck
        const neckGeometry = new THREE.CylinderGeometry(0.25, 0.3, 0.8, 8);
        const neck = new THREE.Mesh(neckGeometry, material);
        neck.position.set(0.7, 1.4, 0);
        neck.rotation.z = -0.5;
        neck.castShadow = true;
        this.mesh.add(neck);

        // Head
        const headGeometry = new THREE.BoxGeometry(0.4, 0.5, 0.35);
        const head = new THREE.Mesh(headGeometry, material);
        head.position.set(1.1, 1.9, 0);
        head.castShadow = true;
        this.mesh.add(head);

        // Snout
        const snoutGeometry = new THREE.BoxGeometry(0.35, 0.25, 0.25);
        const snout = new THREE.Mesh(snoutGeometry, material);
        snout.position.set(1.3, 1.8, 0);
        snout.castShadow = true;
        this.mesh.add(snout);

        // Ears
        const earGeometry = new THREE.ConeGeometry(0.15, 0.4, 8);
        const leftEar = new THREE.Mesh(earGeometry, material);
        leftEar.position.set(1.0, 2.2, 0.2);
        leftEar.rotation.z = -0.3;
        this.mesh.add(leftEar);

        const rightEar = new THREE.Mesh(earGeometry, material);
        rightEar.position.set(1.0, 2.2, -0.2);
        rightEar.rotation.z = -0.3;
        this.mesh.add(rightEar);

        // Antlers (if deer)
        const antlerMaterial = new THREE.MeshStandardMaterial({
            color: 0xd2b48c,
            roughness: 0.9
        });

        const antlerGeometry = new THREE.CylinderGeometry(0.03, 0.05, 0.6, 6);
        const leftAntler = new THREE.Mesh(antlerGeometry, antlerMaterial);
        leftAntler.position.set(1.0, 2.4, 0.15);
        leftAntler.rotation.z = -0.5;
        this.mesh.add(leftAntler);

        const rightAntler = new THREE.Mesh(antlerGeometry, antlerMaterial);
        rightAntler.position.set(1.0, 2.4, -0.15);
        rightAntler.rotation.z = -0.5;
        this.mesh.add(rightAntler);

        // Legs (stored for animation)
        this.legs = [];
        const legGeometry = new THREE.CylinderGeometry(0.1, 0.12, 1, 8);

        const legPositions = [
            [0.5, 0.5, 0.35],   // Front left
            [0.5, 0.5, -0.35],  // Front right
            [-0.5, 0.5, 0.35],  // Back left
            [-0.5, 0.5, -0.35]  // Back right
        ];

        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, material);
            leg.position.set(pos[0], pos[1], pos[2]);
            leg.castShadow = true;
            this.mesh.add(leg);
            this.legs.push(leg);
        });

        // Tail
        const tailGeometry = new THREE.ConeGeometry(0.08, 0.4, 8);
        const tail = new THREE.Mesh(tailGeometry, material);
        tail.position.set(-1.2, 1.1, 0);
        tail.rotation.z = Math.PI / 3;
        tail.castShadow = true;
        this.mesh.add(tail);

        // White belly spot
        const bellyGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const bellyMaterial = new THREE.MeshStandardMaterial({
            color: 0xf5f5dc,
            roughness: 0.9
        });
        const belly = new THREE.Mesh(bellyGeometry, bellyMaterial);
        belly.position.set(0, 0.7, 0);
        belly.scale.set(1, 0.5, 0.8);
        this.mesh.add(belly);
    }

    createRabbit() {
        const furColor = 0xd3d3d3;
        const material = new THREE.MeshStandardMaterial({
            color: furColor,
            roughness: 0.9,
            metalness: 0.05
        });

        // Body (smaller and rounder)
        const bodyGeometry = new THREE.SphereGeometry(0.4, 12, 12);
        bodyGeometry.scale(1.2, 1, 1);
        const body = new THREE.Mesh(bodyGeometry, material);
        body.position.y = 0.5;
        body.castShadow = true;
        this.mesh.add(body);

        // Head (large for rabbit)
        const headGeometry = new THREE.SphereGeometry(0.3, 12, 12);
        const head = new THREE.Mesh(headGeometry, material);
        head.position.set(0.5, 0.7, 0);
        head.castShadow = true;
        this.mesh.add(head);

        // Large ears
        const earGeometry = new THREE.CapsuleGeometry(0.08, 0.6, 4, 8);
        const leftEar = new THREE.Mesh(earGeometry, material);
        leftEar.position.set(0.5, 1.2, 0.15);
        leftEar.rotation.z = -0.2;
        this.mesh.add(leftEar);

        const rightEar = new THREE.Mesh(earGeometry, material);
        rightEar.position.set(0.5, 1.2, -0.15);
        rightEar.rotation.z = -0.2;
        this.mesh.add(rightEar);

        // Fluffy tail
        const tailGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const tail = new THREE.Mesh(tailGeometry, material);
        tail.position.set(-0.5, 0.5, 0);
        tail.castShadow = true;
        this.mesh.add(tail);

        // Legs (shorter for rabbit)
        this.legs = [];
        const legGeometry = new THREE.CylinderGeometry(0.06, 0.08, 0.4, 6);
        const legPositions = [
            [0.3, 0.2, 0.2],
            [0.3, 0.2, -0.2],
            [-0.2, 0.2, 0.2],
            [-0.2, 0.2, -0.2]
        ];

        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, material);
            leg.position.set(pos[0], pos[1], pos[2]);
            leg.castShadow = true;
            this.mesh.add(leg);
            this.legs.push(leg);
        });
    }

    createFox() {
        const furColor = 0xff6347;
        const material = new THREE.MeshStandardMaterial({
            color: furColor,
            roughness: 0.8,
            metalness: 0.1
        });

        // Body (sleeker than deer)
        const bodyGeometry = new THREE.CapsuleGeometry(0.35, 1, 4, 8);
        const body = new THREE.Mesh(bodyGeometry, material);
        body.rotation.z = Math.PI / 2;
        body.position.y = 0.7;
        body.castShadow = true;
        this.mesh.add(body);

        // Head (pointed fox face)
        const headGeometry = new THREE.ConeGeometry(0.25, 0.5, 8);
        const head = new THREE.Mesh(headGeometry, material);
        head.rotation.z = -Math.PI / 2;
        head.position.set(0.8, 0.8, 0);
        head.castShadow = true;
        this.mesh.add(head);

        // Pointed ears
        const earGeometry = new THREE.ConeGeometry(0.12, 0.3, 8);
        const leftEar = new THREE.Mesh(earGeometry, material);
        leftEar.position.set(0.7, 1.2, 0.15);
        this.mesh.add(leftEar);

        const rightEar = new THREE.Mesh(earGeometry, material);
        rightEar.position.set(0.7, 1.2, -0.15);
        this.mesh.add(rightEar);

        // Bushy tail
        const tailGeometry = new THREE.ConeGeometry(0.15, 0.8, 8);
        const whiteTipMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.9
        });
        const tail = new THREE.Mesh(tailGeometry, material);
        tail.position.set(-0.8, 0.7, 0);
        tail.rotation.z = Math.PI / 4;
        tail.castShadow = true;
        this.mesh.add(tail);

        // White tail tip
        const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), whiteTipMaterial);
        tailTip.position.set(-1.2, 0.9, 0);
        this.mesh.add(tailTip);

        // Legs
        this.legs = [];
        const legGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.7, 6);
        const legPositions = [
            [0.4, 0.35, 0.25],
            [0.4, 0.35, -0.25],
            [-0.3, 0.35, 0.25],
            [-0.3, 0.35, -0.25]
        ];

        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, material);
            leg.position.set(pos[0], pos[1], pos[2]);
            leg.castShadow = true;
            this.mesh.add(leg);
            this.legs.push(leg);
        });
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

        // Animate legs (walking motion)
        if (this.legs && this.legs.length > 0) {
            this.legPhase += deltaTime * 5;

            this.legs.forEach((leg, index) => {
                const phase = this.legPhase + (index % 2) * Math.PI;
                const swing = Math.sin(phase) * 0.3;
                leg.rotation.x = swing;
            });
        }
    }

    static randomSpecies() {
        const species = ['deer', 'rabbit', 'fox'];
        return species[Math.floor(Math.random() * species.length)];
    }
}
