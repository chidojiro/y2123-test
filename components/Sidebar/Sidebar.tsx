import { faLocationArrow, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useOnClickOutside } from 'hooks';
import { useMapContext } from 'providers';
import React from 'react';

const Sidebar = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { selectItem, selectedItem } = useMapContext();

  const closeSidebar = () => selectItem(undefined);

  useOnClickOutside(ref, () => {
    selectItem(prev => {
      if (selectedItem && prev?.id === selectedItem.id) {
        return undefined;
      }

      return prev;
    });
  });

  const { left, propertyName, size, top } = selectedItem || {};

  return (
    <div
      ref={ref}
      className={classNames('fixed top-0 right-0 z-10 shadow-2xl bg-indigo-100', 'h-screen', {
        'w-0 transition-none': !selectedItem,
        'w-96 transition-all': selectedItem,
      })}>
      <div className='p-5'>
        <h2 className='flex items-center justify-between mb-8'>
          {propertyName}
          <FontAwesomeIcon
            icon={faTimes}
            className='w-6 h-6 mr-2 text-gray-600 cursor-pointer'
            onClick={closeSidebar}
          />
        </h2>
        <label>Location</label>
        <div className='mb-4'>
          <div className='flex items-center text-green-600 !text-sm'>
            <FontAwesomeIcon icon={faLocationArrow} className='w-4 h-4 mr-2' />
            {left}, {top}
          </div>
        </div>
        <div>
          <label>Size</label>
          <p>
            <span className='mr-2 text-xl font-semibold text-red-500'>
              {size}x{size}
            </span>
            <span>({size && size * size} parcels)</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
