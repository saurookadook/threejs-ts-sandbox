import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// RectAreaLight
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

import type { ValueOf } from '@src/types/main';
import { LightingType } from '@src/constants';
import { ColorGUIHelper, DegRadHelper } from '@src/utils/gui';
import { needsResize } from '@src/utils';

export function useLightingScenegraph(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  lightType?: ValueOf<typeof LightingType>,
) {
  useEffect(() => {
    if (canvasRef.current == null) return;

    const canvasEl = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasEl });
    if (lightType === LightingType.RectAreaLight) {
      RectAreaLightUniformsLib.init();
    }

    const fov = 45;
    const aspect = 2;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);

    const controls = new OrbitControls(camera, canvasEl);
    controls.target.set(0, 5, 0);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000');

    const planeSize = 40;

    const groundPlaneMesh = createCheckeredGroundPlaneMesh(planeSize, lightType);
    scene.add(groundPlaneMesh);
    const cubeMesh = createCubeMesh();
    scene.add(cubeMesh);
    const sphereMesh = createSphereMesh();
    scene.add(sphereMesh);

    const gui = new GUI();
    switch (lightType) {
      case LightingType.AmbientLight:
        createAmbientLightAndAddToGUI(scene, gui);
        break;
      case LightingType.DirectionalLight:
        createDirectionalLightAndAddToGUI(scene, gui);
        break;
      case LightingType.HemisphereLight:
        createHemisphereLightAndAddToGUI(scene, gui);
        break;
      case LightingType.PointLight:
        createPointLightAndAddToGUI(scene, gui);
        break;
      case LightingType.RectAreaLight:
        createRectAreaLightAndAddToGUI(scene, gui);
        break;
      case LightingType.SpotLight:
        createSpotLightAndAddToGUI(scene, gui);
        break;
      default:
        createAmbientLightAndAddToGUI(scene, gui);
    }

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
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }, []);
}

function createCheckeredGroundPlaneMesh(
  planeSize: number,
  lightType?: ValueOf<typeof LightingType>,
): THREE.Mesh {
  const textureLoader = new THREE.TextureLoader();
  const checkeredTexture = textureLoader.load('/assets/checker.png');
  checkeredTexture.wrapS = THREE.RepeatWrapping;
  checkeredTexture.wrapT = THREE.RepeatWrapping;
  checkeredTexture.magFilter = THREE.NearestFilter;
  checkeredTexture.colorSpace = THREE.SRGBColorSpace;
  const repeats = planeSize / 2;
  checkeredTexture.repeat.set(repeats, repeats);

  const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
  const MeshMaterial =
    lightType === LightingType.RectAreaLight
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

function createCubeMesh(lightType?: ValueOf<typeof LightingType>): THREE.Mesh {
  const cubeSize = 4;
  const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const MeshMaterial =
    lightType === LightingType.RectAreaLight
      ? THREE.MeshStandardMaterial
      : THREE.MeshPhongMaterial;
  const cubeMaterial = new MeshMaterial({ color: '#8AC' });
  const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cubeMesh.position.set(cubeSize + 1, cubeSize / 2, 0);
  return cubeMesh;
}

function createSphereMesh(lightType?: ValueOf<typeof LightingType>): THREE.Mesh {
  const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeometry = new THREE.SphereGeometry(
    sphereRadius,
    sphereWidthDivisions,
    sphereHeightDivisions,
  );
  const MeshMaterial =
    lightType === LightingType.RectAreaLight
      ? THREE.MeshStandardMaterial
      : THREE.MeshPhongMaterial;
  const sphereMaterial = new MeshMaterial({ color: '#CA8' });
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereMesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
  return sphereMesh;
}

/**
 * @description
 * ## AmbientLight
 *
 * - effectively multiplies material's color by light's color times the intensity
 * @example
 * ```txt
 * color = materialColor * light.color * light.intensity
 * ```
 * - mostly useful for making darks not too dark
 */
function createAmbientLightAndAddToGUI(
  scene: THREE.Scene,
  gui: GUI,
): THREE.AmbientLight {
  const color = 0xffffff;
  const intensity = 1;
  const ambientLight = new THREE.AmbientLight(color, intensity);
  gui.addColor(new ColorGUIHelper(ambientLight, 'color'), 'value').name('color');
  gui.add(ambientLight, 'intensity', 0, 5, 0.01);
  scene.add(ambientLight);
  return ambientLight;
}

/**
 * @description
 * ## HemisphereLight
 *
 * - takes **sky color**, **ground color**, and **intensity**
 * - multiplies material's color between those 2 colors:
 *   - by the sky color if surface of object is pointing up
 *   - by the ground color if surface of object is pointing down
 * - mostly used in combination with another light to give nice kind of influence of the
 *   color of the sky and the ground
 */
function createHemisphereLightAndAddToGUI(
  scene: THREE.Scene,
  gui: GUI,
): THREE.HemisphereLight {
  const skyColor = 0xb1e1ff; // light blue
  const groundColor = 0xb97a20; // brownish orange
  const intensity = 1;
  const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  scene.add(hemisphereLight);
  gui.addColor(new ColorGUIHelper(hemisphereLight, 'color'), 'value').name('skyColor');
  gui
    .addColor(new ColorGUIHelper(hemisphereLight, 'groundColor'), 'value')
    .name('groundColor');
  gui.add(hemisphereLight, 'intensity', 0, 5, 0.01);
  return hemisphereLight;
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
  // gui.add(directionalLight.target.position, 'x', -10, 10);
  // gui.add(directionalLight.target.position, 'y', -10, 10);
  // gui.add(directionalLight.target.position, 'z', 0, 10);
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
 * @description
 * ## PointLight
 *
 * - light that sits at a point and shoots light in all directions from that point
 */
function createPointLightAndAddToGUI(scene: THREE.Scene, gui: GUI): THREE.PointLight {
  const color = 0xffffff;
  const intensity = 150;
  const pointLight = new THREE.PointLight(color, intensity);
  pointLight.position.set(0, 10, 0);
  scene.add(pointLight);

  const helper = new THREE.PointLightHelper(pointLight);
  scene.add(helper);

  updateLight(pointLight, helper);

  gui.addColor(new ColorGUIHelper(pointLight, 'color'), 'value').name('color');
  gui.add(pointLight, 'intensity', 0, 250, 1);
  gui
    .add(pointLight, 'distance', 0, 40)
    .onChange(() => updateLight(pointLight, helper));

  makeXYZGUI(
    gui,
    pointLight.position,
    'position',
    updateLight.bind(null, pointLight, helper),
  );

  return pointLight;
}

/**
 * @description
 * ## SpotLight
 *
 * - basically a point light with a cone attached where light only shines inside cone
 * - there's actually 2 cones: outer and inner cone
 *    - between inner cone and outer cone, light fades from full intensity to zero
 *    - inner cone is defined by setting `penumbra` property as percentage from outer cone
 * - just like with `DirectionalLight`, need a target around which light's cone will open up
 */
function createSpotLightAndAddToGUI(scene: THREE.Scene, gui: GUI): THREE.SpotLight {
  const color = 0xffffff;
  const intensity = 150;
  const spotLight = new THREE.SpotLight(color, intensity);
  scene.add(spotLight);
  scene.add(spotLight.target);

  const helper = new THREE.SpotLightHelper(spotLight);
  scene.add(helper);

  updateLight(spotLight, helper);

  gui.addColor(new ColorGUIHelper(spotLight, 'color'), 'value').name('color');
  gui.add(spotLight, 'intensity', 0, 250, 1);
  gui.add(spotLight, 'distance', 0, 40).onChange(() => updateLight(spotLight, helper));
  gui
    .add(new DegRadHelper(spotLight, 'angle'), 'value', 0, 90)
    .name('angle')
    .onChange(() => updateLight(spotLight, helper));
  gui.add(spotLight, 'penumbra', 0, 1, 0.01);

  makeXYZGUI(
    gui,
    spotLight.position,
    'position',
    updateLight.bind(null, spotLight, helper),
  );
  makeXYZGUI(
    gui,
    spotLight.target.position,
    'target position',
    updateLight.bind(null, spotLight, helper),
  );

  return spotLight;
}

/**
 * @description
 * ## RectAreaLight
 *
 * - represents rectangular area of light like a fluorescent light or a frosted
 *   sky light in a ceiling
 * - only works with `MeshStandardMaterial` and `MeshPhysicalMaterial`
 * - need to add `RectAreaLightUniformsLib` and call `RectAreaLightUniformsLib.init()` to use
 *   `RectAreaLight`
 * - uses rotation instead of a target
 */
function createRectAreaLightAndAddToGUI(
  scene: THREE.Scene,
  gui: GUI,
): THREE.RectAreaLight {
  const color = 0xffffff;
  const intensity = 5;
  const width = 12;
  const height = 4;
  const rectAreaLight = new THREE.RectAreaLight(color, intensity, width, height);
  rectAreaLight.position.set(0, 10, 0);
  rectAreaLight.rotation.x = THREE.MathUtils.degToRad(-90);
  scene.add(rectAreaLight);

  /** @note `RectAreaLightHelper` needs to be added as a child of the light */
  const helper = new RectAreaLightHelper(rectAreaLight);
  rectAreaLight.add(helper);

  gui.addColor(new ColorGUIHelper(rectAreaLight, 'color'), 'value').name('color');
  gui.add(rectAreaLight, 'intensity', 0, 10, 0.01);
  gui.add(rectAreaLight, 'width', 0, 20);
  gui.add(rectAreaLight, 'height', 0, 20);
  gui
    .add(new DegRadHelper(rectAreaLight.rotation, 'x'), 'value', -180, 180)
    .name('x rotation');
  gui
    .add(new DegRadHelper(rectAreaLight.rotation, 'y'), 'value', -180, 180)
    .name('y rotation');
  gui
    .add(new DegRadHelper(rectAreaLight.rotation, 'z'), 'value', -180, 180)
    .name('z rotation');

  makeXYZGUI(
    gui,
    rectAreaLight.position,
    'light position',
    helper.updateMatrix,
    // updateLight.bind(null, rectAreaLight, helper),
  );
  return rectAreaLight;
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
