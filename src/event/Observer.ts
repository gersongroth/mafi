import { IObjectMap } from '../types';

const observersMap: IObjectMap<IObservableItem[]> = {};

export const generateIdFromString = (value: string) => {
    return value.replace(/[^\w]/gi, '').toLowerCase();
};

export interface IObservable {
    item: IObservableItem;
    subscribe: (observable: IObservableItem) => () => IObservableItem;
    unsubscribe: () => void;
}

export interface IObservableItem {
    getListener: () => string;
    trigger: (data: any) => void;
    catch: (data: any) => void;
    getIsRemove: () => boolean;
    getId: () => string;
    getExec: () => string;
    getCatch: () => string;
}

const factory = (listenner: string, exec: (data: any) => void, removeOnCall = false, raiseException?: (data: any) => void) => {
    const item = ((): IObservableItem => {
        const id = listenner ? generateIdFromString(listenner + Math.random().toString(36).substr(2, 9)) : '';

        const trigger = (data: any) => {
            exec(data);
        };

        const catchException = (data: any) => {
            if (raiseException) {
                raiseException(data);
            } else {
                console.log('Catch is not defined for listener {0}', listenner);
            }
        };

        return {
            getListener: () => listenner,
            trigger,
            getIsRemove: () => removeOnCall,
            getId: () => id,
            getExec: () => exec.toString(),
            catch: catchException,
            getCatch: () => catchException.toString(),
        };
    })();

    return {
        item,
        subscribe: () => subscribe(item),
        unsubscribe: () => unsubscribe(item),
    };
};

const subscribe = (observable: IObservableItem) => {
    if (!observable.getId || !observable.getId()) {
        console.error('Invalid observable instance');
        return;
    }
    let collections = observersMap[observable.getListener()];
    if (!collections) {
        collections = observersMap[observable.getListener()] = [];
    }
    collections.push(observable);

    return observable;
};

const unsubscribe = (observable: IObservableItem) => {
    if (!observable.getId || !observable.getId()) {
        console.error('Invalid observable instance');
        return;
    }
    const collections = observersMap[observable.getListener()];
    if (!collections) {
        return;
    }
    const index = collections.findIndex(elem => observable.getId() === elem.getId());
    collections.splice(index, 1);
};

const notify = (listenner = '', data: any) => {
    const collections = observersMap[listenner];
    if (!collections) {
        return;
    }
    const collectionsToRemove: IObservableItem[] = [];
    for (const ob of collections) {
        ob.trigger(data);
        if (ob.getIsRemove()) {
            collectionsToRemove.push(ob);
        }
    }
    for (const collection of collectionsToRemove) {
        unsubscribe(collection);
    }
};

const notifyException = (listenner = '', data: any) => {
    const collections = observersMap[listenner];
    if (!collections) {
        return;
    }
    const collectionsToRemove: IObservableItem[] = [];
    for (const ob of collections) {
        ob.catch(data);
        if (ob.getIsRemove()) {
            collectionsToRemove.push(ob);
        }
    }
    for (const collection of collectionsToRemove) {
        unsubscribe(collection);
    }
};

const broadcast = (data: any) => {
    for (const property in observersMap) {
        const collections = observersMap[property];
        for (let index = 0; index < collections.length; index++) {
            const ob = collections[index];
            ob.trigger(data);
        }
    }
};

export { factory, notify, broadcast, notifyException };
