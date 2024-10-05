import { Component, For, createSignal, createEffect } from "solid-js";

interface UploadRecord {
  id: number;
  name: string;
  uploadTime: string;
  status: string;
}

export const UploadHistory: Component = () => {
  const [uploadRecords, setUploadRecords] = createSignal<UploadRecord[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  const fetchUploadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/api/upload-history");
      if (!response.ok) {
        throw new Error("Failed to fetch upload history");
      }
      const data = await response.json();
      if (data.code === 200 && Array.isArray(data.files)) {
        setUploadRecords(
          data.files.map((record: UploadRecord) => ({
            ...record,
            uploadTime: new Date(record.uploadTime).toLocaleString(),
          }))
        );
      } else {
        throw new Error(data.message || "Unknown error occurred");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  createEffect(() => {
    fetchUploadHistory();
  });

  return (
    <div class="bg-white rounded-lg shadow p-4 mt-4">
      <h2 class="text-lg font-semibold mb-4">上传记录</h2>
      {loading() ? (
        <div class="text-center py-4">加载中...</div>
      ) : error() ? (
        <div class="text-red-500 text-center py-4">{error()}</div>
      ) : (
        <div class="space-y-2">
          <For each={uploadRecords()}>
            {(record) => (
              <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <div class="font-medium">{record.name}</div>
                  <div class="text-sm text-gray-500">{record.uploadTime}</div>
                </div>
                <div>
                  <span
                    class={
                      record.status === "ok" ? "text-green-500" : "text-red-500"
                    }
                  >
                    <i
                      class={`bi ${
                        record.status === "ok"
                          ? "bi-check-circle"
                          : "bi-x-circle"
                      }`}
                    ></i>
                    {record.status === "ok" ? "成功" : "失败"}
                  </span>
                </div>
              </div>
            )}
          </For>
          {uploadRecords().length === 0 && (
            <div class="text-center py-4 text-gray-500">暂无上传记录</div>
          )}
        </div>
      )}
    </div>
  );
};
