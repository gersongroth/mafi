import { action, makeAutoObservable } from 'mobx';

interface Profile {

}

class ProfileStore {
    user: Profile | undefined;

    constructor() {
        makeAutoObservable(this);
    }

    setUser(user: Profile) {
        this.user = user;
    }
}

export default ProfileStore;
