export const getYoutubeId = (youtubeURL: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = youtubeURL.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}
