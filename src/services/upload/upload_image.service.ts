import { type AxiosProgressEvent } from "axios";
import type { UploadResult } from "@/types/upload.types";
import { GRAPHQL_ENDPOINT } from "@/configs";
import { uploadInstance } from "@/configs";
import { UPLOAD_IMAGE_MUTATION } from "@/graphql/mutations/upload_file";
import { buildFormData } from "./upload.service";

// function parseGraphQLResponse(response: any): UploadResult {
//   if (response.data.errors) {
//     throw new Error(
//       response.data.errors[0]?.message || "GraphQL error occurred"
//     );
//   }
//   return response.data.data.uploadImage;
// }

export async function uploadImageWithProgress(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  try {
    // console.log("file.value", file)
    const formData = buildFormData(file, UPLOAD_IMAGE_MUTATION);
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

    return response.data;
  } catch (error) {
    throw error;
  }
}
