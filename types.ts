
export enum CourseLevel {
  BASIC = 'Basic',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export enum CourseStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed'
}

export type UserRole = 'user' | 'admin';

export interface Course {
  id: string;
  title: string;
  source: string; // URL or Platform name
  url?: string;
  level: CourseLevel;
  category: string;
  durationHours: number;
  status: CourseStatus;
  progress: number; 
  description: string;
  deadline?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  background: string; 
  skills: string[];
  availabilityHoursPerWeek: number;
  targetRole: string;
  role: UserRole;
  themeColor?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  courses: Course[];
  overallProgress: number;
  lastUpdated: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  avatar: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
}
