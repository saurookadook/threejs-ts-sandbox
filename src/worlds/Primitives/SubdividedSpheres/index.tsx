import { useRef } from 'react';

import { BaseCanvas } from '@src/components';
import { useSubdividedSpheresScenegraph } from './useSubdividedSpheresScenegraph';

export function SubdividedSpheres({
  radius = 7,
  firstSphereWidthSegments = 5,
  firstSphereHeightSegments = 3,
  secondSphereWidthSegments = 24,
  secondSphereHeightSegments = 10,
  thirdSphereWidthSegments = 50,
  thirdSphereHeightSegments = 50,
  ...props
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useSubdividedSpheresScenegraph(canvasRef, {
    radius,
    firstSphere: {
      widthSegments: firstSphereWidthSegments,
      heightSegments: firstSphereHeightSegments,
    },
    secondSphere: {
      widthSegments: secondSphereWidthSegments,
      heightSegments: secondSphereHeightSegments,
    },
    thirdSphere: {
      widthSegments: thirdSphereWidthSegments,
      heightSegments: thirdSphereHeightSegments,
    },
  });

  return <BaseCanvas ref={canvasRef} id="subdivided-spheres" {...props} />;
}
