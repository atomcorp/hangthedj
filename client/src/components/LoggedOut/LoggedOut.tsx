import React from 'react';

import LogIn from 'components/LogIn/LogIn';
import Register from 'components/Register/Register';

import css from './LoggedOut.module.css';

const LoggedOut = (): JSX.Element => (
  <section className={css.container}>
    Logged out
    <LogIn />
    <Register />
  </section>
);

export default LoggedOut;
