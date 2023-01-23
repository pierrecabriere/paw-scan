import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import Button from './Button';
import React from 'react';
import {useAsyncStorage} from '../lib/utils';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faGlobe} from '@fortawesome/free-solid-svg-icons';
import {COLORS} from '../lib/enums';
import {Config, CurrentConfig} from '../types';

const ConfigurationsList: React.FunctionComponent<{
  onItemPress: (item: Config) => void;
  addConfiguration: () => void;
}> = ({onItemPress, addConfiguration}) => {
  const [configurations] = useAsyncStorage<Config[]>('configurations', []);
  const [currentConfiguration] = useAsyncStorage<CurrentConfig>(
    'currentConfiguration',
    null,
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
        data={configurations}
        renderItem={({item}) => (
          <TouchableOpacity
            key={item.host}
            style={{
              paddingLeft: '2%',
              paddingRight: '2%',
              paddingTop: '4%',
              paddingBottom: '4%',
              display: 'flex',
              flexDirection: 'row',
            }}
            onPress={() => onItemPress(item)}>
            <FontAwesomeIcon
              icon={faGlobe}
              style={{
                marginRight: '2%',
                color:
                  item.uid === currentConfiguration?.value
                    ? COLORS.PRIMARY
                    : '',
              }}
            />
            <Text>{item.host}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => (
          <View style={{backgroundColor: '#ddd', width: '100%', height: 1}} />
        )}
        ListFooterComponent={
          addConfiguration ? (
            <Button
              theme="flat"
              label="Ajouter une configuration"
              onPress={addConfiguration}
            />
          ) : null
        }
      />
    </View>
  );
};

export default ConfigurationsList;
