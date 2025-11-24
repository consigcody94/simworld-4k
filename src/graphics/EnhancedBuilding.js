import * as THREE from 'three';

export class EnhancedBuilding {
    constructor(scene, x, z, width, height, depth, style = 'modern', terrainHeight = 0) {
        this.scene = scene;
        this.x = x;
        this.z = z;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.style = style;
        this.terrainHeight = terrainHeight;

        this.mesh = null;
        this.currentHeight = 0;
        this.targetHeight = height;
        this.isConstructed = false;

        this.createBuilding();
    }

    createBuilding() {
        this.mesh = new THREE.Group();

        switch (this.style) {
            case 'modern':
                this.createModernBuilding();
                break;
            case 'glass':
                this.createGlassBuilding();
                break;
            case 'classic':
                this.createClassicBuilding();
                break;
            default:
                this.createModernBuilding();
        }

        this.mesh.position.set(this.x, this.terrainHeight, this.z);
        this.mesh.scale.y = 0; // Start scaled down for construction animation

        this.scene.add(this.mesh);
    }

    createModernBuilding() {
        const floors = Math.floor(this.height / 3);

        // Main building body
        const bodyGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            roughness: 0.4,
            metalness: 0.6,
            envMapIntensity: 1.0
        });

        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = this.height / 2;
        body.castShadow = true;
        body.receiveShadow = true;
        this.mesh.add(body);

        // Add window grid
        this.addWindowGrid(body, floors, 'modern');

        // Add architectural details
        this.addBuildingDetails(body);

        // Add rooftop details
        this.addRooftop(body);
    }

    createGlassBuilding() {
        const floors = Math.floor(this.height / 3);

        // Glass facade
        const bodyGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        const bodyMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x88ccff,
            metalness: 0.9,
            roughness: 0.1,
            transparent: true,
            opacity: 0.4,
            transmission: 0.9,
            thickness: 0.5,
            envMapIntensity: 1.5
        });

        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = this.height / 2;
        body.castShadow = true;
        body.receiveShadow = true;
        this.mesh.add(body);

        // Add metal frame structure
        this.addGlassFramework(body, floors);

        // Windows with interior lighting
        this.addWindowGrid(body, floors, 'glass');
    }

    createClassicBuilding() {
        const floors = Math.floor(this.height / 3);

        // Stone/brick facade
        const bodyGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b7355,
            roughness: 0.9,
            metalness: 0.1
        });

        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = this.height / 2;
        body.castShadow = true;
        body.receiveShadow = true;
        this.mesh.add(body);

        // Add classical columns
        this.addColumns(body);

        // Add decorative elements
        this.addClassicDetails(body);

        // Add windows
        this.addWindowGrid(body, floors, 'classic');
    }

    addWindowGrid(parent, floors, style) {
        const windowsPerRow = Math.floor(this.width / 2);
        const windowWidth = 0.8;
        const windowHeight = 1.2;

        const windowMaterial = new THREE.MeshStandardMaterial({
            color: style === 'glass' ? 0x66ccff : 0x4488cc,
            emissive: style === 'glass' ? 0x2266aa : 0x224466,
            emissiveIntensity: 0.5,
            roughness: 0.1,
            metalness: 0.9
        });

        for (let floor = 0; floor < floors; floor++) {
            for (let i = 0; i < windowsPerRow; i++) {
                const xPos = (i - windowsPerRow / 2 + 0.5) * (this.width / windowsPerRow);
                const yPos = floor * 3 - this.height / 2 + 2;

                // Front windows
                const windowGeometry = new THREE.PlaneGeometry(windowWidth, windowHeight);
                const windowFront = new THREE.Mesh(windowGeometry, windowMaterial);
                windowFront.position.set(xPos, yPos, this.depth / 2 + 0.02);
                parent.add(windowFront);

                // Back windows
                const windowBack = new THREE.Mesh(windowGeometry, windowMaterial.clone());
                windowBack.position.set(xPos, yPos, -this.depth / 2 - 0.02);
                windowBack.rotation.y = Math.PI;
                parent.add(windowBack);

                // Side windows
                if (i === 0 || i === windowsPerRow - 1) {
                    const windowSide = new THREE.Mesh(windowGeometry, windowMaterial.clone());
                    windowSide.position.set(
                        i === 0 ? -this.width / 2 - 0.02 : this.width / 2 + 0.02,
                        yPos,
                        0
                    );
                    windowSide.rotation.y = i === 0 ? -Math.PI / 2 : Math.PI / 2;
                    parent.add(windowSide);
                }
            }
        }
    }

    addBuildingDetails(parent) {
        // Add horizontal bands between floors
        const bandMaterial = new THREE.MeshStandardMaterial({
            color: 0x999999,
            roughness: 0.3,
            metalness: 0.7
        });

        const floors = Math.floor(this.height / 3);
        for (let i = 1; i < floors; i++) {
            const bandGeometry = new THREE.BoxGeometry(this.width + 0.2, 0.3, this.depth + 0.2);
            const band = new THREE.Mesh(bandGeometry, bandMaterial);
            band.position.y = i * 3 - this.height / 2;
            parent.add(band);
        }
    }

    addRooftop(parent) {
        // Add rooftop structures (AC units, antennas, etc.)
        const roofGroup = new THREE.Group();
        roofGroup.position.y = this.height / 2;

        // AC units
        for (let i = 0; i < 3; i++) {
            const acGeometry = new THREE.BoxGeometry(1, 0.5, 0.8);
            const acMaterial = new THREE.MeshStandardMaterial({
                color: 0x666666,
                roughness: 0.7,
                metalness: 0.5
            });
            const ac = new THREE.Mesh(acGeometry, acMaterial);
            ac.position.set(
                (Math.random() - 0.5) * this.width * 0.6,
                0.25,
                (Math.random() - 0.5) * this.depth * 0.6
            );
            ac.castShadow = true;
            roofGroup.add(ac);
        }

        // Antenna
        const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
        const antennaMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.4,
            metalness: 0.8
        });
        const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna.position.set(0, 1.5, 0);
        antenna.castShadow = true;
        roofGroup.add(antenna);

        parent.add(roofGroup);
    }

    addGlassFramework(parent, floors) {
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.3,
            metalness: 0.9
        });

        // Vertical frames
        const verticalFrames = 5;
        for (let i = 0; i < verticalFrames; i++) {
            const frameGeometry = new THREE.BoxGeometry(0.2, this.height, 0.2);
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.set(
                (i - verticalFrames / 2 + 0.5) * (this.width / verticalFrames),
                0,
                this.depth / 2
            );
            frame.castShadow = true;
            parent.add(frame);
        }

        // Horizontal frames
        for (let i = 0; i < floors; i++) {
            const frameGeometry = new THREE.BoxGeometry(this.width, 0.2, 0.2);
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.set(0, i * 3 - this.height / 2, this.depth / 2);
            frame.castShadow = true;
            parent.add(frame);
        }
    }

    addColumns(parent) {
        const columnMaterial = new THREE.MeshStandardMaterial({
            color: 0xf5f5dc,
            roughness: 0.8,
            metalness: 0.2
        });

        const columnCount = Math.floor(this.width / 4);
        for (let i = 0; i < columnCount; i++) {
            const columnGeometry = new THREE.CylinderGeometry(0.4, 0.4, this.height * 0.7, 12);
            const column = new THREE.Mesh(columnGeometry, columnMaterial);
            column.position.set(
                (i - columnCount / 2 + 0.5) * (this.width / columnCount),
                -this.height * 0.15,
                this.depth / 2 + 0.5
            );
            column.castShadow = true;
            parent.add(column);
        }
    }

    addClassicDetails(parent) {
        // Add decorative cornice at top
        const corniceGeometry = new THREE.BoxGeometry(this.width + 1, 1, this.depth + 1);
        const corniceMaterial = new THREE.MeshStandardMaterial({
            color: 0xf5f5dc,
            roughness: 0.7,
            metalness: 0.2
        });
        const cornice = new THREE.Mesh(corniceGeometry, corniceMaterial);
        cornice.position.y = this.height / 2 + 0.5;
        cornice.castShadow = true;
        parent.add(cornice);
    }

    updateConstruction(progress) {
        this.mesh.scale.y = progress;
        this.currentHeight = this.targetHeight * progress;

        if (progress >= 1) {
            this.isConstructed = true;
        }
    }

    static randomStyle() {
        const styles = ['modern', 'glass', 'classic'];
        return styles[Math.floor(Math.random() * styles.length)];
    }
}
