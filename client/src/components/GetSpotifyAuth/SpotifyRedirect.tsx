import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import firebase from 'firebase/app';

import {RootState} from 'rootReducer';

const SpotifyRedirect = (): JSX.Element => {
  const history = useHistory();
  useEffect(() => {
    // https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow
    // Spotify should return "code" and "state"
    const main = async (): Promise<void> => {
      if (location.search.length > 0) {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('error')) {
          // eslint-disable-next-line no-console
          console.error('show error', searchParams.get('error'));
        } else if (
          searchParams.get('state') === localStorage.getItem('authState')
        ) {
          // eslint-disable-next-line no-console
          console.log('state matches');
          try {
            const response = await fetch('/api/v1/createspotifytoken', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                code: searchParams.get('code'),
              }),
            });
            if (response.status === 200) {
              const tokens = (await response.json()) as {
                spotifyAccessToken: string;
                spotifyRefreshToken: string;
                spotifyAccessTokenExpiresIn: string;
              };
              const currentUser = firebase.auth().currentUser;
              firebase
                .database()
                .ref(`users/${currentUser?.uid}`)
                .update(
                  {
                    // spotifyAccessToken: tokens.spotifyAccessToken,
                    spotifyRefreshToken: tokens.spotifyRefreshToken,
                    // spotifyAccessTokenExpiresIn:
                    //   tokens.spotifyAccessTokenExpiresIn,
                  },
                  (error) => {
                    localStorage.removeItem('authState');
                    if (!error) {
                      // set short lived spotify token and expiry date
                      localStorage.setItem(
                        'spotifyAccessToken',
                        tokens.spotifyAccessToken
                      );
                      localStorage.setItem(
                        'spotifyAccessTokenExpiresIn',
                        tokens.spotifyAccessTokenExpiresIn
                      );
                      history.push('/test');
                    } else {
                      throw new Error(error.message);
                    }
                  }
                );
            } else {
              throw response.statusText;
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
          }
        } else {
          // eslint-disable-next-line no-console
          console.log('state error');
        }
      }
    };
    main();
  }, []);
  return <section>SpotifyRedirect</section>;
};

export default SpotifyRedirect;
