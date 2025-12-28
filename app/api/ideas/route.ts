import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ideas = await prisma.ideas_social_content.findMany({
      orderBy: { fecha: "desc" },
    });

    // Transformar las fechas a formato ISO string para el JSON
    const formattedIdeas = ideas.map((idea) => ({
      ...idea,
      fecha: idea.fecha.toISOString().split("T")[0], // YYYY-MM-DD
      created_at: idea.created_at?.toISOString() ?? null,
      updated_at: idea.updated_at?.toISOString() ?? null,
    }));

    return NextResponse.json(formattedIdeas);
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return NextResponse.json(
      { error: "Error al obtener las ideas,    " + error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const idea = await prisma.ideas_social_content.create({
      data: {
        fecha: new Date(body.fecha),
        nicho: body.nicho,
        body: body.body,
        tipo_idea: body.tipo_idea,
        tipo_post: body.tipo_post,
        guion: body.guion,
        idea: body.idea,
        status: body.status ?? 1,
        web_app_prompt: body.web_app_prompt,
        db_structure: body.db_structure,
        redes_sociales: body.redes_sociales ?? [],
        images_prompt: body.images_prompt ?? [],
      },
    });

    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    console.error("Error creating idea:", error);
    return NextResponse.json(
      { error: "Error al crear la idea" },
      { status: 500 }
    );
  }
}
