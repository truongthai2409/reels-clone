export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();  // lấy kích thước ảnh
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

export const buildFormData = (file: File, query: any): FormData  => {
  const formData = new FormData(); // viết cái này chung để xài lại

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