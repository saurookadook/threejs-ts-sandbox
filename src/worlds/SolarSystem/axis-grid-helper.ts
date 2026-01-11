/**
 * @fileoverview Turns both axes and grid visible on/off
 * lil-gui requires a property that returns a bool
 * to decide to make a checkbox so we make a setter
 * and getter for `visible` which we can tell lil-gui
 * to look at.
 */
import * as THREE from 'three';

export class AxisGridHelper {
  axesHelper: THREE.AxesHelper;
  gridHelper: THREE.GridHelper;
  private _visible: boolean = false;

  constructor(node: THREE.Object3D, units: number = 10) {
    const axesHelper = new THREE.AxesHelper();
    axesHelper.material.depthTest = false;
    axesHelper.renderOrder = 2; // after the grid
    node.add(axesHelper);

    const gridHelper = new THREE.GridHelper(units, units);
    gridHelper.material.depthTest = false;
    gridHelper.renderOrder = 1; // before the axes
    node.add(gridHelper);

    this.axesHelper = axesHelper;
    this.gridHelper = gridHelper;
    this.updateVisibility(this._visible);
  }

  get visible() {
    return this._visible;
  }

  set visible(value: boolean) {
    this.updateVisibility(value);
  }

  updateVisibility(value: boolean) {
    this._visible = value;
    this.axesHelper.visible = value;
    this.gridHelper.visible = value;
  }
}
