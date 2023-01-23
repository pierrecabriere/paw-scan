import React from 'react';
import Button from '../components/Button';
import {requestCamera} from '../lib/utils';
import Permissions from 'react-native-permissions';
import Landing from '../components/Landing';

const LandingScreen: React.FunctionComponent<{
  allowed: string;
  onAllow: (a: string) => void;
}> = ({allowed, onAllow}) => {
  return (
    <Landing
      title={
        allowed === 'blocked'
          ? "Pour continuer, vous devez autoriser l'autorisation de la caméra dans les paramètres de l'application."
          : "Pour commencer vous devez autoriser l'utilisation de la caméra."
      }
      subtitle="Pour de meilleurs résultats lors du scan, évitez de poser la feuille sur un fond de la même couleur que le document."
      button={
        allowed === 'blocked' ? (
          <Button
            margin={0}
            onPress={() => Permissions.openSettings()}
            label="Paramètres"
          />
        ) : (
          <Button
            margin={0}
            onPress={() => requestCamera().then(onAllow)}
            label="Autoriser"
          />
        )
      }
    />
  );
};

export default LandingScreen;
