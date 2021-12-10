import classNames from 'classnames';
import React from 'react';
import { Dropdown, DropdownPlacement, DropdownProps } from 'components';
import { useVisibilityControl, VisibilityControl, VisibilityProps } from 'hooks';

type Props = Omit<DropdownProps, 'control'> &
  VisibilityProps & {
    trigger: React.ReactElement;
    placement?: DropdownPlacement;
    control?: VisibilityControl;
    open?: boolean;
  };

const Popover = ({
  trigger: triggerProp,
  placement = 'bottom-center',
  children,
  control: controlProp,
  onHide,
  onShow,
  className,
  plainBoxModel,
  open,
  ...restProps
}: Props) => {
  const triggerRef = React.useRef<any>(null);

  const cloneElement = React.cloneElement(triggerProp, { ref: triggerRef });

  const ownControl = useVisibilityControl({ onHide, onShow });

  const control = controlProp || ownControl;

  React.useLayoutEffect(() => {
    const trigger = triggerRef.current;
    trigger?.addEventListener('click', control?.toggle);
    trigger?.classList.add('cursor-pointer');

    return () => {
      trigger?.removeEventListener('click', control?.show);
    };
  }, [control]);

  return (
    <Dropdown
      trigger={cloneElement}
      placement={placement}
      className={classNames('overflow-visible rounded-lg', className)}
      control={control}
      open={open}
      {...restProps}>
      <>
        <div
          className={classNames('vs-popover__dropdown', 'relative z-10 bg-white rounded-lg', {
            'px-2 py-1': plainBoxModel,
          })}>
          {children}
        </div>
      </>
    </Dropdown>
  );
};

export default Popover;
