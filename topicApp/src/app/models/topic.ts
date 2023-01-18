import { Post } from "./post";

export interface Topic {
   id: number;
   name: string;
   posts: Array<Post>
}
