import React from 'react';
import { StyleSheet, Alert, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import routeData from 'config/route.json';
import { getLocation } from "utils/api"
import Bookmark from '../../components/Bookmark';

const Kumoh = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        data={routeData}
        renderItem={({ item }) =>
          <TouchableOpacity onPress={async () => await getLocation(item.routeid)}/*ref.current.clearSearch()*/ >
            <View style={styles.row}>

              {/* 아이콘 */}
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={"bus"} size={35} color={"#77dd77"} /*{getLocation(item.routeid) > 1 ? '#77dd77' : "#FF3D33"}*/ />
              </View>

              {/* 텍스트 */}
              <Text style={styles.title}>{item.routeno + ' 번  '} </Text>
              <Text style={styles.text}> {item.startnodenm + '\n ' + item.endnodenm}</Text>

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

export default Kumoh;

const SampleFunction = () => {
  Alert.alert("Floating Button Clicked");
}

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

  iconContainer: {
    // backgroundColor: '#77dd77',
    padding: 7,
    borderRadius: 10,
    marginLeft: 15,
    marginRight: 5,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
  },
});