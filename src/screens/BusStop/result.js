import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl } from "react-native";
import { getArrivalData } from "utils/api"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList } from "react-native-gesture-handler";
import routeData from 'config/route.json';
import Alarm from 'components/Alarm';

const Result = ({ route }) => {
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
                <View style={styles.textContainer}>
                    <Text style={styles.emptyData}> 불러오는 중.. </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!data) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <ScrollView
                    contentContainerStyle={styles.textContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={getData} />
                    }
                >
                    <Text style={styles.emptyData}> 도착 예정 버스가 없습니다. </Text>
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
                    <TouchableOpacity onPress={() => console.log(item.routeno)/*클릭 이벤트(네비게이션 추가)*/}>
                        <View style={styles.row}>

                            {/* 아이콘 */}
                            <View style={styles.iconContainer}>
                                {/* routeData내에 존재하는 버스일 경우 파란색 (학교행) */}
                                <MaterialCommunityIcons name={"bus"} size={35} color={jp.query(routeData, '$..[?(@.routeno==' + item.routeno + ')]').length > 1 ? '#10b6f6' : '#77dd77'} />
                            </View>

                            {/* 텍스트 */}
                            <Text style={styles.title}>{item.routeno + ' 번  '}</Text>
                            <Text style={styles.text}>  남은 정거장: {item.arrprevstationcnt > 1 ? item.arrprevstationcnt + '개' : '전 정류장'}
                                <Text style={styles.text}>{'\n'}  도착 예정 시간: <Text style={(Math.round(item.arrtime / 60)) > 5 ? [styles.text] : [styles.text_alart]}>{(Math.round(item.arrtime / 60))} 분 전</Text></Text>
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

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderColor: '#10b6f6',
        borderRadius: 20,
        width: '95%',
        marginTop: 10,
        marginBottom: 5,

        padding: 5,
    },
    textContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        textAlign: 'left',
        textAlignVertical: 'center',
        // fontWeight: "bold",
        fontSize: 20,
    },
    BusNum: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold',
        fontSize: 25,
    },
    text: {
        fontSize: 13,
    },
    text_alart: {
        color: '#b53737',
        fontWeight: 'bold',
        fontSize: 15,
    },
    emptyData: {
        textAlign: 'center',
        color: "#888",
    },
    iconContainer: {
        // backgroundColor: '#77dd77',
        padding: 7,
        borderRadius: 10,
        marginLeft: 15,
        marginRight: 5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: 'lightgrey',
    },
});

