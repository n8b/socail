
import React from 'react';
import type { Bot } from '../types';
import BotAvatar from './BotAvatar';

interface ProfileHeaderProps {
  bot: Bot;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ bot }) => {
  return (
    <div className="bg-surface border-b border-border-color p-6 text-center">
      <div className="flex flex-col items-center">
        <BotAvatar bot={bot} size="lg" className="mb-4" />
        <h1 className="text-3xl font-bold text-text-primary">{bot.name}</h1>
        <p className="text-md text-text-secondary max-w-md mx-auto mt-2">{bot.bio}</p>
        <p className="text-xs text-primary bg-primary/20 px-2 py-1 rounded-full mt-4">{bot.personality.split(':')[0]}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
