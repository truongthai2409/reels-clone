// GraphQL mutation for uploading files
// chỉ cần query string, không có "variables" ở đây
export const UPLOAD_FILE_MUTATION = `
  mutation UploadFile($file: Upload!) {
    uploadImage(input: { file: $file }) {
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

export interface UploadResult {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl: string;
  size: number;
  mimetype: string;
  createdAt: string;
}

export const uploadFileToGraphQL = async (
  file: File
): Promise<UploadResult> => {
  const formData = new FormData();
  
  // GraphQL multipart specification format
  formData.append(
    "operations",
    JSON.stringify({
      query: UPLOAD_FILE_MUTATION,
      variables: { file: null }
    })
  );
  
  // Map the file to the variables.file field
  formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
  
  // Append the actual file with key "0"
  formData.append("0", file);

  try {
    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: formData,
      // Don't set Content-Type header - let the browser set it with boundary
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error(result.errors[0]?.message || "GraphQL error occurred");
    }

    return result.data.uploadImage;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

// Alternative upload method for servers that might expect different format
export const uploadFileToGraphQLAlternative = async (
  file: File
): Promise<UploadResult> => {
  const formData = new FormData();
  
  // Alternative format - some servers expect this
  formData.append("query", UPLOAD_FILE_MUTATION);
  formData.append("variables", JSON.stringify({ file: null }));
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error(result.errors[0]?.message || "GraphQL error occurred");
    }

    return result.data.uploadImage;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

// Test function to check what the server expects
export const testGraphQLServer = async (): Promise<void> => {
  try {
    // Test 1: Simple introspection query
    const response1 = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query {
            __schema {
              types {
                name
              }
            }
          }
        `,
      }),
    });

    console.log("Test 1 - Introspection:", response1.status);
    if (response1.ok) {
      const result1 = await response1.json();
      console.log("Schema types:", result1.data?.__schema?.types?.map((t: any) => t.name));
    }

    // Test 2: Check if server supports file uploads
    const response2 = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query {
            __type(name: "Upload") {
              name
              kind
            }
          }
        `,
      }),
    });

    console.log("Test 2 - Upload type check:", response2.status);
    if (response2.ok) {
      const result2 = await response2.json();
      console.log("Upload type:", result2.data?.__type);
    }

  } catch (error) {
    console.error("Test failed:", error);
  }
};
