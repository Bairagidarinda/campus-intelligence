import json
import os
from datetime import datetime, timedelta
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── LOAD ALL DATA ─────────────────────────────────────
BASE_DIR = os.path.dirname(__file__)

# Library data
with open(os.path.join(BASE_DIR, "data", "books.json"), "r", encoding="utf-8") as f:
    BOOKS = json.load(f)

# Cafeteria data
with open(os.path.join(BASE_DIR, "data", "menu.json"), "r", encoding="utf-8") as f:
    MENU_DATA = json.load(f)
WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

# Events data
with open(os.path.join(BASE_DIR, "data", "events.json"), "r", encoding="utf-8") as f:
    EVENTS = json.load(f)

# Academics data
with open(os.path.join(BASE_DIR, "data", "handbook.json"), "r", encoding="utf-8") as f:
    HANDBOOK = json.load(f)
with open(os.path.join(BASE_DIR, "data", "courses.json"), "r", encoding="utf-8") as f:
    COURSES = json.load(f)
with open(os.path.join(BASE_DIR, "data", "professors.json"), "r", encoding="utf-8") as f:
    PROFESSORS = json.load(f)

# ─── REQUEST MODELS ───────────────────────────────────

class SearchBooksRequest(BaseModel):
    query: str
    genre: Optional[str] = None
    available_only: Optional[bool] = False

class BookIdRequest(BaseModel):
    book_id: str

class TodayMenuRequest(BaseModel):
    cafeteria: Optional[str] = None
    meal_type: Optional[str] = None

class WeeklyMenuRequest(BaseModel):
    cafeteria: Optional[str] = None

class NutritionRequest(BaseModel):
    item_name: str

class UpcomingEventsRequest(BaseModel):
    days: Optional[int] = 7
    category: Optional[str] = None

class SearchEventsRequest(BaseModel):
    query: str
    category: Optional[str] = None

class EventIdRequest(BaseModel):
    event_id: str

class HandbookRequest(BaseModel):
    query: str

class CourseRequest(BaseModel):
    course_code: Optional[str] = None
    course_name: Optional[str] = None

class ProfessorRequest(BaseModel):
    professor_name: Optional[str] = None
    professor_id: Optional[str] = None

# ─── LIBRARY ENDPOINTS ────────────────────────────────

@app.post("/library/search_books")
async def library_search_books(req: SearchBooksRequest):
    query = req.query.lower().strip()
    query_words = [w for w in query.split() if len(w) >= 3]
    results = []
    for book in BOOKS:
        title = book["title"].lower()
        author = book["author"].lower()
        isbn = book.get("isbn", "").lower()
        genre = book.get("genre", "").lower()
        match = query in title or query in author or query in isbn or query in genre
        if not match and query_words:
            match = any(word in title or word in author or word in isbn or word in genre for word in query_words)
        if req.genre and req.genre.lower() not in genre:
            match = False
        if req.available_only and not book.get("available", False):
            match = False
        if match:
            results.append(book)
    return results

@app.post("/library/check_availability")
async def library_check_availability(req: BookIdRequest):
    for book in BOOKS:
        if book["id"] == req.book_id:
            return book
    return {"error": f"Book with ID {req.book_id} not found"}

@app.post("/library/get_book_details")
async def library_get_book_details(req: BookIdRequest):
    for book in BOOKS:
        if book["id"] == req.book_id:
            return book
    return {"error": f"Book with ID {req.book_id} not found"}

# ─── CAFETERIA ENDPOINTS ──────────────────────────────

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

# ─── EVENTS ENDPOINTS ─────────────────────────────────

@app.post("/events/get_upcoming_events")
async def events_get_upcoming_events(req: UpcomingEventsRequest):
    today = datetime.now().date()
    end_date = today + timedelta(days=req.days)
    results = []
    for event in EVENTS:
        event_date = datetime.strptime(event["date"], "%Y-%m-%d").date()
        if today <= event_date <= end_date:
            if req.category and req.category.lower() not in event.get("category", "").lower():
                continue
            results.append(event)
    return sorted(results, key=lambda x: x["date"])

@app.post("/events/search_events")
async def events_search_events(req: SearchEventsRequest):
    query_lower = req.query.lower()
    results = []
    for event in EVENTS:
        match = (
            query_lower in event["name"].lower()
            or query_lower in event.get("club", "").lower()
            or query_lower in event.get("description", "").lower()
            or query_lower in event.get("location", "").lower()
        )
        if req.category and req.category.lower() not in event.get("category", "").lower():
            match = False
        if match:
            results.append(event)
    return results

@app.post("/events/get_event_details")
async def events_get_event_details(req: EventIdRequest):
    for event in EVENTS:
        if event["id"] == req.event_id:
            return event
    return {"error": f"Event with ID {req.event_id} not found"}

# ─── ACADEMICS ENDPOINTS ─────────────────────────────

@app.post("/academics/search_handbook")
async def academics_search_handbook(req: HandbookRequest):
    query_lower = req.query.lower()
    results = []
    for chunk in HANDBOOK:
        match = (
            query_lower in chunk["content"].lower()
            or query_lower in chunk.get("title", "").lower()
            or query_lower in chunk.get("section", "").lower()
        )
        if match:
            results.append(chunk)
    return results[:5]

@app.post("/academics/get_course_info")
async def academics_get_course_info(req: CourseRequest):
    results = []
    for course in COURSES:
        match = False
        if req.course_code and req.course_code.upper() in course["code"].upper():
            match = True
        if req.course_name and req.course_name.lower() in course["name"].lower():
            match = True
        if match:
            results.append(course)
    return results

@app.post("/academics/get_professor_hours")
async def academics_get_professor_hours(req: ProfessorRequest):
    results = []
    for prof in PROFESSORS:
        match = False
        if req.professor_id and req.professor_id == prof["id"]:
            match = True
        if req.professor_name and req.professor_name.lower() in prof["name"].lower():
            match = True
        if match:
            results.append(prof)
    return results

# ─── HEALTH CHECK ───────────────────────────────────

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "unified_server": True,
        "services": {
            "library": {"books_loaded": len(BOOKS)},
            "cafeteria": {"cafeterias": MENU_DATA["cafeterias"]},
            "events": {"events_loaded": len(EVENTS)},
            "academics": {
                "handbook_chunks": len(HANDBOOK),
                "courses": len(COURSES),
                "professors": len(PROFESSORS),
            }
        }
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)
