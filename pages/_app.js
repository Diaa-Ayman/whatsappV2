import '../styles/globals.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import firebase from 'firebase';
import Login from './login';
import Loading from '../components/Loading';
import { useEffect } from 'react';
function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);
  // console.log(user);
  // const userb = auth.currentUser;  getting user Info by firebase itself...
  // console.log(userb);

  useEffect(() => {
    if (user) {
      db.collection('users').doc(user.uid).set(
        {
          email: user.email,
          photoURL: user.photoURL,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }
  }, [user]);
  if (loading) return <Loading />;

  if (!user) return <Login />;

  return <Component {...pageProps} />;
}

export default MyApp;

// _ IN THIS APP I USED OLD VERSIONS OF EVERYTHING...