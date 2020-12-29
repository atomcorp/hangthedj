import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';

import {RootState} from 'rootReducer';

const SpotifyRedirect = (): JSX.Element => {
  const uid = useSelector((state: RootState) => state.user.uid);
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
            const getspotifytoken = await fetch('/api/v1/getspotifytoken', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                code: searchParams.get('code'),
                uid,
              }),
            });
            // TODO: this should just get a 200 and then update a hasSpotify prop in User
            const response = (await getspotifytoken.json()) as {
              status: number;
              error?: string;
            };
            if (response.status === 200) {
              // eslint-disable-next-line no-console
              history.push('/test');
            } else {
              throw response.error;
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
  }, [uid]);
  return <section>SpotifyRedirect</section>;
};

export default SpotifyRedirect;
