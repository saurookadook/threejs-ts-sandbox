import { useEffect } from 'react';
import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { needsResize } from '@src/utils';
import { DegRadHelper, StringToNumberHelper } from '@src/utils/gui';

const wrapModes = {
  ClampToEdgeWrapping: THREE.ClampToEdgeWrapping,
  MirroredRepeatWrapping: THREE.MirroredRepeatWrapping,
  RepeatWrapping: THREE.RepeatWrapping,
};

export function useLionCubeScenegraph(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  cubeSize = 1,
) {
  useEffect(() => {
    const canvasEl = canvasRef.current;

    if (canvasEl == null) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasEl });

    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const scene = new THREE.Scene();

    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    const cubes: THREE.Mesh[] = [];
    const loader = new THREE.TextureLoader();

    const lionTexture = asyncLoadLionTexture(loader, cubeGeometry, scene, cubes);

    const gui = new GUI();
    gui
      .add(new StringToNumberHelper(lionTexture, 'wrapS'), 'value', wrapModes)
      .name('texture.wrapS')
      .onChange(() => updateTexture(lionTexture));
    gui
      .add(new StringToNumberHelper(lionTexture, 'wrapT'), 'value', wrapModes)
      .name('texture.wrapT')
      .onChange(() => updateTexture(lionTexture));
    gui.add(lionTexture.repeat, 'x', 0, 5, 0.01).name('texture.repeat.x');
    gui.add(lionTexture.repeat, 'y', 0, 5, 0.01).name('texture.repeat.x');
    gui.add(lionTexture.offset, 'x', -2, 2, 0.01).name('texture.offset.x');
    gui.add(lionTexture.offset, 'y', -2, 2, 0.01).name('texture.offset.x');
    gui.add(lionTexture.center, 'x', -0.5, 1.5, 0.01).name('texture.center.x');
    gui.add(lionTexture.center, 'y', -0.5, 1.5, 0.01).name('texture.center.x');
    gui
      .add(new DegRadHelper(lionTexture, 'rotation'), 'value', -360, 360)
      .name('texture.rotation');

    function renderWithAnimation(time: number) {
      time *= 0.001; // convert time to seconds

      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = Math.floor(canvas.clientWidth * pixelRatio);
      const height = Math.floor(canvas.clientHeight * pixelRatio);

      if (needsResize(canvas, width, height)) {
        const canvas = renderer.domElement;
        // One of the suggested ways to handle HD-DPI (high-density dot per inch) displays
        // -- see https://threejs.org/manual/#en/responsive#handling-hd-dpi-displays
        // for limiting max. drawing buffer size:
        // -- see https://threejs.org/manual/#en/responsive#hd-dpi-limiting-maximum-drawing-buffer-size
        const pixelRatio = window.devicePixelRatio;
        const width = Math.floor(canvas.clientWidth * pixelRatio);
        const height = Math.floor(canvas.clientHeight * pixelRatio);
        // canvas's internal size (its resolution) is often called its 'drawingbuffer' size
        renderer.setSize(width, height, false);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      cubes.forEach((cube, idx) => {
        const speed = 0.2 + idx * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });

      renderer.render(scene, camera);

      window.requestAnimationFrame(renderWithAnimation);
    }

    window.requestAnimationFrame(renderWithAnimation);

    return () => {
      renderer.dispose();
    };
  }, []);
}

function updateTexture(texture: THREE.Texture) {
  texture.needsUpdate = true;
}

/** @note wait to load cube until texture is loaded */
function loadTextureWhenReady(
  loader: THREE.TextureLoader,
  cubeGeometry: THREE.BoxGeometry,
  scene: THREE.Scene,
  cubes: THREE.Mesh[],
) {
  loader.load('/assets/lion-wall.jpg', (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    const cubeMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cubeMesh);
    cubes.push(cubeMesh);
  });
}

/**
 * @note using this method of loading textures will result in it being
 * transparent until image is loaded asynchronously
 */
function asyncLoadLionTexture(
  loader: THREE.TextureLoader,
  cubeGeometry: THREE.BoxGeometry,
  scene: THREE.Scene,
  cubes: THREE.Mesh[],
) {
  const asyncLionTexture = loader.load('/assets/lion-wall.jpg');
  asyncLionTexture.colorSpace = THREE.SRGBColorSpace;

  const cubeMaterial = new THREE.MeshBasicMaterial({ map: asyncLionTexture });
  const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
  scene.add(cubeMesh);
  cubes.push(cubeMesh);
  return asyncLionTexture;
}
