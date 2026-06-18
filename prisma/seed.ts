import { readFileSync } from "node:fs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not defined");
}

const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL) });

const ORG_NAME = "Demo Construction Company";
const ORG_SLUG = "demo-construction-company";

const MOCK_PATH = "prisma/incidents.mock.json"

const priorityMap = {
  low: "LOW",
  medium: "MEDIUM",
  high: "HIGH",
} as const;

const statusMap = {
  open: "OPEN",
  on_pause: "ON_PAUSE",
  closed: "CLOSED",
} as const;

const mediaTypeMap = {
  image: "IMAGE",
  video: "VIDEO",
  document: "DOCUMENT",
} as const;

const uploadStatusMap = {
  pending: "PENDING",
  uploaded: "UPLOADED",
  failed: "FAILED",
} as const;

type MockUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
};

type MockIncident = {
  id: string;
  sequenceId: string;
  order: number;
  title: string;
  description: string;
  type: { id: string; key: string; name: string; name_en: string };
  priority: keyof typeof priorityMap;
  status: keyof typeof statusMap;
  approval: boolean;
  project: { id: string; name: string };
  owner?: MockUser | null;
  assignees: MockUser[];
  observers: MockUser[];
  coordinates: { lat: number; lng: number };
  locationDescription?: string | null;
  dueDate?: string | null;
  closingDate?: string | null;
  media: Array<{
    id: string;
    name: string;
    type: keyof typeof mediaTypeMap;
    format: string;
    size?: number | null;
    status: keyof typeof uploadStatusMap;
    url?: string | null;
  }>;
  tags: Array<{ id: string; name: string; color?: string | null }>;
  deleted?: boolean | null;
  createdAt: string;
  updatedAt: string;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function mimeType(media: MockIncident["media"][number]) {
  if (media.type === "video") return media.format === "mp4" ? "video/mp4" : `video/${media.format}`;
  if (media.type === "image") return media.format === "jpg" ? "image/jpeg" : `image/${media.format}`;
  return "application/octet-stream";
}

function uniqueById<T extends { id: string }>(items: T[]) {
  return [...new Map(items.map((item) => [item.id, item])).values()];
}

function uniqueUsersByEmail(users: MockUser[]) {
  return [...new Map(users.map((user) => [normalizeEmail(user.email), user])).values()];
}

async function main() {
  const incidents = JSON.parse(readFileSync(MOCK_PATH, "utf8")) as MockIncident[];

  const categories = uniqueById(incidents.map((incident) => incident.type));
  const projects = uniqueById(incidents.map((incident) => incident.project));
  const tags = uniqueById(incidents.flatMap((incident) => incident.tags));
  const mockUsers = uniqueUsersByEmail(
    incidents.flatMap((incident) => [
      ...(incident.owner ? [incident.owner] : []),
      ...incident.assignees,
      ...incident.observers,
    ]),
  );

  // IMPORTANT: Users are NOT created here.
  // They must already exist in your app. We only resolve the real DB id by email.
  const dbUsers = await prisma.user.findMany({
    where: {
      email: {
        in: mockUsers.map((user) => normalizeEmail(user.email)),
      },
    },
    select: { id: true, email: true },
  });

  const userIdByEmail = new Map(dbUsers.map((user) => [normalizeEmail(user.email), user.id]));
  const missingUsers = mockUsers.filter((user) => !userIdByEmail.has(normalizeEmail(user.email)));

  if (missingUsers.length) {
    throw new Error(
      `Missing users in the users table. Create them before running the seed:\n${missingUsers
        .map((user) => `- ${user.name} <${user.email}>`)
        .join("\n")}`,
    );
  }

  const getUserId = (user: MockUser) => {
    const id = userIdByEmail.get(normalizeEmail(user.email));
    if (!id) throw new Error(`User not found: ${user.email}`);
    return id;
  };

  await prisma.organization.upsert({
    where: {
      slug: ORG_SLUG,
    },
    update: {
      name: ORG_NAME,
    },
    create: {
      name: ORG_NAME,
      slug: ORG_SLUG,
    },
  });

  const organization = await prisma.organization.upsert({
    where: {
      slug: ORG_SLUG,
    },
    update: {
      name: ORG_NAME,
    },
    create: {
      name: ORG_NAME,
      slug: ORG_SLUG,
    },
  });

  for (const user of mockUsers) {
    const userId = getUserId(user);

    await prisma.member.upsert({
      where: { organizationId_userId: { organizationId: organization.id, userId } },
      update: { role: "member" },
      create: { organizationId: organization.id, userId, role: "member" },
    });
  }

  for (const category of categories) {
    await prisma.incidentCategory.upsert({
      where: { id: category.id },
      update: { key: category.key, nameEs: category.name, nameEn: category.name_en },
      create: { id: category.id, key: category.key, nameEs: category.name, nameEn: category.name_en },
    });
  }

  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: { name: project.name, slug: slugify(project.name) },
      create: { id: project.id, organizationId: organization.id, name: project.name, slug: slugify(project.name) },
    });
  }

  const projectUserPairs = new Set<string>();
  for (const incident of incidents) {
    const projectUsers = uniqueUsersByEmail([
      ...(incident.owner ? [incident.owner] : []),
      ...incident.assignees,
      ...incident.observers,
    ]);

    for (const user of projectUsers) {
      projectUserPairs.add(`${incident.project.id}:${getUserId(user)}`);
    }
  }

  for (const pair of projectUserPairs) {
    const [projectId, userId] = pair.split(":");
    await prisma.projectMember.upsert({
      where: { projectId_userId: { projectId, userId } },
      update: { role: "VIEWER" },
      create: { projectId, userId, role: "VIEWER" },
    });
  }

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { id: tag.id },
      update: { name: tag.name, slug: slugify(tag.name), color: tag.color ?? null },
      create: { id: tag.id, organizationId: organization.id, name: tag.name, slug: slugify(tag.name), color: tag.color ?? null },
    });
  }

  for (const incident of incidents) {
    await prisma.incident.upsert({
      where: { id: incident.id },
      update: {
        projectId: incident.project.id,
        sequenceNo: Number(incident.sequenceId ?? incident.order),
        categoryId: incident.type.id,
        createdById: incident.owner ? getUserId(incident.owner) : null,
        title: incident.title,
        description: incident.description,
        priority: priorityMap[incident.priority],
        status: statusMap[incident.status],
        isApproved: incident.approval,
        latitude: incident.coordinates.lat,
        longitude: incident.coordinates.lng,
        locationDescription: incident.locationDescription ?? null,
        dueDate: incident.dueDate ? new Date(incident.dueDate) : null,
        closedAt: incident.closingDate ? new Date(incident.closingDate) : null,
        deletedAt: incident.deleted ? new Date(incident.updatedAt) : null,
      },
      create: {
        id: incident.id,
        projectId: incident.project.id,
        sequenceNo: Number(incident.sequenceId ?? incident.order),
        categoryId: incident.type.id,
        createdById: incident.owner ? getUserId(incident.owner) : null,
        title: incident.title,
        description: incident.description,
        priority: priorityMap[incident.priority],
        status: statusMap[incident.status],
        isApproved: incident.approval,
        latitude: incident.coordinates.lat,
        longitude: incident.coordinates.lng,
        locationDescription: incident.locationDescription ?? null,
        dueDate: incident.dueDate ? new Date(incident.dueDate) : null,
        closedAt: incident.closingDate ? new Date(incident.closingDate) : null,
        deletedAt: incident.deleted ? new Date(incident.updatedAt) : null,
        createdAt: new Date(incident.createdAt),
        updatedAt: new Date(incident.updatedAt),
      },
    });

    await prisma.incidentParticipant.deleteMany({ where: { incidentId: incident.id } });
    await prisma.incidentTag.deleteMany({ where: { incidentId: incident.id } });
    await prisma.incidentMedia.deleteMany({ where: { incidentId: incident.id } });

    const participants = [
      ...incident.assignees.map((user) => ({ incidentId: incident.id, userId: getUserId(user), role: "ASSIGNEE" as const })),
      ...incident.observers.map((user) => ({ incidentId: incident.id, userId: getUserId(user), role: "OBSERVER" as const })),
    ];

    if (participants.length) {
      await prisma.incidentParticipant.createMany({ data: participants, skipDuplicates: true });
    }

    if (incident.tags.length) {
      await prisma.incidentTag.createMany({
        data: incident.tags.map((tag) => ({ incidentId: incident.id, tagId: tag.id })),
        skipDuplicates: true,
      });
    }

    if (incident.media.length) {
      await prisma.incidentMedia.createMany({
        data: incident.media.map((media) => ({
          id: media.id,
          incidentId: incident.id,
          originalName: media.name,
          mediaType: mediaTypeMap[media.type],
          mimeType: mimeType(media),
          sizeBytes: media.size ? BigInt(media.size) : null,
          uploadStatus: uploadStatusMap[media.status],
          storagePath: null,
          externalUrl: media.url ?? null,
          createdAt: new Date(incident.createdAt),
        })),
        skipDuplicates: true,
      });
    }
  }

  console.log(
    `Seed completed: ${incidents.length} incidents, ${categories.length} categories, ${tags.length} tags, ${projects.length} projects, ${mockUsers.length} existing linked users.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
