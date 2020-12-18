import React, {useReducer} from 'react';
import immer from 'immer';
import firebase from 'firebase/app';

type StateType = {
  email: string;
  password: string;
  isLoading: boolean;
};

type CredentialTypes = 'email' | 'password';

type actionTypes =
  | {
      type: 'credentials/update';
      payload: {
        credential: CredentialTypes;
        value: string;
      };
    }
  | {
      type: 'credentials/submit';
    };

const initialState = {
  email: 'thomasmaxwellsmith+admin@gmail.com',
  password: 'jspr111',
  isLoading: false,
};

const reducer = (state: StateType, action: actionTypes): StateType => {
  return immer(state, (draftState: StateType) => {
    switch (action.type) {
      case 'credentials/update':
        draftState[action.payload.credential] = action.payload.value;
        break;
      case 'credentials/submit':
        draftState.isLoading = true;
        break;
      default:
        break;
    }
  });
};

const LogIn = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        dispatch({type: 'credentials/submit'});
        firebase
          .auth()
          .signInWithEmailAndPassword(state.email, state.password)
          .then((user) => {
            // Signed in
            // ...
            console.log(user);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
          });
      }}
    >
      <label>
        Email:{' '}
        <input
          type="email"
          placeholder="Enter your email"
          value={state.email}
          onChange={(e) => {
            dispatch({
              type: 'credentials/update',
              payload: {
                value: e.currentTarget.value,
                credential: 'email',
              },
            });
          }}
        />
      </label>
      <label>
        Password:{' '}
        <input
          type="password"
          placeholder="Enter your password"
          value={state.password}
          onChange={(e) => {
            dispatch({
              type: 'credentials/update',
              payload: {
                value: e.currentTarget.value,
                credential: 'password',
              },
            });
          }}
        />
      </label>
      <button disabled={state.isLoading}>
        {state.isLoading ? 'Loading...' : 'Submit'}
      </button>
    </form>
  );
};

export default LogIn;
