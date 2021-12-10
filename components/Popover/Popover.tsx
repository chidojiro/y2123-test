import classNames from 'classnames'
import React from 'react'
import { Dropdown, DropdownPlacement, DropdownProps } from '../../components'
import { useVisibilityControl, VisibilityControl, VisibilityProps } from '../../hooks'

type Props = Omit<DropdownProps, 'control'> &
  VisibilityProps & {
    trigger: React.ReactElement
    placement?: DropdownPlacement
    arrow?: boolean
    control?: VisibilityControl
  }

const Popover = ({
  trigger: triggerProp,
  placement = 'bottom-center',
  children,
  control: controlProp,
  arrow = true,
  onHide,
  onShow,
  className,
  plainBoxModel,
  ...restProps
}: Props) => {
  const [primaryAlignment, secondaryAlignment] = placement.split('-')

  const triggerRef = React.useRef<any>(null)

  const cloneElement = React.cloneElement(triggerProp, { ref: triggerRef })

  const ownControl = useVisibilityControl({ onHide, onShow })

  const control = controlProp || ownControl

  React.useLayoutEffect(() => {
    const trigger = triggerRef.current
    trigger?.addEventListener('click', control?.toggle)
    trigger?.classList.add('cursor-pointer')

    return () => {
      trigger?.removeEventListener('click', control?.show)
    }
  }, [control])

  return (
    <Dropdown
      trigger={cloneElement}
      placement={placement}
      className={classNames('overflow-visible rounded-lg', className)}
      control={control}
      {...restProps}>
      <>
        <div
          className={classNames('vs-popover__dropdown', 'relative z-10 bg-white rounded-lg', {
            'px-2 py-1': plainBoxModel
          })}>
          {children}
        </div>
        {!!arrow && (
          <div
            className={classNames(
              'vs-tooltip__dropdown-arrow',
              'absolute w-3 h-3 transform rotate-45 bg-white shadow z-0',
              {
                '-top-1.5': primaryAlignment === 'bottom',
                '-bottom-1.5': primaryAlignment === 'top',
                '-left-1.5': primaryAlignment === 'right',
                '-right-1.5': primaryAlignment === 'left',
                'left-1/2 -translate-x-1/2':
                  ['bottom', 'top'].includes(primaryAlignment) && secondaryAlignment === 'center',
                'right-7': ['bottom', 'top'].includes(primaryAlignment) && secondaryAlignment === 'right',
                'top-7': ['right', 'left'].includes(primaryAlignment) && secondaryAlignment === 'top',
                'top-1/2 -translate-y-1/2':
                  ['right', 'left'].includes(primaryAlignment) && secondaryAlignment === 'center',
                'bottom-0': ['right', 'left'].includes(primaryAlignment) && secondaryAlignment === 'bottom'
              },
              {
                'mt-4': secondaryAlignment === 'bottom',
                'mr-4': secondaryAlignment === 'left',
                '-mt-4': secondaryAlignment === 'top',
                'ml-4': secondaryAlignment === 'right'
              }
            )}></div>
        )}
      </>
    </Dropdown>
  )
}

export default Popover
