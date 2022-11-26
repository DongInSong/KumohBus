import React, { useState, useRef, useEffect } from "react";
import { RefreshControl, View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { WebView } from "react-native-webview"
import { kakaomap } from "../../config/api";
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { getArrivalData } from "utils/api"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import routeData from 'config/route.json';
import Alarm from 'components/Alarm';

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

const Index = () => {
  const [refreshing, setRefreshing] = useState(true);
  const webViewRef = useRef()

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  var jp = require('jsonpath'); // json 검색용 변수 https://github.com/dchester/jsonpath

  const getData = async () => {
      setLoading(true);
      try {
          const res = await getArrivalData("GMB130");
          setLoading(false);
          setData(res);
      } catch (error) {
          console.log(error);
      }
  };

  useEffect(() => {
      getData();
  }, []);


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    webViewRef.current.reload();
    wait(2000).then(() => setRefreshing(false));
  }, [refreshing]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={onRefresh} // exl in function : this.yourWebview.reload();
            />
          }>
          <WebView
            ref={webViewRef}
            automaticallyAdjustContentInsets={false}
            source={{ uri: `${kakaomap}` }}
            allowsFullscreenVideo={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
          />
        </ScrollView>
      </View>

      <View style={{ flex: 1 }}>
        {/* {refreshing ? <ActivityIndicator /> : null} */}
        <FlatList
          data={data}
          extraData={data}
          renderItem={({ item }) =>
            <TouchableOpacity onPress={() => console.log(item.routeno)/*클릭 이벤트(네비게이션 추가)*/}>
              <View style={styles.row}>

                {/* 아이콘 */}
                <View style={styles.iconContainer}>
                  {/* routeData내에 존재하는 버스일 경우 파란색 (학교행) */}
                  <MaterialCommunityIcons name={"bus"} size={35} color={jp.query(routeData, '$..[?(@.routeno==' + item.routeno + ')]').length > 1 ? '#10b6f6' : '#77dd77'} />
                </View>

                {/* 텍스트 */}
                <Text style={styles.title}>{item.routeno + ' 번  '}</Text>
                <Text style={styles.text}>  남은 정거장: {item.arrprevstationcnt > 1 ? item.arrprevstationcnt + '개' : '전 정류장'}
                  <Text style={styles.text}>{'\n'}  도착 예정 시간: <Text style={(Math.round(item.arrtime / 60)) > 5 ? [styles.text] : [styles.text_alart]}>{(Math.round(item.arrtime / 60))} 분 전</Text></Text>
                </Text>

                {/* 즐겨찾기 버튼 */}
                <Alarm></Alarm>
              </View>
            </TouchableOpacity>
          }
          keyExtractor={(item) => String(item.routeid)}
        // refreshControl={
        //     <RefreshControl refreshing={refreshing} onRefresh={getData} />
        // }
        />
      </View>

    </SafeAreaView>
  );
}
export default Index;

const styles = StyleSheet.create({
  container: {
      borderWidth: 2,
      borderColor: '#10b6f6',
      position: 'relative',
      padding: 5,
  },
  ScrollStyle: {
    backgroundColor: 'white',
    position: 'relative',
  },
  textContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
  },
  title: {
      textAlign: 'left',
      textAlignVertical: 'center',
      // fontWeight: "bold",
      fontSize: 20,
  },
  BusNum: {
      textAlign: 'center',
      textAlignVertical: 'center',
      fontWeight: 'bold',
      fontSize: 25,
  },
  text: {
      fontSize: 13,
  },
  text_alart: {
      color: '#b53737',
      fontWeight: 'bold',
      fontSize: 15,
  },
  emptyData: {
      textAlign: 'center',
      color: "#888",
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