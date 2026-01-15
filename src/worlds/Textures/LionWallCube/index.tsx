import { useRef } from 'react';

import { BaseCanvas, PictureFrame } from '@src/components';
import { useLionCubeScenegraph } from './useLionCubeScenegraph';
import './styles.css';

export const LionWallCube = ({
  cubeSize = 1, // force formatting
  ...props
}: {
  cubeSize?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLionCubeScenegraph(canvasRef, cubeSize);

  return (
    <PictureFrame id="lion-wall-cube-frame">
      <BaseCanvas ref={canvasRef} id="lion-wall-cube" {...props} />
    </PictureFrame>
  );
};
