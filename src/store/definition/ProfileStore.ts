import firebase from 'firebase';
import { action, makeAutoObservable } from 'mobx';
import { AbstractStore } from '../../hooks/useStores';
import { Profile } from '../../types';

class ProfileStore {
    user: Profile | undefined;
    entityRef = firebase.firestore().collection('users');

    users: any = {};

    constructor() {
        makeAutoObservable(this);
    }

    setUser(user: Profile) {
        console.log('setuser', user);
        this.user = user;
        AbstractStore.PostStore.loadUserPosts(user.id);
    }

    loadUser = (userId: string) => {
        console.log('load user');
        if (!this.users[userId]) {
            this.entityRef.doc(userId).get().then((user: any) => {
                this.users[userId] = user;
            });
        } 
    }
}

export default ProfileStore;
