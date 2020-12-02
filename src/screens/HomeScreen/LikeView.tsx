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
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';

export const anonymousUser = {
    fullName: 'Anônimo',
    nickname: 'Anônimo'
};

const LikeView = observer(({ postId }: any) => {
    const { PostStore, ProfileStore } = useStores();
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    const like = () => {
        if (!ProfileStore.user) {
            console.log('usuário não encontrado');
            return;
        }
        PostStore.like(postId, ProfileStore.user.id);
        setLiked(true);
    }

    const removeLike = () => {
        if (!ProfileStore.user) {
            console.log('usuário não encontrado');
            return;
        }
        PostStore.removeLike(postId, ProfileStore.user.id);
        setLiked(false);
    }

    useEffect(() => {
        if (!ProfileStore.user) {
            console.log('usuário não encontrado');
            return;
        }
        PostStore.postsRef.doc(postId)
            .collection('likes')
            .where('userId', '==', ProfileStore.user.id)
            .get()
            .then((querySnapshot: any) => {
                setLiked(querySnapshot.size > 0);
            });
    }, []);

    useEffect(() => {
        if (!ProfileStore.user) {
            console.log('usuário não encontrado');
            return;
        }
        PostStore.postsRef.doc(postId)
            .collection('likes')
            .onSnapshot((querySnapshot: any) => {
                setLikes(querySnapshot.size);
            });
    }, []);

    return (
        <View style={styles.likesContainer}>
            {liked ? (
                <FontAwesome name="heart" size={20} color="black" onPress={removeLike} />
            ) : (
                <FontAwesome5 name="heart" size={20} color="black" onPress={like} />
            )}
            <Text style={styles.numberOfLikes}>{likes} like{likes === 0 || likes > 1 ? 's' : ''}</Text>
        </View>
    )
});

export default LikeView;
