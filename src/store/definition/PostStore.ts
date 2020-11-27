import firebase from 'firebase';
import { action, makeAutoObservable } from 'mobx';
import { apiEvents } from '../../event/descriptor/ApiEvents';
import { AbstractStore } from '../../hooks/useStores';
import { YoutubePost } from '../../types';

class PostStore {
    postsRef = firebase.firestore().collection('posts');

    feedPosts: any = [];
    userPosts: any = [];

    constructor() {
        makeAutoObservable(this);

        this.loadFeedPosts();
    }

    loadFeedPosts() {
        this.postsRef
            .orderBy('createdAt', 'desc')
            .where('type', '==', 'youtube')
            .limit(10)
            .onSnapshot(
                (querySnapshot: any) => {
                    const newEntities: any[] | ((prevState: never[]) => never[]) = []
                    querySnapshot.forEach((doc: { data: () => any; id: any; }) => {
                        const entity = doc.data()
                        entity.id = doc.id
                        newEntities.push(entity)
                    });
                    this.feedPosts = newEntities;
                },
                (error: any) => {
                    console.log(error)
                }
            )
    }

    loadUserPosts(userId: string) {
        this.postsRef
            .orderBy('createdAt', 'desc')
            .where('type', '==', 'youtube')
            .where('authorID', '==', userId)
            .onSnapshot(
                (querySnapshot: any) => {
                    const newEntities: any[] | ((prevState: never[]) => never[]) = []
                    querySnapshot.forEach((doc: { data: () => any; id: any; }) => {
                        const entity = doc.data()
                        entity.id = doc.id
                        newEntities.push(entity)
                    });
                    apiEvents.loadUserPosts.trigger(newEntities);

                    this.setUserPosts(newEntities);
                },
                (error: any) => {
                    console.log(error)
                }
            )
    }

    setUserPosts(posts: any[]) {
        this.userPosts = posts;
    }

    addYoutubeVideo(youtubePost: YoutubePost) {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const user = AbstractStore.ProfileStore.user;
        const data = {
            type: 'youtube',
            authorID: user?.id,
            createdAt: timestamp,
            author: {
                nickname: user?.nickname,
                fullName: user?.fullName,
                id: user?.id,
            },
            ...youtubePost,
        };
        this.postsRef
            .add(data)
            .then(_doc => {
                apiEvents.addPost.trigger();
            })
            .catch((error) => {
                alert(error)
            });
    }
}

export default PostStore;
