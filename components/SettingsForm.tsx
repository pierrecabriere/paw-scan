import React, {useEffect, useState} from 'react';
import {View, Alert} from 'react-native';
import Button from './Button';
import Input from './Input';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {testConnection} from '../lib/utils';
import {Config} from '../types';

const SettingsForm: React.FunctionComponent<{
  onSubmit: (values: Config) => void;
  item?: Config;
  mute?: boolean;
}> = ({onSubmit, item, mute}) => {
  const [values, setValues] = useState<Partial<Config>>({});
  const [testLoading, setTestLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setValues({...item});
    }
  }, [item]);

  const _handleSubmit = async () => {
    if (!values.host?.length) {
      Alert.alert(
        'Hôte requis',
        'Avant de continuer, vous devez saisir un hôte valide',
      );
      return;
    }

    const connected = await test();

    if (!connected) {
      return;
    }

    onSubmit(values as Config);
  };

  const test = async () => {
    setTestLoading(true);
    const connected = await testConnection(values as Config);

    if (!mute) {
      if (connected) {
        Alert.alert(
          'Connexion réussie !',
          'Votre appareil a réussi à se connecter à la configuration avec succès',
        );
      } else {
        Alert.alert(
          'Une erreur est survenue',
          'Impossible de se connecter à la configuration. Vérifiez vos identifiants',
        );
      }
    }

    setTestLoading(false);
    return connected;
  };

  return (
    <View>
      <Input
        label="Hôte plugandwork"
        onChange={(host: string) => setValues(v => ({...v, host}))}
        value={values.host}
        prefix="https://"
        textContentType="emailAddress"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoCompleteType="email"
      />
      <Input
        label="Identifiant de connexion"
        onChange={(username: string) => setValues(v => ({...v, username}))}
        value={values.username}
        textContentType="emailAddress"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoCompleteType="email"
      />
      <Input
        label="Mot de passe"
        onChange={(password: string) => setValues(v => ({...v, password}))}
        value={values.password}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={{margin: '3%'}}>
        <Button
          theme="flat"
          label="Valider"
          onPress={() => _handleSubmit()}
          margin="1%"
          disabled={testLoading}
        />
        <Button
          theme="flat"
          label={testLoading ? 'Test en cours ...' : 'Tester la connexion'}
          onPress={test}
          margin="1%"
          icon={testLoading ? faSpinner : undefined}
          spin={testLoading}
          disabled={testLoading}
        />
      </View>
    </View>
  );
};

export default SettingsForm;
