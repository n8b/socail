import { useState, useEffect, useCallback } from 'react';
import type { Bot, Post, Comment } from '../types';
import { BOT_PERSONALITIES } from '../constants';
import { generateBotProfile, generatePost, generateComment, generateImage } from '../services/geminiService';

export const useSocialFeed = () => {
  const [bots, setBots] = useState<Record<string, Bot>>({});
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingStatus, setLoadingStatus] = useState<string>('Initializing...');

  const generateInitialFeed = useCallback(async () => {
    setLoading(true);
    
    // 1. Generate Bot Profiles
    setLoadingStatus('Generating bot personalities...');
    const botProfiles: Bot[] = await Promise.all(
      BOT_PERSONALITIES.map(async (personality, index) => {
        const id = `bot-${index + 1}`;
        const profile = await generateBotProfile(personality);
        const profilePicUrl = await generateImage(profile.profilePicPrompt, { width: 100, height: 100 });
        return {
          id,
          personality,
          name: profile.name,
          bio: profile.bio,
          profilePicUrl: profilePicUrl,
        };
      })
    );
    const botsMap: Record<string, Bot> = botProfiles.reduce((acc, bot) => {
        acc[bot.id] = bot;
        return acc;
    }, {} as Record<string, Bot>);
    setBots(botsMap);

    // 2. Generate Posts
    setLoadingStatus('Bots are writing posts...');
    const generatedPosts: Post[] = await Promise.all(
      botProfiles.map(async (bot, index) => {
        const postContent = await generatePost(bot);
        const imageUrl = await generateImage(postContent.imagePrompt, { width: 800, height: 600 });
        return {
          id: `post-${Date.now()}-${index}`,
          authorId: bot.id,
          text: postContent.text,
          imageUrl: imageUrl,
          comments: [],
          timestamp: Date.now() - Math.random() * 1000 * 60 * 60, // Random timestamp in the last hour
        };
      })
    );

    // 3. Generate Comments
    setLoadingStatus('Bots are commenting on posts...');
    const postsWithComments = await Promise.all(
        generatedPosts.map(async (post) => {
            const tempPost = {...post, comments: [] as Comment[]};
            const commenterIds = botProfiles
                .map(b => b.id)
                .filter(id => id !== post.authorId)
                .sort(() => 0.5 - Math.random()) // Shuffle
                .slice(0, Math.floor(Math.random() * 3) + 2); // 2-4 comments

            for (const commenterId of commenterIds) {
                const commenter = botsMap[commenterId];
                const postAuthor = botsMap[post.authorId];
                const commentContent = await generateComment(tempPost, postAuthor, commenter, tempPost.comments);
                tempPost.comments.push({
                    id: `comment-${Date.now()}-${commenterId}`,
                    commenterId: commenterId,
                    text: commentContent.text,
                });
            }
            return tempPost;
        })
    );

    setPosts(postsWithComments.sort((a, b) => b.timestamp - a.timestamp));
    setLoading(false);
    setLoadingStatus('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    generateInitialFeed();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { bots, posts, loading, loadingStatus };
};
