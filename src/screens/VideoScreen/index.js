import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { firebase } from '../../firebase/config'
import styles from './styles';

export default function VideoScreen(props) {

    const [urlYoutube, setUrlYoutube] = useState('')
    const [entities, setEntities] = useState([])
    const postsRef = firebase.firestore().collection('posts')
    const userID = '1213';

    useEffect(() => {
        postsRef
            .where("authorID", "==", userID)
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
                    console.log(newEntities)
                },
                error => {
                    console.log(error)
                }
            )
    }, [])

    const onAddButtonPress = () => {
        if (urlYoutube && urlYoutube.length > 0) {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                type: 'youtube',
                url: urlYoutube,
                authorID: userID,
                createdAt: timestamp,
            };
            postsRef
                .add(data)
                .then(_doc => {
                    setUrlYoutube('')
                    Keyboard.dismiss()
                })
                .catch((error) => {
                    alert(error)
                });
        }
    }

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
        <View style={styles.container}>
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
        </View>
    )
}