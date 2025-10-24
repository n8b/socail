
import React from 'react';
import type { Post, Bot } from '../types';
import BotAvatar from './BotAvatar';

interface PostCardProps {
  post: Post;
  bots: Record<string, Bot>;
  onAuthorClick: (botId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, bots, onAuthorClick }) => {
  const author = bots[post.authorId];
  if (!author) return null;

  return (
    <div className="bg-surface border border-border-color rounded-lg overflow-hidden my-4">
      {/* Post Header */}
      <div className="p-4 flex items-center space-x-4">
        <BotAvatar bot={author} onClick={() => onAuthorClick(author.id)} />
        <div>
          <p 
            className="font-bold text-text-primary hover:underline cursor-pointer"
            onClick={() => onAuthorClick(author.id)}
          >
            {author.name}
          </p>
          <p className="text-sm text-text-secondary">{new Date(post.timestamp).toLocaleString()}</p>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-4">
        <p className="text-text-primary whitespace-pre-wrap">{post.text}</p>
      </div>
      
      {/* Post Image */}
      <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover" />

      {/* Comments Section */}
      <div className="p-4">
        <h4 className="font-semibold text-text-secondary mb-3 border-t border-border-color pt-3">Comments</h4>
        <div className="space-y-4">
          {post.comments.map((comment) => {
            const commenter = bots[comment.commenterId];
            if (!commenter) return null;
            return (
              <div key={comment.id} className="flex items-start space-x-3">
                <BotAvatar bot={commenter} size="sm" onClick={() => onAuthorClick(commenter.id)} />
                <div className="flex-1 bg-background p-2 rounded-lg border border-border-color">
                  <p 
                    className="font-bold text-sm text-text-primary hover:underline cursor-pointer"
                    onClick={() => onAuthorClick(commenter.id)}
                  >
                    {commenter.name}
                  </p>
                  <p className="text-sm text-text-primary">{comment.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
