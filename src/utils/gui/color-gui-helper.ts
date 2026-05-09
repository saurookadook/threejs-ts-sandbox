import { BaseHelper } from './base-helper';

export class ColorGUIHelper extends BaseHelper {
  get value() {
    return `#${this.obj[this.prop].getHexString()}`;
  }

  set value(hexString: string) {
    this.obj[this.prop].set(hexString);
  }
}
