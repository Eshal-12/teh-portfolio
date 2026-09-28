import React, { useState, useEffect } from 'react';
import { Maximize2 } from 'lucide-react';

interface EditableImageProps {
  id: string; // unique storage key
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string; // e.g. "aspect-square", "aspect-[4/3]", "aspect-[16/9]"
  onViewFull?: () => void;
  onImageChanged?: (newSrc: string) => void;
  showBadge?: string;
  badgePosition?: 'top-left' | 'top-right' | 'bottom-left';
  allowUpload?: boolean;
  alwaysShowUploadButton?: boolean;
  uploadButtonLabel?: string;
  hideHoverTag?: boolean;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  id,
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatio = 'aspect-[4/3]',
  onViewFull,
  showBadge,
  badgePosition = 'top-left',
  hideHoverTag = false
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src);

  // Sync if prop changes
  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  const badgePositionClasses = {
    'top-left': 'top-2.5 left-2.5',
    'top-right': 'top-2.5 right-2.5',
    'bottom-left': 'bottom-2.5 left-2.5'
  };

  return (
    <div 
      className={`relative ${aspectRatio} overflow-hidden rounded-lg border border-[#1C1B19]/10 bg-[#F4F0E8] group/img ${onViewFull ? 'cursor-pointer' : ''} ${containerClassName}`}
      onClick={onViewFull}
    >
      {/* Main Image */}
      <img
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover object-top contrast-[1.02] transition-transform duration-500 group-hover/img:scale-105 ${className}`}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={(e) => {
          if (currentSrc !== src) {
            setCurrentSrc(src);
          } else {
            // Strip Vite's hash if present (e.g. name-B8zdGINM.jpg -> name.jpg)
            const rawFilename = src.split('/').pop()?.split('?')[0] || '';
            const unhashed = rawFilename.replace(/-[A-Za-z0-9_-]{8,}(\.[a-zA-Z0-9]+)$/, '$1');
            const target = e.currentTarget;
            if (unhashed && !target.src.endsWith(`/${unhashed}`)) {
              target.src = `/${unhashed}`;
            }
          }
        }}
      />

      {/* Badge if provided */}
      {showBadge && (
        <div className={`absolute ${badgePositionClasses[badgePosition]} px-2 py-0.5 bg-[#1C1B19]/90 border border-white/20 text-white text-[9px] font-mono font-bold uppercase tracking-wider rounded z-10 pointer-events-none`}>
          {showBadge}
        </div>
      )}

      {/* Subtle hover overlay for viewing full size if onViewFull is available */}
      {onViewFull && !hideHoverTag && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B19]/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end justify-between p-3 text-white z-10 pointer-events-none">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider">
            View Full Picture
          </span>
          <Maximize2 className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

