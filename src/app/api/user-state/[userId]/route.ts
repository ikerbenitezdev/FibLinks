import { NextRequest, NextResponse } from "next/server";
import { getUserState, normalizeUserId, saveUserState } from "@/lib/server/storage";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;
  const normalized = normalizeUserId(userId);

  if (!normalized) {
    return NextResponse.json({ error: "userId obligatorio" }, { status: 400 });
  }

  const state = await getUserState(normalized);
  return NextResponse.json({ userId: normalized, state });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;
  const normalized = normalizeUserId(userId);

  if (!normalized) {
    return NextResponse.json({ error: "userId obligatorio" }, { status: 400 });
  }

  const body = (await request.json()) as { activeSubjects?: string[] };
  const activeSubjects = Array.isArray(body.activeSubjects)
    ? body.activeSubjects.filter((value): value is string => typeof value === "string")
    : [];

  await saveUserState(normalized, activeSubjects);
  const state = await getUserState(normalized);

  return NextResponse.json({ userId: normalized, state });
}
