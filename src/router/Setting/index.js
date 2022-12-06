import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

//screens
import Setting from 'screens/Setting/index';
import BusRoute from 'screens/Bus/busRoute';

const Stack = createStackNavigator();
// const topTab = createMaterialTopTabNavigator();
// const Tabs = () => {
//   return (
//     <topTab.Navigator>
//       <topTab.Screen name="디지털관" component={Setting} />
//       <topTab.Screen name="구미역" component={Setting} initialParams={{location: "digital"}} />
//     </topTab.Navigator>
//   );
// };
export default function Index() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                options={{
                    title: '경로',
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
                    unmountOnBlur: true
                  }}
                name="Setting"
                component={Setting}
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