import * as THREE from 'three';
import { World } from '../world/World.js';
import { CameraController } from '../camera/CameraController.js';
import { EntityManager } from '../entities/EntityManager.js';
import { CityManager } from '../city/CityManager.js';
import { TimeSystem } from '../systems/TimeSystem.js';
import { WeatherSystem } from '../systems/WeatherSystem.js';
import { LODSystem } from '../systems/LODSystem.js';
import { PostProcessingManager } from '../graphics/PostProcessing.js';
import { SkySystem } from '../graphics/SkySystem.js';

export class Engine {
    constructor() {
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.world = null;
        this.cameraController = null;
        this.entityManager = null;
        this.cityManager = null;
        this.timeSystem = null;
        this.weatherSystem = null;
        this.lodSystem = null;
        this.postProcessing = null;
        this.skySystem = null;

        this.clock = new THREE.Clock();
        this.lastTime = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.fpsTime = 0;

        this.isRunning = false;
        this.isPaused = false;

        this.settings = {
            renderResolution: 1.0, // 1.0 = 4K if display supports
            enableBirds: true,
            enableFish: true,
            enableAnimals: true,
            enableTraffic: true,
            enableConstruction: true,
            enableWeather: true,
            timeScale: 1.0
        };
    }

    async initialize() {
        console.log('🔧 Initializing engine...');

        // Setup renderer
        this.setupRenderer();

        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        this.scene.fog = new THREE.Fog(0x87CEEB, 100, 1000);

        // Setup camera
        this.setupCamera();

        // Create world
        this.world = new World(this.scene, this.renderer);
        await this.world.initialize();

        // Create sky system
        this.skySystem = new SkySystem(this.scene);
        this.skySystem.initialize();

        // Create camera controller
        this.cameraController = new CameraController(this.camera, this.renderer.domElement);
        this.cameraController.initialize();

        // Create systems
        this.timeSystem = new TimeSystem(this.scene);
        this.weatherSystem = new WeatherSystem(this.scene);
        this.lodSystem = new LODSystem();

        // Create managers
        this.entityManager = new EntityManager(this.scene, this.world);
        this.cityManager = new CityManager(this.scene, this.world);

        // Setup lights
        this.setupLights();

        // Setup post-processing
        this.postProcessing = new PostProcessingManager(this.renderer, this.scene, this.camera);

        // Handle window resize
        window.addEventListener('resize', () => this.onResize());

        console.log('✅ Engine initialized');
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance'
        });

        // Set size based on window
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio * this.settings.renderResolution, 2));

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;

        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
    }

    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 2000);
        this.camera.position.set(0, 50, 100);
        this.camera.lookAt(0, 0, 0);
    }

    setupLights() {
        // Directional light (sun)
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
        sunLight.position.set(100, 100, 50);
        sunLight.castShadow = true;
        sunLight.shadow.camera.left = -200;
        sunLight.shadow.camera.right = 200;
        sunLight.shadow.camera.top = 200;
        sunLight.shadow.camera.bottom = -200;
        sunLight.shadow.camera.far = 500;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        this.scene.add(sunLight);
        this.sunLight = sunLight;

        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
        this.ambientLight = ambientLight;

        // Hemisphere light for natural lighting
        const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x545454, 0.6);
        this.scene.add(hemiLight);
        this.hemiLight = hemiLight;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
    }

    pause() {
        this.isPaused = !this.isPaused;
    }

    animate() {
        if (!this.isRunning) return;

        requestAnimationFrame(() => this.animate());

        if (this.isPaused) {
            this.renderer.render(this.scene, this.camera);
            return;
        }

        const deltaTime = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();

        // Update FPS counter
        this.updateFPS(deltaTime);

        // Update systems
        this.update(deltaTime, elapsedTime);

        // Render with post-processing
        if (this.postProcessing) {
            this.postProcessing.render(deltaTime);
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }

    update(deltaTime, elapsedTime) {
        const dt = deltaTime * this.settings.timeScale;

        // Update camera
        if (this.cameraController) {
            this.cameraController.update(dt);
        }

        // Update sky system
        if (this.skySystem && this.timeSystem) {
            this.skySystem.update(this.timeSystem.timeOfDay, dt);
        }

        // Update time system (day/night)
        if (this.timeSystem) {
            this.timeSystem.update(dt, this.sunLight, this.ambientLight, this.hemiLight, this.scene);

            // Update water sun direction
            if (this.world && this.world.water && this.skySystem) {
                this.world.water.updateSunDirection(this.skySystem.getSunDirection());
            }
        }

        // Update weather
        if (this.weatherSystem && this.settings.enableWeather) {
            this.weatherSystem.update(dt, this.camera.position);
        }

        // Update world
        if (this.world) {
            this.world.update(dt, this.camera.position);
        }

        // Update entities (birds, fish, animals)
        if (this.entityManager) {
            this.entityManager.update(dt, this.camera.position, this.settings);
        }

        // Update city (construction, traffic)
        if (this.cityManager) {
            this.cityManager.update(dt, this.camera.position, this.settings);
        }

        // Update LOD system
        if (this.lodSystem) {
            this.lodSystem.update(this.camera.position, this.scene);
        }
    }

    updateFPS(deltaTime) {
        this.frameCount++;
        this.fpsTime += deltaTime;

        if (this.fpsTime >= 1.0) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsTime = 0;

            // Update UI
            const fpsElement = document.getElementById('fps');
            if (fpsElement) {
                fpsElement.textContent = this.fps;
            }
        }
    }

    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);

        if (this.postProcessing) {
            this.postProcessing.resize(width, height);
        }
    }

    // Public methods for UI controls
    setCameraView(view) {
        if (this.cameraController) {
            this.cameraController.setView(view);
        }
    }

    toggleSetting(setting) {
        if (this.settings.hasOwnProperty(setting)) {
            this.settings[setting] = !this.settings[setting];
            return this.settings[setting];
        }
        return false;
    }

    getSetting(setting) {
        return this.settings[setting];
    }

    getStats() {
        return {
            fps: this.fps,
            birds: this.entityManager ? this.entityManager.getBirdCount() : 0,
            fish: this.entityManager ? this.entityManager.getFishCount() : 0,
            animals: this.entityManager ? this.entityManager.getAnimalCount() : 0,
            vehicles: this.cityManager ? this.cityManager.getVehicleCount() : 0,
            buildings: this.cityManager ? this.cityManager.getBuildingCount() : 0
        };
    }
}
