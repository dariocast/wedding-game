-- AlterTable
ALTER TABLE "public"."tasks" ADD COLUMN "title" TEXT;

-- Update existing records to copy description to title
UPDATE "public"."tasks" SET "title" = "description";

-- Make title NOT NULL after copying data
ALTER TABLE "public"."tasks" ALTER COLUMN "title" SET NOT NULL;
