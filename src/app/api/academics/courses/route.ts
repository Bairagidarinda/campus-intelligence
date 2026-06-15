import { NextRequest, NextResponse } from "next/server";
import data from "@/data/courses.json";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const courseCode = body.course_code;
  const courseName = body.course_name;
  
  const results = [];
  for (const course of data) {
    let match = false;
    if (courseCode && course.code.toUpperCase().includes(courseCode.toUpperCase())) {
      match = true;
    }
    if (courseName && course.name.toLowerCase().includes(courseName.toLowerCase())) {
      match = true;
    }
    if (match) {
      results.push(course);
    }
  }
  
  return NextResponse.json(results);
}
