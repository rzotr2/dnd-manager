
-- Update the characters table to support new field types and better theme support
-- Add new field types for textarea and other improvements
-- This will allow us to store more complex character data

-- First, let's add a new column to track the theme used for character generation
ALTER TABLE characters ADD COLUMN IF NOT EXISTS theme text DEFAULT 'theme-fantasy';

-- Update existing characters to have a default theme if they don't have one
UPDATE characters SET theme = 'theme-fantasy' WHERE theme IS NULL;
