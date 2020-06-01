class Box {
    constructor(world, pos, size, isDynamic) {
        this.body = world.add({
            type: "box",
            size: [size.x, size.y, size.z],
            pos: [pos.x, pos.y, pos.z],
            rot: [0, 0, 0],
            move: isDynamic,
            density: 1,
            friction: 0.2,
            restitution: 0,
        });
        this.size = size;
        console.log(this.body.getQuaternion());
    }

    // render(col) {
    //     push();
    //     let pos = this.body.getPosition();
    //     let rot = this.body.getQuaternion();

    //     let angle = 2 * Math.acos(rot.w);
    //     // let axis = createVector(
    //     //     rot.x / Math.sqrt(1 - rot.w * rot.w),
    //     //     rot.y / Math.sqrt(1 - rot.w * rot.w),
    //     //     rot.z / Math.sqrt(1 - rot.w * rot.w)
    //     // );

    //     let s = Math.sqrt(1 - rot.w * rot.w); // assuming quaternion normalised then w is less than 1, so term always positive.
    //     let x, y, z;
    //     if (s < 0.001) {
    //         // test to avoid divide by zero, s is always positive due to sqrt
    //         // if s close to zero then direction of axis not important
    //         x = rot.x; // if it is important that axis is normalised then replace with x=1; y=z=0;
    //         y = rot.y;
    //         z = rot.z;
    //     } else {
    //         x = rot.x / s; // normalise axis
    //         y = rot.y / s;
    //         z = rot.z / s;
    //     }
    //     let axis = createVector(x, y, z);
    //     // console.log(axis);
    //     // console.log(pos);

    //     translate(pos.x, -pos.y, pos.z);
    //     if (axis.x !== 0 && axis.y != 0 && axis.z != 0) {
    //         rotate(angle, axis);
    //     }
    //     // rotate(angle);
    //     specularMaterial(col ? col : color(255));
    //     // normalMaterial();
    //     box(this.size.x, this.size.y, this.size.z);
    //     pop();
    // }
}
