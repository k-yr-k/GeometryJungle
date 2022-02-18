import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';


export function terrain_editor() 
{
    // SLIDER
    const gui = new dat.GUI();

    // SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x00000);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 80;
    camera.position.z = 80;
    camera.position.x = 0;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true

    // CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 0, -25);
    controls.update();

    // AMIBIENT LIGHT 1 INTENSITY SLIDER
    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    ambientLight.intensity = 1
    const amlightColor = {
        AmbientLightColor : 0xffffff
    }
    scene.add(ambientLight);

    // AMBIENT LIGHT 2
    scene.add(new THREE.AmbientLight(0xffffff, 3.8));

    // DIRECTIONAL LIGHT
    const lightFolder = gui.addFolder('Light Position') // SLIDER FOLDER
    const dirLight = new THREE.DirectionalLight(0xe398a1, 1)
    dirLight.position.x += 40
    dirLight.position.y += 60
    dirLight.position.z = -40
    dirLight.intensity = 1
    const lightColor = {
        DirectionalLightColor : 0xe398a1
    }

    //Define other parameters of directional light
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    const d = 100;
    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;

    let target = new THREE.Object3D();
    target.position.z = -20;
    dirLight.target = target;
    dirLight.target.updateMatrixWorld();

    dirLight.shadow.camera.lookAt(0, 0, -30);
    scene.add(dirLight);


    // TEXTURES loading
    const textureLoader = new THREE.TextureLoader();
    const soilBaseColor = textureLoader.load("./textures/liquid/8.jpeg");
    const soilNormalMap = textureLoader.load("./textures/terr/NormalMap.png");
    const soilHeightMap = textureLoader.load("./textures/terr/DisplacementMap.png");
    const soilRoughness = textureLoader.load("./textures/terr/SpecularMap.png");
    const soilAmbientOcclusion = textureLoader.load("./textures/terr/AmbientOcclusionMap.png");

    // Geometry creation
    const WIDTH = 100;
    const HEIGHT = 100;
    const geometry = new THREE.PlaneBufferGeometry(WIDTH, HEIGHT, 300, 300);


    // Material creation
    let material = new THREE.MeshStandardMaterial({
        map: soilBaseColor,
        normalMap: soilNormalMap,
        displacementMap: soilHeightMap, 
        roughnessMap: soilRoughness, 
        aoMap: soilAmbientOcclusion,
    });
    material.displacementScale = 20;
    material.roughness = 0;
    material.metalness = 0.7;


    // Mesh creation based on geometry and material
    const plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;
    plane.castShadow = true;
    plane.rotation.x = - Math.PI /2;
    plane.position.z = - 30;
    scene.add(plane);



    // GEOMETRY MORPH SLIDER
    var morph = {
        BrushWidth: 10
    }


    // CLICK EVENT
    const raycaster = new THREE.Raycaster(); // create once
    const clickMouse = new THREE.Vector2();  // create once
    const vector3 = new THREE.Vector3();   // create once
    window.addEventListener('click', event => {

        // THREE RAYCASTER
        clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(clickMouse, camera);
        const found = raycaster.intersectObjects(scene.children);
        if (found.length > 0 && (found[0].object as THREE.Mesh).geometry) 
        {
            const mesh = found[0].object as THREE.Mesh
            const geometry = mesh.geometry
            const point = found[0].point

            for (let i = 0; i  < geometry.attributes.position.count; i++) 
            {
                vector3.setX(geometry.attributes.position.getX(i))
                vector3.setY(geometry.attributes.position.getY(i))
                vector3.setZ(geometry.attributes.position.getZ(i))
                const toWorld = mesh.localToWorld(vector3)

                const distance = point.distanceTo(toWorld)
                if (distance < morph.BrushWidth) 
                {
                    geometry.attributes.position.setZ(i, geometry.attributes.position.getZ(i) + (morph.BrushWidth - distance) / 2)
                }
            }
            geometry.computeVertexNormals()
            geometry.attributes.position.needsUpdate = true
        }
    })

    // Self rotating effect
    var SPEED = 0.01;
    function selfRotate() 
    {
        plane.rotation.z -= SPEED * 0.1;
    }  

    //POST-PROCESSING: Bloom effect
    const params = 
    {
        bloomStrength: 0,
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



    // SLIDER GUI
    function GUI(){
        // DIRECTIONAL LIGHT SLIDER
        gui.add(dirLight.position,"x").min(0).max(100).step(0.01)
        gui.add(dirLight.position,"y").min(0).max(100).step(0.01)
        gui.add(dirLight.position,"z").min(-100).max(0).step(0.01)
        gui.addColor(lightColor,'DirectionalLightColor')
            .onChange(() => {
                dirLight.color.set(lightColor.DirectionalLightColor)
            })
        gui.add(dirLight,'intensity').min(0).max(2).step(0.01)

        //AMBIENT LIGHT SLIDER
        gui.addColor(amlightColor,'AmbientLightColor')
            .onChange(() => {
                ambientLight.color.set(amlightColor.AmbientLightColor)
            })
        gui.add(ambientLight,'intensity').min(0).max(2).step(0.01)

        //MATERIAL SLIDER
        const matFolder = gui.addFolder('Material') // SLIDER FOLDER
        gui.add(material, "roughness").min(0).max(1).step(0.01)
        gui.add(material, "metalness").min(0).max(1).step(0.01)

        //MORPH 
        const morphFolder = gui.addFolder('Morph') // SLIDER FOLDER
        gui.add(material, "displacementScale").min(0).max(20).step(0.01)
        gui.add(morph, "BrushWidth").min(0).max(20).step(0.01)
        
        
        // POST-PROCESSING 
        const bloomFolder = gui.addFolder('Bloom') // SLIDER FOLDER
        gui.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) 
        {
            bloomPass.threshold = Number( value );
        } );
        gui.add( params, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value ) 
        {
            bloomPass.strength = Number( value );
        } );
        gui.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) 
        {
            bloomPass.radius = Number( value );
        } );
    }

    GUI();

    // ANIMATE
    function animate() 
    {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
        selfRotate();
        
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
    }
    window.addEventListener('resize', onWindowResize);

}

