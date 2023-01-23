import React from 'react';
import {SafeAreaView} from 'react-native';
import SettingsForm from '../../components/SettingsForm';
import {useAsyncStorage} from '../../lib/utils';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Config, CurrentConfig} from '../../types';

const SettingsAddScreen: React.FunctionComponent<any> = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [configurations, setConfigurations] = useAsyncStorage<Config[]>(
    'configurations',
    [],
  );
  const [, setCurrentConfiguration] = useAsyncStorage<CurrentConfig>(
    'currentConfiguration',
    null,
  );

  return (
    <SafeAreaView>
      <SettingsForm
        onSubmit={async values => {
          const uid = String(Date.now());
          await setConfigurations(configurations.concat({...values, uid}));
          await setCurrentConfiguration({value: uid});
          const redirect = route?.params?.redirect || 'SettingsList';
          navigation.navigate(redirect);
        }}
      />
    </SafeAreaView>
  );
};

export default SettingsAddScreen;
