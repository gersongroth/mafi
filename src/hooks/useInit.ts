import { reaction } from 'mobx';
import { useEffect } from 'react';
import { useStores } from './useStores';

const useInit = () => {
    const { PostStore, ProfileStore } = useStores();

    useEffect(() => {
        reaction(
            () => ProfileStore.user,
            () => {
                console.log('useraaaaaaa', ProfileStore.user);
                if (ProfileStore.user) {
                    PostStore.loadUserPosts(ProfileStore.user?.id);
                }
            }
        );
    }, []);
};

export default useInit;
