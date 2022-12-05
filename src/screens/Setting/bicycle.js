import React from 'react';
import { View, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import bicycleData from 'config/bicycle.json'
import style from 'styles/Style';

const Bicycle = () => {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <FlatList
            data={bicycleData}
            renderItem={({ item }) =>
            <View style={style.row_time}>
              {/* 텍스트 */}
              <Text style={style.title_time}>{item.name} </Text>
              <Text style={style.text_time}> {item.timeByDistance + '분'}</Text>
            </View>
            }
        />
      </View>
    );
  };  


export default Bicycle;