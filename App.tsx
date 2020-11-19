import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen, HomeScreen, RegistrationScreen } from './src/screens';
import {decode, encode} from 'base-64';
import { firebase } from './src/firebase/config';

if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Stack = createStackNavigator();

export default function App() {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null)

  useEffect(() => {
    const usersRef = firebase.firestore().collection('users');
    console.log(usersRef);
    firebase.auth().onAuthStateChanged((user: { uid: any; }) => {
      console.log(user);
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document: { data: () => any; }) => {
            const userData = document.data()
            console.log(userData);
            setUser(userData)

            setLoading(false)
          })
          .catch((error: any) => {
            setLoading(false)
          });
      } else {
        setLoading(false)
      }
    });
  }, []);

  return (
    <>
      {loading ? <></> : (
        <NavigationContainer>
          <Stack.Navigator>
            { user ? (
              <Stack.Screen name="Home">
                {props => <HomeScreen {...props} extraData={user} />}
              </Stack.Screen>
            ) : (
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Registration" component={RegistrationScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
}