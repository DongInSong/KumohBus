import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Octicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import '/config/BookmarkConfig'

const Bookmark = ({ data }) => {
  const [bookmark, set] = useState(false);
  var busStopBookmarkData = new Array;
  // var busBookmarkData = new Array;
  // const busBookmarkData = Object.v?

  const isBookmark = (item, key) => {
    console.log(bookmark);
    if(bookmark) {
      if(checkBookmark(item, key))
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
                    busStopBookmarkData.push(data);
                    await AsyncStorage.setItem(key, JSON.stringify(busStopBookmarkData));
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
      if(global.busBookmarkData){
        try {
            switch(key) {
                case 'busBookmarkData':
                    for (var i = 0; i < global.busBookmarkData.length; i++) {
                        if (global.busBookmarkData[i].routeid === data.routeid) {
                            set(true); // error
                          return true;
                        }
                    }
                    return false;
                case 'busStopBookmarkData':
                    for (var i = 0; i < busStopBookmarkData.length; i++) {
                        if (busStopBookmarkData[i].nodeid === data.nodeid) {
                          set(true);
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

    return (
        <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20 }} >
            <TouchableOpacity onPress={() => {
                isBookmark(data.item, data.key);
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

// import React, { useState } from 'react'
// import { View, TouchableOpacity } from 'react-native'
// import { Octicons } from '@expo/vector-icons'

// const Bookmark = ({ data, key }) => {
//     const [bookmark, set] = useState(false);
//     const busBookmarkData = [];
//     const busStopBookmarkData = [];

//     const getBookmark = async (key) => {
//         try {
//             switch (key) {
//                 case 'busBookmarkData':
//                     const busBookmark = await AsyncStorage.getItem('busBookmarkData');
//                     break;
//                 case 'busStopBookmarkData':
//                     const busStopBookmark = await AsyncStorage.getItem('busStopBookmarkData');
//                     break;
//             }
//         } catch (e) {
//             throw new Error('Failed to load ' + key);
//         }
//       }
    
//     const setBookmark = async (data, key) => {
//         try {
//           switch (key) {
//             case 'busBookmarkData':
//                 busBookmarkData.push(data);
//                 await AsyncStorage.setItem(key, JSON.stringify(busBookmarkData));
//             break;
      
//             case 'busBookmarkData':
//                 busStopBookmarkData.push(data);
//                 await AsyncStorage.setItem(key, JSON.stringify(busStopBookmarkData));
//             break;
//             default:
//               console.log('Wrong Key');
//           }

//           console.log(data);
//         } catch (e) {
//           throw new Error('Failed to save ' + key);
//         }
//       };
      
//       const delBookmark = async (data, key) => {
//         try {
//           switch (key) {
//             case 'busBookmarkData':
//               for (var i = 0; i < busBookmarkData.length; i++) {
//                 if (busBookmarkData[i].routeid === data.routeid) {
//                   busBookmarkData.splice(i, 1);
//                   i--;
//                 }
//               }
//               await AsyncStorage.setItem(key, JSON.stringify(busBookmarkData));
//               break;
      
//             case 'busStopBookmarkData':
//               for (var i = 0; i < res.length; i++) {
//                 if (res[i].nodeid === data.nodeid) {
//                   res.splice(i, 1);
//                   i--;
//                 }
//               } 
//               await AsyncStorage.setItem(key, JSON.stringify(res));
//               break;
//             default:
//               console.log('Wrong Key');
//           }
//         } catch (e) {
//           throw new Error('Failed to remove ' + key);
//         }
//       };
      
//       const checkBookmark = async (data, key) => {
//         try {
//           switch (key) {
//             case 'busBookmarkData':
//               // busBookmarkData.pop(data);
//               break;
      
//             case 'busStopBookmarkData':
//               // busStopBookmarkData.pop(data);
//               break;
//             default:
//               console.log('Wrong Key');
//           }
//         } catch (e) {
//           throw new Error('Failed to check ' + key);
//         }
//       };

//     return (
//         <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20 }} >
//             <TouchableOpacity onPress={() => 
//                 delBookmark(data, key)}>
//                 <Octicons
//                     name={'heart-fill'}
//                     size={25}
//                     color="#ff6347"
//                 />
//             </TouchableOpacity>
//         </View>
//     );
// };

// export default Bookmark;