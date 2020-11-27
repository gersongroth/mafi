import React, { useState } from 'react'
import { Text, View } from 'react-native'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { useStores } from '../../../hooks/useStores';
// import { apiEvents } from '../../../event/descriptor/ApiEvents';
import { observer } from 'mobx-react-lite';
import { FlatList } from 'react-native-gesture-handler';

const ViewVideo = observer(({navigation}: any) => {
    const { PostStore } = useStores();

    const renderVideo = ({item, index}: any) => {
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
            {(PostStore.userPosts || []).length > 0 ? (
                    <>
                        <Text>Seus vídeos adicionados</Text>
                        <View style={styles.listContainer}>
                            <FlatList
                                data={PostStore.userPosts}
                                renderItem={renderVideo}
                                keyExtractor={(item: any) => item.id}
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
});

export default ViewVideo;
