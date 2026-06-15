import json
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "books.json")
with open(DATA_PATH, "r", encoding="utf-8") as f:
    BOOKS = json.load(f)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchBooksRequest(BaseModel):
    query: str
    genre: Optional[str] = None
    available_only: Optional[bool] = False

class BookIdRequest(BaseModel):
    book_id: str

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
        # Full substring match OR any query word matches
        match = (
            query in title or query in author or query in isbn or query in genre
        )
        if not match and query_words:
            match = any(
                word in title or word in author or word in isbn or word in genre
                for word in query_words
            )
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

@app.get("/health")
async def health():
    return {"status": "ok", "server": "campus-library", "books_loaded": len(BOOKS)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
