import {useState, useEffect} from 'react';
import Permissions from 'react-native-permissions';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// @ts-ignore
import fetch from 'react-native-fetch-polyfill';
import {Config} from '../types';
import BehaviorSubject from './BehaviorSubject';

export const requestCamera = async () => {
  const result = await Permissions.request(
    Platform.OS === 'android'
      ? 'android.permission.CAMERA'
      : 'ios.permission.CAMERA',
  );

  return result;
};

const subjects: any = {};

export function useAsyncStorage<T extends any>(
  key: string,
  initialValue: T | null,
): [T, (value: T) => void, boolean] {
  const [data, _setData] = useState(subjects[key]?.getValue() ?? initialValue);
  const [retrivedFromStorage, setRetrievedFromStorage] = useState(false);

  useEffect(() => {
    if (!subjects[key]) {
      subjects[key] = new BehaviorSubject(initialValue);

      AsyncStorage.getItem(key)
        .then(value => {
          subjects[key].next((value && JSON.parse(value)) || initialValue);
          setRetrievedFromStorage(true);
        })
        .catch(error => console.error('useAsyncStorage getItem error:', error));
    } else {
      setRetrievedFromStorage(true);
    }

    const unsubscribe = subjects[key].subscribe(_setData);

    return () => unsubscribe();
  }, [key, initialValue]);

  const setNewData = async (value: T) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      subjects[key].next(value);
    } catch (error) {
      console.error('useAsyncStorage setItem error:', error);
    }
  };

  return [data, setNewData, retrivedFromStorage];
}

export const testConnection = async ({host, username, password}: Config) => {
  try {
    const {data} = await axios.post(`https://${host}/api/token`, {
      username,
      password,
      grant_type: 'password',
    });
    return data;
  } catch (e) {
    return false;
  }
};

export const getBlob = async (url: string) => {
  const res = await fetch(url);
  return res?.blob();
};
