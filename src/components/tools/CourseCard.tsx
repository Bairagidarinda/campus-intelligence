import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, Clock, Mail, MapPin } from "lucide-react";

interface CourseCardProps {
  toolName: string;
  data: any;
}

export function CourseCard({ toolName, data }: CourseCardProps) {
  if (toolName.includes("handbook")) {
    let chunks: any[] = [];
    if (Array.isArray(data)) {
      chunks = data;
    } else if (data && typeof data === "object") {
      chunks = [data];
    }

    if (chunks.length === 0) {
      return (
        <div className="mt-2 rounded-md border border-slate-700/50 bg-slate-800/50 px-3 py-2 text-xs text-slate-400">
          No handbook results found.
        </div>
      );
    }

    return (
      <div className="mt-2 space-y-2">
        {chunks.map((chunk: any, index: number) => (
          <Card key={index} className="border-l-4 border-l-amber-400 bg-slate-800/50 border-slate-700/50">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-400" />
                <CardTitle className="text-sm text-slate-100">{chunk.title || "Handbook Result"}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs leading-relaxed text-slate-400">
              <p className="text-slate-200">{chunk.content || chunk.text || JSON.stringify(chunk)}</p>
              {chunk.section && <p className="mt-1 text-[10px] text-slate-500">Section: {chunk.section}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (toolName.includes("course")) {
    let courses: any[] = [];
    if (Array.isArray(data)) {
      courses = data;
    } else if (data && typeof data === "object" && (data.code || data.name || data.id)) {
      courses = [data];
    }

    if (courses.length === 0) {
      return (
        <div className="mt-2 rounded-md border border-slate-700/50 bg-slate-800/50 px-3 py-2 text-xs text-slate-400">
          No courses found.
        </div>
      );
    }

    return (
      <div className="mt-2 space-y-2">
        {courses.map((course: any, index: number) => (
          <Card key={index} className="border-l-4 border-l-indigo-400 bg-slate-800/50 border-slate-700/50">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-indigo-400" />
                <CardTitle className="text-sm text-slate-100">{course.code} — {course.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 text-xs text-slate-400">
              <p><span className="font-medium text-slate-200">Credits:</span> {course.credits}</p>
              {course.prerequisites?.length > 0 && (
                <p><span className="font-medium text-slate-200">Prerequisites:</span> {course.prerequisites.join(", ")}</p>
              )}
              {course.professor && <p><span className="font-medium text-slate-200">Professor:</span> {course.professor}</p>}
              {course.schedule && <p><span className="font-medium text-slate-200">Schedule:</span> {course.schedule}</p>}
              {course.description && <p className="leading-relaxed text-slate-300">{course.description}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (toolName.includes("professor")) {
    let professors: any[] = [];
    if (Array.isArray(data)) {
      professors = data;
    } else if (data && typeof data === "object" && (data.name || data.id)) {
      professors = [data];
    }

    if (professors.length === 0) {
      return (
        <div className="mt-2 rounded-md border border-slate-700/50 bg-slate-800/50 px-3 py-2 text-xs text-slate-400">
          No professors found.
        </div>
      );
    }

    return (
      <div className="mt-2 space-y-2">
        {professors.map((prof: any, index: number) => (
          <Card key={index} className="border-l-4 border-l-teal-400 bg-slate-800/50 border-slate-700/50">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-teal-400" />
                <CardTitle className="text-sm text-slate-100">{prof.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 text-xs text-slate-400">
              <p><span className="font-medium text-slate-200">Department:</span> {prof.department}</p>
              {prof.email && (
                <p className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-slate-500" />
                  <span className="font-medium text-slate-200">Email:</span> {prof.email}
                </p>
              )}
              {prof.office_hours && (
                <p className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-500" />
                  <span className="font-medium text-slate-200">Office Hours:</span> {prof.office_hours}
                </p>
              )}
              {prof.office_location && (
                <p className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-500" />
                  <span className="font-medium text-slate-200">Office:</span> {prof.office_location}
                </p>
              )}
              {prof.courses && (
                <p><span className="font-medium text-slate-200">Courses:</span> {prof.courses.join(", ")}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-2 rounded-md border border-slate-700/50 bg-slate-800/50 px-3 py-2 text-xs text-slate-400">
      <code className="text-slate-300">{toolName}</code> result: {JSON.stringify(data, null, 2)}
    </div>
  );
}
