import type { KeyedObject } from '@src/types/main';

export class MinMaxGUIHelper {
  obj: KeyedObject<number> | any;
  minPropertyName: string;
  maxPropertyName: string;
  minDifference: number;

  constructor(
    obj: KeyedObject<number> | any,
    minPropertyName: string,
    maxPropertyName: string,
    minDifference: number,
  ) {
    {
      this.obj = obj;
      this.minPropertyName = minPropertyName;
      this.maxPropertyName = maxPropertyName;
      this.minDifference = minDifference;
    }
  }

  get min() {
    return this.obj[this.minPropertyName];
  }

  set min(v: number) {
    this.obj[this.minPropertyName] = v;
    this.obj[this.minPropertyName] = Math.max(
      this.obj[this.maxPropertyName],
      v + this.minDifference,
    );
  }

  get max() {
    return this.obj[this.maxPropertyName];
  }

  set max(v: number) {
    this.obj[this.maxPropertyName] = v;
    this.min = this.min; // this will call the `min` setter
  }
}
