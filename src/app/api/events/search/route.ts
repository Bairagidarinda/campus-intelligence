import { NextRequest, NextResponse } from "next/server";
import data from "@/data/events.json";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const query = (body.query || "").toLowerCase();
  const category = body.category;
  
  const results = [];
  for (const event of data) {
    let match = (
      event.name.toLowerCase().includes(query) ||
      (event.club || "").toLowerCase().includes(query) ||
      (event.description || "").toLowerCase().includes(query) ||
      (event.location || "").toLowerCase().includes(query)
    );
    if (category && !event.category.toLowerCase().includes(category.toLowerCase())) {
      match = false;
    }
    if (match) {
      results.push(event);
    }
  }
  
  return NextResponse.json(results);
}
