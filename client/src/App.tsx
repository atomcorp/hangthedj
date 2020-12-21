import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import Authentication from 'Authentication';
import Play from 'components/Play/Play';

const App = (): JSX.Element => (
  <Router>
    <section>
      <h1>App</h1>
      <Link to="/">Home</Link> | <Link to="/play">Play</Link>
      <Switch>
        <Route path="/play">
          <Authentication>
            <Play />
          </Authentication>
        </Route>
        <Route path="/">
          <div>Home</div>
        </Route>
      </Switch>
    </section>
  </Router>
);

export default App;
