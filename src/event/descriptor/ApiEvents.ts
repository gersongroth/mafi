import eventFactory, { IEventGroup } from '../EventFactory';

export const apiEvents: IEventGroup = {
    addPost: eventFactory('addPost', 'Triggered when a post is added', true),
};
