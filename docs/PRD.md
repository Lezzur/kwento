# Kwento - Product Requirements Document

> **Version**: 1.0
> **Last Updated**: 2026-01-28
> **Status**: Discovery Complete - Ready for Implementation

---

## 1. Project Overview

### 1.1 Vision
**Kwento** is an AI-powered story development workspace that helps writers extract fragmented ideas from their minds and transform them into well-structured, polished story plans.

### 1.2 Tagline
*"Get your stories out of your head."*

### 1.3 Problem Statement
Writers often have:
- Fragmented ideas, scenes, and concepts scattered in their minds
- Difficulty organizing non-linear thoughts into coherent narratives
- No clear way to visualize how story elements connect
- Plot holes they can't see until deep into writing
- Inconsistent characters due to lack of documentation

### 1.4 Solution
Kwento provides:
- **AI Conversation** that extracts and structures unorganized thoughts
- **Visual Story Canvas** with layered views (characters, plots, timeline)
- **Character Bible** for consistent, developed characters
- **Plot Hole Detection** that catches issues early
- **Structured Output** that guides the actual writing process

### 1.5 Core Value Proposition
> "Messy ideas in → Polished story plan out"

---

## 2. Target Users

### 2.1 Primary Persona: "The Daydreamer"
- **Who**: Amateur writer with vivid imagination
- **Problem**: Has scenes, characters, ideas swirling in their head but struggles to organize them
- **Goal**: Turn mental fragments into a writable story
- **Behavior**: Writes in bursts, gets stuck on structure, abandons projects
- **Tech Comfort**: Moderate - uses apps but not a power user

### 2.2 Secondary Persona: "The Structured Plotter"
- **Who**: Experienced writer who outlines before writing
- **Problem**: Current tools (docs, spreadsheets) are tedious
- **Goal**: Faster, more visual outlining with AI assistance
- **Behavior**: Methodical, wants control, appreciates efficiency

### 2.3 Tertiary Personas (v2+)
- **Game Writer**: Needs branching narrative visualization
- **Screenwriter**: Needs script-friendly structure and export

---

## 3. Feature Specifications

### 3.1 MVP Features (v1)

#### 3.1.1 AI Conversation Interface
**Purpose**: Extract and structure ideas through collaborative dialogue.

| Aspect | Specification |
|--------|---------------|
| **Entry Point** | User chooses: "New Story" or "Continue Story" |
| **Style** | Primarily collaborator, adaptive based on user needs |
| **Processing** | Organize input first, then ask clarifying questions |
| **Suggestions** | Primarily explores via questions; secondary gentle suggestions ("How about...", "What if...", "Have you considered...") |
| **Genre Awareness** | Adapts suggestions based on story genre (fantasy, mystery, romance, thriller, etc.) |

**Conversation Flow**:
```
User dumps ideas → AI organizes into elements → AI asks clarifying questions →
Elements added to canvas → Repeat until user satisfied
```

**AI Behaviors**:
- Identify characters, scenes, conflicts, settings from unstructured input
- Ask questions that reveal the story (not interrogate)
- Offer suggestions only when invited or when user seems stuck
- Recognize genre and adapt vocabulary/suggestions accordingly

#### 3.1.2 Visual Story Canvas
**Purpose**: Visualize and manipulate story elements spatially.

| Aspect | Specification |
|--------|---------------|
| **Card Types** | Scene, Character, Location, Plot Point, Idea/Note, Chapter/Act, Conflict, Theme |
| **Layout** | Freeform (user places anywhere) with "Clean Up" auto-arrange option |
| **Connections** | User-created with custom labels; system provides example labels |
| **Layers** | Toggleable layers by element type (Characters, Plots, Scenes, Timeline, etc.) |

**Connection Examples** (suggested, not enforced):
- "leads to" (sequence)
- "involves" (character ↔ scene)
- "conflicts with"
- "reveals"
- "foreshadows"
- Custom labels allowed

**Layer System**:
- Toggle visibility: Characters only, Plot only, Timeline view, etc.
- Helps visualize how elements of one type interact
- Timeline layer shows chronological sequence

#### 3.1.3 Character Profiles
**Purpose**: Maintain consistent, developed characters.

| Field | Required | Description |
|-------|----------|-------------|
| Name | Yes | Character name |
| Role | Yes | Protagonist, Antagonist, Supporting, Minor |
| Physical Description | No | Appearance details |
| Personality Traits | No | Key characteristics |
| Backstory | No | History before story begins |
| Goals & Motivations | Yes | What they want, why |
| Relationships | No | Links to other characters |
| Character Arc | No | How they change through story |
| Voice/Speech Patterns | No | How they talk |
| Notes | No | Freeform additional info |

**Features**:
- Auto-link characters to scenes they appear in
- Relationship map visualization
- AI can reference character details for consistency

#### 3.1.4 Story Structure Support
**Purpose**: Help users structure their narrative.

| Feature | Description |
|---------|-------------|
| **Templates** | 3-Act, 5-Act, Hero's Journey, Save the Cat, Custom |
| **AI Suggestion** | Can recommend structure based on story elements |
| **Flexible** | User can modify or ignore templates |
| **Beat Tracking** | Shows which story beats are filled vs missing |

#### 3.1.5 Plot Hole Detection
**Purpose**: Catch story inconsistencies early.

| Mode | Description |
|------|-------------|
| **Automatic** | AI flags potential issues as they emerge |
| **Manual** | "Check Story" button for full analysis |
| **Gentle** | Asks questions rather than blunt warnings |

**Plot Hole List**:
- Stored as actionable items
- User can: Address, Ignore, or Dismiss
- Persists until resolved or ignored
- Examples: Timeline conflicts, character inconsistencies, unresolved threads

#### 3.1.6 Project Management
**Purpose**: Organize multiple stories.

| Feature | Description |
|---------|-------------|
| **Multiple Projects** | User can have multiple stories |
| **Project Dashboard** | List view with last edited, progress |
| **Quick Switch** | Easy navigation between projects |

#### 3.1.7 Export
**Purpose**: Output usable story plans.

| Format | Priority | Notes |
|--------|----------|-------|
| .docx | P0 | Primary format for most users |
| PDF | P0 | Universal sharing |
| Markdown | P1 | Developer/tech-savvy users |
| Final Draft (.fdx) | P2 | Screenwriters |
| Plain Text | P2 | Maximum compatibility |
| Scrivener (.scriv) | P3 | Novel writers |

**Export Contents**:
- Full story outline
- Character sheets
- Scene breakdown
- Visual map as image
- **Default**: Separate files in ZIP
- **Optional**: Combined single document

#### 3.1.8 Local Storage
**Purpose**: Data ownership, offline capability.

| Aspect | Specification |
|--------|---------------|
| **Technology** | IndexedDB via Dexie.js |
| **Offline** | Full functionality without internet (except AI) |
| **Data Location** | Browser storage, user's device |

---

### 3.2 Post-MVP Features (v1.5)

| Feature | Description |
|---------|-------------|
| **Cloud Sync** | Backup to Supabase, multi-device access |
| **Timeline View** | Dedicated chronological visualization |
| **Plot Templates** | Pre-built story structure templates |
| **Settings/World Bible** | Location and world-building documentation |

---

### 3.3 Future Features (v2)

| Feature | Description |
|---------|-------------|
| **AI Character Portraits** | Generate character visuals from descriptions |
| **Fine-tuned AI Model** | Specialized story extraction model |
| **Branch Visualization** | Choose-your-own-adventure story mapping |
| **Collaboration** | Multiple users on same project |
| **Advanced World-Building** | Magic systems, timelines, maps |
| **Mobile App** | React Native version |

---

## 4. User Flows

### 4.1 New User Flow
```
Landing Page → Sign Up (optional, can use locally) →
Quick Walkthrough (3-5 screens) → Create First Project →
AI asks opening question → User starts sharing ideas
```

### 4.2 New Story Flow
```
Dashboard → "New Story" → Enter title, select genre (optional) →
Empty canvas + AI chat opens → AI: "What's the story that's been on your mind?" →
User shares ideas → AI organizes + asks questions → Elements appear on canvas →
User can drag/arrange/connect → Continue until satisfied
```

### 4.3 Returning User Flow
```
Dashboard → Select existing project →
Canvas loads with previous state → AI: "Welcome back. Last time we were working on [X]. Want to continue, or explore something else?" →
User continues development
```

### 4.4 Export Flow
```
Project → Export button → Select format(s) → Select contents →
Choose: Separate files / Combined → Download ZIP or file
```

---

## 5. Data Models

### 5.1 Project
```typescript
interface Project {
  id: string
  title: string
  genre?: Genre
  createdAt: Date
  updatedAt: Date
  synopsis?: string
  structure?: StoryStructure
  settings: ProjectSettings
}

type Genre =
  | 'fantasy' | 'sci-fi' | 'mystery' | 'thriller'
  | 'romance' | 'horror' | 'literary' | 'historical'
  | 'adventure' | 'comedy' | 'drama' | 'other'
```

### 5.2 Character
```typescript
interface Character {
  id: string
  projectId: string
  name: string
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor'
  physicalDescription?: string
  personality?: string[]
  backstory?: string
  goals?: string
  motivations?: string
  relationships?: Relationship[]
  arc?: string
  voiceNotes?: string
  notes?: string
  color?: string // For canvas visualization
  createdAt: Date
  updatedAt: Date
}

interface Relationship {
  characterId: string
  type: string // "friend", "enemy", "family", custom
  description?: string
}
```

### 5.3 Scene
```typescript
interface Scene {
  id: string
  projectId: string
  title: string
  summary: string
  characters: string[] // Character IDs
  location?: string
  timeframe?: string
  conflict?: string
  notes?: string
  order?: number // For timeline
  actOrChapter?: string
  createdAt: Date
  updatedAt: Date
}
```

### 5.4 Canvas Element
```typescript
interface CanvasElement {
  id: string
  projectId: string
  type: ElementType
  referenceId?: string // Links to Character, Scene, etc.
  title: string
  content?: string
  position: { x: number; y: number }
  size?: { width: number; height: number }
  color?: string
  layer: Layer
  createdAt: Date
  updatedAt: Date
}

type ElementType =
  | 'scene' | 'character' | 'location' | 'plot-point'
  | 'idea' | 'chapter' | 'conflict' | 'theme' | 'note'

type Layer =
  | 'characters' | 'scenes' | 'plot' | 'timeline'
  | 'locations' | 'themes' | 'all'
```

### 5.5 Connection
```typescript
interface Connection {
  id: string
  projectId: string
  sourceId: string // CanvasElement ID
  targetId: string // CanvasElement ID
  label?: string
  type?: string // "leads-to", "involves", custom
  createdAt: Date
}
```

### 5.6 Plot Hole
```typescript
interface PlotHole {
  id: string
  projectId: string
  description: string
  severity: 'minor' | 'moderate' | 'major'
  relatedElements: string[] // Element IDs
  status: 'open' | 'resolved' | 'ignored'
  aiSuggestion?: string
  createdAt: Date
  resolvedAt?: Date
}
```

### 5.7 Conversation
```typescript
interface Conversation {
  id: string
  projectId: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  extractedElements?: string[] // Elements created from this message
}
```

---

## 6. Technical Architecture

### 6.1 Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | Next.js 14+ (App Router) | SSR, API routes, future mobile compatibility |
| **Language** | TypeScript | Type safety, better DX |
| **Styling** | Tailwind CSS | Fast iteration, utility-first |
| **Canvas** | React Flow | Built for node-based UIs, drag-drop, connections |
| **State Management** | Zustand | Simple, works well with local-first |
| **Local Storage** | Dexie.js (IndexedDB) | Large data support, offline-first |
| **Cloud Sync** | Supabase | Postgres + Auth + Realtime (v1.5) |
| **AI** | Claude API / OpenAI API | Conversation, analysis |
| **Export** | docx: docx.js, PDF: react-pdf | Document generation |

### 6.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Canvas    │  │    Chat     │  │  Sidebar    │     │
│  │ (React Flow)│  │  Interface  │  │ (Elements)  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                         │                               │
│  ┌──────────────────────┴───────────────────────┐      │
│  │              Zustand Store                    │      │
│  │  (Projects, Elements, Connections, UI State) │      │
│  └──────────────────────┬───────────────────────┘      │
└─────────────────────────┼───────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
         ▼                ▼                ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Dexie.js   │  │  Next.js    │  │  Supabase   │
│ (IndexedDB) │  │ API Routes  │  │  (v1.5)     │
│  Local-First│  │             │  │  Cloud Sync │
└─────────────┘  └──────┬──────┘  └─────────────┘
                        │
                        ▼
               ┌─────────────┐
               │  AI API     │
               │ (Claude/    │
               │  OpenAI)    │
               └─────────────┘
```

### 6.3 Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Local-first** | Yes | Data ownership, offline capability, faster UX |
| **AI API** | External (Claude/OpenAI) | Faster to market, no ML infrastructure |
| **Canvas Library** | React Flow | Battle-tested, customizable, good docs |
| **Database** | IndexedDB + Supabase | Local speed + cloud backup |

---

## 7. UI/UX Guidelines

### 7.1 Design Principles

1. **Get out of the way**: The story is the star, not the UI
2. **Progressive disclosure**: Show basics first, advanced on demand
3. **Instant feedback**: Every action should feel responsive
4. **Forgiving**: Easy undo, nothing permanently destructive
5. **Cozy, not sterile**: Warm, inviting, low-pressure environment

### 7.2 Color Palette

#### Dark Mode (Default)
| Token | Color | Hex | Usage |
|-------|-------|-----|-------|
| `--bg-primary` | Warm Charcoal | `#1C1917` | Main background |
| `--bg-secondary` | Warm Dark Gray | `#292524` | Cards, panels |
| `--bg-tertiary` | Stone | `#44403C` | Canvas elements |
| `--text-primary` | Warm White | `#FAFAF9` | Headings, primary text |
| `--text-secondary` | Stone Gray | `#A8A29E` | Secondary text |
| `--accent-primary` | Amber Gold | `#F59E0B` | Primary actions, highlights |
| `--accent-secondary` | Terracotta | `#EA580C` | Secondary accent |
| `--success` | Sage Green | `#84CC16` | Success states |
| `--warning` | Warm Yellow | `#FACC15` | Warnings |
| `--error` | Soft Red | `#EF4444` | Errors |

#### Light Mode (Optional)
| Token | Color | Hex | Usage |
|-------|-------|-----|-------|
| `--bg-primary` | Warm Cream | `#FFFBEB` | Main background |
| `--bg-secondary` | Soft White | `#FEFCE8` | Cards, panels |
| `--text-primary` | Warm Black | `#1C1917` | Headings, primary text |
| `--accent-primary` | Deep Amber | `#D97706` | Primary actions |

### 7.3 Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Headings | Inter or System | 24-32px | 600-700 |
| Body | Inter or System | 14-16px | 400 |
| UI Labels | Inter or System | 12-14px | 500 |
| Chat Messages | Inter or System | 15px | 400 |

### 7.4 Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  Header: Project Title, Settings, Export, Theme Toggle  │
├────────────┬────────────────────────────┬───────────────┤
│            │                            │               │
│  Sidebar   │      Canvas Area           │   AI Chat     │
│            │                            │   Panel       │
│ - Layers   │   [Freeform card space]    │               │
│ - Elements │                            │  [Messages]   │
│ - Plothole │                            │               │
│   List     │                            │  [Input]      │
│            │                            │               │
├────────────┴────────────────────────────┴───────────────┤
│  Optional: Timeline strip (collapsible)                 │
└─────────────────────────────────────────────────────────┘
```

### 7.5 Interaction Patterns

| Action | Interaction |
|--------|-------------|
| Create element | Double-click canvas OR drag from sidebar |
| Connect elements | Drag from node handle to another element |
| Edit element | Click to select, panel opens OR double-click for inline |
| Delete element | Select + Delete key OR right-click menu |
| Pan canvas | Middle-click drag OR spacebar + drag |
| Zoom | Scroll wheel OR pinch |
| Multi-select | Shift + click OR drag selection box |
| Undo/Redo | Ctrl+Z / Ctrl+Shift+Z |

### 7.6 Theme Options

| Theme | Mood | When to Use |
|-------|------|-------------|
| **Cozy** (default) | Warm, inviting, low-pressure | General use |
| **Professional** | Clean, focused, minimal | Serious work sessions |
| **Playful** | Colorful, energetic | Creative brainstorming |

---

## 8. Monetization Strategy

### 8.1 Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 2 projects, 50 AI calls/month, local storage only, basic export |
| **Pro** | $9/month | Unlimited projects, 500 AI calls/month, cloud sync, all export formats, priority support |
| **Lifetime** | $129 (launch special) | Same as Pro, forever, limited availability |

### 8.2 Launch Strategy

1. **Soft Launch**: Free tier only, gather feedback
2. **Pro Launch**: Introduce paid tier after validation
3. **Lifetime Deal**: Limited window (first 100 users or 30 days)
4. **Transition**: After lifetime window, subscription only

---

## 9. Success Metrics

### 9.1 MVP Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| **User Activation** | 50% create first project | Analytics |
| **Engagement** | 3+ sessions per user | Session tracking |
| **Completion** | 30% export a story plan | Export events |
| **Retention** | 40% return within 7 days | Cohort analysis |

### 9.2 Business Metrics (Post-Launch)

| Metric | Target |
|--------|--------|
| Free → Pro Conversion | 5-10% |
| Monthly Churn (Pro) | < 8% |
| NPS Score | > 40 |

---

## 10. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| AI API costs exceed revenue | High | Medium | Usage limits, efficient prompting, caching |
| React Flow performance with large canvases | Medium | Medium | Virtualization, element limits, optimization |
| User data loss (local storage) | High | Low | Auto-save, export reminders, cloud sync (v1.5) |
| AI generates inappropriate content | Medium | Low | Content filtering, user reporting |
| Competition from established tools | Medium | High | Focus on extraction niche, superior UX |

---

## 11. Open Questions

| Question | Impact | Decision Needed By |
|----------|--------|-------------------|
| Which AI provider to start with? (Claude vs OpenAI) | Medium | Before development |
| Domain name availability for "Kwento" | Low | Before launch |
| Mobile-first or desktop-first design? | High | Before UI development |
| Should AI chat be persistent or session-based? | Medium | Before AI implementation |

---

## 12. Implementation Roadmap

### Phase 1: Foundation (MVP Core)
- [ ] Project setup (Next.js, Tailwind, TypeScript)
- [ ] Local storage with Dexie.js
- [ ] Basic canvas with React Flow
- [ ] Element CRUD (create, read, update, delete)
- [ ] Connection system

### Phase 2: AI Integration
- [ ] AI chat interface
- [ ] Conversation storage
- [ ] Element extraction from conversation
- [ ] Genre-aware prompting

### Phase 3: Story Features
- [ ] Character profiles
- [ ] Story structure templates
- [ ] Plot hole detection (basic)
- [ ] Layer system

### Phase 4: Polish & Export
- [ ] Export (docx, PDF, Markdown)
- [ ] Onboarding walkthrough
- [ ] Theme system (dark/light, moods)
- [ ] Clean-up auto-layout

### Phase 5: Launch Prep
- [ ] Landing page
- [ ] Error handling & edge cases
- [ ] Performance optimization
- [ ] Analytics integration

---

## 13. Appendix

### A. Competitive Landscape

| Tool | Strengths | Weaknesses | Kwento Differentiator |
|------|-----------|------------|----------------------|
| **Notion** | Flexible, popular | Not story-focused, no AI extraction | Purpose-built for stories |
| **Scrivener** | Industry standard | Desktop-only, steep learning curve, no AI | Web-based, AI-powered |
| **Campfire** | Story-focused | Complex, expensive | Simpler, conversation-first |
| **Sudowrite** | AI writing | Writes FOR you, not WITH you | Extraction, not generation |
| **Miro/FigJam** | Visual canvas | General purpose, no story features | Story-specific elements |

### B. AI Prompt Philosophy

Kwento's AI should:
1. **Extract, not invent**: Pull ideas FROM the user, not inject its own
2. **Question, not lecture**: Use questions to guide, not explanations
3. **Organize, not overwhelm**: Structure input incrementally
4. **Suggest gently**: "What if..." not "You should..."
5. **Remember context**: Reference earlier parts of conversation

### C. Sample AI Interactions

**Opening:**
> "Hey! What's the story that's been brewing in your mind? Just share whatever comes to you - scenes, characters, vibes, anything."

**After brain dump:**
> "I'm seeing some interesting threads here. Let me organize what I'm picking up:
> - A character who [X]
> - A setting that feels like [Y]
> - Some tension around [Z]
>
> Did I catch that right? And I'm curious - what's the feeling you want readers to have?"

**Gentle suggestion:**
> "You mentioned she's torn between two worlds. Have you considered what happens if she's forced to choose? What would she lose either way?"

---

*End of PRD*
