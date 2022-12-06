import React from 'react';
import { TextInput } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

//screens
import BusStop from 'screens/BusStop/index';
import Result from 'screens/BusStop/result';
import BusRoute from 'screens/Bus/busRoute';

const Stack = createStackNavigator();
export default function Index() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          title: '정류장',
          // Header 블록에 대한 스타일
          headerStyle: {
            backgroundColor: '#29b6f6',
          },
          // Header의 텍스트, 버튼 색상
          headerTintColor: '#ffffff',
          // 타이틀 텍스트의 스타일
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerTitleContainerStyle: {
            margin: 10
          }
        }}
        name="BusStop"
        component={BusStop}
      />
      <Stack.Screen
        options={({ route }) => ({
          title: route.params.nodenm,
          // Header 블록에 대한 스타일
          headerStyle: {
            backgroundColor: '#29b6f6',
          },
          // Header의 텍스트, 버튼 색상
          headerTintColor: '#ffffff',
          // 타이틀 텍스트의 스타일
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,

          },
        }
        )}
        name="Result"
        component={Result}
      />
      <Stack.Screen
        options={({ route }) => ({
          title: route.params.routeno + '번',
          // Header 블록에 대한 스타일
          headerStyle: {
            backgroundColor: '#29b6f6',
          },
          // Header의 텍스트, 버튼 색상
          headerTintColor: '#ffffff',
          // 타이틀 텍스트의 스타일
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        })}
        name="BusRoute"
        component={BusRoute}
      />
    </Stack.Navigator>
  );
}