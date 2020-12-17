import React from 'react';

import {cardsType} from 'types';

const Cards = (props: propsType): JSX.Element => {
  return (
    <section>
      <h2>Card</h2>
      <div>
        {props.cards.map((card, i) => (
          <div key={i}>
            {card.prompt}{' '}
            {card.category ? <span>({card.category})</span> : null}
          </div>
        ))}
      </div>
    </section>
  );
};

type propsType = {
  cards: cardsType;
};

export default Cards;
