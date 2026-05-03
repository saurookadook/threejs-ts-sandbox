import { useRef } from 'react';

import { BaseCanvas, LoadingBar, PictureFrame } from '@src/components';
import { useFlowerCubeScenegraph } from './useFlowerCubeScenegraph';
import './styles.css';

export const FlowerCube = ({
  cubeSize = 1, // force formatting
  ...props
}: {
  cubeSize?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useFlowerCubeScenegraph(canvasRef, cubeSize);

  return (
    <PictureFrame id="flower-cube-frame">
      <BaseCanvas ref={canvasRef} id="flower-cube" {...props} />

      <LoadingBar />
    </PictureFrame>
  );
};
