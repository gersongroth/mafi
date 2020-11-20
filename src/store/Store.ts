import { configure } from 'mobx';
import { createContext } from 'react';
import ProfileStore from './definition/ProfileStore';

configure({
    enforceActions: 'observed',
    computedRequiresReaction: true,
    reactionRequiresObservable: true,
    observableRequiresReaction: false,
});
class RootStore {
    ProfileStore = new ProfileStore();
}

const StoreList = new RootStore();
const StoreContext = createContext(StoreList);

export { StoreList, StoreContext };
