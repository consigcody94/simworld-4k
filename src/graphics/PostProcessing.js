import * as THREE from 'three';
import { EffectComposer } from 'postprocessing';
import {
    BloomEffect,
    EffectPass,
    RenderPass,
    SSAOEffect,
    DepthOfFieldEffect,
    VignetteEffect,
    ChromaticAberrationEffect,
    SMAAEffect,
    GodRaysEffect
} from 'postprocessing';

export class PostProcessingManager {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.composer = null;

        this.effects = {
            bloom: null,
            ssao: null,
            dof: null,
            vignette: null,
            chromatic: null,
            godRays: null
        };

        this.initialize();
    }

    initialize() {
        // Create composer
        this.composer = new EffectComposer(this.renderer, {
            frameBufferType: THREE.HalfFloatType
        });

        // Add render pass
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // Create effects
        this.createBloomEffect();
        this.createSSAOEffect();
        this.createDepthOfFieldEffect();
        this.createVignetteEffect();
        this.createChromaticAberrationEffect();
        this.createSMAAEffect();

        // Add all effects in one pass
        const effectPass = new EffectPass(
            this.camera,
            this.effects.bloom,
            this.effects.ssao,
            this.effects.dof,
            this.effects.vignette,
            this.effects.chromatic
        );

        this.composer.addPass(effectPass);

        // Add SMAA (anti-aliasing) pass
        const smaaPass = new EffectPass(this.camera, this.effects.smaa);
        this.composer.addPass(smaaPass);

        console.log('✅ Advanced post-processing initialized');
    }

    createBloomEffect() {
        this.effects.bloom = new BloomEffect({
            intensity: 1.5,
            luminanceThreshold: 0.4,
            luminanceSmoothing: 0.7,
            mipmapBlur: true,
            radius: 0.85
        });
    }

    createSSAOEffect() {
        this.effects.ssao = new SSAOEffect(this.camera, null, {
            intensity: 1.5,
            radius: 0.05,
            bias: 0.025,
            samples: 16,
            rings: 4,
            distanceThreshold: 0.97,
            distanceFalloff: 0.03,
            rangeThreshold: 0.0005,
            rangeFalloff: 0.001,
            luminanceInfluence: 0.7,
            color: null
        });
    }

    createDepthOfFieldEffect() {
        this.effects.dof = new DepthOfFieldEffect(this.camera, {
            focusDistance: 0.02,
            focalLength: 0.05,
            bokehScale: 3.0,
            height: 480
        });

        // Start with DOF disabled (can enable for cinematic shots)
        this.effects.dof.blendMode.opacity.value = 0.0;
    }

    createVignetteEffect() {
        this.effects.vignette = new VignetteEffect({
            darkness: 0.5,
            offset: 0.5
        });
    }

    createChromaticAberrationEffect() {
        this.effects.chromatic = new ChromaticAberrationEffect({
            offset: new THREE.Vector2(0.001, 0.001)
        });
    }

    createSMAAEffect() {
        this.effects.smaa = new SMAAEffect();
    }

    render(deltaTime) {
        this.composer.render(deltaTime);
    }

    resize(width, height) {
        this.composer.setSize(width, height);
    }

    enableDepthOfField(enable = true) {
        if (this.effects.dof) {
            this.effects.dof.blendMode.opacity.value = enable ? 1.0 : 0.0;
        }
    }

    setBloomIntensity(intensity) {
        if (this.effects.bloom) {
            this.effects.bloom.intensity = intensity;
        }
    }

    setSSAOIntensity(intensity) {
        if (this.effects.ssao) {
            this.effects.ssao.intensity = intensity;
        }
    }
}
