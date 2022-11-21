import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

const busBookmarkData = [];
const busStopBookmarkData = [];

const getBusBookmark = () => {
  return busBookmarkData;
}

const getBusStopBookmarkData = () => {
  return busStopBookmarkData;
}

export const loadBookmark = async () => {
  // try {
  //   busBookmarkData = await AsyncStorage.getItem('busBookmarkData');
  //   busStopBookmarkData = await AsyncStorage.getItem('busStopBookmarkData');
  // } catch (e) {
  //   throw new Error('Failed to load');
  // }
  // try {
  //   let value = await AsyncStorage.getItem('busBookmarkData');
  //   if (value !== null) {
  //     // console.log(value)
  //     busBookmarkData = value;
  //   }

  //   value = await AsyncStorage.getItem('busStopBookmarkData');
  //   if (value !== null) {
  //     // console.log(value)
  //     busStopBookmarkData = value;
  //   }
  // }
  // catch (error) {
  //   console.log("_retrieveData failed!! " + error);
  // }
}

export const setBookmark = async (data, key) => {
  try {
    switch (key) {
      case 'busBookmarkData':
        busBookmarkData.push(data);
        await AsyncStorage.setItem(key, JSON.stringify(busBookmarkData));
        break;

      case 'busStopBookmarkData':
        busStopBookmarkData.push(data);
        await AsyncStorage.setItem(key, JSON.stringify(busStopBookmarkData));
        break;
      default:
        console.log('Wrong Key');
    }

    console.log(data);
  } catch (e) {
    throw new Error('Failed to save ' + key);
  }
};

export const delBookmark = async (data, key) => {
  try {
    switch (key) {
      case 'busBookmarkData':
        for (var i = 0; i < busBookmarkData.length; i++) {
          if (busBookmarkData[i].routeid === data.routeid) {
            busBookmarkData.splice(i, 1);
            i--;
          }
        }
        await AsyncStorage.setItem(key, JSON.stringify(busBookmarkData));
        break;

      case 'busStopBookmarkData':
        for (var i = 0; i < busStopBookmarkData.length; i++) {
          if (busStopBookmarkData[i].nodeid === data.nodeid) {
            busStopBookmarkData.splice(i, 1);
            i--;
          }
        } 
        await AsyncStorage.setItem(key, JSON.stringify(busStopBookmarkData));
        break;
      default:
        console.log('Wrong Key');
    }
  } catch (e) {
    throw new Error('Failed to remove ' + key);
  }
};

export const checkBookmark = async (data, key) => {
  try {
    switch (key) {
      case 'busBookmarkData':
        // busBookmarkData.pop(data);
        break;

      case 'busStopBookmarkData':
        // busStopBookmarkData.pop(data);
        break;
      default:
        console.log('Wrong Key');
    }
  } catch (e) {
    throw new Error('Failed to check ' + key);
  }
};