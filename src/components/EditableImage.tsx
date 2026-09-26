import React, { useRef, useState } from 'react';
import { Camera, Upload, Check, Maximize2, RefreshCw } from 'lucide-react';
import { readFileAsDataURL, saveImage } from '../utils/imageStorage';

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
  showUploadOverlayAlways?: boolean;
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
  badgePosition = 'top-left'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [isUploading, setIsUploading] = useState(false);
  const [justUploaded, setJustUploaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Keep state synced if prop changes
  React.useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  const handleFile = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    try {
      setIsUploading(true);
      const dataUrl = await readFileAsDataURL(file);
      setCurrentSrc(dataUrl);
      saveImage(id, dataUrl);
      if (onImageChanged) onImageChanged(dataUrl);
      setJustUploaded(true);
      setTimeout(() => setJustUploaded(false), 3000);
    } catch (err) {
      console.error('Failed to read image file:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const badgePositionClasses = {
    'top-left': 'top-2.5 left-2.5',
    'top-right': 'top-2.5 right-2.5',
    'bottom-left': 'bottom-2.5 left-2.5'
  };

  return (
    <div 
      className={`relative ${aspectRatio} overflow-hidden rounded-lg border border-[#1C1B19]/10 bg-[#F4F0E8] group/img ${containerClassName}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {/* Main Image */}
      <img
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover object-top contrast-[1.02] transition-transform duration-500 group-hover/img:scale-105 ${className}`}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => {
          if (currentSrc !== src) {
            setCurrentSrc(src);
          }
        }}
      />

      {/* Drag Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-[#1C1B19]/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20">
          <Upload className="h-7 w-7 animate-bounce mb-1" />
          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Drop photo to upload</span>
        </div>
      )}

      {/* Badge if provided */}
      {showBadge && (
        <div className={`absolute ${badgePositionClasses[badgePosition]} px-2 py-0.5 bg-[#1C1B19]/90 border border-white/20 text-white text-[9px] font-mono font-bold uppercase tracking-wider rounded z-10 pointer-events-none`}>
          {showBadge}
        </div>
      )}

      {/* Hover action overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B19]/80 via-[#1C1B19]/30 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col justify-end p-2.5 text-white z-10">
        <div className="flex items-center justify-between gap-1.5">
          {/* Upload Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#FDFBF7] text-[#1C1B19] hover:bg-white text-[10px] font-mono font-bold uppercase tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Upload and replace this image"
          >
            {justUploaded ? (
              <>
                <Check className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-700">Updated!</span>
              </>
            ) : isUploading ? (
              <>
                <RefreshCw className="h-3 w-3 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Camera className="h-3 w-3" />
                <span>Upload</span>
              </>
            )}
          </button>

          {/* View Full Button if available */}
          {onViewFull && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewFull();
              }}
              className="flex items-center space-x-1 px-2 py-1 rounded bg-[#1C1B19]/70 hover:bg-[#1C1B19] text-white/90 hover:text-white text-[10px] font-mono transition-all border border-white/20 cursor-pointer"
              title="View full picture"
            >
              <Maximize2 className="h-3 w-3" />
              <span>Full</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
