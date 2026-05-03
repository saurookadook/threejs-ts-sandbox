import * as THREE from 'three';

import { BaseHelper } from './base-helper';

/**
 * @description Provide `lil-gui` an object that it can manipulate in degrees but
 * will set property in radians
 */
export class DegRadHelper extends BaseHelper {
  get value() {
    return THREE.MathUtils.radToDeg(this.obj[this.prop]);
  }

  set value(v: number) {
    this.obj[this.prop] = THREE.MathUtils.degToRad(v);
  }
}
