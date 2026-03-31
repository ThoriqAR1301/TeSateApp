import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonPrimary from './ButtonPrimary';

interface CardNameProps {
  source?: string;
  titleImage?: string;
}

export default function CardName({ source, titleImage }: CardNameProps) {
  return (
    <SafeAreaView>
      <View>
        <ButtonPrimary title="Submit" color="red" />
        <CardName source="" titleImage="John Doe" />
      </View>
    </SafeAreaView>
  );
}
