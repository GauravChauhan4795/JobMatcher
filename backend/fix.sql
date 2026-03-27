-- Add skills column to Job table
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "skills" TEXT[] NOT NULL DEFAULT '{}';

-- Fix Resume: rename "Skills" to "skills" if old column exists (case-sensitive in Postgres)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Resume' AND column_name = 'Skills'
  ) THEN
    ALTER TABLE "Resume" RENAME COLUMN "Skills" TO "skills";
  END IF;

  -- Add skills column if it doesn't exist at all
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Resume' AND column_name = 'skills'
  ) THEN
    ALTER TABLE "Resume" ADD COLUMN "skills" TEXT[] NOT NULL DEFAULT '{}';
  END IF;

  -- Add content column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Resume' AND column_name = 'content'
  ) THEN
    ALTER TABLE "Resume" ADD COLUMN "content" TEXT NOT NULL DEFAULT '';
  END IF;

  -- Make raw_text nullable if not already
  ALTER TABLE "Resume" ALTER COLUMN "raw_text" DROP NOT NULL;
END $$;