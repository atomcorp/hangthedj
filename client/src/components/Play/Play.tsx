import React from 'react';
import firebase from 'firebase/app';

const Play = (): JSX.Element => (
  <section>
    Play
    <div>
      <h3>Hello Name</h3>
      <button
        type="button"
        onClick={() => {
          firebase.auth().signOut();
        }}
      >
        Sign Out
      </button>
    </div>
  </section>
);

export default Play;
