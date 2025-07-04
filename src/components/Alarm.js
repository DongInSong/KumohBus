import * as Device from 'expo-device';
import React, { useState, useEffect, useRef } from 'react';
import { Alert, ScrollView, Animated, Dimensions, Modal, PanResponder, Pressable, Button, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { Octicons } from '@expo/vector-icons'
import * as Notifications from 'expo-notifications';
import { getTargetArrivalData } from "utils/api"
import style from 'styles/Style';
import { Picker } from '@react-native-picker/picker';

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
    const [selectedTime, setSelectedTime] = useState('420');

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

    async function schedulePushNotification(routeno, arrtime) {
        if (arrtime > selectedTime) {
            try {
                console.log(routeno + " " + arrtime + " " + selectedTime)
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "KIT BUS",
                        body: routeno + '번 버스가 ' + (Math.round(selectedTime / 60)) + '분 뒤에 도착합니다',
                    },
                    trigger: null
                    // trigger: { seconds: parseInt(data[0]['arrtime']) - selectedTime },
                });
                Alert.alert("알림이 설정되었습니다.");
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
            Alert.alert("도착 예정 시간보다 빠른 시간을 설정할 수 없습니다.");
            setAlarm(false);
        }
        setSelectedTime('420');
    }


// text: "확인", onPress: () => { schedulePushNotification(routeno, arrtime); setIsModalVisible(false); }

// const MinButton = (props) => {
//     state = {
//         isSelected: false,
//       }

//       setSelected = () => {
//         this.setState({
//           isSelected: !this.state.isSelected
//         })
//       }
//     const { min, setMin, isSelected } = props
//     return (
//         <TouchableOpacity
//             id="minButton"
//             className={isSelected ? 'selected' : ''}
//             style={modalInnerStyle.modalBtn}
// onPress={() => {
//     Alert.alert("확인", "알람을 설정하시겠습니까?",
//         [
//             {
//                 text: "확인", onPress: () => { setMin(min); setIsModalVisible(false); }
//             },
//             {
//                 text: "취소", onPress: () => setIsModalVisible(false)
//             }
//         ])
// }}>
//             <Text style={modalInnerStyle.btnText}>{i}분</Text>
//         </TouchableOpacity>
//     )
// }
const isAlarm = async () => {
    if (!alarm) {
        setIsModalVisible(!isModalVisible);
        // await getData();
    }
    setAlarm(!alarm);
};
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
                style={style.modalOverlay}
                onPress={() => { setIsModalVisible(!isModalVisible), isAlarm(false), setSelectedTime('420') }}
            >
                <TouchableWithoutFeedback>
                    <Animated.View
                        style={{
                            ...style.bottomSheetContainer,
                            transform: [{ translateY: translateY }]
                        }}
                        {...panResponder.panHandlers}>

                        {/* 모달에 들어갈 내용을 아래에 작성 */}
                        <Text style={style.AlarmTitle}>알람 설정</Text>
                        <Picker
                            selectedValue={selectedTime}
                            // numberOfLines = {4}
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedTime(itemValue)
                            }>
                            <Picker.Item label="5분 전" value="300" />
                            <Picker.Item label="6분 전" value="360" />
                            <Picker.Item label="7분 전" value="420" />
                            <Picker.Item label="8분 전" value="480" />
                            <Picker.Item label="9분 전" value="540" />
                            <Picker.Item label="10분 전" value="600" />
                        </Picker>
                        <View style={style.textContainer}>
                            <TouchableOpacity
                                style={style.modalBtn}
                                onPress={() => {
                                    Alert.alert("확인", "알람을 설정하시겠습니까?",
                                        [
                                            {
                                                text: "확인", onPress: () => { setIsModalVisible(false), schedulePushNotification(routeno, arrtime) }
                                            },
                                            {
                                                text: "취소", onPress: () => { setIsModalVisible(false), isAlarm(false), setSelectedTime('420') }
                                            }
                                        ])
                                }}>
                                <Text style={style.btnText}>설정</Text>
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
        
    } else {
        alert('Must use physical device for Push Notifications');
    }
    return token;
}


