import { useCallback, useEffect, useMemo, useState } from 'react';

export const useUploadFile = () => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [banner, setBanner] = useState<null | {
    type: 'success' | 'error';
    msg: string | React.ReactNode;
  }>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const stopUpload = useCallback(() => {
    setIsUploading(false);
    setUploadProgress(0);
  }, []);

  const handleFileSelect = useCallback(
    async (
      file: File | undefined,
      setFieldValue: (
        field: string,
        value: unknown,
        shouldValidate?: boolean
      ) => void
    ) => {
      if (!file) return;
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }

      await setFieldValue('file', file, true);
    },
    []
  );

  const dropHandlers = useMemo(
    () => ({
      onDragOver: (e: React.DragEvent) => e.preventDefault(),
      onDragEnter: (e: React.DragEvent) => e.preventDefault(),
      onDragLeave: (e: React.DragEvent) => e.preventDefault(),
    }),
    []
  );

  // Cleanup URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return {
    uploadProgress,
    setUploadProgress,
    isUploading,
    setIsUploading,
    banner,
    setBanner,
    previewUrl,
    setPreviewUrl,
    stopUpload,
    handleFileSelect,
    dropHandlers,
  };
};
