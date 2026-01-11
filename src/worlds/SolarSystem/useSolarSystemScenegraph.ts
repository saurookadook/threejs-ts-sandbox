import { useEffect } from 'react';
import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { needsResize } from '@src/utils';
import { AxisGridHelper } from './axis-grid-helper';

export function useSolarSystemScenegraph(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  useSolarSystemScenegraphV4(canvasRef);
  // useSolarSystemScenegraphV3(canvasRef);
  // useSolarSystemScenegraphV2(canvasRef);
  // useSolarSystemScenegraphV1(canvasRef);
}

export function useSolarSystemScenegraphV4(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  useEffect(() => {
    if (canvasRef.current == null) return;

    const canvasEl = canvasRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasEl });
    const gui = new GUI();

    const fov = 40;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 50, 0);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    addLightToScene(scene);

    const meshObjects: THREE.Object3D[] = [];

    const radius = 1;
    const widthSegments = 6;
    const heightSegments = 6;
    const sphereGeometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments,
    );

    const solarSystem = new THREE.Object3D();
    scene.add(solarSystem);
    meshObjects.push(solarSystem);

    const sunMaterial = new THREE.MeshPhongMaterial({
      emissive: 0xffff00, // color that will be drawn with no light hitting the surface
    });
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5);
    solarSystem.add(sunMesh);
    meshObjects.push(sunMesh);

    const earthOrbit = new THREE.Object3D();
    earthOrbit.position.x = 10;
    solarSystem.add(earthOrbit);
    meshObjects.push(earthOrbit);

    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244,
    });
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    // earthMesh.position.x = 10;
    // solarSystem.add(earthMesh);
    earthOrbit.add(earthMesh);
    meshObjects.push(earthMesh);

    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.x = 2;
    earthOrbit.add(moonOrbit);

    const moonMaterial = new THREE.MeshPhongMaterial({
      color: 0x888888,
      emissive: 0x222222,
    });
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
    moonMesh.scale.set(0.5, 0.5, 0.5);
    moonOrbit.add(moonMesh);
    meshObjects.push(moonMesh);

    //--------------------------- Render ---------------------------//
    makeAxisGrid(gui, solarSystem, 'solarSystem', 25);
    makeAxisGrid(gui, sunMesh, 'sunMesh');
    makeAxisGrid(gui, earthOrbit, 'earthOrbit');
    makeAxisGrid(gui, earthMesh, 'earthMesh');
    makeAxisGrid(gui, moonOrbit, 'moonOrbit');
    makeAxisGrid(gui, moonMesh, 'moonMesh');

    function renderWithAnimation(time: number) {
      time *= 0.001; // convert time to seconds

      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = Math.floor(canvas.clientWidth * pixelRatio);
      const height = Math.floor(canvas.clientHeight * pixelRatio);

      if (needsResize(canvas, width, height)) {
        // canvas's internal size (its resolution) is often called its 'drawingbuffer' size
        renderer.setSize(width, height, false);
        // camera.aspect = canvas.clientWidth / canvas.clientHeight;
        // camera.updateProjectionMatrix();
      }

      meshObjects.forEach((obj, idx) => {
        obj.rotation.y = time;
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

function makeAxisGrid(gui: GUI, node: THREE.Object3D, label: string, units?: number) {
  const helper = new AxisGridHelper(node, units);
  gui.add(helper, 'visible').name(label);
}

export function useSolarSystemScenegraphV3(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  useEffect(() => {
    if (canvasRef.current == null) return;

    const canvasEl = canvasRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasEl });

    const fov = 40;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 50, 0);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    addLightToScene(scene);

    const meshObjects: THREE.Object3D[] = [];

    const radius = 1;
    const widthSegments = 6;
    const heightSegments = 6;
    const sphereGeometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments,
    );

    const solarSystem = new THREE.Object3D();
    scene.add(solarSystem);
    meshObjects.push(solarSystem);

    const sunMaterial = new THREE.MeshPhongMaterial({
      emissive: 0xffff00, // color that will be drawn with no light hitting the surface
    });
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5);
    solarSystem.add(sunMesh);
    meshObjects.push(sunMesh);

    const earthOrbit = new THREE.Object3D();
    earthOrbit.position.x = 10;
    solarSystem.add(earthOrbit);
    meshObjects.push(earthOrbit);

    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244,
    });
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    // earthMesh.position.x = 10;
    // solarSystem.add(earthMesh);
    earthOrbit.add(earthMesh);
    meshObjects.push(earthMesh);

    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.x = 2;
    earthOrbit.add(moonOrbit);

    const moonMaterial = new THREE.MeshPhongMaterial({
      color: 0x888888,
      emissive: 0x222222,
    });
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
    moonMesh.scale.set(0.5, 0.5, 0.5);
    moonOrbit.add(moonMesh);
    meshObjects.push(moonMesh);

    //--------------------------- Render ---------------------------//

    function renderWithAnimation(time: number) {
      time *= 0.001; // convert time to seconds

      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = Math.floor(canvas.clientWidth * pixelRatio);
      const height = Math.floor(canvas.clientHeight * pixelRatio);

      if (needsResize(canvas, width, height)) {
        // canvas's internal size (its resolution) is often called its 'drawingbuffer' size
        renderer.setSize(width, height, false);
        // camera.aspect = canvas.clientWidth / canvas.clientHeight;
        // camera.updateProjectionMatrix();
      }

      meshObjects.forEach((obj, idx) => {
        /**
         * `AxesHelper` draws 3 lines representing the
         * local `X` (red), `Y` (green), and `Z` (blue) axes
         */
        const axesHelper = new THREE.AxesHelper();
        axesHelper.material.depthTest = false; // ensures axes are visible even when behind other objects
        axesHelper.renderOrder = 1; // ensures axes are rendered after spheres
        obj.add(axesHelper);
        // const speed = 0.1 + idx * 0.05;
        // const rotation = time * speed;
        // obj.rotation.x = rotation;
        obj.rotation.y = time;
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

export function useSolarSystemScenegraphV2(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  useEffect(() => {
    if (canvasRef.current == null) return;

    const canvasEl = canvasRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasEl });

    const fov = 40;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 150, 0);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    addLightToScene(scene);

    const meshObjects: THREE.Object3D[] = [];

    const radius = 1;
    const widthSegments = 6;
    const heightSegments = 6;
    const sphereGeometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments,
    );

    const solarSystem = new THREE.Object3D();
    scene.add(solarSystem);
    meshObjects.push(solarSystem);

    const sunMaterial = new THREE.MeshPhongMaterial({
      emissive: 0xffff00, // color that will be drawn with no light hitting the surface
    });
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5);
    solarSystem.add(sunMesh);
    meshObjects.push(sunMesh);

    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244,
    });
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    earthMesh.position.x = 10;
    // sunMesh.add(earthMesh);
    solarSystem.add(earthMesh);
    meshObjects.push(earthMesh);

    //--------------------------- Render ---------------------------//

    function renderWithAnimation(time: number) {
      time *= 0.001; // convert time to seconds

      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = Math.floor(canvas.clientWidth * pixelRatio);
      const height = Math.floor(canvas.clientHeight * pixelRatio);

      if (needsResize(canvas, width, height)) {
        // canvas's internal size (its resolution) is often called its 'drawingbuffer' size
        renderer.setSize(width, height, false);
        // camera.aspect = canvas.clientWidth / canvas.clientHeight;
        // camera.updateProjectionMatrix();
      }

      meshObjects.forEach((obj, idx) => {
        // const speed = 0.1 + idx * 0.05;
        // const rotation = time * speed;
        // obj.rotation.x = rotation;
        obj.rotation.y = time;
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

export function useSolarSystemScenegraphV1(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  useEffect(() => {
    if (canvasRef.current == null) return;

    const canvasEl = canvasRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasEl });

    const fov = 40;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 150, 0);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    addLightToScene(scene);

    const meshObjects: THREE.Mesh[] = [];

    const radius = 1;
    const widthSegments = 6;
    const heightSegments = 6;
    const sphereGeometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments,
    );

    const sunMaterial = new THREE.MeshPhongMaterial({
      emissive: 0xffff00, // color that will be drawn with no light hitting the surface
    });
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5);
    scene.add(sunMesh);
    meshObjects.push(sunMesh);

    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244,
    });
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    earthMesh.position.x = 10;
    // scene.add(earthMesh);
    sunMesh.add(earthMesh);
    meshObjects.push(earthMesh);

    //--------------------------- Render ---------------------------//

    function renderWithAnimation(time: number) {
      time *= 0.001; // convert time to seconds

      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = Math.floor(canvas.clientWidth * pixelRatio);
      const height = Math.floor(canvas.clientHeight * pixelRatio);

      if (needsResize(canvas, width, height)) {
        // canvas's internal size (its resolution) is often called its 'drawingbuffer' size
        renderer.setSize(width, height, false);
        // camera.aspect = canvas.clientWidth / canvas.clientHeight;
        // camera.updateProjectionMatrix();
      }

      meshObjects.forEach((obj, idx) => {
        // const speed = 0.1 + idx * 0.05;
        // const rotation = time * speed;
        // obj.rotation.x = rotation;
        obj.rotation.y = time;
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

function addLightToScene(scene: THREE.Scene) {
  const color = 0xffffff;
  // const intensity = 1;
  // const light = new THREE.DirectionalLight(color, intensity);
  // // positions light slightly to left, above, and behind camera
  // light.position.set(-1, 2, 4);
  // scene.add(light);

  const intensity = 500;
  const pointLight = new THREE.PointLight(color, intensity);
  scene.add(pointLight);
}
