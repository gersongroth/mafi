import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Button, FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config'
import { useStores } from '../../hooks/useStores';
import YoutubePlayer from "react-native-youtube-iframe";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import UserAvatar from 'react-native-user-avatar';
import { observer } from 'mobx-react-lite';
import { format } from 'date-fns';
import useInit from '../../hooks/useInit';
import LikeView from './LikeView';

export const anonymousUser = {
    fullName: 'Anônimo',
    nickname: 'Anônimo'
};

const HomeScreen = observer(() => {
    const { PostStore, ProfileStore } = useStores();
    const [playing, setPlaying] = useState(false);

    useInit();
    const onStateChange = useCallback((state) => {
      if (state === "ended") {
        setPlaying(false);
        Alert.alert("video has finished playing!");
      }
    }, []);
  
    const togglePlaying = useCallback(() => {
      setPlaying((prev) => !prev);
    }, []);

    const renderUserOwner = (post: any) => {
        const user = post.author || anonymousUser;

        return (
            <>
                <UserAvatar size={20} name={user.fullName} style={styles.authorAvatar} />
                <Text style={styles.nickname}>{user.nickname}</Text>
                {post.createdAt && (
                    <View style={styles.postedAt}>
                        <Text style={styles.postedAtText}>{format(post.createdAt.toDate(), 'dd/MM/yyyy HH:mm:ss')}</Text>
                    </View>
                )}
            </>
        )
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                { PostStore.feedPosts && PostStore.feedPosts.map((entity: any) => (
                    <View style={{ width: '100%'}} key={entity.youtubeId}>
                        <View style={styles.videoOwner}>
                            {renderUserOwner(entity)}
                        </View>
                        <YoutubePlayer
                            height={240}
                            play={playing}
                            videoId={entity.youtubeId}
                            onChangeState={onStateChange}
                        />
                        <LikeView postId={entity.id} />
                    </View>
                ))}
            </KeyboardAwareScrollView>
        </View>
    )
});

export default HomeScreen;
