import { promises as fs } from "node:fs";
import path from "node:path";

const storageDir = path.join(process.cwd(), "src", "data", "storage");
const userStatePath = path.join(storageDir, "user-states.json");
const communityLinksPath = path.join(storageDir, "community-links.json");

export interface StoredUserState {
  activeSubjects: string[];
  updatedAt: string;
}

export interface StoredCommunityLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  moderationStatus?: "pending" | "approved";
  moderatedBy?: string;
  moderatedAt?: string;
}

type UserStateStore = Record<string, StoredUserState>;
type CommunityLinksStore = Record<string, StoredCommunityLink[]>;

const MODERATOR_USERS = (process.env.MODERATOR_USERS ?? process.env.NEXT_PUBLIC_MODERATOR_USERS ?? "admin")
  .split(",")
  .map((value) => normalizeUserId(value))
  .filter(Boolean);

async function ensureFile(filePath: string, fallback: unknown) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), "utf-8");
  }
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  await ensureFile(filePath, fallback);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, data: T) {
  await ensureFile(filePath, data);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function normalizeUserId(value: string) {
  return value.trim().toLowerCase();
}

export function isModeratorUser(userId: string) {
  const normalized = normalizeUserId(userId);
  return MODERATOR_USERS.includes(normalized);
}

function getModerationStatus(link: StoredCommunityLink) {
  return link.moderationStatus ?? "approved";
}

export async function getUserState(userId: string): Promise<StoredUserState> {
  const normalized = normalizeUserId(userId);
  const store = await readJsonFile<UserStateStore>(userStatePath, {});
  return store[normalized] ?? { activeSubjects: [], updatedAt: new Date().toISOString() };
}

export async function saveUserState(userId: string, activeSubjects: string[]) {
  const normalized = normalizeUserId(userId);
  const store = await readJsonFile<UserStateStore>(userStatePath, {});
  store[normalized] = {
    activeSubjects: Array.from(new Set(activeSubjects)),
    updatedAt: new Date().toISOString(),
  };
  await writeJsonFile(userStatePath, store);
}

export async function getCommunityLinksBySubjects(subjectIds: string[], userId: string) {
  const store = await readJsonFile<CommunityLinksStore>(communityLinksPath, {});
  const result: CommunityLinksStore = {};
  const normalizedUser = normalizeUserId(userId);

  for (const subjectId of subjectIds) {
    const links = store[subjectId] ?? [];
    result[subjectId] = links.filter(
      (link) =>
        getModerationStatus(link) === "approved" ||
        (getModerationStatus(link) === "pending" &&
          normalizeUserId(link.createdBy) === normalizedUser)
    );
  }

  return result;
}

export async function getPendingCommunityLinks() {
  const store = await readJsonFile<CommunityLinksStore>(communityLinksPath, {});
  const result: Array<{ subjectId: string; link: StoredCommunityLink }> = [];

  for (const [subjectId, links] of Object.entries(store)) {
    for (const link of links) {
      if (getModerationStatus(link) === "pending") {
        result.push({ subjectId, link });
      }
    }
  }

  return result;
}

export async function addCommunityLink(input: {
  subjectId: string;
  title: string;
  url: string;
  description?: string;
  userId: string;
}) {
  const store = await readJsonFile<CommunityLinksStore>(communityLinksPath, {});
  const subjectLinks = store[input.subjectId] ?? [];

  const newLink: StoredCommunityLink = {
    id: crypto.randomUUID(),
    title: input.title,
    url: input.url,
    description: input.description,
    createdBy: normalizeUserId(input.userId),
    createdAt: new Date().toISOString(),
    moderationStatus: "pending",
  };

  store[input.subjectId] = [...subjectLinks, newLink];
  await writeJsonFile(communityLinksPath, store);

  return newLink;
}

export async function deleteCommunityLink(input: {
  subjectId: string;
  linkId: string;
  userId: string;
}) {
  const store = await readJsonFile<CommunityLinksStore>(communityLinksPath, {});
  const subjectLinks = store[input.subjectId] ?? [];
  const normalizedUser = normalizeUserId(input.userId);

  const target = subjectLinks.find((link) => link.id === input.linkId);
  if (!target) return { deleted: false, reason: "not_found" as const };

  if (isModeratorUser(normalizedUser)) {
    store[input.subjectId] = subjectLinks.filter((link) => link.id !== input.linkId);
    await writeJsonFile(communityLinksPath, store);
    return { deleted: true as const };
  }

  const normalizedOwner = normalizeUserId(target.createdBy);
  if (normalizedOwner && normalizedOwner !== normalizedUser) {
    return { deleted: false, reason: "forbidden" as const };
  }

  if (getModerationStatus(target) !== "pending") {
    return { deleted: false, reason: "forbidden" as const };
  }

  store[input.subjectId] = subjectLinks.filter((link) => link.id !== input.linkId);
  await writeJsonFile(communityLinksPath, store);

  return { deleted: true as const };
}

export async function moderateCommunityLink(input: {
  subjectId: string;
  linkId: string;
  moderatorUserId: string;
  action: "approve" | "reject";
}) {
  const store = await readJsonFile<CommunityLinksStore>(communityLinksPath, {});
  const subjectLinks = store[input.subjectId] ?? [];

  const targetIndex = subjectLinks.findIndex((link) => link.id === input.linkId);
  if (targetIndex === -1) return { updated: false as const, reason: "not_found" as const };

  if (input.action === "reject") {
    store[input.subjectId] = subjectLinks.filter((link) => link.id !== input.linkId);
    await writeJsonFile(communityLinksPath, store);
    return { updated: true as const };
  }

  const target = subjectLinks[targetIndex];
  store[input.subjectId] = subjectLinks.map((link, index) => {
    if (index !== targetIndex) return link;
    return {
      ...link,
      moderationStatus: "approved",
      moderatedBy: normalizeUserId(input.moderatorUserId),
      moderatedAt: new Date().toISOString(),
    };
  });

  await writeJsonFile(communityLinksPath, store);
  return { updated: true as const };
}
