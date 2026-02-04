-- Run this in Supabase SQL Editor to verify your schema

-- Check if canvas_elements table exists and see its columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'canvas_elements'
ORDER BY ordinal_position;

-- Check all tables in public schema
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
