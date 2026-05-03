import * as THREE from 'three';

import { BaseHelper } from './base-helper';

/**
 * @description Provide `lil-gui` an object that it can manipulate in degrees but
 * will set property in radians
 */
export class StringToNumberHelper extends BaseHelper {
  get value(): number {
    return this.obj[this.prop];
  }

  set value(v: string) {
    this.obj[this.prop] = parseFloat(v);
  }
}
