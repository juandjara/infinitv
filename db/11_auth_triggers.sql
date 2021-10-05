-- TRIGGER ON INSERT
-- 1. inserts a row into public.users
CREATE OR REPLACE FUNCTION public.handle_new_user ()
  RETURNS TRIGGER
  AS $$
BEGIN
  INSERT INTO public.users (id, email, name, ROLE)
    VALUES (NEW.id, md5(NEW.email), (regexp_split_to_array(NEW.email, '@'))[1], NEW.role)
  ON CONFLICT
    DO NOTHING;
  RETURN NEW;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

-- 2. trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user ();

-- TRIGGER ON UPDATE
-- 1. updates public.users with last sign in time info
CREATE OR REPLACE FUNCTION public.handle_user_update ()
  RETURNS TRIGGER
  AS $$
BEGIN
  UPDATE
    public.users
  SET
    last_sign_in_at = NEW.last_sign_in_at,
    email = md5(NEW.email),
    ROLE = NEW.role
  WHERE
    id = NEW.id;
  RETURN NEW;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

-- 2. triggers the function every time auth.users is updated
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

CREATE TRIGGER on_auth_user_updated
  BEFORE UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_user_update ();

-- TRIGGER ON DELETE
-- 1. deletes a row from public.users
CREATE OR REPLACE FUNCTION public.handle_delete_user ()
  RETURNS TRIGGER
  AS $$
BEGIN
  DELETE FROM public.users
  WHERE OLD.id = id;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

-- 2. trigger the function every time a user is deleted
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;

CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_delete_user ();

