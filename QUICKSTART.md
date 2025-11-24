# 🚀 Quick Start Guide - SimWorld 4K

Get your living world simulation up and running in minutes!

## Prerequisites

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **Modern Browser** with WebGL 2.0 support (Chrome, Firefox, Edge, Safari)
- **Git** (optional, for cloning)

## Installation

### Option 1: Clone from GitHub

```bash
git clone https://github.com/consigcody94/simworld-4k.git
cd simworld-4k
npm install
```

### Option 2: Download ZIP

1. Download the repository as ZIP
2. Extract to your desired location
3. Open terminal in the extracted folder
4. Run `npm install`

## Running the Simulation

Start the development server:

```bash
npm run dev
```

The simulation will automatically open in your default browser at `http://localhost:3000`

## First Steps

### 1. Explore Different Views

Click the camera view buttons to switch perspectives:

- **🦅 Bird View** - Soar above the world from the sky
- **🚶 Human View** - Walk through cities at ground level
- **🐟 Fish View** - Dive underwater and swim with the fish

### 2. Camera Controls

- **W/A/S/D** - Move forward/left/backward/right
- **Q/E** - Move down/up
- **Right Mouse + Drag** - Look around
- **Mouse Wheel** - Zoom (in some views)

### 3. Toggle Features

Use the simulation control buttons:

- **Birds** - Enable/disable bird flocking
- **Fish** - Enable/disable fish schools
- **Animals** - Enable/disable ground animals
- **Traffic** - Enable/disable vehicle traffic
- **Construction** - Enable/disable building construction animations

### 4. Environment Controls

- **Weather** - Cycle through clear, rain, and fog
- **Day/Night** - Toggle the day/night cycle

## Performance Tips

### For Best Performance (60fps at 4K):

- **Hardware**: RTX 3060 or equivalent GPU
- **RAM**: 8GB minimum, 16GB recommended
- **Browser**: Chrome or Edge (best WebGL performance)

### If Performance is Low:

1. **Lower Resolution**: The simulation will auto-scale
2. **Disable Features**: Turn off birds, fish, or traffic
3. **Close Background Apps**: Free up system resources
4. **Update GPU Drivers**: Ensure you have the latest drivers

## System Requirements

### Minimum (1080p @ 30fps)
- GPU: GTX 1050 / RX 560 or better
- RAM: 4GB
- Browser: Chrome 90+, Firefox 88+, Edge 90+

### Recommended (4K @ 60fps)
- GPU: RTX 3060 / RX 6600 XT or better
- RAM: 16GB
- Browser: Latest Chrome or Edge

### Ultra (4K @ 60fps, All Features)
- GPU: RTX 4070 / RX 7700 XT or better
- RAM: 32GB
- Browser: Latest Chrome or Edge

## Building for Production

Create an optimized production build:

```bash
npm run build
```

The output will be in the `dist/` folder. You can serve it with any static file server:

```bash
npm run preview
```

## Troubleshooting

### Black Screen on Load
- Check browser console for errors
- Ensure WebGL 2.0 is supported
- Try a different browser

### Low FPS
- Reduce browser window size
- Disable some simulation features
- Close other browser tabs
- Update GPU drivers

### Memory Leaks
- Refresh the page periodically
- Disable construction animations
- Reduce traffic density (modify TrafficSystem.js)

### Controls Not Working
- Ensure the browser window is focused
- Try clicking on the canvas
- Check if another extension is capturing inputs

## Next Steps

- Read the full [README.md](README.md) for architecture details
- Check [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- Explore the source code in `src/` directory
- Modify parameters to customize your world

## Need Help?

- **Issues**: [GitHub Issues](https://github.com/consigcody94/simworld-4k/issues)
- **Discussions**: [GitHub Discussions](https://github.com/consigcody94/simworld-4k/discussions)

---

**Enjoy exploring your living world! 🌍**
