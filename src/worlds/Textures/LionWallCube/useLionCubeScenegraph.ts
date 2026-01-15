import { useEffect } from 'react';
import * as THREE from 'three';

import { needsResize } from '@src/utils';

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

    const lionTexture = loader.load('/assets/lion-wall.jpg');
    lionTexture.colorSpace = THREE.SRGBColorSpace;

    const cubeMaterial = new THREE.MeshBasicMaterial({ map: lionTexture });
    const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cubeMesh);
    cubes.push(cubeMesh);

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
