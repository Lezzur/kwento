-- Run this in Supabase SQL Editor to verify schema matches the app structure
-- This checks that all required columns exist with correct data types

-- Projects table
SELECT 'projects' as table_name,
       array_agg(column_name || ':' || data_type ORDER BY ordinal_position) as columns
FROM information_schema.columns
WHERE table_name = 'projects' AND table_schema = 'public'
GROUP BY table_name;

-- Characters table
SELECT 'characters' as table_name,
       array_agg(column_name || ':' || data_type ORDER BY ordinal_position) as columns
FROM information_schema.columns
WHERE table_name = 'characters' AND table_schema = 'public'
GROUP BY table_name;

-- Scenes table
SELECT 'scenes' as table_name,
       array_agg(column_name || ':' || data_type ORDER BY ordinal_position) as columns
FROM information_schema.columns
WHERE table_name = 'scenes' AND table_schema = 'public'
GROUP BY table_name;

-- Canvas elements table
SELECT 'canvas_elements' as table_name,
       array_agg(column_name || ':' || data_type ORDER BY ordinal_position) as columns
FROM information_schema.columns
WHERE table_name = 'canvas_elements' AND table_schema = 'public'
GROUP BY table_name;

-- Connections table
SELECT 'connections' as table_name,
       array_agg(column_name || ':' || data_type ORDER BY ordinal_position) as columns
FROM information_schema.columns
WHERE table_name = 'connections' AND table_schema = 'public'
GROUP BY table_name;

-- Plot holes table
SELECT 'plot_holes' as table_name,
       array_agg(column_name || ':' || data_type ORDER BY ordinal_position) as columns
FROM information_schema.columns
WHERE table_name = 'plot_holes' AND table_schema = 'public'
GROUP BY table_name;

-- Conversations table
SELECT 'conversations' as table_name,
       array_agg(column_name || ':' || data_type ORDER BY ordinal_position) as columns
FROM information_schema.columns
WHERE table_name = 'conversations' AND table_schema = 'public'
GROUP BY table_name;

-- Manuscripts table
SELECT 'manuscripts' as table_name,
       array_agg(column_name || ':' || data_type ORDER BY ordinal_position) as columns
FROM information_schema.columns
WHERE table_name = 'manuscripts' AND table_schema = 'public'
GROUP BY table_name;

-- Chapters table
SELECT 'chapters' as table_name,
       array_agg(column_name || ':' || data_type ORDER BY ordinal_position) as columns
FROM information_schema.columns
WHERE table_name = 'chapters' AND table_schema = 'public'
GROUP BY table_name;

-- Writing sessions table
SELECT 'writing_sessions' as table_name,
       array_agg(column_name || ':' || data_type ORDER BY ordinal_position) as columns
FROM information_schema.columns
WHERE table_name = 'writing_sessions' AND table_schema = 'public'
GROUP BY table_name;

-- Story seeds table
SELECT 'story_seeds' as table_name,
       array_agg(column_name || ':' || data_type ORDER BY ordinal_position) as columns
FROM information_schema.columns
WHERE table_name = 'story_seeds' AND table_schema = 'public'
GROUP BY table_name;

-- Custom card types table
SELECT 'custom_card_types' as table_name,
       array_agg(column_name || ':' || data_type ORDER BY ordinal_position) as columns
FROM information_schema.columns
WHERE table_name = 'custom_card_types' AND table_schema = 'public'
GROUP BY table_name;
