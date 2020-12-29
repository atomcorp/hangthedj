import React from 'react';
import firebase from 'firebase/app';
import {useSelector} from 'react-redux';

import {RootState} from 'rootReducer';
import PlayTest from 'components/GetSpotifyAuth/PlayTest';

const Play = (): JSX.Element => {
  const name = useSelector((state: RootState) => state.user.profilename);
  const uid = useSelector((state: RootState) => state.user.uid);
  const user = useSelector((state: RootState) => state.user);
  console.log(user);
  return (
    <section>
      Play
      <div>
        <h3>
          Hello {name} - {uid}
        </h3>
        <PlayTest />
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
