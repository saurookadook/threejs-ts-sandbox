import { forwardRef } from 'react';
import classNames from 'classnames';

import type { ReactDivProps } from '@src/types/main';
import './styles.css';

export const PictureFrame = forwardRef<HTMLDivElement, ReactDivProps>(
  function PictureFrame(props, ref) {
    const {
      children, // force formatting
      className = '',
      ...restProps
    } = props;

    return (
      <div
        ref={ref} // force formatting
        className={classNames('picture-frame', className)}
        {...restProps}
      >
        {children}

        <div className="picture-frame-side-top"></div>
        <div className="picture-frame-side-right"></div>
        <div className="picture-frame-side-bottom"></div>
        <div className="picture-frame-side-left"></div>
      </div>
    );
  },
);
