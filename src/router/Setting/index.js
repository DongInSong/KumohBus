import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//screens
import Setting from 'screens/Setting/index';

const Stack = createStackNavigator();
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
        </Stack.Navigator>
    );
}