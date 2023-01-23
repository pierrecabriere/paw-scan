import React from 'react';
import {Animated, FlatList, Text, TouchableOpacity, View} from 'react-native';
import {useAsyncStorage} from '../../lib/utils';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faFilePdf,
  faTrashAlt,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/Button';
import {formatDistance} from 'date-fns';
import {fr} from 'date-fns/locale';
import {COLORS} from '../../lib/enums';
import {useNavigation} from '@react-navigation/native';
import {DocumentDefinition} from '../../types';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {RectButton} from 'react-native-gesture-handler';

const DocumentsListScreen: React.FunctionComponent<any> = () => {
  const navigation = useNavigation<any>();
  const [documents] = useAsyncStorage<DocumentDefinition[]>('documents', []);

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
            flex: 1,
            backgroundColor: 'red',
            alignItems: 'flex-end',
            justifyContent: 'center',
          },
        ]}
        onPress={console.log}>
        <Animated.Text
          style={[
            {
              color: 'white',
              backgroundColor: 'transparent',
              padding: 10,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            },
            {
              transform: [{translateX: trans}],
            },
          ]}>
          <FontAwesomeIcon
            icon={faTrashAlt}
            size={30}
            style={{
              color: 'white',
            }}
          />
        </Animated.Text>
      </RectButton>
    );
  };

  const renderItem = ({item}: any) => (
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
        // renderLeftHiddenItem={ArchiveRowBack}
        // renderRightHiddenItem={TrashRowBack}
        // onSwipeLeft={deleteItem}
        // onSwipeRight={deleteItem}
      />
    </View>
  );
};

export default DocumentsListScreen;
