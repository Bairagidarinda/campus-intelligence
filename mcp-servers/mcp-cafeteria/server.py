import json
import os
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "menu.json")
with open(DATA_PATH, "r", encoding="utf-8") as f:
    MENU_DATA = json.load(f)

WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TodayMenuRequest(BaseModel):
    cafeteria: Optional[str] = None
    meal_type: Optional[str] = None

class WeeklyMenuRequest(BaseModel):
    cafeteria: Optional[str] = None

class NutritionRequest(BaseModel):
    item_name: str

@app.post("/cafeteria/get_today_menu")
async def cafeteria_get_today_menu(req: TodayMenuRequest):
    today = WEEKDAYS[datetime.now().weekday()]
    cafeterias = [req.cafeteria] if req.cafeteria else MENU_DATA["cafeterias"]
    result = {"date": today, "cafeterias": []}
    for c in cafeterias:
        if c not in MENU_DATA["weekly_menus"]:
            continue
        day_data = MENU_DATA["weekly_menus"][c].get(today, {})
        meals = {}
        for mtype in ["breakfast", "lunch", "dinner"]:
            if req.meal_type and req.meal_type.lower() != mtype:
                continue
            meals[mtype] = day_data.get(mtype, {"items": []})
        result["cafeterias"].append({"name": c, "meals": meals})
    return result

@app.post("/cafeteria/get_weekly_menu")
async def cafeteria_get_weekly_menu(req: WeeklyMenuRequest):
    cafeterias = [req.cafeteria] if req.cafeteria else MENU_DATA["cafeterias"]
    result = {"days": []}
    for day in WEEKDAYS:
        day_entry = {"day": day, "cafeterias": []}
        for c in cafeterias:
            if c not in MENU_DATA["weekly_menus"]:
                continue
            day_data = MENU_DATA["weekly_menus"][c].get(day, {})
            day_entry["cafeterias"].append({"name": c, "meals": day_data})
        result["days"].append(day_entry)
    return result

@app.post("/cafeteria/get_nutrition_info")
async def cafeteria_get_nutrition_info(req: NutritionRequest):
    item_name_lower = req.item_name.lower()
    for c in MENU_DATA["cafeterias"]:
        for day in WEEKDAYS:
            day_data = MENU_DATA["weekly_menus"][c].get(day, {})
            for meal_type in ["breakfast", "lunch", "dinner"]:
                meal = day_data.get(meal_type, {"items": []})
                for item in meal.get("items", []):
                    if item_name_lower in item["name"].lower():
                        return {
                            "name": item["name"],
                            "calories": item.get("calories"),
                            "type": item.get("type"),
                            "allergens": item.get("allergens", []),
                        }
    return {"error": f"Item '{req.item_name}' not found in any menu"}

@app.get("/health")
async def health():
    return {"status": "ok", "server": "campus-cafeteria", "cafeterias": MENU_DATA["cafeterias"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
