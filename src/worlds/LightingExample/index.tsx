import { useRef } from 'react';

import type { ValueOf } from '@src/types/main';
import { BaseCanvas } from '@src/components';
import { LightingType } from '@src/constants';
import { useLightingScenegraph } from './useLightingScenegraph';

import './styles.css';

export function LightingExample({
  lightType = LightingType.AmbientLight,
  toonify = false,
  ...props
}: {
  lightType?: ValueOf<typeof LightingType>;
  toonify?: boolean;
} & React.HTMLAttributes<HTMLCanvasElement>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // const infoRef = useRef<HTMLDivElement | null>(null);

  useLightingScenegraph(canvasRef, lightType);

  return (
    <div id="lighting-example-container">
      <BaseCanvas ref={canvasRef} id="lighting-example" {...props} />
      {/* <div ref={infoRef} id="info"></div> */}
    </div>
  );
}
