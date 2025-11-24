export class BuildingConstructor {
    constructor(scene) {
        this.scene = scene;
        this.buildingsUnderConstruction = [];
    }

    constructBuilding(building) {
        this.buildingsUnderConstruction.push({
            building: building,
            progress: 0,
            speed: 0.1 + Math.random() * 0.2
        });
    }

    update(deltaTime) {
        this.buildingsUnderConstruction = this.buildingsUnderConstruction.filter(item => {
            item.progress += deltaTime * item.speed;

            if (item.progress >= 1) {
                item.progress = 1;
                item.building.updateConstruction(1);
                return false; // Remove from construction list
            }

            item.building.updateConstruction(item.progress);
            return true;
        });
    }
}
