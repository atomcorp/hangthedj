import React, {useReducer} from 'react';

import immer from 'immer';

const initialState = {
  searchTerm: '',
  playlists: [],
  artists: [],
  tracks: [],
  view: 'search',
  playlistResults: null,
  artistResults: null,
};

const reducer = (state: stateType, action: actionTypes): stateType => {
  return immer(state, (draft) => {
    switch (action.type) {
      case 'search/set':
        draft.searchTerm = action.payload;
        break;
      case 'search/results':
        draft.playlists = action.payload.playlists;
        draft.artists = action.payload.artists;
        draft.tracks = action.payload.tracks;
        break;
      case 'playlist/set':
        draft.playlistResults = action.payload;
        draft.view = 'playlist';
        break;
      case 'view/reset':
        draft.view = 'search';
        draft.playlistResults = null;
        break;
      default:
        break;
    }
  });
};

const Search = (props: propsType): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <section>
      {state.view === 'playlist' && (
        <section>
          <div
            onClick={() => {
              dispatch({type: 'view/reset'});
            }}
          >
            ← {state.playlistResults?.name}
          </div>
          <ul>
            {state.playlistResults?.tracks.map((track, i) => (
              <li key={i}>
                {track.artists.map((artist) => (
                  <span key={i}>{artist.name}</span>
                ))}{' '}
                - {track.name}
              </li>
            ))}
          </ul>
        </section>
      )}
      {state.view === 'search' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (props.token != null) {
              fetch(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                  state.searchTerm
                )}&type=album,track,playlist,artist&limit=10`,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${props.token}`,
                  },
                }
              )
                .then((res) => res.json())
                .then((res) => {
                  const spotifyResults = res as spotifyResultsType;
                  dispatch({
                    type: 'search/results',
                    payload: {
                      playlists: spotifyResults.playlists.items
                        .splice(0, 5)
                        .map((playlist) => ({
                          id: playlist.id,
                          name: playlist.name,
                        })),
                      artists: spotifyResults.artists.items
                        .splice(0, 3)
                        .map((artist) => ({
                          id: artist.id,
                          name: artist.name,
                        })),
                      tracks: spotifyResults.tracks.items.map((track) => ({
                        id: track.id,
                        name: track.name,
                        artists: track.artists.map((artist) => ({
                          name: artist.name,
                          id: artist.id,
                        })),
                      })),
                    },
                  });
                })
                .catch((res) => {
                  console.error(res);
                });
            }
          }}
        >
          <input
            value={state.searchTerm}
            onChange={(e) => {
              if (e.target != null) {
                dispatch({type: 'search/set', payload: e.target.value});
              }
            }}
          />
          <button>Search</button>
        </form>
      )}
      {state.view === 'search' && (
        <section>
          <div>
            <div>Tracks:</div>
            <ul>
              {state.tracks.map((track, i) => (
                <li key={i}>
                  {track.artists.map((artist) => (
                    <span key={i}>{artist.name}</span>
                  ))}{' '}
                  - {track.name}
                </li>
              ))}
            </ul>
            {state.tracks.length === 0 && 'No tracks'}
          </div>
          <div>
            <div>Playlists:</div>
            <ul>
              {state.playlists.map((playlist, i) => (
                <li
                  onClick={() => {
                    fetch(
                      `https://api.spotify.com/v1/playlists/${playlist.id}`,
                      {
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${props.token}`,
                        },
                      }
                    )
                      .then((res) => res.json())
                      .then((res) => {
                        const playlistResults = res as playlistResultsType;
                        dispatch({
                          type: 'playlist/set',
                          payload: {
                            name: playlistResults.name,
                            tracks: playlistResults.tracks.items.map(
                              (item) => ({
                                id: item.track.id,
                                name: item.track.name,
                                artists: item.track.artists.map((artist) => ({
                                  name: artist.name,
                                  id: artist.id,
                                })),
                              })
                            ),
                          },
                        });
                      });
                  }}
                  key={i}
                >
                  {playlist.name}
                </li>
              ))}
            </ul>
            {state.playlists.length === 0 && 'No playlists'}
          </div>
          <div>
            <div>Artists:</div>
            <ul>
              {state.artists.map((artist, i) => (
                <li key={i}>{artist.name}</li>
              ))}
            </ul>
            {state.artists.length === 0 && 'No artists'}
          </div>
        </section>
      )}
    </section>
  );
};

type propsType = {
  token: string | null;
};

type playlistType = {
  name: string;
  id: string;
};

type artistType = {
  name: string;
  id: string;
};

type trackType = {
  name: string;
  id: string;
  artists: artistType[];
};

type stateType = {
  searchTerm: string;
  playlists: playlistType[];
  artists: artistType[];
  tracks: trackType[];
  view: string; // 'search' | 'playlist' | 'artist';
  playlistResults: null | {
    tracks: trackType[];
    name: string;
  };
  artistResults: null | {
    tracks: trackType[];
    name: string;
  };
};

type actionTypes =
  | {
      type: 'search/set';
      payload: string;
    }
  | {
      type: 'search/results';
      payload: {
        playlists: playlistType[];
        artists: artistType[];
        tracks: trackType[];
      };
    }
  | {
      type: 'playlist/set';
      payload: {
        tracks: trackType[];
        name: string;
      };
    }
  | {
      type: 'artist/set';
      payload: {
        tracks: trackType[];
        name: string;
      };
    }
  | {
      type: 'view/reset';
    };

type spotifyResultsType = {
  playlists: {
    items: {
      name: string;
      id: string;
    }[];
  };
  artists: {
    items: {
      name: string;
      id: string;
    }[];
  };
  tracks: {
    items: {
      name: string;
      id: string;
      artists: {name: string; id: string}[];
    }[];
  };
};

type playlistResultsType = {
  name: string;
  tracks: {
    items: {
      track: {
        name: string;
        id: string;
        artists: {name: string; id: string}[];
      };
    }[];
  };
};

export default Search;
