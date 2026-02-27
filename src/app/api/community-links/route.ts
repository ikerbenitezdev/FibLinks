import { NextRequest, NextResponse } from "next/server";
import {
  addCommunityLink,
  deleteCommunityLink,
  getCommunityLinksBySubjects,
  normalizeUserId,
} from "@/lib/server/storage";

export async function GET(request: NextRequest) {
  const subjectIdsParam = request.nextUrl.searchParams.get("subjectIds") ?? "";
  const subjectIds = subjectIdsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const linksBySubject = await getCommunityLinksBySubjects(subjectIds);
  return NextResponse.json({ linksBySubject });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    subjectId?: string;
    title?: string;
    url?: string;
    description?: string;
    userId?: string;
  };

  const subjectId = body.subjectId?.trim();
  const title = body.title?.trim();
  const url = body.url?.trim();
  const userId = normalizeUserId(body.userId ?? "");

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
  const body = (await request.json()) as {
    subjectId?: string;
    linkId?: string;
    userId?: string;
  };

  const subjectId = body.subjectId?.trim();
  const linkId = body.linkId?.trim();
  const userId = normalizeUserId(body.userId ?? "");

  if (!subjectId || !linkId || !userId) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  const result = await deleteCommunityLink({ subjectId, linkId, userId });

  if (!result.deleted && result.reason === "forbidden") {
    return NextResponse.json({ error: "Solo puedes borrar tus propios enlaces" }, { status: 403 });
  }

  if (!result.deleted && result.reason === "not_found") {
    return NextResponse.json({ error: "Enlace no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
