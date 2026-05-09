import { useRef } from 'react';

import type { ValueOf } from '@src/types/main';
import { BaseCanvas } from '@src/components';
import { LightType } from '@src/constants';
import { useLightsScenegraph } from './useLightsScenegraph';

import './styles.css';

export function Lights({
  lightType = LightType.AmbientLight,
  toonify = false,
  ...props
}: {
  lightType?: ValueOf<typeof LightType>;
  toonify?: boolean;
} & React.HTMLAttributes<HTMLCanvasElement>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // const infoRef = useRef<HTMLDivElement | null>(null);

  useLightsScenegraph(canvasRef, lightType);

  return (
    <div id="lights-container">
      <BaseCanvas ref={canvasRef} id="lights" {...props} />
      {/* <div ref={infoRef} id="info"></div> */}
    </div>
  );
}
