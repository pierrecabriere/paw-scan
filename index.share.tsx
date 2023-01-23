import {AppRegistry, Image, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import ShareMenu from 'react-native-share-menu';

AppRegistry.registerComponent(
  'ShareMenuModuleComponent',
  () => MyShareComponent,
);

type SharedItem = {
  mimeType: string;
  data: string;
  extraData: any;
};

const MyShareComponent: React.FunctionComponent<any> = () => {
  const [sharedData, setSharedData] = useState<any>(null);
  const [sharedMimeType, setSharedMimeType] = useState<any>(null);

  const handleShare = useCallback((item: SharedItem) => {
    if (!item) {
      return;
    }

    const {mimeType, data, extraData} = item;

    setSharedData(data);
    setSharedMimeType(mimeType);
    // You can receive extra data from your custom Share View
    console.log(extraData);
  }, []);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare as any);
  }, []);

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare as any);

    return () => {
      listener.remove();
    };
  }, []);

  if (!sharedMimeType && !sharedData) {
    // The user hasn't shared anything yet
    return null;
  }

  if (sharedMimeType === 'text/plain') {
    // The user shared text
    return <Text>Shared text: {sharedData}</Text>;
  }

  if (sharedMimeType.startsWith('image/')) {
    // The user shared an image
    return (
      <View>
        <Text>Shared image:</Text>
        <Image source={{uri: sharedData}} />
      </View>
    );
  }

  // The user shared a file in general
  return (
    <View>
      <Text>Shared mime type: {sharedMimeType}</Text>
      <Text>Shared file location: {sharedData}</Text>
    </View>
  );
};
