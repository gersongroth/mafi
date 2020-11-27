import { factory, notify, notifyException } from './Observer';

export interface IEventNotification {
    event: string;
    data: any;
    unsubscribe: () => void;
}

export interface IEvent {
    getName: () => string;
    getDescription: () => string;
    isMemoized: () => boolean;
    trigger: (data?: any) => void;
    catch: (data?: any) => void;
    subscribe: (
        exec: (props: IEventNotification) => void,
        removeOnCall?: boolean,
        raiseException?: (props: IEventNotification) => void
    ) => () => void;
}

export interface IEventGroup {
    [propName: string]: IEvent;
}

export interface IEventManager {
    [propName: string]: IEventGroup;
}
/**
 *  @param {string} name - Define event Name
 *  @param {string} description - Define description of event
 *  @param {boolean} memoized - Define if data will be memoized and returned to subscribe even after triggered once
 *
 */
const EventFactory = (name: string, description = '', memoized = false): IEvent => {
    let triggeredData: any;
    let unsubscribeGlobal: any;
    const trigger = (name: string, data: any) => {
        if (memoized) {
            triggeredData = data;
        }
        notify(name, { event: name, data: data, unsubscribe: unsubscribeGlobal });
    };

    const raiseException = (name: string, data: any) => {
        notifyException(name, { event: name, data: data });
    };

    const subscribe = (
        name: string,
        exec: (data: IEventNotification) => void,
        removeOnCall = false,
        triggeredData: any,
        raiseException?: (data: IEventNotification) => void
    ) => {
        const { subscribe, unsubscribe } = factory(name, exec, removeOnCall, raiseException);
        subscribe();
        unsubscribeGlobal = unsubscribe;

        if (triggeredData) {
            exec({ event: name, data: triggeredData, unsubscribe: unsubscribe });
            if (removeOnCall) {
                unsubscribe();
            }
        }
        return unsubscribe;
    };

    return {
        getName: () => name,
        getDescription: () => description,
        isMemoized: () => memoized,
        trigger: (data: any) => trigger(name, data),
        catch: (data: any) => raiseException(name, data),
        subscribe: (
            exec: (props: IEventNotification) => void,
            removeOnCall?: boolean,
            raiseException?: (props: IEventNotification) => void
        ) => subscribe(name, exec, removeOnCall, triggeredData, raiseException),
    };
};

export default EventFactory;
