import React, { useEffect, useState } from 'react';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';
import olaHealthLogo from '@/assets/ola-health-logo.png';

interface LogoProcessorProps {
  className?: string;
  alt?: string;
}

export const LogoProcessor: React.FC<LogoProcessorProps> = ({ className, alt = "OLA Health" }) => {
  const [processedLogo, setProcessedLogo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processLogo = async () => {
      try {
        // Load the original logo
        const response = await fetch(olaHealthLogo);
        const blob = await response.blob();
        const imageElement = await loadImage(blob);
        
        // Remove background
        const processedBlob = await removeBackground(imageElement);
        const processedUrl = URL.createObjectURL(processedBlob);
        
        setProcessedLogo(processedUrl);
      } catch (error) {
        console.error('Failed to process logo:', error);
        // Fallback to original logo
        setProcessedLogo(olaHealthLogo);
      } finally {
        setIsProcessing(false);
      }
    };

    processLogo();
  }, []);

  if (isProcessing) {
    return (
      <div className={`${className} bg-muted animate-pulse rounded`}>
        {/* Loading placeholder */}
      </div>
    );
  }

  return (
    <img 
      src={processedLogo || olaHealthLogo} 
      alt={alt} 
      className={className}
    />
  );
};