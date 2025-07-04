import React, { useEffect, useState } from 'react';
import Root from 'router';  
import * as Notificatios from 'expo-notifications'
import BookmarkConfig from './src/config/BookmarkConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [busBookmarkData, setBusBookmarkData] = useState([]);
  const [busStopBookmarkData, setBusStopBookmarkData] = useState([]);

  Notificatios.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  const getBusBookmarkData = async () => {
    try {
      const res = await AsyncStorage.getItem("busBookmarkData");
      if (res) {
        const obj = JSON.parse(res);
        const arr = Object.keys(obj).map(function(k) {return obj[k]});
        setBusBookmarkData(arr);
      }
    } catch (error) {
      console.error("Error loading bus bookmark data:", error);
    }
  }

  const getBusStopBookmarkData = async () => {
    try {
      const res = await AsyncStorage.getItem("busStopBookmarkData");
      if (res) {
        const obj = JSON.parse(res);
        const arr = Object.keys(obj).map(function(k) {return obj[k]});
        setBusStopBookmarkData(arr);
      }
    } catch (error) {
      
    }
  }

  useEffect(() => {
    getBusBookmarkData();
    getBusStopBookmarkData();
  }, []);

  return (
    <Root busBookmarkData={busBookmarkData} busStopBookmarkData={busStopBookmarkData} />
  );
}
