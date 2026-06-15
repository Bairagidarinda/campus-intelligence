import { NextRequest, NextResponse } from "next/server";
import data from "@/data/professors.json";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const professorName = body.professor_name;
  const professorId = body.professor_id;
  
  const results = [];
  for (const prof of data) {
    let match = false;
    if (professorId && prof.id === professorId) {
      match = true;
    }
    if (professorName && prof.name.toLowerCase().includes(professorName.toLowerCase())) {
      match = true;
    }
    if (match) {
      results.push(prof);
    }
  }
  
  return NextResponse.json(results);
}
