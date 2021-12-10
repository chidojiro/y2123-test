import classNames from 'classnames';
import React from 'react';
import { MapItem } from 'types';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {
  item: MapItem;
  onClick: (item: MapItem) => void;
  selected: boolean;
};

const resolveGridCoords = (item: MapItem) => {
  const { top, left, size } = item;

  return {
    gridColumn: `${left + 1} / ${left + 1 + size}`,
    gridRow: `${top + 1} / ${top + 1 + size}`,
  };
};

const DataItem = React.memo(({ item, onClick, selected }: Props) => {
  return (
    <div
      style={resolveGridCoords(item)}
      className={classNames('cursor-pointer transition-all', { 'bg-yellow-200': !selected, 'bg-blue-200': selected })}
      onClick={() => onClick(item)}></div>
  );
});

export default DataItem;
