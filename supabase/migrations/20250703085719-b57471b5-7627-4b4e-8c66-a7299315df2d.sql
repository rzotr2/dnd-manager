
-- First, let's ensure we have proper RLS policies for invitations and add missing fields
-- Update game_invitations table to support inviting by username
ALTER TABLE public.game_invitations 
ADD COLUMN IF NOT EXISTS invited_username TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_game_invitations_invited_user_id 
ON public.game_invitations(invited_user_id);

CREATE INDEX IF NOT EXISTS idx_game_invitations_invited_email 
ON public.game_invitations(invited_email);

-- Update RLS policy to allow users to view their own invitations
DROP POLICY IF EXISTS "Users can view their own invitations" ON public.game_invitations;

CREATE POLICY "Users can view their own invitations" 
ON public.game_invitations 
FOR SELECT 
USING (
  invited_user_id = auth.uid() OR 
  invited_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND username = game_invitations.invited_username
  )
);

-- Policy to allow users to update invitation status when accepting/declining
CREATE POLICY IF NOT EXISTS "Users can update their own invitations" 
ON public.game_invitations 
FOR UPDATE 
USING (
  invited_user_id = auth.uid() OR 
  invited_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND username = game_invitations.invited_username
  )
);

-- Enable realtime for game_invitations
ALTER TABLE public.game_invitations REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_invitations;

-- Enable realtime for game_members  
ALTER TABLE public.game_members REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_members;

-- Create storage bucket for character images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('character-images', 'character-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for character images bucket
CREATE POLICY IF NOT EXISTS "Anyone can view character images"
ON storage.objects FOR SELECT
USING (bucket_id = 'character-images');

CREATE POLICY IF NOT EXISTS "Authenticated users can upload character images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'character-images' AND auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Users can update their own character images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'character-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY IF NOT EXISTS "Users can delete their own character images"
ON storage.objects FOR DELETE
USING (bucket_id = 'character-images' AND auth.uid()::text = (storage.foldername(name))[1]);
