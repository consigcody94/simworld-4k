import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

export class EnhancedTerrain {
    constructor(scene) {
        this.scene = scene;
        this.mesh = null;
        this.noise = createNoise2D();
        this.heightMap = new Map();
    }

    async initialize() {
        console.log('⛰️  Generating enhanced terrain...');

        const size = 2000;
        const resolution = 400;
        const geometry = new THREE.PlaneGeometry(size, size, resolution, resolution);

        // Generate detailed height map
        const vertices = geometry.attributes.position.array;
        const colors = [];
        const uvs = [];

        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 1];
            const y = this.generateHeight(x, z);

            vertices[i + 2] = y;

            const key = `${Math.floor(x)},${Math.floor(z)}`;
            this.heightMap.set(key, y);

            // Generate color based on height and slope
            const color = this.getColorForHeight(y);
            colors.push(color.r, color.g, color.b);
        }

        geometry.computeVertexNormals();
        geometry.attributes.position.needsUpdate = true;
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        // Create advanced PBR material
        const material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            flatShading: false,
            roughness: 0.9,
            metalness: 0.1,
            envMapIntensity: 0.5
        });

        // Add normal map for micro-detail
        this.addNormalMap(material);

        // Add displacement for additional detail
        this.addDetailLayer(geometry);

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = false;

        this.scene.add(this.mesh);

        // Add terrain details (rocks, pebbles)
        this.addTerrainDetails();

        console.log('✅ Enhanced terrain generated');
    }

    generateHeight(x, z) {
        let height = 0;
        let amplitude = 20;
        let frequency = 0.003;

        // Multiple octaves for realistic terrain
        for (let i = 0; i < 6; i++) {
            height += this.noise(x * frequency, z * frequency) * amplitude;
            amplitude *= 0.5;
            frequency *= 2.2;
        }

        // Add mountain ranges
        const mountainNoise = this.noise(x * 0.001, z * 0.001);
        if (mountainNoise > 0.3) {
            height += (mountainNoise - 0.3) * 40;
        }

        // Create valleys
        const valleyNoise = this.noise(x * 0.002 + 100, z * 0.002 + 100);
        if (valleyNoise < -0.2) {
            height += valleyNoise * 15;
        }

        return height;
    }

    getColorForHeight(y) {
        let color;

        if (y < -2) {
            // Deep water (darker)
            color = new THREE.Color(0x004466);
        } else if (y < 0) {
            // Shallow water / beach transition
            color = new THREE.Color(0xc2b280);
        } else if (y < 3) {
            // Beach / sand
            color = new THREE.Color(0xe6c896);
        } else if (y < 8) {
            // Grass
            color = new THREE.Color(0x4a6741);
        } else if (y < 15) {
            // Forest / darker grass
            color = new THREE.Color(0x2d4428);
        } else if (y < 25) {
            // Rocky mountain
            color = new THREE.Color(0x6b6156);
        } else if (y < 35) {
            // High mountain
            color = new THREE.Color(0x4a4540);
        } else {
            // Snow peaks
            color = new THREE.Color(0xf0f8ff);
        }

        return color;
    }

    addNormalMap(material) {
        // Create procedural normal map for surface detail
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        const imageData = ctx.createImageData(512, 512);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const x = (i / 4) % 512;
            const y = Math.floor((i / 4) / 512);

            const nx = this.noise(x * 0.1, y * 0.1) * 0.5 + 0.5;
            const ny = this.noise(x * 0.1 + 100, y * 0.1 + 100) * 0.5 + 0.5;

            data[i] = nx * 255;
            data[i + 1] = ny * 255;
            data[i + 2] = 255;
            data[i + 3] = 255;
        }

        ctx.putImageData(imageData, 0, 0);

        const normalMap = new THREE.CanvasTexture(canvas);
        normalMap.wrapS = THREE.RepeatWrapping;
        normalMap.wrapT = THREE.RepeatWrapping;
        normalMap.repeat.set(50, 50);

        material.normalMap = normalMap;
        material.normalScale = new THREE.Vector2(0.5, 0.5);
    }

    addDetailLayer(geometry) {
        // Add micro-displacement for fine details
        const positions = geometry.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const detail = this.noise(x * 0.5, y * 0.5) * 0.3;

            positions[i + 2] += detail;
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
    }

    addTerrainDetails() {
        // Add rocks and boulders
        const rockCount = 500;
        const rocks = new THREE.Group();

        for (let i = 0; i < rockCount; i++) {
            const x = (Math.random() - 0.5) * 1800;
            const z = (Math.random() - 0.5) * 1800;
            const y = this.getHeightAt(x, z);

            // Only place rocks on high terrain
            if (y > 10) {
                const rock = this.createRock();
                rock.position.set(x, y, z);
                rock.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                );
                const scale = 0.5 + Math.random() * 2;
                rock.scale.set(scale, scale, scale);

                rocks.add(rock);
            }
        }

        this.scene.add(rocks);
    }

    createRock() {
        const geometry = new THREE.DodecahedronGeometry(0.5, 1);

        // Deform geometry for irregular shape
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] *= 0.8 + Math.random() * 0.4;
            positions[i + 1] *= 0.8 + Math.random() * 0.4;
            positions[i + 2] *= 0.8 + Math.random() * 0.4;
        }
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
            color: 0x6b6156,
            roughness: 0.95,
            metalness: 0.05,
            flatShading: true
        });

        const rock = new THREE.Mesh(geometry, material);
        rock.castShadow = true;
        rock.receiveShadow = true;

        return rock;
    }

    getHeightAt(x, z) {
        const key = `${Math.floor(x)},${Math.floor(z)}`;
        if (this.heightMap.has(key)) {
            return this.heightMap.get(key);
        }
        return this.generateHeight(x, z);
    }
}
