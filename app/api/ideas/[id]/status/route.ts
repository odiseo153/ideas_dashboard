import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const ideaId = parseInt(id);

    if (isNaN(ideaId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    if (typeof status !== "number" || status < 1 || status > 4) {
      return NextResponse.json(
        { error: "Status inválido. Debe ser 1, 2, 3 o 4" },
        { status: 400 }
      );
    }

    const idea = await prisma.ideas_social_content.update({
      where: { id: ideaId },
      data: { status },
    });

    return NextResponse.json({
      ...idea,
      fecha: idea.fecha.toISOString().split("T")[0],
      created_at: idea.created_at?.toISOString() ?? null,
      updated_at: idea.updated_at?.toISOString() ?? null,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json(
      { error: "Error al actualizar el status" },
      { status: 500 }
    );
  }
}

