import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function ButtonPrimary({ title, color } :any) {
  return (
    <View>
        <TouchableOpacity style={{ padding: 20, backgroundColor: 'red'}}>
            <Text>{title}</Text>
        </TouchableOpacity>
    </View>
  )
}