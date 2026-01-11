import { useRef } from 'react';

import { BaseCanvas } from '@src/components';
import { useSolarSystemScenegraph } from './useSolarSystemScenegraph';

export function SolarSystem({ ...props }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useSolarSystemScenegraph(canvasRef);

  return <BaseCanvas ref={canvasRef} id="solar-system" {...props} />;
}
