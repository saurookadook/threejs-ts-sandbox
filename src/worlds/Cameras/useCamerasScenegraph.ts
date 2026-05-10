import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import type { ValueOf } from '@src/types/main';
import { CameraType, LightType } from '@src/constants';
import { ColorGUIHelper, MinMaxGUIHelper } from '@src/utils/gui';
import { needsResize } from '@src/utils';

export function useCamerasScenegraph(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  viewRefs: React.RefObject<HTMLDivElement | null>[],
  {
    cameraType,
    lightType,
  }: {
    cameraType?: ValueOf<typeof CameraType>;
    lightType?: ValueOf<typeof LightType>;
  },
) {
  useEffect(() => {
    if (canvasRef.current == null || viewRefs.some((ref) => ref.current == null))
      return;

    const canvasEl = canvasRef.current;
    const [view1Ref, view2Ref] = viewRefs;
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasEl });
    const gui = new GUI();

    const camera1Obj = (function () {
      if (cameraType === CameraType.PerspectiveCamera) {
        return createPerspectiveCameraAndAddToGUI(gui, {
          aspect: 2,
          far: 100,
          fov: 45,
          initialPosition: [0, 10, 20],
          near: 0.1,
        });
      } else {
        const left = -1;
        const right = 1;
        const top = 1;
        const bottom = -1;
        const near = 5;
        const far = 50;
        const camera = new THREE.OrthographicCamera(
          left,
          right,
          top,
          bottom,
          near,
          far,
        );
        camera.zoom = 0.2;
        gui.add(camera, 'zoom', 0.01, 1, 0.01).listen();
        return camera;
      }
    })();

    const controls1 = new OrbitControls(camera1Obj, view1Ref.current);
    controls1.target.set(0, 5, 0);
    controls1.update();

    const camera2Obj = createPerspectiveCameraAndAddToGUI(gui, {
      aspect: 2,
      far: 500,
      fov: 60,
      initialPosition: [40, 10, 30],
      near: 0.1,
    });
    camera2Obj.lookAt(0, 5, 0);

    const controls2 = new OrbitControls(camera2Obj, view2Ref.current);
    controls2.target.set(0, 5, 0);
    controls2.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000');

    const cameraHelper = new THREE.CameraHelper(camera1Obj);
    scene.add(cameraHelper);

    const planeSize = 40;

    const groundPlaneMesh = createCheckeredGroundPlaneMesh(planeSize, lightType);
    scene.add(groundPlaneMesh);
    const cubeMesh = createCubeMesh();
    scene.add(cubeMesh);
    const sphereMesh = createSphereMesh();
    scene.add(sphereMesh);

    createDirectionalLightAndAddToGUI(scene, gui);

    function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = Math.floor(canvas.clientWidth * pixelRatio);
      const height = Math.floor(canvas.clientHeight * pixelRatio);

      const shouldResize = needsResize(canvas, width, height);

      if (shouldResize) {
        renderer.setSize(width, height, false);
      }

      return shouldResize;
    }

    function render() {
      // if (resizeRendererToDisplaySize(renderer)) {
      //   const canvas = renderer.domElement;
      //   camera1Obj.aspect = canvas.clientWidth / canvas.clientHeight;
      //   camera1Obj.updateProjectionMatrix();
      // }

      resizeRendererToDisplaySize(renderer);

      // turn on scissor
      renderer.setScissorTest(true);

      viewRefs.forEach((ref, i) => {
        const aspectRatio = setScissorForElement(ref.current!, canvasEl, renderer);

        const cameraObj = i % 2 === 0 ? camera1Obj : camera2Obj;

        if (cameraObj instanceof THREE.OrthographicCamera) {
          cameraObj.left = -aspectRatio;
          cameraObj.right = aspectRatio;
        } else {
          cameraObj.aspect = aspectRatio;
        }
        cameraObj.updateProjectionMatrix();

        const backgroundColor = scene.background as THREE.Color;
        if (i % 2 === 0) {
          cameraHelper.update();
          // don't draw camera helper in original view
          cameraHelper.visible = false;
          backgroundColor.set(0x000000);
        } else {
          // draw camera helper in 2nd view
          cameraHelper.visible = true;
          backgroundColor.set(0x000040);
        }

        renderer.render(scene, cameraObj);
      });

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }, []);
}

type PerspectiveCameraProps = {
  aspect: number;
  far: number;
  fov: number;
  initialPosition: [number, number, number];
  near: number;
};

/**
 * @description
 * ## PerspectiveCamera
 *
 * - defines a 'frustum' based on 4 properties
 *    - `near` defines where front of frustum starts
 *    - `far` defines where it ends
 *    - `fov` _(field of view)_ defines how tall the front and back of frustum
 *      are by computing correct height to get specified field of view at
 *      `near` units from camera
 *    - `aspect` defines how wide the front and back of frustum are
 *    - HEIGHT of near and far planes are determined by `fov`
 *    - WIDTH of both planes are determined by `fov * aspect`
 */
function createPerspectiveCameraAndAddToGUI(
  gui: GUI,
  { aspect, far, fov, initialPosition, near }: PerspectiveCameraProps,
): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(...initialPosition);

  gui.add(camera, 'fov', 1, 180);
  // .onChange(() => updateCamera(camera));
  const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
  gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near');
  // .onChange(() => updateCamera(camera));
  gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far');
  // .onChange(() => updateCamera(camera));

  return camera;
}

/**
 * @note no longer need this since everything's being updated in render function
 */
function updateCamera(camera: THREE.PerspectiveCamera) {
  camera.updateProjectionMatrix();
}

/**
 * @description
 * - need to render scene from point of view of each camera using scissor function
 *   to only render to part of canvas
 * - this function
 *    - computes rectangle of given element that overlaps the canvas
 *    - sets scissor and viewport to that rectangle and returns aspect ratio for that size
 */
function setScissorForElement(
  elem: HTMLDivElement,
  canvasEl: HTMLCanvasElement,
  renderer: THREE.WebGLRenderer,
): number {
  const canvasRect = canvasEl.getBoundingClientRect();
  const elemRect = elem.getBoundingClientRect();

  // compute a canvas-relative rectangle
  const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
  const left = Math.max(0, elemRect.left - canvasRect.left);
  const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
  const top = Math.max(0, elemRect.top - canvasRect.top);

  const width = Math.min(canvasRect.width, right - left);
  const height = Math.min(canvasRect.height, bottom - top);

  // setup scissor to only render to that part of canvas
  const positiveYUpBottom = canvasRect.height - bottom;
  renderer.setScissor(left, positiveYUpBottom, width, height);
  renderer.setViewport(left, positiveYUpBottom, width, height);

  // return aspect ratio
  return width / height;
}

function createCheckeredGroundPlaneMesh(
  planeSize: number,
  lightType?: ValueOf<typeof LightType>,
): THREE.Mesh {
  const textureLoader = new THREE.TextureLoader();
  const checkeredTexture = textureLoader.load('/assets/checker.png');
  checkeredTexture.wrapS = THREE.RepeatWrapping;
  checkeredTexture.wrapT = THREE.RepeatWrapping;
  checkeredTexture.magFilter = THREE.NearestFilter;
  // checkeredTexture.colorSpace = THREE.SRGBColorSpace;
  const repeats = planeSize / 2;
  checkeredTexture.repeat.set(repeats, repeats);

  const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
  const MeshMaterial =
    lightType === LightType.RectAreaLight
      ? THREE.MeshStandardMaterial
      : THREE.MeshPhongMaterial;
  const planeMaterial = new MeshMaterial({
    map: checkeredTexture,
    side: THREE.DoubleSide,
  });
  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  planeMesh.rotation.x = Math.PI * -0.5;
  return planeMesh;
}

function createCubeMesh(lightType?: ValueOf<typeof LightType>): THREE.Mesh {
  const cubeSize = 4;
  const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const MeshMaterial =
    lightType === LightType.RectAreaLight
      ? THREE.MeshStandardMaterial
      : THREE.MeshPhongMaterial;
  const cubeMaterial = new MeshMaterial({ color: '#8AC' });
  const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cubeMesh.position.set(cubeSize + 1, cubeSize / 2, 0);
  return cubeMesh;
}

function createSphereMesh(lightType?: ValueOf<typeof LightType>): THREE.Mesh {
  const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeometry = new THREE.SphereGeometry(
    sphereRadius,
    sphereWidthDivisions,
    sphereHeightDivisions,
  );
  const MeshMaterial =
    lightType === LightType.RectAreaLight
      ? THREE.MeshStandardMaterial
      : THREE.MeshPhongMaterial;
  const sphereMaterial = new MeshMaterial({ color: '#CA8' });
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereMesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
  return sphereMesh;
}

/**
 * @description
 * ## DirectionalLight
 *
 * - often use to represent sun light
 */
function createDirectionalLightAndAddToGUI(
  scene: THREE.Scene,
  gui: GUI,
): THREE.DirectionalLight {
  const color = 0xffffff;
  const intensity = 1;
  const directionalLight = new THREE.DirectionalLight(color, intensity);
  directionalLight.position.set(0, 10, 0);
  directionalLight.target.position.set(-5, 0, 0);
  scene.add(directionalLight);
  scene.add(directionalLight.target);

  /**
   * @description helper object to help visualize invisible parts of scene by drawing:
   * - a plane to represent the light
   * - a line from the light to the target
   *
   * the plane represents a `DirectionalLight` because a directional light computes light
   * coming in one direction - there is no point the light comes from, it's an infinite
   * plane of light shooting out parallel rays of light
   */
  const helper = new THREE.DirectionalLightHelper(directionalLight);
  scene.add(helper);

  updateLight(directionalLight, helper);

  gui.addColor(new ColorGUIHelper(directionalLight, 'color'), 'value').name('color');
  gui.add(directionalLight, 'intensity', 0, 5, 0.01);
  gui.add(directionalLight.target.position, 'x', -10, 10);
  gui.add(directionalLight.target.position, 'y', -10, 10);
  gui.add(directionalLight.target.position, 'z', 0, 10);
  makeXYZGUI(
    gui,
    directionalLight.position,
    'light position',
    updateLight.bind(null, directionalLight, helper),
  );
  makeXYZGUI(
    gui,
    directionalLight.target.position,
    'target position',
    updateLight.bind(null, directionalLight, helper),
  );
  return directionalLight;
}

/**
 * @description helper function for a GUI to allow adjusting `x`, `y`, and `z` properties of
 * a given `THREE.Vector3` object
 */
function makeXYZGUI(
  gui: GUI,
  vector3: THREE.Vector3,
  name: string,
  onChangeFn: () => void,
) {
  const folder = gui.addFolder(name);
  folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
  folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
  folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
  folder.open();
}

type LightArg =
  | THREE.DirectionalLight
  | THREE.HemisphereLight
  | THREE.PointLight
  | THREE.RectAreaLight
  | THREE.SpotLight;
type LightHelperArg =
  | THREE.DirectionalLightHelper
  | THREE.HemisphereLightHelper
  | THREE.PointLightHelper
  | THREE.SpotLightHelper;

function updateLight(light: LightArg, helper: LightHelperArg) {
  if ('target' in light && light.target != null) {
    light.target.updateMatrixWorld();
  }
  helper.update();
}
