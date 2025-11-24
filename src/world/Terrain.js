import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

export class Terrain {
    constructor(scene) {
        this.scene = scene;
        this.mesh = null;
        this.noise = createNoise2D();
        this.heightMap = new Map();
    }

    async initialize() {
        console.log('⛰️  Generating terrain...');

        const size = 800;
        const resolution = 200;
        const geometry = new THREE.PlaneGeometry(size, size, resolution, resolution);

        // Generate height map using simplex noise
        const vertices = geometry.attributes.position.array;

        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 1];
            const y = this.generateHeight(x, z);

            vertices[i + 2] = y;

            // Store in height map for quick lookup
            const key = `${Math.floor(x)},${Math.floor(z)}`;
            this.heightMap.set(key, y);
        }

        geometry.computeVertexNormals();
        geometry.attributes.position.needsUpdate = true;

        // Create material with color based on height
        const material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            flatShading: false
        });

        // Add colors based on height
        this.addVertexColors(geometry);

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = false;

        this.scene.add(this.mesh);

        console.log('✅ Terrain generated');
    }

    generateHeight(x, z) {
        // Multi-octave noise for realistic terrain
        let height = 0;
        let amplitude = 15;
        let frequency = 0.005;

        // Multiple octaves for detail
        for (let i = 0; i < 4; i++) {
            height += this.noise(x * frequency, z * frequency) * amplitude;
            amplitude *= 0.5;
            frequency *= 2;
        }

        return height;
    }

    addVertexColors(geometry) {
        const colors = [];
        const vertices = geometry.attributes.position.array;

        for (let i = 0; i < vertices.length; i += 3) {
            const y = vertices[i + 2];
            let color;

            if (y < 0) {
                // Sand (beach)
                color = new THREE.Color(0xc2b280);
            } else if (y < 5) {
                // Grass
                color = new THREE.Color(0x3a7d44);
            } else if (y < 15) {
                // Darker grass (hills)
                color = new THREE.Color(0x2d5016);
            } else if (y < 25) {
                // Rocky
                color = new THREE.Color(0x696969);
            } else {
                // Snow
                color = new THREE.Color(0xffffff);
            }

            colors.push(color.r, color.g, color.b);
        }

        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    }

    getHeightAt(x, z) {
        // Quick lookup from height map
        const key = `${Math.floor(x)},${Math.floor(z)}`;
        if (this.heightMap.has(key)) {
            return this.heightMap.get(key);
        }

        // Generate if not in map
        return this.generateHeight(x, z);
    }
}
