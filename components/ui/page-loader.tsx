import React from 'react';
import Spinner from './spinner';

interface PageLoaderProps {
  title?: string;
  description?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({ 
  title = "Loading...", 
  description = "Please wait while we load your data" 
}) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <Spinner size="lg" color="primary" />
      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          {title}
        </h2>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          {description}
        </p>
      </div>
    </div>
  );
};

export default PageLoader;