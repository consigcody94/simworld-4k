# 🎨 Using Custom 3D Models in SimWorld

SimWorld supports loading custom GLTF/GLB 3D models from various sources. This guide shows you how to add realistic models for birds, fish, and animals.

## 📥 Where to Find Free 3D Models

### Recommended Sources (CC0 / Public Domain / Free)

1. **Sketchfab** - https://sketchfab.com/3d-models?features=downloadable&sort_by=-likeCount&licenses=322a749bcfa841b29dff1e8a1bb74b0b
   - Filter by "Downloadable" and "CC0" license
   - High quality rigged animals

2. **Poly Pizza** - https://poly.pizza/
   - Curated free 3D models
   - Easy downloads

3. **Quaternius** - http://quaternius.com/
   - Ultimate Animals Pack (100+ animals)
   - All CC0 license

4. **Kenney Assets** - https://kenney.nl/assets
   - Game-ready 3D models
   - All public domain

5. **Google Poly Archive** - https://poly.google.com/
   - Historical archive of free models

## 🔧 How to Add Models

### Method 1: Online URLs

Edit `src/loaders/ModelLoader.js` and add your model URLs:

```javascript
this.modelUrls = {
    // Birds
    'eagle': 'https://yoursite.com/models/eagle.glb',
    'seagull': 'https://yoursite.com/models/seagull.glb',

    // Fish
    'fish': 'https://yoursite.com/models/fish.glb',
    'tropical': 'https://yoursite.com/models/tropical-fish.glb',

    // Animals
    'deer': 'https://yoursite.com/models/deer.glb',
    'fox': 'https://yoursite.com/models/fox.glb',
    'rabbit': 'https://yoursite.com/models/rabbit.glb'
};
```

### Method 2: Local Files

1. Create a `public/models/` directory
2. Place your `.glb` or `.gltf` files there
3. Reference them in the ModelLoader:

```javascript
'eagle': '/models/eagle.glb',
'fish': '/models/fish.glb',
'deer': '/models/deer.glb'
```

## 📋 Model Requirements

### File Format
- **GLTF (.gltf)** - JSON format with separate bin/texture files
- **GLB (.glb)** - Binary format (recommended, single file)

### Specifications
- **Poly Count**: 500-5,000 triangles (for performance)
- **Textures**: Optional, use PBR materials if included
- **Scale**: Models should be approximately 1-2 units in size
- **Origin**: Center the model at world origin (0,0,0)
- **Rotation**: Model should face +Z direction

### Recommended Model Properties
```
Birds:
- Size: 0.5-1.5 units
- Wings: Rigged for animation (optional)

Fish:
- Size: 0.3-0.8 units
- Tail: Rigged for animation (optional)

Animals:
- Size: 0.8-2.0 units
- Legs: Rigged for animation (optional)
```

## 🎬 Adding Animations

If your models have animations:

```javascript
const loader = new ModelLoader();
const model = await loader.loadModel('eagle');

// Access animations
if (model.animations && model.animations.length > 0) {
    const mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(model.animations[0]);
    action.play();
}
```

## 📦 Example: Adding a Custom Eagle

1. Download an eagle model from Sketchfab (CC0 license)
2. Place it in `public/models/eagle.glb`
3. Update ModelLoader:

```javascript
this.modelUrls = {
    'eagle': '/models/eagle.glb'
};
```

4. Restart the server - eagles will now use your custom model!

## 🐛 Troubleshooting

### Model doesn't appear
- Check browser console for loading errors
- Verify file path is correct
- Ensure model is in GLTF/GLB format

### Model is too small/large
- Adjust scale in ModelLoader:
```javascript
const model = await this.loader.loadAsync(url);
model.scene.scale.set(2, 2, 2); // Make 2x larger
```

### Model is wrong color
- Models use their embedded materials
- Override in code if needed:
```javascript
model.scene.traverse((child) => {
    if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    }
});
```

### Model faces wrong direction
- Rotate on load:
```javascript
model.scene.rotation.y = Math.PI; // Rotate 180°
```

## 🌟 Recommended Model Packs

### Quaternius Ultimate Animals Pack
- **Link**: http://quaternius.com/packs/animalpack.html
- **Contents**: 100+ animals (birds, fish, mammals)
- **License**: CC0 (Public Domain)
- **Format**: GLTF/GLB
- **Perfect for SimWorld!**

### Kenney Animal Pack
- **Link**: https://kenney.nl/assets/animal-pack
- **Contents**: 60+ animals
- **License**: CC0
- **Style**: Low poly, cute

## 🔗 Useful Resources

- **GLTF Viewer**: https://gltf-viewer.donmccurdy.com/
- **Model Converter**: https://products.aspose.app/3d/conversion
- **Blender** (for editing): https://www.blender.org/

---

**Questions?** Open an issue on GitHub!
