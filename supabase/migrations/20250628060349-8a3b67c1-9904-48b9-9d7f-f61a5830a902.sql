
-- Create games table to store game settings including themes
CREATE TABLE public.games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  theme TEXT NOT NULL DEFAULT 'theme-fantasy',
  players TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_played TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create characters table to store character data
CREATE TABLE public.characters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  photo TEXT,
  fields JSONB NOT NULL DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for games
CREATE POLICY "Users can view their own games" 
  ON public.games 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own games" 
  ON public.games 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own games" 
  ON public.games 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own games" 
  ON public.games 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for characters
CREATE POLICY "Users can view their own characters" 
  ON public.characters 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own characters" 
  ON public.characters 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own characters" 
  ON public.characters 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own characters" 
  ON public.characters 
  FOR DELETE 
  USING (auth.uid() = user_id);
