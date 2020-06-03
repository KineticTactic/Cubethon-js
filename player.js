class Player {
    constructor(world, scene, pos) {
        // this.box = new Box(world, pos, createVector(1, 1, 1), true);
        this.body = world.add({
            type: "box",
            size: [1, 1, 1],
            pos: [pos.x, pos.y, pos.z],
            rot: [0, 0, 0],
            move: true,
            density: 1,
            friction: 0.4,
            restitution: 0,
        });

        // this.mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ color: 0x0088ff }));
        this.mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({ color: 0x0088ff }));
        this.mesh.castShadow = true;
        scene.add(this.mesh);

        this.lightTarget = new THREE.Object3D();
        scene.add(this.lightTarget);

        this.initPos = pos;
        this.over = false;
    }

    update(world, obstacles) {
        for (let obs of obstacles) {
            if (world.getContact(this.body, obs.body)) {
                this.over = true;
                obs.mesh.material.color.setHex(0xff0000);
            } else if (this.body.getPosition().y <= -1) {
                this.over = true;
            } else {
                obs.mesh.material.color.setHex(0x222222);
            }
        }

        if (!this.over) {
            this.body.linearVelocity.z = -20;
        }
    }

    move(n) {
        if (!this.over) {
            let pos = this.body.getPosition();
            this.body.applyImpulse({ x: pos.x, y: pos.y, z: pos.z }, { x: n, y: 0, z: 0 });
        }
    }

    checkForWin() {
        let pos = this.body.getPosition();
        return pos.z <= -40 && pos.y >= 0.5;
    }

    reset() {
        this.body.dispose();
        this.body = world.add({
            type: "box",
            size: [1, 1, 1],
            pos: [this.initPos.x, this.initPos.y, this.initPos.z],
            rot: [0, 0, 0],
            move: true,
            density: 1,
            friction: 0.4,
            restitution: 0,
        });
        this.over = false;
    }

    render(camera) {
        let pos = this.body.getPosition();
        let rot = this.body.getQuaternion();

        camera.position.x = pos.x;
        camera.position.y = pos.y + 1;
        camera.position.z = pos.z + 4;

        this.mesh.position.copy(pos);
        this.mesh.quaternion.copy(rot);

        this.lightTarget.position.z = this.mesh.position.z;
    }
}
