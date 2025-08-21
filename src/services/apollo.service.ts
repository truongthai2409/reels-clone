import { gql, useMutation } from "@apollo/client";
import { apolloClient } from "@/configs/apollo";
import type { UploadResult } from "@/types/upload.types";

// GraphQL mutation string for file uploads
// Upload file (generic)
export const UPLOAD_FILE_MUTATION_STRING = `
  mutation UploadFile($file: Upload!) {
    uploadFile(input: { file: $file }) {
      id
      filename
      originalName
      url
      thumbnailUrl
      size
      mimetype
      createdAt
    }
  }
`;

// Upload video
export const UPLOAD_VIDEO_MUTATION_STRING = `
  mutation UploadVideo($file: Upload!) {
    uploadVideo(input: { file: $file }) {
      id
      filename
      originalName
      url
      thumbnailUrl
      size
      mimetype
      createdAt
    }
  }
`;

export const UPLOAD_IMAGE_MUTATION_STRING = `
  // mutation UploadImage($file: Upload!) {
  //   uploadImage(input: { file: $file }) {
  //     id
  //     filename
  //     originalName
  //     url
  //     thumbnailUrl
  //     size
  //     mimetype
  //     createdAt
  //   }
  // }
  mutation UploadImage($input: UploadImageInput!) {
    uploadImage(input: $input) {
      id
      filename
      originalName
      url
      thumbnailUrl
      size
      mimetype
      createdAt
    }
}
`;


// GraphQL mutation for uploading files
export const UPLOAD_FILE_MUTATION = gql`
  ${UPLOAD_FILE_MUTATION_STRING}
`;

export interface UploadFileData {
  uploadImage: UploadResult;
}

export interface UploadFileVars {
  file: File;
}

// Hook for using the upload mutation
export const useUploadFile = () => {
  return useMutation<UploadFileData, UploadFileVars>(UPLOAD_FILE_MUTATION);
};

// Direct client mutation for file uploads using FormData
export const uploadFileWithApollo = async (
  file: File
): Promise<UploadResult> => {
  try {
    // Create FormData for multipart upload
    const formData = new FormData();

    // GraphQL multipart specification format
    formData.append(
      "operations",
      JSON.stringify({
        query: UPLOAD_IMAGE_MUTATION_STRING,
        variables: { file: null },
      })
    );

    // Map the file to the variables.file field
    formData.append("map", JSON.stringify({ "0": ["variables.file"] }));

    // Append the actual file with key "0"
    formData.append("0", file);

    // Use fetch directly for file uploads
    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        // Add Apollo-specific headers to prevent CSRF
        "Apollo-Require-Preflight": "true",
        "X-Apollo-Operation-Name": "UploadFile",
        // Don't set Content-Type - let browser set it with boundary for multipart
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Response error:", response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      throw new Error(result.errors[0]?.message || "GraphQL error occurred");
    }

    return result.data.uploadImage;
  } catch (error) {
    console.error("Apollo upload error:", error);
    throw error;
  }
};

// Test function to check server connectivity
export const testApolloServer = async (): Promise<void> => {
  try {
    // Test introspection query
    const result = await apolloClient.query({
      query: gql`
        query {
          __schema {
            types {
              name
            }
          }
        }
      `,
    });

    console.log("Apollo Server Test - Success");
    console.log(
      "Available types:",
      result.data?.__schema?.types?.map((t: any) => t.name)
    );

    // Check if Upload type exists
    const uploadType = result.data?.__schema?.types?.find(
      (t: any) => t.name === "Upload"
    );
    if (uploadType) {
      console.log("✅ Upload type found:", uploadType);
    } else {
      console.log("❌ Upload type not found in schema");
    }
  } catch (error) {
    console.error("Apollo Server Test - Failed:", error);
  }
};

// Test all upload methods with a small file
export const testUploadMethods = async (): Promise<void> => {
  try {
    // Create a small test file
    const testFile = new File(["test content"], "test.txt", {
      type: "text/plain",
    });

    console.log("🧪 Testing Method 1: GraphQL multipart specification...");
    try {
      const result1 = await uploadFileWithApollo(testFile);
      console.log("✅ Method 1 success:", result1);
    } catch (error) {
      console.log("❌ Method 1 failed:", error);
    }
  } catch (error) {
    console.error("Upload test failed:", error);
  }
};

