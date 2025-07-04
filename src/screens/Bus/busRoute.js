import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, RefreshControl, SafeAreaView } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import style from '/styles/Style';
import { routeStn } from 'config/api';
import { getAllLocation } from "utils/api"

const BusRoute = ({ route, navigation }) => {
    const { routeid } = route?.params || {};
    const { routeno } = route?.params || {};
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(true);
    const [bus, setBus] = useState();
    const [index, setIndex] = useState();
    const flatList = useRef();

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
        console.log(resBus.items);
        if (resBus.items.item) {
            newRes = resBus.items.item;
            // console.log(Array.isArray(newRes));
            setIndex(newRes.nodeord - 1);
        }
        else {
            newRes = { nodeord: 99 };
            setIndex(99);
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
                ref= {flatList}
                data={data}
                // ref={(ref) => { this.flatListRef = ref; }}
                renderItem={({ item, index: fIndex }) =>
                    // <TouchableOpacity onPress={() => navigation.navigate('Result', { nodeid: item.nodeid, nodenm: item.nodenm })}>
                        <View style={style.route}>
                            {/* {console.log(item.nodeid + " " +item.nodenm)} */}
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
                            {!item.nodenm.startsWith("금오공대") && 
                                <Text style={item.nodeord === bus.nodeord ? style.text_currentLoc : style.text_route}>{item.nodenm}</Text>
                            }
                            {item.nodenm.startsWith("금오공대") && 
                                <Text style={item.nodeord === bus.nodeord ? style.text_currentLoc : style.text_kumoh}>{item.nodenm}</Text>
                            }
                        </View>
                    
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={getData} />
                }
                initialScrollIndex = {index}
                onScrollToIndexFailed={() => {
                    const wait = new Promise(resolve => setTimeout(resolve, 500));
                    wait.then(() => {
                        flatList.current?.scrollToIndex({ index: bus.nodeord - 1, animated: true });
                    });
                  }}
            />
        </View>
    );
}

export default BusRoute;