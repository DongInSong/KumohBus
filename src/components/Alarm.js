import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Octicons } from '@expo/vector-icons'

const Alarm = ({ data }) => {
    const [alarm, setAlarm] = useState(false);

    const isAlarm = () => {
        setAlarm(!alarm);
    };

    return (
        <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20 }} >
            <TouchableOpacity onPress={() => {isAlarm(); console.log('ALARM SET')}}>
                <Octicons
                    name={alarm ? 'bell-fill' : 'bell'}
                    size={25}
                    color="#FBCB74"
                />
            </TouchableOpacity>
        </View>
    );
};

export default Alarm;