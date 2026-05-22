import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { AuthRequest } from "../middleware/auth";
import { db } from "../lib/dynamodb";
import { sendError, sendSuccess } from "../utils/responses";
import { requireManager } from "../middleware/roleGuard";

const TABLE_PROJECTS = process.env.TABLE_PROJECTS || "Projects";
const TABLE_TEAMS = process.env.TABLE_TEAMS || "Teams";
const TABLE_USERS = process.env.TABLE_USERS || "Users";

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await db.scan(TABLE_PROJECTS, 100);
    sendSuccess(res, projects);
  } catch {
    sendError(res, 500, "Failed to fetch projects");
  }
};

export const getProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await db.get(TABLE_PROJECTS, { projectId: req.params.id });
    if (!project) return sendError(res, 404, "Project not found");
    sendSuccess(res, project);
  } catch {
    sendError(res, 500, "Failed to fetch project");
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  const { name, description } = req.body;
  try {
    const projectId = uuidv4();
    const project = {
      projectId,
      name,
      description,
      ownerId: req.user!.id,
      createdAt: new Date().toISOString(),
    };
    await db.put(TABLE_PROJECTS, project);
    sendSuccess(res, project, 201);
  } catch {
    sendError(res, 400, "Failed to create project");
  }
};

export const getTeams = async (req: AuthRequest, res: Response) => {
  try {
    const teams = await db.scan(TABLE_TEAMS, 100);
    const teamsWithMembers = await Promise.all(teams.map(async (team: any) => {
      const members = await db.query(TABLE_USERS, "TeamIndex", "teamId = :teamId", { ":teamId": team.teamId });
      return { ...team, members: members.map((m: any) => ({ userId: m.userId, name: m.name })) };
    }));
    sendSuccess(res, teamsWithMembers);
  } catch {
    sendError(res, 500, "Failed to fetch teams");
  }
};

export const getTeam = async (req: AuthRequest, res: Response) => {
  try {
    const team = await db.get(TABLE_TEAMS, { teamId: req.params.id });
    if (!team) return sendError(res, 404, "Team not found");
    const members = await db.query(TABLE_USERS, "TeamIndex", "teamId = :teamId", { ":teamId": team.teamId });
    sendSuccess(res, { ...team, members: members.map((m: any) => ({ userId: m.userId, name: m.name })) });
  } catch {
    sendError(res, 500, "Failed to fetch team");
  }
};

export const createTeam = async (req: AuthRequest, res: Response) => {
  const { name, memberIds } = req.body;
  try {
    const teamId = uuidv4();
    const team = {
      teamId,
      name,
      createdAt: new Date().toISOString(),
    };
    await db.put(TABLE_TEAMS, team);

    if (memberIds && memberIds.length > 0) {
      for (const userId of memberIds) {
        const user = await db.get(TABLE_USERS, { userId });
        if (user) {
          await db.update(TABLE_USERS, { userId }, "set #teamId = :teamId", { ":teamId": teamId }, { "#teamId": "teamId" });
        }
      }
    }

    sendSuccess(res, team, 201);
  } catch {
    sendError(res, 400, "Failed to create team");
  }
};
