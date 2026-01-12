import { useRef } from 'react';

import { BaseCanvas } from '@src/components';
import { useTankScenegraph } from './useTankScenegraph';
import { useTankExampleScenegraph } from './useTankExampleScenegraph';

import './styles.css';

export function SemiComplexTank({ toonify = false, ...props }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);

  useTankScenegraph(canvasRef, infoRef, toonify);
  // useTankExampleScenegraph(canvasRef, infoRef);

  return (
    <div id="semi-complex-tank-container">
      <BaseCanvas ref={canvasRef} id="semi-complex-tank" {...props} />
      <div ref={infoRef} id="info"></div>
    </div>
  );
}
