import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ListScreen from './ListScreen';
import SettingsAddScreen from './AddScreen';
import SettingsEditScreen from './EditScreen';

const Stack = createStackNavigator();

const SettingsScreen: React.FunctionComponent<any> = () => {
  return (
    <Stack.Navigator
      initialRouteName="SettingsList"
      screenOptions={{
        headerBackTitle: 'Retour',
        headerStyle: {elevation: 0},
        cardStyle: {backgroundColor: '#fff'},
      }}>
      <Stack.Screen
        name="SettingsList"
        component={ListScreen}
        options={{title: 'Configurations'}}
      />
      <Stack.Screen
        name="SettingsAdd"
        component={SettingsAddScreen}
        options={{title: 'Ajouter une configuration'}}
      />
      <Stack.Screen
        name="SettingsEdit"
        component={SettingsEditScreen}
        options={{title: 'Modifier la configuration'}}
      />
    </Stack.Navigator>
  );
};

export default SettingsScreen;
