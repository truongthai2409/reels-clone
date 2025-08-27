import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import type { UploadImageValues } from '@/types/form.types';
import {
  uploadVideoWithProgress,
  uploadVideoInChunks,
  getVideoInfo,
} from '@/services/upload/upload_video.service';
import { ProgressBar } from '@/components/upload';
import { useBanner } from '@/hooks/useBanner';
import { useUpload } from '@/hooks/useUpload';
import { SubmitButton } from '@/components/upload/submit_button';
import { SUPPORTED_VIDEO_TYPES } from '@/constraints';
import { validateVideoFile } from '@/helpers/validations';

const initialValues: UploadImageValues = {
  file: null,
  acceptTerms: false,
};
 
interface VideoInfo {
  duration: number;
  width: number;
  height: number;
}

interface ChunkProgress {
  current: number;
  total: number;
}

export const UploadVideo: React.FC = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [uploadMode, setUploadMode] = useState<'normal' | 'chunked'>('normal');
  const [chunkProgress, setChunkProgress] = useState<ChunkProgress | null>(null);

  const { setBanner, Banner } = useBanner();
  const normalUpload = useUpload(uploadVideoWithProgress);
  
  const chunkedUpload = useUpload(async (file: File, onProgress: (p: number) => void) => {
    return await uploadVideoInChunks(
      file,
      1024 * 1024, // 1MB chunks
      onProgress,
      (current, total) => setChunkProgress({ current, total })
    );
  });

  const currentUpload = uploadMode === 'normal' ? normalUpload : chunkedUpload;
  const { 
    uploadProgress, 
    isUploading, 
    error, 
    uploadedResult, 
    stopUpload, 
    uploadFile,
  } = currentUpload;

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

      if (file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        try {
          const info = await getVideoInfo(file);
          setVideoInfo(info);
        } catch (error) {
          console.error('Error getting video info:', error);
          setVideoInfo(null);
        }
      }

      await setFieldValue('file', file, true);
    },
    []
  );

  const handleDrop = useCallback(
    async (
      e: React.DragEvent<HTMLLabelElement>,
      setFieldValue: (
        field: string,
        value: unknown,
        shouldValidate?: boolean
      ) => void
    ) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      handleFileSelect(f, setFieldValue);
    },
    []
  );

  const handleFileChange = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      setFieldValue: (
        field: string,
        value: unknown,
        shouldValidate?: boolean
      ) => void
    ) => {
      const file = e.target.files?.[0];
      handleFileSelect(file, setFieldValue);
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

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (error) {
      setBanner({ type: 'error', msg: `Upload failed: ${error}` });
    }
  }, [error, setBanner]);

  useEffect(() => {
    if (uploadedResult && !isUploading) {
      setBanner({
        type: 'success',
        msg: (
          <div>
            <p>Video uploaded successfully!</p>
            <p>File: {uploadedResult.originalName}</p>
            {videoInfo && (
              <p>
                Resolution: {videoInfo.width}x{videoInfo.height}
              </p>
            )}
          </div>
        ),
      });
    }
  }, [uploadedResult, isUploading, videoInfo, setBanner]);

  const handleSubmit = async (
    values: UploadImageValues,
    { setSubmitting, resetForm }: any
  ) => {
    if (!values.file) {
      setBanner({ type: 'error', msg: 'Please select a file to upload' });
      return;
    }

    // Validate video bên ngoài
    if (uploadMode === 'chunked') {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const validation = validateVideoFile(values.file, maxSize);
      if (!validation.isValid) {
        setBanner({ type: 'error', msg: validation.error });
        return;
      }
    } else {
      const maxSize = 5 * 1000 * 1024 * 1024; // 5GB
      console.log(values);
      const validation = validateVideoFile(values.file, maxSize);
      if (!validation.isValid) {
        setBanner({ type: 'error', msg: validation.error });
        return;
      }
    }

    setSubmitting(true);
    setBanner(null);
    setChunkProgress(null);

    try {
      // Sử dụng uploadFile từ useUpload hook
      await uploadFile(values.file);

      resetForm();
      setPreviewUrl(null);
      setVideoInfo(null);
      setChunkProgress(null);
    } catch (error) {
      // Error đã được xử lý trong useUpload hook
      console.error('Upload error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Reset toàn bộ
  const handleUploadModeChange = useCallback(() => {
    const newMode = uploadMode === 'normal' ? 'chunked' : 'normal';
    setUploadMode(newMode);
    
    normalUpload.resetUpload();
    chunkedUpload.resetUpload();
    
    setPreviewUrl(null);
    setVideoInfo(null);
    setChunkProgress(null);
    setBanner(null);
  }, [uploadMode, normalUpload, chunkedUpload, setBanner]);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Video Upload Demo</h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleUploadModeChange}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {uploadMode === 'normal'
                ? 'Switch to Chunked'
                : 'Switch to Normal'}
            </button>
          </div>
        </div>

        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Upload Mode:{' '}
            {uploadMode === 'normal' ? 'Normal Upload' : 'Chunked Upload'}
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {uploadMode === 'normal'
              ? 'Upload video file directly to server'
              : 'Upload video in chunks for better handling of large files'}
          </p>
        </div>

        <Banner />

        <Formik
          initialValues={initialValues}
          validateOnBlur
          validateOnChange
          validateOnMount
          enableReinitialize={false}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Video Preview */}
              {previewUrl && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Video Preview:</h3>
                  <div className="relative inline-block">
                    <video
                      src={previewUrl}
                      controls
                      className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        setFieldValue('file', null);
                        setVideoInfo(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                  {videoInfo && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Duration: {Math.round(videoInfo.duration)}s | Resolution:{' '}
                      {videoInfo.width}×{videoInfo.height} | Size:{' '}
                      {values.file?.size
                        ? (values.file.size / (1024 * 1024)).toFixed(2) // convert to MB
                        : '0.00'}
                      MB
                    </div>
                  )}
                </div>
              )}

              <label
                htmlFor="video-input"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700"
                onDrop={e => handleDrop(e, setFieldValue)}
                {...dropHandlers}
              >
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <p className="mb-1 text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Click to select</span> or drag
                    & drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {values.file
                      ? `Selected: ${values.file.name}`
                      : `Video files (${SUPPORTED_VIDEO_TYPES.map(t => t.split('/')[1]).join(', ')})`}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Max size: {uploadMode === 'normal' ? '10MB' : '5GB'}
                  </p>
                </div>
                <input
                  id="video-input"
                  name="file"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={e => handleFileChange(e, setFieldValue)}
                />
              </label>

              {touched.file && errors.file && (
                <div className="text-xs text-red-600" role="alert">
                  {errors.file as string}
                </div>
              )}

              {/* Progress Bars */}
              {isUploading && (
                <div className="space-y-3">
                  <ProgressBar
                    progress={uploadProgress}
                    stopUpload={stopUpload}
                  />
                  {chunkProgress && uploadMode === 'chunked' && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Chunk: {chunkProgress.current}/{chunkProgress.total}
                    </div>
                  )}
                </div>
              )}

              <label className="inline-flex items-center gap-2 text-sm">
                <Field type="checkbox" name="acceptTerms" /> I accept the terms
                *
              </label>
              {touched.acceptTerms && (errors.acceptTerms as string) && (
                <div className="-mt-1 text-xs text-red-600" role="alert">
                  {errors.acceptTerms as string}
                </div>
              )}

              <div className="flex items-center gap-3">
                <SubmitButton
                  isUpLoading={isUploading}
                  uploadMode={uploadMode}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
