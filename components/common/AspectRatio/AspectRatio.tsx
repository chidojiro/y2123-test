import classNames from 'classnames';
import React from 'react';
import { Children, ClassName } from 'types';

export type Ratio = '1-1' | '4-3' | '16-9' | null;

type Props = Children &
  ClassName & {
    ratio: Ratio;
  };

const AspectRatio = ({ ratio, children, className }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);

  return ratio === null ? (
    <>{children}</>
  ) : (
    <div className={classNames('aspect-ratio', 'relative w-full', className)}>
      <div
        className={classNames({ 'pt-full': ratio === '1-1', 'pt-3/4': ratio === '4-3', 'pt-9/16': ratio === '16-9' })}
        ref={ref}></div>
      <div className='absolute top-0 bottom-0 left-0 right-0'>{children}</div>
    </div>
  );
};

export default AspectRatio;
