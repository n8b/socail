
export interface Bot {
  id: string;
  personality: string;
  name: string;
  bio: string;
  profilePicUrl: string;
}

export interface Comment {
  id: string;
  commenterId: string;
  text: string;
}

export interface Post {
  id: string;
  authorId: string;
  text: string;
  imageUrl: string;
  comments: Comment[];
  timestamp: number;
}
