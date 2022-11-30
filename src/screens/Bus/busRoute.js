import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View, Text, RefreshControl, SafeAreaView } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import style from '/styles/Style';
import { routeStn } from 'config/api';

const BusRoute = ({ route }) => {
    const { routeid } = route?.params || {};
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(true);

    const getData = async () => {
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

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <FlatList
                data={data}
                renderItem={({ item }) =>
                    <View style={style.route}>
                        <View style={style.iconContainer_busstop}>
                            <MaterialCommunityIcons name={"arrow-down-drop-circle-outline"} size={30} />
                        </View>
                        <Text style={style.text_busstop}>{item.nodenm}</Text>
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