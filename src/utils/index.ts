import * as THREE from 'three';

import { SPREAD } from '@src/constants';

export function createObjectAndAddToScene(
  scene: THREE.Scene,
  meshObjects: THREE.Mesh[],
  x: number,
  y: number,
  obj: THREE.Mesh,
) {
  obj.position.x = x * SPREAD;
  obj.position.y = y * SPREAD;
  scene.add(obj);
  meshObjects.push(obj);
}

export function needsResize(canvas: HTMLCanvasElement, width: number, height: number) {
  return canvas.width !== width || canvas.height !== height;
}
