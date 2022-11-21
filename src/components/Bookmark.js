import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Octicons } from '@expo/vector-icons'
import { setBookmark, delBookmark } from '../utils/bookmark';

const Bookmark = ({ data }) => {
    const [bookmark, set] = useState(false);

    const isBookmark = () => {
        set(!bookmark);
    };

    return (
        <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20 }} >
            <TouchableOpacity onPress={() => {
                isBookmark(); bookmark ? delBookmark(data.item, data.key) : setBookmark(data.item, data.key)
            }}>
                <Octicons
                    name={bookmark ? 'heart-fill' : 'heart'}
                    size={25}
                    color="#ff6347"
                />
            </TouchableOpacity>
        </View>
    );
};

export default Bookmark;