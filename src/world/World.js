import * as THREE from 'three';
import { EnhancedTerrain } from '../graphics/EnhancedTerrain.js';
import { AdvancedWater } from '../graphics/AdvancedWater.js';
import { ChunkManager } from './ChunkManager.js';

export class World {
    constructor(scene, renderer) {
        this.scene = scene;
        this.renderer = renderer;
        this.terrain = null;
        this.water = null;
        this.chunkManager = null;
        this.vegetation = [];
    }

    async initialize() {
        console.log('🌍 Initializing world...');

        // Create chunk manager for infinite world
        this.chunkManager = new ChunkManager(this.scene);

        // Create enhanced terrain
        this.terrain = new EnhancedTerrain(this.scene);
        await this.terrain.initialize();

        // Create advanced water
        this.water = new AdvancedWater(this.scene, this.renderer);
        await this.water.initialize();

        // Add initial vegetation
        this.generateVegetation();

        console.log('✅ World initialized');
    }

    generateVegetation() {
        // Generate trees and grass across the terrain
        const treeCount = 200;
        const grassPatchCount = 500;

        // Trees
        for (let i = 0; i < treeCount; i++) {
            const x = (Math.random() - 0.5) * 800;
            const z = (Math.random() - 0.5) * 800;
            const y = this.terrain.getHeightAt(x, z);

            // Only place trees on land (above water level)
            if (y > 2) {
                const tree = this.createTree(x, y, z);
                this.scene.add(tree);
                this.vegetation.push(tree);
            }
        }

        // Grass patches
        for (let i = 0; i < grassPatchCount; i++) {
            const x = (Math.random() - 0.5) * 800;
            const z = (Math.random() - 0.5) * 800;
            const y = this.terrain.getHeightAt(x, z);

            if (y > 2) {
                const grass = this.createGrassPatch(x, y, z);
                this.scene.add(grass);
                this.vegetation.push(grass);
            }
        }
    }

    createTree(x, y, z) {
        const tree = new THREE.Group();

        // Trunk
        const trunkHeight = 3 + Math.random() * 3;
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, trunkHeight, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = trunkHeight / 2;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        tree.add(trunk);

        // Foliage
        const foliageGeometry = new THREE.SphereGeometry(2 + Math.random(), 8, 8);
        const foliageMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d5016,
            flatShading: true
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = trunkHeight + 1;
        foliage.castShadow = true;
        foliage.receiveShadow = true;
        tree.add(foliage);

        tree.position.set(x, y, z);
        return tree;
    }

    createGrassPatch(x, y, z) {
        const grassGroup = new THREE.Group();
        const bladeCount = 10;

        for (let i = 0; i < bladeCount; i++) {
            const bladeGeometry = new THREE.PlaneGeometry(0.1, 0.5);
            const bladeMaterial = new THREE.MeshStandardMaterial({
                color: 0x3a7d44,
                side: THREE.DoubleSide
            });
            const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);

            blade.position.x = (Math.random() - 0.5) * 0.5;
            blade.position.z = (Math.random() - 0.5) * 0.5;
            blade.position.y = 0.25;
            blade.rotation.y = Math.random() * Math.PI;

            grassGroup.add(blade);
        }

        grassGroup.position.set(x, y, z);
        return grassGroup;
    }

    update(deltaTime, cameraPosition) {
        // Update terrain chunks based on camera position
        if (this.chunkManager) {
            this.chunkManager.update(cameraPosition);
        }

        // Update advanced water animation
        if (this.water) {
            this.water.update(deltaTime, cameraPosition);
        }

        // Animate vegetation (sway in wind)
        this.vegetation.forEach((veg, index) => {
            if (veg.children.length > 0) {
                const time = Date.now() * 0.001;
                const offset = index * 0.1;
                veg.rotation.z = Math.sin(time + offset) * 0.05;
            }
        });
    }

    getHeightAt(x, z) {
        return this.terrain ? this.terrain.getHeightAt(x, z) : 0;
    }
}
