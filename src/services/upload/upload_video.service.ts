import type { UploadResult } from "@/types/upload.types";
import type { AxiosProgressEvent } from "axios";
import { GRAPHQL_ENDPOINT, uploadInstance } from "@/configs";
import { UPLOAD_MEDIA_MUTATION } from "@/graphql/mutations/upload_file";
import { validateVideoFile } from "@/helpers/validations";
import { buildFormData } from "./upload.service";

interface ChunkInfo {
  status: "uploading" | "completed" | "failed" | "cancelled";
  progress: number;
  uploadedChunks: number;
  totalChunks: number;
}

export function getVideoInfo(
  file: File
): Promise<{ duration: number; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      const info = {
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      };
      URL.revokeObjectURL(url);
      resolve(info);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Không thể đọc thông tin video"));
    };

    video.src = url;
  });
}

export async function uploadVideoWithProgress(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  try {
    const validation = validateVideoFile(file, 10 * 1024 * 1024);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const formData = buildFormData(file, UPLOAD_MEDIA_MUTATION);

    const response = await uploadInstance.post(GRAPHQL_ENDPOINT, formData, {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          onProgress(percent);
        }
      },
    });

    const result = response.data;

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      throw new Error(result.errors[0]?.message || "GraphQL error occurred");
    }

    const uploadResult = result.data.uploadMedia;

    return {
      id: uploadResult.id,
      filename: uploadResult.filename,
      url: uploadResult.url,
      originalName: file.name,
      size: uploadResult.size,
      mimetype: uploadResult.mimetype,
      createdAt: uploadResult.createdAt,
    };
  } catch (error) {
    console.error("Video upload error:", error);
    throw error;
  }
}

export async function uploadVideoInChunks(
  file: File,
  _chunkSize: number = 10 * 1024 * 1024, // 10MB chunks
  onProgress?: (progress: number) => void,
  _onChunkUpload?: (chunkIndex: number, totalChunks: number) => void
): Promise<UploadResult> {
  try {
    const validation = validateVideoFile(file, 5 * 1000 * 1024 * 1024);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    console.warn(
      "Chunked upload not implemented for GraphQL. Using single file upload instead."
    );

    return await uploadVideoWithProgress(file, onProgress);
  } catch (error) {
    console.error("Chunked video upload error:", error);
    throw error;
  }
}

export async function cancelVideoUpload(_uploadId: string): Promise<void> {
  try {
    throw new Error(
      "Cancel upload not implemented for GraphQL. Implement a cancelUploadMedia mutation."
    );
  } catch (error) {
    console.error("Cancel upload error:", error);
    throw error;
  }
}

export async function getVideoUploadStatus(
  _uploadId: string
): Promise<ChunkInfo> {
  try {
    throw new Error(
      "Get upload status not implemented for GraphQL. Implement a getUploadStatus query."
    );
  } catch (error) {
    console.error("Get upload status error:", error);
    throw error;
  }
}
