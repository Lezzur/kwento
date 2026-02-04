-- Fix schema mismatches between app and database
-- Run this in Supabase SQL Editor

-- Fix connections table (rename source/target to source_id/target_id)
ALTER TABLE connections RENAME COLUMN source TO source_id;
ALTER TABLE connections RENAME COLUMN target TO target_id;

-- Fix canvas_elements table (add missing columns)
ALTER TABLE canvas_elements
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS content TEXT,
  ADD COLUMN IF NOT EXISTS custom_type_id TEXT,
  ADD COLUMN IF NOT EXISTS reference_id TEXT,
  ADD COLUMN IF NOT EXISTS size JSONB,
  ADD COLUMN IF NOT EXISTS color TEXT,
  ADD COLUMN IF NOT EXISTS layer TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Fix projects table (add missing columns)
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS synopsis TEXT,
  ADD COLUMN IF NOT EXISTS structure JSONB;

-- Fix characters table (add missing columns from TypeScript types)
ALTER TABLE characters
  ADD COLUMN IF NOT EXISTS physical_description TEXT,
  ADD COLUMN IF NOT EXISTS personality TEXT[], -- Array of strings
  ADD COLUMN IF NOT EXISTS motivations TEXT,
  ADD COLUMN IF NOT EXISTS relationships JSONB,
  ADD COLUMN IF NOT EXISTS arc TEXT,
  ADD COLUMN IF NOT EXISTS voice_notes TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS color TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Fix scenes table (add missing columns)
ALTER TABLE scenes
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS characters TEXT[], -- Array of character IDs
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS timeframe TEXT,
  ADD COLUMN IF NOT EXISTS conflict TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS "order" INTEGER, -- order is a reserved word, needs quotes
  ADD COLUMN IF NOT EXISTS act_or_chapter TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Fix plot_holes table
ALTER TABLE plot_holes
  ADD COLUMN IF NOT EXISTS related_elements TEXT[], -- Array of element IDs
  ADD COLUMN IF NOT EXISTS ai_suggestion TEXT;

-- Fix manuscripts table
ALTER TABLE manuscripts
  ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0;

-- Fix chapters table (add missing columns)
ALTER TABLE chapters
  ADD COLUMN IF NOT EXISTS project_id TEXT,
  ADD COLUMN IF NOT EXISTS start_position INTEGER,
  ADD COLUMN IF NOT EXISTS end_position INTEGER,
  ADD COLUMN IF NOT EXISTS status TEXT,
  ADD COLUMN IF NOT EXISTS linked_scenes TEXT[], -- Array of scene IDs
  ADD COLUMN IF NOT EXISTS seeds_total INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS seeds_addressed INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Fix writing_sessions table
ALTER TABLE writing_sessions
  ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS words_written INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_assistance_used BOOLEAN DEFAULT FALSE;

-- Fix story_seeds table (restructure to match TypeScript interface)
ALTER TABLE story_seeds
  ADD COLUMN IF NOT EXISTS project_id TEXT,
  ADD COLUMN IF NOT EXISTS chapter_id TEXT,
  ADD COLUMN IF NOT EXISTS type TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS source_element_id TEXT,
  ADD COLUMN IF NOT EXISTS position INTEGER,
  ADD COLUMN IF NOT EXISTS status TEXT,
  ADD COLUMN IF NOT EXISTS addressed_at TIMESTAMPTZ;

-- Fix custom_card_types table
ALTER TABLE custom_card_types
  ADD COLUMN IF NOT EXISTS layer TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Update indexes for renamed columns
DROP INDEX IF EXISTS idx_connections_source;
DROP INDEX IF EXISTS idx_connections_target;
CREATE INDEX IF NOT EXISTS idx_connections_source_id ON connections(source_id);
CREATE INDEX IF NOT EXISTS idx_connections_target_id ON connections(target_id);
CREATE INDEX IF NOT EXISTS idx_chapters_project_id ON chapters(project_id);
