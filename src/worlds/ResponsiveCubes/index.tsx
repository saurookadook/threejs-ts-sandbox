import { useRef } from 'react';

import { BaseCanvas, PictureFrame } from '@src/components';
import { useCubeScenegraph } from './useCubeScenegraph';
import './styles.css';

export const ResponsiveCubes = ({
  cubeSize = 1, // force formatting
  ...props
}: {
  cubeSize?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useCubeScenegraph(canvasRef, cubeSize);

  return (
    <PictureFrame id="responsive-cubes-frame">
      <BaseCanvas ref={canvasRef} id="responsive-cube" {...props} />
    </PictureFrame>
  );
};
