import {SafeAreaView} from 'react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import React, {useCallback} from 'react';
import {useAsyncStorage} from '../lib/utils';
import ConfigurationsList from './ConfigurationsList';

const BottomSheetSelectConfiguration: React.FunctionComponent<any> = ({
  sheetRef,
  navigation,
}) => {
  const [, setCurrentConfiguration] = useAsyncStorage<{value: string}>(
    'currentConfiguration',
    null,
  );

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
        <ConfigurationsList
          addConfiguration={() => {
            navigation.navigate('SettingsAdd', {
              redirect: 'SaveDocument',
            });
            sheetRef.current?.close();
          }}
          onItemPress={async (item: any) => {
            await setCurrentConfiguration({value: item.uid});
            sheetRef.current?.close();
          }}
        />
      </SafeAreaView>
    </BottomSheet>
  );
};

export default BottomSheetSelectConfiguration;
