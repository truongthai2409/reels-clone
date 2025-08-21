import axios, { type AxiosProgressEvent } from "axios";
import type { UploadResult } from "@/types/upload.types";
import { UPLOAD_IMAGE_MUTATION_STRING } from "./apollo.service";

export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = reject;
      img.src = String(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const getFileIcon = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return "📄";
    case "doc":
    case "docx":
      return "📝";
    case "xls":
    case "xlsx":
      return "📊";
    case "ppt":
    case "pptx":
      return "📋";
    case "txt":
      return "📃";
    case "zip":
    case "rar":
      return "📦";
    default:
      return "📎";
  }
};

const GRAPHQL_ENDPOINT = "http://localhost:4000/graphql";

function buildFormData(file: File, query: string): FormData {
  const formData = new FormData();

  formData.append(
    "operations",
    JSON.stringify({
      query,
      variables: { file: null },
    })
  );

  formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
  formData.append("0", file);

  return formData;
}

/** Parse response từ server */
function parseGraphQLResponse(response: any): UploadResult {
  if (response.data.errors) {
    throw new Error(response.data.errors[0]?.message || "GraphQL error occurred");
  }
  return response.data.data.uploadImage;
}

/** Upload file với progress callback sử dụng Axios */
export async function uploadFileWithProgress(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  try {
    const formData = buildFormData(file, UPLOAD_IMAGE_MUTATION_STRING);

    const response = await axios.post(GRAPHQL_ENDPOINT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Apollo-Require-Preflight": "true",
        "X-Apollo-Operation-Name": "UploadFile",
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          onProgress(percent);
        }
      },
    });

    return parseGraphQLResponse(response);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        throw new Error(`HTTP error! status: ${error.response.status}`);
      } else if (error.request) {
        // Network error
        throw new Error("Network error occurred");
      } else {
        // Request setup error
        throw new Error("Request setup error");
      }
    }
    
    // Re-throw other errors
    throw error;
  }
}