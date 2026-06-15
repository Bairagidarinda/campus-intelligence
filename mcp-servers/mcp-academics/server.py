import json
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

BASE_DIR = os.path.join(os.path.dirname(__file__), "data")

with open(os.path.join(BASE_DIR, "handbook.json"), "r", encoding="utf-8") as f:
    HANDBOOK = json.load(f)
with open(os.path.join(BASE_DIR, "courses.json"), "r", encoding="utf-8") as f:
    COURSES = json.load(f)
with open(os.path.join(BASE_DIR, "professors.json"), "r", encoding="utf-8") as f:
    PROFESSORS = json.load(f)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class HandbookRequest(BaseModel):
    query: str

class CourseRequest(BaseModel):
    course_code: Optional[str] = None
    course_name: Optional[str] = None

class ProfessorRequest(BaseModel):
    professor_name: Optional[str] = None
    professor_id: Optional[str] = None

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

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "server": "campus-academics",
        "handbook_chunks": len(HANDBOOK),
        "courses": len(COURSES),
        "professors": len(PROFESSORS),
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)
