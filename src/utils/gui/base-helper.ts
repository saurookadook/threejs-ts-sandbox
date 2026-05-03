import type { KeyedObject } from '@src/types/main';

export class BaseHelper {
  obj: KeyedObject<number> | any;
  prop: string;

  constructor(obj: KeyedObject<number> | any, prop: string) {
    this.obj = obj;
    this.prop = prop;
  }
}
