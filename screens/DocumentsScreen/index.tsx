import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DocumentsListScreen from './ListScreen';
import ListItemScreen from './ListItemScreen';

const Stack = createStackNavigator();

const DocumentsScreen: React.FunctionComponent<any> = () => {
  return (
    <Stack.Navigator
      initialRouteName="DocumentsList"
      screenOptions={{
        headerBackTitle: 'Retour',
        headerStyle: {elevation: 0},
        cardStyle: {backgroundColor: '#fff'},
      }}>
      <Stack.Screen
        name="DocumentsList"
        component={DocumentsListScreen}
        options={{title: 'Liste des documents'}}
      />
      <Stack.Screen
        name="DocumentsListItem"
        component={ListItemScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default DocumentsScreen;
