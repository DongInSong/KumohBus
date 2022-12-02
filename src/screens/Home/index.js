import { React, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, RefreshControl, Dimensions, PanResponder, Animated } from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { getAllLocation } from "utils/api"
import '/config/BookmarkConfig'
import style from 'styles/Style';

const Index = ({ navigation }) => {
    const [busBookmarkData, setBusBookmarkData] = useState([]);
    const [busStopBookmarkData, setBusStopBookmarkData] = useState([]);
    const isFocused = useIsFocused(); // isFoucesd Define
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(true);
    const [resize, setResize] = useState({
        offset: 0,
        topHeight: 40, // min height for top pane header
        bottomHeight: 40, // min height for bottom pane header,
        deviceHeight: Dimensions.get('window').height,
        isDividerClicked: false,

        pan: new Animated.ValueXY()
    });

    const getData = async () => {
        var totalCount = new Array;
        setLoading(true);
        try {
            setRefreshing(false);
            for (let i = 0; i < Object.keys(global.busBookmarkData).length; i++) {
                const res = await getAllLocation(global.busBookmarkData[i]['routeid']);
                if (res) {
                    totalCount[global.busBookmarkData[i]['routeid']] = res.totalCount;
                    console.log(global.busBookmarkData[i]['routeid'] + ": " + totalCount[global.busBookmarkData[i]['routeid']]);
                }
                else totalCount[global.busBookmarkData[i]['routeid']] = 0;
            }
            setData(totalCount);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const setBusData = async () => {
        try {
            const value = await AsyncStorage.getItem('busBookmarkData');
            if (value !== null) {
                // console.log(value)
                setBusBookmarkData(JSON.parse(value))
            }
        }
        catch (error) {
            console.log("_retrieveData failed!! " + error);
        }
    }
    const setBusStopData = async () => { // 불러오기
        try {
            const value = await AsyncStorage.getItem('busStopBookmarkData');
            if (value !== null) {
                // console.log(value)
                setBusStopBookmarkData(JSON.parse(value))
            }
        }
        catch (error) {
            console.log("_retrieveData failed!! " + error);
        }
    }

    const panResponder = PanResponder.create({
        onMoveShouldSetResponderCapture: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onStartShouldSetPanResponder: () => true,

        // Initially, set the Y position offset when touch start
        onPanResponderGrant: (e, gestureState) => {
            setResize({
                offset: e.nativeEvent.pageY,
                isDividerClicked: true
            })
        },

        // When we drag the divider, set the bottomHeight (component state) again.
        onPanResponderMove: (e, gestureState) => {
            setResize({
                ...resize,
                bottomHeight: gestureState.moveY > (['deviceHeight'] - 40) ? 40 : resize.deviceHeight - gestureState.moveY,
                offset: e.nativeEvent.pageY
            }, console.log(resize['deviceHeight']))
        },

        onPanResponderRelease: (e, gestureState) => {
            // Do something here for the touch end event
            setResize({
                offset: e.nativeEvent.pageY,
                isDividerClicked: false
            })
        }
    });


    useEffect(() => {
        setBusStopData();
        setBusData();
        getData();
    }, [isFocused]);

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={style.textContainer}>
                    <Text style={style.emptyData}> 불러오는 중.. </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.content}>
            {busBookmarkData.length > 0 ?
                <Animated.View style={{ flex: 1, height: resize.topHeight }}>
                    <FlatList
                        data={busBookmarkData}
                        // data={global.busBookmarkData}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => navigation.navigate('BusRoute', { routeid: item.routeid, routeno: item.routeno })}/*ref.current.clearSearch()*/ >
                                <View style={style.row}>

                                    {/* 아이콘 */}
                                    <View style={style.iconContainer_bus}>
                                        <MaterialCommunityIcons name={"bus"} size={35} color={parseInt(data[item.routeid]) > 0 ? '#77dd77' : "#FF3D33"} />
                                    </View>

                                    {/* 텍스트 */}
                                    <Text style={style.title}>{item.routeno + ' 번  '} </Text>
                                    <Text style={style.text}> {item.startnodenm + '\n ' + item.endnodenm}</Text>
                                </View>
                            </TouchableOpacity>
                        }
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={getData} />
                        }
                    />
                </Animated.View>
                :
                <View style={style.textContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Bus')}/*ref.current.clearSearch()*/ >
                        <Text style={style.emptyData}> 즐겨찾는 '버스'를 추가해 보세요! </Text>
                    </TouchableOpacity>
                </View>
            }

            <View
                style={[{ height: 15 }, resize.isDividerClicked ? { backgroundColor: '#666' } : { backgroundColor: '#e2e2e2' }]}
                {...panResponder.panHandlers}
            >
            </View>


            {busStopBookmarkData.length > 0 ?
                <Animated.View style={{ flex: 1, height: resize.topHeight }}>
                    <FlatList
                        data={busStopBookmarkData}
                        // data={global.busStopBookmarkData}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => navigation.navigate('Result', { nodeid: item.nodeid, nodenm: item.nodenm })}/*ref.current.clearSearch()*/ >
                                <View style={style.row}>

                                    {/* 아이콘 */}
                                    <View style={style.iconContainer_busstop}>
                                        <MaterialCommunityIcons name={"bus-stop"} size={40} color='#77dd77' />
                                    </View>

                                    {/* 텍스트 */}
                                    <Text style={style.text_busstop}>{item.nodenm}</Text>
                                </View>
                            </TouchableOpacity>
                        }
                    />
                </Animated.View>

                :
                <View style={style.textContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('BusStop')}/*ref.current.clearSearch()*/ >
                        <Text style={style.emptyData}> 즐겨찾는 '정류장'을 추가해 보세요! </Text>
                    </TouchableOpacity>
                </View>}
        </View>

    );
}

export default Index;

const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'column'
    },
})