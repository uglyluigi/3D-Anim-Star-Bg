import { WebGLRenderer, PerspectiveCamera, Scene, Vector3 } from 'three';
import * as THREE from 'three';
import StarScene from './objects/Scene.js';

const scene = new Scene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({antialias: true});
const seedScene = new StarScene(function (pos) {
    camera.updateMatrix();
    camera.updateMatrixWorld();
    var frustum = new THREE.Frustum();
    frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));

    return frustum.containsPoint(pos);
}, scene);

//load bg texture
const loader = new THREE.TextureLoader();
loader.load('./assets/arp299.jpg', function(texture) {
  scene.background = texture;
  scene.add(seedScene);

  // camera
  camera.position.set(0, 0, 100);
  camera.lookAt(new Vector3(0,0,0));

  // renderer
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x7ec0ee, 1);

  // render loop
  const onAnimationFrameHandler = (timeStamp) => {
    renderer.render(scene, camera);
    seedScene.update && seedScene.update(timeStamp, renderer);
    window.requestAnimationFrame(onAnimationFrameHandler);
  }
  window.requestAnimationFrame(onAnimationFrameHandler);

  // resize
  const windowResizeHanlder = () => { 
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  };
  windowResizeHanlder();
  window.addEventListener('resize', windowResizeHanlder);

  // dom
  document.body.style.margin = 0;
  document.body.appendChild( renderer.domElement );
})

// scene
