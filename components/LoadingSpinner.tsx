
import React from 'react';

interface LoadingSpinnerProps {
    status: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ status }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent border-solid rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-text-secondary">{status}</p>
    </div>
  );
};

export default LoadingSpinner;
