# 🌍 SimWorld 4K - Living World Simulation

A breathtaking 4K realistic world simulation featuring physics-based interactions, dynamic wildlife, procedurally generated cities, and living ecosystems.

## ✨ Features

### 🌊 Dynamic World
- **Procedural Terrain Generation** - Infinite world with realistic terrain using simplex noise
- **Water Physics** - Realistic water simulation with waves and reflections
- **Day/Night Cycle** - Dynamic lighting and atmospheric changes
- **Weather System** - Rain, fog, clouds, and environmental effects

### 🦅 Wildlife & Nature
- **Birds** - Flocking AI with realistic flight physics and behaviors
- **Fish** - Schools of fish with underwater dynamics
- **Animals** - Ground animals with pathfinding and natural behaviors
- **Vegetation** - Procedural trees, grass, and flora that grow dynamically

### 🏙️ Urban Simulation
- **Procedural Cities** - Dynamic city generation with various building types
- **Building Construction** - Watch buildings being constructed in real-time
- **Street Networks** - Procedural road generation with intersections
- **Traffic System** - Vehicles with AI navigation and traffic rules

### 📷 Camera Systems
- **Bird View** - Soar above the world like an eagle
- **Human View** - Walk through cities at ground level
- **Fish View** - Explore underwater environments

### ⚡ Performance
- **LOD System** - Level of Detail optimization for smooth 4K rendering
- **Chunk Streaming** - Infinite world with efficient memory management
- **Physics Optimization** - Spatial partitioning and culling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Modern browser with WebGL 2.0 support

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 Controls

### Camera
- **1** - Bird View (aerial perspective)
- **2** - Human View (ground level)
- **3** - Fish View (underwater)
- **W/A/S/D** - Move camera
- **Mouse** - Look around
- **Scroll** - Zoom in/out

### Simulation
- **Space** - Pause/Resume simulation
- **R** - Reset world
- **T** - Toggle time speed
- **F** - Toggle fullscreen

## 🏗️ Architecture

```
simworld/
├── src/
│   ├── main.js              # Application entry point
│   ├── core/
│   │   ├── Engine.js        # Main simulation engine
│   │   ├── Scene.js         # Three.js scene management
│   │   └── Physics.js       # Physics engine wrapper
│   ├── world/
│   │   ├── Terrain.js       # Procedural terrain generation
│   │   ├── Water.js         # Water simulation
│   │   ├── Sky.js           # Sky and atmosphere
│   │   └── Chunks.js        # World chunking system
│   ├── entities/
│   │   ├── birds/
│   │   │   ├── Bird.js      # Individual bird entity
│   │   │   └── Flock.js     # Flocking behavior
│   │   ├── fish/
│   │   │   ├── Fish.js      # Fish entity
│   │   │   └── School.js    # Schooling behavior
│   │   ├── animals/
│   │   │   └── Animal.js    # Ground animals
│   │   └── vehicles/
│   │       └── Vehicle.js   # Traffic vehicles
│   ├── city/
│   │   ├── CityGenerator.js # Procedural city generation
│   │   ├── Building.js      # Building entities
│   │   ├── Road.js          # Road network
│   │   └── Constructor.js   # Building construction animation
│   ├── systems/
│   │   ├── LODSystem.js     # Level of detail management
│   │   ├── TimeSystem.js    # Day/night cycle
│   │   ├── WeatherSystem.js # Weather simulation
│   │   └── TrafficSystem.js # Traffic AI
│   ├── camera/
│   │   ├── CameraController.js
│   │   ├── BirdCamera.js
│   │   ├── HumanCamera.js
│   │   └── FishCamera.js
│   └── utils/
│       ├── NoiseGenerator.js
│       └── MathUtils.js
└── public/
    └── assets/
        ├── textures/
        └── models/
```

## 🛠️ Technologies

- **Three.js** - 3D rendering engine
- **Cannon-ES** - Physics simulation
- **Simplex Noise** - Procedural generation
- **Vite** - Build tool and dev server

## 🎨 Techniques Used

- **Instanced Rendering** - Efficient rendering of thousands of entities
- **Frustum Culling** - Only render visible objects
- **Octree Spatial Partitioning** - Fast collision detection
- **Boids Algorithm** - Realistic flocking behavior
- **Perlin/Simplex Noise** - Natural terrain and cloud generation
- **A* Pathfinding** - Animal and vehicle navigation
- **Procedural Generation** - Infinite unique content

## 📊 Performance Targets

- **4K Resolution** - 3840×2160 @ 60fps (on capable hardware)
- **1080p** - Smooth 60fps on mid-range GPUs
- **Scalable Quality** - Automatic quality adjustment

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new animal species
- Improve AI behaviors
- Create new building types
- Enhance visual effects
- Optimize performance

## 📝 License

MIT License - feel free to use this project for learning and experimentation!

## 🎨 Custom 3D Models

SimWorld supports loading custom GLTF/GLB models! See **[MODELS.md](MODELS.md)** for the complete guide.

### Quick Start with Custom Models

1. Download free models from:
   - **Quaternius** (quaternius.com) - 100+ free animals (CC0)
   - **Poly Pizza** (poly.pizza) - Curated free 3D models
   - **Sketchfab** (filter by CC0 license)

2. Place models in `public/models/` directory
3. Update `src/loaders/ModelLoader.js` with file paths
4. Restart the server - your models are now in the world!

Example:
```javascript
this.modelUrls = {
    'eagle': '/models/my-eagle.glb',
    'fish': '/models/my-fish.glb',
    'deer': '/models/my-deer.glb'
};
```

## 🌟 Roadmap

- [ ] VR support
- [ ] Multiplayer exploration
- [ ] Seasonal changes
- [ ] More biomes (desert, arctic, jungle)
- [ ] Marine life diversity
- [ ] Advanced weather (storms, lightning)
- [ ] Particle effects (dust, pollen)
- [ ] Sound design and ambient audio
- [x] GLTF/GLB model loader
- [x] City placement on land only

---

**Built with ❤️ for simulation enthusiasts**
