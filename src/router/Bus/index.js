import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

//screens
import Bus from 'screens/Bus/index';
import Kumoh from 'screens/Bus/kumoh';
import GumiStn from 'screens/Bus/gumiStn';
import BusRoute from 'screens/Bus/busRoute';

const Stack = createStackNavigator();
const topTab = createMaterialTopTabNavigator();
const Tabs = () => {
  return (
    <topTab.Navigator>
      <topTab.Screen name="금오공대" component={Kumoh} />
      <topTab.Screen name="구미역" component={GumiStn} />
    </topTab.Navigator>
  );
};
export default function Index() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          title: '버스',
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
        }}
        name="Bus"
        component={Tabs}
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