import React, {useEffect} from 'react';
import DocumentScanner from 'react-native-document-scanner-plugin';
import Button from '../components/Button';
import {useNavigation} from '@react-navigation/native';
import Landing from '../components/Landing';
import {imagesVar} from '../lib/vars';
import {Image, View} from 'react-native';
import {faCamera, faCog, faList} from '@fortawesome/free-solid-svg-icons';
import ImageResizer from '@bam.tech/react-native-image-resizer';

const ScannerScreen: React.FunctionComponent<any> = () => {
  const navigation = useNavigation<any>();
  const scanDocument = async () => {
    const {scannedImages} = await DocumentScanner.scanDocument();
    if (scannedImages) {
      const paths: Array<{uri: string; width: number; height: number}> =
        await Promise.all(
          scannedImages.map(async image => {
            try {
              return await ImageResizer.createResizedImage(
                image,
                1000,
                1000,
                'JPEG',
                90,
                0,
                undefined,
                true,
              );
            } catch (e) {
              const dimensions: {width: number; height: number} =
                await new Promise(resolve => {
                  Image.getSize(image, (width, height) => {
                    resolve({width, height});
                  });
                });

              return {
                uri: image,
                width: dimensions.width,
                height: dimensions.height,
              };
            }
          }),
        );

      imagesVar.current = paths;
      navigation.navigate('SaveDocument');
    }
  };

  useEffect(() => {
    if (!imagesVar.current?.length) {
      scanDocument();
    } else {
      imagesVar.current = [];
    }
  }, []);

  return (
    <Landing
      title="Le scanner devrait s'ouvrir automatiquement. Sinon cliquez sur le bouton ci-dessous."
      subtitle="Pour de meilleurs résultats lors du scan, évitez de poser la feuille sur un fond de la même couleur que le document."
      button={
        <View
          style={{
            width: '100%',
            height: 80,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 20,
          }}>
          <Button
            onPress={() => navigation.navigate('Settings')}
            icon={faCog}
            size={60}
          />
          <Button
            onPress={() => scanDocument()}
            icon={faCamera}
            size={80}
            margin={0}
          />
          <Button
            onPress={() => navigation.navigate('Documents')}
            icon={faList}
            size={60}
          />
        </View>
      }
    />
  );
};

export default ScannerScreen;
