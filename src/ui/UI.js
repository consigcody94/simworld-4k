export class UI {
    constructor(engine) {
        this.engine = engine;

        this.elements = {
            birdView: document.getElementById('btn-bird-view'),
            humanView: document.getElementById('btn-human-view'),
            fishView: document.getElementById('btn-fish-view'),
            toggleBirds: document.getElementById('btn-toggle-birds'),
            toggleFish: document.getElementById('btn-toggle-fish'),
            toggleAnimals: document.getElementById('btn-toggle-animals'),
            toggleTraffic: document.getElementById('btn-toggle-traffic'),
            toggleConstruction: document.getElementById('btn-toggle-construction'),
            toggleWeather: document.getElementById('btn-toggle-weather'),
            timeCycle: document.getElementById('btn-time-cycle'),
            fps: document.getElementById('fps'),
            birdCount: document.getElementById('bird-count'),
            fishCount: document.getElementById('fish-count'),
            animalCount: document.getElementById('animal-count'),
            vehicleCount: document.getElementById('vehicle-count'),
            buildingCount: document.getElementById('building-count')
        };
    }

    initialize() {
        // Camera view buttons
        this.elements.birdView.addEventListener('click', () => {
            this.engine.setCameraView('bird');
            this.setActiveButton('birdView');
        });

        this.elements.humanView.addEventListener('click', () => {
            this.engine.setCameraView('human');
            this.setActiveButton('humanView');
        });

        this.elements.fishView.addEventListener('click', () => {
            this.engine.setCameraView('fish');
            this.setActiveButton('fishView');
        });

        // Toggle buttons
        this.elements.toggleBirds.addEventListener('click', () => {
            const enabled = this.engine.toggleSetting('enableBirds');
            this.elements.toggleBirds.classList.toggle('active', enabled);
        });

        this.elements.toggleFish.addEventListener('click', () => {
            const enabled = this.engine.toggleSetting('enableFish');
            this.elements.toggleFish.classList.toggle('active', enabled);
        });

        this.elements.toggleAnimals.addEventListener('click', () => {
            const enabled = this.engine.toggleSetting('enableAnimals');
            this.elements.toggleAnimals.classList.toggle('active', enabled);
        });

        this.elements.toggleTraffic.addEventListener('click', () => {
            const enabled = this.engine.toggleSetting('enableTraffic');
            this.elements.toggleTraffic.classList.toggle('active', enabled);
        });

        this.elements.toggleConstruction.addEventListener('click', () => {
            const enabled = this.engine.toggleSetting('enableConstruction');
            this.elements.toggleConstruction.classList.toggle('active', enabled);
        });

        this.elements.toggleWeather.addEventListener('click', () => {
            const enabled = this.engine.toggleSetting('enableWeather');
            this.elements.toggleWeather.classList.toggle('active', enabled);
        });

        this.elements.timeCycle.addEventListener('click', () => {
            if (this.engine.timeSystem) {
                this.engine.timeSystem.toggleEnabled();
            }
        });

        // Set initial active states
        this.elements.toggleBirds.classList.add('active');
        this.elements.toggleFish.classList.add('active');
        this.elements.toggleAnimals.classList.add('active');
        this.elements.toggleTraffic.classList.add('active');
        this.elements.toggleConstruction.classList.add('active');
        this.elements.toggleWeather.classList.add('active');

        // Start stats update loop
        this.updateStats();
    }

    setActiveButton(buttonName) {
        ['birdView', 'humanView', 'fishView'].forEach(name => {
            if (this.elements[name]) {
                this.elements[name].classList.remove('active');
            }
        });

        if (this.elements[buttonName]) {
            this.elements[buttonName].classList.add('active');
        }
    }

    updateStats() {
        const stats = this.engine.getStats();

        this.elements.birdCount.textContent = stats.birds;
        this.elements.fishCount.textContent = stats.fish;
        this.elements.animalCount.textContent = stats.animals;
        this.elements.vehicleCount.textContent = stats.vehicles;
        this.elements.buildingCount.textContent = stats.buildings;

        requestAnimationFrame(() => this.updateStats());
    }
}
