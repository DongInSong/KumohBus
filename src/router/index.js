import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//stacks
import HomeStack from "router/Home/index";
import BusStopStack from "router/BusStop/index";
import BusStack from "router/Bus/index";
import SettingStack from "router/Setting/index";

import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const Root = ({ navigation }) => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarStyle: [
                        {
                            display: "flex"
                        },
                        null
                    ]
                }}
            >
                <Tab.Screen
                    name="홈"
                    component={HomeStack}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                name="ios-home"
                                style={{ color: focused ? "#29b6f6" : "#404040" }}
                                size={30}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="버스"
                    component={BusStack}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <FontAwesome
                                name="bus"
                                style={{ color: focused ? "#29b6f6" : "#404040" }}
                                size={30}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="정류장"
                    component={BusStopStack}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <MaterialCommunityIcons
                                name="bus-stop"
                                style={{ color: focused ? "#29b6f6" : "#404040" }}
                                size={43}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="경로"
                    component={SettingStack}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                name="ios-map"
                                style={{ color: focused ? "#29b6f6" : "#404040" }}
                                size={30}
                            />
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default function Index() {
    return (
       <Root />
    );
};
