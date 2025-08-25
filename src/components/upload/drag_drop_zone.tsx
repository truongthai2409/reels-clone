import React, { useState, useCallback, useRef } from 'react';

interface DragDropZoneProps {
  onFilesDrop: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const DragDropZone: React.FC<DragDropZoneProps> = ({
  onFilesDrop,
  accept = '*/*',
  multiple = false,
  maxSize,
  children,
  className = '',
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const validateFiles = useCallback(
    (files: File[]): File[] => {
      let validFiles = files;
      if (accept !== '*/*') {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        validFiles = validFiles.filter(file => {
          return acceptedTypes.some(acceptedType => {
            if (acceptedType.startsWith('.')) {
              return file.name
                .toLowerCase()
                .endsWith(acceptedType.toLowerCase());
            } else if (acceptedType.includes('*')) {
              const pattern = acceptedType.replace('*', '.*');
              return new RegExp(pattern).test(file.type);
            } else {
              return file.type === acceptedType;
            }
          });
        });
      }

      if (maxSize) {
        validFiles = validFiles.filter(file => file.size <= maxSize);
      }

      return validFiles;
    },
    [accept, maxSize]
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setDragCounter(prev => prev + 1);
      setIsDragOver(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setDragCounter(prev => prev - 1);
      if (dragCounter === 1) {
        setIsDragOver(false);
      }
    },
    [dragCounter, disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
    },
    [disabled]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      setDragCounter(0);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        const validFiles = validateFiles(files);

        if (validFiles.length > 0) {
          if (!multiple && validFiles.length > 1) {
            onFilesDrop(validFiles.slice(0, 1));
          } else {
            onFilesDrop(validFiles);
          }
        }

        if (validFiles.length < files.length) {
          const filteredCount = files.length - validFiles.length;
          console.warn(
            `${filteredCount} file(s) were filtered out due to type or size restrictions`
          );
        }
      }
    },
    [disabled, multiple, validateFiles, onFilesDrop]
  );

  const getDragOverlayContent = () => {
    if (accept !== '*/*') {
      return `Drop ${multiple ? 'files' : 'file'} here (${accept})`;
    }
    return `Drop ${multiple ? 'files' : 'file'} here`;
  };

  return (
    <div
      ref={dropZoneRef}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
                relative transition-all duration-200
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${className}
            `}
    >
      {isDragOver && !disabled && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 border-2 border-blue-500 border-dashed rounded-lg flex items-center justify-center z-10">
          <div className="text-blue-700 font-medium text-lg text-center">
            {getDragOverlayContent()}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export const useDragAndDrop = (onFilesDrop: (files: File[]) => void) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter(prev => prev - 1);
      if (dragCounter === 1) {
        setIsDragOver(false);
      }
    },
    [dragCounter]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      setDragCounter(0);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFilesDrop(files);
      }
    },
    [onFilesDrop]
  );

  return {
    isDragOver,
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
  };
};
