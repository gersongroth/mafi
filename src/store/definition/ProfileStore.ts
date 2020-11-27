import firebase from 'firebase';
import { action, makeAutoObservable } from 'mobx';

interface Profile {

}

class ProfileStore {
    user: Profile | undefined;
    entityRef = firebase.firestore().collection('users');

    users: any = {};

    constructor() {
        makeAutoObservable(this);
    }

    setUser(user: Profile) {
        this.user = user;
    }

    loadUser = (userId: string) => { 
        if (!this.users[userId]) {
            this.entityRef.doc(userId).get().then((user: any) => {
                this.users[userId] = user;
            });
        } 
    }
}

export default ProfileStore;
