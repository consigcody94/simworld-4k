import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ModelLoader {
    constructor() {
        this.loader = new GLTFLoader();
        this.cache = new Map();

        // Free model URLs from Sketchfab and other sources (CC0 / Public Domain)
        this.modelUrls = {
            // Birds
            'eagle': 'https://assets.codepen.io/3/gltf/eagle.glb',
            'seagull': 'https://assets.codepen.io/3/internal/avatars/users/default.png?fit=crop&format=auto&height=256&version=1&width=256',

            // Fish
            'fish': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/fish/model.gltf',

            // Animals
            'deer': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/deer/model.gltf',
            'fox': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/fox/model.gltf'
        };
    }

    async loadModel(modelType) {
        // Check cache first
        if (this.cache.has(modelType)) {
            return this.cache.get(modelType).clone();
        }

        // If we have a URL for this model, try to load it
        if (this.modelUrls[modelType]) {
            try {
                const gltf = await this.loader.loadAsync(this.modelUrls[modelType]);
                this.cache.set(modelType, gltf.scene);
                return gltf.scene.clone();
            } catch (error) {
                console.warn(`Could not load ${modelType} model from URL, using fallback`, error);
                return this.createFallbackModel(modelType);
            }
        }

        // Return fallback model
        return this.createFallbackModel(modelType);
    }

    createFallbackModel(modelType) {
        // Create better procedural fallback models
        const group = new THREE.Group();

        switch (modelType) {
            case 'fish':
                return this.createBetterFish();
            case 'bird':
            case 'eagle':
            case 'seagull':
                return this.createBetterBird();
            case 'deer':
            case 'fox':
                return this.createBetterAnimal(modelType);
            default:
                return group;
        }
    }

    createBetterFish() {
        const group = new THREE.Group();

        // Use LatheGeometry for smooth fish body
        const points = [];
        for (let i = 0; i <= 10; i++) {
            const t = i / 10;
            const x = Math.sin(t * Math.PI) * 0.4;
            const y = (t - 0.5) * 2;
            points.push(new THREE.Vector2(x, y));
        }

        const bodyGeometry = new THREE.LatheGeometry(points, 16);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6600,
            roughness: 0.3,
            metalness: 0.7,
            emissive: 0xff6600,
            emissiveIntensity: 0.1
        });

        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.x = Math.PI / 2;
        body.castShadow = true;
        group.add(body);

        // Tail fin
        const tailShape = new THREE.Shape();
        tailShape.moveTo(0, 0);
        tailShape.lineTo(-0.6, 0.4);
        tailShape.lineTo(-0.5, 0);
        tailShape.lineTo(-0.6, -0.4);
        tailShape.lineTo(0, 0);

        const tailGeometry = new THREE.ShapeGeometry(tailShape);
        const tailMaterial = new THREE.MeshStandardMaterial({
            color: 0xff8c00,
            side: THREE.DoubleSide,
            roughness: 0.4,
            metalness: 0.6
        });

        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.position.z = -1;
        tail.castShadow = true;
        group.add(tail);

        // Dorsal fin
        const dorsalShape = new THREE.Shape();
        dorsalShape.moveTo(0, 0);
        dorsalShape.lineTo(0.3, 0.5);
        dorsalShape.lineTo(-0.2, 0);
        dorsalShape.lineTo(0, 0);

        const dorsalGeometry = new THREE.ShapeGeometry(dorsalShape);
        const dorsalFin = new THREE.Mesh(dorsalGeometry, tailMaterial);
        dorsalFin.position.z = -0.2;
        dorsalFin.position.y = 0.4;
        dorsalFin.rotation.x = Math.PI / 2;
        dorsalFin.castShadow = true;
        group.add(dorsalFin);

        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const eyeMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            roughness: 0.2,
            metalness: 0.8
        });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(0.3, 0.1, 0.7);
        group.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(-0.3, 0.1, 0.7);
        group.add(rightEye);

        group.scale.set(0.5, 0.5, 0.5);
        return group;
    }

    createBetterBird() {
        const group = new THREE.Group();

        // Streamlined body
        const bodyGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        bodyGeometry.scale(1.5, 1, 0.8);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321,
            roughness: 0.8,
            metalness: 0.1
        });

        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        group.add(body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.2, 12, 12);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.set(0.4, 0.1, 0);
        head.castShadow = true;
        group.add(head);

        // Beak
        const beakGeometry = new THREE.ConeGeometry(0.05, 0.2, 8);
        const beakMaterial = new THREE.MeshStandardMaterial({ color: 0xffa500 });
        const beak = new THREE.Mesh(beakGeometry, beakMaterial);
        beak.rotation.z = -Math.PI / 2;
        beak.position.set(0.6, 0.1, 0);
        group.add(beak);

        // Wings with better shape
        const wingShape = new THREE.Shape();
        wingShape.moveTo(0, 0);
        wingShape.bezierCurveTo(0.5, 0.2, 1, 0.3, 1.5, 0.2);
        wingShape.lineTo(1.3, 0);
        wingShape.bezierCurveTo(0.8, -0.1, 0.3, -0.1, 0, 0);

        const wingGeometry = new THREE.ShapeGeometry(wingShape);
        const wingMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321,
            side: THREE.DoubleSide,
            roughness: 0.9
        });

        const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
        leftWing.position.z = 0.3;
        leftWing.castShadow = true;
        group.add(leftWing);

        const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
        rightWing.position.z = -0.3;
        rightWing.rotation.y = Math.PI;
        rightWing.castShadow = true;
        group.add(rightWing);

        // Tail
        const tailGeometry = new THREE.ConeGeometry(0.2, 0.6, 8);
        tailGeometry.rotateX(Math.PI / 2);
        const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
        tail.position.x = -0.5;
        tail.castShadow = true;
        group.add(tail);

        group.scale.set(0.6, 0.6, 0.6);
        return group;
    }

    createBetterAnimal(type) {
        const group = new THREE.Group();

        const furColor = type === 'fox' ? 0xcd5c5c : 0x8b7355;
        const material = new THREE.MeshStandardMaterial({
            color: furColor,
            roughness: 0.9,
            metalness: 0.05
        });

        // Body using capsule
        const bodyGeometry = new THREE.CapsuleGeometry(0.4, 1.2, 4, 8);
        const body = new THREE.Mesh(bodyGeometry, material);
        body.rotation.z = Math.PI / 2;
        body.position.y = 0.8;
        body.castShadow = true;
        group.add(body);

        // Head
        const headGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.3);
        const head = new THREE.Mesh(headGeometry, material);
        head.position.set(0.8, 1, 0);
        head.castShadow = true;
        group.add(head);

        // Snout
        const snoutGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.2);
        const snout = new THREE.Mesh(snoutGeometry, material);
        snout.position.set(1, 0.9, 0);
        group.add(snout);

        // Ears
        const earGeometry = new THREE.ConeGeometry(0.12, 0.3, 8);
        const leftEar = new THREE.Mesh(earGeometry, material);
        leftEar.position.set(0.7, 1.3, 0.15);
        group.add(leftEar);

        const rightEar = new THREE.Mesh(earGeometry, material);
        rightEar.position.set(0.7, 1.3, -0.15);
        group.add(rightEar);

        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.8, 8);
        const legPositions = [
            [0.4, 0.4, 0.3],
            [0.4, 0.4, -0.3],
            [-0.3, 0.4, 0.3],
            [-0.3, 0.4, -0.3]
        ];

        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, material);
            leg.position.set(pos[0], pos[1], pos[2]);
            leg.castShadow = true;
            group.add(leg);
        });

        // Tail
        const tailGeometry = new THREE.ConeGeometry(0.1, 0.6, 8);
        const tail = new THREE.Mesh(tailGeometry, material);
        tail.position.set(-0.9, 0.9, 0);
        tail.rotation.z = Math.PI / 4;
        tail.castShadow = true;
        group.add(tail);

        group.scale.set(0.8, 0.8, 0.8);
        return group;
    }

    // Create a simple placeholder while model loads
    createLoadingPlaceholder() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({
            color: 0x808080,
            transparent: true,
            opacity: 0.5
        });
        return new THREE.Mesh(geometry, material);
    }
}
