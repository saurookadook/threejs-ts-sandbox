import { useEffect } from 'react';
import * as THREE from 'three';

import { createObjectAndAddToScene, needsResize } from '@src/utils';

type SphereOpts = {
  widthSegments?: number;
  heightSegments?: number;
};

type SubdividedSpheresOpts = {
  radius?: number;
  firstSphere?: SphereOpts;
  secondSphere?: SphereOpts;
  thirdSphere?: SphereOpts;
};

export function useSubdividedSpheresScenegraph(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  opts?: SubdividedSpheresOpts,
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
    camera.position.z = 120;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);

    addLightsToScene(scene);

    const meshObjects: THREE.Mesh[] = [];

    const {
      radius: sharedRadius, // force formatting
      firstSphere,
      secondSphere,
      thirdSphere,
    } = opts ?? {};

    {
      const radius = sharedRadius ?? 7;
      const widthSegments = firstSphere?.widthSegments ?? 12;
      const heightSegments = firstSphere?.heightSegments ?? 8;
      const sphereGeometry = new THREE.SphereGeometry(
        radius,
        widthSegments,
        heightSegments,
      );
      addSolidGeometry(scene, meshObjects, -2, 0, sphereGeometry);
    }

    {
      const radius = sharedRadius ?? 7;
      const widthSegments = secondSphere?.widthSegments ?? 12;
      const heightSegments = secondSphere?.heightSegments ?? 8;
      const sphereGeometry = new THREE.SphereGeometry(
        radius,
        widthSegments,
        heightSegments,
      );
      addSolidGeometry(scene, meshObjects, 0, 0, sphereGeometry);
    }

    {
      const radius = sharedRadius ?? 7;
      const widthSegments = thirdSphere?.widthSegments ?? 12;
      const heightSegments = thirdSphere?.heightSegments ?? 8;
      const sphereGeometry = new THREE.SphereGeometry(
        radius,
        widthSegments,
        heightSegments,
      );
      addSolidGeometry(scene, meshObjects, 2, 0, sphereGeometry);
    }

    function renderWithAnimation(time: number) {
      time *= 0.001; // convert time to seconds

      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = Math.floor(canvas.clientWidth * pixelRatio);
      const height = Math.floor(canvas.clientHeight * pixelRatio);

      if (needsResize(canvas, width, height)) {
        // canvas's internal size (its resolution) is often called its 'drawingbuffer' size
        renderer.setSize(width, height, false);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      meshObjects.forEach((obj, idx) => {
        const speed = 0.1 + idx * 0.05;
        const rotation = time * speed;
        obj.rotation.x = rotation;
        obj.rotation.y = rotation;
      });

      renderer.render(scene, camera);

      window.requestAnimationFrame(renderWithAnimation);
    }

    window.requestAnimationFrame(renderWithAnimation);

    return () => {
      renderer.dispose();
    };
  }, [canvasRef]);
}

function LightFactory() {
  const color = 0xffffff;
  const intensity = 3;
  return new THREE.DirectionalLight(color, intensity);
}

function addLightsToScene(scene: THREE.Scene) {
  {
    const light = LightFactory();
    // positions light slightly to left, above, and behind camera
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  {
    const light = LightFactory();
    light.position.set(1, -2, -4);
    scene.add(light);
  }
}

function addSolidGeometry(
  scene: THREE.Scene,
  meshObjects: THREE.Mesh[],
  x: number,
  y: number,
  geometry: THREE.BufferGeometry,
) {
  const mesh = new THREE.Mesh(geometry, createMaterial());
  createObjectAndAddToScene(scene, meshObjects, x, y, mesh);

  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const edgesMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 2,
  });
  const edgesMesh = new THREE.LineSegments(edgesGeometry, edgesMaterial);
  mesh.add(edgesMesh);
}

function createMaterial() {
  // const material = new THREE.MeshBasicMaterial();
  const material = new THREE.MeshPhongMaterial({
    flatShading: true,
    side: THREE.DoubleSide,
    // wireframe: true,
    wireframeLinewidth: 2,
  });
  const hue = Math.random();
  const saturation = 1;
  const luminance = 0.5;
  material.color.setHSL(hue, saturation, luminance);
  return material;
}
