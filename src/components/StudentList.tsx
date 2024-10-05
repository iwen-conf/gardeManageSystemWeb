// src/components/StudentList -- 学生列表组件
import { Component, createSignal, createEffect, Show, For } from "solid-js";
import { Student } from "../types/grade";

export const StudentList: Component<{
  onSelectStudent: (student: Student) => void;
}> = (props) => {
  const [students, setStudents] = createSignal<Student[]>([]);
  const [selectedId, setSelectedId] = createSignal<string | null>(null);
  const [searchTerm, setSearchTerm] = createSignal("");
  const [loading, setLoading] = createSignal(true);

  createEffect(() => {
    fetchStudents();
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/students");
      const data = await response.json();
      if (data.code === 200) {
        setStudents(Object.values(data.data) as Student[]);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = () => {
    return students().filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm().toLowerCase()) ||
        student.id.toString().includes(searchTerm())
    );
  };

  return (
    <div class="bg-white rounded-lg shadow-sm overflow-hidden h-[calc(100vh-12rem)]">
      <div class="p-4 border-b sticky top-0 bg-white z-10">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">学生列表</h2>
        <div class="relative">
          <input
            type="text"
            placeholder="搜索学生姓名或学号..."
            class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            onInput={(e) => setSearchTerm(e.currentTarget.value)}
          />
          <i class="bi bi-search text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
        </div>
      </div>

      <Show
        when={!loading()}
        fallback={
          <div class="flex items-center justify-center h-40">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        }
      >
        <div class="overflow-y-auto h-[calc(100%-7rem)]">
          <For each={filteredStudents()}>
            {(student) => (
              <div
                class={`group p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-all ${
                  selectedId() === student.id ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  setSelectedId(student.id);
                  props.onSelectStudent(student);
                }}
              >
                <div class="flex items-center gap-3">
                  <div
                    class={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedId() === student.id
                        ? "bg-blue-100 text-blue-500"
                        : "bg-gray-100 text-gray-400"
                    } group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors`}
                  >
                    <i class="bi bi-person-circle text-xl"></i>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">{student.name}</div>
                    <div class="text-sm text-gray-500">学号: {student.id}</div>
                  </div>
                </div>
              </div>
            )}
          </For>
          <Show when={filteredStudents().length === 0}>
            <div class="text-center py-8 text-gray-500">
              <i class="bi bi-emoji-frown text-2xl mb-2"></i>
              <p>未找到匹配的学生</p>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
};