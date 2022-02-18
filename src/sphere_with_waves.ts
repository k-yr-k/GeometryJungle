import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export function sphere_with_waves() 
{
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
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true


    // ADD AMBIENT LIGHT
    const ambientLight = new THREE.AmbientLight(0x343461, 1)
    ambientLight.intensity = 1
    const amlightColor = 
    {
        AmbientLightColor : 0x343461
    }
    scene.add(ambientLight);


    // ADD DIRECTIONAL LIGHT
    const lightFolder = gui.addFolder('Light Position') // SLIDER FOLDER
    const dirLight = new THREE.DirectionalLight(0xd46270, 0.2)
    dirLight.position.x = 20
    dirLight.position.y = 20
    dirLight.position.z = 20
    dirLight.intensity = 1
    const lightColor = 
    {
        DirectionalLightColor : 0xd46270
    }


    // ADD LIGHT SLIDER
    gui.add(dirLight.position,"x").min(0).max(40).step(0.01)
    gui.add(dirLight.position,"y").min(0).max(40).step(0.01)
    gui.add(dirLight.position,"z").min(0).max(40).step(0.01)
    gui.addColor(lightColor,'DirectionalLightColor')
        .onChange(() => {
            dirLight.color.set(lightColor.DirectionalLightColor)
        })
    gui.add(dirLight,'intensity').min(0).max(2).step(0.01)


    //ADD AMBIENT LIGHT SLIDER
    gui.addColor(amlightColor,'AmbientLightColor')
        .onChange(() => {
            ambientLight.color.set(amlightColor.AmbientLightColor)
        })
    gui.add(ambientLight,'intensity').min(0).max(2).step(0.01)


    //Define other parameters of directional light
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    const d = 20;
    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;
    dirLight.position.z = -25;
    let target = new THREE.Object3D();
    target.position.z = -30;
    dirLight.target = target;
    dirLight.target.updateMatrixWorld();
    scene.add(dirLight);


    // TEXTURES loading
    const textureLoader = new THREE.TextureLoader();
    const waterBaseColor = textureLoader.load("./textures/liquid/14.png");
    const waterNormalMap = textureLoader.load("./textures/water/Water_002_NORM.jpg");
    const waterHeightMap = textureLoader.load("./textures/water/Water_002_DISP.png");
    const waterRoughness = textureLoader.load("./textures/water/Water_002_ROUGH.jpg");
    const waterAmbientOcclusion = textureLoader.load("./textures/water/Water_002_OCC.jpg");


    // Geometry creation
    const geometry = new THREE.SphereBufferGeometry(6, 128, 128);


    //Material creation
    const material = new THREE.MeshStandardMaterial({
        map: waterBaseColor,
        normalMap: waterNormalMap,
        displacementMap: waterHeightMap, 
        roughnessMap: waterRoughness, 
        aoMap: waterAmbientOcclusion
    });

    material.displacementScale = 0;
    material.roughness = 0;
    material.metalness = 0;
    const matFolder = gui.addFolder('Material') // SLIDER FOLDER
    gui.add(material, "displacementScale").min(0).max(20).step(0.01)
    gui.add(material, "roughness").min(0).max(1).step(0.01)
    gui.add(material, "metalness").min(0).max(1).step(0.01)

    // Mesh creation based on geometry and material
    const sphere = new THREE.Mesh(geometry, material);
    sphere.receiveShadow = true;
    sphere.castShadow = true;
    sphere.position.z = -30;
    scene.add(sphere);

    const count: number = geometry.attributes.position.count;
    const position_clone = JSON.parse(JSON.stringify(geometry.attributes.position.array)) as Float32Array;
    const normals_clone = JSON.parse(JSON.stringify(geometry.attributes.normal.array)) as Float32Array;

    // CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 0, -30);
    controls.update();

    // Geometry morph variables
    var morph = 
    {
        waveX: 6,
        waveY: 24,
        indiceX: 3,
        indiceY: 3,
        indiceZ: 3,
        Height: 0.4,
        speed: 200
    }

    // GEOMETRY MORPH SLIDER
    const morphFolder = gui.addFolder('Morph') // SLIDER FOLDER
    gui.add(morph, "waveX").min(0).max(40).step(0.01)
    gui.add(morph, "waveY").min(0).max(40).step(0.01)
    gui.add(morph, "Height").min(0).max(3).step(0.01)
    gui.add(morph, "speed").min(0).max(400).step(1)


    //POST-PROCESSING: Bloom effect
    const params = 
    {
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


    // ADD POST-PROCESSING SLIDER
    const bloomFolder = gui.addFolder('Bloom')
    gui.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {
        bloomPass.threshold = Number( value );
    } );

    gui.add( params, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value ) {
        bloomPass.strength = Number( value );
    } );

    gui.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {
        bloomPass.radius = Number( value );
    } );


    // WAVING ANIMATE
    function animate() 
    {
        const now = Date.now() / (400 - morph.speed);

        // iterate all vertices
        for (let i = 0; i < count; i++) 
        {
            // indices
            const ix = i * morph.indiceX
            const iy = i * morph.indiceY + 1
            const iz = i * morph.indiceZ + 2

            // use uvs to calculate wave
            const uX = geometry.attributes.uv.getX(i) * Math.PI * morph.waveX
            const uY = geometry.attributes.uv.getY(i) * Math.PI * morph.waveY

            // calculate current vertex wave height
            const xangle = (uX + now)
            const xsin = Math.cos(xangle) * morph.Height
            const yangle = (uY + now)
            const ycos = Math.cos(yangle) * morph.Height

            // set new position for each indice
            geometry.attributes.position.setX(i, position_clone[ix] + normals_clone[ix] * (xsin + ycos))
            geometry.attributes.position.setY(i, position_clone[iy] + normals_clone[iy] * (xsin + ycos))
            geometry.attributes.position.setZ(i, position_clone[iz] + normals_clone[iz] * (xsin + ycos))
        }
        geometry.computeVertexNormals();
        geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);

        composer.render();
    }
    document.body.appendChild(renderer.domElement);
    animate();


    // RESIZE HANDLER
    function onWindowResize() 
    {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.render();
    }
    window.addEventListener('resize', onWindowResize);

}

