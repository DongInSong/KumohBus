import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl } from "react-native";
import { getArrivalData } from "utils/api"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList } from "react-native-gesture-handler";
import routeData from 'config/route.json';
import Alarm from 'components/Alarm';
import style from 'styles/Style';

const Result = ({ route, navigation }) => {
    const { nodeid } = route?.params || {};
    const { nodenm } = route?.params || {};
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(true); // https://blog.expo.dev/react-native-pull-to-refresh-make-refreshing-easy-for-users-813088732c4f

    var jp = require('jsonpath'); // json 검색용 변수 https://github.com/dchester/jsonpath

    const getData = async () => {
        setLoading(true);
        try {
            const res = await getArrivalData(nodeid);
            setRefreshing(false);
            setLoading(false);
            setData(res);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={style.textContainer}>
                    <Text style={style.emptyData}> 불러오는 중.. </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!data) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <ScrollView
                    contentContainerStyle={style.textContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={getData} />
                    }
                >
                    <Text style={style.emptyData}> 도착 예정 버스가 없습니다. </Text>
                </ScrollView>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            {refreshing ? <ActivityIndicator /> : null}
            <FlatList
                data={data}
                extraData={data}
                renderItem={({ item }) =>
                // {jp.query(routeData, '$..[?(@.routeno==' + item.routeno + ')]').length > 1 && 
                    <TouchableOpacity onPress={() => {jp.query(routeData, '$..[?(@.routeno==' + item.routeno + ')]').length > 1 ? navigation.navigate('BusRoute', { routeid: item.routeid, routeno: item.routeno }) : ""}}>
                        
                        <View style={style.row}>

                            {/* 아이콘 */}
                            <View style={style.iconContainer_bus}>
                                <MaterialCommunityIcons name={"bus"} size={35} color={jp.query(routeData, '$..[?(@.routeno==' + item.routeno + ')]').length > 1 ? '#10b6f6' : '#77dd77'} />
                            </View>

                            {/* 텍스트 */}
                            <Text style={style.title}>{item.routeno + ' 번  '}</Text>
                            <Text style={style.text}>  남은 정거장: {item.arrprevstationcnt > 1 ? item.arrprevstationcnt + '개' : '전 정류장'}
                                <Text style={style.text}>{'\n'}  도착 예정 시간: <Text style={(Math.round(item.arrtime / 60)) > 5 ? [style.text] : [style.text_alart]}>{(Math.round(item.arrtime / 60))} 분 전</Text></Text>
                            </Text>

                            {/* 즐겨찾기 버튼 */}
                            {(Math.round(item.arrtime / 60)) > 5 &&
                                <Alarm
                                    routeno={item.routeno}
                                    arrtime={item.arrtime}
                                    nodeid={nodeid}
                                    routeid={item.routeid}
                                ></Alarm>
                            }
                        </View>
                    </TouchableOpacity>
                }

                keyExtractor={(item) => String(item.routeid)}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={getData} />
                }
            />
        </SafeAreaView>
    );
};

export default Result;
