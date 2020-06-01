class Obstacle {
    constructor(world, scene, pos) {
        this.body = world.add({
            type: "box",
            size: [1, 1, 1],
            pos: [pos.x, pos.y, pos.z],
            rot: [0, 0, 0],
            move: true,
            density: 1,
            friction: 0.2,
            restitution: 0,
        });
        // this.body.isSensor = true;

        this.mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({ color: 0x222222 }));
        this.mesh.castShadow = true;
        scene.add(this.mesh);
    }

    render() {
        let pos = this.body.getPosition();
        let rot = this.body.getQuaternion();

        camera.position.x = pos.x;
        camera.position.y = pos.y + 1;
        camera.position.z = pos.z + 4;

        this.mesh.position.copy(pos);
        this.mesh.quaternion.copy(rot);
    }
}
