import React from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useAsyncStorage} from '../../lib/utils';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faFilePdf, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/Button';
import {formatDistance} from 'date-fns';
import {fr} from 'date-fns/locale';
import {COLORS} from '../../lib/enums';
import {useNavigation} from '@react-navigation/native';
import {Config, DocumentDefinition} from '../../types';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {RectButton} from 'react-native-gesture-handler';
import axios from 'axios/index';

const DocumentsListScreen: React.FunctionComponent<any> = () => {
  const navigation = useNavigation<any>();
  const [documents, setDocuments] = useAsyncStorage<DocumentDefinition[]>(
    'documents',
    [],
  );
  const [configurations] = useAsyncStorage<Config[]>('configurations', []);

  const _deleteDoc = async (doc: DocumentDefinition) => {
    const documentConfiguration = configurations.find(
      c => c.uid === doc.configuration,
    );

    if (!documentConfiguration) {
      Alert.alert(
        'Impossible de supprimer le document car la configuration a été supprimée',
      );
      return;
    }

    setDocuments(documents.filter(d => d.document.id !== doc.document.id));

    try {
      const {host, username, password} = documentConfiguration;
      const {data} = await axios.post(`https://${host}/api/token`, {
        username,
        password,
      });

      await axios.delete(
        `https://${host}/api/d2/docs/${doc.document.id}?user_token=${data.user_token}`,
      );

      Alert.alert('Le document a bien été supprimé');
    } catch (e) {
      Alert.alert('Impossible de supprimer le document');
      setDocuments(documents.concat(doc));
    }
  };

  const renderItem = ({item}: any) => {
    const renderActions = (progress: any, dragX: any) => {
      const trans = dragX.interpolate({
        inputRange: [0, 50, 100, 101],
        outputRange: [-20, 0, 0, 1],
        extrapolate: 'clamp',
      });

      return (
        <RectButton
          style={[
            {
              display: 'flex',
              backgroundColor: 'red',
              alignItems: 'flex-end',
              justifyContent: 'center',
            },
          ]}
          onPress={() => _deleteDoc(item)}>
          <View>
            <Animated.Text
              style={[
                {
                  paddingRight: '7%',
                  paddingLeft: '7%',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                {
                  transform: [{translateX: trans}],
                },
              ]}>
              <FontAwesomeIcon
                icon={faTrashAlt}
                size={25}
                style={{
                  color: 'white',
                }}
              />
            </Animated.Text>
          </View>
        </RectButton>
      );
    };

    return (
      <Swipeable renderRightActions={renderActions} leftThreshold={0}>
        <View
          key={item.configuration}
          style={{
            backgroundColor: 'white',
          }}>
          <TouchableOpacity
            style={{
              paddingLeft: '2%',
              paddingRight: '2%',
              paddingTop: '6%',
              paddingBottom: '6%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => navigation.navigate('DocumentsListItem', item)}>
            <FontAwesomeIcon
              icon={faFilePdf}
              style={{marginRight: '2%', color: COLORS.PRIMARY}}
              size={25}
            />
            <View style={{display: 'flex', flexDirection: 'column'}}>
              <Text style={{fontWeight: '500', fontSize: 16}}>
                {item.document.attributes.title}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: '#666',
                }}>
                {formatDistance(
                  new Date(item.document.attributes.created_at),
                  new Date(),
                  {
                    locale: fr,
                  },
                )}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Swipeable>
    );
  };

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        paddingLeft: '4%',
        paddingRight: '4%',
        paddingBottom: '6%',
      }}>
      <FlatList
        keyExtractor={(item: any) => item.document.id}
        data={documents}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View style={{backgroundColor: '#ddd', width: '100%', height: 1}} />
        )}
        ListFooterComponent={
          <Button
            theme="flat"
            label="Nouveau scan"
            onPress={() => navigation.navigate('Scanner')}
          />
        }
      />
    </View>
  );
};

export default DocumentsListScreen;
