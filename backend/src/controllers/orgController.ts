import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";
import { sendError, sendSuccess } from "../utils/responses";

export const getProjects = async (req: AuthRequest, res: Response) => {
  const projects = await prisma.project.findMany({ include: { owner: { select: { name: true } } } });
  sendSuccess(res, projects);
};

export const createProject = async (req: AuthRequest, res: Response) => {
  const { name, description } = req.body;
  try {
    const project = await prisma.project.create({
      data: { name, description, ownerId: req.user!.id }
    });
    sendSuccess(res, project, 201);
  } catch (err) {
    sendError(res, 400, "Failed to create project");
  }
};

export const getTeams = async (req: AuthRequest, res: Response) => {
  const teams = await prisma.team.findMany({ include: { members: { select: { id: true, name: true } } } });
  sendSuccess(res, teams);
};

export const createTeam = async (req: AuthRequest, res: Response) => {
  const { name, memberIds } = req.body;
  try {
    const team = await prisma.team.create({
      data: { name, members: { connect: memberIds.map((id: string) => ({ id })) } }
    });
    sendSuccess(res, team, 201);
  } catch (err) {
    sendError(res, 400, "Failed to create team");
  }
};
