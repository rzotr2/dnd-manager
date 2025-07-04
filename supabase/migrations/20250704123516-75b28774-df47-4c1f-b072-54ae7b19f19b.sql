
-- Додаємо недостаючі колонки до game_invitations якщо їх немає
ALTER TABLE public.game_invitations 
ADD COLUMN IF NOT EXISTS invited_username TEXT;

-- Оновлюємо RLS політики для game_invitations
DROP POLICY IF EXISTS "Users can view their own invitations" ON public.game_invitations;

CREATE POLICY "Users can view their own invitations" 
ON public.game_invitations 
FOR SELECT 
USING (
  invited_user_id = auth.uid() OR 
  invited_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Політика для оновлення запрошень (прийняття/відхилення)
CREATE POLICY IF NOT EXISTS "Users can update their own invitations" 
ON public.game_invitations 
FOR UPDATE 
USING (
  invited_user_id = auth.uid() OR 
  invited_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Індекси для швидшого пошуку
CREATE INDEX IF NOT EXISTS idx_game_invitations_invited_email 
ON public.game_invitations(invited_email);

CREATE INDEX IF NOT EXISTS idx_game_invitations_invited_user_id 
ON public.game_invitations(invited_user_id);

-- Включаємо realtime для game_invitations
ALTER TABLE public.game_invitations REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_invitations;
