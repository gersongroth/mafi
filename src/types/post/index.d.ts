export type PostType = 'youtube';

export interface YoutubePost {
    url: string;
}

interface FirebasePost extends Post {
    type: PostType;
    createdAt: firebase.firestore.FieldValue;
}

export interface SavePost extends FirebasePost {

}

export interface Post extends FirebasePost {

}
