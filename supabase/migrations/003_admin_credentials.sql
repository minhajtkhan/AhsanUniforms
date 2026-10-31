-- ============================================================================
-- AHSAN SHOP — ADMIN CREDENTIALS MIGRATION (003_admin_credentials.sql)
-- Fixes GoTrue NULL column errors and provisions ahsanmukhtiar@gmail.com
-- Sets phone, profile avatar_url, and created_by = 'Minhaj Tahir'
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Ensure created_by can store text names like 'Minhaj Tahir'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_created_by_fkey;
ALTER TABLE public.profiles ALTER COLUMN created_by TYPE TEXT;

-- 2. Fix handle_new_user trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, phone, avatar_url, created_by, is_active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'owner'::public.user_role,
    '03087350410',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80',
    'Minhaj Tahir',
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name  = EXCLUDED.full_name,
    role       = EXCLUDED.role,
    phone      = EXCLUDED.phone,
    avatar_url = EXCLUDED.avatar_url,
    created_by = EXCLUDED.created_by,
    is_active  = true;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Re-attach trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Clean up any existing NULL tokens in auth.users to resolve GoTrue 500 scan error
UPDATE auth.users
SET
  confirmation_token         = COALESCE(confirmation_token, ''),
  recovery_token             = COALESCE(recovery_token, ''),
  email_change_token_new     = COALESCE(email_change_token_new, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  email_change               = COALESCE(email_change, ''),
  phone_change               = COALESCE(phone_change, ''),
  phone_change_token         = COALESCE(phone_change_token, ''),
  reauthentication_token     = COALESCE(reauthentication_token, '');

-- 4. Delete previous incomplete record if present
DELETE FROM auth.users WHERE email = 'ahsanmukhtiar@gmail.com';

-- 5. Insert complete record with all required non-NULL token fields
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change_token_current,
  email_change,
  phone_change,
  phone_change_token,
  reauthentication_token,
  is_super_admin,
  is_sso_user
) VALUES (
  'a1111111-2222-3333-4444-555555555555',
  '00000000-0000-0000-0000-000000000000',
  'ahsanmukhtiar@gmail.com',
  crypt('ahsan12345', gen_salt('bf', 10)),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Ahsan Mukhtiar","role":"owner"}'::jsonb,
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  false,
  false
);

-- 6. Insert/Update public profile for Ahsan Mukhtiar with phone, avatar_url, and created_by
INSERT INTO public.profiles (
  id,
  full_name,
  email,
  phone,
  avatar_url,
  created_by,
  role,
  is_active,
  created_at,
  updated_at
) VALUES (
  'a1111111-2222-3333-4444-555555555555',
  'Ahsan Mukhtiar',
  'ahsanmukhtiar@gmail.com',
  '03087350410',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80',
  'Minhaj Tahir',
  'owner',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  full_name  = 'Ahsan Mukhtiar',
  email      = 'ahsanmukhtiar@gmail.com',
  phone      = '03087350410',
  avatar_url = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80',
  created_by = 'Minhaj Tahir',
  role       = 'owner',
  is_active  = true;
