const START_SCREEN = 0;
const LEVEL1 = 1;
const LEVEL2 = 2;
const LEVEL3 = 3;
const LEVEL_COMPLETE = 4;

let world;

let emptyScene;
let scene;
let camera;
let renderer;

let ambientLight;
let directionalLight;

let player;
let ground;
let obstacles = [];

let rightKeyDown = false;
let leftKeyDown = false;

let gameState = START_SCREEN;

function setup() {
    world = new OIMO.World({
        timestep: 1 / 60,
        iterations: 8,
        broadpahase: 1,
        worldscale: 1,
        random: true,
        info: false,
        gravity: [0, -9.8, 0],
    });

    scene = new THREE.Scene();
    emptyScene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xcccccc, 15, 50);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xcccccc, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-2, 4, 2);
    directionalLight.castShadow = true;
    // console.log(directionalLight);
    // const d = 40;
    // directionalLight.shadow.camera.top = d;
    // directionalLight.shadow.camera.bottom = -d;
    // directionalLight.shadow.camera.left = -d;
    // directionalLight.shadow.camera.right = d;
    // scene.add(new THREE.CameraHelper(directionalLight.shadow.camera));
    scene.add(directionalLight);

    camera.position.y = 2;
    camera.position.z = 5;

    // scene.add(new THREE.CameraHelper(camera));

    player = new Player(world, scene, new THREE.Vector3(0, 5, 50));
    ground = new StaticBox(world, scene, new THREE.Vector3(0, 0, -50), new THREE.Vector3(8, 1, 200));

    obstacles.push(new Obstacle(world, scene, new THREE.Vector3(0, 1, 15)));
    obstacles.push(new Obstacle(world, scene, new THREE.Vector3(1, 1, 15)));

    obstacles.push(new Obstacle(world, scene, new THREE.Vector3(-3, 1, -5)));
    obstacles.push(new Obstacle(world, scene, new THREE.Vector3(3, 1, -5)));

    obstacles.push(new Obstacle(world, scene, new THREE.Vector3(1, 1, -25)));
    obstacles.push(new Obstacle(world, scene, new THREE.Vector3(3, 1, -25)));
}

function draw() {
    requestAnimationFrame(draw);

    if (gameState !== START_SCREEN && gameState !== LEVEL_COMPLETE) {
        if (rightKeyDown) {
            player.move(1.5);
        }
        if (leftKeyDown) {
            player.move(-1.5);
        }

        player.update(world, obstacles);

        if (player.checkForWin()) {
            levelComplete(gameState);
            console.log("WIN");
            console.log(player.body.getPosition());
        }

        world.step();

        ground.render();
        for (let obs of obstacles) {
            obs.render();
        }
        player.render(camera);

        // directionalLight.shadow.camera.position.set(camera.position.x, camera.position.y, camera.position.z);
        // console.log(directionalLight.shadow.camera.position);
        // directionalLight.position.z = player.body.getPosition().z - 4;
        // directionalLight.target.z = player.body.getPosition().z;
        // directionalLight.target.position.x = player.body.getPosition().x;
        // directionalLight.target.position.y = player.body.getPosition().y;
        // directionalLight.target.position.z = player.body.getPosition().z;
        // console.log(directionalLight.target.position);
        renderer.render(scene, camera);
    } else {
        renderer.render(emptyScene, camera);
    }
}

function levelComplete(level) {
    document.getElementById("levelCompleteScreen").style.opacity = 100;
    gameState = LEVEL_COMPLETE;
    setTimeout(() => {
        document.getElementById("levelCompleteScreen").style.opacity = 0;
        setTimeout(() => {
            initLevel(level + 1);
        }, 500);
    }, 1000);
}

function initLevel(level) {
    document.getElementById(`level${level}Screen`).style.opacity = 100;
    setTimeout(() => {
        document.getElementById(`level${level}Screen`).style.opacity = 0;
        gameState = level;
    }, 500);
    player.reset();
    console.log(player.body.getPosition());
}

document.getElementById("start").addEventListener("click", () => {
    // gameState = PLAY;
    document.getElementById("startScreen").style.opacity = 0;

    setTimeout(() => (document.getElementById("level1Screen").style.opacity = 100), 500);
    setTimeout(() => (document.getElementById("level1Screen").style.opacity = 0), 1000);
    setTimeout(() => (gameState = LEVEL1), 1200);
});

window.addEventListener("keydown", (e) => {
    if (e.code === "ArrowRight") {
        rightKeyDown = true;
    }
    if (e.code === "ArrowLeft") {
        leftKeyDown = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.code === "ArrowRight") {
        rightKeyDown = false;
    }
    if (e.code === "ArrowLeft") {
        leftKeyDown = false;
    }
});

setup();
draw();
