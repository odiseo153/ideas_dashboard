import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const ideaId = parseInt(id);

    if (isNaN(ideaId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const idea = await prisma.ideas_social_content.findUnique({
      where: { id: ideaId },
    });

    if (!idea) {
      return NextResponse.json(
        { error: "Idea no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...idea,
      fecha: idea.fecha.toISOString().split("T")[0],
      created_at: idea.created_at?.toISOString() ?? null,
      updated_at: idea.updated_at?.toISOString() ?? null,
    });
  } catch (error) {
    console.error("Error fetching idea:", error);
    return NextResponse.json(
      { error: "Error al obtener la idea" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const ideaId = parseInt(id);

    if (isNaN(ideaId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    await prisma.ideas_social_content.delete({
      where: { id: ideaId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting idea:", error);
    return NextResponse.json(
      { error: "Error al eliminar la idea" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const ideaId = parseInt(id);

    if (isNaN(ideaId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();

    const idea = await prisma.ideas_social_content.update({
      where: { id: ideaId },
      data: {
        fecha: body.fecha ? new Date(body.fecha) : undefined,
        nicho: body.nicho,
        body: body.body,
        tipo_idea: body.tipo_idea,
        tipo_post: body.tipo_post,
        guion: body.guion,
        idea: body.idea,
        status: body.status,
        web_app_prompt: body.web_app_prompt,
        db_structure: body.db_structure,
        redes_sociales: body.redes_sociales,
        images_prompt: body.images_prompt,
      },
    });

    return NextResponse.json({
      ...idea,
      fecha: idea.fecha.toISOString().split("T")[0],
      created_at: idea.created_at?.toISOString() ?? null,
      updated_at: idea.updated_at?.toISOString() ?? null,
    });
  } catch (error) {
    console.error("Error updating idea:", error);
    return NextResponse.json(
      { error: "Error al actualizar la idea" },
      { status: 500 }
    );
  }
}

