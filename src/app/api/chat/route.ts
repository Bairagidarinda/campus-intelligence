import { groq } from "@/lib/groq";
import { streamText, convertToCoreMessages, tool } from "ai";
import type { Message } from "ai";
import { z } from "zod";

const LIBRARY_URL = process.env.MCP_LIBRARY_URL || "http://localhost:8001";
const CAFETERIA_URL = process.env.MCP_CAFETERIA_URL || "http://localhost:8002";
const EVENTS_URL = process.env.MCP_EVENTS_URL || "http://localhost:8003";
const ACADEMICS_URL = process.env.MCP_ACADEMICS_URL || "http://localhost:8004";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
  // Use Groq with rate limit awareness (2 requests/min with current prompt size)
  const modelId = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch (e: any) {
    console.error("[API] Failed to read request body:", e.message);
    return new Response(JSON.stringify({ error: "Failed to read body" }), { status: 400 });
  }

  let messages: Message[];
  try {
    const parsed = JSON.parse(rawBody);
    messages = parsed.messages;
    if (!Array.isArray(messages)) {
      console.error("[API] Invalid body: messages is not an array, raw body:", rawBody.slice(0, 500));
      return new Response(JSON.stringify({ error: "Invalid body: expected messages array" }), { status: 400 });
    }
  } catch (e: any) {
    console.error("[API] JSON parse error, raw body:", rawBody.slice(0, 500));
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
  }

  const allTools = {
    library_search_books: tool({
      description: "Search for books in the campus library by title, author, ISBN, or genre. Returns array of book objects.",
      parameters: z.object({
        query: z.string().describe("Search term for title, author, ISBN, or genre"),
        genre: z.string().optional().describe("Optional genre filter"),
        available_only: z.boolean().optional().describe("If true, only return available books"),
      }),
      execute: async ({ query, genre, available_only }) => {
        try {
          const res = await fetch(`${LIBRARY_URL}/library/search_books`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, genre, available_only }),
          });
          if (!res.ok) return [];
          return await res.json();
        } catch (e: any) {
          return [];
        }
      },
    }),

    library_check_availability: tool({
      description: "Check book availability by ID. Returns book object.",
      parameters: z.object({
        book_id: z.string().describe("The library book ID (e.g., lib-001)"),
      }),
      execute: async ({ book_id }) => {
        try {
          const res = await fetch(`${LIBRARY_URL}/library/check_availability`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ book_id }),
          });
          if (!res.ok) return { error: "Not found" };
          return await res.json();
        } catch (e: any) {
          return { error: "Not found" };
        }
      },
    }),

    library_get_book_details: tool({
      description: "Get book details by ID. Returns book object.",
      parameters: z.object({
        book_id: z.string().describe("The library book ID (e.g., lib-001)"),
      }),
      execute: async ({ book_id }) => {
        try {
          const res = await fetch(`${LIBRARY_URL}/library/get_book_details`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ book_id }),
          });
          if (!res.ok) return { error: "Not found" };
          return await res.json();
        } catch (e: any) {
          return { error: "Not found" };
        }
      },
    }),

    cafeteria_get_today_menu: tool({
      description: "Get today's cafeteria menu. Returns {date: string, cafeterias: [{name: string, meals: {breakfast: {items: []}, lunch: {items: []}, dinner: {items: []}}}]}.",
      parameters: z.object({
        cafeteria: z.string().optional().describe("Cafeteria name: 'Main Cafeteria' or 'South Campus'"),
        meal_type: z.string().optional().describe("Meal type: 'breakfast', 'lunch', or 'dinner'"),
      }),
      execute: async ({ cafeteria, meal_type }) => {
        try {
          const res = await fetch(`${CAFETERIA_URL}/cafeteria/get_today_menu`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cafeteria, meal_type }),
          });
          if (!res.ok) return { date: "", cafeterias: [] };
          return await res.json();
        } catch (e: any) {
          return { date: "", cafeterias: [] };
        }
      },
    }),

    cafeteria_get_weekly_menu: tool({
      description: "Get weekly menu. Returns {days: [{day: string, cafeterias: [{name: string, meals: {...}}]}]}.",
      parameters: z.object({
        cafeteria: z.string().optional().describe("Cafeteria name: 'Main Cafeteria' or 'South Campus'"),
      }),
      execute: async ({ cafeteria }) => {
        try {
          const res = await fetch(`${CAFETERIA_URL}/cafeteria/get_weekly_menu`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cafeteria }),
          });
          if (!res.ok) return { days: [] };
          return await res.json();
        } catch (e: any) {
          return { days: [] };
        }
      },
    }),

    cafeteria_get_nutrition_info: tool({
      description: "Get nutrition info for a food item.",
      parameters: z.object({
        item_name: z.string().describe("Name of the food item"),
      }),
      execute: async ({ item_name }) => {
        try {
          const res = await fetch(`${CAFETERIA_URL}/cafeteria/get_nutrition_info`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ item_name }),
          });
          if (!res.ok) return { error: "Not found" };
          return await res.json();
        } catch (e: any) {
          return { error: "Not found" };
        }
      },
    }),

    events_get_upcoming_events: tool({
      description: "Get upcoming events. Returns array of event objects with id, name, club, category, date, time, location, description.",
      parameters: z.object({
        days: z.number().optional().describe("Number of days to look ahead (default: 7)"),
        category: z.string().optional().describe("Event category: 'tech fest', 'cultural', 'sports', 'academic', 'club'"),
      }),
      execute: async ({ days, category }) => {
        try {
          const res = await fetch(`${EVENTS_URL}/events/get_upcoming_events`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ days, category }),
          });
          if (!res.ok) return [];
          return await res.json();
        } catch (e: any) {
          return [];
        }
      },
    }),

    events_search_events: tool({
      description: "Search events by name, club, description. Returns array of event objects.",
      parameters: z.object({
        query: z.string().describe("Search query for events"),
        category: z.string().optional().describe("Event category filter"),
      }),
      execute: async ({ query, category }) => {
        try {
          const res = await fetch(`${EVENTS_URL}/events/search_events`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, category }),
          });
          if (!res.ok) return [];
          return await res.json();
        } catch (e: any) {
          return [];
        }
      },
    }),

    events_get_event_details: tool({
      description: "Get event details by ID. Returns event object.",
      parameters: z.object({
        event_id: z.string().describe("Event ID (e.g., evt-001)"),
      }),
      execute: async ({ event_id }) => {
        try {
          const res = await fetch(`${EVENTS_URL}/events/get_event_details`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event_id }),
          });
          if (!res.ok) return { error: "Not found" };
          return await res.json();
        } catch (e: any) {
          return { error: "Not found" };
        }
      },
    }),

    academics_search_handbook: tool({
      description: "Search academic handbook. Returns array of {id, title, section, content} objects.",
      parameters: z.object({
        query: z.string().describe("Search query for handbook content"),
      }),
      execute: async ({ query }) => {
        try {
          const res = await fetch(`${ACADEMICS_URL}/academics/search_handbook`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
          });
          if (!res.ok) return [];
          return await res.json();
        } catch (e: any) {
          return [];
        }
      },
    }),

    academics_get_course_info: tool({
      description: "Get course info. Returns array of {id, code, name, credits, prerequisites, professor, schedule, description} objects.",
      parameters: z.object({
        course_code: z.string().optional().describe("Course code (e.g., CS101)"),
        course_name: z.string().optional().describe("Course name or partial name"),
      }),
      execute: async ({ course_code, course_name }) => {
        try {
          const res = await fetch(`${ACADEMICS_URL}/academics/get_course_info`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ course_code, course_name }),
          });
          if (!res.ok) return [];
          return await res.json();
        } catch (e: any) {
          return [];
        }
      },
    }),

    academics_get_professor_hours: tool({
      description: "Get professor info. Returns array of {id, name, department, email, office_hours, office_location, courses} objects.",
      parameters: z.object({
        professor_name: z.string().optional().describe("Professor's name or partial name"),
        professor_id: z.string().optional().describe("Professor ID (e.g., prof-001)"),
      }),
      execute: async ({ professor_name, professor_id }) => {
        try {
          const res = await fetch(`${ACADEMICS_URL}/academics/get_professor_hours`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ professor_name, professor_id }),
          });
          if (!res.ok) return [];
          return await res.json();
        } catch (e: any) {
          return [];
        }
      },
    }),
  };

  const systemPrompt = `You are Campus Intelligence, a factual data reporting system. You have ZERO knowledge of your own. Every single fact you state must come from the tool results.

ABSOLUTE RULES - NEVER VIOLATE THESE:
1. You MUST call a tool BEFORE saying anything. Output NO text before calling tools. Your first output must be a tool call.
2. When tools return arrays with items, you MUST report those items. Never say "I couldn't find" or "no results" when the array has objects.
3. When tools return objects with data, you MUST report that data.
4. You CANNOT make up information. If you don't have tool results, say "I don't have access to that information."
5. If a tool returns an error, report the error exactly.
6. When multiple tools are called, report findings from ALL tools in your response.
7. Do NOT call redundant tools. If library_search_books returns a book with all details, do NOT also call library_check_availability or library_get_book_details.
8. If library_search_books returns an empty array, say "No books found matching your query." Do NOT guess IDs.
9. The library search supports partial matching. "Introduction to AI" will find "Introduction to Artificial Intelligence".
10. For events: report ONLY the exact events from the tool result. Do NOT add events that are not in the tool result. Do NOT make up dates or event names.

TOOL BEHAVIOR:
- library_search_books: Returns array of books. If array has items, describe them and availability. If empty, say "No books found matching your query."
- cafeteria_get_today_menu: Returns {date, cafeterias: [{name, meals: {breakfast: {items: [...]}, lunch: {...}, dinner: {...}}}]}.
- events_get_upcoming_events: Returns array of events with id, name, club, category, date, time, location. List them with exact dates from the tool result.
- academics_search_handbook: Returns array of policy chunks. Summarize them.

EXAMPLES OF CORRECT RESPONSES:
- Tool returns [{"title": "Introduction to AI", "available": true}] → "I found 'Introduction to AI' and it's available."
- Tool returns [{"name": "AI Hackathon", "date": "2026-06-20"}] → "There's an AI Hackathon on June 20, 2026."
- Tool returns [] → "No results found in the database."
- Tool returns {cafeterias: [{name: "Main", meals: {lunch: {items: [{name: "Paneer"}]}}}]} → "Main Cafeteria has Paneer for lunch."

EXAMPLES OF INCORRECT RESPONSES (NEVER DO THESE):
- Tool returns books but you say "I couldn't find any books."
- Tool returns events but you say "There are no upcoming events."
- Tool returns cafeteria data but you say "I couldn't find the menu."
- You output text before calling a tool.
- You add events that are not in the tool results.`;

  const result = streamText({
    model: groq(modelId),
    system: systemPrompt,
    messages: await convertToCoreMessages(messages),
    tools: allTools,
    maxSteps: 5,
    toolChoice: "auto",
    onFinish: ({ text, toolCalls, toolResults }) => {
      // Log for debugging
      console.log("[AI] toolCalls:", toolCalls.length, "toolResults:", toolResults.length);
      console.log("[AI] text length:", text.length);
      
      // Check for contradictions
      const hasToolResults = toolResults.some(r => {
        const result = r.result;
        if (Array.isArray(result)) return result.length > 0;
        if (result && typeof result === "object") {
          return Object.keys(result).length > 0 && !result.error;
        }
        return false;
      });
      
      const hasContradiction = (text.includes("couldn't find") || text.includes("no results") || text.includes("not available") || text.includes("no events")) && hasToolResults;
      
      if (hasContradiction) {
        console.warn("[AI] HALLUCINATION DETECTED: LLM said 'not found' but tools returned data!");
      }
    },
  });

  return result.toDataStreamResponse();
  } catch (e: any) {
    console.error("[API] UNEXPECTED ERROR in /api/chat:", e.message, e.stack);
    return new Response(JSON.stringify({ error: "Internal server error: " + e.message }), { status: 500 });
  }
}
