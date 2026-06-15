import { NextRequest, NextResponse } from "next/server";
import data from "@/data/events.json";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const eventId = body.event_id;
  
  const event = data.find((e: any) => e.id === eventId);
  if (event) {
    return NextResponse.json(event);
  }
  return NextResponse.json({ error: `Event with ID ${eventId} not found` });
}
