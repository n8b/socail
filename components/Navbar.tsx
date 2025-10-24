
import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface NavbarProps {
    onHomeClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onHomeClick }) => {
    return (
        <nav className="sticky top-0 z-10 w-full bg-surface/80 backdrop-blur-md border-b border-border-color">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div 
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={onHomeClick}
                    >
                        <SparklesIcon className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-bold text-text-primary">SOCaiL</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

// Dummy icon component as heroicons might not be available
const Icon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-7.19c0-.861.694-1.555 1.555-1.555h.01ZM1.61 3.093a.75.75 0 0 1 .54-.22h2.47a.75.75 0 0 1 .539.219l1.135 1.134a.75.75 0 0 1-1.06 1.06L4.24 4.16V6.75a.75.75 0 0 1-1.5 0V4.159l-1.135 1.135a.75.75 0 0 1-1.06-1.06l1.134-1.135Z" clipRule="evenodd" />
    </svg>
)

const SparklesIcon = Icon;


export default Navbar;
