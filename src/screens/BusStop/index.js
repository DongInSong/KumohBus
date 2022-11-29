import React, { useState, useCallback, useRef } from 'react';
import { TextInput, View, Text, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { busStop } from 'config/api';
import Bookmark from '../../components/Bookmark';
import style from 'styles/Style';


const Index = ({ navigation }) => {
  const [searchVal, setSearchVal] = useState("");
  const [data, setData] = useState([]);
  const searchRef = useRef();

  const searchData = async (text) => {
    if(text){
    try {
      setSearchVal(text);
      const res = await fetch(`${busStop}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "keyword": text,
        }),
      });
      const resJson = await res.json();
      console.log(resJson);
      const newRes = resJson.data;
      console.log(newRes);
      setData(newRes);
    } catch (e) {
      console.log(e);
    }
  }
  else setData();
  };

  const renderItem = useCallback(({ item }) => <TouchableOpacity onPress={() => navigation.navigate('Result', { nodeid: item.nodeid, nodenm: item.nodenm })}/*ref.current.clearSearch()*/ >
    <View style={style.row}>

      {/* 아이콘 */}
      <View style={style.iconContainer_busstop}>
        <MaterialCommunityIcons name={"bus-stop"} size={40} color='#77dd77' />
      </View>

      {/* 텍스트 */}
      <Text style={style.text_busstop}>{item.nodenm}</Text>

      {/* 즐겨찾기 버튼 */}
      <Bookmark data = {{item, key:"busStopBookmarkData"}}/>
    </View>
  </TouchableOpacity>, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style = {style.inputScreen}>
        <TextInput
          style={style.textInput}
          ref={searchRef}
          placeholder="정류장을 검색하세요."
          onChangeText={(text) => searchData(text)}
          touch={searchVal}
        />
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        initialNumToRender={10}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
};

export default Index;

