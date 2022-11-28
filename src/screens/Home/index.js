import { React, useEffect, useState } from "react";
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

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
            <View style={{flex: 1}}>
                <FlatList
                    data={busBookmarkData}
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={() => console.log(item.routeno)}/*ref.current.clearSearch()*/ >
                            <View style={styles.row}>

                                {/* 아이콘 */}
                                <View style={styles.iconContainer_bus}>
                                    <MaterialCommunityIcons name={"bus"} size={35} color='#77dd77'  />
                                </View>

                                {/* 텍스트 */}
                                <Text style={styles.title}>{item.routeno + ' 번  '} </Text>
                                <Text style={styles.text}> {item.startnodenm + '\n ' + item.endnodenm}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                />
            </View>
            <View style={styles.bookmark}>
                <FlatList
                    data={busStopBookmarkData}
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={() => navigation.navigate('Result', { nodeid: item.nodeid, nodenm: item.nodenm })}/*ref.current.clearSearch()*/ >
                            <View style={styles.row}>

                                {/* 아이콘 */}
                                <View style={styles.iconContainer_busstop}>
                                    <MaterialCommunityIcons name={"bus-stop"} size={40} color='#77dd77'  />
                                </View>

                                {/* 텍스트 */}
                                <Text style={styles.text_busstop}>{item.nodenm}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                />
            </View>
        </SafeAreaView>
    
    );
}

export default Index;

const styles = StyleSheet.create({
    bookmark: {
        borderTopWidth: 5,
        borderTopColor: '#A9CBD7',
        backgroundColor: '#fff',
        height: 130,
        flex: 1,
    },
    title: {
        textAlign: 'center',
        textAlignVertical: 'center',
        // fontWeight: "bold",
        fontSize: 20,
    },
    text: {
        textAlign: 'left',
        textAlignVertical: 'center',
        // fontWeight: "bold",
        fontSize: 12,
    },
    text_busstop: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 15,
      },
      iconContainer_bus: {
        // backgroundColor: '#77dd77',
        padding: 7,
        borderRadius: 10,
        marginLeft: 15,
        marginRight: 5,
      },
      iconContainer_busstop: {
            // backgroundColor: '#77dd77',
            padding: 7,
            borderRadius: 10,
            marginLeft: 10,
            marginRight: 15,
          },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: 'lightgrey',
    },
    textContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyData: {
        textAlign: 'center',
        color: "#888",
    }
});