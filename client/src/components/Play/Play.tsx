import React from 'react';
import {useSelector} from 'react-redux';

import {RootState} from 'rootReducer';
import PlayTest from 'components/GetSpotifyAuth/PlayTest';
import {signOut} from 'firebaseActions';

const Play = (): JSX.Element => {
  const name = useSelector((state: RootState) => state.user.profilename);
  return (
    <section>
      Play
      <div>
        <h3>Hello &quot;{name}&quot;</h3>
        <PlayTest />
        <button
          type="button"
          onClick={() => {
            signOut();
          }}
        >
          Sign Out
        </button>
      </div>
    </section>
  );
};

export default Play;
