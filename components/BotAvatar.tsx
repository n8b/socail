
import React from 'react';
import type { Bot } from '../types';

interface BotAvatarProps {
  bot: Bot;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const BotAvatar: React.FC<BotAvatarProps> = ({ bot, size = 'md', className = '', onClick }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
  };

  return (
    <img
      src={bot.profilePicUrl}
      alt={bot.name}
      className={`rounded-full object-cover border-2 border-border-color ${sizeClasses[size]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    />
  );
};

export default BotAvatar;
