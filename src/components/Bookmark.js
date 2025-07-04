import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { Octicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Bookmark = ({ data, busBookmarkData, busStopBookmarkData }) => {
    const [bookmark, set] = useState(false);

    const isBookmark = (item, key) => {
        if (bookmark) {
            if (checkBookmark(item, key))
                delBookmark(item, key);
        }
        else {
            setBookmark(item, key);
        }
        set(!bookmark);
    }

    const setBookmark = async (data, key) => {
        try {
            switch (key) {
                case 'busBookmarkData':
                    if (!checkBookmark(data, key)) {
                        busBookmarkData.push(data);
                        await AsyncStorage.setItem(key, JSON.stringify(busBookmarkData));
                    }
                    break;
                case 'busStopBookmarkData':
                    if (!checkBookmark(data, key)) {
                        busStopBookmarkData.push(data);
                        await AsyncStorage.setItem(key, JSON.stringify(busStopBookmarkData));
                    }
                    break;
                default:
                    console.log('Wrong Key');
            }
        } catch (e) {
            throw new Error('Failed to save ' + key);
        }
    };

    const delBookmark = async (data, key) => {
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

    const checkBookmark = (data, key) => {
        if (busBookmarkData) {
            try {
                switch (key) {
                    case 'busBookmarkData':
                        for (var i = 0; i < busBookmarkData.length; i++) {
                            if (busBookmarkData[i].routeid === data.routeid) {
                                return true;
                            }
                        }
                        return false;
                    case 'busStopBookmarkData':
                        for (var i = 0; i < busStopBookmarkData.length; i++) {
                            if (busStopBookmarkData[i].nodeid === data.nodeid) {
                                return true;
                            }
                        }
                        return false;
                }
            } catch (e) {
                throw new Error('Failed to Check');
            }
        }
        else return true;
    };

    useEffect(() => {

        if(checkBookmark(data.item, data.key))
        set(true);
      
      }, [])

    return (
        <View style={{ flex: 1, alignItems: 'center', marginRight: 10, marginTop: 30 }} >
            <TouchableOpacity onPress={() => {
                isBookmark(data.item, data.key)
            }}>
                <Octicons
                    name={checkBookmark(data.item, data.key) ? 'heart-fill' : 'heart'}
                    size={25}
                    color="#ff6347"
                />
            </TouchableOpacity>
        </View>
    );
};

export default Bookmark;