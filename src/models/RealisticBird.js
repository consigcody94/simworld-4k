import * as THREE from 'three';

export class RealisticBird {
    constructor(scene, x, y, z, species = 'eagle') {
        this.scene = scene;
        this.position = new THREE.Vector3(x, y, z);
        this.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 2
        );
        this.acceleration = new THREE.Vector3();
        this.species = species;

        this.maxSpeed = 10;
        this.maxForce = 0.5;

        this.wingAngle = 0;
        this.wingSpeed = 8;

        this.createMesh();
    }

    createMesh() {
        this.mesh = new THREE.Group();

        // Body
        const bodyGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        bodyGeometry.scale(1.5, 1, 0.8);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: this.getColorForSpecies(),
            roughness: 0.7,
            metalness: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        this.mesh.add(body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.25, 12, 12);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: this.getColorForSpecies(),
            roughness: 0.8,
            metalness: 0.1
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(0.5, 0.1, 0);
        head.castShadow = true;
        this.mesh.add(head);

        // Beak
        const beakGeometry = new THREE.ConeGeometry(0.08, 0.25, 8);
        const beakMaterial = new THREE.MeshStandardMaterial({
            color: 0xffa500,
            roughness: 0.6
        });
        const beak = new THREE.Mesh(beakGeometry, beakMaterial);
        beak.rotation.z = -Math.PI / 2;
        beak.position.set(0.75, 0.1, 0);
        beak.castShadow = true;
        this.mesh.add(beak);

        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const eyeMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            roughness: 0.3,
            metalness: 0.7
        });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(0.6, 0.2, 0.12);
        this.mesh.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.6, 0.2, -0.12);
        this.mesh.add(rightEye);

        // Left Wing
        const wingGeometry = this.createWingGeometry();
        const wingMaterial = new THREE.MeshStandardMaterial({
            color: this.getColorForSpecies(),
            roughness: 0.8,
            metalness: 0.1,
            side: THREE.DoubleSide
        });

        this.leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
        this.leftWing.position.set(0, 0, 0.4);
        this.leftWing.castShadow = true;
        this.mesh.add(this.leftWing);

        // Right Wing (mirrored)
        this.rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
        this.rightWing.position.set(0, 0, -0.4);
        this.rightWing.rotation.y = Math.PI;
        this.rightWing.castShadow = true;
        this.mesh.add(this.rightWing);

        // Tail
        const tailGeometry = new THREE.ConeGeometry(0.3, 0.8, 8);
        tailGeometry.rotateX(Math.PI / 2);
        const tailMaterial = new THREE.MeshStandardMaterial({
            color: this.getColorForSpecies(),
            roughness: 0.8
        });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.position.set(-0.7, 0, 0);
        tail.castShadow = true;
        this.mesh.add(tail);

        // Feet (small)
        const feetGeometry = new THREE.SphereGeometry(0.05, 6, 6);
        const feetMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b7355
        });

        const leftFoot = new THREE.Mesh(feetGeometry, feetMaterial);
        leftFoot.position.set(0, -0.4, 0.15);
        this.mesh.add(leftFoot);

        const rightFoot = new THREE.Mesh(feetGeometry, feetMaterial);
        rightFoot.position.set(0, -0.4, -0.15);
        this.mesh.add(rightFoot);

        this.scene.add(this.mesh);
    }

    createWingGeometry() {
        const shape = new THREE.Shape();

        // Wing shape - more realistic bird wing profile
        shape.moveTo(0, 0);
        shape.bezierCurveTo(0.5, 0.3, 1.5, 0.5, 2, 0.3);
        shape.bezierCurveTo(2.2, 0.2, 2.3, 0, 2.3, -0.2);
        shape.bezierCurveTo(2.2, -0.3, 1.5, -0.4, 0.8, -0.3);
        shape.bezierCurveTo(0.3, -0.2, 0, -0.1, 0, 0);

        const extrudeSettings = {
            depth: 0.05,
            bevelEnabled: false
        };

        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    getColorForSpecies() {
        switch (this.species) {
            case 'eagle':
                return 0x4a3c28;
            case 'seagull':
                return 0xf5f5f5;
            case 'crow':
                return 0x1a1a1a;
            case 'cardinal':
                return 0xc41e3a;
            case 'bluejay':
                return 0x4169e1;
            default:
                return 0x8b7355;
        }
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
        }

        // Animate wings - realistic flapping
        this.wingAngle += this.wingSpeed * deltaTime;
        const flapAmount = Math.sin(this.wingAngle) * 0.8 + 0.2; // 0.2 to 1.0

        if (this.leftWing && this.rightWing) {
            this.leftWing.rotation.x = flapAmount;
            this.rightWing.rotation.x = -flapAmount;
        }

        // Body bob slightly with wing flapping
        this.mesh.position.y += Math.sin(this.wingAngle) * 0.05;
    }

    static randomSpecies() {
        const species = ['eagle', 'seagull', 'crow', 'cardinal', 'bluejay'];
        return species[Math.floor(Math.random() * species.length)];
    }
}
