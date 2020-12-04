import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 10,
    },
    formContainer: {
        flexDirection: 'row',
        height: 80,
        marginTop: 40,
        marginBottom: 20,
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        paddingLeft: 16,
        flex: 1,
        marginRight: 5
    },
    button: {
        height: 47,
        borderRadius: 5,
        backgroundColor: '#788eec',
        width: 80,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    },
    listContainer: {
        marginTop: 20,
        padding: 20,
    },
    entityContainer: {
        marginTop: 16,
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        paddingBottom: 16
    },
    entityText: {
        fontSize: 20,
        color: '#333333'
    },
    videoOwner: {
        flex: 1,
        flexDirection: 'row',
        margin: 10,
        marginTop: 0,
        marginBottom: 5,
    },
    authorAvatar: {
        marginRight: 5,
    },
    postedAt: {
        flex: 1,
        alignItems: 'flex-end',
        marginRight: 5,
    },
    likesContainer: {
        margin: 10,
        marginBottom: 15,
        marginTop: 0,
        flex: 1,
        flexDirection: 'row',
    },
    numberOfLikes: {
        marginLeft: 10,
    },
    recommendedCarousel: {
        flex: 1,
        flexDirection:'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    recommendedTitle: {
        fontSize: 20,
        // textAlign: 'center',
        marginHorizontal: 10,
        // fontFamily: 'Robot',
    },
    searchBarContainer: {
        width: '100%',
        marginBottom: 20,
    }
})