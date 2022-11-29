import * as Device from 'expo-device';
import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity } from 'react-native'
import { Octicons } from '@expo/vector-icons'
import * as Notifications from 'expo-notifications';
import { getTargetArrivalData } from "utils/api"

const Alarm = ({ routeno, arrtime, nodeid, routeid }) => {
    const [alarm, setAlarm] = useState(false);
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const [data, setData] = useState([]);
    const notificationListener = useRef();
    const responseListener = useRef();

    // 정류장 아이디, 버스 아이디로 조회해서 남은 시간 조회
    const getData = async () => {
        try {
            const res = await getTargetArrivalData(nodeid, routeid);
            setData(res);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const isAlarm = async () => {
        setAlarm(!alarm);
        if (!alarm) {
            getData();
            await schedulePushNotification(routeno, arrtime);
            console.log(routeno + " " + arrtime + "알람 설정");
        }
    };

    const trigger = () => {
        if (400 > 300) {
            console.log(data[0].arrtime);
            return null;
        }
        else return null;
    };

    async function schedulePushNotification(routeno, arrtime) {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "도착 알림",
                    body: routeno + '번 버스가 ' + (Math.round(arrtime / 60)) + '분 뒤에 도착합니다',
                },
                trigger: trigger(),
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20 }} >
            <TouchableOpacity onPress={() => {
                isAlarm();
            }}>
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

async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }
    return token;
}


