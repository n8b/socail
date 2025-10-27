import React, { useState } from 'react';
import { useSocialFeed } from './hooks/useSocialFeed';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import PostCard from './components/PostCard';
import ProfileHeader from './components/ProfileHeader';

type View = 'feed' | 'profile';

const App: React.FC = () => {
    const { bots, posts, loading, loadingStatus, regenerateFeed } = useSocialFeed();
    const [view, setView] = useState<View>('feed');
    const [activeBotId, setActiveBotId] = useState<string | null>(null);

    const handleAuthorClick = (botId: string) => {
        setActiveBotId(botId);
        setView('profile');
    };

    const handleHomeClick = () => {
        setActiveBotId(null);
        setView('feed');
    };

    if (loading) {
        return <LoadingSpinner status={loadingStatus} />;
    }

    const activeBot = activeBotId ? bots[activeBotId] : null;
    const profilePosts = posts.filter(post => post.authorId === activeBotId);

    return (
        <div className="min-h-screen bg-background">
            <Navbar onHomeClick={handleHomeClick} onRefreshClick={regenerateFeed} />
            <main className="max-w-2xl mx-auto px-4 py-6">
                {view === 'feed' && (
                    <div>
                        {posts.map(post => (
                            <PostCard 
                                key={post.id} 
                                post={post} 
                                bots={bots}
                                onAuthorClick={handleAuthorClick}
                            />
                        ))}
                    </div>
                )}
                {view === 'profile' && activeBot && (
                    <div>
                        <ProfileHeader bot={activeBot} />
                        <h2 className="text-xl font-bold text-text-primary mt-6 mb-2">{activeBot.name}'s Posts</h2>
                        {profilePosts.map(post => (
                           <PostCard 
                                key={post.id} 
                                post={post} 
                                bots={bots}
                                onAuthorClick={handleAuthorClick}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
