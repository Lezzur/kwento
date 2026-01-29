-- Supabase Schema for Kwento
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  genre TEXT,
  target_word_count INTEGER,
  current_word_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  deleted BOOLEAN DEFAULT FALSE
);

-- Characters Table
CREATE TABLE IF NOT EXISTS characters (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  description TEXT,
  backstory TEXT,
  goals TEXT,
  traits TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  deleted BOOLEAN DEFAULT FALSE
);

-- Scenes Table
CREATE TABLE IF NOT EXISTS scenes (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  setting TEXT,
  characters TEXT,
  order_index INTEGER,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  deleted BOOLEAN DEFAULT FALSE
);

-- Canvas Elements Table
CREATE TABLE IF NOT EXISTS canvas_elements (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL,
  type TEXT NOT NULL,
  data JSONB,
  position JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  deleted BOOLEAN DEFAULT FALSE
);

-- Connections Table
CREATE TABLE IF NOT EXISTS connections (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL,
  source TEXT NOT NULL,
  target TEXT NOT NULL,
  type TEXT,
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  deleted BOOLEAN DEFAULT FALSE
);

-- Plot Holes Table
CREATE TABLE IF NOT EXISTS plot_holes (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  related_elements TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  deleted BOOLEAN DEFAULT FALSE
);

-- Conversations Table (AI Assistant)
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  deleted BOOLEAN DEFAULT FALSE
);

-- Manuscripts Table
CREATE TABLE IF NOT EXISTS manuscripts (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  format TEXT DEFAULT 'manuscript',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  deleted BOOLEAN DEFAULT FALSE
);

-- Chapters Table
CREATE TABLE IF NOT EXISTS chapters (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  manuscript_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  order_index INTEGER,
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  deleted BOOLEAN DEFAULT FALSE
);

-- Writing Sessions Table
CREATE TABLE IF NOT EXISTS writing_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL,
  chapter_id TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  word_count INTEGER DEFAULT 0,
  duration INTEGER DEFAULT 0,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  deleted BOOLEAN DEFAULT FALSE
);

-- Story Seeds Table
CREATE TABLE IF NOT EXISTS story_seeds (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  genre TEXT,
  themes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  deleted BOOLEAN DEFAULT FALSE
);

-- Custom Card Types Table
CREATE TABLE IF NOT EXISTS custom_card_types (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  fields JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  deleted BOOLEAN DEFAULT FALSE
);

-- Row Level Security (RLS) Policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvas_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE plot_holes ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE manuscripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_seeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_card_types ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all tables
-- Projects
CREATE POLICY "Users can view their own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Characters
CREATE POLICY "Users can view their own characters" ON characters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own characters" ON characters FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own characters" ON characters FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own characters" ON characters FOR DELETE USING (auth.uid() = user_id);

-- Scenes
CREATE POLICY "Users can view their own scenes" ON scenes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own scenes" ON scenes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own scenes" ON scenes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own scenes" ON scenes FOR DELETE USING (auth.uid() = user_id);

-- Canvas Elements
CREATE POLICY "Users can view their own canvas_elements" ON canvas_elements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own canvas_elements" ON canvas_elements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own canvas_elements" ON canvas_elements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own canvas_elements" ON canvas_elements FOR DELETE USING (auth.uid() = user_id);

-- Connections
CREATE POLICY "Users can view their own connections" ON connections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own connections" ON connections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own connections" ON connections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own connections" ON connections FOR DELETE USING (auth.uid() = user_id);

-- Plot Holes
CREATE POLICY "Users can view their own plot_holes" ON plot_holes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own plot_holes" ON plot_holes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own plot_holes" ON plot_holes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own plot_holes" ON plot_holes FOR DELETE USING (auth.uid() = user_id);

-- Conversations
CREATE POLICY "Users can view their own conversations" ON conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own conversations" ON conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own conversations" ON conversations FOR DELETE USING (auth.uid() = user_id);

-- Manuscripts
CREATE POLICY "Users can view their own manuscripts" ON manuscripts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own manuscripts" ON manuscripts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own manuscripts" ON manuscripts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own manuscripts" ON manuscripts FOR DELETE USING (auth.uid() = user_id);

-- Chapters
CREATE POLICY "Users can view their own chapters" ON chapters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own chapters" ON chapters FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own chapters" ON chapters FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own chapters" ON chapters FOR DELETE USING (auth.uid() = user_id);

-- Writing Sessions
CREATE POLICY "Users can view their own writing_sessions" ON writing_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own writing_sessions" ON writing_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own writing_sessions" ON writing_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own writing_sessions" ON writing_sessions FOR DELETE USING (auth.uid() = user_id);

-- Story Seeds
CREATE POLICY "Users can view their own story_seeds" ON story_seeds FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own story_seeds" ON story_seeds FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own story_seeds" ON story_seeds FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own story_seeds" ON story_seeds FOR DELETE USING (auth.uid() = user_id);

-- Custom Card Types
CREATE POLICY "Users can view their own custom_card_types" ON custom_card_types FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own custom_card_types" ON custom_card_types FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own custom_card_types" ON custom_card_types FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own custom_card_types" ON custom_card_types FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_project_id ON characters(project_id);
CREATE INDEX IF NOT EXISTS idx_scenes_user_id ON scenes(user_id);
CREATE INDEX IF NOT EXISTS idx_scenes_project_id ON scenes(project_id);
CREATE INDEX IF NOT EXISTS idx_canvas_elements_user_id ON canvas_elements(user_id);
CREATE INDEX IF NOT EXISTS idx_canvas_elements_project_id ON canvas_elements(project_id);
CREATE INDEX IF NOT EXISTS idx_connections_user_id ON connections(user_id);
CREATE INDEX IF NOT EXISTS idx_connections_project_id ON connections(project_id);
CREATE INDEX IF NOT EXISTS idx_plot_holes_user_id ON plot_holes(user_id);
CREATE INDEX IF NOT EXISTS idx_plot_holes_project_id ON plot_holes(project_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_project_id ON conversations(project_id);
CREATE INDEX IF NOT EXISTS idx_manuscripts_user_id ON manuscripts(user_id);
CREATE INDEX IF NOT EXISTS idx_manuscripts_project_id ON manuscripts(project_id);
CREATE INDEX IF NOT EXISTS idx_chapters_user_id ON chapters(user_id);
CREATE INDEX IF NOT EXISTS idx_chapters_manuscript_id ON chapters(manuscript_id);
CREATE INDEX IF NOT EXISTS idx_writing_sessions_user_id ON writing_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_writing_sessions_project_id ON writing_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_story_seeds_user_id ON story_seeds(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_card_types_user_id ON custom_card_types(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_card_types_project_id ON custom_card_types(project_id);
