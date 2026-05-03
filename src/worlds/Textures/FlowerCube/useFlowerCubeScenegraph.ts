/**
 * @fileoverview Examples using Textures
 */
import { useEffect } from 'react';
import * as THREE from 'three';

import { needsResize } from '@src/utils';

export function useFlowerCubeScenegraph(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  cubeSize = 1,
) {
  useEffect(() => {
    const canvasEl = canvasRef.current;

    if (canvasEl == null) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasEl });

    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const scene = new THREE.Scene();

    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    const cubes: THREE.Mesh[] = [];
    const loadManager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(loadManager);

    const cubeMaterials = [
      new THREE.MeshBasicMaterial({
        map: loader.load('/assets/flower-texture-1.jpg'),
      }),
      new THREE.MeshBasicMaterial({
        map: loader.load('/assets/flower-texture-2.jpg'),
      }),
      new THREE.MeshBasicMaterial({
        map: loader.load('/assets/flower-texture-3.jpg'),
      }),
      new THREE.MeshBasicMaterial({
        map: loader.load('/assets/flower-texture-4.jpg'),
      }),
      new THREE.MeshBasicMaterial({
        map: loader.load('/assets/flower-texture-5.jpg'),
      }),
      new THREE.MeshBasicMaterial({
        map: loader.load('/assets/flower-texture-6.jpg'),
      }),
    ];

    const loadingEl = document.getElementById('loading-bar') as HTMLDivElement;
    const progressBarEl = loadingEl.querySelector('.progress-bar') as HTMLDivElement;
    loadManager.onLoad = () => {
      loadingEl.style.display = 'none';
      const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterials);
      scene.add(cubeMesh);
      cubes.push(cubeMesh);
    };

    loadManager.onProgress = (
      urlOfLastItemLoaded: string,
      itemsLoaded: number,
      itemsTotal: number,
    ) => {
      const progress = itemsLoaded / itemsTotal;
      progressBarEl.style.transform = `scaleX(${progress})`;
    };

    function renderWithAnimation(time: number) {
      time *= 0.001; // convert time to seconds

      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = Math.floor(canvas.clientWidth * pixelRatio);
      const height = Math.floor(canvas.clientHeight * pixelRatio);

      if (needsResize(canvas, width, height)) {
        const canvas = renderer.domElement;
        // One of the suggested ways to handle HD-DPI (high-density dot per inch) displays
        // -- see https://threejs.org/manual/#en/responsive#handling-hd-dpi-displays
        // for limiting max. drawing buffer size:
        // -- see https://threejs.org/manual/#en/responsive#hd-dpi-limiting-maximum-drawing-buffer-size
        const pixelRatio = window.devicePixelRatio;
        const width = Math.floor(canvas.clientWidth * pixelRatio);
        const height = Math.floor(canvas.clientHeight * pixelRatio);
        // canvas's internal size (its resolution) is often called its 'drawingbuffer' size
        renderer.setSize(width, height, false);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      cubes.forEach((cube, idx) => {
        const speed = 0.2 + idx * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });

      renderer.render(scene, camera);

      window.requestAnimationFrame(renderWithAnimation);
    }

    window.requestAnimationFrame(renderWithAnimation);

    return () => {
      renderer.dispose();
    };
  }, []);
}

export function useFlowerCubeScenegraphAsync(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  cubeSize = 1,
) {
  useEffect(() => {
    const canvasEl = canvasRef.current;

    if (canvasEl == null) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasEl });

    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const scene = new THREE.Scene();

    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    const cubes: THREE.Mesh[] = [];
    const loader = new THREE.TextureLoader();

    const cubeMaterials = [
      new THREE.MeshBasicMaterial({
        map: loadColorTexture('/assets/flower-texture-1.jpg', loader),
      }),
      new THREE.MeshBasicMaterial({
        map: loadColorTexture('/assets/flower-texture-2.jpg', loader),
      }),
      new THREE.MeshBasicMaterial({
        map: loadColorTexture('/assets/flower-texture-3.jpg', loader),
      }),
      new THREE.MeshBasicMaterial({
        map: loadColorTexture('/assets/flower-texture-4.jpg', loader),
      }),
      new THREE.MeshBasicMaterial({
        map: loadColorTexture('/assets/flower-texture-5.jpg', loader),
      }),
      new THREE.MeshBasicMaterial({
        map: loadColorTexture('/assets/flower-texture-6.jpg', loader),
      }),
    ];
    /**
     * @note when loading multiple textures, it's much more common to use a
     * {@link https://en.wikipedia.org/wiki/Texture_atlas | Texture Atlas}
     *
     * A Texture atlas is where you put multiple images in a single texture and then use
     * texture coordinates on the vertices of your geometry to select which parts of a
     * texture are used on each triangle in your geometry.
     *
     * What are texture coordinates?
     * - data added to each vertext of a piece of geometry that specify what part of the
     * texture corresponds to that specific vertex
     */
    const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterials);
    scene.add(cubeMesh);
    cubes.push(cubeMesh);

    function renderWithAnimation(time: number) {
      time *= 0.001; // convert time to seconds

      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = Math.floor(canvas.clientWidth * pixelRatio);
      const height = Math.floor(canvas.clientHeight * pixelRatio);

      if (needsResize(canvas, width, height)) {
        const canvas = renderer.domElement;
        // One of the suggested ways to handle HD-DPI (high-density dot per inch) displays
        // -- see https://threejs.org/manual/#en/responsive#handling-hd-dpi-displays
        // for limiting max. drawing buffer size:
        // -- see https://threejs.org/manual/#en/responsive#hd-dpi-limiting-maximum-drawing-buffer-size
        const pixelRatio = window.devicePixelRatio;
        const width = Math.floor(canvas.clientWidth * pixelRatio);
        const height = Math.floor(canvas.clientHeight * pixelRatio);
        // canvas's internal size (its resolution) is often called its 'drawingbuffer' size
        renderer.setSize(width, height, false);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      cubes.forEach((cube, idx) => {
        const speed = 0.2 + idx * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });

      renderer.render(scene, camera);

      window.requestAnimationFrame(renderWithAnimation);
    }

    window.requestAnimationFrame(renderWithAnimation);

    return () => {
      renderer.dispose();
    };
  }, []);
}

function loadColorTexture(path: string, loader: THREE.TextureLoader) {
  const texture = loader.load(path);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * @note
 * ## Memory Usage
 *
 * - textures often use the most memory
 * - in general, textures take `width * height * 4 * 1.33` bytes of memory, where
 *    - `4` is for RGBA channels
 *    - `1.33` is a rough estimate for mipmaps
 *   (see https://stackoverflow.com/a/26902843/4561887)
 * - while compression will help with download speed, it doesn't necessarily help
 *   with memory usage within app
 * - other general notes:
 *    - GPUs usually require texture data to be uncompressed
 *    - make textures small in **both** dimensions and file size
 *
 * ## JPG vs PNG
 *
 * - JPGs have **lossy compression**,
 *    - which means they are smaller in file size but may have visible artifacts
 *      especially around sharp edges
 * - PNGs have **lossless compression**
 *    - generally slower to download
 *    - but support transparency
 *    - probably appropriate for non-image data like normal maps and other kinds of non-image maps
 *
 * ## Filtering and Mips
 *
 * - **Mips** are
 *    - used by GPU when deciding on color for small objects with higher-resolution textures
 *    - copies of texture, each one half as wide and half as tall as the previous mip where
 *      the pixels have been blended to make the next smaller mip
 *    - are created until you get to a 1x1 texture
 * - in three.js, you can choose what happens both when texture is
 *   drawn larger and/or smaller than its original size
 *    - _WHEN LARGER_, set `texture.magFilter` to either `THREE.NearestFilter` or `THREE.LinearFilter`
 *      - `NearestFilter` means "pick the closest single pixel from original texture"
 *        (with low resolution texture, gives you very pixelated look like Minecraft)
 *      - `LinearFilter` means "choose the 4 pixels from texture closest to where we should
 *        be choosing a color from and blend them in the appropriate proportions relative to
 *        how far away the actual point is from each of 4 pixels"
 *    - _WHEN SMALLER_, set `texture.minFilter` to one of 6 values
 *      - `THREE.NearestFilter`:
 *          same as above, choose closest pixel in texture
 *      - `THREE.LinearFilter`:
 *          same as above, choose 4 pixels from texture and blend them
 *      - `THREE.NearestMipmapNearestFilter`:
 *          choose appropriate mip then choose one pixel
 *      - `THREE.NearestMipmapLinearFilter`:
 *          choose 2 mips, choose one pixel from each, blend those 2 pixels
 *      - `THREE.LinearMipmapNearestFilter`:
 *          choose appropriate mip then choose 4 pixels and blend them
 *      - `THREE.LinearMipmapLinearFilter`:
 *          choose 2 mips, choose 4 pixels from each and blend all 8 into 1 pixel
 *
 * ## Repeating, offsetting, rotating, wrapping a texture
 *
 * - textures have settings for repeating, offsetting, and rotation
 * - by default, textures in three.js do not repeat
 * - to set whether or not texture repeats, there are 2 properties:
 *   - `wrapS` for horizontal wrapping
 *   - `wrapT` for vertical wrapping
 * - these properties can be set to one of following:
 *   - `THREE.ClampToEdgeWrapping`
 *       the last pixel on each edge is repeated forever
 *   - `THREE.RepeatWrapping`
 *       the texture is repeated
 *   - `THREE.MirroredRepeatWrapping`
 *       the texture is mirrored and repeated
 * @example
 * ```js
 * // turn on wrapping in both directions
 * someTexture.wrapS = THREE.RepeatWrapping;
 * someTexture.wrapT = THREE.RepeatWrapping;
 *
 * // repeating is set with `repeat` property
 * const timesToRepeatHorizontally = 4;
 * const timesToRepeatVertically = 2;
 * someTexture.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically);
 *
 *
 * // offsetting is set with `offset` property
 * // - textures offset with units where 1 unit = 1 texture size
 * //   (0 = no offset, 1 = offset one full texture amount)
 * const xOffset = 0.5;  // offset by half the texture
 * const yOffset = 0.25; // offset by 1/4 the texture
 * someTexture.offset.set(xOffset, yOffset);
 *
 *
 * // rotation is set by setting `rotation` property in radians as well as the `center` property
 * // for choosing center of rotation
 * // - `center` default to `0,0` which rotates from bottom left corner
 * // - uses units in texture size so `0.5,0.5` would rotate around center of texture
 * someTexture.center.set(0.5, 0.5);
 * someTexture.rotation = THREE.MathUtils.degToRad(45);
 * ```
 */
const notes = '';
