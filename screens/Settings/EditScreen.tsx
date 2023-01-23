import React from 'react';
import {SafeAreaView} from 'react-native';
import SettingsForm from '../../components/SettingsForm';
import {useAsyncStorage} from '../../lib/utils';
import Button from '../../components/Button';
import {Config} from '../../types';
import {useNavigation, useRoute} from '@react-navigation/native';

const SettingsEditScreen: React.FunctionComponent<any> = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [configurations, setConfigurations] = useAsyncStorage<Config[]>(
    'configurations',
    [],
  );

  const {item} = route.params;

  if (!item) {
    navigation.navigate('SettingsList');
    return null;
  }

  return (
    <SafeAreaView>
      <SettingsForm
        item={item}
        onSubmit={values => {
          Object.assign(item, values);
          setConfigurations(configurations);
          navigation.navigate('SettingsList');
        }}
      />
      <Button
        theme="flat"
        label="Supprimer la configuration"
        color="red"
        onPress={() => {
          setConfigurations(configurations.filter(c => c !== item));
          navigation.navigate('SettingsList');
        }}
      />
    </SafeAreaView>
  );
};

export default SettingsEditScreen;
