import { useField } from 'formik';
import React, { useRef, useState, useCallback } from 'react';

interface UploadFieldProps {
  label?: string;
  name: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  onFileSelect?: (files: File[]) => void;
  [key: string]: any;
}

export const UploadField: React.FC<UploadFieldProps> = ({
  label,
  accept = '*/*',
  multiple = false,
  maxSize,
  onFileSelect,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const validateAndSetFiles = useCallback(
    (files: File[]) => {
      if (maxSize) {
        const oversizedFiles = files.filter(file => file.size > maxSize);
        if (oversizedFiles.length > 0) {
          const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
          alert(`Some files exceed the maximum size of ${maxSizeMB}MB`);
          return false;
        }
      }

      helpers.setValue(multiple ? files : files[0]);

      if (onFileSelect) {
        onFileSelect(files);
      }
      return true;
    },
    [maxSize, multiple, helpers, onFileSelect]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      validateAndSetFiles(fileArray);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter(prev => prev - 1);
      if (dragCounter === 1) {
        setIsDragOver(false);
      }
    },
    [dragCounter]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      setDragCounter(0);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        validateAndSetFiles(files);
      }
    },
    [validateAndSetFiles]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getFileNames = () => {
    if (!field.value) return 'No file selected';
    if (multiple && Array.isArray(field.value)) {
      return field.value.map((file: File) => file.name).join(', ');
    }
    return field.value.name;
  };

  const getFileSize = () => {
    if (!field.value) return '';
    if (multiple && Array.isArray(field.value)) {
      const totalSize = field.value.reduce((acc, file) => acc + file.size, 0);
      return `(${(totalSize / (1024 * 1024)).toFixed(2)}MB)`;
    }
    return `(${(field.value.size / (1024 * 1024)).toFixed(2)}MB)`;
  };

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div
        ref={dropZoneRef}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
                    relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer
                    ${
                      isDragOver
                        ? 'border-blue-500 bg-blue-50 scale-105'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }
                `}
        onClick={handleClick}
      >
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center">
            <div className="text-blue-600 font-medium text-lg">
              Drop files here to upload
            </div>
          </div>
        )}

        <div className="mb-4">
          <svg
            className={`mx-auto h-12 w-12 transition-colors duration-200 ${
              isDragOver ? 'text-blue-500' : 'text-gray-400'
            }`}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <p
            className={`text-lg font-medium transition-colors duration-200 ${
              isDragOver ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            {isDragOver ? 'Drop your files here' : 'Drag & drop files here'}
          </p>
          <p className="text-sm text-gray-500">
            or{' '}
            <span className="text-blue-500 font-medium">click to browse</span>
          </p>
        </div>

        <div className="mt-4 text-xs text-gray-400">
          {accept !== '*/*' && `Accepted formats: ${accept}`}
        </div>
      </div>

      {field.value && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                {getFileNames()}
              </p>
              <p className="text-xs text-gray-500">{getFileSize()}</p>
            </div>
            <button
              type="button"
              onClick={() => helpers.setValue(multiple ? [] : null)}
              className="ml-2 text-red-500 hover:text-red-700 transition-colors"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        {...props}
      />

      {meta.touched && meta.error && (
        <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {meta.error}
        </div>
      )}

      {maxSize && (
        <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Max file size: {(maxSize / (1024 * 1024)).toFixed(2)}MB
        </div>
      )}
    </div>
  );
};
