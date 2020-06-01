class StaticBox {
    constructor(world, scene, pos, size) {
        this.body = world.add({
            type: "box",
            size: [size.x, size.y, size.z],
            pos: [pos.x, pos.y, pos.z],
            rot: [0, 0, 0],
            move: false,
            density: 1,
            friction: 0.8,
            restitution: 0,
        });

        this.mesh = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), new THREE.MeshPhongMaterial({ color: 0xffffff }));
        this.mesh.receiveShadow = true;
        scene.add(this.mesh);
    }

    render() {
        this.mesh.position.copy(this.body.getPosition());
    }
}
