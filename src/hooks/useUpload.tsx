import { useCallback, useState } from "react";

// Return type của hook - đơn giản và dễ hiểu
interface UploadReturn<T> {
  // State cơ bản
  uploadProgress: number;
  isUploading: boolean;
  error: string | null;
  uploadedResult: T | null;
  
  // Actions cơ bản
  uploadFile: (file: File) => Promise<T>;
  stopUpload: () => void;
  resetUpload: () => void;
  
  // Helper đơn giản
  hasError: boolean;
  isCompleted: boolean;
}

function useUpload<T>(
  uploadFn: (file: File, onProgress: (p: number) => void) => Promise<T>
): UploadReturn<T> {
  // State management đơn giản
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedResult, setUploadedResult] = useState<T | null>(null);

  // Stop upload
  const stopUpload = useCallback(() => {
    setIsUploading(false);
    setUploadProgress(0);
  }, []);

  // Reset upload - đơn giản
  const resetUpload = useCallback(() => {
    setUploadProgress(0);
    setIsUploading(false);
    setError(null);
    setUploadedResult(null);
  }, []);

  // Main upload function - đơn giản và dễ hiểu
  const uploadFile = useCallback(
    async (file: File): Promise<T> => {
      try {
        // Reset state và bắt đầu upload
        setUploadProgress(0);
        setIsUploading(true);
        setError(null);
        setUploadedResult(null);

        // Thực hiện upload với progress tracking
        const result = await uploadFn(file, (progress) => {
          setUploadProgress(progress);
        });

        // Upload thành công
        setIsUploading(false);
        setUploadedResult(result);
        setUploadProgress(100);

        return result;

      } catch (err: any) {
        const errorMessage = err.message || "Upload failed";
        
        // Upload thất bại
        setIsUploading(false);
        setError(errorMessage);
        setUploadProgress(0);

        throw err;
      }
    },
    [uploadFn]
  );

  // Computed values đơn giản
  const hasError = Boolean(error);
  const isCompleted = Boolean(uploadedResult) && !isUploading;

  return {
    // State
    uploadProgress,
    isUploading,
    error,
    uploadedResult,
    
    // Actions
    uploadFile,
    stopUpload,
    resetUpload,
    
    // Helpers
    hasError,
    isCompleted
  };
}

export { useUpload };
export type { UploadReturn };