import * as THREE from 'three';
import { Engine } from './core/Engine.js';
import { UI } from './ui/UI.js';

// Wait for DOM to load
window.addEventListener('DOMContentLoaded', () => {
    init();
});

async function init() {
    try {
        // Create engine instance
        const engine = new Engine();
        await engine.initialize();

        // Create UI controller
        const ui = new UI(engine);
        ui.initialize();

        // Hide loading screen
        hideLoading();

        // Start the simulation
        engine.start();

        console.log('🌍 SimWorld initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize SimWorld:', error);
        document.getElementById('loading').innerHTML = `
            <div>❌ Failed to load SimWorld</div>
            <div style="font-size: 14px; margin-top: 10px;">${error.message}</div>
        `;
    }
}

function hideLoading() {
    const loading = document.getElementById('loading');
    loading.style.opacity = '0';
    loading.style.transition = 'opacity 0.5s';
    setTimeout(() => {
        loading.style.display = 'none';
    }, 500);
}
