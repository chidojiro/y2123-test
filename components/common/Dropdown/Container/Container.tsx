import { useOnClickOutside, VisibilityControl } from 'hooks';
import React from 'react';
import Styled from '../Dropdown.styled';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  control: VisibilityControl;
  widthFitTrigger?: boolean;
  triggerRef: React.RefObject<any>;
};

const Container = React.forwardRef<HTMLDivElement, Props>(
  ({ control, widthFitTrigger, triggerRef, ...restProps }, ref) => {
    const ownRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => ownRef.current!, []);

    useOnClickOutside([ownRef, triggerRef], () => {
      control.hide();
    });

    return <Styled.Dropdown {...restProps} ref={ownRef}></Styled.Dropdown>;
  }
);

export default Container;
