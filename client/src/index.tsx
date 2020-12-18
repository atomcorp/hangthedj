import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBeqeW-lV5dg2x-vDzn6_NMN9wtkzJ_K4M',
  authDomain: 'passtheaux-3d50c.firebaseapp.com',
  projectId: 'passtheaux-3d50c',
  storageBucket: 'passtheaux-3d50c.appspot.com',
  messagingSenderId: '807387430755',
  appId: '1:807387430755:web:a916cee52fde2cf36c5d56',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
