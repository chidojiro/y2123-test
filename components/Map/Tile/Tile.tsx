import React from 'react';
import { AspectRatio } from 'components';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

const Tile = React.memo(({}: Props) => {
  return <AspectRatio ratio='1-1' className='bg-gray-200 col-span-1'></AspectRatio>;
});

export default Tile;
