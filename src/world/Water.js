import * as THREE from 'three';

export class Water {
    constructor(scene) {
        this.scene = scene;
        this.mesh = null;
        this.time = 0;
    }

    async initialize() {
        console.log('🌊 Creating water...');

        const size = 1000;
        const geometry = new THREE.PlaneGeometry(size, size, 100, 100);

        // Water material with transparency and reflection
        const material = new THREE.MeshStandardMaterial({
            color: 0x0077be,
            transparent: true,
            opacity: 0.7,
            roughness: 0.1,
            metalness: 0.8,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.position.y = 0;
        this.mesh.receiveShadow = true;

        this.scene.add(this.mesh);

        // Store original vertices for animation
        this.originalVertices = geometry.attributes.position.array.slice();

        console.log('✅ Water created');
    }

    update(deltaTime) {
        if (!this.mesh) return;

        this.time += deltaTime;

        // Animate water surface
        const geometry = this.mesh.geometry;
        const vertices = geometry.attributes.position.array;

        for (let i = 0; i < vertices.length; i += 3) {
            const x = this.originalVertices[i];
            const z = this.originalVertices[i + 1];

            // Create wave effect
            const wave1 = Math.sin(x * 0.1 + this.time * 2) * 0.3;
            const wave2 = Math.cos(z * 0.1 + this.time * 1.5) * 0.3;

            vertices[i + 2] = wave1 + wave2;
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
    }
}
