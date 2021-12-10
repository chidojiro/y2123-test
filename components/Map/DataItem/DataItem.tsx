import React from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {
  top: number;
  left: number;
  size: number;
};

const resolveGridCoords = (top: number, left: number, size: number) => {
  return {
    gridColumn: `${top} / ${top + size}`,
    gridRow: `${left} / ${left + size}`,
  };
};

const DataItem = React.memo(({ top, left, size }: Props) => {
  return <div style={resolveGridCoords(top, left, size)} className='bg-yellow-200'></div>;
});

export default DataItem;
