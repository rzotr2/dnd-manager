
-- Створюємо таблицю профілів користувачів
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE,
  email text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Увімкнути RLS для профілів
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Політики для профілів
CREATE POLICY "Users can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Функція для автоматичного створення профілю при реєстрації
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    new.id, 
    new.raw_user_meta_data ->> 'username',
    new.email
  );
  RETURN new;
END;
$$;

-- Тригер для створення профілю
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Оновлюємо таблицю game_invitations для роботи з профілями
ALTER TABLE public.game_invitations 
ADD COLUMN invited_user_id uuid REFERENCES public.profiles(id);

-- Індекс для швидкого пошуку по email
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Індекс для запрошень
CREATE INDEX idx_game_invitations_invited_user_id ON public.game_invitations(invited_user_id);

-- Політика для перегляду запрошень
CREATE POLICY "Users can view their own invitations" 
  ON public.game_invitations 
  FOR SELECT 
  TO authenticated
  USING (invited_user_id = auth.uid());

-- Включити realtime для запрошень
ALTER TABLE public.game_invitations REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.game_invitations;

-- Включити realtime для профілів
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.profiles;
