import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { firebase } from '../../firebase/config'
import { useStores } from '../../hooks/useStores';
import AddVideo from './AddVideo';
import ViewVideo from './ViewVideo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const VideoScreen = () => {
    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, width: '100%' }}
            keyboardShouldPersistTaps="always">
            <View style={{
                flex: 1,
                flexDirection: 'column',
            }}>
                <AddVideo />
                {/* <ViewVideo /> */}
            </View>

        </KeyboardAwareScrollView>
    )
};

export default VideoScreen;
