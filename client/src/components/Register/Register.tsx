import React, {useReducer} from 'react';
import immer from 'immer';

type StateType = {
  profilename: string;
  email: string;
  password: string;
  isLoading: boolean;
};

type CredentialTypes = 'email' | 'password' | 'profilename';

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
  profilename: 'Tom',
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

const Register = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <section
      onClick={() => {
        /**
         * Create a user in firebase/auth and then user the id to create
         * a storage user in firebase/storage
         * and then log them in
         */
      }}
    >
      <h2>Register</h2>
      <form>
        <label>
          Profile name:{' '}
          <input
            type="text"
            placeholder="Enter your profile name"
            value={state.profilename}
            onChange={(e) => {
              dispatch({
                type: 'credentials/update',
                payload: {
                  value: e.currentTarget.value,
                  credential: 'profilename',
                },
              });
            }}
          />
        </label>
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
        <button>Submit</button>
      </form>
    </section>
  );
};

export default Register;
