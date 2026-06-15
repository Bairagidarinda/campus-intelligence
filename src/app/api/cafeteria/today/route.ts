import { NextRequest, NextResponse } from "next/server";
import data from "@/data/menu.json";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cafeteria = body.cafeteria;
  const mealType = body.meal_type;
  const weeklyMenus = data.weekly_menus as Record<string, any>;
  
  const today = WEEKDAYS[new Date().getDay()];
  const cafeterias = cafeteria ? [cafeteria] : data.cafeterias;
  const result: any = { date: today, cafeterias: [] };
  
  for (const c of cafeterias) {
    if (!weeklyMenus[c]) continue;
    const dayData = weeklyMenus[c][today] || {};
    const meals: any = {};
    for (const mtype of ["breakfast", "lunch", "dinner"]) {
      if (mealType && mealType.toLowerCase() !== mtype) continue;
      meals[mtype] = dayData[mtype] || { items: [] };
    }
    result.cafeterias.push({ name: c, meals });
  }
  
  return NextResponse.json(result);
}
