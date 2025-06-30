
-- Create a table for email verification codes
CREATE TABLE public.email_verification_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + '10 minutes'::interval),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  used_at TIMESTAMP WITH TIME ZONE NULL,
  attempts INTEGER NOT NULL DEFAULT 0
);

-- Add Row Level Security
ALTER TABLE public.email_verification_codes ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (needed for verification)
CREATE POLICY "Allow public access to verification codes" 
  ON public.email_verification_codes 
  FOR ALL 
  USING (true);

-- Create index for faster lookups
CREATE INDEX idx_email_verification_codes_email_code ON public.email_verification_codes(email, code);
CREATE INDEX idx_email_verification_codes_expires ON public.email_verification_codes(expires_at);

-- Create function to generate 6-digit verification code
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$;

-- Create function to clean up expired codes
CREATE OR REPLACE FUNCTION cleanup_expired_verification_codes()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.email_verification_codes 
  WHERE expires_at < now();
END;
$$;
