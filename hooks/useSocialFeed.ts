import { useState, useEffect, useCallback } from 'react';
import type { Bot, Post, Comment } from '../types';
import { BOT_PERSONALITIES } from '../constants';
import { generateBotProfile, generatePost, generateComment, generateImage } from '../services/geminiService';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useSocialFeed = () => {
  const [bots, setBots] = useState<Record<string, Bot>>({});
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingStatus, setLoadingStatus] = useState<string>('Initializing...');

  const regenerateFeed = useCallback(async () => {
    setLoading(true);
    
    try {
      // 1. Generate Bot Profiles
      setLoadingStatus('Generating bot personalities...');
      const botProfiles: Bot[] = await Promise.all(
        BOT_PERSONALITIES.map(async (personality, index) => {
          const id = `bot-${index + 1}`;
          await delay(200 * index); // Stagger API calls
          const profile = await generateBotProfile(personality);
          await delay(500);
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
          await delay(200 * index);
          const postContent = await generatePost(bot);
          await delay(500);
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

              for (const [index, commenterId] of commenterIds.entries()) {
                  await delay(200 * index);
                  const commenter = botsMap[commenterId];
                  const postAuthor = botsMap[post.authorId];
                  const commentContent = await generateComment(tempPost, postAuthor, commenter, tempPost.comments);
                  
                  // Comments appear sequentially after the post
                  const commentTimestamp = tempPost.timestamp + (index + 1) * 1000 * 60 * (Math.random() * 5 + 1);

                  tempPost.comments.push({
                      id: `comment-${Date.now()}-${commenterId}`,
                      commenterId: commenterId,
                      text: commentContent.text,
                      timestamp: commentTimestamp,
                  });
              }
              // Sort comments by time
              tempPost.comments.sort((a, b) => a.timestamp - b.timestamp);
              return tempPost;
          })
      );

      setPosts(postsWithComments.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
        console.error("Failed to regenerate feed:", error);
        setLoadingStatus("Error generating feed. Please try again.");
        // Optionally reset to cached data or show an error state
    } finally {
        setLoading(false);
        setLoadingStatus('');
    }
  }, []);

  useEffect(() => {
    const loadInitialFeed = async () => {
        setLoading(true);
        setLoadingStatus('Loading feed from cache...');
        try {
            const response = await fetch('/data.json');
            if (!response.ok) throw new Error('Cache miss or network error');
            const data = await response.json();
            if (!data.bots || !data.posts) throw new Error('Invalid cache format');
            setBots(data.bots);
            setPosts(data.posts);
        } catch (error) {
            console.warn(`Could not load cached feed (${error.message}). Generating a new one.`);
            await regenerateFeed();
        } finally {
            setLoading(false);
            setLoadingStatus('');
        }
    };
    
    loadInitialFeed();
  }, [regenerateFeed]);

  return { bots, posts, loading, loadingStatus, regenerateFeed };
};