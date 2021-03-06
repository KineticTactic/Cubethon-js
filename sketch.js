const START_SCREEN = 0;
const LEVEL1 = 1;
const LEVEL2 = 2;
const LEVEL3 = 3;
const LEVEL_COMPLETE = 4;
const END_SCREEN = 5;

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
let resetTimerSet = false;
let levelCompleteFade = false;

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
    directionalLight.position.set(-2, 6, 2);
    directionalLight.castShadow = true;
    // const d = 40;
    // directionalLight.shadow.camera.top = d;
    // directionalLight.shadow.camera.bottom = -d;
    // directionalLight.shadow.camera.left = -d;
    // directionalLight.shadow.camera.right = d;
    // scene.add(new THREE.CameraHelper(directionalLight.shadow.camera));
    scene.add(directionalLight);

    camera.position.y = 2;
    camera.position.z = 5;

    player = new Player(world, scene, new THREE.Vector3(0, 5, 50));
    ground = new StaticBox(world, scene, new THREE.Vector3(0, 0, -50), new THREE.Vector3(8, 1, 200));

    obstacles.push(new Obstacle(world, scene, new THREE.Vector3(0, 1, 15)));
    obstacles.push(new Obstacle(world, scene, new THREE.Vector3(1, 1, 15)));

    obstacles.push(new Obstacle(world, scene, new THREE.Vector3(-3, 1, -5)));
    obstacles.push(new Obstacle(world, scene, new THREE.Vector3(3, 1, -5)));

    obstacles.push(new Obstacle(world, scene, new THREE.Vector3(1, 1, -25)));
    obstacles.push(new Obstacle(world, scene, new THREE.Vector3(3, 1, -25)));

    directionalLight.target = player.lightTarget;
}

function draw() {
    requestAnimationFrame(draw);

    if (gameState !== START_SCREEN && gameState !== LEVEL_COMPLETE && gameState !== END_SCREEN) {
        if (rightKeyDown) {
            player.move(1.2);
        }
        if (leftKeyDown) {
            player.move(-1.2);
        }
        player.update(world, obstacles);

        if (player.checkForWin() && !levelCompleteFade) {
            levelComplete(gameState);
            resetTimerSet = true;
            levelCompleteFade = true;
        } else if (player.over && !resetTimerSet) {
            setTimeout(() => {
                if (gameState !== LEVEL_COMPLETE && gameState !== END_SCREEN) {
                    initLevel(gameState);
                }
            }, 2000);
            resetTimerSet = true;
        }

        world.step();

        ground.render();
        for (let obs of obstacles) {
            obs.render();
        }
        player.render(camera);

        directionalLight.position.z = player.body.getPosition().z - 4;

        renderer.render(scene, camera);
    } else {
        renderer.render(emptyScene, camera);
    }
}

function levelComplete(level) {
    document.getElementById("levelCompleteScreen").style.opacity = 100;
    player.over = false;
    if (level === LEVEL3) {
        gameState = END_SCREEN;
        setTimeout(() => {
            document.getElementById("levelCompleteScreen").style.opacity = 0;
            setTimeout(() => {
                document.getElementById("endScreen").style.opacity = 100;
            }, 500);
        }, 1000);
    } else {
        setTimeout(() => {
            gameState = LEVEL_COMPLETE;
            levelCompleteFade = false;

            document.getElementById("levelCompleteScreen").style.opacity = 0;
            setTimeout(() => {
                initLevel(level + 1);
            }, 500);
        }, 1000);
    }
}

function initLevel(level) {
    document.getElementById(`level${level}Screen`).style.opacity = 100;

    setTimeout(() => {
        document.getElementById(`level${level}Screen`).style.opacity = 0;
        gameState = level;
        player.reset();
        for (let obs of obstacles) {
            obs.reset();
        }
        resetTimerSet = false;
        // console.log("RESET");
    }, 500);
}

document.getElementById("start").addEventListener("click", () => {
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

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

setup();
draw();
