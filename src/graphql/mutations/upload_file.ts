export const UPLOAD_MEDIA_MUTATION = `
  mutation UploadMedia($file: Upload!, $folder: String) {
    uploadMedia(input: { file: $file, folder: $folder }) {
      id
      filename
      url
      mimetype
      size
      createdAt
    }
  }
`;

export const UPLOAD_IMAGE_MUTATION = `
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