import { useMapContext } from 'providers';
import React from 'react';
import { MapItem } from 'types/map';
import DataItem from './DataItem';
import Tile from './Tile';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = { data: MapItem[] };

const MAP_Y = 12;
const MAP_X = 12;

const resolveMoveTransformation = (
  movedDistance: [number, number],
  movingDistance: [number, number],
  zoomLevel: number
) => {
  const [movedX, movedY] = movedDistance;
  const [movingX, movingY] = movingDistance;

  return {
    transform: `translate(${movedX + movingX}px, ${movedY + movingY}px) scale(${zoomLevel}%)`,
  };
};

const Map = ({ data }: Props) => {
  const { handleDrag, handleDragEnd, handleDragStart, transform } = useMapContext();

  return (
    <div
      className='w-screen relative transform scale-100'
      draggable
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      style={{ transform }}>
      <div className='w-full h-full grid grid-cols-12 grid-rows-12 gap-1'>
        {new Array(MAP_X * MAP_Y).fill(null).map((_, idx) => (
          <Tile key={idx}></Tile>
        ))}
      </div>
      <div className='w-full h-full grid grid-cols-12 grid-rows-12 gap-1 absolute top-0 left-0'>
        {data.map(({ id, size, top, left }) => (
          <DataItem key={id} top={top} left={left} size={size} />
        ))}
      </div>
    </div>
  );
};

export default Map;
