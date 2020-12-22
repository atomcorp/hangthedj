import React, {useEffect} from 'react';

import {redirectURI} from 'components/GetSpotifyAuth/GetSpotifyAuth';

const SpotifyRedirect = (): JSX.Element => {
  useEffect(() => {
    // https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow
    // Spotify should return "code" and "state"
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
        fetch('/api/v1/getspotifytoken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: searchParams.get('code'),
            redirectURI,
          }),
        });
      } else {
        // eslint-disable-next-line no-console
        console.log('state error');
      }
    }
  }, []);
  return <section>SpotifyRedirect</section>;
};

export default SpotifyRedirect;
