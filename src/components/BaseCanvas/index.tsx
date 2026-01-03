import { forwardRef } from 'react';
import classNames from 'classnames';

import type { ReactCanvasProps } from '@src/types/main';
import { PictureFrame } from '../PictureFrame';
import './styles.css';

export const BaseCanvas = forwardRef<HTMLCanvasElement, ReactCanvasProps>(
  function BaseCanvas(props, ref) {
    const {
      className = '', // force formatting
      ...restProps
    } = props;

    return (
      <PictureFrame>
        <canvas
          ref={ref}
          className={classNames('base-canvas', className)}
          {...restProps}
        />
      </PictureFrame>
    );
  },
);
