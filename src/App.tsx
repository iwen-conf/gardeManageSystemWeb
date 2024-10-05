// src/components/App.tsx -- 主界面
import { Component, createSignal } from "solid-js";
import { FileUpload } from "./components/FileUpload";
import { StudentList } from "./components/StudentList";
import { StudentAnalysis } from "./components/StudentAnalysis";
import { UploadHistory } from "./components/UploadHistory";

const App: Component = () => {
  const [selectedStudentId, setSelectedStudentId] = createSignal<string | null>(
    null
  );
    const [activeTab, setActiveTab] = createSignal('students'); // 新增：用于控制主要内容区域的标签


  return (
    <>
      <div class="min-h-screen bg-gray-50">
        {/* 顶部导航栏 */}
        <nav class="bg-white shadow-sm border-b">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
              <div class="flex items-center">
                <h1 class="text-xl font-bold text-gray-900">成绩管理系统</h1>
              </div>
              <div class="flex items-center space-x-4">
                <button
                  onClick={() => setActiveTab("students")}
                  class={`px-4 py-2 rounded-md transition-all ${
                    activeTab() === "students"
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  学生管理
                </button>
                <button
                  onClick={() => setActiveTab("upload")}
                  class={`px-4 py-2 rounded-md transition-all ${
                    activeTab() === "upload"
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  成绩上传
                </button>
              </div>
            </div>
          </div>
        </nav>
        {/* 主要内容区域 */}
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex gap-8">
            {/* 左侧边栏 */}
            <div class="w-1/4">
              <StudentList
                onSelectStudent={(student) => {
                  setSelectedStudentId(student.id);
                  setActiveTab("students");
                }}
              />
            </div>

            {/* 右侧主要内容 */}
            <div class="w-3/4">
              {activeTab() === "students" ? (
                selectedStudentId() ? (
                  <StudentAnalysis studentId={selectedStudentId()!} />
                ) : (
                  <div class="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div class="text-gray-400 mb-4">
                      <i class="bi bi-person-badge text-6xl"></i>
                    </div>
                    <p class="text-gray-600">
                      请从左侧选择一个学生查看详细分析
                    </p>
                  </div>
                )
              ) : (
                <div class="space-y-6">
                  <FileUpload />
                  <UploadHistory />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
