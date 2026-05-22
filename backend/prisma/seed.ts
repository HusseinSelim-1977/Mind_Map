import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: hashed,
      name: "Admin User",
      role: "admin",
    },
  });

  const project = await prisma.project.create({
    data: {
      name: "Default Project",
      description: "Sample project for seeding",
      ownerId: admin.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Initial Task",
      description: "Created via seed",
      projectId: project.id,
      status: "TODO",
      priority: "high",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
