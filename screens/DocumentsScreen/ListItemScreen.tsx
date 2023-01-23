import React from 'react';
import {Alert, Linking, SafeAreaView, View} from 'react-native';
import Button from '../../components/Button';
import {useAsyncStorage} from '../../lib/utils';
import axios from 'axios';
import Pdf from 'react-native-pdf';
import {
  faAngleLeft,
  faDownload,
  faExternalLink,
} from '@fortawesome/free-solid-svg-icons';
import {Config} from '../../types';
import {useNavigation, useRoute} from '@react-navigation/native';

const ListItemScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [configurations] = useAsyncStorage<Config[]>('configurations', []);
  const {document, configuration} = route.params;

  const documentConfiguration = configurations.find(
    c => c.uid === configuration,
  );

  if (!document) {
    return null;
  }

  const _handleOpenDocument = async () => {
    if (!documentConfiguration) {
      Alert.alert(
        "Impossible d'ouvrir le lien car la configuration a été supprimée",
      );
      return;
    }

    let url = `https://${documentConfiguration.host}/documents/${document.id}`;

    try {
      const {host, username, password} = documentConfiguration;
      const {data} = await axios.post(`https://${host}/api/token`, {
        username,
        password,
      });

      url += `?user_token=${data.user_token}&user_username=${data.email}`;
    } catch (e) {}

    Linking.openURL(url);
  };

  const _handleDownloadDocument = async () => {
    if (!documentConfiguration) {
      Alert.alert(
        "Impossible d'ouvrir le lien car la configuration a été supprimée",
      );
      return;
    }

    let url = `https://${documentConfiguration.host}/documents/${document.id}/upload`;

    try {
      const {host, username, password} = documentConfiguration;
      const {data} = await axios.post(`https://${host}/api/token`, {
        username,
        password,
      });

      url += `?user_token=${data.user_token}&user_username=${data.email}`;
    } catch (e) {}

    Linking.openURL(url);
  };

  if (!documentConfiguration) {
    return null;
  }

  const url = encodeURI(
    `https://${documentConfiguration.host}${document.attributes.file_url}`,
  );

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          position: 'absolute',
          top: 0,
          flexDirection: 'row',
          width: '94%',
          marginLeft: '3%',
          marginTop: '3%',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          zIndex: 1,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <Button
            onPress={() => navigation.navigate('DocumentsList')}
            size={50}
            icon={faAngleLeft}
            margin="2%"
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <Button
            onPress={_handleDownloadDocument}
            size={50}
            icon={faDownload}
            margin="2%"
          />
          <Button
            onPress={_handleOpenDocument}
            size={50}
            icon={faExternalLink}
            margin="2%"
          />
        </View>
      </SafeAreaView>
      <Pdf
        trustAllCerts={false}
        source={{uri: url, method: 'GET'}}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#fff',
        }}
      />
    </>
  );
};

export default ListItemScreen;
