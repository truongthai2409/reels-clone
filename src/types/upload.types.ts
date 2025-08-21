export interface UploadResult {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  thumbnailUrl?: string;
  size: number;
  mimetype: string;
  createdAt: string;
}
