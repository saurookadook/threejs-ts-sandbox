import { useRef } from 'react';

import { BaseCanvas, PictureFrame } from '@src/components';
import { usePrimitivesScenegraph } from './usePrimitivesScenegraph';
import './styles.css';

export const Primitives = ({
  cubeSize = 1, // force formatting
  ...props
}: {
  cubeSize?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  usePrimitivesScenegraph(canvasRef, cubeSize);

  return (
    <PictureFrame id="primitives-frame">
      <BaseCanvas ref={canvasRef} id="primitives" {...props} />
    </PictureFrame>
  );
};
