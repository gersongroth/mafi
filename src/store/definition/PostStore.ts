import firebase from 'firebase';
import { action, makeAutoObservable } from 'mobx';
import { apiEvents } from '../../event/descriptor/ApiEvents';
import { AbstractStore } from '../../hooks/useStores';
import { getYoutubeId } from '../../services/PostService';
import { YoutubePost } from '../../types';

class PostStore {
    postsRef = firebase.firestore().collection('posts');

    feedPosts: any = [];
    userPosts: any = [];
    queryPosts: any = [];
    allPosts: any = [];

    constructor() {
        makeAutoObservable(this);

        this.loadAllPosts();

    }

    loadAllPosts() {
        this.postsRef
            .orderBy('createdAt', 'desc')
            .where('type', '==', 'youtube')
            .onSnapshot(
                (querySnapshot: any) => {
                    const newEntities: any[] | ((prevState: never[]) => never[]) = []
                    querySnapshot.forEach((doc: { data: () => any; id: any; }) => {
                        const entity = doc.data()
                        entity.id = doc.id
                        newEntities.push(entity)
                    });
                    this.allPosts = newEntities;
                    this.feedPosts = newEntities.slice(0, 100);
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

    findPostById(postId: string) {
        return this.allPosts.find((post: any) => post.id === postId);
    }

    findPosts(query: string) {
        const lowerCaseQuery = query.toLowerCase();
        this.queryPosts = this.allPosts.filter((post: any) => (post.description || '').toLowerCase().includes(lowerCaseQuery));
    }

    clearQueryPosts() {
        this.queryPosts = [];
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
            youtubeId: getYoutubeId(youtubePost.url),
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

    like (postId: string, userId: string) {
        this.postsRef.doc(postId)
            .collection('likes')
            .add({
                userId,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
    }

    removeLike (postId: string, userId: string) {
        this.postsRef.doc(postId)
            .collection('likes')
            .where('userId', '==', userId)
            .get()
            .then((querySnapshot: any) => {
                querySnapshot.forEach((doc: any) => {
                    doc.ref.delete()
                });
            });
    }

    recommended() {
        return (this.feedPosts ||[]).slice().sort(() => Math.random() - Math.random()).slice(0, 10);
    }

    moreViewed() {
        return (this.feedPosts ||[]).slice().sort(() => Math.random() - Math.random()).slice(0, 10);
    }
}

export default PostStore;
