import { NextRequest, NextResponse } from "next/server";
import data from "@/data/menu.json";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cafeteria = body.cafeteria;
  const weeklyMenus = data.weekly_menus as Record<string, any>;
  
  const cafeterias = cafeteria ? [cafeteria] : data.cafeterias;
  const result: any = { days: [] };
  
  for (const day of WEEKDAYS) {
    const dayEntry: any = { day, cafeterias: [] };
    for (const c of cafeterias) {
      if (!weeklyMenus[c]) continue;
      const dayData = weeklyMenus[c][day] || {};
      dayEntry.cafeterias.push({ name: c, meals: dayData });
    }
    result.days.push(dayEntry);
  }
  
  return NextResponse.json(result);
}
