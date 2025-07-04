import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TextInput, View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { busStop } from 'config/api';
import * as Animatable from "react-native-animatable";
import styled from "styled-components";
import Bookmark from '../../components/Bookmark';
import style from 'styles/Style';


const Index = ({ navigation }) => {
  const [searchVal, setSearchVal] = useState("");
  const [data, setData] = useState([]);
  const searchRef = useRef();

  const searchData = async (text) => {
    if (text) {
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

  useEffect(() => {
    setData();
  }, []);

  const SearchBarWrab = styled.View`
  position:relative;
  display: flex;
  width: 100%;
  `;

  const Cancel = Animatable.createAnimatableComponent(styled.TouchableOpacity`
  display: ${({ touch }) => (touch.length > 1 ? "flex" : "none")};
  padding-left: 330px;
  alignSelf: 'center';
  `)


  const renderItem = useCallback(({ item }) =>
    <TouchableOpacity onPress={() => navigation.navigate('Result', { nodeid: item.nodeid, nodenm: item.nodenm })}/*ref.current.clearSearch()*/ >
      <View style={style.row}>

        {/* 아이콘 */}
        <View style={style.iconContainer_busstop}>
          <MaterialCommunityIcons name={"bus-stop"} size={40} color='#77dd77' />
        </View>

        {/* 텍스트 */}
        <Text style={style.text_busstop}>{item.nodenm}</Text>

        <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 15 }} >
          <Text></Text>
          {/* 즐겨찾기 버튼 */}
          <Bookmark data={{ item, key: "busStopBookmarkData" }} />
        </View>
      </View>
    </TouchableOpacity>, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={style.inputScreen}>
        <TextInput
          value={searchVal}
          style={style.textInput}
          placeholder="정류장을 검색하세요."
          onChangeText={(text) => { searchData(text), setSearchVal(text) }}
          touch={searchVal}
        />
      </View>

      {data &&
        <FlatList
          data={data}
          renderItem={renderItem}
          initialNumToRender={10}
          removeClippedSubviews={true}
        />
      }
      {!Array.isArray(data) &&
        <ScrollView
          contentContainerStyle={style.textContainer}
        >
          <Text style={style.emptyData}>검색결과 없음</Text>
        </ScrollView>
      }


    </SafeAreaView>
  );
};

export default Index;

