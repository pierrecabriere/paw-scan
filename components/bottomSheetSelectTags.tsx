import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useState} from 'react';
import {useAsyncStorage} from '../lib/utils';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faPlusCircle,
  faTag,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Input from './Input';
import {COLORS} from '../lib/enums';
import {Config, CurrentConfig} from '../types';

const BottomSheetSelectTags: React.FunctionComponent<{
  sheetRef: React.RefObject<BottomSheet>;
  value: any;
  onChange: (value: any) => void;
}> = ({sheetRef, value, onChange}) => {
  const [configurations] = useAsyncStorage<Config[]>('configurations', []);
  const [currentConfiguration] = useAsyncStorage<CurrentConfig>(
    'currentConfiguration',
    null,
  );
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>('');

  const selectedConfiguration = configurations.find(
    c => c.uid === currentConfiguration?.value,
  );

  const _loadTags = async () => {
    if (!selectedConfiguration) {
      if (tags?.length) {
        setTags([]);
      }
      return null;
    }

    const {host, username, password} = selectedConfiguration;
    const {
      data: {access_token},
    } = await axios.post(`https://${host}/api/token`, {
      username,
      password,
      grant_type: 'password',
    });

    const {
      data: {orgtags},
    } = await axios.get(`https://${host}/api/d3/user/orgtags`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    setTags(orgtags);
  };

  useEffect(() => {
    _loadTags();
  }, [selectedConfiguration]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={sheetRef}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      index={-1}
      snapPoints={['70%']}>
      <SafeAreaView>
        <View
          style={{
            width: '100%',
            height: '100%',
            paddingLeft: '4%',
            paddingRight: '4%',
          }}>
          <Input
            containerStyle={{
              paddingBottom: 0,
              marginBottom: '2%',
            }}
            resetable
            onChange={setCurrentTag}
            value={currentTag}
            onSubmit={() => {
              onChange((value || []).concat(currentTag));
              setCurrentTag('');
            }}
            placeholder="Ajouter un mot clé"
          />
          <FlatList
            data={[...new Set<any>((value || []).concat(tags))]}
            renderItem={({item, index}: {item: string; index: number}) => {
              const selected = (value || []).includes(item);

              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    if (selected) {
                      let v = [...new Set(value || [])];
                      v.splice(index, 1);
                      onChange(v);
                    } else {
                      const v = value || [];
                      onChange(v.concat(item));
                    }
                  }}
                  style={{
                    paddingLeft: '4%',
                    paddingRight: '4%',
                    paddingTop: '4%',
                    paddingBottom: '4%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}>
                    <FontAwesomeIcon
                      icon={faTag}
                      style={{
                        marginRight: 10,
                      }}
                    />
                    <Text>{item}</Text>
                  </View>
                  {selected ? (
                    <FontAwesomeIcon
                      icon={faXmarkCircle}
                      size={20}
                      style={{
                        color: COLORS.DANGER,
                      }}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faPlusCircle}
                      size={20}
                      style={{
                        color: COLORS.PRIMARY,
                      }}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => (
              <View
                style={{backgroundColor: '#ddd', width: '100%', height: 1}}
              />
            )}
          />
        </View>
      </SafeAreaView>
    </BottomSheet>
  );
};

export default BottomSheetSelectTags;
