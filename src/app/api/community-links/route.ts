import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import {
  addCommunityLink,
  deleteCommunityLink,
  getCommunityLinksBySubjects,
  getPendingCommunityLinks,
  isModeratorUser,
  moderateCommunityLink,
  normalizeUserId,
} from "@/lib/server/storage";

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status")?.trim();

  if (status === "pending") {
    const session = await getServerSession(authOptions);
    const userId = normalizeUserId(session?.user?.email ?? "");

    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    if (!userId || !isModeratorUser(userId)) {
      return NextResponse.json({ error: "No autorizado para moderar" }, { status: 403 });
    }

    const pendingLinks = await getPendingCommunityLinks();
    return NextResponse.json({ pendingLinks });
  }

  const subjectIdsParam = request.nextUrl.searchParams.get("subjectIds") ?? "";
  const subjectIds = subjectIdsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const session = await getServerSession(authOptions);
  const userId = normalizeUserId(session?.user?.email ?? "");

  if (!userId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const linksBySubject = await getCommunityLinksBySubjects(subjectIds, userId);
  return NextResponse.json({ linksBySubject });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const sessionUserId = normalizeUserId(session?.user?.email ?? "");

  if (!sessionUserId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = (await request.json()) as {
    subjectId?: string;
    title?: string;
    url?: string;
    description?: string;
  };

  const subjectId = body.subjectId?.trim();
  const title = body.title?.trim();
  const url = body.url?.trim();
  const userId = sessionUserId;

  if (!subjectId || !title || !url || !userId) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  const newLink = await addCommunityLink({
    subjectId,
    title,
    url,
    description: body.description?.trim(),
    userId,
  });

  return NextResponse.json({ link: newLink });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const sessionUserId = normalizeUserId(session?.user?.email ?? "");

  if (!sessionUserId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = (await request.json()) as {
    subjectId?: string;
    linkId?: string;
  };

  const subjectId = body.subjectId?.trim();
  const linkId = body.linkId?.trim();
  const userId = sessionUserId;

  if (!subjectId || !linkId || !userId) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  const result = await deleteCommunityLink({ subjectId, linkId, userId });

  if (!result.deleted && result.reason === "forbidden") {
    return NextResponse.json(
      { error: "Solo puedes borrar tus enlaces pendientes; el moderador puede borrar cualquiera" },
      { status: 403 }
    );
  }

  if (!result.deleted && result.reason === "not_found") {
    return NextResponse.json({ error: "Enlace no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const sessionUserId = normalizeUserId(session?.user?.email ?? "");

  if (!sessionUserId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = (await request.json()) as {
    subjectId?: string;
    linkId?: string;
    action?: "approve" | "reject";
  };

  const subjectId = body.subjectId?.trim();
  const linkId = body.linkId?.trim();
  const userId = sessionUserId;
  const action = body.action;

  if (!subjectId || !linkId || !userId || (action !== "approve" && action !== "reject")) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  if (!isModeratorUser(userId)) {
    return NextResponse.json({ error: "No autorizado para moderar" }, { status: 403 });
  }

  const result = await moderateCommunityLink({
    subjectId,
    linkId,
    moderatorUserId: userId,
    action,
  });

  if (!result.updated) {
    return NextResponse.json({ error: "Enlace no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
