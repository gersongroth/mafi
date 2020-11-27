import firebase from 'firebase';
import { action, makeAutoObservable } from 'mobx';
import { apiEvents } from '../../event/descriptor/ApiEvents';
import { AbstractStore } from '../../hooks/abstractSTore';
import { YoutubePost } from '../../types';

interface Profile {

}

class PostStore {
    postsRef = firebase.firestore().collection('posts');

    feedPosts: any = {};

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


    addYoutubeVideo(youtubePost: YoutubePost) {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const data = {
            type: 'youtube',
            authorID: AbstractStore.ProfileStore.user?.id,
            createdAt: timestamp,
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
