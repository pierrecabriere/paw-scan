import React from 'react';
import {SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ConfigurationsList from '../../components/ConfigurationsList';

const ListScreen: React.FunctionComponent<any> = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView>
      <ConfigurationsList
        addConfiguration={() => {
          navigation.navigate('SettingsAdd');
        }}
        onItemPress={(item: any) => navigation.navigate('SettingsEdit', {item})}
      />
    </SafeAreaView>
  );
};

export default ListScreen;
