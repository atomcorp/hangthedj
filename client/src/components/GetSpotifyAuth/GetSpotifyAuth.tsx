import React from 'react';

const GetSpotifyAuth = (): JSX.Element => {
  return (
    <section>
      <div>GetSpotifyAuth</div>
      <div>
        <button
          onClick={() => {
            fetch('/api/v1/test')
              .then((res) => {
                if (res && res.body) {
                  return res.text();
                }
              })
              .then((res) => {
                console.log(res);
              });
          }}
        >
          Get Auth
        </button>
      </div>
    </section>
  );
};

export default GetSpotifyAuth;
