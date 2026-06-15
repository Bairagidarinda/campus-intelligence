import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle2, XCircle, MapPin } from "lucide-react";

interface BookCardProps {
  toolName: string;
  data: any;
}

export function BookCard({ toolName, data }: BookCardProps) {
  // Server returns array of books directly, or a single book object
  let books: any[] = [];
  if (Array.isArray(data)) {
    books = data;
  } else if (data && typeof data === "object") {
    // Single book object
    if (data.title || data.id || data.name) {
      books = [data];
    }
  }

  if (books.length === 0) {
    return (
      <div className="mt-2 rounded-md border border-slate-700/50 bg-slate-800/50 px-3 py-2 text-xs text-slate-400">
        No books found in the library.
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-2">
      {books.map((book: any, index: number) => (
        <Card key={index} className="border-l-4 border-l-blue-500 bg-slate-800/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-400" />
                <CardTitle className="text-sm text-slate-100">{book.title || book.name || "Book"}</CardTitle>
              </div>
              <Badge
                variant={book.available || book.available_copies > 0 ? "default" : "destructive"}
                className={`text-xs ${
                  book.available || book.available_copies > 0
                    ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                    : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                }`}
              >
                {book.available || book.available_copies > 0 ? (
                  <><CheckCircle2 className="mr-1 h-3 w-3" /> Available</>
                ) : (
                  <><XCircle className="mr-1 h-3 w-3" /> Checked Out</>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 text-xs text-slate-400">
            {book.author && <p><span className="font-medium text-slate-200">Author:</span> {book.author}</p>}
            {book.isbn && <p><span className="font-medium text-slate-200">ISBN:</span> {book.isbn}</p>}
            {book.genre && <p><span className="font-medium text-slate-200">Genre:</span> {book.genre}</p>}
            {book.shelf_location && (
              <p className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-slate-500" />
                <span className="font-medium text-slate-200">Location:</span> {book.shelf_location}
              </p>
            )}
            {book.available_copies !== undefined && (
              <p><span className="font-medium text-slate-200">Copies:</span> {book.available_copies} / {book.total_copies} available</p>
            )}
            {book.due_date && <p><span className="font-medium text-slate-200">Due:</span> {book.due_date}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
