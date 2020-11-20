import { IObservable } from 'mobx';

export interface StoreInterface {
    [prop: string]: IObservable;
}
