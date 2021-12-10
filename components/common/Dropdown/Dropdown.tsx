import React from 'react';
import { VisibilityControl, VisibilityProps } from 'hooks';
import { AssertUtils } from 'utils';
import Container from './Container';
import classNames from 'classnames';
import ReactDOM from 'react-dom';

type VerticalAlignment = 'top' | 'bottom';
type HorizontalAlignment = 'left' | 'right';
type Alignment = VerticalAlignment | HorizontalAlignment;
type PrimaryAlignment = Alignment;
type SecondaryAlignment = Alignment | 'center';

export type Placement =
  | `${VerticalAlignment}-${HorizontalAlignment | 'center'}`
  | `${HorizontalAlignment}-${VerticalAlignment | 'center'}`;

export type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
  VisibilityProps & {
    widthFitTrigger?: boolean;
    widthFitContent?: boolean;
    trigger: React.ReactElement;
    placement: Placement | Placement[];
    control: VisibilityControl;
    plainBoxModel?: boolean;
    open?: boolean;
  };

const Dropdown = ({
  children,
  className,
  widthFitTrigger,
  widthFitContent,
  trigger,
  placement: placementProp,
  control,
  open,
  ...restProps
}: Props) => {
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle((trigger as any).ref, () => triggerRef.current);

  const clonedTrigger = React.cloneElement(trigger, { ref: triggerRef });

  const hasEnoughSpace = (alignment: Alignment, pxOffset = 0) => {
    const dropdown = dropdownRef.current;

    if (!dropdown) return false;

    const {
      top: triggerTop,
      left: triggerLeft,
      height: triggerHeight,
      width: triggerWidth,
    } = triggerRef.current!.getBoundingClientRect();

    const { height: dropdownHeight, width: dropdownWidth } = dropdown.getBoundingClientRect();

    const { clientHeight: viewHeight, clientWidth: viewWidth } = document.documentElement;

    switch (alignment) {
      case 'top':
        return triggerTop >= dropdownHeight + pxOffset;
      case 'left':
        return viewWidth >= triggerLeft + dropdownWidth + pxOffset;
      case 'bottom':
        return viewHeight >= triggerTop + triggerHeight + dropdownHeight + pxOffset;
      case 'right':
        return triggerLeft + triggerWidth >= dropdownWidth + pxOffset;
      default:
        return false;
    }
  };

  const getDropdownCoordsWithAlignOf = React.useCallback((placement: Placement) => {
    const trigger = triggerRef.current;
    const dropdown = dropdownRef.current;

    if (!trigger || !dropdown) return { top: 0, left: 0 };

    const [primaryAlignment, secondaryAlignment] = placement.split('-') as [PrimaryAlignment, SecondaryAlignment];

    const {
      top: triggerTop,
      left: triggerLeft,
      height: triggerHeight,
      width: triggerWidth,
    } = trigger.getBoundingClientRect();
    const { height: dropdownHeight, width: dropdownWidth } = dropdown.getBoundingClientRect();

    let _top = 0;
    let _left = 0;

    switch (primaryAlignment) {
      case 'top':
        _top = triggerTop - dropdownHeight;
        break;
      case 'bottom':
        _top = triggerTop + triggerHeight;
        break;
      case 'left':
        _left = triggerLeft - dropdownWidth;
        break;
      case 'right':
        _left = triggerLeft + triggerWidth;
        break;
      default:
        break;
    }

    switch (secondaryAlignment) {
      case 'top':
        _top = triggerTop;
        break;
      case 'bottom':
        _top = triggerTop + triggerHeight;
        break;
      case 'left':
        _left = triggerLeft;
        break;
      case 'right':
        _left = triggerLeft + triggerWidth - dropdownWidth;
        break;
      case 'center':
        if (['bottom', 'top'].includes(primaryAlignment)) {
          _left = triggerLeft - Math.round((dropdownWidth - triggerWidth) / 2);
        } else {
          _top = triggerTop + Math.round(triggerHeight / 2);
        }
        break;
      default:
        _left = 0;
        break;
    }

    return { top: _top, left: _left };
  }, []);

  const [placement, setPlacement] = React.useState(
    AssertUtils.isArray(placementProp) ? placementProp[0] : placementProp
  );
  const positionDropdown = React.useCallback(() => {
    let _placement: Placement;

    // find the most suitable placement
    // first come, first serve
    if (AssertUtils.isArray<Placement>(placementProp)) {
      placementProp.forEach(value => {
        if (_placement) return;

        const [primaryAlignment, secondaryAlignment] = value.split('-') as [PrimaryAlignment, SecondaryAlignment];

        if (!hasEnoughSpace(primaryAlignment)) return;
        if (secondaryAlignment !== 'center' && !hasEnoughSpace(secondaryAlignment)) return;

        _placement = value;
      });

      _placement = _placement! || placementProp[0];
    } else {
      _placement = placementProp;
    }

    const dropdown = dropdownRef.current;
    const trigger = triggerRef.current;

    if (!dropdown || !trigger) return;

    const dropdownCoords = getDropdownCoordsWithAlignOf(_placement);

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

    dropdown?.style.setProperty('left', dropdownCoords.left + 'px');
    dropdown?.style.setProperty('top', dropdownCoords.top + scrollTop + 'px');

    setPlacement(_placement);
  }, [getDropdownCoordsWithAlignOf, placementProp]);

  const isOpen = open || control.visible;

  React.useLayoutEffect(() => {
    if (isOpen) {
      positionDropdown();
    }
  }, [positionDropdown, isOpen]);

  React.useEffect(() => {
    window.addEventListener('resize', positionDropdown);

    return () => {
      window.removeEventListener('resize', positionDropdown);
    };
  }, [positionDropdown]);

  React.useLayoutEffect(() => {
    const dropdown = dropdownRef.current;
    const trigger = triggerRef.current;

    if (!trigger) return;

    const { width: selectContainerWidth } = trigger?.getBoundingClientRect() as DOMRect;

    if (widthFitTrigger) {
      dropdown?.style.setProperty('width', selectContainerWidth + 'px');
    } else if (widthFitContent) {
      dropdown?.style.setProperty('width', 'fit-content');
    } else {
      dropdown?.style.setProperty('min-width', selectContainerWidth + 'px');
    }
  }, [triggerRef, widthFitContent, widthFitTrigger]);

  const [primaryAlignment] = placement.split('-') as [PrimaryAlignment, SecondaryAlignment];

  return (
    <>
      {clonedTrigger}
      {!!isOpen &&
        ReactDOM.createPortal(
          <Container
            triggerRef={triggerRef}
            control={control}
            className={classNames(
              'vs-dropdown rounded absolute overflow-auto',
              {
                'mt-4': primaryAlignment === 'bottom',
                'mr-4': primaryAlignment === 'left',
                '-mt-4': primaryAlignment === 'top',
                'ml-4': primaryAlignment === 'right',
              },
              className
            )}
            {...restProps}
            ref={dropdownRef}>
            {children}
          </Container>,
          document.body
        )}
    </>
  );
};

export default Dropdown;
