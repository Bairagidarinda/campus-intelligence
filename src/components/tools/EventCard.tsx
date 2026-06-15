import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Users, ExternalLink } from "lucide-react";

interface EventCardProps {
  toolName: string;
  data: any;
}

const categoryColors: Record<string, string> = {
  "tech fest": "border-l-blue-400",
  cultural: "border-l-purple-400",
  sports: "border-l-green-400",
  academic: "border-l-amber-400",
  club: "border-l-pink-400",
  "campus-wide": "border-l-cyan-400",
};

const categoryIcons: Record<string, string> = {
  "tech fest": "🚀",
  cultural: "🎭",
  sports: "⚽",
  academic: "📚",
  club: "🤝",
  "campus-wide": "🌍",
};

export function EventCard({ toolName, data }: EventCardProps) {
  // Server returns array of events directly, or a single event object
  let events: any[] = [];
  if (Array.isArray(data)) {
    events = data;
  } else if (data && typeof data === "object" && (data.name || data.id || data.title)) {
    events = [data];
  }

  if (events.length === 0) {
    return (
      <div className="mt-2 rounded-md border border-slate-700/50 bg-slate-800/50 px-3 py-2 text-xs text-slate-400">
        No events found.
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-2">
      {events.map((event: any, index: number) => {
        const category = event.category || "general";
        const borderColor = categoryColors[category] || "border-l-slate-400";
        const icon = categoryIcons[category] || "📅";

        return (
          <Card key={index} className={`border-l-4 ${borderColor} bg-slate-800/50 border-slate-700/50`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{icon}</span>
                  <CardTitle className="text-sm text-slate-100">{event.name || event.title}</CardTitle>
                </div>
                <Badge variant="outline" className="border-slate-600/50 text-[10px] text-slate-400">
                  {event.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 text-xs text-slate-400">
              {event.club && (
                <p className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-slate-500" />
                  <span className="font-medium text-slate-200">Organized by:</span> {event.club}
                </p>
              )}
              <p className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-slate-500" />
                <span className="font-medium text-slate-200">Date:</span> {event.date}
                {event.time && ` at ${event.time}`}
              </p>
              <p className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-slate-500" />
                <span className="font-medium text-slate-200">Location:</span> {event.location}
              </p>
              {event.description && (
                <p className="mt-1 leading-relaxed text-slate-300">{event.description}</p>
              )}
              {event.registration_link && (
                <a 
                  href={event.registration_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                >
                  <ExternalLink className="h-3 w-3" />
                  Register
                </a>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
