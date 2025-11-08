export enum Screen {
  Login = 'LOGIN',
  Profile = 'PROFILE',
  Achievements = 'ACHIEVEMENTS',
  Questions = 'QUESTIONS',
  Battle = 'BATTLE',
  JoinBattle = 'JOIN_BATTLE',
  BattleLobby = 'BATTLE_LOBBY',
  Trivia = 'TRIVIA',
  Winner = 'WINNER',
  Loser = 'LOSER',
}

export enum TeacherScreen {
  Dashboard = 'DASHBOARD',
  BattleManager = 'BATTLE_MANAGER',
  QuestionBank = 'QUESTION_BANK',
  StudentList = 'STUDENT_LIST',
  Profile = 'PROFILE',
}

export enum AdminScreen {
    Dashboard = 'DASHBOARD',
    Users = 'USERS',
    Cards = 'CARDS',
    Questions = 'QUESTIONS',
    Documentation = 'DOCUMENTATION',
    Modules = 'MODULES',
    ModuleCreator = 'MODULE_CREATOR',
}

export enum UserRole {
    Student = 'STUDENT',
    Teacher = 'TEACHER',
    Admin = 'ADMIN',
}

export interface Skill {
  name: string;
  score: number;
}

export interface Professor {
  id: number;
  name: string;
  title: string;
  imageUrl: string;
  skills: Skill[];
  locked: boolean;
}

export interface Achievement {
  id: number;
  name: string;
  icon: string; // ionicon name
  description: string;
}

export interface User {
  name: string;
  level: number;
  imageUrl: string;
  achievements: Achievement[];
  role: UserRole;
  // Teacher-specific fields
  subjects?: string[];
  skills?: string[];
  cycles?: string[];
}

export interface Question {
    id: string;
    text: string;
    answers: string[];
    correctAnswerIndex: number;
}

export interface Student {
    id: string;
    name: string;
    level: number;
    imageUrl: string;
}

// Added for the new module management feature
export interface AppModule {
    id: Screen | TeacherScreen;
    name: string;
    description: string;
    role: UserRole.Student | UserRole.Teacher;
}

// Added for the new dynamic module creator feature
export interface CustomModule {
    id: string;
    name: string;
    icon: string;
    role: UserRole.Student | UserRole.Teacher;
    gameMode: 'individual' | 'group';
    accessMethod: 'code' | 'qr' | 'both';
}