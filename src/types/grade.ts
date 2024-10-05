// types/grade.ts (完整的类型定义)
export interface Student {
  name: string;
  id: string;
  chinese: number;
  math: number;
  english: number;
  chemistry: number;
  physics: number;
  geography: number;
  biology: number;
  total: number;
  examName: string;
}

// types/grade.ts
export interface GradeAnalysis {
  subjectAverages: Record<string, number>;
  subjectDistribution: Record<string, Record<string, number>>;
  improvement: Record<string, number>;
}
export interface Props {
  student?: Student | null;
  onSelectStudent?: (student: Student) => void;
  data?: any[];
  loading?: boolean;
}
