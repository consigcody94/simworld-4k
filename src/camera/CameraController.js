import * as THREE from 'three';

export class CameraController {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;

        this.currentView = 'bird'; // 'bird', 'human', 'fish'

        // Movement
        this.moveSpeed = 50;
        this.rotationSpeed = 0.002;

        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            up: false,
            down: false
        };

        this.mouse = {
            x: 0,
            y: 0,
            isDown: false
        };

        this.rotation = {
            yaw: 0,
            pitch: 0
        };
    }

    initialize() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));

        // Mouse controls
        this.domElement.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.domElement.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // Prevent context menu
        this.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    onKeyDown(event) {
        switch (event.key.toLowerCase()) {
            case 'w': this.keys.forward = true; break;
            case 's': this.keys.backward = true; break;
            case 'a': this.keys.left = true; break;
            case 'd': this.keys.right = true; break;
            case 'q': this.keys.down = true; break;
            case 'e': this.keys.up = true; break;
        }
    }

    onKeyUp(event) {
        switch (event.key.toLowerCase()) {
            case 'w': this.keys.forward = false; break;
            case 's': this.keys.backward = false; break;
            case 'a': this.keys.left = false; break;
            case 'd': this.keys.right = false; break;
            case 'q': this.keys.down = false; break;
            case 'e': this.keys.up = false; break;
        }
    }

    onMouseDown(event) {
        if (event.button === 2) { // Right mouse button
            this.mouse.isDown = true;
            this.mouse.x = event.clientX;
            this.mouse.y = event.clientY;
        }
    }

    onMouseUp(event) {
        this.mouse.isDown = false;
    }

    onMouseMove(event) {
        if (this.mouse.isDown) {
            const deltaX = event.clientX - this.mouse.x;
            const deltaY = event.clientY - this.mouse.y;

            this.rotation.yaw -= deltaX * this.rotationSpeed;
            this.rotation.pitch -= deltaY * this.rotationSpeed;

            // Clamp pitch
            this.rotation.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotation.pitch));

            this.mouse.x = event.clientX;
            this.mouse.y = event.clientY;
        }
    }

    update(deltaTime) {
        // Calculate movement direction
        const forward = new THREE.Vector3(
            Math.sin(this.rotation.yaw),
            0,
            Math.cos(this.rotation.yaw)
        );

        const right = new THREE.Vector3(
            -Math.cos(this.rotation.yaw),
            0,
            Math.sin(this.rotation.yaw)
        );

        const up = new THREE.Vector3(0, 1, 0);

        // Apply movement
        const speed = this.moveSpeed * deltaTime;

        if (this.keys.forward) {
            this.camera.position.addScaledVector(forward, speed);
        }
        if (this.keys.backward) {
            this.camera.position.addScaledVector(forward, -speed);
        }
        if (this.keys.left) {
            this.camera.position.addScaledVector(right, -speed);
        }
        if (this.keys.right) {
            this.camera.position.addScaledVector(right, speed);
        }
        if (this.keys.up) {
            this.camera.position.addScaledVector(up, speed);
        }
        if (this.keys.down) {
            this.camera.position.addScaledVector(up, -speed);
        }

        // Apply rotation
        const lookAt = new THREE.Vector3(
            this.camera.position.x + Math.sin(this.rotation.yaw) * Math.cos(this.rotation.pitch),
            this.camera.position.y + Math.sin(this.rotation.pitch),
            this.camera.position.z + Math.cos(this.rotation.yaw) * Math.cos(this.rotation.pitch)
        );

        this.camera.lookAt(lookAt);
    }

    setView(view) {
        this.currentView = view;

        switch (view) {
            case 'bird':
                this.camera.position.set(0, 100, 150);
                this.rotation.yaw = Math.PI;
                this.rotation.pitch = -0.5;
                break;

            case 'human':
                this.camera.position.set(50, 2, 50);
                this.rotation.yaw = 0;
                this.rotation.pitch = 0;
                break;

            case 'fish':
                this.camera.position.set(0, -10, 0);
                this.rotation.yaw = 0;
                this.rotation.pitch = 0;
                break;
        }
    }
}
