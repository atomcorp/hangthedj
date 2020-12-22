import React from 'react';
import firebase from 'firebase/app';
import {useSelector} from 'react-redux';

import {RootState} from 'rootReducer';

const Play = (): JSX.Element => {
  const name = useSelector((state: RootState) => state.user.profilename);
  const uid = useSelector((state: RootState) => state.user.uid);
  return (
    <section>
      Play
      <div>
        <h3>
          Hello {name} - {uid}
        </h3>
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
};

export default Play;
