import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCaRgOdp_xOdNNG6NomaygHN_th1EjuSv0',
  authDomain: 'matphys-439ee.firebaseapp.com',
  databaseURL: 'https://matphys-439ee.firebaseio.com',
  projectId: 'matphys-439ee',
  storageBucket: 'matphys-439ee.appspot.com',
  messagingSenderId: '829744952485-l5eec58ddb3908c16rque198n2p6nigt.apps.googleusercontent.com',
  appId: '1:829744952485:android:3453d4480daba8ad69894c',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };
