import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';
import { MapItem } from 'types';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {
  item: MapItem;
  onClick: (item: MapItem) => void;
  selected: boolean;
  zoomLevel: number;
};

const resolveGridCoords = (item: MapItem) => {
  const { top, left, size } = item;

  return {
    gridColumn: `${left + 1} / ${left + 1 + size}`,
    gridRow: `${top + 1} / ${top + 1 + size}`,
  };
};

const DataItem = React.memo(({ item, onClick, selected, zoomLevel }: Props) => {
  const { username, propertyName, left, top } = item;

  const reversedZoomLevel = 10000 / zoomLevel;

  return (
    <div
      style={resolveGridCoords(item)}
      className={classNames('cursor-pointer transition-all relative', {
        'bg-yellow-200': !selected,
        'bg-blue-200': selected,
      })}
      onClick={() => onClick(item)}>
      <div
        style={{ transform: `translateY(-100%) scale(${reversedZoomLevel}%)` }}
        className={classNames(
          'absolute -top-3 origin-bottom-left',
          'bg-white rounded cursor-default',
          'border border-solid border-gray-200 shadow-2xl',
          'w-50 h-fit overflow-hidden',
          { 'opacity-0 transition-none': !selected, 'opacity-100 transition-all ': selected }
        )}>
        <div className={classNames('px-3 py-1')}>
          <h3 className='mb-1'>{username}</h3>
          <p className='mb-1'>{propertyName}</p>
          <div className='flex items-center font-semibold'>
            <FontAwesomeIcon icon={faLocationArrow} className='w-4 h-4 mr-2' />
            <span>
              {left}, {top}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default DataItem;
