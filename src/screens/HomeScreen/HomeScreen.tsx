import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Button, FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config'
import { useStores } from '../../hooks/useStores';
import YoutubePlayer from "react-native-youtube-iframe";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function HomeScreen() {
    const { ProfileStore } = useStores();
    const [entityText, setEntityText] = useState('')
    const [entities, setEntities] = useState<any[]>([])
    const [playing, setPlaying] = useState(false);

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
    }, [])

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                { entities && entities.map((entity: any) => (
                    <View style={{ width: '100%'}}>
                        <Text>{entity.youtubeId}</Text>
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
}