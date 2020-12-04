import firebase from 'firebase';
import { action, makeAutoObservable } from 'mobx';
import { AbstractStore } from '../../hooks/useStores';
import { Profile } from '../../types';

class ProfileStore {
    user: Profile | undefined;
    entityRef = firebase.firestore().collection('users');

    users: any = {};
    allLikes: any = [];

    constructor() {
        makeAutoObservable(this);
    }

    loadAllLikes() {
        this.entityRef
            .doc(this.user?.id)
            .collection('likes')
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                (querySnapshot: any) => {
                    const newEntities: any[] | ((prevState: never[]) => never[]) = []
                    querySnapshot.forEach((doc: { data: () => any; id: any; }) => {
                        const entity = doc.data()
                        entity.id = doc.id
                        newEntities.push(entity)
                    });
                    this.allLikes = newEntities;
                    console.log(newEntities);
                },
                (error: any) => {
                    console.log(error)
                }
            )
    }

    setUser(user: Profile) {
        this.user = user;
        AbstractStore.PostStore.loadUserPosts(user.id);
        this.loadAllLikes();
    }

    loadUser = (userId: string) => {
        if (!this.users[userId]) {
            this.entityRef.doc(userId).get().then((user: any) => {
                this.users[userId] = user;
            });
        } 
    }

    like (postId: string) {
        this.entityRef.doc(this.user?.id)
            .collection('likes')
            .add({
                postId,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
    }

    removeLike (postId: string) {
        this.entityRef.doc(this.user?.id)
            .collection('likes')
            .where('postId', '==', postId)
            .get()
            .then((querySnapshot: any) => {
                querySnapshot.forEach((doc: any) => {
                    doc.ref.delete()
                });
            });
    }
}

export default ProfileStore;
