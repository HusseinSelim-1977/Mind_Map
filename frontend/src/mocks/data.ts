import { Task, TaskStatus } from "../components/kanban/types";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "manager" | "employee" | "admin";
}

export interface Project {
  id: string;
  name: string;
  description: string;
}

export interface Team {
  id: string;
  name: string;
  members: string[]; // user ids
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const users: User[] = [
  { id: "u1", name: "John Doe", email: "john@example.com", role: "admin" },
  { id: "u2", name: "Jane Smith", email: "jane@example.com", role: "manager" },
  { id: "u3", name: "Bob Wilson", email: "bob@example.com", role: "employee" },
  ...Array.from({ length: 7 }, (_, i) => ({
    id: `u${i + 4}`,
    name: `User ${i + 4}`,
    email: `user${i + 4}@example.com`,
    role: "employee" as const,
  })),
];

export const projects: Project[] = [
  { id: "p1", name: "Apollo Mission", description: "Frontend redesign" },
  { id: "p2", name: "Cloud Sync", description: "Backend infrastructure" },
  { id: "p3", name: "Mobile App", description: "iOS and Android" },
  { id: "p4", name: "Design System", description: "Consistency is key" },
  { id: "p5", name: "Data Warehouse", description: "Business intelligence" },
];

export const teams: Team[] = [
  { id: "t1", name: "Frontend Core", members: ["u1", "u3", "u4"] },
  { id: "t2", name: "Backend Infrastructure", members: ["u2", "u5", "u6"] },
  { id: "t3", name: "Design & UX", members: ["u1", "u7", "u8"] },
];

const statuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
const priorities: ("low" | "medium" | "high")[] = ["low", "medium", "high"];

export const tasks: Task[] = Array.from({ length: 50 }, (_, i) => ({
  id: `task-${i + 1}`,
  title: `Task ${i + 1}: ${["Fix bug", "Implement feature", "Write docs", "Test component"][i % 4]}`,
  description: `Detailed description for task ${i + 1}. This covers all the requirements and acceptance criteria.`,
  priority: priorities[i % 3],
  status: statuses[i % 4],
  assignee: users[i % users.length],
}));

export const notifications: Notification[] = Array.from({ length: 20 }, (_, i) => ({
  id: `n-${i + 1}`,
  title: `Notification ${i + 1}`,
  message: `Update on task ${Math.floor(Math.random() * 50) + 1}`,
  read: i > 5,
  createdAt: new Date(Date.now() - i * 3600000).toISOString(),
}));
