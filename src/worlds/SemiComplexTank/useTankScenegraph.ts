import { useEffect } from 'react';
import * as THREE from 'three';

import { needsResize } from '@src/utils';

const CHASSIS_WIDTH = 4;
const CHASSIS_HEIGHT = 1;
const CHASSIS_LENGTH = 8;
const TANK_COLOR = 0x6688aa;

type Material = typeof THREE.MeshPhongMaterial | typeof THREE.MeshToonMaterial;

export function useTankScenegraph(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  infoRef: React.RefObject<HTMLDivElement | null>,
  toonify: boolean = false,
) {
  const MeshMaterial = toonify ? THREE.MeshToonMaterial : THREE.MeshPhongMaterial;

  useEffect(() => {
    const canvasEl = canvasRef.current;
    const infoEl = infoRef.current;

    if (canvasEl == null || infoEl == null) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasEl });
    renderer.setClearColor(0xaaaaaa);
    renderer.shadowMap.enabled = true;

    const camera = makeCamera();
    camera.position.set(8, 4, 10).multiplyScalar(3);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();

    addComplexDirectionalLightToScene(scene);
    addSimpleDirectionalLightToScene(scene);

    addGroundToScene(scene, MeshMaterial);

    const tankGraph = buildAndAddTankToScene(scene, MeshMaterial);

    const chassisMesh = tankGraph.children.find(
      (m) => m.name === 'chassis',
    ) as THREE.Mesh;

    const wheelMeshes = buildTankWheels(chassisMesh, MeshMaterial);

    const tankCameraFov = 75;
    const tankCamera = makeCamera(tankCameraFov);
    // tankCamera.position.set(0, 3, -6);
    tankCamera.position.y = 3;
    tankCamera.position.z = -6;
    tankCamera.rotation.y = Math.PI;
    chassisMesh.add(tankCamera);

    buildTankDome(chassisMesh);
    const turretPivot = new THREE.Object3D();
    const turretMesh = buildTankTurret(chassisMesh, turretPivot);

    const turretCamera = makeCamera();
    turretCamera.position.y = 0.75 * 0.2;
    turretMesh.add(turretCamera);

    /**
     * @description
     * - Rotates and changes colors
     */
    const targetMesh = TargetMeshFactory(MeshMaterial);
    /**
     * @description
     * - Rotates in relation to `tankGraph` (I think?)
     */
    const targetOrbit = new THREE.Object3D();
    /**
     * @description
     * - Child of `targetOrbit`
     * - Provides offset from `targetOrbit` and base elevation
     */
    const targetElevation = new THREE.Object3D();
    /**
     * @description
     * - Child of `targetElevation`
     * - Bobs up and down relative to `targetElevation`
     */
    const targetBob = new THREE.Object3D();
    targetMesh.castShadow = true;
    scene.add(targetOrbit);
    targetOrbit.add(targetElevation);
    targetElevation.position.y = 8;
    targetElevation.position.z = CHASSIS_LENGTH * 2;
    targetElevation.add(targetBob);
    targetBob.add(targetMesh);

    const targetCamera = makeCamera();
    const targetCameraPivot = new THREE.Object3D();
    targetCamera.position.y = 1;
    targetCamera.position.z = -2;
    targetCamera.rotation.y = Math.PI;
    targetBob.add(targetCameraPivot);
    targetCameraPivot.add(targetCamera);

    const curve = createSineLikeCurve();

    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const splineObject = new THREE.Line(geometry, material);
    splineObject.position.y = 0.05;
    splineObject.rotation.x = Math.PI * 0.5;
    scene.add(splineObject);

    const targetPosition = new THREE.Vector3();
    const tankPosition = new THREE.Vector2();
    const tankTarget = new THREE.Vector2();

    const cameras = [
      { cam: camera, desc: 'detached camera' },
      { cam: turretCamera, desc: 'on turret looking at target' },
      { cam: targetCamera, desc: 'near target looking at tank' },
      { cam: tankCamera, desc: 'above back of tank' },
    ];

    function renderFrame(time: number) {
      time *= 0.001;

      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = Math.floor(canvas.clientWidth * pixelRatio);
      const height = Math.floor(canvas.clientHeight * pixelRatio);

      if (needsResize(canvas, width, height)) {
        renderer.setSize(width, height, false);

        cameras.forEach((cameraInfo) => {
          cameraInfo.cam.aspect = width / height;
          if (typeof cameraInfo.cam.updateProjectionMatrix === 'function') {
            cameraInfo.cam.updateProjectionMatrix();
          }
        });
      }

      // move target
      targetOrbit.rotation.y = time * 0.27;
      targetBob.position.y = Math.sin(time * 2) * 4;
      targetMesh.rotation.x = time * 7;
      targetMesh.rotation.y = time * 13;
      const hue = (time * 10) % 1;
      targetMesh.material.color.setHSL(hue, 1, 0.25);
      targetMesh.material.emissive.setHSL(hue, 1, 0.25);

      // move tank
      const tankTime = time * 0.05;
      curve.getPointAt(tankTime % 1, tankPosition); // update tank position vector
      curve.getPointAt((tankTime + 0.01) % 1, tankTarget); // update tank target vector
      tankGraph.position.set(tankPosition.x, 0, tankPosition.y); // position tank
      tankGraph.lookAt(tankTarget.x, 0, tankTarget.y); // point tank chassis in direction of tank target

      // face turret at target
      targetMesh.getWorldPosition(targetPosition); // copy target world position into `targetPosition` vector
      turretPivot.lookAt(targetPosition); // point turret at target

      // make `turretCamera` look at target
      turretCamera.lookAt(targetPosition);

      // make `targetCameraPivot` look at `tankGraph`
      tankGraph.getWorldPosition(targetPosition); // copy tank world position into `targetPosition` vector
      targetCameraPivot.lookAt(targetPosition);

      wheelMeshes.forEach((wheel) => {
        wheel.rotation.x = time * 3;
      });

      const { cam, desc } = cameras[((time * 0.25) % cameras.length) | 0];
      infoEl!.textContent = desc;

      renderer.render(scene, cam);

      window.requestAnimationFrame(renderFrame);
    }

    window.requestAnimationFrame(renderFrame);

    return () => {
      if (canvasEl != null) {
        renderer.dispose();
      }
    };
  }, [canvasRef, infoRef]);
}

function makeCamera(fov: number = 40) {
  const aspect = 2;
  const zNear = 0.1;
  const zFar = 1000;
  return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
}

//-----------------------------------------------------------------------------
// Lights
//-----------------------------------------------------------------------------
function DirectionalLightFactory() {
  return new THREE.DirectionalLight(0xffffff, 3);
}

function addComplexDirectionalLightToScene(scene: THREE.Scene) {
  const light = DirectionalLightFactory();
  light.position.set(0, 20, 0);
  scene.add(light);
  light.castShadow = true;

  const d = 50;
  light.shadow.bias = 0.001;
  light.shadow.camera.bottom = -d;
  light.shadow.camera.far = 50;
  light.shadow.camera.left = -d;
  light.shadow.camera.near = 1;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
}

function addSimpleDirectionalLightToScene(scene: THREE.Scene) {
  const light = DirectionalLightFactory();
  light.position.set(1, 2, 4);
  scene.add(light);
}

//-----------------------------------------------------------------------------
// Environment
//-----------------------------------------------------------------------------
function addGroundToScene(scene: THREE.Scene, Material: Material) {
  const groundGeometry = new THREE.PlaneGeometry(50, 50);
  const groundMaterial = new Material({ color: 0xcc8866 });
  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
  groundMesh.rotation.x = Math.PI * -0.5;
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);
}

function createSineLikeCurve() {
  const coords: [number, number][] = [
    [-10, 0],
    [-5, 5],
    [0, 0],
    [5, -5],
    [10, 0],
    [5, 10],
    [-5, 10],
    [-10, -10],
    [-15, -8],
    [-10, 0],
  ];
  return new THREE.SplineCurve(coords.map((pair) => new THREE.Vector2(...pair)));
}

//-----------------------------------------------------------------------------
// Tank
//-----------------------------------------------------------------------------
function buildAndAddTankToScene(
  scene: THREE.Scene,
  Material: Material,
): THREE.Object3D {
  const tank = new THREE.Object3D();
  tank.name = 'tank';
  scene.add(tank);

  buildChassis(tank, Material);

  return tank;
}

function buildChassis(tank: THREE.Object3D, Material: Material) {
  const chassisGeometry = new THREE.BoxGeometry(
    CHASSIS_WIDTH,
    CHASSIS_HEIGHT,
    CHASSIS_LENGTH,
  );
  const chassisMaterial = new Material({ color: TANK_COLOR, flatShading: false });
  const chassisMesh = new THREE.Mesh(chassisGeometry, chassisMaterial);
  chassisMesh.castShadow = true;
  chassisMesh.name = 'chassis';
  chassisMesh.position.y = 1.4;
  tank.add(chassisMesh);
}

function buildTankWheels(chassis: THREE.Mesh, Material: Material): THREE.Mesh[] {
  const wheelRadius = 1;
  const wheelThickness = 0.5;
  const wheelSegments = 6;
  const wheelGeometry = new THREE.CylinderGeometry(
    wheelRadius, // top radius
    wheelRadius, // bottom radius
    wheelThickness, // height of cylinder
    wheelSegments,
  );
  const wheelMaterial = new Material({ color: 0x888888, flatShading: true });

  const halfChassisWidth = CHASSIS_WIDTH / 2;
  const halfChassisHeight = CHASSIS_HEIGHT / 2;
  const thirdChassisLength = CHASSIS_LENGTH / 3;
  const halfWheelThickness = wheelThickness / 2;

  const wheelPositions: [number, number, number][] = [
    [-halfChassisWidth - halfWheelThickness, -halfChassisHeight, thirdChassisLength],
    [halfChassisWidth + halfWheelThickness, -halfChassisHeight, thirdChassisLength],
    [-halfChassisWidth - halfWheelThickness, -halfChassisHeight, 0],
    [halfChassisWidth + halfWheelThickness, -halfChassisHeight, 0],
    [-halfChassisWidth - halfWheelThickness, -halfChassisHeight, -thirdChassisLength],
    [halfChassisWidth + halfWheelThickness, -halfChassisHeight, -thirdChassisLength],
  ];

  const wheelMeshes = wheelPositions.map((position) => {
    const mesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
    mesh.castShadow = true;
    mesh.position.set(...position);
    mesh.rotation.z = Math.PI * 0.5;
    chassis.add(mesh);
    return mesh;
  });

  return wheelMeshes;
}

function buildTankDome(chassis: THREE.Mesh) {
  const domeRadius = 2;
  const domeWidthSubdivisions = 12;
  const domeHeightSubdivisions = 12;
  const domePhiStart = 0;
  const domePhiEnd = Math.PI * 2;
  const domeThetaStart = 0;
  const domeThetaEnd = Math.PI * 0.5;
  const domeGeometry = new THREE.SphereGeometry(
    domeRadius,
    domeWidthSubdivisions,
    domeHeightSubdivisions,
    domePhiStart,
    domePhiEnd,
    domeThetaStart,
    domeThetaEnd,
  );

  const domeMesh = new THREE.Mesh(domeGeometry, chassis.material);
  domeMesh.castShadow = true;
  domeMesh.position.y = 0.5;
  chassis.add(domeMesh);
  return domeMesh;
}

function buildTankTurret(chassis: THREE.Mesh, turretPivot: THREE.Object3D): THREE.Mesh {
  const turretWidth = 0.1;
  const turretHeight = 0.1;
  const turretLength = CHASSIS_LENGTH * 0.75 * 0.2;
  const turretGeometry = new THREE.BoxGeometry(turretWidth, turretHeight, turretLength);
  const turretMesh = new THREE.Mesh(turretGeometry, chassis.material);
  turretMesh.castShadow = true;
  turretPivot.scale.set(5, 5, 5);
  turretPivot.position.y = 0.5;
  turretMesh.position.z = turretLength * 0.5;
  turretPivot.add(turretMesh);
  chassis.add(turretPivot);
  return turretMesh;
}

//-----------------------------------------------------------------------------
// Target
//-----------------------------------------------------------------------------
function TargetMeshFactory(Material: Material) {
  const targetGeometry = new THREE.SphereGeometry(0.5, 6, 3);
  const targetMaterial = new Material({
    color: 0x00ff00,
    flatShading: true,
  });
  return new THREE.Mesh(targetGeometry, targetMaterial);
}
