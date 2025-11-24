import * as THREE from 'three';

export class TimeSystem {
    constructor(scene) {
        this.scene = scene;

        this.timeOfDay = 12; // Hours (0-24)
        this.timeSpeed = 0.1; // How fast time passes
        this.dayDuration = 240; // Seconds for full day cycle

        this.enabled = true;
    }

    update(deltaTime, sunLight, ambientLight, hemiLight, scene) {
        if (!this.enabled) return;

        // Update time
        this.timeOfDay += (deltaTime / this.dayDuration) * 24 * this.timeSpeed;
        if (this.timeOfDay >= 24) {
            this.timeOfDay = 0;
        }

        // Calculate sun position based on time
        const sunAngle = (this.timeOfDay / 24) * Math.PI * 2 - Math.PI / 2;
        const sunHeight = Math.sin(sunAngle) * 100;
        const sunDistance = Math.cos(sunAngle) * 100;

        sunLight.position.set(sunDistance, sunHeight, 50);

        // Adjust lighting based on time of day
        const dayProgress = this.timeOfDay / 24;

        if (this.timeOfDay >= 6 && this.timeOfDay <= 18) {
            // Daytime
            const dayIntensity = Math.sin((this.timeOfDay - 6) / 12 * Math.PI);
            sunLight.intensity = dayIntensity * 1.5;
            ambientLight.intensity = dayIntensity * 0.5 + 0.2;

            // Sky color (blue during day)
            const skyColor = new THREE.Color(0x87CEEB);
            scene.background = skyColor;
            scene.fog.color = skyColor;
        } else {
            // Nighttime
            sunLight.intensity = 0.1;
            ambientLight.intensity = 0.1;

            // Sky color (dark blue/black during night)
            const nightColor = new THREE.Color(0x000033);
            scene.background = nightColor;
            scene.fog.color = nightColor;
        }

        // Sunset/sunrise colors
        if ((this.timeOfDay >= 5 && this.timeOfDay <= 7) ||
            (this.timeOfDay >= 17 && this.timeOfDay <= 19)) {
            const sunsetColor = new THREE.Color(0xff6b35);
            scene.fog.color.lerp(sunsetColor, 0.3);
        }

        // Update hemisphere light
        if (hemiLight) {
            hemiLight.intensity = ambientLight.intensity * 1.2;
        }
    }

    setTimeOfDay(hours) {
        this.timeOfDay = hours % 24;
    }

    setTimeSpeed(speed) {
        this.timeSpeed = speed;
    }

    toggleEnabled() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}
