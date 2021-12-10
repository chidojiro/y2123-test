import { noop } from 'lodash';
import React from 'react';
import { Children } from 'types';

type MapProviderValue = {
  handleDragStart: React.DragEventHandler<HTMLDivElement>;
  handleDragEnd: React.DragEventHandler<HTMLDivElement>;
  handleDrag: React.DragEventHandler<HTMLDivElement>;
  transform: string;
};

const MapContext = React.createContext<MapProviderValue>({
  handleDrag: noop,
  handleDragEnd: noop,
  handleDragStart: noop,
  transform: '',
});

export const useMapContext = () => React.useContext(MapContext);

const MAX_ZOOM_LEVEL = 275;
const MIN_ZOOM_LEVEL = 5;
const ZOOM_STEP = 5;

type Props = Children;

const MapProvider = ({ children }: Props) => {
  const [movedDistance, setMovedDistance] = React.useState<[number, number]>([0, 0]);
  const [movingDistance, setMovingDistance] = React.useState<[number, number]>([0, 0]);
  const [dragStartCoords, setDragStartCoords] = React.useState([0, 0]);
  const [zoomLevel, setZoomLevel] = React.useState(100);

  const handleDragStart: React.DragEventHandler<HTMLDivElement> = React.useCallback(e => {
    setDragStartCoords([e.pageX, e.pageY]);

    // prevent drag preview
    const img = document.createElement('img');
    img.src = '';
    e.dataTransfer.setDragImage(img, -99999, -99999);
  }, []);

  const handleDrag: React.DragEventHandler<HTMLDivElement> = React.useCallback(
    ({ pageX, pageY }) => {
      if (!pageX || !pageY) return;
      const [dragStartX, dragStartY] = dragStartCoords;

      setMovingDistance([pageX - dragStartX, pageY - dragStartY]);
    },
    [dragStartCoords]
  );

  const handleDragEnd: React.DragEventHandler<HTMLDivElement> = React.useCallback(() => {
    const [movedX, movedY] = movedDistance;
    const [movingX, movingY] = movingDistance;

    setMovingDistance([0, 0]);
    setDragStartCoords([0, 0]);
    setMovedDistance([movedX + movingX, movedY + movingY]);
  }, [movedDistance, movingDistance]);

  React.useEffect(() => {
    const wheelListener = (e: any) => {
      const isZoomIn = e.deltaY < 0;
      setZoomLevel(prev =>
        isZoomIn ? Math.min(prev + ZOOM_STEP, MAX_ZOOM_LEVEL) : Math.max(prev - ZOOM_STEP, MIN_ZOOM_LEVEL)
      );
    };

    document.addEventListener('wheel', wheelListener);

    return () => {
      document.removeEventListener('wheel', wheelListener);
    };
  }, []);

  const providerValue = React.useMemo<MapProviderValue>(() => {
    const [movedX, movedY] = movedDistance;
    const [movingX, movingY] = movingDistance;

    return {
      handleDragStart,
      handleDrag,
      handleDragEnd,
      transform: `translate(${movedX + movingX}px, ${movedY + movingY}px) scale(${zoomLevel}%)`,
    };
  }, [handleDrag, handleDragEnd, handleDragStart, movedDistance, movingDistance, zoomLevel]);

  return <MapContext.Provider value={providerValue}>{children}</MapContext.Provider>;
};

export default MapProvider;
