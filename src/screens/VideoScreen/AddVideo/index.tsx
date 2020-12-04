import React, { useState } from 'react'
import { Image, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { useStores } from '../../../hooks/useStores';
import { apiEvents } from '../../../event/descriptor/ApiEvents';
import FlashMessage, { showMessage } from "react-native-flash-message";

const AddVideo = ({navigation}: any) => {
    const { PostStore } = useStores();
    const [urlYoutube, setUrlYoutube] = useState('');
    const [description, setDescription] = useState('');

    const onAddButtonPress = () => {
        if (urlYoutube && urlYoutube.length > 0) {
            apiEvents.addPost.subscribe(() => {
                setUrlYoutube('');
                setDescription('');
                Keyboard.dismiss();
                showMessage({
                    message: "Vídeo Adicionado com sucesso!",
                    type: "success",
                });
            }, true);
            PostStore.addYoutubeVideo({
                url: urlYoutube,
                description,
            });
        } else {
            showMessage({
                message: "Favor preencher corretamente todos os campos!",
                type: "danger",
            });
        }
    }

    return (
        <View style={styles.container}>
            <FlashMessage position="top" />
            <View
                style={{ flex: 1, width: '100%' }}>
                <Image
                    style={styles.youtube}
                    source={require('../../../../assets/youtube.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Url do Vídeo'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setUrlYoutube(text)}
                    value={urlYoutube}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    contextMenuHidden={false}
                />
                
                <TextInput
                    style={styles.input}
                    placeholder='Descrição'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setDescription(text)}
                    value={description}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                {/* <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail((text || '').trim())}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Senha'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Confirmar Senha'
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                /> */}

                <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
                    <Text style={styles.buttonTitle}>Adicionar</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default AddVideo;
