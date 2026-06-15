import { NextRequest, NextResponse } from "next/server";
import data from "@/data/books.json";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const bookId = body.book_id;
  
  const book = data.find((b: any) => b.id === bookId);
  if (book) {
    return NextResponse.json(book);
  }
  return NextResponse.json({ error: `Book with ID ${bookId} not found` });
}
