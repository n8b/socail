import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

interface NavbarProps {
    onHomeClick: () => void;
    onRefreshClick: () => void;
}

const RobotIcon: React.FC<{className: string}> = ({className}) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <title>Robot Icon</title>
        <rect x="5" y="9" width="14" height="10" rx="2"></rect>
        <path d="M9 5V9"></path>
        <path d="M15 5V9"></path>
        <circle cx="9.5" cy="14" r="0.5" fill="currentColor"></circle>
        <circle cx="14.5" cy="14" r="0.5" fill="currentColor"></circle>
    </svg>
);

const Navbar: React.FC<NavbarProps> = ({ onHomeClick, onRefreshClick }) => {
    return (
        <nav className="sticky top-0 z-10 w-full bg-surface/80 backdrop-blur-md border-b border-border-color">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div 
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={onHomeClick}
                    >
                        <RobotIcon className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-bold text-text-primary tracking-tight">
                            <span>SOC</span>
                            <span className="font-mono text-primary">ai</span>
                            <span>L</span>
                        </span>
                    </div>
                    <button
                        onClick={onRefreshClick}
                        className="p-2 rounded-full hover:bg-border-color transition-colors duration-200"
                        aria-label="Refresh feed"
                    >
                        <ArrowPathIcon className="h-6 w-6 text-text-secondary" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

// Dummy icon components as heroicons might not be available
const Icon: React.FC<{className: string, children: React.ReactNode}> = ({className, children}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        {children}
    </svg>
)

const ArrowPathIcon: React.FC<{className: string}> = ({className}) => (
    <Icon className={className}>
        <path fillRule="evenodd" d="M15.312 5.25a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0v-1.19l-4.72 4.72a.75.75 0 1 1-1.06-1.06l4.72-4.72h-1.19a.75.75 0 0 1-.75-.75Zm-8.624 8.624a.75.75 0 0 1-1.06-1.06l4.72-4.72h-1.19a.75.75 0 0 1-.75-.75.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0v-1.19l-4.72 4.72Z" clipRule="evenodd" />
        <path d="M5.53 4.22a.75.75 0 0 0-1.06 1.06l1.06-1.06Zm13.25 13.25a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM18.78 5.28a.75.75 0 0 0-1.06-1.06l1.06 1.06ZM5.28 18.78a.75.75 0 0 0 1.06 1.06l-1.06-1.06ZM4.47 5.28a5.25 5.25 0 0 1 7.424 0l1.06-1.06A6.75 6.75 0 0 0 4.47 5.28Zm0 13.5a5.25 5.25 0 0 1 0-7.424l-1.06 1.06a6.75 6.75 0 0 0 0 9.545l1.06-1.06Zm7.424 0a5.25 5.25 0 0 1-7.424 0l-1.06 1.06a6.75 6.75 0 0 0 9.545 0l-1.06-1.06Zm0-13.5a5.25 5.25 0 0 1 0 7.424l1.06-1.06a6.75 6.75 0 0 0 0-9.545l-1.06 1.06Z" />
    </Icon>
)

export default Navbar;