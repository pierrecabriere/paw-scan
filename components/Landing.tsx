import React from 'react';
import {Image, ImageBackground, Text, View} from 'react-native';
// @ts-ignore
import imageBg from '../assets/landing-bg.png';
// @ts-ignore
import imageLogo from '../assets/logo.png';

const Landing: React.FunctionComponent<{
  title: string;
  subtitle: string;
  button?: any;
}> = ({title, subtitle, button}) => {
  return (
    <ImageBackground
      source={imageBg}
      resizeMode="cover"
      style={{
        height: '100%',
        width: '100%',
      }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          padding: '10%',
        }}>
        <Text
          style={{
            fontWeight: '800',
            marginBottom: '2%',
            fontSize: 30,
            textAlign: 'center',
            color: '#fff',
          }}>
          Bienvenue sur l'application
        </Text>
        <Image
          source={imageLogo}
          resizeMode="contain"
          style={{
            height: '30%',
            width: '100%',
          }}
        />
        <Text
          style={{
            fontWeight: '800',
            marginBottom: '25%',
            fontSize: 24,
            textAlign: 'center',
            color: '#fff',
          }}>
          paw scan
        </Text>

        <Text
          style={{
            fontWeight: '500',
            marginBottom: '10%',
            fontSize: 20,
            textAlign: 'center',
            color: '#fff',
            opacity: 0.8,
          }}>
          {title}
        </Text>
        <Text
          style={{
            fontWeight: '400',
            marginBottom: '10%',
            fontSize: 16,
            textAlign: 'center',
            color: '#fff',
            opacity: 0.5,
          }}>
          {subtitle}
        </Text>

        {button}
      </View>
    </ImageBackground>
  );
};

export default Landing;
