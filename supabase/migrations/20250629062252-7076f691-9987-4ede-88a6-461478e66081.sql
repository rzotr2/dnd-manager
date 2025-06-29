
-- Add mode column to games table
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS mode TEXT NOT NULL DEFAULT 'simple';

-- Create game_members table
CREATE TABLE IF NOT EXISTS public.game_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create game_invitations table
CREATE TABLE IF NOT EXISTS public.game_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  invited_by UUID REFERENCES auth.users NOT NULL,
  invited_email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
  token TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.game_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_invitations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for game_members
CREATE POLICY "Users can view game members of their games" 
  ON public.game_members 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.games 
      WHERE games.id = game_members.game_id 
      AND games.user_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Game owners can manage members" 
  ON public.game_members 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.games 
      WHERE games.id = game_members.game_id 
      AND games.user_id = auth.uid()
    )
  );

-- Create RLS policies for game_invitations
CREATE POLICY "Users can view invitations for their games" 
  ON public.game_invitations 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.games 
      WHERE games.id = game_invitations.game_id 
      AND games.user_id = auth.uid()
    )
  );

CREATE POLICY "Game owners can manage invitations" 
  ON public.game_invitations 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.games 
      WHERE games.id = game_invitations.game_id 
      AND games.user_id = auth.uid()
    )
  );

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS game_members_user_game_unique ON public.game_members(game_id, user_id);
CREATE UNIQUE INDEX IF NOT EXISTS game_invitations_token_unique ON public.game_invitations(token);
