import React from 'react';

const View = (props: propsType): JSX.Element => {
  return <section>{props.view === 'start' && 'props.start'}</section>;
};

type propsType = {
  view: 'start' | 'inplay' | 'end';
};

export default View;
