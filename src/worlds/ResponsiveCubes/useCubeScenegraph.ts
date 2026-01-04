import { useEffect } from 'react';
import * as THREE from 'three';

export function useCubeScenegraph(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  cubeSize: number,
) {
  useEffect(() => {
    if (canvasRef.current == null) return;

    const canvasEl = canvasRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasEl });

    const fov = 75; // field of view, in degress
    const aspect = 2; // canvas default is 300x150 pixels, which makes aspect 300/150 or 2
    // `near` and `far` represent the space in front of the camera to be rendered; anything before that
    // range or afeter will be clipped (not drawn)
    const near = 0.1;
    const far = 5;
    // HEIGHT of near and far planes are determined by `fov`
    // WIDTH of both planes are determined by `fov` and `aspect`
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2; // move camera back a little from origin in order to see objects

    const scene = new THREE.Scene();

    const cubes = createMultipleCubes(cubeSize);
    cubes.forEach((cube) => scene.add(cube));

    addLightToScene(scene);

    function renderWithAnimation(time: number) {
      time *= 0.001; // convert time to seconds

      if (needsResize(renderer)) {
        const canvas = renderer.domElement;
        // canvas's internal size (its resolution) is often called its 'drawingbuffer' size
        // renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      cubes.forEach((cube, idx) => {
        const speed = 1 + idx * 0.1;
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
  }, [canvasRef.current, cubeSize]);
}

function createCube(cubeSize: number) {
  const boxWidth = cubeSize;
  const boxHeight = cubeSize;
  const boxDepth = cubeSize;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  // const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 }); // not affected by lights
  const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });

  // `Mesh` in three.js represents combo of 3 things:
  // - 1. a `Geometry` (shape of the object)
  // - 2. a `Material` (how to draw object — shiny or flat, what color, what texture(s) to apply, etc.)
  // - 3. position, orientation, and scale of object in the scene relative to its parent
  const cube = new THREE.Mesh(geometry, material);
  return cube;
}

/**
 * @note Direction lights have position and target, both of which default to (0, 0, 0)
 *
 *
 */
function addLightToScene(scene: THREE.Scene) {
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  // positions light slightly to left, above, and behind camera
  light.position.set(-1, 2, 4);
  scene.add(light);
}

function makeCubeInstance(
  geometry: THREE.BoxGeometry,
  color: string | number,
  x: number,
) {
  const material = new THREE.MeshPhongMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = x;
  return cube;
}

function createMultipleCubes(cubeSize: number) {
  const geometry = createCubeGeometry(cubeSize);
  const cubes = [
    makeCubeInstance(geometry, 0x44aa88, 0),
    makeCubeInstance(geometry, 0x8844aa, -2),
    makeCubeInstance(geometry, 0xaa8844, 2),
  ];
  return cubes;
}

function createCubeGeometry(cubeSize: number) {
  const boxWidth = cubeSize;
  const boxHeight = cubeSize;
  const boxDepth = cubeSize;
  return new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
}

function needsResize(renderer: THREE.WebGLRenderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  return canvas.width !== width || canvas.height !== height;
}
