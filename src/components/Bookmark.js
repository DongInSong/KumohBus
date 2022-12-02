import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { Octicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import '/config/BookmarkConfig'

const Bookmark = ({ data }) => {
    const [bookmark, set] = useState(false);

    const isBookmark = (item, key) => {
        console.log(bookmark);
        if (bookmark) {
            if (checkBookmark(item, key))
                delBookmark(item, key);
        }
        else {
            console.log("set");
            setBookmark(item, key);
        }
        set(!bookmark);
    }

    const setBookmark = async (data, key) => {
        try {
            switch (key) {
                case 'busBookmarkData':
                    if (!checkBookmark(data, key)) {
                        global.busBookmarkData.push(data);
                        await AsyncStorage.setItem(key, JSON.stringify(global.busBookmarkData));
                        console.log("added");
                    }
                    break;
                case 'busStopBookmarkData':
                    if (!checkBookmark(data, key)) {
                        global.busStopBookmarkData.push(data);
                        await AsyncStorage.setItem(key, JSON.stringify(global.busStopBookmarkData));
                    }
                    break;
                default:
                    console.log('Wrong Key');
            }

            console.log(data);
        } catch (e) {
            throw new Error('Failed to save ' + key);
        }
    };

    const delBookmark = async (data, key) => {
        try {
            switch (key) {
                case 'busBookmarkData':
                    for (var i = 0; i < global.busBookmarkData.length; i++) {
                        if (global.busBookmarkData[i].routeid === data.routeid) {
                            global.busBookmarkData.splice(i, 1);
                            i--;
                            console.log("deleted");
                        }
                    }
                    await AsyncStorage.setItem(key, JSON.stringify(global.busBookmarkData));
                    break;

                case 'busStopBookmarkData':
                    for (var i = 0; i < global.busStopBookmarkData.length; i++) {
                        if (global.busStopBookmarkData[i].nodeid === data.nodeid) {
                            global.busStopBookmarkData.splice(i, 1);
                            i--;
                        }
                    }
                    await AsyncStorage.setItem(key, JSON.stringify(global.busStopBookmarkData));
                    break;
                default:
                    console.log('Wrong Key');
            }
        } catch (e) {
            throw new Error('Failed to remove ' + key);
        }
    };

    const checkBookmark = (data, key) => {
        if (global.busBookmarkData) {
            try {
                switch (key) {
                    case 'busBookmarkData':
                        for (var i = 0; i < global.busBookmarkData.length; i++) {
                            if (global.busBookmarkData[i].routeid === data.routeid) {
                                return true;
                            }
                        }
                        return false;
                    case 'busStopBookmarkData':
                        for (var i = 0; i < global.busStopBookmarkData.length; i++) {
                            if (global.busStopBookmarkData[i].nodeid === data.nodeid) {
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
            {/* <View>
                <Text style={{ fontSize: 10, textAlign: 'center' }}> 0 </Text>
            </View> */}
        </View>
    );
};

export default Bookmark;