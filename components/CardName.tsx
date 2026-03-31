import React from 'react';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CardNameProps {
  source?: string;
  titleImage?: string;
  title?: string;
}

export default function CardName({ source, titleImage, title }: CardNameProps) {
  return (
    <SafeAreaView>
      <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 8 }}>
        {titleImage && <Image source={{ uri: titleImage }} style={{ width: '100%', height: 200, borderRadius: 8 }} />}
        {title && <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 12 }}>{title}</Text>}
        {source && <Text style={{ fontSize: 14, color: '#666', marginTop: 8 }}>{source}</Text>}
      </View>
    </SafeAreaView>
  );
}
