import json
import os
from datetime import datetime, timedelta
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "events.json")
with open(DATA_PATH, "r", encoding="utf-8") as f:
    EVENTS = json.load(f)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class UpcomingEventsRequest(BaseModel):
    days: Optional[int] = 7
    category: Optional[str] = None

class SearchEventsRequest(BaseModel):
    query: str
    category: Optional[str] = None

class EventIdRequest(BaseModel):
    event_id: str

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

@app.get("/health")
async def health():
    return {"status": "ok", "server": "campus-events", "events_loaded": len(EVENTS)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
