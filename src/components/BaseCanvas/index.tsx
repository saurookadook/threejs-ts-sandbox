import { forwardRef } from 'react';
import classNames from 'classnames';

import type { ReactCanvasProps } from '@src/types/main';
import './styles.css';

export const BaseCanvas = forwardRef<HTMLCanvasElement, ReactCanvasProps>(
  function BaseCanvas(props, ref) {
    const {
      className = '', // force formatting
      ...restProps
    } = props;

    return (
      <canvas
        ref={ref} // force formatting
        className={classNames('base-canvas', className)}
        {...restProps}
      />
    );
  },
);
