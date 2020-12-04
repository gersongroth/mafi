import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Button, Dimensions, FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
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
import Carousel from 'react-native-snap-carousel';
import { scrollInterpolator, animatedStyles } from '../../utils/animations';
import { Searchbar } from 'react-native-paper';

export const anonymousUser = {
    fullName: 'Anônimo',
    nickname: 'Anônimo'
};

const HomeScreen = observer(() => {
    const { PostStore } = useStores();
    const [playing, setPlaying] = useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [useSearchResult, setUseSearchResult] = React.useState(false);
    const carouselRef = useRef<any>();

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

    const renderItem = ({ item }: any) =>{
        return (
          <View style={{
              backgroundColor:'floralwhite',
              borderRadius: 5,
              height: 150,
              padding: 0,
              marginLeft: 0,
              marginRight: 0,
            }}>
                <YoutubePlayer
                    height={150}
                    play={playing}
                    videoId={item.youtubeId}
                    onChangeState={onStateChange}
                />
          </View>
        )
    }

    const SLIDER_WIDTH = Dimensions.get('window').width;
    const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

    const recommended = useMemo(() => {
        return PostStore.recommended() || [];
    }, []);

    const moreViewed = useMemo(() => {
        return PostStore.moreViewed() || [];
    }, []);

    const onChangeSearch = (query: string) => {
        if (!query) {
            setUseSearchResult(false);
            PostStore.clearQueryPosts();
        } else if (query.length >= 3) {
            setUseSearchResult(true);
            PostStore.findPosts(query);
        }
        setSearchQuery(query);
    };

    const posts = useMemo(() => {
        if (useSearchResult) {
            return PostStore.queryPosts;
        }
        return PostStore.feedPosts;
    }, [PostStore.feedPosts, useSearchResult, PostStore.queryPosts]);

    console.log(posts.length);

    return (
        <View style={styles.container}>
            <View style={styles.searchBarContainer}>
                <Searchbar
                    value={searchQuery}
                    onChangeText={onChangeSearch}
                    placeholder="Buscar Vídeo"
                    onSubmitEditing={() => PostStore.findPosts(searchQuery)}
                    clearAccessibilityLabel="Limpar"
                />
            </View>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                {!useSearchResult && (
                    <>
                        {recommended.length > 0 && (
                            <View>
                                <Text style={styles.recommendedTitle}>Recomendados para você:</Text>
                                <View style={styles.recommendedCarousel}>
                                    <Carousel
                                        layout={"default"}
                                        // layout={'stack'}
                                        ref={carouselRef}
                                        data={recommended}
                                        renderItem={renderItem}
                                        useScrollView={true}  
                                        sliderWidth={SLIDER_WIDTH}
                                        itemWidth={ITEM_WIDTH}
                                        scrollInterpolator={scrollInterpolator}
                                        slideInterpolatedStyle={animatedStyles}
                                        loop
                                    />
                                </View>
                            </View>
                        )}
                        {moreViewed.length > 0 && (
                            <View>
                                <Text style={styles.recommendedTitle}>Mais Acessados:</Text>
                                <View style={styles.recommendedCarousel}>
                                    <Carousel
                                        layout={"default"}
                                        // layout={'stack'}
                                        ref={carouselRef}
                                        data={moreViewed}
                                        renderItem={renderItem}
                                        useScrollView={true}  
                                        sliderWidth={SLIDER_WIDTH}
                                        itemWidth={ITEM_WIDTH}
                                        scrollInterpolator={scrollInterpolator}
                                        slideInterpolatedStyle={animatedStyles}
                                        loop
                                    />
                                </View>
                            </View>
                        )}
                    </>
                )}
                
                
                {posts && posts.map((entity: any) => (
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
                {posts.length == 0 && (
                    <Text style={{
                        textAlign: 'center',
                    }}>Nenhum vídeo encontrado :(</Text>
                )}
            </KeyboardAwareScrollView>
        </View>
    )
});

export default HomeScreen;
