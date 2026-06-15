import { NextRequest, NextResponse } from "next/server";
import data from "@/data/handbook.json";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const query = (body.query || "").toLowerCase();
  
  const results = [];
  for (const chunk of data) {
    const match = (
      chunk.content.toLowerCase().includes(query) ||
      (chunk.title || "").toLowerCase().includes(query) ||
      (chunk.section || "").toLowerCase().includes(query)
    );
    if (match) {
      results.push(chunk);
    }
  }
  
  return NextResponse.json(results.slice(0, 5));
}
