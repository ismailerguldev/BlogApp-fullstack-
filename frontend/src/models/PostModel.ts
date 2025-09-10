export interface IPost {
    _id:string
    title: string
    username: string
    body: string
    createdAt: Date
    likeCount: number,
    commentCount: number
}