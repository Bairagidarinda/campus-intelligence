import { NextRequest, NextResponse } from "next/server";
import data from "@/data/menu.json";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const itemName = (body.item_name || "").toLowerCase();
  const weeklyMenus = data.weekly_menus as Record<string, any>;
  
  for (const c of data.cafeterias) {
    for (const day of Object.keys(weeklyMenus[c])) {
      const dayData = weeklyMenus[c][day];
      for (const mealType of ["breakfast", "lunch", "dinner"]) {
        const meal = dayData[mealType] || { items: [] };
        for (const item of meal.items) {
          if (item.name.toLowerCase().includes(itemName)) {
            return NextResponse.json({
              name: item.name,
              calories: item.calories,
              type: item.type,
              allergens: item.allergens || [],
            });
          }
        }
      }
    }
  }
  
  return NextResponse.json({ error: `Item '${body.item_name}' not found in any menu` });
}
