import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';



export function mirror_origami() {
    // SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x00000);


    //SLIDER
    const gui = new dat.GUI();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 2

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x1f1e1c, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // ENABLE SHADOW
    renderer.shadowMap.enabled = true

    // DIRECTIONAL LIGHT
    const lightFolder = gui.addFolder('Light Position') // SLIDER FOLDER
    const dirLight = new THREE.DirectionalLight(0xd46270, 0.2)
    dirLight.position.x = -10
    dirLight.position.y = -5
    dirLight.position.z = -20
    dirLight.intensity = 7000
    const lightColor = {
    DirectionalLightColor : 0xd46270
}

// LIGHT SLIDER
gui.add(dirLight.position,"x").min(0).max(180).step(0.01)
gui.add(dirLight.position,"y").min(0).max(180).step(0.01)
// gui.add(dirLight.position,"z").min(0).max(40).step(0.01)
gui.addColor(lightColor,'DirectionalLightColor')
    .onChange(() => {
        dirLight.color.set(lightColor.DirectionalLightColor)
    })
gui.add(dirLight,'intensity').min(0).max(7000).step(0.01)

scene.add(dirLight);
// scene.add(new THREE.CameraHelper(dirLight.shadow.camera));  //Light indication

// GUI VARIABLE WITH INITIAL VALUES
const guiOptions = {
    // MATERIAL PROPERTIES
    enableSwoopingCamera: false,
    enableRotation: false,
    color: 0xffffff,
    metalness: 0,
    roughness: 0,
    transmission: 1,
    ior: 1,
    reflectivity: 0.15,
    thickness: 1,
    normalScale: 0.3,

    // SCENE PROPERTIES
    bloomThreshold: 0.85,
    bloomStrength: 0.35,
    bloomRadius: 0.33,

  };



// // TEXTURES
// const textureLoader = new THREE.TextureLoader();
// const waterBaseColor = textureLoader.load("./textures/liquid/14.png");
// const waterNormalMap = textureLoader.load("./textures/water/Water_002_NORM.jpg");
// const waterHeightMap = textureLoader.load("./textures/water/Water_002_DISP.png");
// const waterRoughness = textureLoader.load("./textures/water/Water_002_ROUGH.jpg");
// const waterAmbientOcclusion = textureLoader.load("./textures/water/Water_002_OCC.jpg");

// WIREFRAME MATERIAL
var wireMaterial = new THREE.MeshNormalMaterial({wireframe: true})


//MIRROR MATERIAL
const mirrorMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: guiOptions.metalness,
    roughness: guiOptions.roughness,
    transmission: guiOptions.transmission,
    ior: guiOptions.ior,
    reflectivity: guiOptions.reflectivity,
  });

// MIRROR MATERIAL SLIDER
gui.add(guiOptions, "enableSwoopingCamera").onChange((val) => {
    controls.enabled = !val;
    controls.reset();});

// GUI MATERIAL SECTION
gui.addFolder('Origami Material')
// CHOOSE WHETHER TO DISPLACE WIREFRAME
gui.add(mirrorMaterial,"wireframe").listen();

gui.addColor(guiOptions, "color").onChange((val) => {
    mirrorMaterial.color.set(val);
  });

  gui.add(guiOptions, "roughness", 0, 1, 0.01).onChange((val) => {
    mirrorMaterial.roughness = val;
  });

  gui.add(guiOptions, "metalness", 0, 1, 0.01).onChange((val) => {
    mirrorMaterial.metalness = val;
  });

  gui.add(guiOptions, "transmission", 0, 1, 0.01).onChange((val) => {
    mirrorMaterial.transmission = val;
  });

  gui.add(guiOptions, "ior", 1, 2.33, 0.01).onChange((val) => {
    mirrorMaterial.ior = val;
  });

  gui.add(guiOptions, "reflectivity", 0, 1, 0.01).onChange((val) => {
    mirrorMaterial.reflectivity = val;
  });

  gui.add(guiOptions, "thickness", 0, 5, 0.1).onChange((val) => {
    mirrorMaterial.thickness = val;
  });


// APPLY MATERIAL
const startingMapping = [
    { childID: "origami", mtl: mirrorMaterial}];
   
// PLANE GEOMETRY
// LOAD JPG TEXTURE
const bgTexture = new THREE.TextureLoader().load("./textures/liquid/3.jpeg");
const bgGeometry = new THREE.PlaneGeometry(2, 2);
const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
const planeMesh = new THREE.Mesh(bgGeometry, bgMaterial);
planeMesh.position.set(0, 0, -1);
scene.add(planeMesh);

// ORIGAMI GLTF MODEL
var model;
const loader = new GLTFLoader();
loader.load('origami.glb', (gltf) => {
    model = gltf.scene;
    
    for (let object of startingMapping) {
        startMaterial(model, object.childID, object.mtl);
      }

    model.rotateY(0);

    model.position.y = -0.5;

    scene.add(model);
});

    
// ORIGAMI MODEL MATERIAL
function startMaterial(parent, type, mtl) {
    parent.traverse(o => {
      if (o.isMesh) {
        if (o.name.includes(type)) {
          o.material = mtl;
          o.nameID = type;
        }
      }
    });
  };
  

// CONTROLS
var controls = new OrbitControls( camera, renderer.domElement );
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 3;
controls.enableDamping = true;
controls.enablePan = true;
controls.dampingFactor = 0.1;
controls.autoRotate = true;
controls.autoRotateSpeed = 2;
controls.update();


// POST PROCESSING
const params = {
    bloomStrength: 0.5,
    bloomThreshold: 0,
    bloomRadius: 0.8,
};
const composer = new EffectComposer( renderer );
const renderScene = new RenderPass( scene, camera );
const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

const bloomComposer = new EffectComposer( renderer );
bloomComposer.renderToScreen = false;

composer.addPass( renderScene );
composer.addPass( bloomPass );

const bloomFolder = gui.addFolder('Bloom') // SLIDER FOLDER

// BLOOMTHRESHOLD SCENE EFFECT
gui.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {
    bloomPass.threshold = Number( value );
} );

// BLOOMSTRENGTH SCENE EFFECT
gui.add( params, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value ) {
    bloomPass.strength = Number( value );
} );
// BLOOMRADIUS SCENE EFFECT
gui.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {
    bloomPass.radius = Number( value );
} );
var SPEED = 0.02
function selfRotate() {
    model.rotation.y -= SPEED * 0.3;
};


// ANIMATE
function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

    composer.render();
    selfRotate();
}
document.body.appendChild(renderer.domElement);
animate();


// RESIZE HANDLER
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.render();
}
window.addEventListener('resize', onWindowResize);

}

