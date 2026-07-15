DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Parts'
      AND column_name = 'image'
      AND udt_name = '_text'
  ) THEN
    CREATE OR REPLACE FUNCTION public.__tmp_text_array_to_jsonb_array(input_text_array text[])
    RETURNS jsonb[]
    LANGUAGE sql
    IMMUTABLE
    AS $fn$
      SELECT CASE
        WHEN input_text_array IS NULL THEN NULL
        ELSE ARRAY(
          SELECT to_jsonb(elem)
          FROM unnest(input_text_array) AS elem
        )
      END;
    $fn$;

    ALTER TABLE "Parts"
    ALTER COLUMN "image" TYPE JSONB[]
    USING public.__tmp_text_array_to_jsonb_array("image");

    DROP FUNCTION public.__tmp_text_array_to_jsonb_array(text[]);
  END IF;
END $$;
