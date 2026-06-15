import { NextRequest, NextResponse } from "next/server";
import data from "@/data/books.json";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const query = (body.query || "").toLowerCase().trim();
  const query_words = query.split(" ").filter((w: string) => w.length >= 3);
  const genre = body.genre;
  const available_only = body.available_only;

  let results = [];
  for (const book of data) {
    const title = book.title.toLowerCase();
    const author = book.author.toLowerCase();
    const isbn = (book.isbn || "").toLowerCase();
    const bookGenre = (book.genre || "").toLowerCase();
    
    let match = query && (
      title.includes(query) || 
      author.includes(query) || 
      isbn.includes(query) || 
      bookGenre.includes(query)
    );
    
    if (!match && query_words.length > 0) {
      match = query_words.some((word: string) => 
        title.includes(word) || 
        author.includes(word) || 
        isbn.includes(word) || 
        bookGenre.includes(word)
      );
    }
    
    if (genre && !bookGenre.includes(genre.toLowerCase())) {
      match = false;
    }
    if (available_only && !book.available) {
      match = false;
    }
    if (match) {
      results.push(book);
    }
  }
  
  return NextResponse.json(results);
}
