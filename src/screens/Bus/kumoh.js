import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, RefreshControl, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import routeData from 'config/Route_kumoh.json';
import { getAllLocation } from "utils/api"
import Bookmark from '../../components/Bookmark';
import style from 'styles/Style';

const Kumoh = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(true);

  const getData = async () => {
    var totalCount = new Array;
    setLoading(true);
    try {
      setRefreshing(false);
      for (let i = 0; i < Object.keys(routeData).length; i++) {
        const res = await getAllLocation(routeData[i]['routeid']);
        if (res) {
          totalCount[routeData[i]['routeid']] = res.totalCount;
          console.log(routeData[i]['routeid'] + ": " + totalCount[routeData[i]['routeid']]);
        }
        else totalCount[routeData[i]['routeid']] = 0;
      }
      setData(totalCount);
      setLoading(false);
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

  if (!loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <FlatList
          data={routeData}
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

                <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 15}} >
                  { parseInt(data[item.routeid]) > 0 ?
                  <Text style={style.text}> {parseInt(data[item.routeid])} 대 운행중 </Text> : <Text></Text>}
                  {/* 즐겨찾기 버튼 */}
                  <Bookmark data={{ item, key: "busBookmarkData" }} />
                </View>
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