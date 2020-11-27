import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { firebase } from '../../firebase/config'
import { useStores } from '../../hooks/useStores';
import AddVideo from './AddVideo';
import styles from './styles';

const VideoScreen = observer((props) => {
    const { ProfileStore } = useStores();
    const [urlYoutube, setUrlYoutube] = useState('')
    const [entities, setEntities] = useState([])
    const postsRef = firebase.firestore().collection('posts')

    useEffect(() => {
        postsRef
            .where("authorID", "==", ProfileStore.user?.id)
            .where('type', '==', 'youtube')
            .orderBy('createdAt', 'desc')
            .limit(100)
            .onSnapshot(
                querySnapshot => {
                    const newEntities = []
                    querySnapshot.forEach(doc => {
                        const entity = doc.data()
                        entity.id = doc.id
                        newEntities.push(entity)
                    });
                    setEntities(newEntities)
                },
                error => {
                    console.log(error)
                }
            )
    }, [ProfileStore, ProfileStore.user])

    

    const renderVideo = ({item, index}) => {
        return (
            <View style={styles.entityContainer}>
                <Text style={styles.urlYoutube}>
                    {item.url}
                </Text>
            </View>
        )
    }

    return (
        <View>
            <AddVideo />
            {/* <View style={styles.container}>
                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder='Adicionar novo vídeo'
                        placeholderTextColor="#aaaaaa"
                        onChangeText={(text) => setUrlYoutube(text)}
                        value={urlYoutube}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
                        <Text style={styles.buttonText}>Adicionar</Text>
                    </TouchableOpacity>
                </View>
                { entities.length > 0 ? (
                    <>
                        <Text>Seus vídeos adicionados</Text>
                        <View style={styles.listContainer}>
                            <FlatList
                                data={entities}
                                renderItem={renderVideo}
                                keyExtractor={(item) => item.id}
                                removeClippedSubviews={true}
                            />
                        </View>
                    </>
                ) : (
                    // TODO - ajustar layout para nao precisar renderizar a flatlist
                    <>
                        <Text>Você não adicionou nenhum vídeo.</Text>
                        <View style={styles.listContainer} >
                            <FlatList
                                data={[]}
                                renderItem={renderVideo}
                                keyExtractor={(item) => item.id}
                                removeClippedSubviews={true}
                            />
                        </View>
                    </>
                )}
            </View> */}
        </View>
    )
});

export default VideoScreen;
