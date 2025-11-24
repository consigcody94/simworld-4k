import * as THREE from 'three';

export class SkySystem {
    constructor(scene) {
        this.scene = scene;
        this.sky = null;
        this.sunSphere = null;
        this.skyMaterial = null;
    }

    initialize() {
        console.log('☀️ Creating advanced sky system...');

        // Create sky dome
        const skyGeometry = new THREE.SphereGeometry(1500, 64, 64);

        this.skyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x0077ff) },
                bottomColor: { value: new THREE.Color(0xffffff) },
                offset: { value: 400 },
                exponent: { value: 0.6 },
                sunPosition: { value: new THREE.Vector3(0, 1000, 0) },
                time: { value: 0 }
            },
            vertexShader: this.getVertexShader(),
            fragmentShader: this.getFragmentShader(),
            side: THREE.BackSide
        });

        this.sky = new THREE.Mesh(skyGeometry, this.skyMaterial);
        this.scene.add(this.sky);

        // Create sun
        this.createSun();

        // Create stars (visible at night)
        this.createStars();

        // Create clouds
        this.createVolumetricClouds();

        console.log('✅ Advanced sky system created');
    }

    getVertexShader() {
        return `
            varying vec3 vWorldPosition;
            varying vec3 vNormal;

            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
    }

    getFragmentShader() {
        return `
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform float offset;
            uniform float exponent;
            uniform vec3 sunPosition;
            uniform float time;

            varying vec3 vWorldPosition;
            varying vec3 vNormal;

            void main() {
                float h = normalize(vWorldPosition + offset).y;
                vec3 skyColor = mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0));

                // Add sun glow
                vec3 sunDir = normalize(sunPosition);
                vec3 viewDir = normalize(vWorldPosition);
                float sunInfluence = max(dot(viewDir, sunDir), 0.0);

                // Sun glow
                vec3 sunGlow = vec3(1.0, 0.8, 0.6) * pow(sunInfluence, 256.0) * 2.0;

                // Atmospheric scattering effect around sun
                vec3 atmosphereGlow = vec3(1.0, 0.7, 0.4) * pow(sunInfluence, 8.0) * 0.5;

                // Add twinkling stars effect (more visible when sun is down)
                float starIntensity = smoothstep(0.3, -0.3, sunDir.y);
                float stars = 0.0;
                if (starIntensity > 0.1) {
                    vec3 starPos = vWorldPosition * 50.0;
                    stars = fract(sin(dot(starPos.xy, vec2(12.9898, 78.233))) * 43758.5453);
                    stars = pow(stars, 50.0) * starIntensity;
                }

                vec3 finalColor = skyColor + sunGlow + atmosphereGlow + vec3(stars);

                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;
    }

    createSun() {
        const sunGeometry = new THREE.SphereGeometry(50, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffee,
            fog: false
        });

        this.sunSphere = new THREE.Mesh(sunGeometry, sunMaterial);
        this.sunSphere.position.set(0, 1000, 0);
        this.scene.add(this.sunSphere);

        // Add sun corona effect
        const coronaGeometry = new THREE.SphereGeometry(60, 32, 32);
        const coronaMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.3,
            fog: false
        });

        const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
        this.sunSphere.add(corona);
    }

    createStars() {
        const starsGeometry = new THREE.BufferGeometry();
        const starCount = 5000;
        const positions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i += 3) {
            const radius = 1400;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);

            positions[i] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i + 2] = radius * Math.cos(phi);
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 2,
            transparent: true,
            opacity: 0
        });

        this.stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(this.stars);
    }

    createVolumetricClouds() {
        // Create multiple layers of clouds for depth
        this.cloudLayers = [];

        for (let layer = 0; layer < 3; layer++) {
            const cloudGeometry = new THREE.BufferGeometry();
            const cloudCount = 100;
            const positions = new Float32Array(cloudCount * 3);
            const sizes = new Float32Array(cloudCount);

            for (let i = 0; i < cloudCount; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 2000;
                positions[i * 3 + 1] = 200 + layer * 50 + Math.random() * 50;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
                sizes[i] = 50 + Math.random() * 100;
            }

            cloudGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            cloudGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

            const cloudMaterial = new THREE.PointsMaterial({
                size: 100,
                color: 0xffffff,
                transparent: true,
                opacity: 0.4 - layer * 0.1,
                map: this.createCloudTexture(),
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const clouds = new THREE.Points(cloudGeometry, cloudMaterial);
            this.scene.add(clouds);
            this.cloudLayers.push(clouds);
        }
    }

    createCloudTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);

        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    update(timeOfDay, deltaTime) {
        if (!this.skyMaterial || !this.sunSphere) return;

        // Update sun position based on time
        const sunAngle = (timeOfDay / 24) * Math.PI * 2 - Math.PI / 2;
        const sunHeight = Math.sin(sunAngle) * 1200;
        const sunDistance = Math.cos(sunAngle) * 1200;

        this.sunSphere.position.set(sunDistance, sunHeight, 0);
        this.skyMaterial.uniforms.sunPosition.value.copy(this.sunSphere.position);

        // Update sky colors based on time of day
        if (timeOfDay >= 6 && timeOfDay <= 18) {
            // Daytime
            const dayProgress = (timeOfDay - 6) / 12;
            const t = Math.sin(dayProgress * Math.PI);

            this.skyMaterial.uniforms.topColor.value.setHex(0x0077ff);
            this.skyMaterial.uniforms.bottomColor.value.lerpColors(
                new THREE.Color(0xffffff),
                new THREE.Color(0xaaccff),
                t
            );

            // Hide stars during day
            if (this.stars) {
                this.stars.material.opacity = 0;
            }
        } else {
            // Nighttime
            this.skyMaterial.uniforms.topColor.value.setHex(0x000033);
            this.skyMaterial.uniforms.bottomColor.value.setHex(0x000011);

            // Show stars at night
            if (this.stars) {
                this.stars.material.opacity = 0.8;
            }
        }

        // Sunrise/sunset
        if ((timeOfDay >= 5 && timeOfDay <= 7) || (timeOfDay >= 17 && timeOfDay <= 19)) {
            this.skyMaterial.uniforms.topColor.value.setHex(0xff6b35);
            this.skyMaterial.uniforms.bottomColor.value.setHex(0xffaa77);
        }

        // Animate clouds
        if (this.cloudLayers) {
            this.cloudLayers.forEach((clouds, index) => {
                clouds.rotation.y += deltaTime * 0.01 * (index + 1);
            });
        }

        this.skyMaterial.uniforms.time.value += deltaTime;
    }

    getSunDirection() {
        if (!this.sunSphere) return new THREE.Vector3(0, 1, 0);
        return this.sunSphere.position.clone().normalize();
    }
}
