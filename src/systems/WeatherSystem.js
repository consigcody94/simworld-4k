import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

export class WeatherSystem {
    constructor(scene) {
        this.scene = scene;
        this.enabled = true;

        this.weatherType = 'clear'; // 'clear', 'rain', 'fog'
        this.rainParticles = null;
        this.clouds = [];

        this.noise = createNoise2D();

        this.initialize();
    }

    initialize() {
        this.createClouds();
        this.createRain();
    }

    createClouds() {
        const cloudCount = 20;

        for (let i = 0; i < cloudCount; i++) {
            const cloudGeometry = new THREE.SphereGeometry(10 + Math.random() * 20, 8, 8);
            const cloudMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.6,
                flatShading: true
            });

            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloud.position.set(
                (Math.random() - 0.5) * 800,
                80 + Math.random() * 40,
                (Math.random() - 0.5) * 800
            );

            cloud.scale.set(2, 0.5, 1);

            this.scene.add(cloud);
            this.clouds.push({
                mesh: cloud,
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    0,
                    (Math.random() - 0.5) * 2
                )
            });
        }
    }

    createRain() {
        const particleCount = 5000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 400;
            positions[i + 1] = Math.random() * 100;
            positions[i + 2] = (Math.random() - 0.5) * 400;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xaaaaaa,
            size: 0.3,
            transparent: true,
            opacity: 0.6
        });

        this.rainParticles = new THREE.Points(geometry, material);
        this.rainParticles.visible = false;
        this.scene.add(this.rainParticles);
    }

    update(deltaTime, cameraPosition) {
        if (!this.enabled) return;

        // Update clouds
        this.clouds.forEach(cloud => {
            cloud.mesh.position.add(cloud.velocity.clone().multiplyScalar(deltaTime));

            // Wrap around
            if (cloud.mesh.position.x > 400) cloud.mesh.position.x = -400;
            if (cloud.mesh.position.x < -400) cloud.mesh.position.x = 400;
            if (cloud.mesh.position.z > 400) cloud.mesh.position.z = -400;
            if (cloud.mesh.position.z < -400) cloud.mesh.position.z = 400;

            // Gentle floating animation
            const time = Date.now() * 0.0001;
            cloud.mesh.position.y += Math.sin(time + cloud.mesh.position.x) * 0.01;
        });

        // Update rain
        if (this.weatherType === 'rain' && this.rainParticles) {
            const positions = this.rainParticles.geometry.attributes.position.array;

            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] -= 50 * deltaTime;

                if (positions[i + 1] < 0) {
                    positions[i + 1] = 100;
                }
            }

            this.rainParticles.geometry.attributes.position.needsUpdate = true;

            // Keep rain centered on camera
            this.rainParticles.position.x = cameraPosition.x;
            this.rainParticles.position.z = cameraPosition.z;
        }
    }

    setWeather(type) {
        this.weatherType = type;

        switch (type) {
            case 'clear':
                this.rainParticles.visible = false;
                this.scene.fog.density = 0.0002;
                break;

            case 'rain':
                this.rainParticles.visible = true;
                this.scene.fog.density = 0.0005;
                break;

            case 'fog':
                this.rainParticles.visible = false;
                this.scene.fog.density = 0.002;
                break;
        }
    }

    cycleWeather() {
        const weathers = ['clear', 'rain', 'fog'];
        const currentIndex = weathers.indexOf(this.weatherType);
        const nextIndex = (currentIndex + 1) % weathers.length;
        this.setWeather(weathers[nextIndex]);
        return weathers[nextIndex];
    }
}
