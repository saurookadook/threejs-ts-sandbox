import { useRef } from 'react';

import { BaseCanvas } from '@src/components';
import { useCubeScenegraph } from './useCubeScenegraph';
import './styles.css';

export const Cube = ({
  cubeSize = 1, // force formatting
  ...props
}: {
  cubeSize?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useCubeScenegraph(canvasRef, cubeSize);

  return <BaseCanvas ref={canvasRef} id="cube" {...props} />;
};
