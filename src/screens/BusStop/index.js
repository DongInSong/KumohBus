import React, { useState, useCallback, useRef } from 'react';
import { StyleSheet, TextInput, View, Text, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import BusStopData from 'config/busStop_test.json';
import Bookmark from '../../components/Bookmark';


const Index = ({ navigation }) => {
  const [searchVal, setSearchVal] = useState("");
  const [data, setData] = useState([]);
  const searchRef = useRef();

  const searchData = async (text) => {
    try {
      setSearchVal(text);
      const res = await fetch('http://apis.data.go.kr/1613000/BusSttnInfoInqireService/getSttnNoList?serviceKey=btg61%2BH2BcIymonQ260mu2Q1kkjD0WBSsdTdDScJd8OunwmGJvImYug6yIvJpZr%2BZ1oUsXYCLNZ5AXXzhvo9sQ%3D%3D&pageNo=1&numOfRows=2500&type=json&cityCode=37050', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "res.response.body.items.item.nodenm": text,
        }),
      });
      const resJson = await res.json();
      const newRes = resJson.response.body.items.item;
      console.log(newRes);
      setData(newRes);
    } catch (e) {
      console.log("패치 x");
    }
  };

  const renderItem = useCallback(({ item }) => <TouchableOpacity onPress={() => navigation.navigate('Result', { nodeid: item.nodeid, nodenm: item.nodenm })}/*ref.current.clearSearch()*/ >
    <View style={styles.row}>

      {/* 아이콘 */}
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={"bus-stop"} size={40} color='#77dd77' />
      </View>

      {/* 텍스트 */}
      <Text style={styles.text}>{item.nodenm}</Text>

      {/* 즐겨찾기 버튼 */}
      <Bookmark data = {{item, key:"busStopBookmarkData"}}/>
    </View>
  </TouchableOpacity>, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style = {styles.inputScreen}>
        <TextInput
          style={styles.textInput}
          ref={searchRef}
          placeholder="정류장을 검색하세요."
          onChangeText={(text) => searchData(text)}
          touch={searchVal}
        />
      </View>

      <FlatList
        data={BusStopData}
        renderItem={renderItem}
        initialNumToRender={10}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },

  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 40,
    height: 40,
  },

  text: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 15,
  },

  inputScreen: {
    paddingVertical: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#29b6f6",
  },

  textInput: {
    width: "95%",
    height: 40,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15, 
    fontSize: 16,
},

  iconContainer: {
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
});

