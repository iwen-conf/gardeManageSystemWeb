import { createSignal, createEffect, For } from "solid-js";

interface UploadHistoryItem {
  id: number;
  name: string;
  uploadTime: string;
}

export const FileUpload = () => {
  const [files, setFiles] = createSignal<UploadHistoryItem[]>([]);
  const [uploading, setUploading] = createSignal(false);
  const [dragActive, setDragActive] = createSignal(false);

  createEffect(() => {
    fetchUploadHistory();
  });

  const fetchUploadHistory = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/upload-history");
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);
      }
    } catch (error) {
      console.error("Failed to fetch upload history:", error);
    }
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("examName", file.name.split(".")[0]);

    setUploading(true);
    try {
      const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        await fetchUploadHistory();
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
    setUploading(false);
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      handleFileUpload(target.files[0]);
    }
  };

  return (
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">文件上传</h2>
      <div
        class={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive() ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleChange}
          class="hidden"
          id="file-upload"
          disabled={uploading()}
        />
        <label
          for="file-upload"
          class="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <i class="bi bi-cloud-upload mr-2"></i>
          选择文件
        </label>
        <p class="mt-2 text-sm text-gray-600">或将文件拖放到此处</p>
      </div>
      {uploading() && (
        <div class="mt-4 flex items-center justify-center">
          <i class="bi bi-arrow-repeat animate-spin mr-2"></i>
          <span>正在上传...</span>
        </div>
      )}
    </div>
  );
};
