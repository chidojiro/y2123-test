import { noop } from 'lodash';
import React from 'react';
import { Children, MapItem } from 'types';
import { v4 as UUID } from 'uuid';

const mapItems: MapItem[] = [
  { id: UUID(), username: 'User 1', propertyName: 'Item 1', left: 0, top: 1, size: 2 },
  { id: UUID(), username: 'User 2', propertyName: 'Item 2', left: 3, top: 1, size: 1 },
  { id: UUID(), username: 'User 3', propertyName: 'Item 3', left: 5, top: 1, size: 1 },
  { id: UUID(), username: 'User 4', propertyName: 'Item 4', left: 6, top: 2, size: 1 },
  { id: UUID(), username: 'User 5', propertyName: 'Item 5', left: 3, top: 3, size: 3 },
  { id: UUID(), username: 'User 6', propertyName: 'Item 6', left: 8, top: 2, size: 4 },
  { id: UUID(), username: 'User 7', propertyName: 'Item 7', left: 0, top: 6, size: 6 },
  { id: UUID(), username: 'User 8', propertyName: 'Item 8', left: 8, top: 7, size: 3 },
  { id: UUID(), username: 'User 9', propertyName: 'Item 9', left: 7, top: 6, size: 1 },
];

type MapProviderValue = {
  startDragging: (pageX: number, pageY: number) => void;
  stopDragging: () => void;
  drag: (pageX: number, pageY: number) => void;
  mapItems: MapItem[];
  moveDistance: [number, number];
  zoomLevel: number;
  selectedItem: MapItem | undefined;
  selectItem: React.Dispatch<React.SetStateAction<MapItem | undefined>>;
};

const MapContext = React.createContext<MapProviderValue>({
  startDragging: noop,
  stopDragging: noop,
  drag: noop,
  mapItems: [],
  moveDistance: [0, 0],
  zoomLevel: 100,
  selectedItem: undefined,
  selectItem: noop,
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
  const [selectedItem, setSelectedItem] = React.useState<MapItem>();

  const startDragging = React.useCallback((pageX: number, pageY: number) => {
    setDragStartCoords([pageX, pageY]);
  }, []);

  const drag = React.useCallback(
    (pageX: number, pageY: number) => {
      if (!pageX || !pageY) return;
      const [dragStartX, dragStartY] = dragStartCoords;

      setMovingDistance([pageX - dragStartX, pageY - dragStartY]);
    },
    [dragStartCoords]
  );

  const stopDragging = React.useCallback(() => {
    const [movedX, movedY] = movedDistance;
    const [movingX, movingY] = movingDistance;

    setMovingDistance([0, 0]);
    setDragStartCoords([0, 0]);
    setMovedDistance([movedX + movingX, movedY + movingY]);
  }, [movedDistance, movingDistance]);

  React.useEffect(() => {
    const wheelListener = (e: WheelEvent) => {
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
      startDragging,
      drag,
      stopDragging,
      mapItems,
      moveDistance: [movedX + movingX, movedY + movingY],
      zoomLevel,
      selectedItem,
      selectItem: setSelectedItem,
    };
  }, [drag, movedDistance, movingDistance, selectedItem, startDragging, stopDragging, zoomLevel]);

  return <MapContext.Provider value={providerValue}>{children}</MapContext.Provider>;
};

export default MapProvider;
