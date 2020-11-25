import React, {useReducer} from 'react';
import immer from 'immer';

import player from 'spotifyInterface';

const initialState = {
  searchTerm: '',
  playlists: [],
  artists: [],
  tracks: [],
  view: 'search',
  playlistResults: null,
  artistResults: null,
  isDirty: false,
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
        draft.isDirty = true;
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

type TracksProps = {
  tracks: trackType[] | undefined;
  handlePick: () => void;
};

const Tracks = (props: TracksProps): JSX.Element => (
  <div style={{maxHeight: '300px', overflow: 'auto'}}>
    <table>
      <tbody>
        {props.tracks?.map((track, i) => (
          <tr
            key={track.id}
            onClick={() => {
              player.play(track.id);
              props.handlePick();
            }}
          >
            <td>
              <strong>
                {track.artists.map((artist, i) =>
                  i === 0 ? (
                    <span key={i}>{artist.name}</span>
                  ) : (
                    <span key={i}>, {artist.name}</span>
                  )
                )}
              </strong>{' '}
              - {track.name}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

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
          <br />
          <Tracks
            tracks={state.playlistResults?.tracks}
            handlePick={props.handlePick}
          />
        </section>
      )}
      {state.view === 'search' && (
        <form
          style={{display: 'flex'}}
          onSubmit={(e) => {
            e.preventDefault();
            if (player.token != null) {
              fetch(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                  state.searchTerm
                )}&type=album,track,playlist,artist&limit=10`,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${player.token}`,
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
                        .splice(0, 10)
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
            style={{width: '100%'}}
            size={10}
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
      {state.view === 'search' && state.isDirty && (
        <section>
          <div>
            <h3>Tracks:</h3>
            <Tracks tracks={state.tracks} handlePick={props.handlePick} />
            {state.tracks.length === 0 && 'No tracks'}
          </div>
          <div>
            <h3>Playlists:</h3>
            <table>
              <tbody>
                {state.playlists.map((playlist, i) => (
                  <tr
                    onClick={() => {
                      fetch(
                        `https://api.spotify.com/v1/playlists/${playlist.id}`,
                        {
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${player.token}`,
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
                    <td>{playlist.name} →</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {state.playlists.length === 0 && 'No playlists'}
          </div>
          {/* <div>
            <div>Artists:</div>
            <ul>
              {state.artists.map((artist, i) => (
                <li key={i}>{artist.name}</li>
              ))}
            </ul>
            {state.artists.length === 0 && 'No artists'}
          </div> */}
        </section>
      )}
    </section>
  );
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
  isDirty: boolean;
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

type propsType = {
  handlePick: () => void;
};

export default Search;
