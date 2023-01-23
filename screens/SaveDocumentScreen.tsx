import React, {useState} from 'react';
import {testConnection, useAsyncStorage} from '../lib/utils';
import {
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
  Image,
  Text,
  View,
} from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import BottomSheetSelectConfiguration from '../components/bottomSheetSelectConfiguration';
import {faCrosshairs} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import qs from 'qs';
import SettingsForm from '../components/SettingsForm';
import BottomSheetSelectTags from '../components/bottomSheetSelectTags';
import BottomSheetSelectSpaces from '../components/bottomSheetSelectSpaces';
import {Config, CurrentConfig, DocumentDefinition} from '../types';
import {useNavigation} from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet';
import {imagesVar} from '../lib/vars';
import {format} from 'date-fns';

const SaveDocumentScreen: React.FunctionComponent<any> = () => {
  const navigation = useNavigation<any>();
  const [configurations, setConfigurations, configurationsLoaded] =
    useAsyncStorage<Config[]>('configurations', []);
  const [documents, setDocuments] = useAsyncStorage<DocumentDefinition[]>(
    'documents',
    [],
  );
  const [currentConfiguration, setCurrentConfiguration] =
    useAsyncStorage<CurrentConfig>('currentConfiguration', null);
  const [values, setValues] = useState<{
    title: string;
    tags?: string[];
    tagset_ids?: string[];
  }>({
    title: `scan ${format(new Date(), 'yyyy-MM-dd')}`,
    tags: undefined,
    tagset_ids: undefined,
  });
  const sheetRef = React.useRef<BottomSheet>(null);
  const selectTagsSheetRef = React.useRef<BottomSheet>(null);
  const selectSpacesSheetRef = React.useRef<BottomSheet>(null);
  const [loading, setLoading] = useState(false);

  if (!imagesVar.current?.length) {
    navigation.navigate('Scanner');
    return null;
  }

  if (configurationsLoaded && !configurations?.length) {
    return (
      <SafeAreaView>
        <SettingsForm
          mute
          onSubmit={async conf => {
            const uid = String(Date.now());
            await setConfigurations(configurations.concat({...conf, uid}));
            await setCurrentConfiguration({value: uid});
          }}
        />
      </SafeAreaView>
    );
  }

  const onSubmit = async () => {
    setLoading(true);
    // await setDocuments([]);

    const configuration = configurations.find(
      c => c.uid === currentConfiguration?.value,
    );

    if (!configuration) {
      return;
    }

    try {
      const res = await testConnection(configuration);
      if (!res) {
        Alert.alert('Impossible de se connecter à la configuration');
        setLoading(false);
        return;
      }

      const {access_token} = res;

      const payload = {
        ...values,
        superfields: {origin: 'app-scan'},
        files: imagesVar.current.map(image => ({
          name: `${Date.now()}.jpg`,
          type: 'image/jpeg',
          width: image.width,
          height: image.height,
          uri: image.uri,
        })),
      };

      console.log(payload);

      const formData = new FormData();
      const {files, ...attributes} = payload;
      files.forEach(file => {
        formData.append('files[]', file);
      });
      // formData.append('title', `${title}.pdf`);
      const url = `https://${configuration.host}/api/d2/docs?${qs.stringify(
        {data: {attributes}},
        {arrayFormat: 'brackets'},
      )}`;
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + access_token,
        },
      };

      const {
        data: {data},
      } = await axios.post(url, formData, config);
      await setDocuments(
        [{document: data, configuration: configuration.uid}].concat(documents),
      );
      navigation.reset({
        index: 0,
        routes: [{name: 'Scanner'}],
      });
      navigation.navigate('Documents');
      imagesVar.current = [];
    } catch (e: any) {
      console.log(e);
      Alert.alert('Une erreur est survenue');
    }

    setLoading(false);
  };

  const selectedConfiguration = configurations.find(
    c => c.uid === currentConfiguration?.value,
  );

  return (
    <>
      <SafeAreaView>
        <TouchableOpacity
          onPress={() => {
            sheetRef.current?.snapToIndex(0);
            Keyboard.dismiss();
          }}>
          <View
            style={{
              paddingTop: '2%',
              paddingBottom: '2%',
              paddingLeft: '4%',
              paddingRight: '4%',
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                height: 40,
                borderRadius: 5,
              }}>
              <Text style={{color: '#666', marginRight: '2%'}}>
                Enregistrer sur :
              </Text>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>
                  {selectedConfiguration?.host || ''}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <Input
          label="Nom du document"
          resetable
          onChange={(title: string) => setValues(v => ({...v, title}))}
          value={values.title}
        />

        <TouchableOpacity
          onPress={() => {
            selectTagsSheetRef.current?.snapToIndex(0);
            Keyboard.dismiss();
          }}>
          <Input label="Mots clés" resetable value={values.tags?.join(', ')} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            selectSpacesSheetRef.current?.snapToIndex(0);
            Keyboard.dismiss();
          }}>
          <Input
            label="Dossiers"
            resetable
            value={`${values.tagset_ids?.length || 'Aucun'} sélectionné${
              (values.tagset_ids?.length || 0) > 1 ? 's' : ''
            }`}
            style={{color: '#666'}}
          />
        </TouchableOpacity>

        <Button
          theme="flat"
          label={loading ? 'Enregistrement en cours ...' : 'Enregistrer'}
          onPress={() => onSubmit()}
          icon={loading ? faCrosshairs : undefined}
          spin={loading}
          disabled={loading}
        />
      </SafeAreaView>

      <BottomSheetSelectConfiguration
        sheetRef={sheetRef}
        navigation={navigation}
      />

      <BottomSheetSelectTags
        sheetRef={selectTagsSheetRef}
        value={values.tags}
        onChange={tags => setValues(v => ({...v, tags}))}
      />

      <BottomSheetSelectSpaces
        sheetRef={selectSpacesSheetRef}
        value={values.tagset_ids}
        onChange={tagset_ids => setValues(v => ({...v, tagset_ids}))}
      />
    </>
  );
};

export default SaveDocumentScreen;
