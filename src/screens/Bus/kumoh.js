import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, RefreshControl, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import routeData from 'config/route.json';
import { getCurrentBus, getLocation } from "utils/api"
import Bookmark from '../../components/Bookmark';
import style from 'styles/Style';
import { AndroidImportance } from 'expo-notifications';

const Kumoh = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(true);

  const getData = async () => {
    var res = new Array();
    setLoading(true);
    try {
      setRefreshing(false);
      for (let i = 0; i < Object.keys(routeData).length; i++) {
        console.log(i + ": " + routeData[i]['routeid'])
        res[routeData[i]['routeid']] = await getCurrentBus(routeData[i]['routeid']);
        // res[routeData[i]['routeid']] = 1;
        console.log(res[routeData[i]['routeid']]);
      }
      setData(res);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
    console.log('data : ' + data[[routeData[1]['routeid']]]);
  }, []);

  const renderItem = useCallback(({ item }) =>
    <TouchableOpacity onPress={async () => await getLocation(item.routeid)}/*ref.current.clearSearch()*/ >
      <View style={style.row}>
        {/* 아이콘 */}
        <View style={style.iconContainer_bus}>
          <MaterialCommunityIcons name={"bus"} size={35} color={parseInt(data[item.routeid]) > 0 ? '#77dd77' : "#FF3D33"} />
        </View>

        {/* 텍스트 */}
        <Text style={style.title}>{item.routeno + ' 번  '} </Text>
        <Text style={style.text}> {item.startnodenm + '\n ' + item.endnodenm}</Text>

        {/* 즐겨찾기 버튼 */}
        <Bookmark data={{ item, key: "busBookmarkData" }} />
      </View>
    </TouchableOpacity>, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={style.textContainer}>
          <Text style={style.emptyData}> 불러오는 중.. </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <FlatList
          data={routeData}
          renderItem={({ item }) =>
            <TouchableOpacity onPress={async () => await getLocation(item.routeid)}/*ref.current.clearSearch()*/ >
              <View style={style.row}>
                {/* 아이콘 */}
                <View style={style.iconContainer_bus}>
                  <MaterialCommunityIcons name={"bus"} size={35} color={parseInt(data[item.routeid]) > 0 ? '#77dd77' : "#FF3D33"} />
                </View>

                {/* 텍스트 */}
                <Text style={style.title}>{item.routeno + ' 번  '} </Text>
                <Text style={style.text}> {item.startnodenm + '\n ' + item.endnodenm}</Text>

                {/* 즐겨찾기 버튼 */}
                <Bookmark data={{ item, key: "busBookmarkData" }} />
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
  }
};

export default Kumoh;