import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { Bot, Post, Comment } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// FIX: Added a space between `const` and `_generateJson` to correct the function declaration syntax.
const _generateJson = async <T,>(prompt: string, schema: any): Promise<T> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.8,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as T;
    } catch (error) {
        console.error("Error generating JSON from Gemini:", error);
        // Fallback or re-throw
        throw new Error("Failed to get a valid JSON response from the AI.");
    }
};

export const generateBotProfile = async (personality: string): Promise<{name: string, bio: string, profilePicPrompt: string}> => {
    const prompt = `Generate a social media profile for an AI bot with this personality: "${personality}". Provide a unique, creative name, a short bio (max 150 characters), and a prompt for generating a profile picture. The profile picture prompt should be a simple, descriptive phrase suitable for an image generation AI. Return a single JSON object.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "The bot's name." },
            bio: { type: Type.STRING, description: "The bot's biography." },
            profilePicPrompt: { type: Type.STRING, description: "A prompt for the bot's profile picture." }
        },
        required: ["name", "bio", "profilePicPrompt"]
    };
    return _generateJson<{name: string, bio: string, profilePicPrompt: string}>(prompt, schema);
};

export const generatePost = async (bot: Bot): Promise<{text: string, imagePrompt: string}> => {
    const prompt = `You are ${bot.name}, an AI with a '${bot.personality}' personality. Your bio is "${bot.bio}". Generate a new, short social media post that fits your personality. The post should have text (under 280 characters) and a descriptive prompt for an image to accompany it. The image prompt should be a simple phrase for an image generation AI. Return a single JSON object.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            text: { type: Type.STRING, description: "The text content of the social media post." },
            imagePrompt: { type: Type.STRING, description: "A prompt to generate an image for the post." }
        },
        required: ["text", "imagePrompt"]
    };
    return _generateJson<{text: string, imagePrompt: string}>(prompt, schema);
};

export const generateComment = async (post: Post, postAuthor: Bot, commenter: Bot, existingComments: Comment[]): Promise<{text: string}> => {
    const existingCommentsText = existingComments.map(c => `- Comment: "${c.text}"`).join('\n');
    const prompt = `You are ${commenter.name}, an AI with a '${commenter.personality}' personality.
    You are viewing a post by ${postAuthor.name} (${postAuthor.personality}) that says: "${post.text}".
    The existing comments are:\n${existingCommentsText || "None"}
    Write a short, in-character comment on this post. Your comment should be unique, relevant to the post and your personality, and feel like a genuine interaction. Return a single JSON object.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            text: { type: Type.STRING, description: "The text of the comment." }
        },
        required: ["text"]
    };
    return _generateJson<{text: string}>(prompt, schema);
};

export const generateImage = async (prompt: string, fallbackSize: {width: number, height: number} = {width: 800, height: 600}): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:image/png;base64,${base64ImageBytes}`;
            }
        }
        throw new Error("No image data found in response.");
    } catch (error) {
        console.error("Error generating image from Gemini:", error);
        // Fallback to a placeholder image if generation fails. This improves user experience.
        return `https://via.placeholder.com/${fallbackSize.width}x${fallbackSize.height}.png?text=Image+Failed`;
    }
};
