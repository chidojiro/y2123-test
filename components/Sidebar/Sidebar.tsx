import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useOnClickOutside } from 'hooks';
import { useMapContext } from 'providers';
import React from 'react';

const Sidebar = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { selectItem, selectedItem, isSidebarOpen, closeSidebar } = useMapContext();

  useOnClickOutside(ref, () => {
    selectItem(prev => {
      if (selectedItem && prev?.id === selectedItem.id) {
        closeSidebar();
      }

      return prev;
    });
  });

  const { left, propertyName, size, top } = selectedItem || {};

  return (
    <div
      ref={ref}
      className={classNames('fixed top-0 right-0 z-10 transition-all shadow-2xl bg-indigo-100', 'h-screen', {
        'w-0': !isSidebarOpen,
        'w-96': isSidebarOpen,
      })}>
      <div className='p-5'>
        <h2 className='mb-8'>{propertyName}</h2>
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
            <span className='font-semibold text-xl text-red-500 mr-2'>
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
