import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import {Provider} from 'react-redux';

import Authentication from 'Authentication';
import Play from 'components/Play/Play';
import GetSpotifyAuth from 'components/GetSpotifyAuth/GetSpotifyAuth';
import store from 'store';

const App = (): JSX.Element => (
  <Provider store={store}>
    <Router>
      <section>
        <h1>App</h1>
        <Link to="/">Home</Link> | <Link to="/play">Play</Link>
        <Switch>
          <Route path="/play">
            <Authentication>
              <div>
                <Play />
                <GetSpotifyAuth />
              </div>
            </Authentication>
          </Route>
          <Route path="/">
            <div>Home</div>
          </Route>
        </Switch>
      </section>
    </Router>
  </Provider>
);

export default App;
