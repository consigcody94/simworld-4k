import * as THREE from 'three';

export class ChunkManager {
    constructor(scene) {
        this.scene = scene;
        this.chunks = new Map();
        this.chunkSize = 100;
        this.viewDistance = 3; // Number of chunks to load around player
        this.lastPlayerChunk = { x: 0, z: 0 };
    }

    update(cameraPosition) {
        const currentChunk = {
            x: Math.floor(cameraPosition.x / this.chunkSize),
            z: Math.floor(cameraPosition.z / this.chunkSize)
        };

        // Only update if player moved to a new chunk
        if (currentChunk.x !== this.lastPlayerChunk.x ||
            currentChunk.z !== this.lastPlayerChunk.z) {

            this.loadChunksAround(currentChunk);
            this.unloadDistantChunks(currentChunk);

            this.lastPlayerChunk = currentChunk;
        }
    }

    loadChunksAround(centerChunk) {
        for (let x = -this.viewDistance; x <= this.viewDistance; x++) {
            for (let z = -this.viewDistance; z <= this.viewDistance; z++) {
                const chunkX = centerChunk.x + x;
                const chunkZ = centerChunk.z + z;
                const key = `${chunkX},${chunkZ}`;

                if (!this.chunks.has(key)) {
                    // Generate new chunk
                    this.generateChunk(chunkX, chunkZ);
                }
            }
        }
    }

    unloadDistantChunks(centerChunk) {
        const chunksToRemove = [];

        for (const [key, chunk] of this.chunks.entries()) {
            const [chunkX, chunkZ] = key.split(',').map(Number);
            const distance = Math.max(
                Math.abs(chunkX - centerChunk.x),
                Math.abs(chunkZ - centerChunk.z)
            );

            if (distance > this.viewDistance + 1) {
                chunksToRemove.push({ key, chunk });
            }
        }

        // Remove distant chunks
        chunksToRemove.forEach(({ key, chunk }) => {
            this.scene.remove(chunk);
            chunk.geometry.dispose();
            chunk.material.dispose();
            this.chunks.delete(key);
        });
    }

    generateChunk(chunkX, chunkZ) {
        // This is a placeholder - in a full implementation,
        // this would generate terrain, vegetation, etc. for this chunk
        const key = `${chunkX},${chunkZ}`;
        this.chunks.set(key, null); // Mark as loaded
    }

    getChunkKey(x, z) {
        const chunkX = Math.floor(x / this.chunkSize);
        const chunkZ = Math.floor(z / this.chunkSize);
        return `${chunkX},${chunkZ}`;
    }
}
