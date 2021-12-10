import classNames from 'classnames';
import { useMapContext } from 'providers';
import React from 'react';
import { MapItem } from 'types';
import DataItem from './DataItem';
import Tile from './Tile';

// eslint-disable-next-line @typescript-eslint/ban-types

const MAP_Y = 12;
const MAP_X = 12;

const Map = () => {
  const {
    startDragging,
    stopDragging,
    drag,
    mapItems,
    moveDistance,
    zoomLevel,
    selectItem,
    selectedItem,
    openSidebar,
  } = useMapContext();

  const handleDragStart: React.DragEventHandler<HTMLDivElement> = e => {
    startDragging(e.pageX, e.pageY);

    // prevent drag preview
    const img = document.createElement('img');
    img.src = '';
    e.dataTransfer.setDragImage(img, -99999, -99999);
  };

  const handleDrag: React.DragEventHandler<HTMLDivElement> = ({ pageX, pageY }) => {
    drag(pageX, pageY);
  };

  const handleDragEnd: React.DragEventHandler<HTMLDivElement> = () => {
    stopDragging();
  };

  const handleItemClick = React.useCallback(
    (item: MapItem) => {
      openSidebar();
      selectItem(item);
    },
    [openSidebar, selectItem]
  );

  return (
    <div
      className='relative transform scale-100'
      draggable
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      style={{ transform: `translate(${moveDistance[0]}px, ${moveDistance[1]}px) scale(${zoomLevel}%)` }}>
      <div className='w-full h-full grid grid-cols-12 grid-rows-12 gap-1'>
        {new Array(MAP_X * MAP_Y).fill(null).map((_, idx) => (
          <Tile key={idx}></Tile>
        ))}
      </div>
      <div className={classNames('w-full h-full', 'grid grid-cols-12 grid-rows-12 gap-1', 'absolute top-0 left-0')}>
        {mapItems.map(item => (
          <DataItem key={item.id} item={item} onClick={handleItemClick} selected={selectedItem?.id === item.id} />
        ))}
      </div>
    </div>
  );
};

export default Map;
