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

export const anonymousUser = {
    fullName: 'Anônimo',
    nickname: 'Anônimo'
};

const HomeScreen = observer(() => {
    const { ProfileStore } = useStores();
    const [entityText, setEntityText] = useState('')
    const [entities, setEntities] = useState<any[]>([])
    const [playing, setPlaying] = useState(false);
    const [users, setUsers] = useState<any>({});

    const entityRef = firebase.firestore().collection('posts')

    const onStateChange = useCallback((state) => {
      if (state === "ended") {
        setPlaying(false);
        Alert.alert("video has finished playing!");
      }
    }, []);
  
    const togglePlaying = useCallback(() => {
      setPlaying((prev) => !prev);
    }, []);
    useEffect(() => {
        entityRef
            .orderBy('createdAt', 'desc')
            .where('type', '==', 'youtube')
            .limit(10)
            .onSnapshot(
                (querySnapshot: any[]) => {
                    const newEntities: any[] | ((prevState: never[]) => never[]) = []
                    querySnapshot.forEach((doc: { data: () => any; id: any; }) => {
                        const entity = doc.data()
                        entity.id = doc.id
                        newEntities.push(entity)
                    });
                    setEntities(newEntities);
                },
                (error: any) => {
                    console.log(error)
                }
            )
    }, []);

    const renderUserOwner = (post: any) => {
        const user = post.author || anonymousUser;

        return (
            <>
                <UserAvatar size={20} name={user.fullName} style={styles.authorAvatar} />
                <Text style={styles.nickname}>{user.nickname}</Text>
                <View style={styles.postedAt}>
                    <Text style={styles.postedAtText}>{format(post.createdAt.toDate(), 'dd/MM/yyyy HH:mm:ss')}</Text>
                </View>
            </>
        )
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                { entities && entities.map((entity: any) => (
                    <View style={{ width: '100%'}}>
                        <Text>{entity.youtubeId}</Text>
                        <View style={styles.videoOwner}>
                            {renderUserOwner(entity)}
                        </View>
                        <YoutubePlayer
                            height={300}
                            play={playing}
                            videoId={entity.youtubeId}
                            onChangeState={onStateChange}
                        />
                        {/* <Button title={playing ? "pause" : "play"} onPress={togglePlaying} /> */}
                    </View>
                ))}
            </KeyboardAwareScrollView>
        </View>
    )
});

export default HomeScreen;
