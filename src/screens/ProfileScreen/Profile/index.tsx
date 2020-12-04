import React, { useState } from 'react'
import { Image, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { useStores } from '../../../hooks/useStores';
import { apiEvents } from '../../../event/descriptor/ApiEvents';
import UserAvatar from 'react-native-user-avatar';
import { observer } from 'mobx-react-lite';

const Profile = observer(({navigation}: any) => {
    const { PostStore, ProfileStore } = useStores();
    const [urlYoutube, setUrlYoutube] = useState('');
    const [description, setDescription] = useState('');

    const onAddButtonPress = () => {
        if (urlYoutube && urlYoutube.length > 0) {
            apiEvents.addPost.subscribe(() => {
                setUrlYoutube('');
                setDescription('');
                Keyboard.dismiss();
            }, true);
            PostStore.addYoutubeVideo({
                url: urlYoutube,
                description,
            });
        }
    }

    return (
        <View style={styles.container}>
            <View
                style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                <UserAvatar size={100} name={ProfileStore.user?.fullName} style={styles.authorAvatar} />
                <Text style={{ marginTop: 20, fontSize: 20 }}>Nome:</Text>
                <Text style={{ fontSize: 32 }}>{ProfileStore.user?.fullName}</Text>
                <Text style={{ marginTop: 20, fontSize: 20  }}>Email:</Text>
                <Text style={{ fontSize: 32 }}>{ProfileStore.user?.email}</Text>
            </View>
        </View>
    )
});

export default Profile;
