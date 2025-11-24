import * as THREE from 'three';

export class Building {
    constructor(scene, x, z, width, height, depth) {
        this.scene = scene;
        this.x = x;
        this.z = z;
        this.width = width;
        this.height = height;
        this.depth = depth;

        this.mesh = null;
        this.currentHeight = 0;
        this.targetHeight = height;
        this.isConstructed = false;

        this.createBuilding();
    }

    createBuilding() {
        const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);

        // Random building color (various concrete/glass colors)
        const colors = [0xcccccc, 0x999999, 0xaaaaaa, 0x808080, 0x6699cc];
        const color = colors[Math.floor(Math.random() * colors.length)];

        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.7,
            metalness: 0.3
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(this.x, this.height / 2, this.z);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        // Start with zero scale for construction animation
        this.mesh.scale.y = 0;

        this.scene.add(this.mesh);

        // Add windows
        this.addWindows();
    }

    addWindows() {
        const windowMaterial = new THREE.MeshStandardMaterial({
            color: 0x66ccff,
            emissive: 0x66ccff,
            emissiveIntensity: 0.3,
            roughness: 0.1,
            metalness: 0.9
        });

        const windowsPerFloor = 3;
        const floors = Math.floor(this.height / 3);

        for (let floor = 0; floor < floors; floor++) {
            for (let i = 0; i < windowsPerFloor; i++) {
                // Front windows
                const windowGeometry = new THREE.PlaneGeometry(1, 1);
                const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
                window1.position.set(
                    (i - windowsPerFloor / 2) * 2,
                    floor * 3 - this.height / 2 + 1.5,
                    this.depth / 2 + 0.01
                );
                this.mesh.add(window1);

                // Back windows
                const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
                window2.position.set(
                    (i - windowsPerFloor / 2) * 2,
                    floor * 3 - this.height / 2 + 1.5,
                    -this.depth / 2 - 0.01
                );
                window2.rotation.y = Math.PI;
                this.mesh.add(window2);
            }
        }
    }

    updateConstruction(progress) {
        // progress: 0 to 1
        this.mesh.scale.y = progress;
        this.currentHeight = this.targetHeight * progress;

        if (progress >= 1) {
            this.isConstructed = true;
        }
    }
}
