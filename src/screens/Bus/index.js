import React from 'react';
import { StyleSheet, Alert, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import routeData from 'config/route.json';
import { getLocation } from "utils/api"
import Bookmark from '../../components/Bookmark';
import style from 'styles/Style';

const Index = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        data={routeData}
        renderItem={({ item }) =>
          <TouchableOpacity onPress={async () => await getLocation(item.routeid)}/*ref.current.clearSearch()*/ >
            <View style={style.row}>

              {/* 아이콘 */}
              <View style={style.iconContainer_bus}>
                <MaterialCommunityIcons name={"bus"} size={35} color={"#77dd77"} /*{getLocation(item.routeid) > 1 ? '#77dd77' : "#FF3D33"}*/ />
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
      />
    </SafeAreaView>
  );
};

export default Index;