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
  faFolder,
  faPlusCircle,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Input from './Input';
import {COLORS} from '../lib/enums';
import {Config, CurrentConfig} from '../types';
import {spacesVar} from '../lib/vars';

const BottomSheetSelectSpaces: React.FunctionComponent<{
  sheetRef: React.RefObject<BottomSheet>;
  value: any;
  onChange: (value: any) => void;
}> = ({sheetRef, value, onChange}) => {
  const [configurations] = useAsyncStorage<Config[]>('configurations', []);
  const [currentConfiguration] = useAsyncStorage<CurrentConfig>(
    'currentConfiguration',
    null,
  );
  const [spaces, setSpaces] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [inputSearch, setInputSearch] = useState<string>('');

  const selectedConfiguration = configurations.find(
    c => c.uid === currentConfiguration?.value,
  );

  const _loadSpaces = async () => {
    if (!selectedConfiguration) {
      if (spaces?.length) {
        setSpaces([]);
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
      data: {data: _spaces},
    } = await axios.get(`https://${host}/api/d2/spaces?sort[updated_at]=-1`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    spacesVar.current = spacesVar.current.concat(_spaces);

    const ids = _spaces.map((s: any) => s.id);
    setSpaces(ids);
  };

  const _loadSearch = async () => {
    if (!selectedConfiguration) {
      if (results?.length) {
        setResults([]);
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
      data: {data: _spaces},
    } = await axios.get(
      `https://${host}/api/d2/spaces?search=${encodeURIComponent(inputSearch)}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    spacesVar.current = spacesVar.current.concat(_spaces);

    const ids = _spaces.map((s: any) => s.id);
    setResults(ids);
  };

  useEffect(() => {
    _loadSpaces();
  }, [selectedConfiguration]);

  useEffect(() => {
    if (inputSearch?.length) {
      _loadSearch();
    }
  }, [inputSearch]);

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

  const displaySuggests = !inputSearch?.length;

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
            onChange={setInputSearch}
            value={inputSearch}
            placeholder="Rechercher un dossier"
          />
          <FlatList
            data={[
              ...new Set<any>(
                displaySuggests ? (value || []).concat(spaces) : results,
              ),
            ]}
            renderItem={({item, index}: {item: string; index: any}) => {
              const space = spacesVar.current.find(s => s.id === item);

              const selected = (value || []).includes(space?.id);

              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    if (selected) {
                      const v = [...(value || [])];
                      v.splice(index, 1);
                      onChange(v);
                    } else {
                      const v = value || [];
                      onChange(v.concat(space?.id));
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
                      icon={faFolder}
                      style={{
                        marginRight: 10,
                      }}
                    />
                    <Text>{space?.attributes?.title || item}</Text>
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

export default BottomSheetSelectSpaces;
