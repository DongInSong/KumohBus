import React, { useState, useRef, useEffect } from "react";
import { RefreshControl, View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { WebView } from "react-native-webview"
import { kakaomap } from "../../config/api";
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { getArrivalData } from "utils/api"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import routeData from 'config/route.json';
import Alarm from 'components/Alarm';
import style from 'styles/Style';

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

const Index = () => {
  const [mapRefreshing, setMapRefreshing] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const webViewRef = useRef()
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(Date.now());

  var jp = require('jsonpath'); // json 검색용 변수 https://github.com/dchester/jsonpath

  const getData = async () => {
    setLoading(true);
    try {
      const res = await getArrivalData("GMB130");
      setRefreshing(false);
      setLoading(false);
      setData(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // 60초마다 데이터 리로드
    const interval = setInterval(() => setTime(Date.now()), 60000);
    getData();
    return () => {
      clearInterval(interval);
    };
  }, [time]);

  const onMapRefresh = React.useCallback(() => {
    setMapRefreshing(true);
    webViewRef.current.reload();
    wait(2000).then(() => setMapRefreshing(false));
  }, [mapRefreshing]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={onMapRefresh} // exl in function : this.yourWebview.reload();
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

      <View style={style.bookmark}>

        {loading &&
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={style.textContainer}>
              <Text style={style.emptyData}> 불러오는 중.. </Text>
            </View>
          </SafeAreaView>
        }

        {data && !loading &&
          <FlatList
            data={data}
            extraData={data}
            renderItem={({ item }) =>
              <TouchableOpacity onPress={() => console.log(item.routeno)/*클릭 이벤트(네비게이션 추가)*/}>
                <View style={style.row}>

                  {/* 아이콘 */}
                  <View style={style.iconContainer_bus}>
                    {/* routeData내에 존재하는 버스일 경우 파란색 (학교행) */}
                    <MaterialCommunityIcons name={"bus"} size={35} color={jp.query(routeData, '$..[?(@.routeno==' + item.routeno + ')]').length > 1 ? '#10b6f6' : '#77dd77'} />
                  </View>

                  {/* 텍스트 */}
                  <Text style={style.title}>{item.routeno + ' 번  '}</Text>
                  <Text style={style.text}>  남은 정거장: {item.arrprevstationcnt > 1 ? item.arrprevstationcnt + '개' : '전 정류장'}
                    <Text style={style.text}>{'\n'}  도착 예정 시간: <Text style={(Math.round(item.arrtime / 60)) > 5 ? [style.text] : [style.text_alart]}>{(Math.round(item.arrtime / 60))} 분 전</Text></Text>
                  </Text>

                  {/* 즐겨찾기 버튼 */}
                  {(Math.round(item.arrtime / 60)) > 5 &&
                    <Alarm
                      routeno={item.routeno}
                      arrtime={item.arrtime}
                      nodeid="GMB130"
                      routeid={item.routeid}
                    ></Alarm>
                  }
                </View>
              </TouchableOpacity>
            }
            keyExtractor={(item) => String(item.routeid)}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={getData} />
            }
          />
        }

        {!data && !loading &&
          <ScrollView
            contentContainerStyle={style.textContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={getData} />
            }
          >
            <Text style={style.emptyData}> 도착 예정 버스가 없습니다. </Text>
          </ScrollView>
        }

      </View>
    </SafeAreaView >
  );
}
export default Index;
