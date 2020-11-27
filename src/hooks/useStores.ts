import { useContext } from 'react';
import { StoreContext, StoreList } from '../store/Store';

export const useStores = () => useContext(StoreContext);
export const AbstractStore = StoreList;
