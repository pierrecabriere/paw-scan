import React from 'react';
import {
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  View,
  StyleProp,
} from 'react-native';
import {COLORS} from '../lib/enums';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import LinearGradient from 'react-native-linear-gradient';
import {
  faCog,
  faCrosshairs,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

const Button: React.FunctionComponent<{
  label?: string;
  onPress: () => void;
  size?: number;
  icon?: IconDefinition;
  rounded?: boolean;
  disabled?: boolean;
  children?: any;
  margin?: string | number;
  theme?: 'flat' | 'inverse';
  color?: any;
  spin?: boolean;
}> = ({
  label,
  onPress,
  size,
  icon,
  rounded,
  disabled,
  children,
  margin,
  theme,
  color,
  spin,
}) => {
  size = size ?? undefined;
  margin = margin ?? '4%';
  color = color ?? COLORS.PRIMARY;

  rounded = rounded ?? (icon && !label);

  const spinValue = new Animated.Value(0);

  const startSpin = () => {
    spinValue.setValue(0);

    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => startSpin());
  };

  if (spin) {
    startSpin();
  }

  const baseStyle: StyleProp<any> = {
    height: size ?? 'auto',
    borderRadius: size ?? 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: disabled ? 0.5 : 1,
    backgroundColor: theme === 'flat' ? color : 'transparent',
  };

  const sizeStyle: StyleProp<any> = rounded
    ? {
        width: size ?? 40,
      }
    : {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
      };

  const iconStyle: StyleProp<any> = {
    marginRight: label || children ? '2%' : 0,
  };

  const fontStyle: StyleProp<any> = {
    color: theme === 'inverse' ? color : '#fff',
    fontWeight: theme === 'flat' ? '400' : '800',
    fontSize: theme === 'flat' ? 14 : 20,
  };

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  switch (theme) {
    case 'inverse':
      return (
        <TouchableOpacity
          onPress={() => !disabled && onPress()}
          style={{
            shadowColor: '#171717',
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.3,
            shadowRadius: 7,
            margin,
          }}>
          <View style={[baseStyle, sizeStyle]}>
            {icon ? (
              <Animated.View style={{transform: [{rotate}]}}>
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <FontAwesomeIcon
                    icon={icon}
                    style={[iconStyle, fontStyle]}
                    size={(size ?? 1) * 0.5}
                  />
                </View>
              </Animated.View>
            ) : null}
            {label !== undefined ? (
              <Text style={fontStyle}>{label}</Text>
            ) : null}
            {children}
          </View>
        </TouchableOpacity>
      );
    case 'flat':
      return (
        <TouchableOpacity
          onPress={() => !disabled && onPress()}
          style={{
            margin,
          }}>
          <View style={[baseStyle, sizeStyle]}>
            {icon ? (
              <Animated.View style={{transform: [{rotate}]}}>
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '2%',
                  }}>
                  <FontAwesomeIcon
                    icon={icon}
                    style={[iconStyle, fontStyle]}
                    size={(size ?? 30) * 0.5}
                  />
                </View>
              </Animated.View>
            ) : null}
            {label !== undefined ? (
              <Text style={fontStyle}>{label}</Text>
            ) : null}
            {children}
          </View>
        </TouchableOpacity>
      );
    default:
      return (
        <TouchableOpacity
          onPress={() => !disabled && onPress()}
          style={{
            shadowColor: '#171717',
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.3,
            shadowRadius: 7,
            margin,
          }}>
          <LinearGradient
            colors={['#3899C6', '#326176C9']}
            style={[baseStyle, sizeStyle]}>
            {icon ? (
              <Animated.View style={{transform: [{rotate}]}}>
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <FontAwesomeIcon
                    icon={icon}
                    style={[iconStyle, fontStyle]}
                    size={(size ?? 30) * 0.5}
                  />
                </View>
              </Animated.View>
            ) : null}
            {label !== undefined ? (
              <Text style={fontStyle}>{label}</Text>
            ) : null}
            {children}
          </LinearGradient>
        </TouchableOpacity>
      );
  }
};

export default Button;
