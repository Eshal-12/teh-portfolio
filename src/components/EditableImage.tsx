import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, Camera, RotateCcw } from 'lucide-react';
import { getSavedImage, saveImage, removeSavedImage, hasSavedCustomImage } from '../utils/imageStorage';

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
  onImageChanged,
  showBadge,
  badgePosition = 'top-left',
  allowUpload = false,
  uploadButtonLabel = 'Upload Picture',
  hideHoverTag = false
}) => {
  // Always load saved image if present, otherwise default to bundled src
  const [currentSrc, setCurrentSrc] = useState<string>(() => {
    return getSavedImage(id, src);
  });
  const [customSaved, setCustomSaved] = useState<boolean>(() => {
    return hasSavedCustomImage(id);
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync when prop or saved image changes
  useEffect(() => {
    const saved = getSavedImage(id, src);
    setCurrentSrc(saved);
    setCustomSaved(hasSavedCustomImage(id));
  }, [src, id]);

  // Listen for storage events across components
  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; dataUrl: string }>;
      if (customEvent.detail && customEvent.detail.key === id) {
        setCurrentSrc(customEvent.detail.dataUrl);
        setCustomSaved(true);
      }
    };

    const handleRemove = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string }>;
      if (customEvent.detail && customEvent.detail.key === id) {
        setCurrentSrc(src);
        setCustomSaved(false);
      }
    };

    window.addEventListener('custom_image_updated', handleUpdate);
    window.addEventListener('custom_image_removed', handleRemove);
    return () => {
      window.removeEventListener('custom_image_updated', handleUpdate);
      window.removeEventListener('custom_image_removed', handleRemove);
    };
  }, [id, src]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (15MB)
    if (file.size > 15 * 1024 * 1024) {
      alert('Selected image exceeds 15MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      if (dataUrl) {
        saveImage(id, dataUrl);
        setCurrentSrc(dataUrl);
        setCustomSaved(true);
        onImageChanged?.(dataUrl);
      }
    };
    reader.readAsDataURL(file);

    // Reset input so re-selecting same file works
    e.target.value = '';
  };

  const handleResetImage = () => {
    removeSavedImage(id);
    setCurrentSrc(src);
    setCustomSaved(false);
    onImageChanged?.(src);
  };

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
          const target = e.currentTarget;
          target.onerror = null; // Prevent loop

          if (currentSrc !== src) {
            // Revert back to original src if customSrc failed
            setCurrentSrc(src);
          } else {
            // First fallback: Check direct unhashed public path by id (e.g. /achievement_ach-dean_user.jpg)
            const publicPathById = `/${id}_user.jpg`;
            if (!target.src.endsWith(publicPathById)) {
              target.src = publicPathById;
              return;
            }

            // Second fallback: Strip Vite's 8-char hash if present (e.g. name-B8zdGINM.jpg -> name.jpg)
            const rawFilename = src.split('/').pop()?.split('?')[0] || '';
            const unhashed = rawFilename.replace(/-[A-Za-z0-9_-]{8}(\.[a-zA-Z0-9]+)$/, '$1');
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

      {/* Upload button only rendered when allowUpload is explicitly true */}
      {allowUpload && (
        <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1C1B19]/90 hover:bg-[#1C1B19] text-white text-[10px] font-mono font-bold tracking-wide rounded-md shadow-md transition-all cursor-pointer backdrop-blur-md border border-white/25 active:scale-95"
            title="Upload new picture"
          >
            <Camera className="w-3.5 h-3.5 text-white" />
            <span>{uploadButtonLabel}</span>
          </button>

          {customSaved && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleResetImage();
              }}
              className="p-1.5 bg-[#1C1B19]/90 hover:bg-red-800 text-white rounded-md shadow-md transition-all cursor-pointer backdrop-blur-md border border-white/25 active:scale-95"
              title="Reset to original picture"
            >
              <RotateCcw className="w-3 h-3 text-white" />
            </button>
          )}
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
