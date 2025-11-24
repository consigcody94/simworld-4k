import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

export class AdvancedWater {
    constructor(scene, renderer) {
        this.scene = scene;
        this.renderer = renderer;
        this.mesh = null;
        this.material = null;
        this.time = 0;
        this.noise = createNoise2D();

        // Reflection and refraction render targets
        this.reflectionRenderTarget = null;
        this.refractionRenderTarget = null;
    }

    async initialize() {
        console.log('🌊 Creating advanced water system...');

        const size = 2000;
        const segments = 256;

        // Create render targets for reflections and refractions
        this.reflectionRenderTarget = new THREE.WebGLRenderTarget(1024, 1024, {
            format: THREE.RGBFormat,
            generateMipmaps: true,
            minFilter: THREE.LinearMipmapLinearFilter
        });

        this.refractionRenderTarget = new THREE.WebGLRenderTarget(1024, 1024, {
            format: THREE.RGBFormat,
            generateMipmaps: true,
            minFilter: THREE.LinearMipmapLinearFilter
        });

        // Create water geometry with high resolution
        const geometry = new THREE.PlaneGeometry(size, size, segments, segments);

        // Create advanced water shader
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                waterColor: { value: new THREE.Color(0x0077be) },
                deepWaterColor: { value: new THREE.Color(0x001e3d) },
                foamColor: { value: new THREE.Color(0xffffff) },
                reflectionTexture: { value: this.reflectionRenderTarget.texture },
                refractionTexture: { value: this.refractionRenderTarget.texture },
                normalMap: { value: null },
                sunDirection: { value: new THREE.Vector3(0.5, 0.5, 0.5).normalize() },
                cameraPosition: { value: new THREE.Vector3() },
                waveHeight: { value: 1.5 },
                waveFrequency: { value: 0.05 },
                waveSpeed: { value: 2.0 },
                shininess: { value: 200.0 },
                reflectivity: { value: 0.8 },
                refractionStrength: { value: 0.05 },
                fresnelPower: { value: 3.0 }
            },
            vertexShader: this.getVertexShader(),
            fragmentShader: this.getFragmentShader(),
            transparent: true,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.position.y = 0;
        this.mesh.receiveShadow = true;

        this.scene.add(this.mesh);

        // Store original vertices for animation
        this.originalVertices = geometry.attributes.position.array.slice();

        console.log('✅ Advanced water system created');
    }

    getVertexShader() {
        return `
            uniform float time;
            uniform float waveHeight;
            uniform float waveFrequency;
            uniform float waveSpeed;

            varying vec3 vWorldPosition;
            varying vec3 vNormal;
            varying vec2 vUv;
            varying float vWaveHeight;

            // Multiple wave functions for realistic ocean
            float wave(vec2 pos, float freq, float speed, float amplitude) {
                return sin(pos.x * freq + time * speed) *
                       cos(pos.y * freq * 0.8 + time * speed * 0.7) * amplitude;
            }

            void main() {
                vUv = uv;

                vec3 pos = position;

                // Create complex wave pattern with multiple octaves
                float w1 = wave(pos.xy, waveFrequency, waveSpeed, waveHeight);
                float w2 = wave(pos.xy * 1.5, waveFrequency * 2.0, waveSpeed * 1.3, waveHeight * 0.5);
                float w3 = wave(pos.xy * 0.7, waveFrequency * 0.5, waveSpeed * 0.8, waveHeight * 0.3);

                float totalWave = w1 + w2 + w3;
                pos.z += totalWave;

                vWaveHeight = totalWave;

                // Calculate world position
                vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
                vWorldPosition = worldPosition.xyz;

                // Calculate normal for lighting
                float offset = 0.1;
                vec3 posX = vec3(pos.x + offset, pos.y, pos.z);
                posX.z += wave(posX.xy, waveFrequency, waveSpeed, waveHeight);

                vec3 posY = vec3(pos.x, pos.y + offset, pos.z);
                posY.z += wave(posY.xy, waveFrequency, waveSpeed, waveHeight);

                vec3 tangentX = posX - pos;
                vec3 tangentY = posY - pos;
                vNormal = normalize(cross(tangentX, tangentY));

                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `;
    }

    getFragmentShader() {
        return `
            uniform vec3 waterColor;
            uniform vec3 deepWaterColor;
            uniform vec3 foamColor;
            uniform vec3 sunDirection;
            uniform vec3 cameraPosition;
            uniform sampler2D reflectionTexture;
            uniform sampler2D refractionTexture;
            uniform float shininess;
            uniform float reflectivity;
            uniform float refractionStrength;
            uniform float fresnelPower;
            uniform float time;

            varying vec3 vWorldPosition;
            varying vec3 vNormal;
            varying vec2 vUv;
            varying float vWaveHeight;

            void main() {
                vec3 normal = normalize(vNormal);
                vec3 viewDir = normalize(cameraPosition - vWorldPosition);

                // Fresnel effect
                float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), fresnelPower);

                // Specular reflection (sun glint)
                vec3 reflectDir = reflect(-sunDirection, normal);
                float specular = pow(max(dot(viewDir, reflectDir), 0.0), shininess);

                // Mix shallow and deep water colors based on wave height
                vec3 baseColor = mix(waterColor, deepWaterColor, smoothstep(-1.0, 1.0, vWaveHeight));

                // Add foam on wave peaks
                float foamMask = smoothstep(0.8, 1.0, vWaveHeight);
                vec3 colorWithFoam = mix(baseColor, foamColor, foamMask);

                // Combine all effects
                vec3 finalColor = colorWithFoam;
                finalColor += specular * vec3(1.0) * 0.8;
                finalColor = mix(finalColor, vec3(0.3, 0.5, 0.7), fresnel * reflectivity);

                // Add transparency based on depth
                float alpha = 0.85 + fresnel * 0.15;

                gl_FragColor = vec4(finalColor, alpha);
            }
        `;
    }

    update(deltaTime, cameraPosition) {
        if (!this.mesh || !this.material) return;

        this.time += deltaTime;

        // Update shader uniforms
        this.material.uniforms.time.value = this.time;
        this.material.uniforms.cameraPosition.value.copy(cameraPosition);

        // Animate geometry for additional detail
        const geometry = this.mesh.geometry;
        const positions = geometry.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
            const x = this.originalVertices[i];
            const y = this.originalVertices[i + 1];

            // Add small-scale detail ripples
            const ripple = this.noise(x * 0.1 + this.time * 0.5, y * 0.1 + this.time * 0.5) * 0.2;
            positions[i + 2] = ripple;
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
    }

    updateSunDirection(direction) {
        if (this.material) {
            this.material.uniforms.sunDirection.value.copy(direction);
        }
    }
}
