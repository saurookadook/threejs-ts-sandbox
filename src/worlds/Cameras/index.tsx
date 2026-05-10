import { useRef } from 'react';

import type { ValueOf } from '@src/types/main';
import { BaseCanvas } from '@src/components';
import { CameraType, LightType } from '@src/constants';
import { useCamerasScenegraph } from './useCamerasScenegraph';

import './styles.css';

/**
 * @description
 * Displays split screen where on the left you can see the original view and on the right you
 * can see a view showing the frustum of the camera on the left. As you adjust `near`, `far`,
 * `fov` and move the camera with the mouse, you can see that only what's inside the frustum
 * shown on the right appears in the scene on the left.
 *
 * Adjust `near` up to around `20` and you'll easily see the front of objects disappear as they
 * are no longer in the frustum. Adjust `far` below about `35` and you'll start to see the
 * ground plane disappear as it's no longer in the frustum.
 *
 * Q: Why not just set `near` to `0.0000000001` and `far` to `10000000000000` or something like
 * that so you can just see everything?
 * A: The reason is your GPU only has so much precision to decide if something is in front or
 * behind something else. That precision is spread out between `near` and `far`. Worse,
 * by default the precision close the camera is detailed and the precision far from the camera
 * is coarse. The units start with `near` and slowly expand as they approach `far`.
 *
 * Q: What values should be used for `near` and `far`?
 * A: In general:
 * - Set near as far away from the camera as you can and not have things disappear.
 * - Set far as close to the camera as you can and not have things disappear.
 * If you're trying to draw a giant scene and show a close up of someone's face so you can see
 * their eyelashes while in the background you can see all the way to mountains 50 km in the
 * distance, then you'll need to find other creative solutions
 *
 * @note
 * ## OrthographicCamera
 *
 * See more at {@link https://threejs.org/manual/#en/cameras | Cameras}
 *
 * - most often useful for drawing 2D things
 * - you'd decide how many units you want camera to show
 *
 * @example
 * ```js
 * const camera = new THREE.OrthographicCamera()
 * // to put origin at center and have 1 pixel = 1 three.js unit
 * camera.left = -canvas.width / 2;
 * camera.right canvas.width / 2;
 * camera.top = canvas.height / 2;
 * camera.bottom = -canvas.height / 2;
 * camera.near = -1;
 * camera.far = 1;
 * camera.zoom = 1;
 *
 * // or if we wanted origin to be in top left just like a 2D canvas
 * camera.left = 0;
 * camera.right canvas.width;
 * camera.top = 0;
 * camera.bottom = canvas.height;
 * camera.near = -1;
 * camera.far = 1;
 * camera.zoom = 1;
 * ```
 *
 */
export function Cameras({
  cameraType = CameraType.PerspectiveCamera,
  lightType = LightType.DirectionalLight,
  toonify = false,
  ...props
}: {
  cameraType?: ValueOf<typeof CameraType>;
  lightType?: ValueOf<typeof LightType>;
  toonify?: boolean;
} & React.HTMLAttributes<HTMLCanvasElement>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const view1Ref = useRef<HTMLDivElement>(null);
  const view2Ref = useRef<HTMLDivElement>(null);

  useCamerasScenegraph(canvasRef, [view1Ref, view2Ref], { cameraType, lightType });

  return (
    <div id="cameras-container">
      <BaseCanvas ref={canvasRef} id="cameras" {...props} />

      <div className="split">
        {/*
          Two cameras
          - one shows scene from above
          - other shows another camera looking at the scene the first camera is drawing and
            showing that camera's frustum
        */}
        <div ref={view1Ref} id="view1" tabIndex={1}></div>
        <div ref={view2Ref} id="view2" tabIndex={2}></div>
      </div>
    </div>
  );
}
