import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faXmarkCircle} from '@fortawesome/free-solid-svg-icons';

const Input: React.FunctionComponent<
  {
    label?: string;
    value?: string;
    onChange: (value: string) => void;
    onSubmit?: (value: string) => void;
    prefix?: string;
    resetable?: boolean;
    containerStyle?: any;
  } & any
> = ({
  label,
  value,
  onChange,
  onSubmit,
  prefix,
  resetable,
  containerStyle,
  ...inputProps
}) => {
  return (
    <View
      style={{
        paddingTop: '2%',
        paddingBottom: '2%',
        paddingLeft: '4%',
        paddingRight: '4%',
        ...(containerStyle || {}),
      }}>
      {label ? <Text style={{marginBottom: '2%'}}>{label}</Text> : null}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          height: 40,
          backgroundColor: '#fff',
          paddingLeft: '2%',
          paddingRight: '2%',
          borderRadius: 5,
          borderWidth: 1,
          borderColor: '#ddd',
        }}>
        {prefix ? (
          <Text style={{color: '#666', marginRight: '2%'}}>{prefix}</Text>
        ) : null}
        {onChange ? (
          <>
            <TextInput
              style={{flex: 1}}
              onChangeText={onChange}
              value={value}
              onSubmitEditing={onSubmit}
              returnKeyType={onSubmit ? 'done' : undefined}
              blurOnSubmit={!!onSubmit}
              {...inputProps}
            />
            {value?.length && resetable ? (
              <TouchableOpacity onPress={() => onChange()}>
                <FontAwesomeIcon
                  icon={faXmarkCircle}
                  style={{
                    marginLeft: '2%',
                    color: '#999',
                  }}
                />
              </TouchableOpacity>
            ) : null}
          </>
        ) : (
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}>
            <Text {...inputProps}>{value || ''}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Input;
