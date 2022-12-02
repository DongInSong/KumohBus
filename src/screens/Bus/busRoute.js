import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, RefreshControl, SafeAreaView } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import style from '/styles/Style';
import { routeStn } from 'config/api';
import { getAllLocation } from "utils/api"

const BusRoute = ({ route }) => {
    const { routeid } = route?.params || {};
    const { routeno } = route?.params || {};
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(true);
    const [bus, setBus] = useState();

    const getData = async () => {
        await getBus();
        setLoading(true);
        try {
            const res = await fetch(`${routeStn}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "keyword": routeid,
                }),
            });
            const resJson = await res.json();
            const newRes = resJson.data[0].item;
            setRefreshing(false);
            setLoading(false);
            setData(newRes);
        } catch (error) {
            console.log(error);
        }
    };

    const getBus = async () => {
        let newRes;
        const resBus = await getAllLocation(routeid);
        if (resBus.items.item) {
            newRes = resBus.items.item;
            console.log(Array.isArray(newRes));
        }
        else {
            newRes = { nodeord:99 };
        }
        setBus(newRes);
    }

    useEffect(() => {
        getData();
    }, []);

    // 현재 버스 인덱스로 이동?

    const scroll = () => {
        if (this.flatListRef.current) {
            this.flatListRef.current.scrollToIndex({
                index: 10,
                animated: true
            })
        }
    }

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
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <FlatList
                data={data}
                // ref={(ref) => { this.flatListRef = ref; }}
                renderItem={({ item, index }) =>
                <View style={style.route}>
                        <View style={style.iconContainer_busstop}>
                            {item.nodeord === bus.nodeord &&
                                <MaterialCommunityIcons
                                    name="bus"
                                    color="#77dd77"
                                    size={30} />
                            }
                            {item.nodeord < bus.nodeord &&
                                <MaterialCommunityIcons
                                    name="arrow-down-drop-circle-outline"
                                    color="#999"
                                    size={30} />
                            }
                            {item.nodeord > bus.nodeord &&
                                <MaterialCommunityIcons
                                    name="arrow-down-drop-circle-outline"
                                    color="#77dd77"
                                    size={30} />
                            }
                        </View>
                        <Text style={item.nodeord === bus.nodeord ? style.text_currentLoc : style.text_route}>{item.nodenm}</Text>
                    </View>
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={getData} />
                }
            />
        </View>
    );
}

export default BusRoute;