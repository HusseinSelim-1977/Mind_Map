import { http, HttpResponse, delay } from "msw";
import { tasks, projects, teams, notifications, users } from "./data";

const withDelay = async (resolver: () => any) => {
  await delay(Math.random() * 600 + 200);
  if (Math.random() < 0.05) {
    return new HttpResponse(null, { status: 500 });
  }
  return resolver();
};

export const handlers = [
  // Auth
  http.post("/api/auth/login", async () => {
    return withDelay(() => HttpResponse.json({ user: users[0], token: "mock-jwt" }));
  }),

  http.post("/api/auth/logout", async () => {
    return withDelay(() => new HttpResponse(null, { status: 200 }));
  }),

  // Tasks
  http.get("/api/tasks", async () => {
    return withDelay(() => HttpResponse.json(tasks));
  }),

  http.post("/api/tasks", async ({ request }) => {
    const newTask = (await request.json()) as any;
    return withDelay(() => HttpResponse.json({ ...newTask, id: `task-${Date.now()}` }, { status: 201 }));
  }),

  http.patch("/api/tasks/:id", async ({ params, request }) => {
    const updates = (await request.json()) as any;
    return withDelay(() => HttpResponse.json({ id: params.id, ...updates }));
  }),

  http.delete("/api/tasks/:id", async () => {
    return withDelay(() => new HttpResponse(null, { status: 204 }));
  }),

  // Projects
  http.get("/api/projects", async () => {
    return withDelay(() => HttpResponse.json(projects));
  }),

  http.get("/api/projects/:id", async ({ params }) => {
    const project = projects.find((p) => p.id === params.id);
    return withDelay(() => 
      project ? HttpResponse.json(project) : new HttpResponse(null, { status: 404 })
    );
  }),

  // Teams
  http.get("/api/teams", async () => {
    return withDelay(() => HttpResponse.json(teams));
  }),

  // Notifications
  http.get("/api/notifications", async () => {
    return withDelay(() => HttpResponse.json(notifications));
  }),

  http.patch("/api/notifications/:id/read", async ({ params }) => {
    return withDelay(() => HttpResponse.json({ id: params.id, read: true }));
  }),
];
