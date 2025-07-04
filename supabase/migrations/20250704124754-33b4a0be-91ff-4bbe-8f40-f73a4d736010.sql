
-- Перевіряємо і виправляємо тригер створення профілів
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', ''),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE SET
    email = NEW.email,
    username = COALESCE(NEW.raw_user_meta_data ->> 'username', profiles.username);
  
  RETURN NEW;
END;
$$;

-- Створюємо тригер заново
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Заповнюємо профілі для існуючих користувачів, які можуть не мати профілів
INSERT INTO public.profiles (id, email, username)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data ->> 'username', '')
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
