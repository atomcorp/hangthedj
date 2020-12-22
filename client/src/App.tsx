import React from 'react';
import {Switch, Route, Link, RouteProps, Redirect} from 'react-router-dom';
import {useSelector} from 'react-redux';

import Authentication from 'Authentication';
import Play from 'components/Play/Play';
import GetSpotifyAuth from 'components/GetSpotifyAuth/GetSpotifyAuth';
import SpotifyRedirect from 'components/GetSpotifyAuth/SpotifyRedirect';
import LoggedOut from 'components/LoggedOut/LoggedOut';
import {RootState} from 'rootReducer';

export const IS_DEBUG = true;

interface ProtectedRoute extends RouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({children, ...rest}: ProtectedRoute): JSX.Element => {
  const hasAuth = useSelector((state: RootState) => state.user.hasAuth);
  return (
    <Route
      {...rest}
      render={({location}) =>
        hasAuth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/signin',
              state: {from: location},
            }}
          />
        )
      }
    />
  );
};

const App = (): JSX.Element => {
  return (
    <Authentication>
      <section>
        <h1>App</h1>
        <Link to="/">Home</Link> | <Link to="/play">Play</Link> |{' '}
        <Link to="/play/redirect">Redirect</Link> | <Link to="/test">Test</Link>
        <Switch>
          <Route path="/play/redirect">
            <SpotifyRedirect />
          </Route>
          <ProtectedRoute path="/play">
            <>
              <Play />
              <GetSpotifyAuth />
            </>
          </ProtectedRoute>
          <ProtectedRoute path="/test">
            <div>Worked</div>
          </ProtectedRoute>
          <Route path="/signin">
            <LoggedOut />
          </Route>
          <Route path="/">
            <div>Home</div>
          </Route>
        </Switch>
      </section>
    </Authentication>
  );
};

export default App;
