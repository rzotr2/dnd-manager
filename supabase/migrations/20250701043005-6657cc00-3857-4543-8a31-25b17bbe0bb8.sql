
-- Remove the email verification codes table and related functions
DROP TABLE IF EXISTS public.email_verification_codes CASCADE;
DROP FUNCTION IF EXISTS public.generate_verification_code() CASCADE;
DROP FUNCTION IF EXISTS public.cleanup_expired_verification_codes() CASCADE;
