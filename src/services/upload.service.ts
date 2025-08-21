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
function parseGraphQLResponse(
  xhr: XMLHttpRequest,
  resolve: Function,
  reject: Function
) {
  try {
    const result = JSON.parse(xhr.responseText);

    if (result.errors) {
      reject(new Error(result.errors[0]?.message || "GraphQL error occurred"));
    } else {
      resolve(result.data.uploadImage);
    }
  } catch {
    reject(new Error("Failed to parse response"));
  }
}

/** Upload file với progress callback */
export function uploadFileWithProgress(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const formData = buildFormData(file, UPLOAD_IMAGE_MUTATION_STRING);
    const xhr = new XMLHttpRequest();

    // Theo dõi progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    // Thành công
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        parseGraphQLResponse(xhr, resolve, reject);
      } else {
        reject(new Error(`HTTP error! status: ${xhr.status}`));
      }
    };

    // Lỗi network / abort
    xhr.onerror = () => reject(new Error("Network error occurred"));
    xhr.onabort = () => reject(new Error("Upload aborted"));

    xhr.open("POST", GRAPHQL_ENDPOINT);

    xhr.setRequestHeader("Apollo-Require-Preflight", "true");
    xhr.setRequestHeader("X-Apollo-Operation-Name", "UploadFile");

    xhr.send(formData);
  });
}
