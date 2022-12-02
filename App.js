import React, { useEffect } from 'react';
import Root from 'router';
import * as Notificatios from 'expo-notifications'
import '/config/BookmarkConfig'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

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
      console.log(res);
      if (res) {
        const obj = JSON.parse(res);
        const arr = Object.keys(obj).map(function(k) {return obj[k]});

        console.log("loaded");
        global.busBookmarkData = new Array;
        global.busBookmarkData = arr;
        console.log(global.busBookmarkData);
      }
      else {
        console.log("no data");
        global.busBookmarkData = new Array;
      }

      // const resObj = JSON.parse(res);
      console.log("loaded: " + global.busBookmarkData);
    } catch (error) {
      // busBookmarkData = [];
      console.log("new arr00");
    }
  }

  useEffect(() => {
    getBusBookmarkData();
    // AsyncStorage.clear();
  }, []);

  return (
    <Root />
  );
}
