import React from 'react';
import Show from '../components/shownocode';
import Pie from '../components/tiles/pie';

export default () => {
  return (
    <Show
      events
      margin={{
        top: 10,
        left: 40,
        right: 30,
        bottom: 80,
      }}
      component={Pie}
      title="Pies"
    >
    </Show>
  );
};
