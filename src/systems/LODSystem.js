import * as THREE from 'three';

export class LODSystem {
    constructor() {
        this.lodObjects = [];
        this.distances = {
            high: 50,
            medium: 150,
            low: 300
        };
    }

    register(object, highDetail, mediumDetail, lowDetail) {
        this.lodObjects.push({
            object,
            highDetail,
            mediumDetail,
            lowDetail,
            currentLOD: 'high'
        });
    }

    update(cameraPosition, scene) {
        this.lodObjects.forEach(lodObj => {
            const distance = cameraPosition.distanceTo(lodObj.object.position);

            let newLOD;
            if (distance < this.distances.high) {
                newLOD = 'high';
            } else if (distance < this.distances.medium) {
                newLOD = 'medium';
            } else if (distance < this.distances.low) {
                newLOD = 'low';
            } else {
                newLOD = 'hidden';
            }

            if (newLOD !== lodObj.currentLOD) {
                this.switchLOD(lodObj, newLOD);
            }
        });
    }

    switchLOD(lodObj, newLOD) {
        lodObj.currentLOD = newLOD;

        switch (newLOD) {
            case 'high':
                lodObj.object.visible = true;
                // Enable high detail rendering
                break;

            case 'medium':
                lodObj.object.visible = true;
                // Enable medium detail rendering
                break;

            case 'low':
                lodObj.object.visible = true;
                // Enable low detail rendering
                break;

            case 'hidden':
                lodObj.object.visible = false;
                break;
        }
    }
}
