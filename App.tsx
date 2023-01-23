import React, {useState, useEffect} from 'react';
import Permissions from 'react-native-permissions';
import ScannerScreen from './screens/ScannerScreen';
import LandingScreen from './screens/LandingScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Platform} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import SaveDocumentScreen from './screens/SaveDocumentScreen';
import DocumentsScreen from './screens/DocumentsScreen';
import SettingsScreen from './screens/Settings';
import SettingsAddScreen from './screens/Settings/AddScreen';

const Stack = createStackNavigator();

export default function App() {
  const [allowed, setAllowed] = useState<string>();

  useEffect(() => {
    Permissions.check(
      Platform.OS === 'android'
        ? 'android.permission.CAMERA'
        : 'ios.permission.CAMERA',
    ).then(result => {
      SplashScreen.hide();
      setAllowed(result);
    });
  }, []);

  if (allowed === undefined) {
    return null;
  }

  if (allowed !== 'granted') {
    return <LandingScreen allowed={allowed} onAllow={setAllowed} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Scanner"
        screenOptions={{
          headerBackTitle: 'Retour',
          headerStyle: {elevation: 0},
          cardStyle: {backgroundColor: '#fff'},
        }}>
        <Stack.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SettingsAdd"
          component={SettingsAddScreen}
          options={{title: 'Ajouter une configuration'}}
        />
        <Stack.Screen
          name="Documents"
          component={DocumentsScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SaveDocument"
          component={SaveDocumentScreen}
          options={{title: 'Enregistrer le document'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
