import * as Device from 'expo-device';
import React, { useState, useEffect, useRef } from 'react';
import { Alert, Animated, Dimensions, Modal, PanResponder, Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { Octicons } from '@expo/vector-icons'
import * as Notifications from 'expo-notifications';
import { getTargetArrivalData } from "utils/api"

const Alarm = ({ routeno, arrtime, nodeid, routeid }) => {
    const [alarm, setAlarm] = useState(false);
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    const screenHeight = Dimensions.get('screen').height;
    const panY = useRef(new Animated.Value(screenHeight)).current;
    const translateY = panY.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [-1, 0, 1]
    });
    const resetBottomSheet = Animated.timing(panY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
    });
    const closeBottomSheet = Animated.timing(panY, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true
    });
    const panResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gestureState) => panY.setValue(gestureState.dy),
        onPanResponderRelease: (event, gestureState) => {
            if (gestureState.dy > 0 && gestureState.vy > 1.5) {
                closeModal();
            } else {
                resetBottomSheet.start();
            }
        }
    })).current;

    const closeModal = () => {
        closeBottomSheet.start(() => setIsModalVisible(false));
    }


    // 정류장 아이디, 버스 아이디로 조회해서 남은 시간 조회
    const getData = async () => {
        return new Promise(async (resolve, reject) => {
            const res = await getTargetArrivalData(nodeid, routeid);
            setData(res);
            resolve();
        })
    };

    useEffect(() => {
        if (isModalVisible) {
            resetBottomSheet.start();
        }
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
    }, [isModalVisible]);

    const isAlarm = async () => {
        setAlarm(!alarm);
        if (!alarm) {
            setIsModalVisible(!isModalVisible);
            await getData();
        }
    };

    async function schedulePushNotification(routeno, arrtime) {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "도착 알림",
                    body: routeno + '번 버스가 ' + (Math.round(arrtime / 60)) + '분 뒤에 도착합니다',
                },
                // trigger: { seconds: parseInt(data[0]['arrtime']) - 300 },
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20 }} >
            <TouchableOpacity onPress={() => isAlarm()}>
                <Octicons
                    name={alarm ? 'bell-fill' : 'bell'}
                    size={25}
                    color={"#FBCB74"}
                />
            </TouchableOpacity>
            <Modal
                visible={isModalVisible}
                animationType={"slide"}
                transparent={true}
                statusBarTranslucent={true}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setIsModalVisible(!isModalVisible)}
                >
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={{
                                ...styles.bottomSheetContainer,
                                transform: [{ translateY: translateY }]
                            }}
                            {...panResponder.panHandlers}>

                            {/* 모달에 들어갈 내용을 아래에 작성 */}
                            <View>
                                <Text style={modalInnerStyle.AlarmTitle}>알람 설정</Text>

                                <TouchableOpacity
                                    style={modalInnerStyle.modalBtn}
                                    onPress={() => {
                                        Alert.alert("확인", "알람을 설정하시겠습니까?", 
                                        [
                                            { text: "확인", onPress: () => {schedulePushNotification(routeno, arrtime); setIsModalVisible(false);} 
                                        }, {
                                            text: "취소",onPress: () =>  {isAlarm(); setIsModalVisible(false);}
                                        }
                                    ])}}>
                                    <Text style={modalInnerStyle.btnText}>5분전</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={modalInnerStyle.modalBtn}
                                    onPress={() => {
                                        Alert.alert("확인", "알람을 설정하시겠습니까?", [{ text: "확인",onPress: () => {schedulePushNotification(routeno, arrtime); setIsModalVisible(false);} }, { text: "취소", onPress: () => console.log('알람') }])
                                    }}>
                                    <Text style={modalInnerStyle.btnText}>10분전</Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </Pressable>
            </Modal>
        </View>
    );
};

export default Alarm;


const styles = StyleSheet.create({
    flexible: {
        flex: 1
    },  // flex 속성 지정
    alignContentsCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },  // 가로세로 중앙정렬
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
    },  // 모달이 띄워졌을 때 화면을 어둡게 하기 위한 오버레이
    bottomSheetContainer: {
        height: 300,
        backgroundColor: '#fff',
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        padding: 20
    },  // 모달 스타일
})

const modalInnerStyle = StyleSheet.create({
    AlarmTitle: {
        fontSize: 22,
        fontWeight: '700'
    },
    coin: {
        fontSize: 17,
        fontWeight: '700',
        paddingTop: 10,
        textAlign: 'right'
    },
    modalBtn: {
        padding: 10,
        backgroundColor: '#4852c7',
        borderRadius: 7,
        marginTop: 10,
        marginBottom: 10
    },   // 모달 내 결제버튼
    btnText: {
        padding: 6,
        fontSize: 17,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center'
    },
    warningText: {
        color: '#f00',
        textAlign: 'center',
        fontSize: 16,
    }
})

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


