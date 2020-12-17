import React from 'react';
import Search from 'components/Search/Search';

const Picker = (props: propsType): JSX.Element => {
  return (
    <section>
      <Search handlePick={props.handlePick} />
    </section>
  );
};

type propsType = {
  handlePick: () => void;
};

export default Picker;
