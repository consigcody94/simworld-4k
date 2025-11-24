import * as THREE from 'three';

export class Road {
    constructor(scene, x, z, width, depth, orientation, terrainHeight = 0) {
        this.scene = scene;
        this.x = x;
        this.z = z;
        this.width = width;
        this.depth = depth;
        this.orientation = orientation;
        this.terrainHeight = terrainHeight;

        this.createRoad();
    }

    createRoad() {
        const geometry = new THREE.PlaneGeometry(this.width, this.depth);
        const material = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.9,
            metalness: 0.1
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.position.set(this.x, this.terrainHeight + 0.1, this.z);
        this.mesh.receiveShadow = true;

        this.scene.add(this.mesh);

        // Add road markings
        this.addMarkings();
    }

    addMarkings() {
        const markingMaterial = new THREE.MeshStandardMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.2
        });

        const lineCount = this.orientation === 'horizontal' ? 5 : 5;
        const lineGeometry = new THREE.PlaneGeometry(
            this.orientation === 'horizontal' ? 2 : 0.2,
            this.orientation === 'horizontal' ? 0.2 : 2
        );

        for (let i = 0; i < lineCount; i++) {
            const marking = new THREE.Mesh(lineGeometry, markingMaterial);
            marking.rotation.x = -Math.PI / 2;

            if (this.orientation === 'horizontal') {
                marking.position.set(
                    this.x - this.width / 2 + (i / lineCount) * this.width,
                    0.11,
                    this.z
                );
            } else {
                marking.position.set(
                    this.x,
                    0.11,
                    this.z - this.depth / 2 + (i / lineCount) * this.depth
                );
            }

            this.scene.add(marking);
        }
    }

    getPath() {
        // Return waypoints for vehicles to follow
        if (this.orientation === 'horizontal') {
            return [
                new THREE.Vector3(this.x - this.width / 2, 0.5, this.z),
                new THREE.Vector3(this.x + this.width / 2, 0.5, this.z)
            ];
        } else {
            return [
                new THREE.Vector3(this.x, 0.5, this.z - this.depth / 2),
                new THREE.Vector3(this.x, 0.5, this.z + this.depth / 2)
            ];
        }
    }
}
