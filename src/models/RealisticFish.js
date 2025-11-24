import * as THREE from 'three';

export class RealisticFish {
    constructor(scene, x, y, z, species = 'tropical') {
        this.scene = scene;
        this.position = new THREE.Vector3(x, y, z);
        this.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 1.5
        );
        this.acceleration = new THREE.Vector3();
        this.species = species;

        this.maxSpeed = 5;
        this.maxForce = 0.3;

        this.tailAngle = 0;
        this.tailSpeed = 5;

        this.createMesh();
    }

    createMesh() {
        this.mesh = new THREE.Group();

        // Main body - fish-shaped
        const bodyGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        bodyGeometry.scale(2, 0.8, 0.6);

        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: this.getColorForSpecies(),
            roughness: 0.3,
            metalness: 0.6,
            emissive: this.getColorForSpecies(),
            emissiveIntensity: 0.1
        });

        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        this.mesh.add(body);

        // Head bump
        const headGeometry = new THREE.SphereGeometry(0.35, 12, 12);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.set(0.5, 0.1, 0);
        head.scale.set(0.8, 0.9, 0.9);
        head.castShadow = true;
        this.mesh.add(head);

        // Eyes
        const eyeWhiteGeometry = new THREE.SphereGeometry(0.12, 12, 12);
        const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.3
        });

        const leftEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
        leftEyeWhite.position.set(0.6, 0.2, 0.25);
        this.mesh.add(leftEyeWhite);

        const rightEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
        rightEyeWhite.position.set(0.6, 0.2, -0.25);
        this.mesh.add(rightEyeWhite);

        // Pupils
        const pupilGeometry = new THREE.SphereGeometry(0.06, 8, 8);
        const pupilMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000
        });

        const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.set(0.65, 0.2, 0.25);
        this.mesh.add(leftPupil);

        const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        rightPupil.position.set(0.65, 0.2, -0.25);
        this.mesh.add(rightPupil);

        // Dorsal fin (top)
        const dorsalFinGeometry = this.createFinGeometry(0.6, 0.4);
        const finMaterial = new THREE.MeshStandardMaterial({
            color: this.getFinColor(),
            roughness: 0.5,
            metalness: 0.4,
            side: THREE.DoubleSide
        });

        const dorsalFin = new THREE.Mesh(dorsalFinGeometry, finMaterial);
        dorsalFin.position.set(-0.2, 0.5, 0);
        dorsalFin.rotation.x = Math.PI / 2;
        dorsalFin.castShadow = true;
        this.mesh.add(dorsalFin);

        // Pectoral fins (sides)
        const pectoralFinGeometry = this.createFinGeometry(0.5, 0.3);

        this.leftPectoralFin = new THREE.Mesh(pectoralFinGeometry, finMaterial);
        this.leftPectoralFin.position.set(0.2, -0.1, 0.5);
        this.leftPectoralFin.rotation.set(0, Math.PI / 4, 0);
        this.leftPectoralFin.castShadow = true;
        this.mesh.add(this.leftPectoralFin);

        this.rightPectoralFin = new THREE.Mesh(pectoralFinGeometry, finMaterial);
        this.rightPectoralFin.position.set(0.2, -0.1, -0.5);
        this.rightPectoralFin.rotation.set(0, -Math.PI / 4, 0);
        this.rightPectoralFin.castShadow = true;
        this.mesh.add(this.rightPectoralFin);

        // Tail
        const tailGeometry = this.createTailGeometry();
        const tailMaterial = new THREE.MeshStandardMaterial({
            color: this.getFinColor(),
            roughness: 0.4,
            metalness: 0.5,
            side: THREE.DoubleSide
        });

        this.tail = new THREE.Mesh(tailGeometry, tailMaterial);
        this.tail.position.set(-0.8, 0, 0);
        this.tail.castShadow = true;
        this.mesh.add(this.tail);

        // Scales pattern (using small spheres)
        this.addScalePattern();

        this.scene.add(this.mesh);
    }

    createFinGeometry(length, width) {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.quadraticCurveTo(length / 2, width, length, 0);
        shape.lineTo(length * 0.8, 0);
        shape.quadraticCurveTo(length / 2, width * 0.5, 0, 0);

        const extrudeSettings = {
            depth: 0.02,
            bevelEnabled: false
        };

        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    createTailGeometry() {
        const shape = new THREE.Shape();

        // Fork-shaped tail
        shape.moveTo(0, 0);
        shape.bezierCurveTo(0.2, 0.5, 0.4, 0.7, 0.5, 0.8);
        shape.lineTo(0.4, 0.6);
        shape.bezierCurveTo(0.3, 0.4, 0.1, 0.2, 0, 0);
        shape.bezierCurveTo(0.1, -0.2, 0.3, -0.4, 0.4, -0.6);
        shape.lineTo(0.5, -0.8);
        shape.bezierCurveTo(0.4, -0.7, 0.2, -0.5, 0, 0);

        const extrudeSettings = {
            depth: 0.05,
            bevelEnabled: false
        };

        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    addScalePattern() {
        // Add a few visible scales for detail
        const scaleGeometry = new THREE.CircleGeometry(0.08, 8);
        const scaleMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.2,
            metalness: 0.8,
            transparent: true,
            opacity: 0.3
        });

        for (let i = 0; i < 8; i++) {
            const scale = new THREE.Mesh(scaleGeometry, scaleMaterial);
            scale.position.set(
                -0.4 + i * 0.15,
                0,
                0.35
            );
            scale.rotation.y = Math.PI / 2;
            this.mesh.add(scale);
        }
    }

    getColorForSpecies() {
        switch (this.species) {
            case 'tropical':
                return 0xff6b35;
            case 'goldfish':
                return 0xffa500;
            case 'blue':
                return 0x4169e1;
            case 'green':
                return 0x2ecc71;
            case 'purple':
                return 0x9b59b6;
            default:
                return 0xff8c00;
        }
    }

    getFinColor() {
        const baseColor = this.getColorForSpecies();
        const color = new THREE.Color(baseColor);
        color.multiplyScalar(0.8); // Slightly darker for fins
        return color.getHex();
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

        // Orient fish in direction of movement
        if (this.velocity.length() > 0.1) {
            const lookAtPoint = this.position.clone().add(this.velocity);
            this.mesh.lookAt(lookAtPoint);
        }

        // Animate tail - realistic swimming motion
        this.tailAngle += this.tailSpeed * deltaTime;
        const tailSwing = Math.sin(this.tailAngle) * 0.4;

        if (this.tail) {
            this.tail.rotation.y = tailSwing;
        }

        // Animate pectoral fins
        const finWave = Math.sin(this.tailAngle * 0.8) * 0.2;
        if (this.leftPectoralFin && this.rightPectoralFin) {
            this.leftPectoralFin.rotation.z = finWave;
            this.rightPectoralFin.rotation.z = -finWave;
        }

        // Body undulation
        this.mesh.rotation.z = Math.sin(this.tailAngle) * 0.1;
    }

    static randomSpecies() {
        const species = ['tropical', 'goldfish', 'blue', 'green', 'purple'];
        return species[Math.floor(Math.random() * species.length)];
    }
}
