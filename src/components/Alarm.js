import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Octicons } from '@expo/vector-icons'
import * as Notifications from 'expo-notifications';
import {Picker} from '@react-native-picker/picker';

const Alarm = ({ data }) => {
    const [alarm, setAlarm] = useState(false);

    const isAlarm = () => {
        setAlarm(!alarm);
    };
      
    const setAlarmTime = () => {
        Alert.alert(
            "시간을 설정하세요",
            "",
            [
                {
                    text: "5분전",
                    onPress: () => console.log("5"),
                },
                {
                    text: "3분전",
                    onPress: () => console.log("3"),
                }
            ],
        );
    };
    return (
        <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20 }} >
            <TouchableOpacity onPress={() => {isAlarm(); Notifications.scheduleNotificationAsync({
                content: {
                    title: "알림",
                    body: '버스 도착' + + '분 전 입니다.',
                },
                trigger: {
                    seconds: 3,
                },
            });}}>
                <Octicons
                    name={alarm ? 'bell-fill' : 'bell'}
                    size={25}
                    color="#FBCB74"
                />
            </TouchableOpacity>
        </View>
    );
};

export default Alarm;