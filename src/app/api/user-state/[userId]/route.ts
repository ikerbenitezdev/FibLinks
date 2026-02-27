import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getUserState, normalizeUserId, saveUserState } from "@/lib/server/storage";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;
  const session = await getServerSession(authOptions);
  const sessionUser = normalizeUserId(session?.user?.email ?? "");
  const normalized = normalizeUserId(userId);

  if (!sessionUser) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (normalized !== sessionUser) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  if (!sessionUser) {
    return NextResponse.json({ error: "userId obligatorio" }, { status: 400 });
  }

  const state = await getUserState(sessionUser);
  return NextResponse.json({ userId: sessionUser, state });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;
  const session = await getServerSession(authOptions);
  const sessionUser = normalizeUserId(session?.user?.email ?? "");
  const normalized = normalizeUserId(userId);

  if (!sessionUser) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (normalized !== sessionUser) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  if (!sessionUser) {
    return NextResponse.json({ error: "userId obligatorio" }, { status: 400 });
  }

  const body = (await request.json()) as { activeSubjects?: string[] };
  const activeSubjects = Array.isArray(body.activeSubjects)
    ? body.activeSubjects.filter((value): value is string => typeof value === "string")
    : [];

  await saveUserState(sessionUser, activeSubjects);
  const state = await getUserState(sessionUser);

  return NextResponse.json({ userId: sessionUser, state });
}
