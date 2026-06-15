# Campus Intelligence — Unified AI Dashboard

A Unified Campus Intelligence Dashboard with an embedded AI Assistant that dynamically routes student queries to independent data source servers. Data is fetched live from each source — no central database, no brittle scrapers.

**🚀 Live Demo: [https://campus-intelligence-z5we-nu.vercel.app](https://campus-intelligence-z5we-nu.vercel.app)**

> ⚠️ **Groq Rate Limit Note:** This app uses the Groq free tier (`llama-3.1-8b-instant`), which is limited to **6K tokens/minute (~2 requests/minute)**. If the AI takes 30–60 seconds to respond or seems unresponsive, it is due to Groq's free-tier rate limiting — **not a backend issue**. Please wait a minute between queries if you hit the limit.

---

## Problem Statement

College campuses have data scattered everywhere: the library uses one legacy portal, the cafeteria menu is a PDF on a website, club events are on Google Calendars, and academic handbooks are massive PDFs. Students waste time digging through 5 different systems just to find out if a book is available or what time a tech fest workshop starts.

## Solution

Build a Unified Web Dashboard featuring an embedded AI Assistant. Instead of building massive, brittle web scrapers that dump everything into one giant database, we built independent **MCP-style data servers** for each campus data source. The AI dynamically queries these servers in real-time based on what the student asks.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 15)                     │
│  • Next.js App Router + TypeScript + Tailwind + shadcn/ui  │
│  • Vercel AI SDK (@ai-sdk/react) with streaming chat       │
│  • Tool-specific React components (BookCard, MenuCard, etc)│
│  • Deployed on: Vercel                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              AI ORCHESTRATOR (Next.js API Route)            │
│  • POST /api/chat                                            │
│  • Groq LLM (Llama 3.3-70b-versatile) via AI SDK            │
│  • 12 tools defined with Zod schemas, each calling         │
│    a dedicated Python microservice via HTTP                  │
│  • streamText() + dynamic tool registry + multi-step         │
│  • Returns DataStreamResponse (SSE streaming)               │
│  • Deployed on: Vercel (same as frontend)                  │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │ MCP Server  │    │ MCP Server  │    │ MCP Server  │
   │  Library    │    │  Cafeteria  │    │   Events    │
   │  :8001      │    │  :8002      │    │  :8003      │
   │  Python     │    │  Python     │    │  Python     │
   │  FastAPI    │    │  FastAPI    │    │  FastAPI    │
   └─────────────┘    └─────────────┘    └─────────────┘
          │
          ▼
   ┌─────────────┐
   │ MCP Server  │
   │  Academics  │
   │  :8004      │
   │  Python     │
   │  FastAPI    │
   └─────────────┘
```

## Key Features

- **4 Independent Data Servers** for distinct campus data sources (Library, Cafeteria, Events, Academics)
- **AI Assistant** that routes natural-language queries to the appropriate server(s) in real-time via Groq Llama 3.3
- **Unified Dashboard UI** that surfaces results from multiple sources in one view with custom tool cards
- **No single giant database** — data is fetched live from each source server
- **Streaming Chat Interface** with real-time tool call visualization and progress indicators
- **Rich Mock Data** simulating a realistic campus environment (20 books, 7-day menus, 12 events, 20 handbook entries, 15 courses, 10 professors)
- **Multi-tool Queries** — single question can trigger multiple servers simultaneously (e.g., "What's happening today and what should I eat?")
- **Tool-specific Cards** — library books, cafeteria menus, events, and academic info each render in custom React components

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui |
| Frontend AI SDK | `ai`, `@ai-sdk/react`, `@ai-sdk/openai` |
| LLM | Groq API — `llama-3.1-8b-instant` (free tier, 6K tokens/min) |
| AI Orchestrator | Next.js API Route (`/api/chat`) with `streamText()` + `tool()` |
| Tool Schemas | Zod |
| Data Servers | Python, FastAPI, Pydantic |
| Mock Data | Rich JSON files per server |
| Deployment | Vercel (frontend), Render/Railway (4 data servers) |

## Project Structure

```
campus-intelligence/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Dashboard home with chat
│   │   ├── layout.tsx                  # Root layout
│   │   ├── api/chat/route.ts           # AI orchestrator (12 tools calling Python servers)
│   │   └── globals.css
│   ├── components/
│   │   ├── chat/                       # Chat interface, message list, input, streaming indicator
│   │   ├── tools/                      # Tool cards: BookCard, MenuCard, EventCard, CourseCard
│   │   └── dashboard/                  # Sidebar, Header, QuickStats
│   └── lib/                           # Groq provider config, utilities
├── mcp-servers/
│   ├── mcp-library/                   # 20 books, 3 endpoints, FastAPI
│   ├── mcp-cafeteria/                 # 7-day menus, 2 cafeterias, 3 endpoints, FastAPI
│   ├── mcp-events/                    # 12 events, 3 endpoints, FastAPI
│   └── mcp-academics/                 # 20 handbook chunks, 15 courses, 10 professors, 3 endpoints, FastAPI
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+ and pip
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone and Install Frontend

```bash
git clone https://github.com/your-username/campus-intelligence.git
cd campus-intelligence
npm install
```

### 2. Set Environment Variables

```bash
cp .env.local.example .env.local
# Edit .env.local and add your GROQ_API_KEY
```

### 3. Start Data Servers (4 terminals)

```bash
cd mcp-servers/mcp-library
pip install -r requirements.txt
python -m uvicorn server:app --host 0.0.0.0 --port 8001

cd mcp-servers/mcp-cafeteria
pip install -r requirements.txt
python -m uvicorn server:app --host 0.0.0.0 --port 8002

cd mcp-servers/mcp-events
pip install -r requirements.txt
python -m uvicorn server:app --host 0.0.0.0 --port 8003

cd mcp-servers/mcp-academics
pip install -r requirements.txt
python -m uvicorn server:app --host 0.0.0.0 --port 8004
```

### 4. Start Frontend

```bash
npm run dev
# Open http://localhost:3000
```


**Note:** The app includes all campus data (library, cafeteria, events, academics) built-in. No external servers or databases required!

## API Reference

### Library Server (`:8001`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/library/search_books` | POST | Search by title, author, ISBN, genre |
| `/library/check_availability` | POST | Check availability by book ID |
| `/library/get_book_details` | POST | Full book details including location |
| `/health` | GET | Server health status |

### Cafeteria Server (`:8002`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/cafeteria/get_today_menu` | POST | Today's menu for a cafeteria |
| `/cafeteria/get_weekly_menu` | POST | Full weekly menu |
| `/cafeteria/get_nutrition_info` | POST | Nutrition info for a food item |
| `/health` | GET | Server health status |

### Events Server (`:8003`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/events/get_upcoming_events` | POST | Upcoming events in next N days |
| `/events/search_events` | POST | Search events by name, club, description |
| `/events/get_event_details` | POST | Full event details by ID |
| `/health` | GET | Server health status |

### Academics Server (`:8004`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/academics/search_handbook` | POST | Search handbook policies |
| `/academics/get_course_info` | POST | Course info by code or name |
| `/academics/get_professor_hours` | POST | Professor office hours and contact |
| `/health` | GET | Server health status |

## LLM Tools Reference

The AI orchestrator registers 12 tools with the Groq LLM:

| Tool | Server | Description |
|------|--------|-------------|
| `library_search_books` | Library | Search by title, author, ISBN, genre |
| `library_check_availability` | Library | Check availability by book ID |
| `library_get_book_details` | Library | Full book details including location |
| `cafeteria_get_today_menu` | Cafeteria | Today's menu for a cafeteria |
| `cafeteria_get_weekly_menu` | Cafeteria | Full weekly menu |
| `cafeteria_get_nutrition_info` | Cafeteria | Nutrition info for a food item |
| `events_get_upcoming_events` | Events | Upcoming events in next N days |
| `events_search_events` | Events | Search events by name, club, description |
| `events_get_event_details` | Events | Full event details by ID |
| `academics_search_handbook` | Academics | Search handbook policies |
| `academics_get_course_info` | Academics | Course info by code or name |
| `academics_get_professor_hours` | Academics | Professor office hours and contact |

## License

MIT License — feel free to use and adapt for your campus.


