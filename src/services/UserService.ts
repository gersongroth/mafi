import { firebase } from '../firebase/config';

export const findUser = async (userId: string) => {
    console.log('find user');
    const entityRef = firebase.firestore().collection('users');

    return entityRef.doc(userId).get();
}