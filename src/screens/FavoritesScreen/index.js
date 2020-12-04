import { observer } from 'mobx-react-lite';
import React from 'react'
import { View, Text } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useStores } from '../../hooks/useStores';
import YoutubePlayer from "react-native-youtube-iframe";

const FavoritesScreen = observer(() => {
    const { ProfileStore, PostStore } = useStores();

    const renderVideo = ({ postId }) => {
        console.log(postId);
        const post = PostStore.findPostById(postId);
        return (
            <>
                {post && (
                    <View>
                        <YoutubePlayer
                            height={240}
                            // play={false}
                            videoId={post.youtubeId}
                            // onChangeState={onStateChange}
                        />
                    </View>
                )}
            </>
        )
    }

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, width: '100%' }}
            keyboardShouldPersistTaps="always">
            <View style={{
                flex: 1,
                flexDirection: 'column',
            }}>
                {ProfileStore.allLikes.map(renderVideo)}
            </View>

        </KeyboardAwareScrollView>
    )
});

export default FavoritesScreen;
