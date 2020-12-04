import React from 'react'
import { View } from 'react-native'
import Profile from './Profile';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ProfileScreen = () => {
    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, width: '100%' }}
            keyboardShouldPersistTaps="always">
            <View style={{
                flex: 1,
                flexDirection: 'column',
            }}>
                <Profile />
            </View>

        </KeyboardAwareScrollView>
    )
};

export default ProfileScreen;
