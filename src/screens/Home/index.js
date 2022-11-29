import { React, useEffect, useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import style from 'styles/Style';

const Index = ({ navigation }) => {
    const [busBookmarkData, setBusBookmarkData] = useState([]);
    const [busStopBookmarkData, setBusStopBookmarkData] = useState([]);
    const isFocused = useIsFocused(); // isFoucesd Define

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

    useEffect(() => {
        setBusStopData();
        setBusData();
    }, [isFocused]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={busBookmarkData}
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={() => console.log(item.routeno)}/*ref.current.clearSearch()*/ >
                            <View style={style.row}>

                                {/* 아이콘 */}
                                <View style={style.iconContainer_bus}>
                                    <MaterialCommunityIcons name={"bus"} size={35} color='#77dd77' />
                                </View>

                                {/* 텍스트 */}
                                <Text style={style.title}>{item.routeno + ' 번  '} </Text>
                                <Text style={style.text}> {item.startnodenm + '\n ' + item.endnodenm}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                />
            </View>
            <View style={style.bookmark}>
                <FlatList
                    data={busStopBookmarkData}
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
            </View>
        </SafeAreaView>

    );
}

export default Index;