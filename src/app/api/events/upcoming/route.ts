import { NextRequest, NextResponse } from "next/server";
import data from "@/data/events.json";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const days = body.days || 7;
  const category = body.category;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + days);
  
  const results = [];
  for (const event of data) {
    const eventDate = new Date(event.date);
    if (eventDate >= today && eventDate <= endDate) {
      if (category && !event.category.toLowerCase().includes(category.toLowerCase())) {
        continue;
      }
      results.push(event);
    }
  }
  
  results.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return NextResponse.json(results);
}
