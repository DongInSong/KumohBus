import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

//screens
import walk from 'screens/Setting/walk';
import bicycle from 'screens/Setting/bicycle';
import kickboard from 'screens/Setting/kickboard';

const Stack = createStackNavigator();
const topTab = createMaterialTopTabNavigator();

const Tabs = () => {
  return (
    <topTab.Navigator>
      <topTab.Screen name="도보" component={walk} />
      <topTab.Screen name="자전거" component={bicycle} />
      <topTab.Screen name="킥보드" component={kickboard} />
    </topTab.Navigator>
  );
};

export default function Index() {
    return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          title: '정류장까지 소요시간',
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
        name="Setting"
        component={Tabs}
      />
        </Stack.Navigator>
    );
}